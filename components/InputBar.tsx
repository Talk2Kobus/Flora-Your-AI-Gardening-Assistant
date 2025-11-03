import React, { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import { PaperPlaneIcon, PaperclipIcon, CameraIcon } from './icons';
import { ImageFile, AppMode } from '../types';
import CameraCapture from './CameraCapture';

interface InputBarProps {
  onSendMessage: (inputText: string, imageFile: ImageFile | null) => void;
  isLoading: boolean;
  mode: AppMode;
  focusRingColor: string;
  sendButtonColor: string;
}

export interface InputBarRef {
  triggerFileInput: () => void;
}

const placeholderMap: Record<AppMode, string> = {
    identify: 'Upload a photo to identify a plant...',
    diagnose: 'Describe symptoms or add a photo...',
    care: 'Ask for care tips for your plant...',
};

const InputBar = forwardRef<InputBarRef, InputBarProps>(({ onSendMessage, isLoading, mode, focusRingColor, sendButtonColor }, ref) => {
  const [inputText, setInputText] = useState('');
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useImperativeHandle(ref, () => ({
    triggerFileInput: () => {
      fileInputRef.current?.click();
    },
  }));

  const handleSend = () => {
    if (isLoading || (!inputText.trim() && !imageFile)) return;
    onSendMessage(inputText, imageFile);
    setInputText('');
    setImageFile(null);
    if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile({
        file,
        preview: URL.createObjectURL(file),
      });
      // Reset file input value to allow selecting the same file again
      event.target.value = '';
    }
  };

  const handleCameraCapture = (file: File) => {
    setImageFile({
      file,
      preview: URL.createObjectURL(file),
    });
    setIsCameraOpen(false);
  };
  
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <>
      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        {imageFile && (
          <div className="relative w-24 h-24 mb-2">
            <img src={imageFile.preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
            <button
              onClick={() => setImageFile(null)}
              className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
        )}
        <div className="relative flex items-center">
          <textarea
            ref={textAreaRef}
            value={inputText}
            onChange={handleInput}
            onKeyPress={handleKeyPress}
            placeholder={placeholderMap[mode]}
            className={`w-full p-3 pr-36 border rounded-lg focus:outline-none focus:ring-2 ${focusRingColor} dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 resize-none max-h-40`}
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-2 flex items-center">
             <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50" disabled={isLoading} aria-label="Attach file">
              <PaperclipIcon className="w-6 h-6" />
            </button>
            <button onClick={() => setIsCameraOpen(true)} className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50" disabled={isLoading} aria-label="Use camera">
              <CameraIcon className="w-6 h-6" />
            </button>
            <button onClick={handleSend} className={`p-2 ${sendButtonColor} disabled:opacity-50`} disabled={isLoading || (!inputText.trim() && !imageFile)} aria-label="Send message">
              <PaperPlaneIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      {isCameraOpen && <CameraCapture onCapture={handleCameraCapture} onClose={() => setIsCameraOpen(false)} />}
    </>
  );
});

export default InputBar;