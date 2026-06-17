"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { categories, projects, type Category } from "@/data/projects";
import { localizeProject } from "@/data/projectsI18n";
import { SectionHeading } from "./SectionHeading";
import { WorkCard } from "./WorkCard";
import { useLanguage } from "./LanguageProvider";
import { cn } from "@/lib/utils";

type Filter = "All" | Category;

const filters: Filter[] = ["All", ...categories];

export function SelectedWorks() {
  const { t, lang } = useLanguage();
  const [active, setActive] = useState<Filter>("All");

  const visible = useMemo(() => {
    const list =
      active === "All"
        ? projects
        : projects.filter((p) => p.category === active);
    return list.map((p) => localizeProject(p, lang));
  }, [active, lang]);

  const filterLabel = (filter: Filter) =>
    filter === "All" ? t.work.filterAll : t.categories[filter] ?? filter;

  return (
    <section id="work" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow={t.work.eyebrow}
            title={t.work.title}
            description={t.work.description}
          />
        </div>

        {/* filter bar */}
        <div
          className="mt-10 flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter projects"
        >
          {filters.map((filter) => {
            const isActive = active === filter;
            return (
              <button
                key={filter}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(filter)}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                  isActive
                    ? "text-[#080808]"
                    : "text-muted hover:text-foreground",
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{filterLabel(filter)}</span>
              </button>
            );
          })}
        </div>

        {/* grid */}
        <LayoutGroup>
          <motion.div
            layout
            className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((project) => (
                <WorkCard key={project.slug} project={project} />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </div>
    </section>
  );
}
