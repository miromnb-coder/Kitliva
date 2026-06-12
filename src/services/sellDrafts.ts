import AsyncStorage from "@react-native-async-storage/async-storage";

import { SellFormDraft, SellPhoto } from "@/types/sell";

const SELL_DRAFT_STORAGE_KEY = "kitliva:sell-draft:v1";

export type SellDraftStep = "photos" | "details" | "pricing" | "delivery" | "review";

export type SellListingDraft = {
  form: SellFormDraft;
  selectedPhotos: SellPhoto[];
  currentStep: SellDraftStep;
  updatedAt: string;
};

function isDraftStep(value: unknown): value is SellDraftStep {
  return value === "photos" || value === "details" || value === "pricing" || value === "delivery" || value === "review";
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidDraft(value: unknown): value is SellListingDraft {
  if (!isObject(value)) return false;
  if (!isObject(value.form)) return false;
  if (!Array.isArray(value.selectedPhotos)) return false;
  if (!isDraftStep(value.currentStep)) return false;
  return typeof value.updatedAt === "string";
}

export async function saveSellDraft(draft: Omit<SellListingDraft, "updatedAt">) {
  const nextDraft: SellListingDraft = {
    ...draft,
    updatedAt: new Date().toISOString()
  };

  await AsyncStorage.setItem(SELL_DRAFT_STORAGE_KEY, JSON.stringify(nextDraft));
  return nextDraft;
}

export async function getSellDraft(): Promise<SellListingDraft | null> {
  const storedValue = await AsyncStorage.getItem(SELL_DRAFT_STORAGE_KEY);

  if (!storedValue) return null;

  try {
    const parsedDraft = JSON.parse(storedValue) as unknown;

    if (!isValidDraft(parsedDraft)) {
      await removeSellDraft();
      return null;
    }

    return parsedDraft;
  } catch {
    await removeSellDraft();
    return null;
  }
}

export async function removeSellDraft() {
  await AsyncStorage.removeItem(SELL_DRAFT_STORAGE_KEY);
}
