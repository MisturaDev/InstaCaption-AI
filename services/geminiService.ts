
import { GoogleGenAI, Type } from "@google/genai";
import { CaptionStyle } from "../types";

const API_KEY = process.env.API_KEY || "";

export const generateCaption = async (topic: string, style: CaptionStyle): Promise<string> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are a world-class social media strategist and creative copywriter specializing in Instagram.
    Your task is to generate one distinct, high-engagement Instagram caption based on a provided topic and style.
    
    Guidelines:
    - Keep it short and catchy (5-25 words).
    - Use relevant emojis.
    - If the style is 'Funny', use humor, irony, or relatable wit.
    - If the style is 'Professional', focus on value, authority, and clear language.
    - If the style is 'Casual', use conversational and friendly tone.
    - If the style is 'Punny', use wordplay related to the topic.
    - If the style is 'Minimalist', keep it under 10 words.
    - If the style is 'Inspirational', focus on motivation and growth.
  `;

  const prompt = `Topic: "${topic}"\nStyle: "${style}"\n\nPlease provide exactly 1 caption.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            caption: {
              type: Type.STRING,
              description: "The generated Instagram caption."
            }
          },
          required: ["caption"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return result.caption || "";
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
