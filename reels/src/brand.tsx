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
        <Logo width={190} sub={false} />
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
      <div style={{ transform: `scale(${0.8 + logo * 0.2})`, opacity: logo, filter: "drop-shadow(0 30px 60px rgba(226,98,5,0.35))" }}>
        <Logo width={760} parts={{ sub: t1 }} />
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

/* ---------- Official FNGN DIGITAL wordmark (traced from the brand's profile logo) ----------
   Parts can be animated: f1 = F top bar, f2 = F second bar, stem = F stem, ngn = "NGN", sub = "DIGITAL".
   viewBox 0 0 1762 545 (wordmark height 368, DIGITAL baseline ≈ 543). */
export const LOGO_ORANGE = "#FF5F0F";
type LogoParts = { f1?: number; f2?: number; stem?: number; ngn?: number; sub?: number };
const N_PATH = (dx: number) => `M${440 + dx} 0 H${552 + dx} L${755 + dx} 268 V0 H${850 + dx} V368 H${738 + dx} L${537 + dx} 100 V368 H${440 + dx} Z`;
const G_PATH = "M987 0 H1307 V96 H1037 Q982 96 982 151 V218 Q982 273 1037 273 H1102 V234 H1307 V368 H987 Q887 368 887 268 V100 Q887 0 987 0 Z";
export const Logo: React.FC<{ width: number; color?: string; accent?: string; sub?: boolean; parts?: LogoParts; style?: React.CSSProperties }> = ({
  width, color = "#FFFFFF", accent = LOGO_ORANGE, sub = true, parts = {}, style,
}) => {
  const { f1 = 1, f2 = 1, stem = 1, ngn = 1, sub: subO = 1 } = parts;
  const h = sub ? 545 : 368;
  return (
    <svg width={width} height={(width * h) / 1762} viewBox={`0 0 1762 ${h}`} style={{ overflow: "visible", ...style }}>
      <rect x={0} y={0} width={402 * f1} height={96} fill={color} />
      <rect x={0} y={135} width={402 * f2} height={93} fill={color} />
      <rect x={0} y={135} width={87} height={233 * stem} fill={color} />
      <g opacity={ngn} transform={`translate(${(1 - ngn) * 60} 0)`}>
        <path d={N_PATH(0)} fill={color} />
        <path d={G_PATH} fill={color} />
        <path d={N_PATH(910)} fill={accent} />
      </g>
      {sub && (
        <text x={362} y={543} textLength={1040} lengthAdjust="spacing" opacity={subO}
          style={{ fontFamily: fonts.sans, fontWeight: 400, fontSize: 92, fill: color }}>DIGITAL</text>
      )}
    </svg>
  );
};
/* round black badge, like the Instagram profile picture */
export const LogoBadge: React.FC<{ size: number }> = ({ size }) => (
  <div style={{ width: size, height: size, borderRadius: size / 2, background: "#000", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.12)" }}>
    <Logo width={size * 0.68} />
  </div>
);
