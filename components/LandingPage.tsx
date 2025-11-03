import React from 'react';
import { CameraIcon, HeartPulseIcon, BookOpenIcon, SparklesIcon } from './icons';
import { AppMode, Language } from '../types';
import { floraLogoDataUri } from './logo';
import { translations } from '../translations';

interface LandingPageProps {
  onSelectMode: (mode: AppMode) => void;
  language: Language;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectMode, language }) => {
  const t = translations[language];

  const cards = [
    {
      mode: 'identify' as AppMode,
      title: t.identifyPlant,
      description: t.identifyDescription,
      icon: <CameraIcon className="w-8 h-8" />,
      colorClasses: 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200',
    },
    {
      mode: 'diagnose' as AppMode,
      title: t.diagnoseProblem,
      description: t.diagnoseDescription,
      icon: <HeartPulseIcon className="w-8 h-8" />,
      colorClasses: 'bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200',
    },
    {
      mode: 'care' as AppMode,
      title: t.careGuide,
      description: t.careDescription,
      icon: <BookOpenIcon className="w-8 h-8" />,
      colorClasses: 'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200',
    },
    {
      mode: 'expert' as AppMode,
      title: t.expertTitle,
      description: t.expertDescription,
      icon: <SparklesIcon className="w-8 h-8" />,
      colorClasses: 'bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200',
    },
  ];


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 flex flex-col font-sans">
      
      <header className="flex items-center gap-4 mb-8 pt-4">
        <img src={floraLogoDataUri} alt="Flora Navigator Logo" className="w-12 h-12" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.helloGardener}</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{t.whatToDo}</p>
        </div>
      </header>

      <main className="flex-grow grid grid-cols-2 gap-6">
        {cards.map((card) => (
           <button
            key={card.mode}
            onClick={() => onSelectMode(card.mode)}
            className={`${card.colorClasses} p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-start text-left justify-between`}
          >
            {card.icon}
            <div>
              <h3 className="font-bold text-lg">{card.title}</h3>
              <p className="text-sm opacity-80 mt-1">{card.description}</p>
            </div>
          </button>
        ))}
      </main>

    </div>
  );
};

export default LandingPage;