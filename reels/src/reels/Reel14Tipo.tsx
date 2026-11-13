// Reel 14 — kinetic typography show on the reference's song (public/music14.mp3, taken from the reference file).
// Everything is timed to the reference's own cuts (seconds below = song time). Only single key words of the
// song are set as type hits, in FNGN colours and fonts; the "face" section turns into the FNGN F mark,
// the shape section uses the brand palette and the end card is FNGN Dijital.
import React from "react";
import { AbsoluteFill, Audio, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, HANDLE, LOGO_ORANGE, Logo, fonts, s } from "../brand";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.25) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const pop = (t: number, a: number, d = 0.25) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.4)) });
const pio = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const useT = () => useCurrentFrame() / 30;
const END = 34.6;
export const REEL14_FRAMES = s(END);

const LIGHT = "#F4ECE3", INK = "#2A1206", OR = C.accent, DARK = "#120704", ORL = "#FF8A3D", MUTE = "#B9A595";

/* ---------- bulged grid ---------- */
const Grid: React.FC<{ dark?: boolean; t: number }> = ({ dark, t }) => {
  const b = 0.16 + Math.sin(t * 2.2) * 0.02;
  const col = dark ? "#3b1a0b" : "#dcc4b0";
  const lines: string[] = [];
  for (let x = -60; x <= 1140; x += 120) {
    const cx = x + (x - 540) * b;
    lines.push(`M${x} -40 Q${cx} 960 ${x} 1960`);
  }
  for (let y = -40; y <= 1960; y += 120) {
    const cy = y + (y - 960) * b * 0.6;
    lines.push(`M-40 ${y} Q540 ${cy} 1120 ${y}`);
  }
  return (
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
      {lines.map((d, i) => <path key={i} d={d} stroke={col} strokeWidth={3} fill="none" />)}
    </svg>
  );
};
const Bg: React.FC<{ dark?: boolean; children?: React.ReactNode }> = ({ dark, children }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: dark ? `radial-gradient(ellipse at 50% 45%, #2a1007, ${DARK} 70%)` : `radial-gradient(ellipse at 50% 45%, #fff8f1, ${LIGHT} 70%)`, overflow: "hidden" }}>
      <Grid dark={dark} t={t} />
      {children}
    </AbsoluteFill>
  );
};

const W: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div style={{ position: "absolute", left: 0, right: 0, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 0.95, ...style }}>{children}</div>
);

