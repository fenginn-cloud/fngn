import { site } from "@/data/site";
import { projects } from "@/data/projects";

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
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    legalName: `${site.fullName} — FNGN`,
    url: site.url,
    email: `mailto:${site.email}`,
    telephone: site.phone,
    founder: site.fullName,
    description: site.description,
    sameAs: [
      site.socials.instagram,
      site.socials.linkedin,
      site.socials.behance,
    ],
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
