"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeading } from "./SectionHeading";
import { childVariants, StaggerGroup } from "./Reveal";
import { useLanguage } from "./LanguageProvider";
import { sortedPosts, formatDate } from "@/data/posts";
import { ArrowUpRight } from "./icons";

export function BlogList() {
  const { t, lang } = useLanguage();
  const b = t.blog;

  return (
    <main id="main" className="relative pb-24 pt-32">
      <div className="container-x">
        <SectionHeading eyebrow={b.eyebrow} title={b.title} description={b.description} />

        <StaggerGroup className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {sortedPosts.map((post) => (
            <motion.article key={post.slug} variants={childVariants}>
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface p-7 transition-all duration-500 hover:-translate-y-1 hover:border-white/15 hover:bg-surface-2 sm:p-8"
              >
                <div className="flex items-center gap-3 text-xs text-muted">
                  <time dateTime={post.date}>{formatDate(post.date, lang)}</time>
                  <span className="h-1 w-1 rounded-full bg-muted" />
                  <span>
                    {post.readMinutes} {b.minRead}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-xl font-semibold leading-tight transition-colors duration-300 group-hover:text-accent sm:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-line pt-5">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-line px-3 py-1 text-xs text-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground transition-colors group-hover:text-accent">
                    {b.readMore}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </StaggerGroup>
      </div>
    </main>
  );
}
