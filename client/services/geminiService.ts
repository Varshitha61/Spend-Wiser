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

export interface AISuggestion {
  title: string;
  description: string;
  type: "saving" | "investment" | "warning";
  priority: "high" | "medium" | "low";
  estimatedImpact: string;
}

export interface AISuggestionsResult {
  summary: string;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  suggestions: AISuggestion[];
}

export const getAISuggestions = async (
  transactions: Transaction[]
): Promise<AISuggestionsResult> => {
  if (!ai) {
    return {
      summary: "AI suggestions are unavailable. Please set VITE_GEMINI_API_KEY.",
      totalIncome: 0,
      totalExpenses: 0,
      savingsRate: 0,
      suggestions: [],
    };
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const savingsRate =
    totalIncome > 0
      ? Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)
      : 0;

  const categoryBreakdown = transactions
    .filter((t) => t.type === "expense")
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const simplifiedTx = JSON.stringify(
    transactions.slice(0, 60).map((t) => ({
      date: t.date,
      amount: t.amount,
      category: t.category,
      type: t.type,
      currency: t.currency,
    }))
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      You are a personal financial advisor. Analyze the following transaction data and provide actionable saving and investment suggestions.

      Transaction data: ${simplifiedTx}
      Total Income: ${totalIncome} INR
      Total Expenses: ${totalExpenses} INR
      Current Savings Rate: ${savingsRate}%
      Category Breakdown (expenses): ${JSON.stringify(categoryBreakdown)}

      Provide:
      1. A brief 2-sentence summary of the user's financial health
      2. 4-6 specific, actionable suggestions for saving money and investing for the future
      
      Each suggestion must have:
      - title: short action title (max 6 words)
      - description: detailed explanation with specific numbers/percentages where possible (2-3 sentences)
      - type: "saving" if it helps reduce expenses or save money, "investment" if it's about growing wealth, "warning" if there's a financial risk
      - priority: "high" if immediate action needed, "medium" for soon, "low" for long-term
      - estimatedImpact: e.g. "Save ₹2,000/month" or "Grow wealth by 12% annually"
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING },
                priority: { type: Type.STRING },
                estimatedImpact: { type: Type.STRING },
              },
              required: ["title", "description", "type", "priority", "estimatedImpact"],
            },
          },
        },
        required: ["summary", "suggestions"],
      },
    },
  });

  if (response.text) {
    const parsed = JSON.parse(response.text);
    return {
      summary: parsed.summary,
      totalIncome,
      totalExpenses,
      savingsRate,
      suggestions: parsed.suggestions,
    };
  }

  throw new Error("Failed to generate suggestions.");
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
      - type ('income' if money credited/added/received, 'expense' if money debited/spent/paid)
      - description (Include the merchant/sender name AND explicitly mention if it was via GPay, PhonePe, Paytm, etc. For example: "Starbucks via GPay")
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
