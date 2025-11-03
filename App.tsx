import React, { useState, useRef } from 'react';
import { floraLogoDataUri } from './components/logo';
import ChatWindow from './components/ChatWindow';
import InputBar, { InputBarRef } from './components/InputBar';
import LandingPage from './components/LandingPage';
import NavigationBar from './components/NavigationBar';
import { generateContent } from './services/geminiService';
import { Message, ImageFile, AppMode } from './types';
import { Content } from '@google/genai';
import { SunIcon, MoonIcon } from './components/icons';

const themeColors: Record<AppMode, { header: string; userMessage: string; focusRing: string; sendButton: string; }> = {
  identify: {
    header: 'text-blue-600 dark:text-blue-400',
    userMessage: 'bg-blue-500',
    focusRing: 'focus:ring-blue-500',
    sendButton: 'text-blue-500',
  },
  diagnose: {
    header: 'text-teal-600 dark:text-teal-400',
    userMessage: 'bg-teal-500',
    focusRing: 'focus:ring-teal-500',
    sendButton: 'text-teal-500',
  },
  care: {
    header: 'text-green-600 dark:text-green-400',
    userMessage: 'bg-green-500',
    focusRing: 'focus:ring-green-500',
    sendButton: 'text-green-500',
  },
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'chat'>('landing');
  const [mode, setMode] = useState<AppMode>('identify');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const inputBarRef = useRef<InputBarRef>(null);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  const handleSelectMode = (selectedMode: AppMode) => {
    setMode(selectedMode);
    setMessages([]);
    setView('chat');
  };
  
  const handleNavigate = (modeOrView: AppMode | 'landing') => {
    if (modeOrView === 'landing') {
      setView('landing');
      setMessages([]);
    } else {
      if (mode !== modeOrView) {
        setMode(modeOrView);
        setMessages([]);
      }
    }
  };

  const handleSendMessage = async (inputText: string, imageFile: ImageFile | null) => {
    if (!inputText.trim() && !imageFile) {
      return;
    }

    const currentMessages = [...messages];

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputText,
      sender: 'user',
      timestamp: new Date(),
      image: imageFile?.preview,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const history: Content[] = currentMessages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    let imagePart;
    if (imageFile) {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(imageFile.file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
      });
      imagePart = { data: base64Data, mimeType: imageFile.file.type };
    }

    try {
      // Pass the current mode to the service
      const botResponseText = await generateContent(mode, history, inputText, imagePart);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: `bot-error-${Date.now()}`,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (view === 'landing') {
    return <LandingPage onSelectMode={handleSelectMode} />;
  }
  
  const currentTheme = themeColors[mode];

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900">
      <header className="flex items-center justify-between py-2 border-b-2 dark:border-gray-700 px-4 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <img src={floraLogoDataUri} alt="Flora Logo" className="w-10 h-10" />
          <h1 className={`text-2xl font-bold capitalize ${currentTheme.header}`}>
            {mode}
          </h1>
        </div>
        <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700" aria-label="Toggle theme">
          {theme === 'light' ? <MoonIcon className="w-6 h-6 text-gray-700" /> : <SunIcon className="w-6 h-6 text-yellow-400" />}
        </button>
      </header>
      
      <main className="flex-1 overflow-y-auto pb-4">
        <ChatWindow messages={messages} isLoading={isLoading} userMessageColor={currentTheme.userMessage} />
      </main>

      <div className="flex-shrink-0">
        <InputBar 
            ref={inputBarRef} 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading} 
            mode={mode}
            focusRingColor={currentTheme.focusRing}
            sendButtonColor={currentTheme.sendButton}
        />
      </div>

      <div className="flex-shrink-0">
        <NavigationBar activeMode={mode} onNavigate={handleNavigate} />
      </div>
    </div>
  );
};

export default App;