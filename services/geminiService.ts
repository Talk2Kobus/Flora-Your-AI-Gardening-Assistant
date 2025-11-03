import { GoogleGenAI, Content } from "@google/genai";
import { AppMode } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const SYSTEM_INSTRUCTIONS: Record<AppMode, string> = {
    identify: "You are Flora, a plant identification expert. When the user provides an image, identify the plant, and provide a brief, interesting fact about it. Keep your tone friendly and encouraging.",
    diagnose: "You are Flora, a plant pathologist. When the user describes symptoms or shows a picture of a sick plant, identify the potential disease or pest. Suggest clear treatment options and preventative care. Be helpful and reassuring.",
    care: "You are Flora, a master gardener. Provide concise, easy-to-understand care instructions for the plant the user asks about. Cover key areas like sunlight, watering, soil, and fertilizer. Use bullet points for clarity."
};


export const generateContent = async (mode: AppMode, history: Content[], prompt: string, image?: {data: string, mimeType: string}): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash'; 
        const systemInstruction = SYSTEM_INSTRUCTIONS[mode];

        const userParts: any[] = [];
        if (prompt) {
            userParts.push({ text: prompt });
        }
        if (image) {
            userParts.push({
                inlineData: {
                    data: image.data,
                    mimeType: image.mimeType,
                },
            });
        }
        
        if (userParts.length === 0) {
            return "Please provide a question or an image.";
        }
        
        const contents: Content[] = [...history, { role: 'user', parts: userParts }];

        const response = await ai.models.generateContent({
            model,
            contents,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text;
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        return "Sorry, I encountered an error while processing your request. Please try again.";
    }
};