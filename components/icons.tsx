import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7 10v7" />
      <path d="M7 7.2v.01" />
      <path d="M11.5 17v-3.6a2.4 2.4 0 0 1 4.8 0V17" />
      <path d="M11.5 10v7" />
    </svg>
  );
}

export function BehanceIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7.5h4.2a2.4 2.4 0 0 1 0 4.8H3z" />
      <path d="M3 12.3h4.6a2.6 2.6 0 0 1 0 5.2H3z" />
      <path d="M3 7.5v10" />
      <path d="M15 6.6h4" />
      <path d="M14.2 13.4h6a3 3 0 0 0-6 0v.6a3 3 0 0 0 5.2 1.9" />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 7.5 6.6 4.7a2.4 2.4 0 0 0 2.8 0L20 7.5" />
    </svg>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4.5 5.5C4.5 4.7 5.2 4 6 4h2.2c.7 0 1.3.5 1.4 1.2l.6 3a1.5 1.5 0 0 1-.4 1.4l-1.2 1.2a12 12 0 0 0 5 5l1.2-1.2a1.5 1.5 0 0 1 1.4-.4l3 .6c.7.1 1.2.7 1.2 1.4V18c0 .8-.7 1.5-1.5 1.5C10.6 19.5 4.5 13.4 4.5 5.5Z" />
    </svg>
  );
}

export function ArrowUpRight(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

export const socialIconMap = {
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  behance: BehanceIcon,
  email: MailIcon,
  phone: PhoneIcon,
} as const;
