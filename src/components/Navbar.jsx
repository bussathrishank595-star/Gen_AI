import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookHeadphones, Moon, Sun, Sparkles } from 'lucide-react';

export default function Navbar({ isDarkMode, toggleTheme }) {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 glass border-b shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-brand-500 text-white p-2 rounded-xl group-hover:scale-105 transition-transform">
            <BookHeadphones size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400">
            CorpTrain AI
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-400'}`}
          >
            Dashboard
          </Link>
          
          <Link 
            to="/create"
            className="flex items-center gap-1 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-lg shadow-brand-500/30"
          >
            <Sparkles size={16} />
            <span>Generate Course</span>
          </Link>

          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
}
