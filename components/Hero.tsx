"use client";

import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "./LanguageProvider";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { t } = useLanguage();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 pt-32 pb-20 text-center"
    >
      {/* ---- Light-ray atmosphere ---- */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        {/* warm glow fanning from the left edge */}
        <motion.div
          className="absolute inset-y-0 left-0 w-3/5"
          style={{
            background:
              "radial-gradient(130% 95% at 0% 58%, rgba(255,122,26,0.55), rgba(226,98,5,0.22) 28%, transparent 62%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.75, 1, 0.75] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* warm glow fanning from the right edge */}
        <motion.div
          className="absolute inset-y-0 right-0 w-3/5"
          style={{
            background:
              "radial-gradient(130% 95% at 100% 58%, rgba(255,122,26,0.5), rgba(226,98,5,0.2) 28%, transparent 62%)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [1, 0.72, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* vertical light streaks (god rays) */}
        <div
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "repeating-linear-gradient(90deg, transparent 0 9px, rgba(255,160,70,0.07) 9px 10px)",
            maskImage:
              "radial-gradient(135% 85% at 50% 42%, transparent 32%, black 92%)",
            WebkitMaskImage:
              "radial-gradient(135% 85% at 50% 42%, transparent 32%, black 92%)",
          }}
        />
        {/* dark core so the headline stays crisp */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 62% at 50% 46%, rgba(8,8,8,0.8), rgba(8,8,8,0.32) 55%, transparent 78%)",
          }}
        />

        {/* FN·GN monogram — kept from the original hero, blended in */}
        <div className="absolute left-1/2 top-1/2 h-[min(94vw,680px)] w-[min(94vw,680px)] -translate-x-1/2 -translate-y-1/2 opacity-80 mix-blend-screen">
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 400 400" className="h-full w-full">
              <circle
                cx="200"
                cy="200"
                r="192"
                fill="none"
                stroke="rgba(226,98,5,0.5)"
                strokeWidth="1"
                strokeDasharray="2 10"
              />
              <circle
                cx="200"
                cy="200"
                r="150"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 400 400" className="h-full w-full">
              <circle
                cx="200"
                cy="200"
                r="118"
                fill="none"
                stroke="rgba(226,98,5,0.35)"
                strokeWidth="1"
                strokeDasharray="1 14"
              />
            </svg>
          </motion.div>
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          >
            <span className="absolute left-1/2 top-[4%] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-accent" />
          </motion.div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-display text-7xl font-extrabold tracking-tightest sm:text-8xl">
              <span className="text-accent/20">FN</span>
              <span className="text-white/[0.07]">GN</span>
            </span>
          </div>
        </div>

        {/* top & bottom fades */}
        <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="mx-auto flex max-w-4xl flex-col items-center">
        {/* pill badge */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-wide text-foreground/90 shadow-soft"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {t.hero.badge}
        </motion.span>

        {/* two-part headline */}
        <h1 className="mt-7 text-balance text-[2rem] leading-[1.04] sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.25rem]">
          <span className="block overflow-hidden pb-[0.12em]">
            <motion.span
              className="accent-gradient-text inline-block font-display font-bold tracking-tightest"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.15, ease }}
            >
              {t.hero.titleBold}
            </motion.span>
          </span>
          <span className="-mt-1 block overflow-hidden pb-[0.18em]">
            <motion.span
              className="inline-block font-serif italic text-foreground"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.85, delay: 0.3, ease }}
            >
              {t.hero.titleItalic}
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
        >
          {t.hero.subhead}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#contact"
            onClick={() => track("hero_get_in_touch")}
            className="rounded-full bg-foreground px-7 py-3.5 text-sm font-semibold text-[#080808] transition-all duration-300 hover:bg-white hover:shadow-[0_14px_40px_-12px_rgba(245,245,245,0.4)]"
          >
            {t.hero.getInTouch}
          </a>
          <a
            href="#work"
            onClick={() => track("hero_view_projects")}
            className="rounded-full border border-line bg-surface-2/70 px-7 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition-all duration-300 hover:border-white/25 hover:bg-surface-2"
          >
            {t.hero.viewProjects}
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#stats"
        aria-label="Scroll down"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted md:flex"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">
          {t.hero.scroll}
        </span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.a>
    </section>
  );
}
