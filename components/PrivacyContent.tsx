"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { useConsent } from "./ConsentProvider";
import { Reveal } from "./Reveal";

export function PrivacyContent() {
  const { t } = useLanguage();
  const { reset } = useConsent();
  const p = t.privacy;

  return (
    <main id="main" className="relative pb-24 pt-32">
      <div className="container-x max-w-3xl">
        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {p.backHome}
          </Link>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="mt-8 text-4xl font-bold leading-[1.05] sm:text-5xl">
            {p.title}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-sm text-muted">{p.updated}</p>
        </Reveal>

        <div className="mt-12 space-y-10">
          {p.sections.map((s, i) => (
            <Reveal key={s.heading} delay={0.05 * i}>
              <section>
                <h2 className="font-display text-xl font-semibold sm:text-2xl">
                  {s.heading}
                </h2>
                <p className="mt-3 text-base leading-relaxed text-muted">
                  {s.body}
                </p>
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-12 border-t border-line pt-8">
            <button
              type="button"
              onClick={reset}
              className="btn-ghost text-sm"
            >
              {t.footer.cookiePrefs}
            </button>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
