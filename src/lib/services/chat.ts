import type { LiveProduct, Order, UserProfile, UserRole } from "@/lib/types";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY;

type ChatMessage = { role: "user" | "model"; text: string };

function buildSystemPrompt(role: UserRole, profile: UserProfile | null, context: AppContext): string {
  const base = `You are FlowBot, the AI assistant for FlavorFlow app. You speak naturally and are helpful. Keep responses concise (2-3 sentences max unless asked for details). Use friendly casual language. You have FULL access to automate the app.

Current user: ${profile?.name || "Unknown"} (Role: ${role})
`;

  if (role === "vendor" || role === "admin") {
    return `${base}
You are helping a VENDOR/ADMIN manage their store.
Their category: ${profile?.category || "other"}${profile?.customCategory ? ` (${profile.customCategory})` : ""}
Their business: ${profile?.businessName || "Not set"}

CAPABILITIES (respond with JSON action when user wants to do these):
- ADD ITEM: When user wants to add/post/create a product, extract name, image URL, price, and sub-items. Respond with: {"action":"add_item","name":"...","image":"...","price":number,"subItems":[{"name":"...","quantity":"..."}]}
- DELETE ITEM: When user wants to delete/remove a product. Respond with: {"action":"delete_item","productId":"..."}
- MODIFY ITEM: When user wants to update/edit/change a product. Respond with: {"action":"update_item","productId":"...","updates":{...}}
- LIST ITEMS: When user wants to see their products, just describe them in text.

Current products (${context.products?.length || 0}):
${context.products?.map((p) => `- ${p.name} (Rs ${p.price}, ID: ${p.id})`).join("\n") || "None"}

Current orders (${context.orders?.length || 0}):
${context.orders?.map((o) => `- ${o.items.map((i) => i.name).join(", ")} | Status: ${o.status} | Rs ${o.total}`).join("\n") || "None"}

If the user asks to do something, respond with BOTH a friendly message AND the JSON action on a new line wrapped in \`\`\`json code block.
For regular conversation, just respond normally without any JSON.`;
  }

  if (role === "delivery") {
    return `${base}
You are helping a DELIVERY PERSON manage their deliveries.

CAPABILITIES:
- ACCEPT ORDER: {"action":"accept_order","orderId":"..."}
- UPDATE STATUS: {"action":"update_status","orderId":"...","status":"TAKEN|ON_THE_WAY|REACHED"}
- VERIFY OTP: {"action":"verify_otp","orderId":"...","otp":"..."}
- LIST ORDERS: Just describe available orders in text.

Available orders (${context.orders?.length || 0}):
${context.orders?.map((o) => `- ID: ${o.id.slice(0, 8)}... | ${o.items.map((i) => i.name).join(", ")} | ${o.address} | Status: ${o.status} | Rs ${o.total}`).join("\n") || "None"}

If the user asks to do something, respond with BOTH a friendly message AND the JSON action in a \`\`\`json code block.
For regular conversation, just respond normally.`;
  }

  // Customer
  return `${base}
You are helping a USER browse and order items.

CAPABILITIES:
- ADD TO CART: {"action":"add_to_cart","productId":"..."}
- VIEW CART: {"action":"view_cart"}
- PLACE ORDER: {"action":"place_order"}
- TRACK ORDER: {"action":"track_order","orderId":"..."}
- SEARCH ITEMS: Just list matching products in text.

Available products (${context.products?.length || 0}):
${context.products?.map((p) => `- ${p.name} by ${p.vendor} | Rs ${p.price} | Category: ${p.category} | ID: ${p.id}`).join("\n") || "None"}

User's orders (${context.orders?.length || 0}):
${context.orders?.map((o) => `- ${o.items.map((i) => i.name).join(", ")} | Status: ${o.status} | Rs ${o.total} | ID: ${o.id.slice(0, 8)}...`).join("\n") || "None"}

Cart items (${context.cart?.length || 0}):
${context.cart?.map((c) => `- ${c.product.name} x${c.qty}`).join("\n") || "Empty"}

If the user asks to do something, respond with BOTH a friendly message AND the JSON action in a \`\`\`json code block.
For regular conversation, just respond normally.`;
}

export type AppContext = {
  products?: LiveProduct[];
  orders?: Order[];
  cart?: { product: LiveProduct; qty: number }[];
};

export type ChatAction =
  | { action: "add_item"; name: string; image: string; price: number; subItems: { name: string; quantity: string }[] }
  | { action: "delete_item"; productId: string }
  | { action: "update_item"; productId: string; updates: Partial<LiveProduct> }
  | { action: "accept_order"; orderId: string }
  | { action: "update_status"; orderId: string; status: string }
  | { action: "verify_otp"; orderId: string; otp: string }
  | { action: "add_to_cart"; productId: string }
  | { action: "view_cart" }
  | { action: "place_order" }
  | { action: "track_order"; orderId: string };

export function extractAction(text: string): ChatAction | null {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[1].trim());
  } catch {
    return null;
  }
}

export function cleanBotResponse(text: string): string {
  return text.replace(/```json[\s\S]*?```/g, "").trim();
}

export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
  role: UserRole,
  profile: UserProfile | null,
  context: AppContext,
): Promise<{ text: string; action: ChatAction | null }> {
  if (!GEMINI_KEY) {
    return { text: "FlowBot is not configured. Please set the VITE_GEMINI_API_KEY.", action: null };
  }

  const systemPrompt = buildSystemPrompt(role, profile, context);

  const contents = [
    { role: "user", parts: [{ text: systemPrompt }] },
    { role: "model", parts: [{ text: "Understood! I'm FlowBot, ready to help you with FlavorFlow. What can I do for you?" }] },
    ...history.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: message }] },
  ];

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    },
  );

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "Sorry, I couldn't process that. Please try again.";
  const action = extractAction(text);
  return { text: cleanBotResponse(text), action };
}
