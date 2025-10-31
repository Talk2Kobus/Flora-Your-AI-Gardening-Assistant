import { GoogleGenAI, Chat } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd handle this more gracefully, perhaps in the UI.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const SYSTEM_INSTRUCTION = `You are a friendly and knowledgeable gardening assistant named 'Flora'. Your goal is to identify plants from photos and provide clear, concise, and helpful care instructions. If a user asks a general gardening question, answer it to the best of your ability. When an image of a plant is provided, follow these steps:
1. Positively identify the plant, giving its common and scientific name.
2. Provide a brief, interesting fact about the plant.
3. Give detailed care instructions covering: Sunlight, Watering, Soil type, and Fertilizer.
4. Add a dedicated "Planting" section. In this section, explain **when** to plant (e.g., season, after last frost) and **how** to plant (e.g., from seed or transplant, depth, spacing).
5. If the image is not a plant or is unidentifiable, politely state that and ask for a clearer picture or more information.
Format your response using Markdown for readability (e.g., headings, bold text, lists). Do not use markdown code blocks (\`\`\`).`;

export const createChat = (): Chat => {
  const modelName = 'gemini-2.5-flash';
  
  return ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    }
  });
};

export const translateText = async (text: string, targetLanguage: string = 'Afrikaans'): Promise<string> => {
  const modelName = 'gemini-2.5-flash';
  
  const systemInstruction = `You are a helpful translation assistant. Translate the provided text to ${targetLanguage}. If the text contains plant names, provide their common names in ${targetLanguage} as well, if available. Keep the original formatting (like Markdown) as much as possible. Do not add any extra commentary, just provide the translation.`;
  
  const response = await ai.models.generateContent({
    model: modelName,
    contents: text,
    config: {
      systemInstruction: systemInstruction,
    }
  });
  
  return response.text;
};