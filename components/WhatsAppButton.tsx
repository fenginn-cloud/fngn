"use client";

import { motion } from "framer-motion";
import { track } from "@vercel/analytics";
import { site } from "@/data/site";
import { useLanguage } from "./LanguageProvider";
import { useConsent } from "./ConsentProvider";

const WA_NUMBER = site.whatsapp.replace(/[^0-9]/g, ""); // 905334606154

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.27-1.38a9.9 9.9 0 0 0 4.77 1.22h.004c5.46 0 9.9-4.44 9.9-9.9 0-2.64-1.03-5.13-2.9-7A9.82 9.82 0 0 0 12.04 2Zm0 1.8c2.16 0 4.19.84 5.72 2.37a8.04 8.04 0 0 1 2.37 5.73c0 4.47-3.64 8.1-8.11 8.1a8.1 8.1 0 0 1-4.12-1.13l-.3-.18-3.06.8.82-2.98-.2-.31a8.03 8.03 0 0 1-1.25-4.3c0-4.47 3.64-8.1 8.11-8.1Zm-2.9 4.3c-.14 0-.37.05-.56.26-.19.21-.73.72-.73 1.74s.75 2.02.85 2.16c.1.14 1.47 2.37 3.66 3.23 1.82.72 2.19.58 2.58.54.4-.04 1.27-.52 1.45-1.02.18-.5.18-.94.13-1.03-.05-.09-.19-.14-.4-.25-.21-.1-1.27-.63-1.46-.7-.2-.07-.34-.1-.48.11-.14.21-.55.7-.68.84-.12.14-.25.16-.46.05-.21-.1-.9-.33-1.72-1.06-.63-.57-1.06-1.27-1.19-1.48-.12-.21-.01-.33.09-.43.09-.09.21-.25.31-.37.1-.12.14-.21.21-.35.07-.14.03-.26-.02-.37-.05-.1-.47-1.17-.65-1.6-.17-.42-.34-.36-.47-.37h-.4Z" />
    </svg>
  );
}

export function WhatsAppButton() {
  const { t } = useLanguage();
  const { consent, ready } = useConsent();

  // Hide while the cookie banner is open so they don't overlap.
  const bannerOpen = ready && consent === "unset";
  if (bannerOpen) return null;

  const href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    t.whatsapp.message,
  )}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsapp.aria}
      onClick={() => track("whatsapp_click")}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="group fixed bottom-5 left-5 z-[60] flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] px-4 py-4 text-[#0a0a0a] shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition-all duration-300 hover:gap-2 hover:pr-5 sm:bottom-6 sm:left-6"
    >
      <WhatsAppGlyph />
      <span className="max-w-0 whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[160px] group-hover:opacity-100">
        {t.whatsapp.label}
      </span>
      <span className="absolute inset-0 -z-10 rounded-full bg-[#25D366] opacity-60 blur-md transition-opacity duration-300 group-hover:opacity-90" />
    </motion.a>
  );
}
