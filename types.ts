// Defines the structure for a chat message.
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  image?: string; // base64 data URI for display
}

// Defines the structure for an image file being uploaded.
export interface ImageFile {
  file: File;
  preview: string; // object URL for preview
}

// Defines the application modes for different tasks.
export type AppMode = 'identify' | 'diagnose' | 'care';