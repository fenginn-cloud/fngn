import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { articleSchema } from "@/lib/jsonld";
import { getPost, posts, formatDate } from "@/data/posts";
import { dictionaries } from "@/data/translations";
import { site } from "@/data/site";

const b = dictionaries.tr.blog; // blog content is Turkish

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      url: `${site.url}/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date,
      authors: [site.fullName],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPost(params.slug);
  if (!post) notFound();

  return (
    <>
      <JsonLd data={articleSchema(post.slug)} />
      <Navbar />
      <main id="main" className="relative pb-24 pt-32">
        <article className="container-x max-w-3xl">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {b.backToBlog}
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-muted">
            <time dateTime={post.date}>{formatDate(post.date, "tr")}</time>
            <span className="h-1 w-1 rounded-full bg-muted" />
            <span>
              {post.readMinutes} {b.minRead}
            </span>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line px-3 py-1 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="mt-5 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            {post.excerpt}
          </p>

          <div className="mt-10 h-px w-full bg-gradient-to-r from-accent/40 via-line to-transparent" />

          <div className="mt-10 space-y-8">
            {post.content.map((block, i) => (
              <section key={i}>
                {block.heading ? (
                  <h2 className="font-display text-xl font-semibold text-foreground sm:text-2xl">
                    {block.heading}
                  </h2>
                ) : null}
                {block.body?.map((p, j) => (
                  <p
                    key={j}
                    className="mt-3 text-base leading-relaxed text-muted"
                  >
                    {p}
                  </p>
                ))}
                {block.list ? (
                  <ul className="mt-4 space-y-2">
                    {block.list.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-base leading-relaxed text-muted"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-14 rounded-3xl border border-line bg-surface p-8 text-center">
            <p className="font-display text-xl font-semibold">
              Projeni konuşalım mı?
            </p>
            <p className="mt-2 text-sm text-muted">
              Marka, web veya sosyal medya — fikrini birlikte hayata geçirelim.
            </p>
            <Link href="/#contact" className="btn-primary mt-6">
              İletişime geç →
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
