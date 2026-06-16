# FNGN — Mahmud Feyzullah Engin · Portfolio

A premium, production-ready personal portfolio for **Mahmud Feyzullah Engin** (brand **FNGN**) — a digital designer and creative technologist. Built to feel like a high-end creative studio site: dark theme, refined motion, and a fully scalable case-study system.

**Live domain:** [fngn.com.tr](https://fngn.com.tr)

---

## Project Overview

| | |
| --- | --- |
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animation** | Framer Motion |
| **Icons** | Lucide + custom SVG icon set |
| **Deployment** | Vercel or Netlify (zero-config) |

### What's included

- Full single-page experience: Hero, Stats, About + timeline, Expertise, Clients, Selected Works (filterable), Process, Contact, Footer.
- Dedicated **case study pages** at `/work/[slug]` with overview, challenge, solution, tools, gallery, results, Behance link and next-project navigation.
- **Premium auto-placeholders** — any project without images renders a generated SVG composition, so the site always looks complete.
- Complete **SEO**: metadata, Open Graph + Twitter cards, dynamically-generated OG image, `sitemap.xml`, `robots.txt`, and JSON-LD (Person, Organization, WebSite, CollectionPage/Portfolio, CreativeWork per project).
- Accessibility: skip link, focus states, reduced-motion support, semantic landmarks, ARIA labels.
- Performance: static generation, `next/image` optimization, font optimization via `next/font`, lazy-revealed sections.

---

## Folder Structure

```
fngn/
├─ app/
│  ├─ layout.tsx              # Root layout, fonts, global metadata, JSON-LD
│  ├─ page.tsx                # Home page (all sections)
│  ├─ globals.css             # Design system + Tailwind layers
│  ├─ icon.svg                # Favicon (file convention)
│  ├─ apple-icon.tsx          # Apple touch icon (generated)
│  ├─ opengraph-image.tsx     # Social share image (generated)
│  ├─ sitemap.ts              # /sitemap.xml
│  ├─ robots.ts               # /robots.txt
│  ├─ not-found.tsx           # Custom 404
│  └─ work/
│     └─ [slug]/page.tsx      # Dynamic case study pages
├─ components/                # All UI components (Hero, Navbar, WorkCard, …)
├─ data/
│  ├─ site.ts                 # Profile, nav, stats, expertise, timeline, clients, process
│  └─ projects.ts             # ⭐ Portfolio data — the single source of truth
├─ lib/
│  ├─ jsonld.ts               # Structured data builders
│  └─ utils.ts                # Helpers (cn)
├─ public/
│  └─ projects/               # Project images go here (by slug)
├─ tailwind.config.ts
├─ next.config.mjs
└─ tsconfig.json
```

---

## Local Development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint
```

> Requires Node 18.18+ (Node 20+ recommended).

---

## Deployment Guide

### 1. GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit — FNGN portfolio"
git branch -M main
git remote add origin https://github.com/<your-username>/fngn.git
git push -u origin main
```

### 2. Vercel Deployment (recommended)

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset is auto-detected as **Next.js** — no configuration needed.
3. Click **Deploy**. Your site is live on a `*.vercel.app` URL in ~1 minute.
4. Every push to `main` redeploys automatically.

### 3. Netlify Deployment

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Pick the repo. Netlify auto-detects Next.js via the official runtime.
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
3. Click **Deploy**. (The OG/apple-icon routes use the Edge runtime, which Netlify supports out of the box.)

---

## Image Management Guide

All artwork lives in `public/projects/<slug>/` and is referenced from `data/projects.ts`.

```
public/projects/
  woodora-brand-design/
    cover.jpg
    gallery-1.jpg
    gallery-2.jpg
```

```ts
// data/projects.ts
{
  slug: "woodora-brand-design",
  coverImage: "/projects/woodora-brand-design/cover.jpg",
  galleryImages: [
    "/projects/woodora-brand-design/gallery-1.jpg",
    "/projects/woodora-brand-design/gallery-2.jpg",
  ],
  // thumbnail, mobilePreview, desktopPreview also supported
}
```

- **Missing image?** A premium SVG placeholder (tinted with the project's `accent`) is rendered automatically.
- **Gallery is unlimited** — add as many entries to `galleryImages` as you like; the layout adapts.

| Field | Ratio | Suggested size |
| --- | --- | --- |
| `coverImage` | 16:9 | 1600 × 900 |
| `galleryImages` | 4:3 | 1600 × 1200 |

---

## Portfolio Management Guide

Everything content-related is edited in **`data/`** — no need to touch components.

### Add a new project

Append an object to the `projects` array in `data/projects.ts`:

```ts
{
  slug: "new-project",            // becomes /work/new-project
  title: "New Project",
  category: "Branding",            // Branding | UI/UX | Social Media | Real Estate | Motion | Web Design
  tags: ["Identity", "Logo"],
  year: "2026",
  client: "Client Name",
  description: "One-line summary for the grid card.",
  overview: "Longer intro shown on the case study hero.",
  challenge: "The problem.",
  solution: "How it was solved.",
  tools: ["Figma", "Illustrator"],
  results: [{ label: "Engagement", value: "+60%" }],
  accent: "#E26205",               // tints the placeholder
  behanceUrl: "https://www.behance.net/mahmutengin",
  featured: true,                   // optional highlight flag
}
```

The new project automatically appears in the grid, gets a case study page, joins the correct filter, and is added to the sitemap + structured data.

### Edit profile / sections

- Name, role, email, phone, socials, location → `data/site.ts`
- Stats counters, expertise cards, experience timeline, clients, process steps → `data/site.ts`

---

## Behance Integration

Behance does not offer a reliable public API for embedding, so this project uses a **manual, content-managed approach** (recommended for stability):

- Each project carries a `behanceUrl` field in `data/projects.ts`.
- "View on Behance" buttons appear on every work card and case study page.
- The global profile link lives in `data/site.ts → socials.behance`.

To point a project at a specific Behance case, set its `behanceUrl` to the exact project URL. To embed live thumbnails later, you can swap in Behance's oEmbed or a scheduled fetch — the UI already exposes the link surface for it.

---

## SEO Configuration Guide

- **Global metadata** — `app/layout.tsx` (title template, description, keywords, OG, Twitter, robots).
- **Per-page metadata** — `generateMetadata` in `app/work/[slug]/page.tsx`.
- **Structured data** — `lib/jsonld.ts` (Person, Organization, WebSite, Portfolio/CollectionPage, per-project CreativeWork), injected via `components/JsonLd.tsx`.
- **Sitemap** — `app/sitemap.ts` → served at `/sitemap.xml` (auto-includes every project).
- **Robots** — `app/robots.ts` → served at `/robots.txt`.
- **Social image** — `app/opengraph-image.tsx` generates a 1200×630 share image.

**Before going live, update the canonical domain** in `data/site.ts`:

```ts
export const site = {
  url: "https://fngn.com.tr",
  // ...
};
```

Everything (metadata base, sitemap, JSON-LD, OG) derives from this value.

---

## Domain Connection Guide

### On Vercel
1. Project → **Settings → Domains → Add** `fngn.com.tr`.
2. At your registrar, add the records Vercel shows:
   - `A` record `@` → `76.76.21.21`, **or**
   - `CNAME` `www` → `cname.vercel-dns.com`
3. Wait for DNS to propagate; SSL is issued automatically.

### On Netlify
1. Site → **Domain settings → Add custom domain** `fngn.com.tr`.
2. Either delegate to Netlify DNS, or add a `CNAME`/`A` (`75.2.60.5`) at your registrar.
3. Enable **HTTPS** (Let's Encrypt, automatic).

---

## Future Expansion Suggestions

- **Blog / Journal** — add `app/journal/` with MDX for articles and design notes.
- **CMS** — connect Sanity, Contentful or Notion to replace `data/projects.ts` for non-technical editing.
- **Contact form** — wire the contact section to Resend, Formspree or a serverless route.
- **i18n** — add Turkish/English locales (the audience is bilingual).
- **Live Behance feed** — scheduled revalidation pulling latest projects.
- **Case study richness** — video embeds, before/after sliders, scroll-linked galleries.
- **Analytics** — Vercel Analytics or Plausible for privacy-friendly insights.

---

## Credits

Designed & built for **FNGN — Mahmud Feyzullah Engin**.
Designed with purpose. Built with precision. Crafted by FNGN.
