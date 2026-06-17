"use client";

import { motion } from "framer-motion";
import { useLanguage } from "./LanguageProvider";
import type { Lang } from "@/data/translations";
import { cn } from "@/lib/utils";

const options: Lang[] = ["en", "tr"];

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useLanguage();

  return (
    <div
      className={cn(
        "relative inline-flex items-center rounded-full border border-line bg-surface/60 p-0.5 backdrop-blur",
        className,
      )}
      role="group"
      aria-label="Language / Dil"
    >
      {options.map((opt) => {
        const active = lang === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => setLang(opt)}
            aria-pressed={active}
            aria-label={opt === "en" ? "English" : "Türkçe"}
            className={cn(
              "relative z-10 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-wide transition-colors duration-300",
              active ? "text-[#080808]" : "text-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className="absolute inset-0 -z-10 rounded-full bg-accent"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            {opt.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
