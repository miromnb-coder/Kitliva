import "jsr:@supabase/functions-js/edge-runtime.d.ts";

type SearchCondition = "any" | "new" | "like_new" | "good" | "fair" | "poor";
type SearchSort = "recommended" | "newest" | "price_low" | "price_high";

type CurrentFilters = {
  categoryName?: string;
  condition?: SearchCondition;
  minPrice?: string | number | null;
  maxPrice?: string | number | null;
  city?: string;
  sort?: SearchSort;
};

type RequestBody = {
  query?: string;
  currentFilters?: CurrentFilters;
};

type AISearchResult = {
  query: string;
  categoryName: string | null;
  condition: SearchCondition;
  minPrice: number | null;
  maxPrice: number | null;
  sort: SearchSort;
  explanation: string;
  chips: string[];
  mock?: boolean;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

const categories = ["Cycling", "Winter", "Outdoor", "Music", "Cameras", "Fitness", "Gaming", "Kids’ Gear"];
const conditions: SearchCondition[] = ["any", "new", "like_new", "good", "fair", "poor"];
const sorts: SearchSort[] = ["recommended", "newest", "price_low", "price_high"];

function jsonResponse(body: AISearchResult | { error: string }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}

function safeText(value?: string | null) {
  return value?.trim() ?? "";
}

function numberFromValue(value?: string | number | null) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return null;
  const parsed = Number.parseInt(value.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function findMaxPrice(query: string) {
  const underMatch = query.match(/(?:under|alle|max|below|less than)\s*€?\s*(\d+)/i);
  if (underMatch?.[1]) return Number.parseInt(underMatch[1], 10);
  const euroMatch = query.match(/€\s*(\d+)/i);
  if (euroMatch?.[1]) return Number.parseInt(euroMatch[1], 10);
  return null;
}

function inferCategory(query: string) {
  const normalized = query.toLowerCase();
  if (/bike|cycling|bicycle|pyör|cycle/.test(normalized)) return "Cycling";
  if (/ski|snow|winter|talvi|laskettel/.test(normalized)) return "Winter";
  if (/hiking|camp|tent|outdoor|retki|vaellus|backpack|tuoli/.test(normalized)) return "Outdoor";
  if (/camera|photo|kamera|lens/.test(normalized)) return "Cameras";
  if (/guitar|music|piano|musiikki/.test(normalized)) return "Music";
  if (/fitness|gym|training|treeni/.test(normalized)) return "Fitness";
  if (/gaming|game|console|peli/.test(normalized)) return "Gaming";
  if (/kids|child|children|baby|laps/.test(normalized)) return "Kids’ Gear";
  return null;
}

function buildFallbackResult(query: string, currentFilters: CurrentFilters): AISearchResult {
  const trimmedQuery = safeText(query);
  const currentCategory = safeText(currentFilters.categoryName);
  const categoryName = inferCategory(trimmedQuery) ?? (currentCategory && currentCategory !== "All" && categories.includes(currentCategory) ? currentCategory : null);
  const maxPrice = findMaxPrice(trimmedQuery) ?? numberFromValue(currentFilters.maxPrice);
  const minPrice = numberFromValue(currentFilters.minPrice);
  const condition = currentFilters.condition && conditions.includes(currentFilters.condition) ? currentFilters.condition : "any";
  const sort = currentFilters.sort && sorts.includes(currentFilters.sort) ? currentFilters.sort : "recommended";
  const chips = [categoryName, maxPrice ? `Under €${maxPrice}` : null, trimmedQuery ? "AI interpreted" : null].filter(Boolean) as string[];

  return {
    query: trimmedQuery,
    categoryName,
    condition,
    minPrice,
    maxPrice,
    sort,
    explanation: categoryName || maxPrice ? "I turned your search into filters." : "I searched using your original words.",
    chips,
    mock: true
  };
}

function clampText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : null;
}

function normalizeAIJson(value: Record<string, unknown>, fallback: AISearchResult): AISearchResult {
  const nextCategory = typeof value.categoryName === "string" && categories.includes(value.categoryName) ? value.categoryName : fallback.categoryName;
  const nextCondition = typeof value.condition === "string" && conditions.includes(value.condition as SearchCondition) ? value.condition as SearchCondition : fallback.condition;
  const nextSort = typeof value.sort === "string" && sorts.includes(value.sort as SearchSort) ? value.sort as SearchSort : fallback.sort;
  const chips = Array.isArray(value.chips) ? value.chips.filter((item) => typeof item === "string").slice(0, 4) as string[] : fallback.chips;

  return {
    query: clampText(value.query, 160) || fallback.query,
    categoryName: nextCategory,
    condition: nextCondition,
    minPrice: typeof value.minPrice === "number" ? value.minPrice : fallback.minPrice,
    maxPrice: typeof value.maxPrice === "number" ? value.maxPrice : fallback.maxPrice,
    sort: nextSort,
    explanation: clampText(value.explanation, 160) || fallback.explanation,
    chips,
    mock: false
  };
}

async function callAI(query: string, currentFilters: CurrentFilters, fallback: AISearchResult) {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  const model = Deno.env.get("OPENAI_MODEL") ?? "gpt-5-nano";

  if (!apiKey) return fallback;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      temperature: 0.25,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You convert natural language marketplace search into JSON filters for used hobby gear. Return only JSON with keys query, categoryName, condition, minPrice, maxPrice, sort, explanation, chips. Allowed categoryName values: Cycling, Winter, Outdoor, Music, Cameras, Fitness, Gaming, Kids’ Gear, or null. condition must be any, new, like_new, good, fair, or poor. sort must be recommended, newest, price_low, or price_high. Do not invent unavailable filters."
        },
        { role: "user", content: JSON.stringify({ query, currentFilters, allowedCategories: categories, allowedConditions: conditions, allowedSorts: sorts }) }
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
    const query = safeText(body.query);
    if (!query) return jsonResponse({ error: "Query is required" }, 400);
    const currentFilters = body.currentFilters ?? {};
    const fallback = buildFallbackResult(query, currentFilters);
    const result = await callAI(query, currentFilters, fallback);
    return jsonResponse(result);
  } catch {
    return jsonResponse({ error: "Invalid request" }, 400);
  }
});
