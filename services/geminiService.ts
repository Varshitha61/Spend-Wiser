/// <reference types="vite/client" />
import { GoogleGenAI, Type } from "@google/genai";
import { ReceiptAnalysisResult, Transaction } from "../types";


const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

if (!apiKey) {
  console.warn(
    "⚠️ VITE_GEMINI_API_KEY is not set. AI features (receipt scan & insights) will be disabled."
  );
}


const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const analyzeReceiptImage = async (
  base64Image: string
): Promise<ReceiptAnalysisResult> => {
  if (!ai) {
    throw new Error(
      "AI is not configured. Please set VITE_GEMINI_API_KEY in your environment."
    );
  }


  const cleanBase64 = base64Image.replace(
    /^data:image\/(png|jpeg|jpg|webp);base64,/,
    ""
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: cleanBase64,
          },
        },
        {
          text: `
            Analyze this receipt. Extract:
            - merchant name
            - total amount
            - date (YYYY-MM-DD format)
            - category (Food, Transport, Housing, Entertainment, Shopping, Health, Other)
            - short description
            - currency (if visible)
          `,
        },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          merchant: { type: Type.STRING },
          date: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          category: { type: Type.STRING },
          description: { type: Type.STRING },
          currency: { type: Type.STRING },
        },
        required: ["merchant", "amount", "category"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text) as ReceiptAnalysisResult;
  }

  throw new Error("Failed to analyze receipt");
};

export const getSpendingInsights = async (
  transactions: Transaction[]
): Promise<string> => {
  if (!ai) {
    // Friendly fallback instead of throwing, so UI still works
    return (
      "AI insights are currently unavailable because the financial advisor " +
      "is not configured. Please try again later."
    );
  }

  const simplifiedTx = JSON.stringify(
    transactions.slice(0, 50).map((t) => ({
      date: t.date,
      amount: t.amount,
      category: t.category,
      type: t.type,
    }))
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Here is a JSON list of recent transactions: ${simplifiedTx}.
    Provide a brief, friendly financial insight summary (max 3 sentences).
    Highlight any spending trends or areas to save. Address the user directly.`,
  });

  return response.text || "No insights available.";
};

export const parseBankMessage = async (
  message: string
): Promise<Partial<Transaction>> => {
  if (!ai) {
    throw new Error("AI is not configured.");
  }

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `
      Analyze this bank SMS/transaction message: "${message}"
      Extract the following details as JSON:
      - amount (number)
      - type ('income' if money credited/added, 'expense' if money debited/spent/paid)
      - description (a short name of the merchant or source)
      - category (one of: Food, Transport, Housing, Entertainment, Shopping, Health, Utilities, Other)
      - currency (INR or USD, defaults to INR)
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          amount: { type: Type.NUMBER },
          type: { type: Type.STRING, enum: ['income', 'expense'] },
          description: { type: Type.STRING },
          category: { type: Type.STRING },
          currency: { type: Type.STRING },
        },
        required: ["amount", "type", "description"],
      },
    },
  });

  if (response.text) {
    return JSON.parse(response.text);
  }

  throw new Error("Failed to parse message.");
};
