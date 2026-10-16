"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Globe, Share2, Building2, type LucideIcon } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { childVariants, StaggerGroup, Reveal } from "./Reveal";
import { useLanguage } from "./LanguageProvider";

// Icons matched by position so they stay correct across languages.
const iconList: LucideIcon[] = [Sparkles, Globe, Share2, Building2];

export function Services() {
  const { t } = useLanguage();
  const s = t.services;

  return (
    <section id="services" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={s.eyebrow}
          title={s.title}
          description={s.description}
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {s.items.map((item, idx) => {
            const Icon = iconList[idx] ?? Sparkles;
            return (
              <motion.article
                key={item.title}
                variants={childVariants}
                className="group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/15 hover:bg-surface-2 sm:p-8"
              >
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-line bg-background text-accent transition-colors duration-300 group-hover:border-accent/40">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-xl font-semibold sm:text-2xl">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
                <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {item.points.map((point) => (
                    <li
                      key={point}
                      className="flex items-center gap-2 text-sm text-foreground/90"
                    >
                      <Check className="h-4 w-4 shrink-0 text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.article>
            );
          })}
        </StaggerGroup>

        <Reveal delay={0.1}>
          <div className="mt-10 flex justify-center">
            <a href="#contact" className="btn-primary">
              {s.cta}
              <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                →
              </span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
