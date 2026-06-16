import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaseStudy } from "@/components/CaseStudy";
import { JsonLd } from "@/components/JsonLd";
import { projectSchema } from "@/lib/jsonld";
import {
  getProject,
  getAdjacentProject,
  projects,
} from "@/data/projects";
import { site } from "@/data/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};

  const title = `${project.title} — ${project.category}`;
  const url = `${site.url}/work/${project.slug}`;
  // Use the project cover when available; otherwise the generated OG image
  // (app/opengraph-image.tsx) is applied automatically by Next.js.
  const images = project.coverImage
    ? [{ url: project.coverImage, width: 1200, height: 630, alt: project.title }]
    : undefined;

  return {
    title,
    description: project.description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      type: "article",
      url,
      title,
      description: project.description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: project.description,
      ...(project.coverImage ? { images: [project.coverImage] } : {}),
    },
  };
}

export default function WorkPage({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const next = getAdjacentProject(project.slug);

  return (
    <>
      <JsonLd data={projectSchema(project.slug)} />
      <Navbar />
      <main id="main">
        <CaseStudy project={project} next={next} />
      </main>
      <Footer />
    </>
  );
}
