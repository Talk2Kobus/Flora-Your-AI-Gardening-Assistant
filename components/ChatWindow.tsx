import React, { useEffect, useRef } from 'react';
import type { Message } from '../types';
import MarkdownRenderer from './MarkdownRenderer';
import { TranslateIcon } from './icons';
import { floraLogoDataUri } from './logo';

interface ChatWindowProps {
  messages: Message[];
  isLoading: boolean;
  onToggleTranslation: (messageId: string) => void;
  translatedMessageIds: Set<string>;
  translatingMessageId: string | null;
}

interface ChatMessageProps {
  message: Message;
  isTranslated: boolean;
  isTranslating: boolean;
  onToggleTranslation: (messageId: string) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTranslated, isTranslating, onToggleTranslation }) => {
  const isUser = message.sender === 'user';
  // Don't show the translate button for user messages or the initial greeting message.
  const canBeTranslated = message.sender === 'bot' && message.id !== 'initial';

  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : ''}`}>
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-md overflow-hidden bg-white flex items-center justify-center shadow-sm">
            <img src={floraLogoDataUri} alt="Flora avatar" className="h-full" />
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
          <MarkdownRenderer content={isTranslated && message.translation ? message.translation : message.text} />
        </div>
      </div>
      {canBeTranslated && (
        <div className="pl-11 mt-2">
          <button 
            onClick={() => onToggleTranslation(message.id)} 
            disabled={isTranslating}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-800 rounded-full text-xs font-semibold disabled:opacity-50 disabled:cursor-wait transition-colors"
            aria-label={isTranslated ? "Show original text" : "Translate to Afrikaans"}
          >
            <TranslateIcon className="w-3.5 h-3.5" />
            <span>
              {isTranslating ? 'Translating...' : (isTranslated ? 'Show Original' : 'Translate to Afrikaans')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};


const TypingIndicator: React.FC = () => (
  <div className="flex items-start gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-md overflow-hidden bg-white flex items-center justify-center shadow-sm">
      <img src={floraLogoDataUri} alt="Flora avatar" className="h-full" />
    </div>
    <div className="max-w-md md:max-w-lg rounded-xl px-4 py-3 bg-white shadow-sm flex items-center space-x-1">
        <span className="text-gray-500">Flora is typing</span>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
  </div>
);

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading, onToggleTranslation, translatedMessageIds, translatingMessageId }) => {
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
          <ChatMessage 
            key={msg.id} 
            message={msg}
            isTranslated={translatedMessageIds.has(msg.id)}
            isTranslating={translatingMessageId === msg.id}
            onToggleTranslation={onToggleTranslation}
          />
        ))}
        {isLoading && <TypingIndicator />}
      </div>
    </div>
  );
};

export default ChatWindow;
