
import { GoogleGenAI, Type } from "@google/genai";
import { CaptionStyle, Language } from "../types";

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY || "";

export interface GenerationResult {
  captions: string[];
  hashtags: string[];
}

export const generateCaptions = async (
  topic: string, 
  style: CaptionStyle, 
  includeHashtags: boolean,
  language: Language = Language.ENGLISH
): Promise<GenerationResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please ensure GEMINI_API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  const systemInstruction = `
    You are a world-class social media strategist and creative copywriter specializing in Instagram.
    Your task is to generate 3 distinct, unique, and high-engagement Instagram captions based on a provided topic and style.
    
    CRITICAL MULTI-LANGUAGE INSTRUCTION:
    - All generated captions MUST be written natively and fluently in the ${language} language.
    - Adapt idioms, humor, wordplay, and tone appropriately for native ${language} speakers rather than using literal translation.
    ${includeHashtags ? `- Additionally, provide 5-10 relevant trending hashtags in ${language} (or popular international tags used by the ${language}-speaking community) relevant to the topic.` : ''}
    
    Style Guidelines:
    - Style: ${style} (match the tone and nuance of this style faithfully).
    - Length: Keep each caption punchy, short, and catchy (5-25 words).
    - Formatting: Include relevant aesthetic emojis.
    - If hashtags are requested, return them as a separate array of clean strings without the '#' symbol.
  `;

  const prompt = `Topic: "${topic}"\nDesired Style: "${style}"\nLanguage: "${language}"\nInclude Hashtags: ${includeHashtags}\n\nPlease generate exactly 3 unique, top-tier Instagram captions in ${language}${includeHashtags ? ' along with trending hashtags' : ''}.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
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
  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    if (error?.message?.includes("API_KEY")) {
      throw error;
    }
    throw new Error("Unable to generate captions right now. Please try again in a moment!");
  }
};