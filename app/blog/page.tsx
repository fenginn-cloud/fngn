import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogList } from "@/components/BlogList";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Markalar ve gayrimenkul için marka, sosyal medya, web ve dijital pazarlama üzerine pratik yazılar — FNGN / Mahmud Feyzullah Engin.",
  alternates: { canonical: "/blog" },
  openGraph: {
    type: "website",
    url: `${site.url}/blog`,
    title: `Blog — ${site.name}`,
    description:
      "Marka, sosyal medya ve dijital pazarlama üzerine pratik yazılar.",
  },
};

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <BlogList />
      <Footer />
    </>
  );
}
