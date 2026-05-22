import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Clock, Calendar, Plus, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const savedCourses = localStorage.getItem('corp_train_courses');
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      // Add a default demo course if none exists
      const demoCourse = {
        id: 'demo-124',
        title: 'Cybersecurity Awareness 2026',
        description: 'Annual mandatory training covering phishing, social engineering, and safe remote work practices.',
        date: new Date().toISOString(),
        duration: '15 min',
        chapters: [
          {
            title: 'Recognizing Phishing',
            text: 'Phishing remains the most common form of cyber attack. Always check the sender address carefully and never click on unverified links. If it seems urgent, verify through another channel.',
            explanation: "Welcome to our Cybersecurity Awareness module. Let's dive right into our first topic: Phishing. Now, you might think phishing is old news, but it absolutely remains the most common way hackers break into corporate networks today. Instead of just reading the policy, I want you to really think about this: always, always check the actual sender address. Hackers are great at making emails look like they're from our CEO or HR department. If an email creates a sudden sense of panic or urgency, take a deep breath. That's a huge red flag. Never click on unverified links, and when in doubt, just ping the person on Slack to verify.",
            imageUrl: 'https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          },
          {
            title: 'Password Security',
            text: 'Use strong, unique passwords for every service. A password manager is highly recommended. Avoid using predictable patterns like sequential numbers or easily guessable personal information.',
            explanation: "Moving on to Password Security. I know, creating passwords is a pain. But reusing the same password across multiple sites is the easiest way to get compromised. The official policy is to use strong, unique passwords for every single service. To make this actually doable, the company provides a password manager, which I highly recommend setting up today. Please, avoid using your pet's name, your birth year, or sequential numbers. A password like 'Company2026!' might seem clever, but hackers try that one first.",
            imageUrl: 'https://images.unsplash.com/photo-1614064641936-a5926c63b454?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
        ]
      };
      setCourses([demoCourse]);
      localStorage.setItem('corp_train_courses', JSON.stringify([demoCourse]));
    }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Learning Modules
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Access your generated AI training audiobooks
          </p>
        </div>
        <Link 
          to="/create"
          className="flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-brand-500/30"
        >
          <Plus size={20} />
          <span>New Course</span>
        </Link>
      </header>

      {courses.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border-dashed border-2 border-slate-300 dark:border-slate-700">
          <BookOpen className="mx-auto h-12 w-12 text-slate-400 mb-4" />
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No modules generated</h3>
          <p className="mt-1 text-slate-500 dark:text-slate-400">Get started by creating your first AI training module.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="glass-card rounded-2xl overflow-hidden group hover:-translate-y-1 transition-all duration-300">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={course.chapters[0]?.imageUrl || 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="font-bold text-xl line-clamp-2">{course.title}</h3>
                </div>
              </div>
              
              <div className="p-5">
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 h-10">
                  {course.description}
                </p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-6">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{new Date(course.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <Link 
                  to={`/player/${course.id}`}
                  className="flex items-center justify-center gap-2 w-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 dark:hover:bg-brand-900/30 text-brand-600 dark:text-brand-400 py-2.5 rounded-lg font-semibold transition-colors"
                >
                  <PlayCircle size={18} />
                  <span>Start Module</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
