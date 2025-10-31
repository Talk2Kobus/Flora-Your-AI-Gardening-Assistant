import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { LeafIcon } from './icons';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
}

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
          <LeafIcon className="w-5 h-5" />
        </div>
      )}
      <div className={`max-w-md md:max-w-lg rounded-xl px-4 py-3 shadow-sm ${isUser ? 'bg-green-100 text-gray-800' : 'bg-white text-gray-700'}`}>
        {message.image && (
          <img
            src={message.image}
            alt="User upload"
            className="rounded-lg mb-2 max-h-64"
          />
        )}
        <MarkdownRenderer content={message.text} />
      </div>
    </div>
  );
};

const TypingIndicator: React.FC = () => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white">
      <LeafIcon className="w-5 h-5" />
    </div>
    <div className="max-w-md md:max-w-lg rounded-xl px-4 py-3 bg-white shadow-sm flex items-center space-x-1">
        <span className="text-gray-500">Flora is typing</span>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
};

export default ChatWindow;
