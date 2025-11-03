import React from 'react';
import { HomeIcon, SparklesIcon, HeartPulseIcon, BookOpenIcon, CameraIcon } from './icons';
import { AppMode } from '../types';

interface NavigationBarProps {
  activeMode: AppMode;
  onNavigate: (modeOrView: AppMode | 'landing') => void;
}

const activeColorMap: Record<AppMode, string> = {
    identify: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    diagnose: 'bg-teal-100 dark:bg-teal-900 text-teal-600 dark:text-teal-300',
    care: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
};

const NavigationBar: React.FC<NavigationBarProps> = ({ activeMode, onNavigate }) => {
  const navItems = [
    { mode: 'landing', label: 'Home', icon: HomeIcon },
    { mode: 'identify', label: 'Identify', icon: CameraIcon },
    { mode: 'diagnose', label: 'Diagnose', icon: HeartPulseIcon },
    { mode: 'care', label: 'Care', icon: BookOpenIcon },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 p-2 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
      {navItems.map((item) => {
        const isActive = activeMode === item.mode;
        const activeClasses = isActive && item.mode !== 'landing' 
            ? activeColorMap[item.mode as AppMode] 
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700';

        return (
          <button
            key={item.mode}
            onClick={() => onNavigate(item.mode as AppMode | 'landing')}
            className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${activeClasses}`}
            aria-label={item.label}
          >
            <item.icon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default NavigationBar;