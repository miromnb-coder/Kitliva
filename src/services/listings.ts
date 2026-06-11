import { getCategoryByName } from "@/services/categories";
import { supabase } from "@/lib/supabase";
import { CreateListingInput, CreateListingResult, ListingCondition, ListingStatus } from "@/types/listing";

const conditionByLabel: Record<string, ListingCondition> = {
  new: "new",
  "like new": "like_new",
  good: "good",
  fair: "fair",
  poor: "poor"
};

function getFriendlyListingError(message?: string) {
  const normalized = message?.toLowerCase() ?? "";

  if (normalized.includes("row-level security") || normalized.includes("permission")) {
    return "We couldn’t publish your listing. Please sign in again and try once more.";
  }

  if (normalized.includes("category")) {
    return "Please choose a valid category before publishing.";
  }

  return "We couldn’t publish your listing. Please check your details and try again.";
}

function normalizeCondition(label: string): ListingCondition | null {
  return conditionByLabel[label.trim().toLowerCase()] ?? null;
}

function parsePriceAmount(priceLabel: string): number | null {
  const normalized = priceLabel.replace(/\s/g, "").replace(",", ".").replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(normalized);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }

  return Math.round(parsed);
}

export async function createListingWithoutImages(input: CreateListingInput): Promise<CreateListingResult> {
  const title = input.title.trim();
  const description = input.description.trim();
  const categoryName = input.categoryName.trim();
  const condition = normalizeCondition(input.conditionLabel);
  const priceAmount = parsePriceAmount(input.priceLabel);

  if (!input.sellerId) {
    return { success: false, message: "Please sign in before publishing your listing." };
  }

  if (!title) {
    return { success: false, message: "Please add a title before publishing." };
  }

  if (!categoryName) {
    return { success: false, message: "Please choose a category before publishing." };
  }

  if (!condition) {
    return { success: false, message: "Please choose a valid condition before publishing." };
  }

  if (!priceAmount) {
    return { success: false, message: "Please add a valid price before publishing." };
  }

  const category = await getCategoryByName(categoryName);

  if (!category) {
    return { success: false, message: "Please choose a valid category before publishing." };
  }

  const publishedAt = new Date().toISOString();
  const status: ListingStatus = "active";
  const priceCurrency = "EUR";
  const locationCity = input.locationCity?.trim() || null;
  const locationCountry = input.locationCountry?.trim() || null;

  const { data, error } = await supabase
    .from("listings")
    .insert({
      seller_id: input.sellerId,
      category_id: category.id,
      title,
      description: description || null,
      price_amount: priceAmount,
      price_currency: priceCurrency,
      condition,
      brand: input.brand?.trim() || null,
      model: input.model?.trim() || null,
      location_city: locationCity,
      location_country: locationCountry,
      status,
      published_at: publishedAt
    })
    .select("id, title, description, price_amount, price_currency, condition, location_city, location_country, status, published_at")
    .single();

  if (error || !data) {
    return { success: false, message: getFriendlyListingError(error?.message) };
  }

  return {
    success: true,
    listing: {
      id: data.id,
      title: data.title,
      description: data.description,
      categoryName: category.name,
      condition: data.condition,
      conditionLabel: input.conditionLabel,
      priceAmount: data.price_amount,
      priceCurrency: data.price_currency,
      locationCity: data.location_city,
      locationCountry: data.location_country,
      status: data.status,
      publishedAt: data.published_at
    }
  };
}
