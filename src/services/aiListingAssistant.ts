import { supabase } from "@/lib/supabase";
import { SellFormDraft } from "@/types/sell";

export type AIListingAssistantMode = "details" | "pricing" | "review";

export type AIListingSuggestion = {
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

export type AIListingAssistantRequest = {
  mode: AIListingAssistantMode;
  form: SellFormDraft;
};

const fallbackCategories = ["Cycling", "Winter", "Outdoor", "Music", "Cameras", "Fitness", "Gaming", "Kids’ Gear"];
const fallbackConditions = ["New", "Like new", "Good", "Fair", "Poor"];

function getMockSuggestion({ mode, form }: AIListingAssistantRequest): AIListingSuggestion {
  const brandModel = [form.brand.trim(), form.model.trim()].filter(Boolean).join(" ");
  const category = fallbackCategories.includes(form.categoryName) ? form.categoryName : "Outdoor";
  const condition = fallbackConditions.includes(form.conditionLabel) ? form.conditionLabel : "Good";
  const baseTitle = form.title.trim() || [brandModel, category === "Kids’ Gear" ? "gear" : category.toLowerCase()].filter(Boolean).join(" ");
  const title = baseTitle ? `${condition} ${baseTitle}`.replace(/\s+/g, " ").trim() : "Quality used gear in good condition";
  const descriptionParts = [
    form.description.trim() || "Quality used gear in good condition.",
    brandModel ? `Brand/model: ${brandModel}.` : "Add the brand and model if you know them.",
    "Mention what is included, any wear and how the buyer can collect or receive it."
  ];
  const price = Number.parseFloat(form.priceLabel.replace(/[^0-9.,]/g, "").replace(",", "."));
  const suggestedPriceMin = Number.isFinite(price) && price > 0 ? Math.max(1, Math.round(price * 0.85)) : mode === "pricing" ? 40 : null;
  const suggestedPriceMax = Number.isFinite(price) && price > 0 ? Math.max(suggestedPriceMin ?? 1, Math.round(price * 1.15)) : mode === "pricing" ? 70 : null;
  const missingDetails = [
    !form.brand.trim() ? "Add the brand if you know it." : null,
    !form.model.trim() ? "Add the model or product name if available." : null,
    !form.description.trim() ? "Add what is included and mention any visible wear." : null,
    !form.locationCity.trim() ? "Add the city for local buyers." : null
  ].filter(Boolean) as string[];

  return {
    suggestedTitle: title.slice(0, 70),
    suggestedCategoryName: category,
    suggestedConditionLabel: condition,
    suggestedDescription: descriptionParts.join("\n\n"),
    suggestedPriceMin,
    suggestedPriceMax,
    missingDetails,
    safetyNotes: ["Review AI suggestions before publishing.", "Keep the item condition honest and clear."],
    mock: true
  };
}

function normalizeSuggestion(value: Partial<AIListingSuggestion> | null | undefined, fallback: AIListingSuggestion): AIListingSuggestion {
  return {
    suggestedTitle: value?.suggestedTitle ?? fallback.suggestedTitle,
    suggestedCategoryName: value?.suggestedCategoryName ?? fallback.suggestedCategoryName,
    suggestedConditionLabel: value?.suggestedConditionLabel ?? fallback.suggestedConditionLabel,
    suggestedDescription: value?.suggestedDescription ?? fallback.suggestedDescription,
    suggestedPriceMin: value?.suggestedPriceMin ?? fallback.suggestedPriceMin,
    suggestedPriceMax: value?.suggestedPriceMax ?? fallback.suggestedPriceMax,
    missingDetails: Array.isArray(value?.missingDetails) ? value.missingDetails : fallback.missingDetails,
    safetyNotes: Array.isArray(value?.safetyNotes) ? value.safetyNotes : fallback.safetyNotes,
    mock: value?.mock ?? fallback.mock
  };
}

export async function getAIListingSuggestion(request: AIListingAssistantRequest): Promise<AIListingSuggestion> {
  const fallback = getMockSuggestion(request);

  try {
    const { data, error } = await supabase.functions.invoke("ai-listing-assistant", { body: request });

    if (error || !data) {
      return fallback;
    }

    return normalizeSuggestion(data as Partial<AIListingSuggestion>, fallback);
  } catch {
    return fallback;
  }
}
