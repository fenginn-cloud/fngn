"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { HeroVisual } from "./HeroVisual";
import { ArrowUpRight } from "./icons";
import { useLanguage } from "./LanguageProvider";

export function Hero() {
  const { t } = useLanguage();
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-16"
    >
      {/* background atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-40 top-0 h-[40rem] w-[40rem] rounded-full bg-accent/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at 50% 40%, black 30%, transparent 75%)",
          }}
        />
      </div>

      <div className="container-x grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-ring" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <span className="eyebrow">{t.hero.badge}</span>
          </motion.div>

          <h1 className="text-5xl font-bold leading-[0.95] sm:text-6xl lg:text-7xl xl:text-[5.2rem]">
            {t.hero.headlineTokens.map((token, i) => (
              <span
                key={`${token.text}-${i}`}
                className="mr-[0.25em] inline-block overflow-hidden align-bottom"
              >
                <motion.span
                  className={
                    token.accent
                      ? "accent-gradient-text inline-block"
                      : "inline-block"
                  }
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.15 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {token.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-muted"
          >
            {t.hero.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a href="#work" className="btn-primary group">
              {t.hero.viewProjects}
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a href="#contact" className="btn-ghost">
              {t.hero.getInTouch}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center lg:justify-end"
        >
          <HeroVisual />
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
        <span className="text-[0.65rem] uppercase tracking-[0.3em]">{t.hero.scroll}</span>
        <ArrowDown className="h-4 w-4 animate-bounce" />
      </motion.a>
    </section>
  );
}
