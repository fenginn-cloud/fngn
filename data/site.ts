export const site = {
  name: "FNGN",
  fullName: "Mahmud Feyzullah Engin",
  role: "Digital Designer & Creative Technologist",
  url: "https://fngn.com.tr",
  domain: "fngn.com.tr",
  description:
    "Mahmud Feyzullah Engin (FNGN) is a digital designer and creative technologist crafting digital experiences, visual identities and software-driven solutions for brands, real estate businesses and modern products.",
  email: "hello@fngn.com.tr",
  phone: "+90 553 686 07 04",
  phoneHref: "+905536860704",
  location: "Istanbul, Türkiye",
  socials: {
    instagram: "https://www.instagram.com/fenginn",
    linkedin:
      "https://www.linkedin.com/in/mahmud-feyzullah-engin-93766723a/",
    behance: "https://www.behance.net/mahmutengin",
  },
} as const;

export type Social = keyof typeof site.socials;

export const navLinks = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Expertise", href: "#expertise" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
] as const;

export const stats = [
  { value: 50, suffix: "+", label: "Design Projects" },
  { value: 20, suffix: "+", label: "Web Projects" },
  { value: 5, suffix: "+", label: "Brand Identity Systems" },
  { value: 100, suffix: "+", label: "Social Media Designs" },
] as const;

export const expertise = [
  {
    title: "UI/UX Design",
    description:
      "Intuitive interfaces and product flows built around real user behaviour and clarity.",
  },
  {
    title: "Web Design",
    description:
      "High-end marketing sites and web experiences that convert and feel alive.",
  },
  {
    title: "Software Interfaces",
    description:
      "Dashboards, tools and SaaS surfaces designed for speed and confidence.",
  },
  {
    title: "Brand Identity",
    description:
      "Logos, systems and guidelines that give brands a distinct, lasting voice.",
  },
  {
    title: "Social Media Design",
    description:
      "Scroll-stopping campaign systems engineered for reach and recognition.",
  },
  {
    title: "Creative Direction",
    description:
      "Holistic art direction that aligns visuals, message and business goals.",
  },
  {
    title: "Motion Graphics",
    description:
      "Kinetic typography and animation that bring static identities to life.",
  },
  {
    title: "Real Estate Marketing",
    description:
      "Listing, residence and development campaigns that sell the experience.",
  },
  {
    title: "Frontend Development",
    description:
      "Production React / Next.js builds — pixel-faithful, fast and accessible.",
  },
] as const;

export const timeline = [
  {
    company: "RE/MAX Dream",
    role: "Social Media & IT",
    description:
      "Driving social media strategy, creative production and IT operations for a leading real estate brand.",
  },
  {
    company: "Ertemel Investment",
    role: "Marketing & Design",
    description:
      "Leading marketing creative and brand communication for an investment-focused real estate venture.",
  },
  {
    company: "Cabir Group",
    role: "Visual Design",
    description:
      "Producing visual design and brand collateral across the group's ventures.",
  },
  {
    company: "TRT",
    role: "Broadcast Coordination",
    description:
      "Broadcast coordination experience within Türkiye's national public broadcaster.",
  },
  {
    company: "Ipsi Initiative",
    role: "Social Media Editor",
    description:
      "Editing and shaping social media content for a purpose-driven initiative.",
  },
  {
    company: "Copy BA",
    role: "Graphic Designer & Illustrator",
    description:
      "Crafting graphic design systems and original illustration work for clients.",
  },
] as const;

export const clients = [
  { name: "RE/MAX Dream", field: "Real Estate" },
  { name: "Dream Residence", field: "Residential Development" },
  { name: "Eksado", field: "Product & Industry" },
  { name: "Sapanca Kurtköyspor", field: "Sports Club" },
  { name: "Hece Group", field: "Holding" },
  { name: "Kartvizit.up", field: "Digital Business Cards" },
] as const;

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    description:
      "Deep research into goals, audience and market to define the strategic foundation.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Concepts, systems and high-fidelity design that translate strategy into form.",
  },
  {
    step: "03",
    title: "Build",
    description:
      "Production-grade development and asset delivery, faithful to the design vision.",
  },
  {
    step: "04",
    title: "Launch",
    description:
      "Refinement, handoff and launch support — built to perform from day one.",
  },
] as const;
