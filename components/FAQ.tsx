"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { useLanguage } from "./LanguageProvider";
import { cn } from "@/lib/utils";

export function FAQ() {
  const { t } = useLanguage();
  const f = t.faq;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative border-y border-line bg-surface/30 py-24 sm:py-32"
    >
      <div className="container-x">
        <SectionHeading
          eyebrow={f.eyebrow}
          title={f.title}
          description={f.description}
        />

        <div className="mx-auto mt-12 max-w-3xl">
          {f.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={item.q} delay={0.03 * i}>
                <div className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="font-display text-lg font-semibold text-foreground sm:text-xl">
                      {item.q}
                    </span>
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-accent transition-all duration-300",
                        isOpen && "rotate-45 border-accent bg-accent text-[#080808]",
                      )}
                    >
                      <Plus className="h-4 w-4" />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 text-base leading-relaxed text-muted">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
