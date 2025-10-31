import React, { useState, useEffect, useRef } from 'react';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { analyzeGardeningQuery } from './services/geminiService';
import type { Message, ImageFile } from './types';
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

    try {
      const botResponseText = await analyzeGardeningQuery(text, imageToSend ?? undefined);
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
    <div ref={appRef} className="h-screen w-screen flex flex-col font-sans bg-green-50/50 relative">
      {isDragging && <DropzoneOverlay />}
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-200/50 p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
            <LeafIcon className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800 tracking-tight">Flora</h1>
            <span className="text-sm text-gray-500 mt-1">AI Gardening Assistant</span>
        </div>
      </header>
      <ChatWindow messages={messages} isLoading={isLoading} />
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