/* ---------- A: YOU SHOULD KNOW + face + F mark (0 – 8.55) ---------- */
const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
  const p = (a: number) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)];
  const [x0, y0] = p(a0), [x1, y1] = p(a1);
  return `M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`;
};
// eye glyph keyframes: [time, leftArc, rightArc] (angles in degrees, SVG y-down)
const EYES: [number, [number, number], [number, number]][] = [
  [3.6, [200, 340], [200, 340]],   // ^^
  [4.0, [120, 240], [300, 420]],   // ( )
  [4.4, [20, 160], [20, 160]],     // ‿‿
  [4.6, [300, 420], [120, 240]],   // ) (
  [4.8, [200, 340], [200, 340]],
  [5.0, [120, 240], [300, 420]],
  [5.2, [20, 160], [20, 160]],
];
const SceneA: React.FC = () => {
  const t = useT();
  const tilt = interpolate(t, [1.2, 2.0], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const out = pio(t, 2.0, 0.25);
  // cursor bar → dot → eyes → F mark
  const bar = t >= 2.15 && t < 3.3;
  const barH = interpolate(t, [2.15, 2.3, 2.6, 3.0, 3.25], [0, 260, 240, 90, 30], clamp);
  const eye = EYES.filter(([a]) => t >= a).pop();
  const eyeO = t >= 3.55 && t < 5.4 ? 1 : 0;
  const caret = t >= 5.4 && t < 5.6;
  const f = t >= 5.6;
  const beat = (x: number) => (Math.floor((t - x) / 0.2) % 2 === 0 ? 1 : 0.35);
  const stem = f ? pop(t, 5.6, 0.2) : 0;
  const top = pop(t, 6.4, 0.2), mid = pop(t, 7.2, 0.2), dot = pop(t, 7.6, 0.25);
  const glitch = t > 8.3 ? (random(`g${Math.floor(t * 30)}`) - 0.5) * 60 : 0;
  return (
    <Bg>
      <div style={{ position: "absolute", inset: 0, transform: `perspective(1200px) rotateX(${tilt * 14}deg) rotateZ(${-tilt * 7}deg) translateY(${-tilt * 120 - out * 900}px)`, opacity: 1 - out }}>
        <W style={{ top: 620, fontSize: 96, color: INK, opacity: pr(t, 0.2), transform: `translateX(${-140 + (1 - pr(t, 0.2)) * -60}px)`, fontFamily: fonts.sans, fontWeight: 600 }}>You</W>
        <W style={{ top: 710, fontSize: 190, color: OR, transform: `scale(${pop(t, 0.6)}) rotate(-6deg)` }}>SHOULD</W>
        <W style={{ top: 900, fontSize: 150, color: INK, opacity: pr(t, 1.2), transform: `translateX(${120 + (1 - pr(t, 1.2)) * 200}px)`, fontFamily: fonts.serif, fontWeight: 400 }}>know</W>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        {bar && <rect x={540 - 22} y={860 - barH / 2} width={44} height={barH} rx={6} fill={INK} />}
        {t >= 3.25 && t < 3.6 && <circle cx={540} cy={860} r={interpolate(t, [3.25, 3.4], [10, 22], clamp)} fill={OR} />}
        {eye && eyeO > 0 && <>
          <path d={arc(430, 860, 70, eye[1][0], eye[1][1])} stroke={INK} strokeWidth={30} strokeLinecap="round" fill="none" />
          <path d={arc(650, 860, 70, eye[2][0], eye[2][1])} stroke={INK} strokeWidth={30} strokeLinecap="round" fill="none" />
          <circle cx={540} cy={1010} r={14} fill={OR} />
        </>}
        {caret && <path d="M470 900 L540 800 L610 900" stroke={INK} strokeWidth={30} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
      </svg>
      {f && (
        <div style={{ position: "absolute", left: 540 + glitch, top: 860, transform: `translate(-50%, -50%) scale(${1 + pr(t, 8.0, 0.15) * 0.08 - pr(t, 8.2, 0.15) * 0.08})` }}>
          {/* the real FNGN DIGITAL wordmark, built on the beat: F stem, top bar, second bar, then NGN + DIGITAL */}
          <Logo width={900} color={INK} accent={LOGO_ORANGE} parts={{ stem: stem * (t < 6.3 ? beat(5.6) : 1), f1: top, f2: mid, ngn: dot, sub: pr(t, 7.8, 0.3) }} />
        </div>
      )}
    </Bg>
  );
};

/* ---------- B: NEED … CLOSER · O · DEEPER · EVER (8.55 – 12.55) ---------- */
const SceneB: React.FC = () => {
  const t = useT();
  const fly = pio(t, 10.5, 0.15);
  const ring = interpolate(t, [10.55, 10.75, 11.0, 11.35, 11.5], [2.4, 1, 1.1, 0.9, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const ringY = 860 + Math.abs(Math.sin((t - 10.6) * 7)) * -80 * (t < 11.3 ? 1 : 0);
  const slide = (a: number) => interpolate(t, [a, a + 0.25], [700, 0], { ...clamp, easing: Easing.out(Easing.cubic) });
  const blur = (a: number) => interpolate(t, [a, a + 0.25], [24, 0], clamp);
  const curve = Math.sin(t * 3) * 3;
  return (
    <Bg dark>
      <div style={{ position: "absolute", inset: 0, transform: `perspective(1400px) rotateY(${curve}deg) translateY(${-fly * 1400}px)`, opacity: t < 10.6 ? 1 : 0 }}>
        <W style={{ top: 560, fontSize: 230, color: OR, transform: `scale(${pop(t, 8.6)})` }}>NEED</W>
        <W style={{ top: 790, fontSize: 70, color: LIGHT, fontFamily: fonts.sans, fontWeight: 600, letterSpacing: "0.4em", opacity: pr(t, 9.2) }}>· · ·</W>
        <W style={{ top: 900, fontSize: 250, color: LIGHT, transform: `scaleY(${pop(t, 10.2, 0.2) * 1.15})`, transformOrigin: "50% 0%" }}>CLOSER</W>
      </div>
      {t >= 10.55 && t < 11.5 && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <circle cx={540} cy={ringY} r={140 * ring} stroke={OR} strokeWidth={60 * ring} fill="none" />
        </svg>
      )}
      <W style={{ top: 1060, fontSize: 120, color: LIGHT, opacity: pr(t, 11.0) * (1 - pr(t, 11.35, 0.1)), fontFamily: fonts.serif, fontWeight: 400 }}>deeper</W>
      <W style={{ top: 780, fontSize: 260, color: OR, transform: `translateX(${slide(11.4) - pio(t, 12.3, 0.2) * 900}px)`, filter: `blur(${blur(11.4)}px)`, opacity: t >= 11.4 ? 1 : 0 }}>EVER</W>
    </Bg>
  );
};

/* ---------- C: LOVE · RODEO spin (12.55 – 14.8) ---------- */
const SceneC: React.FC = () => {
  const t = useT();
  const flash = t < 12.8;
  const spin = interpolate(t, [13.6, 14.6], [0, 360], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const wipe = interpolate(t, [14.55, 14.85], [0, 1500], { ...clamp, easing: Easing.in(Easing.cubic) });
  const word = "LOVE";
  return (
    <Bg dark={!flash}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 6, opacity: t < 13.55 ? 1 : 0 }}>
        {word.split("").map((ch, i) => (
          <span key={i} style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 260, color: flash ? INK : OR, transform: `translateY(${Math.sin(t * 9 + i * 0.9) * 40 * pr(t, 13.0)}px) scale(${pop(t, 12.6 + i * 0.05)})`, display: "inline-block" }}>{ch}</span>
        ))}
      </div>
      <W style={{ top: 960, fontSize: 90, color: LIGHT, fontFamily: fonts.serif, fontWeight: 400, opacity: pr(t, 13.0) * (t < 13.55 ? 1 : 0) }}>feels like a</W>
      {t >= 13.55 && (
        <div style={{ position: "absolute", left: 540, top: 860, transform: `translate(-50%, -50%) rotate(${spin}deg)` }}>
          {[0, 90, 180, 270].map((r) => (
            <div key={r} style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${r}deg) translateY(-250px) translateX(-50%)`, fontFamily: fonts.display, fontWeight: 800, fontSize: 130, color: r === 0 ? OR : LIGHT, whiteSpace: "nowrap", opacity: pop(t, 13.6 + r / 900) }}>RODEO</div>
          ))}
          <div style={{ position: "absolute", left: -70, top: -70, width: 140, height: 140, borderRadius: 70, background: OR }} />
        </div>
      )}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}><circle cx={540} cy={860} r={wipe} fill={LIGHT} /></svg>
    </Bg>
  );
};

/* ---------- D: KNOWS · HOW · CONTROL (14.8 – 17.1) ---------- */
const Star: React.FC<{ x: number; y: number; s: number; r: number }> = ({ x, y, s: k, r }) => (
  <svg width={60} height={60} viewBox="-30 -30 60 60" style={{ position: "absolute", left: x - 30, top: y - 30, transform: `scale(${k}) rotate(${r}deg)` }}>
    <path d="M0 -26 L7 -7 L26 0 L7 7 L0 26 L-7 7 L-26 0 L-7 -7 Z" fill={OR} />
  </svg>
);
const SceneD: React.FC = () => {
  const t = useT();
  const up = interpolate(t, [16.1, 16.4], [0, -260], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const out = interpolate(t, [16.95, 17.15], [0, 1], clamp);
  return (
    <Bg>
      <div style={{ position: "absolute", inset: 0, transform: `translateY(${up}px) scale(${1 - out * 0.3})`, opacity: 1 - out }}>
        <W style={{ top: 560, fontSize: 120, color: "transparent", WebkitTextStroke: `4px ${OR}`, transform: `scale(${pop(t, 15.0)})` }}>KNOWS</W>
        <W style={{ top: 700, fontSize: 220, color: INK, transform: `translateY(${(1 - pop(t, 15.6)) * 80}px)`, opacity: pr(t, 15.6, 0.15) }}>HOW</W>
        <Star x={250} y={760} s={pop(t, 15.8)} r={t * 90} />
        <Star x={850} y={900} s={pop(t, 15.9)} r={-t * 90} />
        <W style={{ top: 1110, fontSize: 200, color: OR, fontFamily: fonts.serif, fontWeight: 400, transform: `scaleX(${pop(t, 16.6, 0.2)})` }}>control</W>
      </div>
    </Bg>
  );
};

/* ---------- E: WHEN pills (17.1 – 18.55) ---------- */
const SceneE: React.FC = () => {
  const t = useT();
  const zoom = interpolate(t, [18.3, 18.55], [1, 3.5], { ...clamp, easing: Easing.in(Easing.cubic) });
  const pills = Array.from({ length: 26 }).map((_, i) => {
    const row = i % 9, col = Math.floor(i / 9);
    const x = 60 + col * 360 + (row % 2) * 170 - ((t - 17.1) * 220 * (row % 2 ? 1 : -1)) % 360;
    const y = 300 + row * 160;
    const kind = i % 3;
    const label = i % 5 === 2 && t > 18.0 ? "VULNERABLE" : "WHEN";
    return { x, y, kind, label, d: (i % 7) * 0.04 };
  });
  return (
    <AbsoluteFill style={{ background: OR, overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, filter: `blur(${(zoom - 1) * 4}px)` }}>
        {pills.map((p, i) => {
          const k = pop(t, 17.15 + p.d, 0.3);
          const bg = p.kind === 0 ? LIGHT : p.kind === 1 ? DARK : ORL;
          const fg = p.kind === 1 ? LIGHT : INK;
          return (
            <div key={i} style={{ position: "absolute", left: p.x, top: p.y, transform: `scale(${k})`, padding: "18px 46px", borderRadius: 999, background: bg, border: `5px solid ${DARK}`, fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: fg, whiteSpace: "nowrap" }}>{p.label}</div>
          );
        })}
        <div style={{ position: "absolute", left: 540, top: 900, transform: `translate(-50%,-50%) scale(${pop(t, 17.6, 0.2)}) rotate(-4deg)`, padding: "20px 80px 34px", borderRadius: 999, background: DARK, border: `8px solid ${LIGHT}`, fontFamily: fonts.display, fontWeight: 800, fontSize: 230, color: OR, whiteSpace: "nowrap", boxShadow: "0 40px 80px -20px rgba(0,0,0,0.6)" }}>I&apos;M</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- F+G: script card → SOUL (18.55 – 20.6) ---------- */
const SceneG: React.FC = () => {
  const t = useT();
  const card = interpolate(t, [18.6, 18.95], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.4)) });
  const rot = interpolate(t, [20.55, 20.9], [0, 90], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lines: [string, number, number][] = [["straight", 19.0, 120], ["talking", 19.4, 120], ["to my", 19.8, 110], ["soul", 20.4, 230]];
  return (
    <Bg dark>
      <div style={{ position: "absolute", left: 540, top: 900, width: 800, height: 1100, transform: `translate(-50%, -50%) perspective(1400px) rotateY(${-14 + rot * 0}deg) rotateZ(${-6 + rot}deg) scale(${card})`, borderRadius: 50, background: LIGHT, overflow: "hidden", boxShadow: "0 60px 120px -40px rgba(0,0,0,0.9)" }}>
        <svg width={800} height={1100} style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 8 }).map((_, i) => <path key={`v${i}`} d={`M${i * 110 + 15} 0 Q${i * 110 + 15 + (i * 110 - 400) * 0.12} 550 ${i * 110 + 15} 1100`} stroke="#dcc4b0" strokeWidth={3} fill="none" />)}
          {Array.from({ length: 11 }).map((_, i) => <line key={`h${i}`} x1={0} x2={800} y1={i * 110 + 20} y2={i * 110 + 20} stroke="#dcc4b0" strokeWidth={3} />)}
        </svg>
        {lines.map(([txt, at, size], i) => (
          <div key={i} style={{ position: "absolute", left: 70, top: 110 + i * 190, fontFamily: fonts.serif, fontSize: size, color: i === 3 ? OR : INK, opacity: pr(t, at, 0.2), transform: `translateX(${(1 - pr(t, at, 0.3)) * -60}px)`, whiteSpace: "nowrap" }}>{txt}</div>
        ))}
      </div>
    </Bg>
  );
};

/* ---------- H: OVERLOAD stacked outline (20.6 – 22.35) ---------- */
const SceneH: React.FC = () => {
  const t = useT();
  const parts = ["OV", "ER", "LO", "AD"];
  const v = interpolate(t, [20.6, 21.5], [1400, -200], clamp);
  return (
    <Bg dark>
      <div style={{ position: "absolute", left: 80, top: v, fontFamily: fonts.display, fontWeight: 800, fontSize: 150, color: LIGHT, opacity: 1 - pr(t, 21.5, 0.15), transform: "rotate(90deg)", transformOrigin: "0 0", whiteSpace: "nowrap", letterSpacing: "0.04em" }}>· CONVERSATION ·</div>
      {parts.map((p, i) => {
        const k = pop(t, 21.55 + i * 0.07, 0.25);
        const jitter = (random(`o${i}${Math.floor(t * 12)}`) - 0.5) * 16 * (t < 22.2 ? 1 : 0);
        return <W key={i} style={{ top: 420 + i * 290, fontSize: 330, color: i === 3 ? OR : "transparent", WebkitTextStroke: `6px ${OR}`, transform: `translateX(${jitter}px) scale(${k})` }}>{p}</W>;
      })}
    </Bg>
  );
};

/* ---------- I: TRAINING SEASON · IT'S OVER (22.35 – 25.45) ---------- */
const SceneI: React.FC = () => {
  const t = useT();
  const marquee = interpolate(t, [22.8, 23.55], [900, -120], clamp);
  const season = pop(t, 23.6, 0.3);
  const wave = (i: number) => Math.sin(t * 10 + i * 0.8) * 26 * (t < 24.5 ? 1 : 0);
  const over = interpolate(t, [24.6, 24.8], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const squash = interpolate(t, [25.1, 25.4], [1, 0.06], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <Bg>
      {t < 22.8 && <div style={{ position: "absolute", left: 540, top: 860, transform: `translate(-50%,-50%) scale(${pop(t, 22.6, 0.2)})`, padding: "14px 40px", borderRadius: 26, background: DARK, fontFamily: fonts.display, fontWeight: 800, fontSize: 90, color: LIGHT }}>&apos;CAUSE</div>}
      {t >= 22.8 && t < 23.6 && <div style={{ position: "absolute", top: 820, left: marquee, fontFamily: fonts.display, fontWeight: 800, fontSize: 110, color: OR, letterSpacing: "0.18em", whiteSpace: "nowrap" }}>TRAINING TRAINING</div>}
      {t >= 23.6 && t < 24.6 && (
        <div style={{ position: "absolute", left: 0, right: 0, top: 700, display: "flex", justifyContent: "center", transform: `scale(${season}) scaleY(1.5)` }}>
          {"SEASON".split("").map((ch, i) => <span key={i} style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 210, color: OR, display: "inline-block", transform: `translateY(${wave(i)}px)` }}>{ch}</span>)}
        </div>
      )}
      {t >= 24.6 && (
        <div style={{ position: "absolute", left: 540, top: 880, transform: `translate(-50%,-50%) scale(${over}) scaleY(${squash})`, padding: "26px 60px", borderRadius: 40, background: DARK, fontFamily: fonts.display, fontWeight: 800, fontSize: 120, color: OR, whiteSpace: "nowrap" }}>IT&apos;S OVER</div>
      )}
    </Bg>
  );
};

/* ---------- J: shape show in brand colours (25.45 – 30.4) ---------- */
const SceneJ: React.FC = () => {
  const t = useT();
  const u = t - 25.45;
  const drop = (a: number, x0: number, y0: number, x1: number, y1: number) => {
    const k = interpolate(u, [a, a + 0.45], [0, 1], { ...clamp, easing: Easing.out(Easing.bounce) });
    return { x: x0 + (x1 - x0) * k, y: y0 + (y1 - y0) * k, o: u >= a ? 1 : 0 };
  };
  const c1 = drop(0.15, 300, -200, 330, 620);
  const c2 = drop(0.35, 900, 2100, 760, 1220);
  const beads = Array.from({ length: 6 }).map((_, i) => {
    const a = 0.7 + i * 0.06;
    const k = interpolate(u, [a, a + 0.6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
    return { x: 540 + Math.sin(k * 3 + i * 0.2) * 160, y: -150 + k * 1100 + i * 70, o: u > a && u < 2.2 ? 1 : 0, c: i < 3 ? MUTE : OR };
  });
  const dk = drop(1.2, 540, -300, 560, 980);
  const sq = interpolate(u, [2.1, 2.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sqOut = interpolate(u, [2.9, 3.2], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const bits = Array.from({ length: 10 }).map((_, i) => ({
    x: 540 + Math.cos(i * 1.7) * (200 + i * 30) * pr(t, 25.45 + 3.2, 0.5),
    y: 900 + Math.sin(i * 1.7) * (260 + i * 25) * pr(t, 25.45 + 3.2, 0.5),
    r: i * 40 + u * 120, c: i % 2 ? OR : MUTE, o: u > 3.1 && u < 4.0 ? 1 - pr(t, 25.45 + 3.7, 0.3) : 0,
  }));
  const chain = Array.from({ length: 5 }).map((_, i) => {
    const k = interpolate(u, [4.0 + i * 0.05, 4.6 + i * 0.05], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
    return { x: 700 - k * 200 + i * 20, y: 700 + k * 300 + i * 40, o: u > 3.95 ? 1 : 0, c: i < 2 ? MUTE : i === 4 ? DARK : OR };
  });
  const big = interpolate(u, [4.75, 4.95], [0, 1500], { ...clamp, easing: Easing.in(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: LIGHT, overflow: "hidden" }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <rect x={540 - 300 * (1 - interpolate(u, [0, 0.15], [0, 1], clamp))} y={878} width={600 * (1 - interpolate(u, [0, 0.15], [0, 1], clamp))} height={14} rx={7} fill={DARK} />
        {u < 2.1 && <circle cx={c1.x} cy={c1.y} r={120} fill={OR} opacity={c1.o} />}
        {u < 2.1 && <circle cx={c2.x} cy={c2.y} r={100} fill={MUTE} opacity={c2.o} />}
        {beads.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={90} fill={b.c} opacity={b.o * 0.85} />)}
        {u < 2.1 && <circle cx={dk.x} cy={dk.y} r={130} fill={DARK} opacity={dk.o} />}
        {u >= 2.1 && u < 3.2 && <>
          <rect x={-600 + sq * 700} y={700} width={560} height={560} rx={40} fill={OR} transform={`rotate(${-20 + sq * 35 + sqOut * 60} ${-320 + sq * 700} 980)`} opacity={1 - sqOut} />
          <rect x={1100 - sq * 620} y={900} width={460} height={460} rx={40} fill={DARK} transform={`rotate(${30 - sq * 40 - sqOut * 60} ${1330 - sq * 620} 1130)`} opacity={1 - sqOut} />
          <rect x={300} y={-500 + sq * 700} width={420} height={420} rx={30} fill={MUTE} transform={`rotate(${15 + sq * 20} 510 ${-290 + sq * 700})`} opacity={(1 - sqOut) * 0.9} />
        </>}
        {bits.map((b, i) => <rect key={i} x={b.x - 40} y={b.y - 40} width={80} height={80} rx={10} fill={b.c} opacity={b.o} transform={`rotate(${b.r} ${b.x} ${b.y})`} />)}
        {chain.map((b, i) => <circle key={i} cx={b.x} cy={b.y} r={110} fill={b.c} opacity={b.o * 0.8} />)}
        <circle cx={560} cy={1000} r={big} fill={DARK} />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- K: FNGN end card (30.4 – END) ---------- */
const SceneK: React.FC = () => {
  const t = useT();
  const a = pop(t, 30.5, 0.4);
  const b = pr(t, 30.9, 0.4);
  const c = pr(t, 31.4, 0.4);
  return (
    <AbsoluteFill style={{ background: DARK, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 36 }}>
      <div style={{ transform: `scale(${0.85 + a * 0.15})`, opacity: Math.min(1, a), filter: "drop-shadow(0 30px 80px rgba(226,98,5,0.35))" }}>
        <Logo width={820} parts={{ sub: b }} />
      </div>
      <div style={{ opacity: c, fontFamily: fonts.sans, fontSize: 38, color: C.muted, letterSpacing: "0.08em", textAlign: "center", lineHeight: 1.6 }}>
        Hareketli tasarım · Web · Sosyal medya<br />{HANDLE}
      </div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  return <AbsoluteFill>{children}</AbsoluteFill>;
};

export const Reel14Tipo: React.FC<{ music?: boolean }> = ({ music = true }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: DARK }}>
      <Scene from={0} to={8.55}><SceneA /></Scene>
      <Scene from={8.55} to={12.55}><SceneB /></Scene>
      <Scene from={12.55} to={14.85}><SceneC /></Scene>
      <Scene from={14.85} to={17.15}><SceneD /></Scene>
      <Scene from={17.15} to={18.55}><SceneE /></Scene>
      <Scene from={18.55} to={20.6}><SceneG /></Scene>
      <Scene from={20.6} to={22.35}><SceneH /></Scene>
      <Scene from={22.35} to={25.45}><SceneI /></Scene>
      <Scene from={25.45} to={30.4}><SceneJ /></Scene>
      <Scene from={30.4} to={END}><SceneK /></Scene>
      {/* small handle bug, like a creator watermark */}
      {t < 30.4 && <div style={{ position: "absolute", left: 50, bottom: 300, display: "flex", alignItems: "center", gap: 10, fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, letterSpacing: "0.12em", color: t < 8.55 || (t >= 14.85 && t < 17.15) || t >= 22.35 ? INK : LIGHT, opacity: 0.7 }}><Logo width={120} sub={false} color={t < 8.55 || (t >= 14.85 && t < 17.15) || t >= 22.35 ? INK : LIGHT} /> {HANDLE.toUpperCase()}</div>}
      {music && <Audio src={staticFile("music14.mp3")} volume={(f) => interpolate(f / 30, [END - 0.8, END], [1, 0], clamp)} />}
    </AbsoluteFill>
  );
};
export const Reel14TipoSessiz: React.FC = () => <Reel14Tipo music={false} />;
