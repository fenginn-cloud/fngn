"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { childVariants, StaggerGroup } from "./Reveal";
import { useLanguage } from "./LanguageProvider";

export function Testimonials() {
  const { t } = useLanguage();
  const tt = t.testimonials;

  return (
    <section id="testimonials" className="relative py-24 sm:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow={tt.eyebrow}
          title={tt.title}
          description={tt.description}
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {tt.items.map((item) => (
            <motion.figure
              key={item.name}
              variants={childVariants}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-background p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/15 sm:p-8"
            >
              <span
                className="pointer-events-none absolute -right-2 -top-3 font-display text-[7rem] leading-none text-accent/10 transition-colors duration-500 group-hover:text-accent/20"
                aria-hidden="true"
              >
                &rdquo;
              </span>
              <Quote className="h-6 w-6 shrink-0 text-accent" aria-hidden="true" />
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-foreground/90">
                {item.quote}
              </blockquote>
              <figcaption className="mt-7 border-t border-line pt-5">
                <div className="font-display text-base font-semibold">
                  {item.name}
                </div>
                <div className="mt-0.5 text-xs uppercase tracking-[0.18em] text-muted">
                  {item.field}
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
