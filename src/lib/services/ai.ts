import type { AiIntent, LiveProduct, Order } from "@/lib/types";
import { products as mockProducts } from "@/lib/mock-data";

function extractBudget(text: string) {
  const match = text.match(/(?:under|below|₹|rs\.?)\s*(\d{2,5})/i) ?? text.match(/(\d{2,5})/);
  return match ? Number(match[1]) : undefined;
}

function fallbackIntent(text: string): AiIntent {
  const lower = text.toLowerCase();
  const budget = extractBudget(text);
  if (lower.includes("track") || lower.includes("order")) return { intent: "TRACK_ORDER" };
  if (lower.includes("kit") || lower.includes("generate")) return { intent: "GENERATE_MEAL_KIT", budget, serves: lower.includes("2") ? 2 : undefined };
  if (lower.includes("add")) return { intent: "ADD_TO_CART", productName: text.replace(/add/i, "").trim() };
  if (lower.includes("recommend") || lower.includes("suggest") || lower.includes("dinner")) return { intent: "RECOMMEND_PRODUCTS", query: text, budget };
  return { intent: "SEARCH_PRODUCTS", query: text, filters: { maxPrice: budget, spicy: lower.includes("spicy"), veg: lower.includes("veg") } };
}

export async function getAiIntent(text: string): Promise<AiIntent> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) return fallbackIntent(text);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Return only JSON for this food commerce user message. Intents: SEARCH_PRODUCTS, RECOMMEND_PRODUCTS, TRACK_ORDER, ADD_TO_CART, GENERATE_MEAL_KIT, GENERAL_HELP. User: ${text}`,
                },
              ],
            },
          ],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );
    const data = await response.json();
    const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
    return raw ? (JSON.parse(raw) as AiIntent) : fallbackIntent(text);
  } catch (error) {
    console.warn("Gemini intent fallback", error);
    return fallbackIntent(text);
  }
}

export function runProductSearch(intent: AiIntent, products: LiveProduct[] = mockProducts) {
  const query =
    "query" in intent ? intent.query.toLowerCase() : "productName" in intent ? intent.productName.toLowerCase() : "";
  const filters = "filters" in intent ? intent.filters : undefined;
  const budget = "budget" in intent ? intent.budget : filters?.maxPrice;
  return products
    .filter((p) => {
      const text = `${p.name} ${p.vendor} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      if (query && !text.includes(query) && !query.split(" ").some((word) => word.length > 3 && text.includes(word))) return false;
      if (filters?.category && p.category !== filters.category) return false;
      if (filters?.veg && !p.veg) return false;
      if (filters?.spicy && p.spice < 2) return false;
      if (budget && p.price > budget) return false;
      return true;
    })
    .slice(0, 4);
}

export async function generateMealKit(input: { cuisine: string; budget: number; serves: number; spice: number }) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  const fallback = {
    name: `${input.cuisine} Smart Curry Kit`,
    ingredients: ["Fresh protein or paneer", "Base gravy", "Whole spices", "Fresh herbs", "Cooking guide card"],
    instructions: ["Toast spices", "Simmer gravy", "Add protein", "Finish and serve"],
    estimatedCost: Math.min(input.budget, 349),
  };
  if (!key) return fallback;
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate JSON meal kit for ${input.cuisine}, serves ${input.serves}, spice ${input.spice}, budget INR ${input.budget}. Keys: name, ingredients, instructions, estimatedCost.` }] }],
          generationConfig: { responseMimeType: "application/json" },
        }),
      },
    );
    const data = await response.json();
    return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}") || fallback;
  } catch {
    return fallback;
  }
}

export async function verifyFssaiCertificate(file: File) {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) {
    return { fssaiNumber: "12345678901234", expiryDate: "2027-03-31", status: "needs_review" as const, trustScore: 82 };
  }
  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: "Extract FSSAI number, expiry date, and validity status from this certificate. Return JSON: fssaiNumber, expiryDate, status, trustScore." },
              { inlineData: { mimeType: file.type || "image/jpeg", data: base64 } },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );
  const data = await response.json();
  return JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}");
}
