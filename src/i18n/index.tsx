import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import { extraTranslations } from "@/i18n/extraTranslations";
import en from "@/i18n/locales/en.json";
import fi from "@/i18n/locales/fi.json";

export type AppLanguage = "en" | "fi";
export type AppLanguagePreference = "system" | AppLanguage;

const LANGUAGE_STORAGE_KEY = "kitliva.language";
const translations = { en, fi } as const;

type TranslationParams = Record<string, string | number | null | undefined>;

type I18nContextValue = {
  language: AppLanguage;
  languagePreference: AppLanguagePreference;
  setLanguage: (language: AppLanguage) => Promise<void>;
  setLanguagePreference: (preference: AppLanguagePreference) => Promise<void>;
  t: (key: string, params?: TranslationParams) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getDeviceLocale() {
  const locale = getLocales()[0];
  return locale?.languageTag ?? locale?.languageCode ?? "en";
}

function getSupportedLanguage(locale?: string | null): AppLanguage {
  const normalized = locale?.toLowerCase().replace("_", "-") ?? "";
  if (normalized === "fi" || normalized.startsWith("fi-")) return "fi";
  return "en";
}

function getInitialLanguage() {
  return getSupportedLanguage(getDeviceLocale());
}

function getNestedValue(source: unknown, key: string): string | undefined {
  const value = key.split(".").reduce<unknown>((current, part) => {
    if (current && typeof current === "object" && part in current) {
      return (current as Record<string, unknown>)[part];
    }

    return undefined;
  }, source);

  return typeof value === "string" ? value : undefined;
}

function formatTranslation(value: string, params?: TranslationParams) {
  if (!params) return value;

  return Object.entries(params).reduce((current, [key, replacement]) => {
    return current.split(`{${key}}`).join(replacement == null ? "" : String(replacement));
  }, value);
}

function isLanguagePreference(value: string | null): value is AppLanguagePreference {
  return value === "system" || value === "en" || value === "fi";
}

function resolveLanguage(preference: AppLanguagePreference) {
  return preference === "system" ? getInitialLanguage() : preference;
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [languagePreference, setLanguagePreferenceState] = useState<AppLanguagePreference>("system");
  const [language, setLanguageState] = useState<AppLanguage>(getInitialLanguage);

  useEffect(() => {
    let isMounted = true;

    async function loadLanguagePreference() {
      const savedPreference = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      const nextPreference = isLanguagePreference(savedPreference) ? savedPreference : "system";
      if (!isMounted) return;
      setLanguagePreferenceState(nextPreference);
      setLanguageState(resolveLanguage(nextPreference));
    }

    loadLanguagePreference().catch(() => {
      if (!isMounted) return;
      setLanguagePreferenceState("system");
      setLanguageState(getInitialLanguage());
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function setLanguagePreference(nextPreference: AppLanguagePreference) {
    setLanguagePreferenceState(nextPreference);
    setLanguageState(resolveLanguage(nextPreference));
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextPreference);
  }

  async function setLanguage(nextLanguage: AppLanguage) {
    await setLanguagePreference(nextLanguage);
  }

  const value = useMemo<I18nContextValue>(() => ({
    language,
    languagePreference,
    setLanguage,
    setLanguagePreference,
    t: (key, params) => {
      const translated = getNestedValue(translations[language], key) ?? getNestedValue(extraTranslations[language], key) ?? getNestedValue(translations.en, key) ?? getNestedValue(extraTranslations.en, key) ?? key;
      return formatTranslation(translated, params);
    }
  }), [language, languagePreference]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
