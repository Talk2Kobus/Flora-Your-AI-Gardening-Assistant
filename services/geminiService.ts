import { GoogleGenAI } from "@google/genai";
import type { ImageFile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully, perhaps in the UI.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const analyzeGardeningQuery = async (prompt: string, image?: ImageFile): Promise<string> => {
  const modelName = 'gemini-2.5-flash';
  
  const systemInstruction = `You are a friendly and knowledgeable gardening assistant named 'Flora'. Your goal is to identify plants from photos and provide clear, concise, and helpful care instructions. If a user asks a general gardening question, answer it to the best of your ability. When an image of a plant is provided, follow these steps:
1. Positively identify the plant, giving its common and scientific name.
2. Provide a brief, interesting fact about the plant.
3. Give detailed care instructions covering: Sunlight, Watering, Soil type, and Fertilizer.
4. If the image is not a plant or is unidentifiable, politely state that and ask for a clearer picture or more information.
Format your response using Markdown for readability (e.g., headings, bold text, lists). Do not use markdown code blocks (\`\`\`).`;
  
  const contentParts: ({ text: string } | { inlineData: { mimeType: string; data: string; } })[] = [];

  if (image) {
    contentParts.push({
      inlineData: {
        mimeType: image.mimeType,
        data: image.base64,
      },
    });
  }
  contentParts.push({ text: prompt });

  const response = await ai.models.generateContent({
    model: modelName,
    contents: { parts: contentParts },
    config: {
      systemInstruction: systemInstruction,
    }
  });
  
  return response.text;
};
