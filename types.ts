export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  image?: string; // base64 data URI for display
  translation?: string; // To store the translated text
}

export interface ImageFile {
  base64: string; // raw base64 string for API
  mimeType: string;
  name: string;
}
