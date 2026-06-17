"use client";

import { motion } from "framer-motion";
import {
  Layout,
  Globe,
  AppWindow,
  Sparkles,
  Share2,
  Compass,
  Clapperboard,
  Building2,
  Code2,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { childVariants, StaggerGroup } from "./Reveal";
import { useLanguage } from "./LanguageProvider";

// Icons are matched by position so they stay correct across languages.
const iconList: LucideIcon[] = [
  Layout,
  Globe,
  AppWindow,
  Sparkles,
  Share2,
  Compass,
  Clapperboard,
  Building2,
  Code2,
];

export function Expertise() {
  const { t } = useLanguage();
  const expertise = t.expertise.items;
  return (
    <section id="expertise" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={t.expertise.eyebrow}
          title={t.expertise.title}
          description={t.expertise.description}
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {expertise.map((item, idx) => {
            const Icon = iconList[idx] ?? Sparkles;
            return (
              <motion.article
                key={item.title}
                variants={childVariants}
                className="card-hover group relative overflow-hidden rounded-3xl border border-line bg-surface p-7 hover:-translate-y-1 hover:border-white/15 hover:bg-surface-2"
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden="true"
                />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-background text-accent transition-colors duration-300 group-hover:border-accent/40">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-6 font-display text-xl font-semibold">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {item.description}
                </p>
                <span className="mt-6 inline-block h-px w-10 bg-line transition-all duration-500 group-hover:w-16 group-hover:bg-accent" />
              </motion.article>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}
