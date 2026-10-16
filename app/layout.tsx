import type { Metadata, Viewport } from "next";
import {
  Bricolage_Grotesque,
  Hanken_Grotesk,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import {
  personSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { Grain } from "@/components/Grain";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ConsentProvider } from "@/components/ConsentProvider";
import { CookieConsent } from "@/components/CookieConsent";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { Analytics } from "@vercel/analytics/next";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["400"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#080808",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.fullName} | ${site.roleTr}`,
    template: `%s — ${site.name}`,
  },
  description: site.descriptionTr,
  applicationName: site.name,
  authors: [{ name: site.fullName, url: site.url }],
  creator: site.fullName,
  publisher: site.name,
  keywords: [
    // Brand & name
    "Mahmud Feyzullah Engin",
    "FNGN",
    "FNGN Dijital",
    // English
    "Digital Designer",
    "Creative Technologist",
    "UI/UX Design",
    "Web Design",
    "Brand Identity",
    "Social Media Design",
    "Real Estate Marketing",
    "Frontend Developer",
    // Türkçe
    "dijital tasarımcı",
    "marka kimliği tasarımı",
    "logo tasarımı",
    "sosyal medya tasarımı",
    "web tasarım",
    "web sitesi tasarımı",
    "gayrimenkul pazarlama",
    "gayrimenkul sosyal medya",
    "kreatif tasarımcı",
    "grafik tasarımcı",
    "freelance tasarımcı",
    // Coğrafi
    "Sakarya tasarımcı",
    "Sakarya sosyal medya ajansı",
    "İstanbul tasarımcı",
    "Türkiye",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    alternateLocale: ["en_US"],
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.fullName}`,
    description: site.descriptionTr,
    // Social preview image is generated automatically by app/opengraph-image.tsx
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.fullName}`,
    description: site.descriptionTr,
    creator: "@fenginn",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  // Favicon + apple icon are provided by app/icon.svg and app/apple-icon.tsx
  manifest: "/site.webmanifest",
  category: "portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${display.variable} ${sans.variable} ${serif.variable}`}
    >
      <body className="bg-background text-foreground">
        <JsonLd data={personSchema()} />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
        <Grain />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-sm focus:font-medium focus:text-[#080808]"
        >
          Skip to content
        </a>
        <ConsentProvider>
          <LanguageProvider>
            {children}
            <WhatsAppButton />
            <CookieConsent />
          </LanguageProvider>
          <GoogleAnalytics />
        </ConsentProvider>
        <Analytics />
      </body>
    </html>
  );
}
