// FNGN Dijital — shared brand kit for daily reels.
// Colors / fonts mirror the website (tailwind.config.ts + app/layout.tsx).
import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { loadFont as loadDisplay } from "@remotion/google-fonts/BricolageGrotesque";
import { loadFont as loadSans } from "@remotion/google-fonts/HankenGrotesk";
import { loadFont as loadSerif } from "@remotion/google-fonts/InstrumentSerif";

const subsets: ("latin" | "latin-ext")[] = ["latin", "latin-ext"];
export const fonts = {
  display: loadDisplay("normal", { weights: ["500", "600", "700", "800"], subsets }).fontFamily,
  sans: loadSans("normal", { weights: ["400", "500", "600"], subsets }).fontFamily,
  serif: loadSerif("italic", { weights: ["400"], subsets }).fontFamily,
};

export const C = {
  bg: "#080808",
  surface: "#111111",
  surface2: "#181818",
  fg: "#F5F5F5",
  muted: "#A0A0A0",
  accent: "#E26205",
  accentHi: "#FF7A1A",
  line: "rgba(255,255,255,0.10)",
};

export const HANDLE = "@fngndijital";
export const SITE = "fngn.com.tr";

/** seconds -> frames (30fps) */
export const s = (sec: number) => Math.round(sec * 30);

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

/** 0..1 eased progress between two frames */
export const prog = (frame: number, from: number, dur: number) =>
  interpolate(frame, [from, from + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: easeOut,
  });

export const useSpring = (delay: number, damping = 14, stiffness = 140) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping, stiffness } });
};

/** Text that rises in from a blur, word by word */
export const Reveal: React.FC<{
  text: string;
  at: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number) => React.CSSProperties | undefined;
}> = ({ text, at, stagger = 3, style, wordStyle }) => {
  const frame = useCurrentFrame();
  const words = text.split(" ");
  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.26em", ...style }}>
      {words.map((w, i) => {
        const p = prog(frame, at + i * stagger, 14);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: p,
              transform: `translateY(${(1 - p) * 40}px)`,
              filter: `blur(${(1 - p) * 12}px)`,
              ...wordStyle?.(i),
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Dark canvas with drifting blurred orange rings + film grain + vignette */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const rings = [
    { x: -180, y: 180, r: 420, sp: 0.004, ph: 0 },
    { x: 760, y: 1500, r: 520, sp: 0.003, ph: 2 },
    { x: 820, y: -120, r: 300, sp: 0.005, ph: 4 },
  ];
  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1200px 900px at 50% 40%, rgba(226,98,5,0.09), transparent 60%)`,
        }}
      />
      {rings.map((r, i) => {
        const dx = Math.sin(frame * r.sp * 6 + r.ph) * 40;
        const dy = Math.cos(frame * r.sp * 5 + r.ph) * 50;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: r.x + dx,
              top: r.y + dy,
              width: r.r * 2,
              height: r.r * 2,
              borderRadius: "50%",
              border: `70px solid rgba(226,98,5,0.12)`,
              filter: "blur(40px)",
            }}
          />
        );
      })}
      <svg width="100%" height="100%" style={{ position: "absolute", opacity: 0.07, mixBlendMode: "screen" }}>
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={frame % 8} />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>
      <AbsoluteFill
        style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.65) 100%)" }}
      />
    </AbsoluteFill>
  );
};

/** The orange F mark from the site favicon */
export const FMark: React.FC<{ size: number; dot?: boolean }> = ({ size, dot = true }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <path d="M22 15h23v8H31v7.5h12.5v8H31V49h-9V15Z" fill={C.accent} />
    {dot && <circle cx="45.5" cy="45.5" r="3.4" fill={C.accentHi} />}
  </svg>
);

/** Persistent header: brand top-left, handle top-right, progress bar */
export const Chrome: React.FC<{ total: number; series?: string }> = ({ total, series }) => {
  const frame = useCurrentFrame();
  const appear = prog(frame, 4, 20);
  return (
    <AbsoluteFill style={{ opacity: appear, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          top: 120,
          left: 80,
          right: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: fonts.sans,
          color: C.muted,
          fontSize: 30,
          letterSpacing: "0.04em",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "#0c0c0c",
              border: `1.5px solid ${C.line}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FMark size={56} />
          </div>
          <span style={{ fontFamily: fonts.display, fontWeight: 700, color: C.fg, letterSpacing: "0.02em" }}>
            FNGN <span style={{ color: C.muted, fontWeight: 500 }}>Dijital</span>
          </span>
        </div>
        {series && (
          <span
            style={{
              border: `1.5px solid ${C.line}`,
              borderRadius: 999,
              padding: "10px 22px",
              fontSize: 24,
              textTransform: "uppercase",
              letterSpacing: "0.14em",
            }}
          >
            {series}
          </span>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 80,
          right: 80,
          height: 4,
          borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
        }}
      >
        <div style={{ width: `${(frame / total) * 100}%`, height: "100%", background: C.accent }} />
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 140,
          left: 80,
          fontFamily: fonts.sans,
          fontSize: 24,
          color: C.muted,
          letterSpacing: "0.08em",
        }}
      >
        {HANDLE}
      </div>
    </AbsoluteFill>
  );
};

