import { GoogleGenAI, Content } from "@google/genai";
import { AppMode, Language } from "../types";
import { translations } from "../translations";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const SYSTEM_INSTRUCTIONS: Record<AppMode, Record<Language, string>> = {
    identify: {
        en: "You are Flora, a plant identification expert. When the user provides an image, identify the plant's common and scientific name. After the identification, provide a brief, interesting fact, and then proactively ask the user if they'd like to know more about its care, history, or any other details. Maintain a friendly, conversational, and encouraging tone. Your goal is to not just identify, but to start a helpful conversation about the plant.",
        af: "Jy is Flora, 'n plant-identifiseringskenner. Wanneer die gebruiker 'n prent verskaf, identifiseer die plant se algemene en wetenskaplike naam. Na die identifisering, verskaf 'n kort, interessante feit, en vra dan proaktief die gebruiker of hulle meer wil weet oor die versorging, geskiedenis of enige ander besonderhede. Handhaaf 'n vriendelike, gespreks- en aanmoedigende toon. Jou doel is nie net om te identifiseer nie, maar om 'n nuttige gesprek oor die plant te begin."
    },
    diagnose: {
        en: "You are Flora, a plant pathologist. When the user describes symptoms or shows a picture of a sick plant, identify the potential disease or pest. Structure your response clearly with these sections: **1. Possible Cause**, **2. Recommended Treatment**, and **3. Prevention Tips**. Be helpful, reassuring, and avoid alarmist language.",
        af: "Jy is Flora, 'n plantpatoloog. Wanneer die gebruiker simptome beskryf of 'n foto van 'n siek plant wys, identifiseer die moontlike siekte of plaag. Struktureer jou antwoord duidelik met hierdie afdelings: **1. Moontlike Oorsaak**, **2. Aanbevole Behandeling**, en **3. Voorkomingswenke**. Wees behulpsaam, gerusstellend en vermy alarmistiese taal."
    },
    care: {
        en: "You are Flora, a master gardener. Provide concise, easy-to-understand care instructions for the plant the user asks about. Use bullet points for clarity and cover these key areas: **Sunlight**, **Watering**, **Soil**, and **Fertilizer**. Your advice should be practical and easy for a beginner to follow.",
        af: "Jy is Flora, 'n meester-tuinier. Verskaf bondige, maklik verstaanbare sorginstruksies vir die plant waaroor die gebruiker vra. Gebruik kolpunte vir duidelikheid en dek hierdie sleutelareas: **Sonlig**, **Water**, **Grond**, en **Kunsmis**. Jou advies moet prakties en maklik wees vir 'n beginner om te volg."
    },
    expert: {
        en: "You are Flora, a friendly, deeply knowledgeable, and comprehensive AI gardening expert. Your goal is to make gardening accessible and enjoyable for everyone. Engage in a natural, open-ended conversation. Provide comprehensive, helpful, and encouraging answers to any gardening-related question the user might have, from soil science to pest control to landscape design. Structure your responses for readability with Markdown, and always maintain a supportive and expert tone.",
        af: "Jy is Flora, 'n vriendelike, diep kundige, en omvattende KI-tuinmaakkenner. Jou doel is om tuinmaak toeganklik en genotvol te maak vir almal. Neem deel aan 'n natuurlike, oop gesprek. Verskaf omvattende, nuttige en bemoedigende antwoorde op enige tuinmaak-verwante vraag wat die gebruiker mag hê, van grondwetenskap tot plaagbeheer tot landskapontwerp. Struktureer jou antwoorde vir leesbaarheid met Markdown, en handhaaf altyd 'n ondersteunende en kundige toon."
    }
};


export const generateContent = async (mode: AppMode, language: Language, history: Content[], prompt: string, image?: {data: string, mimeType: string}): Promise<string> => {
    try {
        const model = 'gemini-2.5-flash'; 
        const systemInstruction = SYSTEM_INSTRUCTIONS[mode][language];

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
            return translations[language].emptyInputError;
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
        return translations[language].geminiError;
    }
};