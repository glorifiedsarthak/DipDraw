
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";

// Standard client for basic chat and images
const getStandardAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateText = async (prompt: string, history: any[] = []) => {
  const ai = getStandardAI();
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a helpful AI assistant. You can engage in conversation, and if the user wants to generate media, explain how to do it using commands like 'generate image of...' or 'generate video of...'. Always provide helpful, concise, and clear responses.",
    }
  });

  const response = await chat.sendMessage({ message: prompt });
  return response.text;
};

export const generateImage = async (prompt: string): Promise<string[]> => {
  const ai = getStandardAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: prompt }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  const images: string[] = [];
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
      }
    }
  }
  return images;
};

export const generateVideo = async (prompt: string, onProgress?: (msg: string) => void): Promise<string> => {
  // Veo requires user-selected API key
  const hasKey = await (window as any).aistudio.hasSelectedApiKey();
  if (!hasKey) {
    await (window as any).aistudio.openSelectKey();
    // Assuming success as per instructions
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  onProgress?.("Initializing video generation...");

  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: '16:9'
    }
  });

  while (!operation.done) {
    onProgress?.("Generating video frames... this may take a minute.");
    await new Promise(resolve => setTimeout(resolve, 8000));
    try {
      operation = await ai.operations.getVideosOperation({ operation: operation });
    } catch (err: any) {
      if (err.message?.includes("Requested entity was not found")) {
        onProgress?.("API key session expired. Please re-select your key.");
        await (window as any).aistudio.openSelectKey();
        continue;
      }
      throw err;
    }
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation failed to return a URI.");

  const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const detectIntent = (text: string): { type: 'image' | 'video' | 'text', prompt: string } => {
  const lower = text.toLowerCase();
  if (lower.startsWith('generate image') || lower.startsWith('/image')) {
    return { type: 'image', prompt: text.replace(/^(generate image of|generate image|\/image)\s*/i, '').trim() };
  }
  if (lower.startsWith('generate video') || lower.startsWith('/video')) {
    return { type: 'video', prompt: text.replace(/^(generate video of|generate video|\/video)\s*/i, '').trim() };
  }
  return { type: 'text', prompt: text };
};
