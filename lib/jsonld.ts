import { site } from "@/data/site";
import { projects } from "@/data/projects";
import { dictionaries } from "@/data/translations";
import { getPost } from "@/data/posts";

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.fullName,
    alternateName: site.name,
    url: site.url,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    jobTitle: site.role,
    address: {
      "@type": "PostalAddress",
      addressLocality: site.location,
    },
    sameAs: [
      site.socials.instagram,
      site.socials.linkedin,
      site.socials.behance,
    ],
    knowsAbout: [
      "UI/UX Design",
      "Web Design",
      "Brand Identity",
      "Social Media Design",
      "Creative Direction",
      "Motion Graphics",
      "Real Estate Marketing",
      "Frontend Development",
    ],
  };
}

export function organizationSchema() {
  // Real client testimonials as Review structured data (no fabricated ratings).
  const reviews = dictionaries.tr.testimonials.items.map((item) => ({
    "@type": "Review",
    author: { "@type": "Organization", name: item.name },
    reviewBody: item.quote,
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: `${site.fullName} — FNGN`,
    url: site.url,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    founder: site.fullName,
    description: site.descriptionTr,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sakarya",
      addressCountry: "TR",
    },
    areaServed: "TR",
    sameAs: [
      site.socials.instagram,
      site.socials.linkedin,
      site.socials.behance,
    ],
    review: reviews,
  };
}

export function articleSchema(slug: string) {
  const post = getPost(slug);
  if (!post) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "tr",
    keywords: post.tags.join(", "),
    url: `${site.url}/blog/${post.slug}`,
    author: { "@type": "Person", name: site.fullName, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: dictionaries.tr.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${site.name} — ${site.fullName}`,
    url: site.url,
    inLanguage: "en",
  };
}

export function portfolioSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Selected Works — ${site.name}`,
    url: `${site.url}/#work`,
    hasPart: projects.map((p) => ({
      "@type": "CreativeWork",
      name: p.title,
      url: `${site.url}/work/${p.slug}`,
      about: p.category,
      creator: { "@type": "Person", name: site.fullName },
    })),
  };
}

export function projectSchema(slug: string) {
  const project = projects.find((p) => p.slug === slug);
  if (!project) return null;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    headline: project.title,
    description: project.description,
    url: `${site.url}/work/${project.slug}`,
    dateCreated: project.year,
    about: project.category,
    keywords: [project.category, ...(project.tags ?? [])].join(", "),
    creator: {
      "@type": "Person",
      name: site.fullName,
      url: site.url,
    },
  };
}
