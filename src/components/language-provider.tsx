"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";

import { dictionaries, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "locale";

/** localStorage 是 React 之外的系统：订阅其变化，而不是在 effect 里回写 state。 */
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): Locale {
  if (typeof window === "undefined") return "zh";
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "zh";
  } catch {
    return "zh";
  }
}

function getServerSnapshot(): Locale {
  return "zh";
}

const LanguageContext = createContext<{
  locale: Locale;
  t: (typeof dictionaries)[Locale];
  toggle: () => void;
  setLocale: (l: Locale) => void;
} | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // 写入外部存储后广播通知，由 useSyncExternalStore 统一读取
  const setLocale = useCallback((l: Locale) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // 存储不可用（隐私模式等）时忽略本次持久化，仅通知更新
    }
    for (const listener of listeners) listener();
  }, []);

  const toggle = useCallback(() => {
    setLocale(getSnapshot() === "zh" ? "en" : "zh");
  }, [setLocale]);

  // SSR 输出默认 zh-CN；挂载与切换时同步 <html lang>
  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
  }, [locale]);

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
