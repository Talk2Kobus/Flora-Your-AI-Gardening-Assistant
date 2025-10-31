import React, { useState, useRef } from 'react';
import type { ImageFile } from '../types';
import { PaperclipIcon, PaperPlaneIcon, CameraIcon } from './icons';
import CameraCapture from './CameraCapture';

interface InputBarProps {
  onSendMessage: (text: string, image?: ImageFile) => void;
  isLoading: boolean;
}

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

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    if (file) {
       try {
        const { base64, mimeType } = await fileToBase64(file);
        setImageFile({ base64, mimeType, name: file.name });
        // Clean up previous image preview if it exists
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(URL.createObjectURL(file));
      } catch (error) {
        console.error("Error processing file:", error);
      }
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleCapture = (file: File) => {
    processFile(file);
    setIsCameraOpen(false);
  };

  const handleSend = () => {
    if (isLoading || (!text.trim() && !imageFile)) return;
    const prompt = text.trim() || (imageFile ? "What plant is this and how do I care for it?" : "");
    onSendMessage(prompt, imageFile || undefined);
    setText('');
    removeImage();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <>
      {isCameraOpen && <CameraCapture onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      <div className="bg-white/80 backdrop-blur-sm border-t border-green-200/50 p-4">
        <div className="max-w-4xl mx-auto">
          {imagePreview && (
            <div className="relative inline-block mb-2">
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded-lg" />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 bg-gray-700 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold hover:bg-red-500 transition-colors"
                aria-label="Remove image"
                title="Remove image"
              >
                &times;
              </button>
            </div>
          )}
          <div className="relative flex items-center bg-gray-100 border-2 border-transparent focus-within:border-green-500 transition-colors rounded-xl">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your plant..."
              className="w-full bg-transparent p-3 pl-24 pr-20 resize-none border-none focus:ring-0 text-gray-800 placeholder-gray-500"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute left-3 flex items-center space-x-2">
              <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Attach image from gallery"
                  title="Attach image from gallery"
              >
                  <PaperclipIcon className="w-6 h-6" />
              </button>
              <button
                  onClick={() => setIsCameraOpen(true)}
                  className="text-gray-500 hover:text-green-600 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  aria-label="Use camera to take a photo"
                  title="Use camera to take a photo"
              >
                  <CameraIcon className="w-6 h-6" />
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || (!text.trim() && !imageFile)}
              className="absolute right-3 bg-green-500 text-white rounded-lg p-2 hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed"
              aria-label="Send message"
              title="Send message"
            >
              <PaperPlaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InputBar;