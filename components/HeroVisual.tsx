"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Premium animated FNGN composition — layered abstract shapes, an orbiting
 * monogram and a soft gradient mesh. Pure SVG + Framer Motion, no assets.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();

  return (
    <div className="relative aspect-square w-full max-w-[520px]">
      {/* gradient mesh glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-accent/30 blur-[90px]" />
        <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-accent-hover/20 blur-[80px]" />
      </div>

      {/* rotating rings */}
      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <linearGradient id="ring1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E26205" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#E26205" stopOpacity="0" />
          </linearGradient>
        </defs>
        <circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="url(#ring1)"
          strokeWidth="1"
          strokeDasharray="2 8"
        />
        <circle
          cx="200"
          cy="200"
          r="150"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
        />
      </motion.svg>

      <motion.svg
        viewBox="0 0 400 400"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
        animate={reduce ? {} : { rotate: -360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="200"
          cy="200"
          r="120"
          fill="none"
          stroke="rgba(226,98,5,0.25)"
          strokeWidth="1"
          strokeDasharray="1 14"
        />
      </motion.svg>

      {/* central glass monogram */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="glass relative flex h-44 w-44 items-center justify-center rounded-[2rem] shadow-glow sm:h-52 sm:w-52">
          <span className="accent-gradient-text font-display text-6xl font-extrabold tracking-tightest sm:text-7xl">
            FN
          </span>
          <span className="absolute -bottom-4 right-6 font-display text-3xl font-bold text-foreground/80">
            GN
          </span>
          <span className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10" />
        </div>
      </motion.div>

      {/* floating chips */}
      <FloatingChip
        className="left-0 top-10"
        delay={0}
        reduce={reduce}
        label="UI / UX"
      />
      <FloatingChip
        className="right-0 top-24"
        delay={1.2}
        reduce={reduce}
        label="Branding"
      />
      <FloatingChip
        className="bottom-12 left-6"
        delay={0.6}
        reduce={reduce}
        label="Motion"
      />
      <FloatingChip
        className="bottom-4 right-10"
        delay={1.8}
        reduce={reduce}
        label="Frontend"
      />

      {/* orbiting dot */}
      <motion.div
        className="absolute inset-0"
        aria-hidden="true"
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-accent shadow-glow" />
      </motion.div>
    </div>
  );
}

function FloatingChip({
  className,
  label,
  delay,
  reduce,
}: {
  className: string;
  label: string;
  delay: number;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      className={`absolute ${className}`}
      animate={reduce ? {} : { y: [0, -12, 0] }}
      transition={{
        duration: 6,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground/90 shadow-soft">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {label}
      </span>
    </motion.div>
  );
}
