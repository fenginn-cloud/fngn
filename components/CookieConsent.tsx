"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { useConsent } from "./ConsentProvider";
import { useLanguage } from "./LanguageProvider";

export function CookieConsent() {
  const { consent, ready, accept, reject } = useConsent();
  const { t } = useLanguage();
  const c = t.consent;

  const show = ready && consent === "unset";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-[70] p-4 sm:p-6"
          role="dialog"
          aria-live="polite"
          aria-label={c.title}
        >
          <div className="glass mx-auto flex max-w-container flex-col gap-5 rounded-3xl p-5 shadow-soft sm:flex-row sm:items-center sm:gap-6 sm:p-6">
            <div className="flex flex-1 items-start gap-4">
              <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-line bg-background text-accent sm:flex">
                <Cookie className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-base font-semibold text-foreground">
                  {c.title}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-muted">
                  {c.text}{" "}
                  <Link
                    href="/gizlilik"
                    className="text-accent underline-offset-2 hover:underline"
                  >
                    {c.learnMore}
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex shrink-0 gap-3">
              <button
                type="button"
                onClick={reject}
                className="btn-ghost flex-1 px-5 py-2.5 text-sm sm:flex-none"
              >
                {c.reject}
              </button>
              <button
                type="button"
                onClick={accept}
                className="btn-primary flex-1 px-6 py-2.5 text-sm sm:flex-none"
              >
                {c.accept}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
