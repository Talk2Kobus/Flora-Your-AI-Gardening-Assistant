import React from 'react';
import { HomeIcon, CameraIcon, HeartPulseIcon, BookOpenIcon, GlobeIcon, SparklesIcon } from './icons';
import { AppMode, Language } from '../types';
import { translations } from '../translations';

interface NavigationBarProps {
  activeMode: AppMode;
  onNavigate: (modeOrView: AppMode | 'landing') => void;
  language: Language;
  onToggleLanguage: () => void;
  isTranslating?: boolean;
}

const activeColorMap: Record<AppMode, string> = {
    identify: 'bg-blue-100 text-blue-600',
    diagnose: 'bg-teal-100 text-teal-600',
    care: 'bg-green-100 text-green-600',
    expert: 'bg-purple-100 text-purple-600',
};

const NavigationBar: React.FC<NavigationBarProps> = ({ activeMode, onNavigate, language, onToggleLanguage, isTranslating }) => {
  const t = translations[language];
  const navItems = [
    { mode: 'landing', label: t.navHome, icon: HomeIcon },
    { mode: 'identify', label: t.navIdentify, icon: CameraIcon },
    { mode: 'diagnose', label: t.navDiagnose, icon: HeartPulseIcon },
    { mode: 'care', label: t.navCare, icon: BookOpenIcon },
    { mode: 'expert', label: t.navExpert, icon: SparklesIcon },
  ];

  return (
    <div className="grid grid-cols-6 gap-2 p-2 bg-white border-t border-gray-200">
      {navItems.map((item) => {
        const isActive = activeMode === item.mode;
        const activeClasses = isActive && item.mode !== 'landing' 
            ? activeColorMap[item.mode as AppMode] 
            : 'text-gray-600 hover:bg-gray-100';

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
       <button
        key="language"
        onClick={onToggleLanguage}
        disabled={isTranslating}
        className="flex flex-col items-center justify-center p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Toggle language"
      >
        {isTranslating ? (
          <>
            <div className="w-6 h-6 mb-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
            </div>
            <span className="text-xs font-medium">{t.translating}</span>
          </>
        ) : (
          <>
            <GlobeIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">{language.toUpperCase()}</span>
          </>
        )}
      </button>
    </div>
  );
};

export default NavigationBar;