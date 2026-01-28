
import { GoogleGenAI, Type } from "@google/genai";
import { CaptionStyle } from "../types";

const API_KEY = process.env.API_KEY || "";

export interface GenerationResult {
  captions: string[];
  hashtags: string[];
}

export const generateCaptions = async (
  topic: string, 
  style: CaptionStyle, 
  includeHashtags: boolean
): Promise<GenerationResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is set.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are a world-class social media strategist and creative copywriter specializing in Instagram.
    Your task is to generate 3 distinct, unique, and high-engagement Instagram captions based on a provided topic and style.
    ${includeHashtags ? 'Additionally, provide a list of 5-10 relevant trending hashtags.' : ''}
    
    Guidelines:
    - Each caption should be unique in structure and tone within the requested style.
    - Keep them short and catchy (5-25 words).
    - Use relevant emojis.
    - If hashtags are requested, return them as a separate array of strings without the '#' symbol (or with it, as long as it's consistent).
  `;

  const prompt = `Topic: "${topic}"\nStyle: "${style}"\nInclude Hashtags: ${includeHashtags}\n\nPlease provide exactly 3 unique captions${includeHashtags ? ' and a list of hashtags' : ''}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of 3 unique Instagram captions."
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of relevant hashtags."
            }
          },
          required: includeHashtags ? ["captions", "hashtags"] : ["captions"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      captions: result.captions || [],
      hashtags: result.hashtags || []
    };
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("The AI is a bit busy right now. Please try again in a moment!");
  }
};