/** Rounded pill chip */
export const Pill: React.FC<{
  label: string;
  at: number;
  filled?: boolean;
  size?: number;
}> = ({ label, at, filled, size = 46 }) => {
  const sp = useSpring(at, 12, 170);
  const frame = useCurrentFrame();
  const glow = interpolate(frame - at, [0, 10, 40], [0, 1, 0.35], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        transform: `scale(${sp}) translateY(${(1 - sp) * 30}px)`,
        opacity: Math.min(1, sp * 1.4),
        fontFamily: fonts.sans,
        fontWeight: 500,
        fontSize: size,
        padding: `${size * 0.38}px ${size * 0.8}px`,
        borderRadius: 999,
        whiteSpace: "nowrap",
        color: filled ? "#0b0b0b" : C.fg,
        background: filled ? C.accent : "rgba(255,255,255,0.03)",
        border: `2.5px solid ${filled ? C.accent : "rgba(245,245,245,0.75)"}`,
        boxShadow: filled ? `0 0 ${60 * glow}px rgba(226,98,5,${0.6 * glow})` : "none",
      }}
    >
      {label}
    </div>
  );
};

/** Fades a scene in and out over its own sequence window */
export const SceneFade: React.FC<{ dur: number; children: React.ReactNode; inF?: number; outF?: number }> = ({
  dur,
  children,
  inF = 8,
  outF = 8,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, inF, dur - outF, dur], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const blur = interpolate(frame, [dur - outF, dur], [0, 14], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>;
};

/** Closing card: logo, handle, CTA */
export const Outro: React.FC<{ cta?: string }> = ({ cta = "Kaydet · Paylaş · Takip et" }) => {
  const frame = useCurrentFrame();
  const logo = useSpring(0, 13, 120);
  const t1 = prog(frame, 10, 18);
  const t2 = prog(frame, 20, 18);
  const t3 = prog(frame, 32, 18);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40 }}>
      <div
        style={{
          width: 260,
          height: 260,
          borderRadius: 64,
          background: "#0c0c0c",
          border: `3px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${logo}) rotate(${(1 - logo) * -20}deg)`,
          boxShadow: `0 0 0 2px rgba(226,98,5,0.18), 0 40px 120px -30px rgba(226,98,5,0.6)`,
        }}
      >
        <FMark size={230} />
      </div>
      <div
        style={{
          opacity: t1,
          transform: `translateY(${(1 - t1) * 30}px)`,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: 96,
          color: C.fg,
          letterSpacing: "-0.03em",
        }}
      >
        FNGN <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>Dijital</span>
      </div>
      <div style={{ opacity: t2, fontFamily: fonts.sans, fontSize: 44, color: C.muted, letterSpacing: "0.06em" }}>
        {HANDLE} · {SITE}
      </div>
      <div
        style={{
          opacity: t3,
          transform: `translateY(${(1 - t3) * 20}px)`,
          marginTop: 30,
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 38,
          color: "#0b0b0b",
          background: C.accent,
          padding: "22px 48px",
          borderRadius: 999,
        }}
      >
        {cta}
      </div>
    </AbsoluteFill>
  );
};
