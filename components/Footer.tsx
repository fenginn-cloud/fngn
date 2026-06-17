"use client";

import { site } from "@/data/site";
import { useLanguage } from "./LanguageProvider";
import {
  BehanceIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PhoneIcon,
} from "./icons";

const socials = [
  { label: "Instagram", href: site.socials.instagram, Icon: InstagramIcon },
  { label: "LinkedIn", href: site.socials.linkedin, Icon: LinkedInIcon },
  { label: "Behance", href: site.socials.behance, Icon: BehanceIcon },
  { label: "Email", href: `mailto:${site.email}`, Icon: MailIcon },
  { label: "Phone", href: `tel:${site.phoneHref}`, Icon: PhoneIcon },
];

export function Footer() {
  const { t } = useLanguage();
  const f = t.footer;

  return (
    <footer className="relative overflow-hidden border-t border-line">
      <div className="container-x py-16">
        {/* oversized brand wordmark */}
        <div
          className="pointer-events-none select-none text-center font-display text-[18vw] font-bold leading-none tracking-tightest text-white/[0.03] sm:text-[16vw]"
          aria-hidden="true"
        >
          FNGN
        </div>

        <div className="-mt-[6vw] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center">
              <span className="font-display text-lg font-bold tracking-tightest">
                FNGN
              </span>
              <span className="ml-1 h-1.5 w-1.5 rounded-full bg-accent" />
            </div>
            <p className="mt-5 max-w-sm font-display text-lg leading-snug text-foreground">
              {f.tagline.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < f.tagline.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted">
              {f.navHeading}
            </h3>
            <ul className="mt-5 space-y-3 text-sm">
              {f.navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="text-muted transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-muted">
              {f.connectHeading}
            </h3>
            <div className="mt-5 flex flex-wrap gap-2">
              {socials.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent hover:text-accent"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 text-sm text-muted sm:flex-row">
          <p>{f.rights}</p>
          <p>
            {site.fullName} — {site.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
