"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { childVariants, StaggerGroup } from "./Reveal";
import { useLanguage } from "./LanguageProvider";

export function Process() {
  const { t } = useLanguage();
  const processSteps = t.process.items;
  return (
    <section
      id="process"
      className="relative border-y border-line bg-surface/30 py-24 sm:py-32"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow={t.process.eyebrow}
          title={t.process.title}
          description={t.process.description}
        />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, i) => (
            <motion.div
              key={step.step}
              variants={childVariants}
              className="group relative overflow-hidden rounded-3xl border border-line bg-background p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/15"
            >
              <span className="font-display text-5xl font-bold text-line transition-colors duration-500 group-hover:text-accent/40">
                {step.step}
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
              {i < processSteps.length - 1 && (
                <span
                  className="absolute right-6 top-9 hidden h-px w-8 bg-line lg:block"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
