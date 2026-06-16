"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Project } from "@/data/projects";
import { ProjectImage } from "./ProjectImage";
import { ArrowUpRight, BehanceIcon } from "./icons";

export const WorkCard = forwardRef<HTMLDivElement, { project: Project }>(
  function WorkCard({ project }, ref) {
    return (
    <motion.article
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-line bg-surface"
    >
      <Link
        href={`/work/${project.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        aria-label={`View case study: ${project.title}`}
      >
        <ProjectImage
          src={project.coverImage}
          alt={`${project.title} cover`}
          title={project.title}
          accent={project.accent}
          category={project.category}
          className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-50 transition-opacity duration-500 group-hover:opacity-75" />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-foreground backdrop-blur">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-accent text-[#080808] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl font-semibold leading-tight">
            {project.title}
          </h3>
          <span className="shrink-0 text-xs text-muted">{project.year}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.description}
        </p>

        <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-accent"
          >
            View Case Study
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          {project.behanceUrl ? (
            <a
              href={project.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-foreground"
            >
              <BehanceIcon className="h-4 w-4" />
              Behance
            </a>
          ) : null}
        </div>
      </div>
    </motion.article>
    );
  },
);
