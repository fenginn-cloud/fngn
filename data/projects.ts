import { site } from "./site";

/**
 * PORTFOLIO DATA SOURCE
 * ---------------------
 * This is the single source of truth for every project / case study.
 * Add, edit or reorder projects here — the UI updates automatically.
 *
 * IMAGE PATHS
 * -----------
 * Drop images in /public/projects/<slug>/ and reference them like:
 *   coverImage: "/projects/woodora/cover.jpg"
 * Any image left as `undefined` falls back to a generated premium
 * placeholder, so the site always looks complete.
 */

export type Category =
  | "Branding"
  | "UI/UX"
  | "Social Media"
  | "Real Estate"
  | "Motion"
  | "Web Design";

export const categories: Category[] = [
  "Branding",
  "UI/UX",
  "Social Media",
  "Real Estate",
  "Motion",
  "Web Design",
];

export interface Project {
  slug: string;
  title: string;
  category: Category;
  /** secondary tags shown on the case study page */
  tags?: string[];
  year: string;
  client?: string;
  /** short one-liner for cards */
  description: string;
  /** long-form intro for the case study hero */
  overview: string;
  challenge: string;
  solution: string;
  tools: string[];
  results: { label: string; value: string }[];
  /** hex accent used by the auto-generated placeholders */
  accent: string;
  behanceUrl?: string;
  /** Optional images — leave undefined to use premium placeholders */
  coverImage?: string;
  thumbnail?: string;
  mobilePreview?: string;
  desktopPreview?: string;
  galleryImages?: string[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "curaprox-bosnian-limited-edition",
    title: "CURAPROX | Bosnian Limited Edition",
    category: "Branding",
    tags: ["Packaging", "Limited Edition", "Art Direction"],
    year: "2025",
    client: "CURAPROX",
    description:
      "A limited-edition packaging concept for CURAPROX, celebrating Bosnian heritage.",
    overview:
      "A limited-edition packaging and art direction concept for CURAPROX — translating Bosnian cultural heritage into a collectible, premium design language for the Swiss oral-care icon.",
    challenge:
      "CURAPROX is globally recognised for its bold, playful design. A Bosnian limited edition had to honour local heritage while staying unmistakably CURAPROX and feeling collectible, not touristic.",
    solution:
      "A refined system drawing on Bosnian motifs, craft and colour — applied to packaging, surface pattern and launch visuals — that elevates the product into a design object worth keeping.",
    tools: ["Illustrator", "Photoshop", "InDesign", "After Effects"],
    results: [
      { label: "Concept", value: "Collectible" },
      { label: "Heritage", value: "Reimagined" },
      { label: "Positioning", value: "Premium" },
    ],
    accent: "#2D6CDF",
    behanceUrl: site.socials.behance,
    featured: true,
  },
  {
    slug: "doga-real-estate-tourism",
    title: "Doğa Real Estate & Tourism",
    category: "Real Estate",
    tags: ["Branding", "Marketing", "Print"],
    year: "2025",
    client: "Doğa",
    description:
      "Brand and marketing system for a real estate & tourism venture rooted in nature.",
    overview:
      "A complete brand and marketing toolkit for Doğa Real Estate & Tourism — connecting property investment with the calm of the natural world.",
    challenge:
      "Doğa needed to stand apart in a crowded real estate market while communicating a softer, nature-led promise that appeals to both investors and lifestyle buyers.",
    solution:
      "We built an organic visual language — earthy tones, fluid shapes and confident typography — applied across listings, social campaigns and sales collateral for a cohesive, premium presence.",
    tools: ["Illustrator", "Photoshop", "InDesign", "After Effects"],
    results: [
      { label: "Brand Recall", value: "+45%" },
      { label: "Lead Quality", value: "Higher" },
      { label: "Touchpoints", value: "20+" },
    ],
    accent: "#E26205",
    behanceUrl: site.socials.behance,
    featured: true,
  },
  {
    slug: "talu-textile-social-media",
    title: "Talu Textile Social Media Design",
    category: "Social Media",
    tags: ["Social", "Campaign", "Content System"],
    year: "2024",
    client: "Talu Textile",
    description:
      "A scalable social content system for a modern textile manufacturer.",
    overview:
      "An end-to-end social media design system for Talu Textile — templates, campaigns and a recognisable grid that scales across months of content.",
    challenge:
      "Talu posted inconsistently with no visual identity, making the brand forgettable and slow to produce.",
    solution:
      "A modular template system with a strong colour and type rhythm let the team ship on-brand posts fast, building a cohesive, premium feed.",
    tools: ["Photoshop", "Illustrator", "Figma"],
    results: [
      { label: "Engagement", value: "+60%" },
      { label: "Production Time", value: "-50%" },
      { label: "Designs", value: "100+" },
    ],
    accent: "#FF7A1A",
    behanceUrl: site.socials.behance,
    featured: true,
  },
  {
    slug: "woodora-brand-design",
    title: "Woodora Brand Design",
    category: "Branding",
    tags: ["Identity", "Logo", "Guidelines"],
    year: "2024",
    client: "Woodora",
    description:
      "Warm, crafted identity for a premium wood and interior brand.",
    overview:
      "A full identity for Woodora — a brand built on craftsmanship, warmth and natural materials translated into a refined visual system.",
    challenge:
      "Woodora needed an identity that felt both premium and handcrafted, avoiding the cold minimalism common in the category.",
    solution:
      "A bespoke wordmark, warm palette and tactile textures express craft and quality across packaging, signage and digital.",
    tools: ["Illustrator", "Photoshop", "InDesign"],
    results: [
      { label: "Identity System", value: "Complete" },
      { label: "Applications", value: "15+" },
      { label: "Perception", value: "Premium" },
    ],
    accent: "#C97A3A",
    behanceUrl: site.socials.behance,
    featured: true,
  },
  {
    slug: "natural-skin-care-branding",
    title: "Natural Skin Care Branding",
    category: "Branding",
    tags: ["Identity", "Packaging", "Beauty"],
    year: "2024",
    client: "Confidential",
    description:
      "Clean, botanical identity and packaging for a natural skincare line.",
    overview:
      "A botanical-led identity for a natural skincare line — clean, calming and credible across packaging and digital.",
    challenge:
      "The brand needed to feel scientific yet natural, standing out on shelf without losing its gentle, organic promise.",
    solution:
      "Soft neutrals, delicate botanical marks and generous space create a trustworthy, premium feel that scales across the product range.",
    tools: ["Illustrator", "Photoshop", "Figma"],
    results: [
      { label: "Shelf Appeal", value: "Elevated" },
      { label: "SKUs", value: "8+" },
      { label: "Identity", value: "Cohesive" },
    ],
    accent: "#8FA76B",
    behanceUrl: site.socials.behance,
  },
  {
    slug: "real-estate-agent-logo",
    title: "Real Estate Agent Logo Design",
    category: "Branding",
    tags: ["Logo", "Personal Brand"],
    year: "2023",
    client: "Independent Agent",
    description:
      "Distinctive personal logo system for an independent real estate agent.",
    overview:
      "A personal brand mark for an independent real estate professional — confident, memorable and flexible across every touchpoint.",
    challenge:
      "The agent needed a mark that conveyed trust and ambition while working at tiny sizes on signage, cards and social avatars.",
    solution:
      "A geometric monogram paired with a strong wordmark delivers presence at any scale, anchoring a complete personal identity.",
    tools: ["Illustrator", "Photoshop"],
    results: [
      { label: "Recognition", value: "Strong" },
      { label: "Formats", value: "Responsive" },
      { label: "Touchpoints", value: "10+" },
    ],
    accent: "#E26205",
    behanceUrl: site.socials.behance,
  },
  {
    slug: "eksatent-portable-shelter",
    title: "Eksatent Portable Shelter",
    category: "Web Design",
    tags: ["Product", "Web", "Marketing"],
    year: "2025",
    client: "Eksado",
    description:
      "Product launch identity and web presence for a portable shelter system.",
    overview:
      "Launch identity and web presence for Eksatent — a portable shelter engineered for rapid deployment, marketed with clarity and confidence.",
    challenge:
      "A technical product needed a marketing story and web experience that made its benefits instantly clear to diverse buyers.",
    solution:
      "A bold product narrative, clean spec presentation and a conversion-focused landing experience translate engineering into desire.",
    tools: ["Figma", "Photoshop", "After Effects"],
    results: [
      { label: "Clarity", value: "High" },
      { label: "Launch", value: "On-time" },
      { label: "Conversion", value: "Optimised" },
    ],
    accent: "#FF7A1A",
    behanceUrl: site.socials.behance,
    featured: true,
  },
  {
    slug: "pav-visual-identity",
    title: "PAV Visual Identity",
    category: "Branding",
    tags: ["Identity", "System", "Strategy"],
    year: "2024",
    client: "PAV",
    description:
      "Bold, modern visual identity system for an ambitious brand.",
    overview:
      "A complete visual identity for PAV — confident, contemporary and built to scale across every brand surface.",
    challenge:
      "PAV needed an identity that felt established and premium from launch, with a flexible system for future growth.",
    solution:
      "A distinctive mark, disciplined type scale and a strong colour story create a system that's instantly recognisable and easy to extend.",
    tools: ["Illustrator", "InDesign", "Figma"],
    results: [
      { label: "System", value: "Scalable" },
      { label: "Consistency", value: "100%" },
      { label: "Applications", value: "12+" },
    ],
    accent: "#5B6CFF",
    behanceUrl: site.socials.behance,
  },
  {
    slug: "hiddengarden-villas",
    title: "HiddenGarden Villas",
    category: "UI/UX",
    tags: ["Web", "Real Estate", "Product"],
    year: "2025",
    client: "HiddenGarden",
    description:
      "Immersive UI/UX for a luxury villa development experience.",
    overview:
      "An immersive digital experience for HiddenGarden Villas — guiding high-intent buyers through a luxury development with cinematic UI.",
    challenge:
      "Luxury buyers expect an experience that matches the product. The site had to feel as refined as the villas themselves.",
    solution:
      "A cinematic, scroll-driven UI with elegant galleries, interactive plans and a frictionless enquiry flow elevates perceived value.",
    tools: ["Figma", "Framer", "After Effects"],
    results: [
      { label: "Time on Site", value: "+70%" },
      { label: "Enquiries", value: "Qualified" },
      { label: "Experience", value: "Cinematic" },
    ],
    accent: "#3FA796",
    behanceUrl: site.socials.behance,
    featured: true,
  },
  {
    slug: "amazon-listing-design",
    title: "Amazon Listing Design",
    category: "Web Design",
    tags: ["E-commerce", "Content", "Conversion"],
    year: "2024",
    client: "Multiple Sellers",
    description:
      "Conversion-focused A+ content and listing imagery for Amazon brands.",
    overview:
      "High-converting Amazon listing design — A+ content, infographics and imagery engineered to win the buy box.",
    challenge:
      "Sellers were losing conversions to better-presented competitors despite strong products.",
    solution:
      "Benefit-led infographics, clean lifestyle imagery and structured A+ modules turn browsers into buyers.",
    tools: ["Photoshop", "Illustrator", "Figma"],
    results: [
      { label: "Conversion", value: "+35%" },
      { label: "Listings", value: "Multiple" },
      { label: "Presentation", value: "Premium" },
    ],
    accent: "#E2A305",
    behanceUrl: site.socials.behance,
  },
  {
    slug: "hece-gayrimenkul-branding",
    title: "Hece Gayrimenkul Branding",
    category: "Real Estate",
    tags: ["Branding", "Real Estate", "System"],
    year: "2025",
    client: "Hece Group",
    description:
      "Trustworthy, premium real estate brand for Hece Group.",
    overview:
      "A complete real estate brand for Hece Gayrimenkul — communicating trust, ambition and premium service across every touchpoint.",
    challenge:
      "Hece needed a real estate identity that signalled credibility and scale within the Hece Group ecosystem.",
    solution:
      "A refined mark, structured system and confident marketing collateral position Hece Gayrimenkul as a premium market player.",
    tools: ["Illustrator", "Photoshop", "InDesign"],
    results: [
      { label: "Positioning", value: "Premium" },
      { label: "System", value: "Cohesive" },
      { label: "Collateral", value: "Full Suite" },
    ],
    accent: "#E26205",
    behanceUrl: site.socials.behance,
    featured: true,
  },
  {
    slug: "business-card-collection",
    title: "Business Card Collection",
    category: "Branding",
    tags: ["Print", "Identity", "Collection"],
    year: "2023",
    client: "Various",
    description:
      "A curated collection of premium business card designs.",
    overview:
      "A curated collection of business card designs spanning industries — every card a small, considered piece of brand craft.",
    challenge:
      "Each client needed a memorable first impression that captured their brand in a single, tactile object.",
    solution:
      "Thoughtful typography, finishes and layouts turn each card into a premium statement of brand quality.",
    tools: ["Illustrator", "InDesign", "Photoshop"],
    results: [
      { label: "Designs", value: "20+" },
      { label: "Industries", value: "Diverse" },
      { label: "Finish", value: "Premium" },
    ],
    accent: "#A0A0A0",
    behanceUrl: site.socials.behance,
  },
  {
    slug: "art-movements-poster-collection",
    title: "Art Movements Poster Collection",
    category: "Motion",
    tags: ["Poster", "Motion", "Editorial"],
    year: "2024",
    client: "Personal",
    description:
      "An expressive poster & motion series exploring modern art movements.",
    overview:
      "A personal poster and motion series interpreting historic art movements through a contemporary, kinetic lens.",
    challenge:
      "Translating the spirit of distinct art movements into a cohesive yet expressive modern visual series.",
    solution:
      "Each piece pairs bold editorial layout with motion studies, celebrating the movement while pushing a personal style.",
    tools: ["Illustrator", "After Effects", "Photoshop"],
    results: [
      { label: "Posters", value: "Series" },
      { label: "Motion", value: "Studies" },
      { label: "Style", value: "Distinct" },
    ],
    accent: "#D94F70",
    behanceUrl: site.socials.behance,
    featured: true,
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  return next;
}

export const featuredProjects = projects.filter((p) => p.featured);
