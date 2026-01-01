
import { GoogleGenAI, Type } from "@google/genai";
import { SectionName } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateNewPromptValues = async (category: SectionName): Promise<string[]> => {
  try {
    const prompt = `You are an AI assistant for creative art generation. Generate 5 new, unique, and imaginative values for the art prompt category: '${category}'. The values should be concise phrases and highly creative. Return the result as a JSON array of strings. For example, for the category 'Lighting', you might return: ["Eldritch glow", "Subsurface scattering", "Anamorphic lens flare", "Bioluminescent mist", "Golden hour haze"]`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
    });

    const jsonString = response.text;
    const newValues = JSON.parse(jsonString);

    if (Array.isArray(newValues) && newValues.every(item => typeof item === 'string')) {
      return newValues;
    } else {
      throw new Error("Invalid format received from Gemini API.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Return some creative fallback values on error
    return [
        "Galactic Nebula Clouds",
        "Steampunk Automaton",
        "Art Deco Metropolis",
        "Iridescent Exoskeleton",
        "Whispering Shadow Forest"
    ];
  }
};
