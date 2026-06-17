"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { site } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";
import { useLanguage } from "./LanguageProvider";
import {
  BehanceIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
} from "./icons";

const channels = [
  {
    key: "email" as const,
    value: site.email,
    href: `mailto:${site.email}`,
    Icon: MailIcon,
    copyable: true,
  },
  {
    key: "phone" as const,
    value: site.phone,
    href: `tel:${site.phoneHref}`,
    Icon: PhoneIcon,
    copyable: true,
  },
  {
    key: "instagram" as const,
    value: "@fenginn",
    href: site.socials.instagram,
    Icon: InstagramIcon,
    copyable: false,
  },
  {
    key: "linkedin" as const,
    value: "Mahmud Feyzullah Engin",
    href: site.socials.linkedin,
    Icon: LinkedInIcon,
    copyable: false,
  },
  {
    key: "behance" as const,
    value: "mahmutengin",
    href: site.socials.behance,
    Icon: BehanceIcon,
    copyable: false,
  },
];

export function Contact() {
  const { t } = useLanguage();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (key: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(key);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      // clipboard unavailable — silently ignore
    }
  };

  return (
    <section id="contact" className="relative scroll-mt-24 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 mx-auto h-72 max-w-4xl -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
      <div className="container-x">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow={t.contact.eyebrow}
              title={t.contact.title}
              description={t.contact.description}
            />
            <Reveal delay={0.15}>
              <a href={`mailto:${site.email}`} className="btn-primary mt-9 group">
                {t.contact.startProject}
                <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </Reveal>
          </div>

          <div className="flex flex-col gap-3">
            {channels.map((c, i) => (
              <motion.div
                key={c.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 transition-all duration-300 hover:border-white/15 hover:bg-surface-2"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-line bg-background text-accent transition-colors duration-300 group-hover:border-accent/40">
                  <c.Icon className="h-5 w-5" />
                </span>
                <a
                  href={c.href}
                  target={c.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    c.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="min-w-0 flex-1"
                >
                  <span className="block text-xs uppercase tracking-[0.18em] text-muted">
                    {t.contact.labels[c.key]}
                  </span>
                  <span className="block truncate text-base font-medium text-foreground transition-colors group-hover:text-accent">
                    {c.value}
                  </span>
                </a>
                {c.copyable ? (
                  <button
                    type="button"
                    onClick={() => copy(c.key, c.value)}
                    aria-label={`${t.contact.copy} ${t.contact.labels[c.key]}`}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-muted transition-all duration-300 hover:border-accent hover:text-accent"
                  >
                    {copied === c.key ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
