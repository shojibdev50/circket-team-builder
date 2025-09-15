import React from 'react';
import { View } from '../App';

interface HeaderProps {
    currentView: View;
    setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
    
  const getNavButtonClasses = (viewName: View) => {
    const isActive = currentView === viewName;
    return `px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 ${
      isActive
        ? 'bg-emerald-600 text-white'
        : 'bg-transparent hover:bg-slate-700 text-slate-300'
    }`;
  };
    
  return (
    <header className="bg-slate-900/60 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            AI Cricket Team Builder
          </h1>
          <nav className="flex items-center gap-2 sm:gap-4">
              <button onClick={() => setView('home')} className={getNavButtonClasses('home')}>
                Team Builder
              </button>
              <button onClick={() => setView('manageTeams')} className={getNavButtonClasses('manageTeams')}>
                Manage Teams
              </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
