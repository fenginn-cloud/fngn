"use client";

import { motion } from "framer-motion";
import { Counter } from "./Counter";
import { childVariants, StaggerGroup } from "./Reveal";
import { useLanguage } from "./LanguageProvider";

export function Stats() {
  const { t } = useLanguage();
  const stats = t.stats.items;
  return (
    <section id="stats" className="relative border-y border-line bg-surface/40">
      <div className="container-x py-16 sm:py-20">
        <StaggerGroup className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={childVariants}
              className="group relative text-center lg:text-left"
            >
              <div className="font-display text-5xl font-bold tracking-tightest text-foreground sm:text-6xl">
                <span className="accent-gradient-text">
                  <Counter value={stat.value} suffix={stat.suffix} />
                </span>
              </div>
              <div className="mt-3 text-sm font-medium uppercase tracking-[0.18em] text-muted">
                {stat.label}
              </div>
              <div className="mx-auto mt-5 h-px w-12 bg-line transition-all duration-500 group-hover:w-20 group-hover:bg-accent lg:mx-0" />
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
