import React, { useRef, useEffect } from 'react';
import { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { floraLogoDataUri } from './logo';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  userMessageColor: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, userMessageColor }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
          {message.sender === 'bot' && (
            <img src={floraLogoDataUri} alt="Bot Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
          )}
          <div className={`max-w-xl p-3 rounded-lg shadow-sm ${
            message.sender === 'user' 
              ? `${userMessageColor} text-white` 
              : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {message.image && (
                <img src={message.image} alt="user upload" className="rounded-md mb-2 max-w-xs" />
            )}
            <MarkdownRenderer content={message.text} />
            <div className="text-xs opacity-70 mt-1 text-right">
              {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-start gap-4">
          <img src={floraLogoDataUri} alt="Bot Avatar" className="w-8 h-8 rounded-full flex-shrink-0" />
          <div className="bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 max-w-xl p-3 rounded-lg flex items-center space-x-2 shadow-sm">
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-150"></div>
             <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-300"></div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatWindow;