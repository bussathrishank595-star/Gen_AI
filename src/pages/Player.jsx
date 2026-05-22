import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, Pause, SkipBack, SkipForward, Volume2, ArrowLeft, FileText } from 'lucide-react';

export default function Player() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('corp_train_courses');
    if (saved) {
      const courses = JSON.parse(saved);
      const found = courses.find(c => c.id === id);
      if (found) {
        setCourse(found);
      }
    }
    
    // Cleanup speech on unmount
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, [id]);

  useEffect(() => {
    if (course && isPlaying) {
      window.speechSynthesis.cancel();
      playAudio(currentChapter);
    }
  }, [currentChapter, course]);

  const playAudio = (chapterIndex) => {
    window.speechSynthesis.cancel(); // Stop any current speech
    
    if (!course || !course.chapters[chapterIndex]) return;
    
    // A small timeout after cancel() is strictly required in many browsers to prevent the engine from ignoring the next speak() call.
    setTimeout(() => {
      // Prioritize explanation over straight text, so the TTS agent sounds conversational
      const textToSpeak = course.chapters[chapterIndex].explanation || course.chapters[chapterIndex].text;
      const textForProgress = course.chapters[chapterIndex].text;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      
      // Store in window to prevent aggressive Chrome garbage collection bug
      window.currentUtterance = utterance;
      utteranceRef.current = utterance;
      
      const voices = window.speechSynthesis.getVoices();
      
      // Look for high-quality female voices (Samantha/Victoria on Mac, Google Female on Chrome)
      const femaleVoice = voices.find(v => 
        (v.name.includes('Google') && v.name.includes('Female')) || 
        v.name === 'Samantha' || 
        v.name === 'Victoria' || 
        v.name === 'Karen' ||
        v.name === 'Tessa' ||
        v.name.includes('Female')
      );
      
      const defaultVoice = voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB');
      
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      } else if (defaultVoice) {
        utterance.voice = defaultVoice;
      }
      
      utterance.rate = 0.95;
      
      utterance.onboundary = (e) => {
        if (e.name === 'word') {
          const percent = (e.charIndex / textToSpeak.length) * 100;
          setProgress(percent);
        }
      };

      utterance.onend = () => {
        setProgress(100);
        if (chapterIndex < course.chapters.length - 1) {
          setTimeout(() => {
            setCurrentChapter(prev => prev + 1);
            setProgress(0);
          }, 1000);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = (e) => {
        console.error("SpeechSynthesis Error:", e);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const togglePlay = () => {
    if (!isPlaying) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      } else if (!window.speechSynthesis.speaking) {
        playAudio(currentChapter);
      }
      setIsPlaying(true);
    } else {
      window.speechSynthesis.pause();
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    if (course && currentChapter < course.chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
      setProgress(0);
    }
  };

  const handlePrev = () => {
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
      setProgress(0);
    }
  };

  if (!course) {
    return <div className="text-center py-20 text-xl font-medium animate-pulse">Loading module...</div>;
  }

  const chapter = course.chapters[currentChapter];

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-6 transition-colors">
        <ArrowLeft size={20} />
        <span>Back to Dashboard</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Visualizer */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl overflow-hidden shadow-2xl relative aspect-[4/3] group">
            <img 
              key={chapter.imageUrl}
              src={chapter.imageUrl} 
              alt={chapter.title}
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 animate-in fade-in duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 right-6">
              <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block shadow-lg">
                Chapter {currentChapter + 1} of {course.chapters.length}
              </span>
              <h2 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-md">
                {chapter.title}
              </h2>
            </div>
          </div>

          {/* Audio Controls */}
          <div className="glass-card rounded-2xl p-6 shadow-xl border-t border-white/50 dark:border-white/10">
            {/* Progress Bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mb-6 overflow-hidden">
              <div 
                className="bg-brand-500 h-full transition-all duration-300 ease-linear rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/30 to-transparent"></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button className="text-slate-400 hover:text-brand-500 transition-colors">
                <Volume2 size={24} />
              </button>
              
              <div className="flex items-center gap-6">
                <button 
                  onClick={handlePrev}
                  disabled={currentChapter === 0}
                  className="p-2 rounded-full text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                >
                  <SkipBack size={28} />
                </button>
                
                <button 
                  onClick={togglePlay}
                  className="w-16 h-16 flex items-center justify-center bg-brand-600 text-white rounded-full hover:bg-brand-500 shadow-lg shadow-brand-500/40 hover:scale-105 transition-all"
                >
                  {isPlaying ? <Pause size={32} /> : <Play size={32} className="ml-1" />}
                </button>

                <button 
                  onClick={handleNext}
                  disabled={currentChapter === course.chapters.length - 1}
                  className="p-2 rounded-full text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400 disabled:opacity-30 disabled:hover:text-slate-600 transition-colors"
                >
                  <SkipForward size={28} />
                </button>
              </div>
              
              <div className="w-6"></div> {/* Spacer for alignment */}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Transcript */}
        <div className="glass-card rounded-3xl p-8 shadow-xl flex flex-col h-full max-h-[calc(100vh-8rem)]">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <FileText className="text-brand-500" />
              Live Transcript
            </h3>
            <span className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
              {course.title}
            </span>
          </div>
          
          <div className="overflow-y-auto flex-grow pr-4 space-y-6">
            {course.chapters.map((chap, idx) => (
              <div 
                key={idx}
                className={`transition-all duration-500 ${
                  idx === currentChapter 
                    ? 'opacity-100 scale-100' 
                    : idx < currentChapter 
                      ? 'opacity-40 scale-95' 
                      : 'opacity-30 scale-95 blur-[1px]'
                }`}
              >
                <h4 className={`text-sm font-bold mb-2 ${idx === currentChapter ? 'text-brand-600 dark:text-brand-400' : 'text-slate-400'}`}>
                  {idx + 1}. {chap.title}
                </h4>
                <p className={`text-lg leading-relaxed ${idx === currentChapter ? 'text-slate-800 dark:text-slate-100 font-medium' : 'text-slate-500 dark:text-slate-500'}`}>
                  {chap.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
