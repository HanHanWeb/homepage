"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { dictionaries, type Locale } from "@/lib/i18n";

const LanguageContext = createContext<{
  locale: Locale;
  t: (typeof dictionaries)[Locale];
  toggle: () => void;
  setLocale: (l: Locale) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const saved = localStorage.getItem("locale") as Locale | null;
    if (saved === "zh" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    localStorage.setItem("locale", locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => setLocaleState(l), []);
  const toggle = useCallback(() => setLocaleState((p) => (p === "zh" ? "en" : "zh")), []);

  return (
    <LanguageContext.Provider value={{ locale, t: dictionaries[locale], toggle, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
