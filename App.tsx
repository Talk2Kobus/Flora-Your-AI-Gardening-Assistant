import React, { useState } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { analyzeGardeningQuery } from './services/geminiService';
import type { Message, ImageFile } from './types';
import { LeafIcon } from './components/icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'initial',
      sender: 'bot',
      text: "Hello! I'm Flora, your AI gardening assistant. Upload a photo of a plant to identify it, or ask me any gardening question!",
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (text: string, image?: ImageFile) => {
    setIsLoading(true);
    setError(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      image: image ? `data:${image.mimeType};base64,${image.base64}` : undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const botResponseText = await analyzeGardeningQuery(text, image);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botResponseText,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage = "Sorry, I couldn't process your request. Please check your API key and network connection, then try again.";
      setError(errorMessage);
       const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: errorMessage,
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col font-sans bg-green-50/50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200/50 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
            <LeafIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800 tracking-tight">Flora</h1>
            <span className="text-sm text-gray-500 mt-1">AI Gardening Assistant</span>
        </div>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
      <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
