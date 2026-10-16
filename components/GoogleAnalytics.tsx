"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GA_MEASUREMENT_ID } from "@/data/site";
import { useConsent } from "./ConsentProvider";

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

/**
 * Google Analytics 4 — loaded ONLY after the visitor grants cookie consent
 * (KVKK / GDPR opt-in). Does nothing when no Measurement ID is configured.
 */
export function GoogleAnalytics() {
  const { consent } = useConsent();
  const pathname = usePathname();

  const enabled = consent === "granted" && Boolean(GA_MEASUREMENT_ID);

  // Track client-side navigations as page views.
  useEffect(() => {
    if (!enabled || typeof window.gtag !== "function") return;
    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, enabled]);

  if (!enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
