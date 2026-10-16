import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { PrivacyContent } from "@/components/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy & Cookie Policy",
  description:
    "How FNGN (Mahmud Feyzullah Engin) uses cookies and handles data, in line with KVKK and GDPR.",
  alternates: { canonical: "/gizlilik" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <PrivacyContent />
      <Footer />
    </>
  );
}
