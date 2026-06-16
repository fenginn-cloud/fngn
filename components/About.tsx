"use client";

import { timeline } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal, StaggerGroup, childVariants } from "./Reveal";
import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="container-x">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="About"
              title="A multidisciplinary creative working where design meets technology."
            />
            <Reveal delay={0.1}>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                Mahmud Feyzullah Engin is a multidisciplinary creative
                professional working at the intersection of design, technology
                and digital marketing. His work spans web design, software
                interfaces, branding, social media campaigns and real estate
                marketing solutions.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
                The goal is always the same — work that performs as beautifully
                as it looks, built with intention from the first idea to the
                final pixel.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="mt-10 flex flex-wrap gap-3">
                {[
                  "Design",
                  "Technology",
                  "Branding",
                  "Marketing",
                  "Real Estate",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* timeline */}
          <div>
            <Reveal>
              <span className="eyebrow mb-8 block">
                <span className="h-px w-6 bg-accent" /> Experience
              </span>
            </Reveal>
            <StaggerGroup className="relative space-y-2">
              <span className="absolute left-[7px] top-2 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-accent/60 via-line to-transparent" />
              {timeline.map((item) => (
                <motion.div
                  key={item.company}
                  variants={childVariants}
                  className="group relative pl-8 pb-8 last:pb-0"
                >
                  <span className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-accent bg-background transition-colors duration-300 group-hover:bg-accent" />
                  <div className="rounded-2xl border border-transparent p-4 transition-all duration-300 group-hover:border-line group-hover:bg-surface/60">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg font-semibold">
                        {item.company}
                      </h3>
                      <span className="text-sm font-medium text-accent">
                        {item.role}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
