import React from 'react';
import { CameraIcon, HeartPulseIcon, BookOpenIcon } from './icons';
import { AppMode } from '../types';
import { heroImageDataUri } from './assets';
import { floraLogoDataUri } from './logo';

interface LandingPageProps {
  onSelectMode: (mode: AppMode) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-6 flex flex-col font-sans">
      
      <header className="flex items-center gap-4 mb-8 pt-4">
        <img src={floraLogoDataUri} alt="Flora Navigator Logo" className="w-12 h-12" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hello, Gardener!</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">What would you like to do today?</p>
        </div>
      </header>

      <main className="flex-grow flex flex-col gap-6">
        
        {/* Hero Card: Identify Plant */}
        <button
          onClick={() => onSelectMode('identify')}
          className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow w-full h-56 text-white text-left p-6 flex flex-col justify-end group"
          style={{ backgroundImage: `url(${heroImageDataUri})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/10 group-hover:from-black/70 transition-colors"></div>
          <div className="relative z-10">
            <CameraIcon className="w-8 h-8 mb-2" />
            <h2 className="text-2xl font-bold">Identify Plant</h2>
            <p className="text-sm font-light">Use your camera to find out what plant you have.</p>
          </div>
        </button>

        <div className="grid grid-cols-2 gap-6">

          {/* Diagnose Card */}
          <button
            onClick={() => onSelectMode('diagnose')}
            className="bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-start text-left h-44 justify-between"
          >
            <HeartPulseIcon className="w-8 h-8" />
            <div>
                <h3 className="font-bold text-lg">Diagnose Problem</h3>
                <p className="text-sm opacity-80 mt-1">Is your plant feeling sick?</p>
            </div>
          </button>

          {/* Care Card */}
          <button
            onClick={() => onSelectMode('care')}
            className="bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow flex flex-col items-start text-left h-44 justify-between"
          >
            <BookOpenIcon className="w-8 h-8" />
            <div>
                <h3 className="font-bold text-lg">Care Guide</h3>
                <p className="text-sm opacity-80 mt-1">Learn how to care for your plant.</p>
            </div>
          </button>
        </div>

      </main>

    </div>
  );
};

export default LandingPage;