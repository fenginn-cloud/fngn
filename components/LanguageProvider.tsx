"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Lang, type Dict } from "@/data/translations";

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: Dict;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "fngn-lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  // Restore saved preference (or detect Turkish browsers) once on mount.
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
      if (saved === "en" || saved === "tr") {
        setLang(saved);
      } else if (navigator.language?.toLowerCase().startsWith("tr")) {
        setLang("tr");
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  // Reflect the active language on <html lang> for a11y / SEO.
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Persist ONLY on an explicit user choice — never overwrite on mount.
  const change = (next: Lang) => {
    setLang(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  };

  const toggle = () => change(lang === "en" ? "tr" : "en");

  return (
    <LanguageContext.Provider
      value={{ lang, setLang: change, toggle, t: dictionaries[lang] }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}
