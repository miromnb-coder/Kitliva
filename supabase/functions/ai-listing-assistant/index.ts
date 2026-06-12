type AssistantMode = "details" | "pricing" | "review";

type SellFormDraft = {
  title?: string;
  categoryName?: string;
  conditionLabel?: string;
  brand?: string;
  model?: string;
  priceLabel?: string;
  description?: string;
  locationCity?: string;
  locationCountry?: string;
  allowPickup?: boolean;
  allowShipping?: boolean;
};

type RequestBody = {
  mode?: AssistantMode;
  form?: SellFormDraft;
};

type AssistantResponse = {
  suggestedTitle: string | null;
  suggestedCategoryName: string | null;
  suggestedConditionLabel: string | null;
  suggestedDescription: string | null;
  suggestedPriceMin: number | null;
  suggestedPriceMax: number | null;
  missingDetails: string[];
  safetyNotes: string[];
  mock?: boolean;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const categories = ["Cycling", "Winter", "Outdoor", "Music", "Cameras", "Fitness", "Gaming", "Kids’ Gear"];
const conditions = ["New", "Like new", "Good", "Fair", "Poor"];

function jsonResponse(body: AssistantResponse | { error: string }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function safeText(value?: string) {
  return value?.trim() ?? "";
}

function parsePrice(value?: string) {
  const parsed = Number.parseFloat(safeText(value).replace(/[^0-9.,]/g, "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

function buildFallbackSuggestion(mode: AssistantMode, form: SellFormDraft): AssistantResponse {
  const brand = safeText(form.brand);
  const model = safeText(form.model);
  const brandModel = [brand, model].filter(Boolean).join(" ");
  const category = categories.includes(safeText(form.categoryName)) ? safeText(form.categoryName) : "Outdoor";
  const condition = conditions.includes(safeText(form.conditionLabel)) ? safeText(form.conditionLabel) : "Good";
  const rawTitle = safeText(form.title) || [brandModel, category === "Kids’ Gear" ? "gear" : category.toLowerCase()].filter(Boolean).join(" ");
  const suggestedTitle = rawTitle ? `${condition} ${rawTitle}`.replace(/\s+/g, " ").slice(0, 70) : "Quality used gear in good condition";
  const price = parsePrice(form.priceLabel);
  const suggestedPriceMin = price ? Math.max(1, Math.round(price * 0.85)) : mode === "pricing" ? 40 : null;
  const suggestedPriceMax = price ? Math.max(suggestedPriceMin ?? 1, Math.round(price * 1.15)) : mode === "pricing" ? 70 : null;
  const missingDetails = [
    !brand ? "Add the brand if you know it." : null,
    !model ? "Add the model or product name if available." : null,
    !safeText(form.description) ? "Add what is included and mention any visible wear." : null,
    !safeText(form.locationCity) ? "Add the city for local buyers." : null
  ].filter(Boolean) as string[];

  return {
    suggestedTitle,
    suggestedCategoryName: category,
    suggestedConditionLabel: condition,
    suggestedDescription: [
      safeText(form.description) || "Quality used gear in good condition.",
      brandModel ? `Brand/model: ${brandModel}.` : "Add brand and model details if you know them.",
      "Mention what is included, any wear and how pickup or shipping can be arranged."
    ].join("\n\n"),
    suggestedPriceMin,
    suggestedPriceMax,
    missingDetails,
    safetyNotes: ["Review AI suggestions before publishing.", "Keep the item condition honest and clear."],
    mock: true
  };
}

function clampText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : null;
}

function normalizeAIJson(value: Record<string, unknown>, fallback: AssistantResponse): AssistantResponse {
  return {
    suggestedTitle: clampText(value.suggestedTitle, 70) ?? fallback.suggestedTitle,
    suggestedCategoryName: categories.includes(String(value.suggestedCategoryName)) ? String(value.suggestedCategoryName) : fallback.suggestedCategoryName,
    suggestedConditionLabel: conditions.includes(String(value.suggestedConditionLabel)) ? String(value.suggestedConditionLabel) : fallback.suggestedConditionLabel,
    suggestedDescription: clampText(value.suggestedDescription, 900) ?? fallback.suggestedDescription,
    suggestedPriceMin: typeof value.suggestedPriceMin === "number" ? value.suggestedPriceMin : fallback.suggestedPriceMin,
    suggestedPriceMax: typeof value.suggestedPriceMax === "number" ? value.suggestedPriceMax : fallback.suggestedPriceMax,
    missingDetails: Array.isArray(value.missingDetails) ? value.missingDetails.filter((item) => typeof item === "string").slice(0, 6) as string[] : fallback.missingDetails,
    safetyNotes: Array.isArray(value.safetyNotes) ? value.safetyNotes.filter((item) => typeof item === "string").slice(0, 4) as string[] : fallback.safetyNotes,
    mock: false
  };
}

async function callAI(mode: AssistantMode, form: SellFormDraft, fallback: AssistantResponse) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-4o-mini";

  if (!apiKey) return fallback;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You help create honest marketplace listings for used hobby gear. Return only JSON with keys suggestedTitle, suggestedCategoryName, suggestedConditionLabel, suggestedDescription, suggestedPriceMin, suggestedPriceMax, missingDetails, safetyNotes. Do not invent facts."
        },
        { role: "user", content: JSON.stringify({ mode, form, allowedCategories: categories, allowedConditions: conditions }) }
      ]
    })
  });

  if (!response.ok) return fallback;
  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") return fallback;

  try {
    return normalizeAIJson(JSON.parse(content), fallback);
  } catch {
    return fallback;
  }
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return jsonResponse({ error: "Method not allowed" }, 405);

  try {
    const body = await request.json() as RequestBody;
    const mode: AssistantMode = body.mode === "pricing" || body.mode === "review" || body.mode === "details" ? body.mode : "details";
    const form = body.form ?? {};
    const fallback = buildFallbackSuggestion(mode, form);
    const result = await callAI(mode, form, fallback);
    return jsonResponse(result);
  } catch {
    return jsonResponse({ error: "Invalid request" }, 400);
  }
});
