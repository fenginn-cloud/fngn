import Image from "next/image";

function initials(title: string) {
  const words = title.replace(/[^a-zA-Z0-9 ]/g, "").split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Deterministic premium placeholder built entirely from SVG.
 * Renders abstract layered shapes tinted with the project accent — so the
 * grid always looks intentional even before real artwork is added.
 */
export function Placeholder({
  title,
  accent = "#E26205",
  category,
  className,
}: {
  title: string;
  accent?: string;
  category?: string;
  className?: string;
}) {
  const id = title.replace(/[^a-z0-9]/gi, "").toLowerCase();
  return (
    <div
      className={className}
      style={{ background: "#0c0c0c" }}
      role="img"
      aria-label={`${title} — placeholder artwork`}
    >
      <svg
        viewBox="0 0 800 600"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id={`g-${id}`} cx="30%" cy="25%" r="90%">
            <stop offset="0%" stopColor={accent} stopOpacity="0.45" />
            <stop offset="55%" stopColor={accent} stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`l-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#161616" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </linearGradient>
        </defs>
        <rect width="800" height="600" fill={`url(#l-${id})`} />
        <rect width="800" height="600" fill={`url(#g-${id})`} />
        <g stroke={accent} strokeOpacity="0.18" fill="none" strokeWidth="1.2">
          <circle cx="610" cy="150" r="120" />
          <circle cx="610" cy="150" r="180" />
          <circle cx="610" cy="150" r="240" />
        </g>
        <g fill="none" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={i} x1={i * 100} y1="0" x2={i * 100} y2="600" />
          ))}
        </g>
        <rect
          x="60"
          y="380"
          width="180"
          height="180"
          rx="20"
          fill={accent}
          fillOpacity="0.14"
          transform="rotate(-8 150 470)"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-start justify-end p-6">
        <span
          className="font-display text-6xl font-bold leading-none tracking-tightest"
          style={{ color: accent }}
        >
          {initials(title)}
        </span>
        {category ? (
          <span className="mt-2 text-xs uppercase tracking-[0.25em] text-muted">
            {category}
          </span>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Renders a real image when a src is provided, otherwise the premium
 * placeholder. Keeps every consumer simple and resilient to missing assets.
 */
export function ProjectImage({
  src,
  alt,
  title,
  accent,
  category,
  className,
  sizes,
  priority,
}: {
  src?: string;
  alt: string;
  title: string;
  accent?: string;
  category?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (!src) {
    return (
      <div className={`relative overflow-hidden ${className ?? ""}`}>
        <Placeholder
          title={title}
          accent={accent}
          category={category}
          className="absolute inset-0"
        />
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? "(max-width: 768px) 100vw, 50vw"}
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
