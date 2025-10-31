import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { createChat, translateText } from './services/geminiService';
import type { Message, ImageFile } from './types';
import type { Chat } from '@google/genai';
import { LeafIcon } from './components/icons';

const fileToBase64 = (file: File): Promise<{ base64: string, mimeType: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve({ base64, mimeType: file.type });
    };
    reader.onerror = (error) => reject(error);
  });
};

const DropzoneOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-green-500/20 border-4 border-dashed border-green-600 rounded-lg z-50 flex items-center justify-center pointer-events-none m-4">
      <div className="text-center text-green-800 font-bold text-2xl bg-white/80 p-6 rounded-lg shadow-lg">
          <LeafIcon className="h-12 w-12 mx-auto mb-2" />
          <p>Drop your plant photo here!</p>
      </div>
  </div>
);

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

  const [isDragging, setIsDragging] = useState(false);
  const [pendingImage, setPendingImage] = useState<ImageFile | null>(null);
  const [pendingImagePreview, setPendingImagePreview] = useState<string | null>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<Chat | null>(null);

  const [translatingMessageId, setTranslatingMessageId] = useState<string | null>(null);
  const [translatedMessageIds, setTranslatedMessageIds] = useState<Set<string>>(new Set());

  // Initialize chat on component mount
  useEffect(() => {
    chatRef.current = createChat();
  }, []);

  const processFile = async (file: File) => {
      if (file && file.type.startsWith('image/')) {
          try {
              const { base64, mimeType } = await fileToBase64(file);
              setPendingImage({ base64, mimeType, name: file.name });

              if (pendingImagePreview) {
                  URL.revokeObjectURL(pendingImagePreview);
              }
              setPendingImagePreview(URL.createObjectURL(file));
          } catch (error) {
              console.error("Error processing file:", error);
              setError("Sorry, there was an error processing your image.");
          }
      } else {
          setError("Please drop a valid image file (e.g., JPG, PNG).");
      }
  };
  
  const removePendingImage = () => {
      setPendingImage(null);
      if (pendingImagePreview) {
          URL.revokeObjectURL(pendingImagePreview);
      }
      setPendingImagePreview(null);
  };
  
  useEffect(() => {
      const div = appRef.current;
      if (!div) return;

      const handleDragOver = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); };
      const handleDragEnter = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
      const handleDragLeave = (e: DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
      const handleDrop = (e: DragEvent) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
              processFile(e.dataTransfer.files[0]);
              e.dataTransfer.clearData();
          }
      };

      div.addEventListener('dragenter', handleDragEnter);
      div.addEventListener('dragleave', handleDragLeave);
      div.addEventListener('dragover', handleDragOver);
      div.addEventListener('drop', handleDrop);

      return () => {
          div.removeEventListener('dragenter', handleDragEnter);
          div.removeEventListener('dragleave', handleDragLeave);
          div.removeEventListener('dragover', handleDragOver);
          div.removeEventListener('drop', handleDrop);
      };
  }, []);

  const handleToggleTranslation = async (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    // If it's currently showing translation, toggle back to original
    if (translatedMessageIds.has(messageId)) {
      const newSet = new Set(translatedMessageIds);
      newSet.delete(messageId);
      setTranslatedMessageIds(newSet);
      return;
    }

    // If translation already exists, just toggle to show it
    if (message.translation) {
      const newSet = new Set(translatedMessageIds);
      newSet.add(messageId);
      setTranslatedMessageIds(newSet);
      return;
    }

    // If translation doesn't exist, fetch it
    setTranslatingMessageId(messageId);
    try {
      const translation = await translateText(message.text);
      setMessages(prevMessages => 
        prevMessages.map(m => 
          m.id === messageId ? { ...m, translation } : m
        )
      );
      const newSet = new Set(translatedMessageIds);
      newSet.add(messageId);
      setTranslatedMessageIds(newSet);
    } catch (err) {
      console.error("Translation error:", err);
      const errorMessage = "Sorry, I couldn't translate that message right now.";
      setError(errorMessage);
       const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: errorMessage,
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setTranslatingMessageId(null);
    }
  };


  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    setError(null);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
      image: pendingImage ? `data:${pendingImage.mimeType};base64,${pendingImage.base64}` : undefined,
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    const imageToSend = pendingImage;
    removePendingImage();

    // If a new image is being sent, reset the chat to start a new conversation context
    if (imageToSend) {
      chatRef.current = createChat();
    }

    if (!chatRef.current) {
      setError("Chat service is not initialized. Please refresh the page.");
      setIsLoading(false);
      return;
    }

    try {
      const contentParts = [];
      if (imageToSend) {
        contentParts.push({
          inlineData: {
            mimeType: imageToSend.mimeType,
            data: imageToSend.base64,
          },
        });
      }
      contentParts.push({ text });

      // FIX: The `sendMessage` method expects a `message` property containing the content parts, not a `parts` property.
      const response = await chatRef.current.sendMessage({ message: contentParts });
      const botResponseText = response.text;

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
    <div ref={appRef} className="h-screen w-screen flex flex-col font-sans bg-green-50/50 relative transition-colors duration-300">
      {isDragging && <DropzoneOverlay />}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200/50 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
                <LeafIcon className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold text-green-800 tracking-tight">Flora</h1>
                <span className="text-sm text-gray-500 mt-1">AI Gardening Assistant</span>
            </div>
        </div>
      </header>
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading} 
        onToggleTranslation={handleToggleTranslation}
        translatedMessageIds={translatedMessageIds}
        translatingMessageId={translatingMessageId}
      />
      <InputBar 
        onSendMessage={handleSendMessage} 
        isLoading={isLoading}
        imageFile={pendingImage}
        imagePreview={pendingImagePreview}
        onFileSelect={processFile}
        onImageRemove={removePendingImage}
      />
    </div>
  );
};

export default App;