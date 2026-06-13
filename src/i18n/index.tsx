import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { NativeModules, Platform } from "react-native";

import en from "@/i18n/locales/en.json";
import fi from "@/i18n/locales/fi.json";

export type AppLanguage = "en" | "fi";

const LANGUAGE_STORAGE_KEY = "kitliva.language";
const translations = { en, fi } as const;

type TranslationParams = Record<string, string | number | null | undefined>;

type I18nContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => Promise<void>;
  t: (key: string, params?: TranslationParams) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getDeviceLocale() {
  const settings = NativeModules.SettingsManager?.settings;
  const iosLocale = settings?.AppleLocale || settings?.AppleLanguages?.[0];
  const androidLocale = NativeModules.I18nManager?.localeIdentifier;
  const intlLocale = Intl.DateTimeFormat().resolvedOptions().locale;

  return Platform.OS === "ios" ? iosLocale ?? intlLocale : androidLocale ?? intlLocale;
}

function getSupportedLanguage(locale?: string | null): AppLanguage {
  const normalized = locale?.toLowerCase() ?? "";
  if (normalized.startsWith("fi")) return "fi";
  return "en";
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
    return current.replaceAll(`{${key}}`, replacement == null ? "" : String(replacement));
  }, value);
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<AppLanguage>("en");

  useEffect(() => {
    let isMounted = true;

    async function loadLanguage() {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
      const nextLanguage = savedLanguage === "en" || savedLanguage === "fi" ? savedLanguage : getSupportedLanguage(getDeviceLocale());
      if (isMounted) setLanguageState(nextLanguage);
    }

    loadLanguage().catch(() => {
      if (isMounted) setLanguageState(getSupportedLanguage(getDeviceLocale()));
    });

    return () => {
      isMounted = false;
    };
  }, []);

  async function setLanguage(nextLanguage: AppLanguage) {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
  }

  const value = useMemo<I18nContextValue>(() => ({
    language,
    setLanguage,
    t: (key, params) => {
      const translated = getNestedValue(translations[language], key) ?? getNestedValue(translations.en, key) ?? key;
      return formatTranslation(translated, params);
    }
  }), [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}
