
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResult, DietPlan, WorkoutPlan, ChatMessage } from "../types";

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    isFood: { type: Type.BOOLEAN },
    items: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          portion: { type: Type.STRING },
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fats: { type: Type.NUMBER },
        },
        required: ["name", "portion", "calories", "protein", "carbs", "fats"],
      },
    },
    total: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.NUMBER },
        protein: { type: Type.NUMBER },
        carbs: { type: Type.NUMBER },
        fats: { type: Type.NUMBER },
      },
      required: ["calories", "protein", "carbs", "fats"],
    },
    healthRating: { type: Type.NUMBER },
    coachingTip: { type: Type.STRING },
    errorMessage: { type: Type.STRING },
  },
  required: ["isFood", "items", "total", "healthRating", "coachingTip"],
};

const dietPlanSchema = {
  type: Type.OBJECT,
  properties: {
    goal: { type: Type.STRING },
    weeklyPlan: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.STRING },
          meals: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                calories: { type: Type.NUMBER },
              },
            },
          },
        },
      },
    },
    generalAdvice: { type: Type.STRING },
  },
  required: ["goal", "weeklyPlan", "generalAdvice"],
};

const workoutPlanSchema = {
  type: Type.OBJECT,
  properties: {
    level: { type: Type.STRING },
    sessions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          duration: { type: Type.STRING },
          exercises: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                sets: { type: Type.STRING },
                reps: { type: Type.STRING },
                notes: { type: Type.STRING },
              },
            },
          },
        },
      },
    },
    weeklySchedule: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ["level", "sessions", "weeklySchedule"],
};

export const analyzeFood = async (imageData?: string, textDescription?: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const model = "gemini-3-flash-preview";
  const contents: any[] = [];
  if (imageData) {
    const base64Data = imageData.includes(',') ? imageData.split(',')[1] : imageData;
    contents.push({ inlineData: { mimeType: "image/jpeg", data: base64Data } });
  }
  const prompt = textDescription || "Analyze this food image. Provide detailed macros and health advice.";
  contents.push({ text: prompt });

  const response = await ai.models.generateContent({
    model,
    contents: { parts: contents },
    config: { 
      responseMimeType: "application/json", 
      responseSchema: analysisSchema,
      systemInstruction: "You are the world's most accurate AI nutritionist. Return precise data in JSON format." 
    },
  });
  return JSON.parse(response.text || '{}');
};

export const generateDietPlan = async (goal: string): Promise<DietPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Generate a custom 7-day diet for: ${goal}.`,
    config: { 
      responseMimeType: "application/json", 
      responseSchema: dietPlanSchema,
      systemInstruction: "Create professional-grade meal plans for athletes."
    },
  });
  return JSON.parse(response.text || '{}');
};

export const generateWorkoutPlan = async (level: string, goal: string): Promise<WorkoutPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Plan a workout split. Level: ${level}, Goal: ${goal}.`,
    config: { 
      responseMimeType: "application/json", 
      responseSchema: workoutPlanSchema,
      systemInstruction: "Generate elite training programs including sets and reps."
    },
  });
  return JSON.parse(response.text || '{}');
};

export const solveDoubt = async (history: ChatMessage[], currentDoubt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are an elite AI fitness and nutrition coach. Answer any health, workout, or diet related doubts with scientific accuracy and motivational tone. Be concise and professional.",
    }
  });
  
  // We send the history manually if needed, or just the current message if the chat object doesn't support easy history injection in this simplified wrapper
  // For simplicity with this SDK version, we'll send the prompt including context if history exists
  const prompt = history.length > 0 
    ? `Context:\n${history.map(m => `${m.role}: ${m.text}`).join('\n')}\n\nUser Question: ${currentDoubt}`
    : currentDoubt;

  const response = await chat.sendMessage({ message: prompt });
  return response.text || "I'm sorry, I couldn't process that request.";
};

export const connectToCoach = (callbacks: any) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  return ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks,
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
      },
      systemInstruction: 'You are an elite, motivating personal trainer and nutritionist named Zephyr. Be energetic, concise, and professional. Respond to the user with actionable fitness and diet advice.',
    },
  });
};
