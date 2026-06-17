"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import type { Project } from "@/data/projects";
import { ProjectImage, Placeholder } from "./ProjectImage";
import { ArrowUpRight, BehanceIcon } from "./icons";
import { Reveal } from "./Reveal";
import { useLanguage } from "./LanguageProvider";
import { localizeProject } from "@/data/projectsI18n";

export function CaseStudy({
  project: rawProject,
  next: rawNext,
}: {
  project: Project;
  next: Project;
}) {
  const { t, lang } = useLanguage();
  const cs = t.caseStudy;
  const project = localizeProject(rawProject, lang);
  const next = localizeProject(rawNext, lang);

  // Build a gallery: real images if present, otherwise four placeholders.
  const gallery =
    project.galleryImages && project.galleryImages.length > 0
      ? project.galleryImages
      : [undefined, undefined, undefined, undefined];

  return (
    <article className="pb-24">
      {/* Hero */}
      <header className="relative overflow-hidden pt-32">
        <div className="container-x">
          <Reveal>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              {cs.allWork}
            </Link>
          </Reveal>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Reveal>
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.15em] text-accent">
                {t.categories[project.category] ?? project.category}
              </span>
            </Reveal>
            {project.tags?.map((tag, i) => (
              <Reveal key={tag} delay={0.05 * (i + 1)}>
                <span className="rounded-full border border-line px-3 py-1 text-xs text-muted">
                  {tag}
                </span>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-6xl">
              {project.title}
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
              {project.overview}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-line py-8 sm:grid-cols-4">
              <Meta label={cs.meta.client} value={project.client ?? "—"} />
              <Meta label={cs.meta.year} value={project.year} />
              <Meta
                label={cs.meta.discipline}
                value={t.categories[project.category] ?? project.category}
              />
              <Meta label={cs.meta.role} value={cs.meta.roleValue} />
            </dl>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="container-x mt-12">
            <div className="relative aspect-[16/9] overflow-hidden rounded-4xl border border-line">
              <ProjectImage
                src={project.coverImage}
                alt={`${project.title} hero`}
                title={project.title}
                accent={project.accent}
                category={project.category}
                className="absolute inset-0"
                sizes="100vw"
                priority
              />
            </div>
          </div>
        </Reveal>
      </header>

      {/* Body */}
      <div className="container-x mt-20 grid grid-cols-1 gap-14 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-12">
          <Block title={cs.challenge} body={project.challenge} />
          <Block title={cs.solution} body={project.solution} />
        </div>

        <aside className="space-y-10 lg:sticky lg:top-28 lg:self-start">
          <div>
            <h3 className="eyebrow mb-4">
              <span className="h-px w-6 bg-accent" /> {cs.toolsUsed}
            </h3>
            <ul className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-foreground"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="eyebrow mb-4">
              <span className="h-px w-6 bg-accent" /> {cs.results}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {project.results.map((r) => (
                <div
                  key={r.label}
                  className="flex items-baseline justify-between rounded-2xl border border-line bg-surface px-5 py-4"
                >
                  <span className="text-sm text-muted">{r.label}</span>
                  <span className="font-display text-xl font-semibold text-accent">
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {project.behanceUrl ? (
            <a
              href={project.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost w-full"
            >
              <BehanceIcon className="h-4 w-4" />
              {cs.viewOnBehance}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </aside>
      </div>

      {/* Gallery */}
      <section className="container-x mt-24">
        <h3 className="eyebrow mb-6">
          <span className="h-px w-6 bg-accent" /> {cs.gallery}
        </h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {gallery.map((src, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: (i % 2) * 0.1 }}
              className={
                i === 0
                  ? "relative aspect-[16/10] overflow-hidden rounded-3xl border border-line sm:col-span-2"
                  : "relative aspect-[4/3] overflow-hidden rounded-3xl border border-line"
              }
            >
              {src ? (
                <ProjectImage
                  src={src}
                  alt={`${project.title} gallery ${i + 1}`}
                  title={project.title}
                  accent={project.accent}
                  className="absolute inset-0"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <Placeholder
                  title={`${project.title} ${i + 1}`}
                  accent={project.accent}
                  category={project.category}
                  className="absolute inset-0"
                />
              )}
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">
          {cs.galleryNote.pre}{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-foreground">
            /public/projects/{project.slug}/
          </code>{" "}
          {cs.galleryNote.mid}{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-foreground">
            data/projects.ts
          </code>
          {cs.galleryNote.post}
        </p>
      </section>

      {/* Next project */}
      <section className="container-x mt-24">
        <Link
          href={`/work/${next.slug}`}
          className="group relative block overflow-hidden rounded-4xl border border-line bg-surface p-10 transition-colors duration-500 hover:border-white/15 sm:p-14"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
          <span className="text-xs uppercase tracking-[0.25em] text-muted">
            {cs.nextProject}
          </span>
          <div className="mt-3 flex items-center justify-between gap-6">
            <h3 className="font-display text-3xl font-bold leading-tight transition-colors duration-300 group-hover:text-accent sm:text-4xl">
              {next.title}
            </h3>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-foreground transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-[#080808]">
              <ArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </Link>
      </section>
    </article>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <Reveal>
      <div>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          {title}
        </h2>
        <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
          {body}
        </p>
      </div>
    </Reveal>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-[0.18em] text-muted">
        {label}
      </dt>
      <dd className="mt-2 font-display text-base font-medium text-foreground">
        {value}
      </dd>
    </div>
  );
}
