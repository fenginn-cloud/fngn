// Reel 07 — "Marka kimliği nedir?" (buzdağı: %20 ifade, %80 strateji)
// Word timings: src/reels/words07.ts (Scribe). Closing phone shows a real mobile capture of the FNGN site (public/site/fngn-mobile-tr.jpg).
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, Chrome, FMark, HANDLE, SITE, fonts, s } from "../brand";
import { W07 } from "./words07";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.45) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const spr = (frame: number, at: number, base: number, damping = 13, stiffness = 150) =>
  spring({ frame: frame - s(at - base), fps: 30, config: { damping, stiffness } });
const useT = (base: number) => useCurrentFrame() / 30 + base;

const T = {
  title: 0, list: 1.62, tip: 7.7, expr: 10.2, pct20: 12.94,
  dive: 14.08, strat: 16.44, sub: 17.94, whole: 24.64, full: 26.34,
  proc: 27.94, kesif: 29.2, goals: 30.46, strat2: 32.68, lock: 34.34,
  venn: 35.32, center: 39.82,
  mood: 41.18, lang: 43.78,
  logos: 45.32, pick: 46.78,
  apply: 47.86,
  remember: 50.0, meaning: 50.8, design: 52.98,
  cta: 56.0, link: 58.78, end: 64.6,
};
export const REEL07_FRAMES = s(T.end);
const NEUTRAL = "#EFE9E1";
const WATER = "#5E86B8";

/* ---------- caption (small, bottom) ---------- */
type Line = { words: { w: string; a: number }[]; a: number; b: number };
const LINES: Line[] = (() => {
  const out: Line[] = [];
  let cur: { w: string; a: number }[] = [];
  let a = 0;
  W07.forEach(([w, ws, we], i) => {
    if (cur.length === 0) a = ws;
    cur.push({ w, a: ws });
    if (/[.,;:?]$/.test(w) || i === W07.length - 1) {
      out.push({ words: cur, a, b: we });
      cur = [];
    }
  });
  return out;
})();
const Caption: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const idx = LINES.findIndex((l, i) => t >= l.a - 0.05 && t < (LINES[i + 1]?.a ?? l.b + 0.8) && t < l.b + 1.0);
  if (idx < 0 || t > T.cta - 0.1) return null;
  const line = LINES[idx];
  const o = interpolate(t, [line.a - 0.05, line.a + 0.1, line.b + 0.7, line.b + 1.0], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 1560, left: 100, right: 100, textAlign: "center", opacity: o, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.26em", fontFamily: fonts.sans, fontWeight: 500, fontSize: 36 }}>
      {line.words.map((w, i) => {
        const p = interpolate(t, [w.a - 0.05, w.a + 0.12], [0, 1], clamp);
        return <span key={i} style={{ color: interpolateColors(p, [0, 1], ["rgba(245,245,245,0.22)", "rgba(245,245,245,0.85)"]) }}>{w.w}</span>;
      })}
    </div>
  );
};

/* ---------- 1. Title + the "visible" list ---------- */
const LIST: [string, number][] = [["Logo", 2.68], ["Yazı tipi", 3.24], ["Renk paleti", 4.02], ["Ambalaj", 4.96], ["Web sitesi", 5.64], ["Pazarlama", 6.54]];
const Intro: React.FC = () => {
  const t = useT(0);
  const ti = pr(t, 0.05, 0.6);
  const up = pr(t, T.list - 0.1, 0.5);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: interpolate(up, [0, 1], [760, 300]), transform: `scale(${interpolate(up, [0, 1], [1.25, 0.8])})`, transformOrigin: "0 0", opacity: ti, filter: `blur(${(1 - ti) * 16}px)` }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 116, color: C.fg, letterSpacing: "-0.045em", lineHeight: 1 }}>Marka kimliği</div>
        <div style={{ fontFamily: fonts.serif, fontSize: 140, color: C.accent, lineHeight: 1 }}>nedir?</div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 760 }}>
        {LIST.map(([w, a]) => {
          const p = pr(t, a - 0.05, 0.35);
          return (
            <div key={w} style={{ fontFamily: fonts.sans, fontWeight: 300, fontSize: 84, lineHeight: 1.12, color: C.fg, opacity: p, transform: `translateX(${(1 - p) * -30}px)`, filter: `blur(${(1 - p) * 8}px)` }}>
              <span style={{ color: C.accent }}>–</span> {w}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2–4. Iceberg ---------- */
const TIP = "M -120 0 L -70 -150 L -20 -260 L 30 -190 L 70 -120 L 130 -40 L 160 0 Z";
const BODY = "M -120 0 L -200 120 L -260 260 L -220 380 L -150 520 L -60 640 L 0 600 L 60 660 L 120 540 L 170 420 L 230 300 L 200 160 L 160 0 Z";
const Wave: React.FC<{ w: number; y: number; phase: number; draw: number }> = ({ w, y, phase, draw }) => {
  const pts: string[] = [];
  for (let x = 0; x <= w; x += 10) pts.push(`${x} ${y + Math.sin(x / 34 + phase) * 9}`);
  return <path d={"M" + pts.join(" L")} fill="none" stroke={WATER} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${draw} 1`} />;
};
const UNDER: [string, number][] = [["Araştırma", 17.94], ["Rakipler", 18.8], ["Farklılaşma", 19.6], ["Müşteriler", 20.58], ["Hikâye", 21.4], ["Misyon", 22.26], ["Ses tonu", 23.0], ["Vizyon", 23.9]];
const Iceberg: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.tip);
  const base = T.tip;
  const wave = pr(t, 7.8, 0.9);
  const rise = spr(frame, 8.3, base, 14, 90);
  const dive = interpolate(t, [T.dive, T.dive + 1.6], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const full = pr(t, T.full - 0.2, 0.8);
  // camera: start looking at the tip (water line low on screen), then pull up to show the whole berg
  const camY = interpolate(dive, [0, 1], [1050, 700]);
  const camS = interpolate(dive, [0, 1], [1.5, 1.05]);
  const label = (text: string, pct: string, a: number, on: number) => (
    <div style={{ opacity: on }}>
      <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 46, color: C.fg }}>{text}</div>
      <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 92, color: C.accent, letterSpacing: "-0.04em", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>{pct}</div>
    </div>
  );
  const exprOn = pr(t, T.expr) * (1 - pr(t, T.strat - 0.3, 0.3));
  const stratOn = pr(t, T.strat) * (1 - pr(t, T.whole - 0.2, 0.3));
  const wholeOn = pr(t, T.whole);
  const pctNum = Math.round(interpolate(t, [T.whole + 0.3, T.full + 0.4], [80, 100], clamp));
  const glow = full;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 300 }}>
        {exprOn > 0.01 && label("Marka ifadesi", "%20", T.expr, exprOn)}
      </div>
      <div style={{ position: "absolute", left: 90, top: 300 }}>
        {stratOn > 0.01 && label("Marka stratejisi", "%80", T.strat, stratOn)}
      </div>
      <div style={{ position: "absolute", left: 90, top: 300 }}>
        {wholeOn > 0.01 && label("Marka kimliği", `%${pctNum}`, T.whole, wholeOn)}
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(94,134,184,0.16)" />
            <stop offset="100%" stopColor="rgba(94,134,184,0.0)" />
          </linearGradient>
        </defs>
        <g transform={`translate(330 ${camY}) scale(${camS})`}>
          {/* sea tint */}
          <rect x={-600} y={0} width={1800} height={1200} fill="url(#sea)" opacity={wave} />
          {/* underwater body */}
          <path d={BODY} fill="#F2F2F2" stroke={interpolateColors(glow, [0, 1], ["#9a9a9a", C.accent])} strokeWidth={6} strokeLinejoin="round" opacity={dive} style={{ filter: glow ? `drop-shadow(0 0 ${30 * glow}px rgba(226,98,5,0.6))` : undefined }} />
          {/* tip */}
          <g transform={`translate(0 ${(1 - rise) * 280})`}>
            <path d={TIP} fill="#FBFBFB" stroke={interpolateColors(glow, [0, 1], ["#9a9a9a", C.accent])} strokeWidth={6} strokeLinejoin="round" style={{ filter: glow ? `drop-shadow(0 0 ${30 * glow}px rgba(226,98,5,0.6))` : undefined }} />
          </g>
          <g transform={`translate(-330 0)`}>
            <Wave w={1080 / Math.max(camS, 1) + 400} y={0} phase={frame / 8} draw={wave} />
          </g>
          {/* above-water list (small) */}
          <g transform="translate(210 -250)" opacity={pr(t, 8.6)}>
            {LIST.map(([w], i) => (
              <text key={w} x={0} y={i * 36} fontFamily={fonts.sans} fontSize={30} fill={C.fg}>{w}</text>
            ))}
          </g>
          {/* underwater list */}
          <g transform="translate(280 70)">
            {UNDER.map(([w, a], i) => (
              <text key={w} x={0} y={i * 40} fontFamily={fonts.sans} fontSize={32} fill={C.fg} opacity={pr(t, a - 0.05, 0.3)}>{w}</text>
            ))}
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- 5. Process ---------- */
const Lock: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
    <rect x="4" y="10" width="16" height="12" rx="3" />
  </svg>
);
const Process: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.proc);
  const steps: { n: string; label: string; at: number }[] = [
    { n: "01", label: "Keşif", at: T.kesif },
    { n: "02", label: "Strateji", at: T.strat2 },
    { n: "03", label: "Tasarım", at: 33.86 },
    { n: "04", label: "Geliştirme", at: 99 },
    { n: "05", label: "Yayın", at: 99 },
  ];
  const active = t >= T.strat2 ? 1 : t >= T.kesif ? 0 : -1;
  const lock = spr(frame, T.lock, T.proc, 10, 190);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 300, opacity: pr(t, 27.94) }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 44, color: C.muted }}>Her projeye</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 104, color: C.fg, letterSpacing: "-0.045em", lineHeight: 1 }}>keşifle <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>başlıyoruz.</span></div>
      </div>
      <div style={{ position: "absolute", left: 150, top: 640 }}>
        {steps.map((st, i) => {
          const seen = pr(t, 28.3 + i * 0.12, 0.4);
          const isAct = i === active;
          const done = i < active;
          const col = isAct ? C.accent : done ? C.fg : "rgba(245,245,245,0.28)";
          return (
            <div key={st.n} style={{ position: "relative", height: 150, opacity: seen }}>
              {i < steps.length - 1 && <div style={{ position: "absolute", left: 21, top: 54, width: 3, height: 110, background: "repeating-linear-gradient(180deg, rgba(245,245,245,0.3) 0 6px, transparent 6px 14px)" }} />}
              <div style={{ position: "absolute", left: 0, top: 10, width: 46, height: 46, borderRadius: "50%", border: `3px solid ${col}`, background: isAct ? C.accent : "transparent", boxShadow: isAct ? "0 0 30px rgba(226,98,5,0.8)" : "none" }} />
              <div style={{ position: "absolute", left: 90, top: -6, display: "flex", alignItems: "baseline", gap: 18 }}>
                <span style={{ fontFamily: fonts.sans, fontSize: 28, color: C.muted, letterSpacing: "0.1em" }}>{st.n}</span>
                <span style={{ fontFamily: isAct ? fonts.serif : fonts.display, fontWeight: isAct ? 400 : 700, fontSize: isAct ? 92 : 70, color: col, letterSpacing: isAct ? 0 : "-0.03em" }}>{st.label}</span>
                {i === 2 && <span style={{ transform: `scale(${lock})`, display: "inline-block", marginLeft: 10 }}><Lock size={56} color={C.accent} /></span>}
              </div>
              {i === 0 && (
                <div style={{ position: "absolute", left: 92, top: 92, display: "flex", gap: 14 }}>
                  {[["hedefler", 30.46], ["kitle", 31.24], ["pazar", 31.92]].map(([w, a]) => (
                    <span key={w as string} style={{ padding: "6px 18px", borderRadius: 999, border: `2px solid ${C.accent}`, fontFamily: fonts.sans, fontWeight: 600, fontSize: 26, color: C.accent, opacity: pr(t, a as number, 0.3) }}>{w}</span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 1420, fontFamily: fonts.sans, fontWeight: 600, fontSize: 40, color: C.fg, opacity: pr(t, T.lock - 0.3) }}>
        Strateji netleşmeden <span style={{ color: C.accent }}>tasarıma geçmiyoruz.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 6. Strategy venn ---------- */
const Venn: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.venn);
  const items: [string, number][] = [["Kitle", 36.08], ["Konum", 36.78], ["Ürün", 37.5], ["Hikâye", 38.04], ["Kişilik", 38.88]];
  const cx = 540, cy = 930, R = 140, r = 190;
  const center = spr(frame, T.center, T.venn, 10, 150);
  const spin = frame * 0.15;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", opacity: pr(t, 35.32) }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 84, color: C.fg, letterSpacing: "-0.02em" }}>Marka <span style={{ fontFamily: fonts.serif, color: C.accent }}>stratejisi</span></div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <g transform={`rotate(${spin} ${cx} ${cy})`}>
          {items.map(([w, a], i) => {
            const p = spr(frame, a, T.venn, 13, 140);
            const ang = (i / items.length) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(ang) * R;
            const y = cy + Math.sin(ang) * R;
            return (
              <g key={w} opacity={Math.min(1, p * 1.5)}>
                <circle cx={x} cy={y} r={r * p} fill="rgba(226,98,5,0.04)" stroke="rgba(245,245,245,0.75)" strokeWidth={3} />
              </g>
            );
          })}
        </g>
        {items.map(([w, a], i) => {
          const p = pr(t, a, 0.4);
          const ang = (i / items.length) * Math.PI * 2 - Math.PI / 2 + (spin * Math.PI) / 180;
          const x = cx + Math.cos(ang) * (R + 120);
          const y = cy + Math.sin(ang) * (R + 120);
          return <text key={w} x={x} y={y + 12} textAnchor="middle" fontFamily={fonts.sans} fontWeight={700} fontSize={38} fill={C.fg} opacity={p}>{w}</text>;
        })}
        <circle cx={cx} cy={cy} r={70 * center} fill={C.accent} style={{ filter: "drop-shadow(0 0 40px rgba(226,98,5,0.9))" }} />
        <circle cx={cx} cy={cy} r={(70 + (1 - center) * 0) * center + 30 * (1 - Math.min(1, center))} fill="none" />
      </svg>
      <div style={{ position: "absolute", left: cx - 60, top: cy - 60, width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${center})` }}>
        <FMark size={96} dot={false} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1360, textAlign: "center", fontFamily: fonts.sans, fontWeight: 600, fontSize: 42, color: C.fg, opacity: pr(t, T.center) }}>
        tek bir <span style={{ fontFamily: fonts.serif, fontWeight: 400, fontSize: 50, color: C.accent }}>merkezde</span> buluşur.
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 7. Moodboard ---------- */
const Tile: React.FC<{ k: number; size: number }> = ({ k, size }) => {
  const base: React.CSSProperties = { width: size, height: size, borderRadius: 14, overflow: "hidden", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" };
  switch (k % 12) {
    case 0: return <div style={{ ...base, background: C.accent }}><FMark size={size * 0.6} dot={false} /></div>;
    case 1: return <div style={{ ...base, background: "#141414", border: "1px solid rgba(255,255,255,0.12)", fontFamily: fonts.display, fontWeight: 800, fontSize: size * 0.4, color: C.fg }}>Aa</div>;
    case 2: return <div style={{ ...base, background: `linear-gradient(135deg, #2a1a10, ${C.accent})` }} />;
    case 3: return <div style={{ ...base, background: NEUTRAL, fontFamily: fonts.serif, fontSize: size * 0.3, color: "#141414" }}>fikir.</div>;
    case 4: return <div style={{ ...base, background: "#0e0e0e", border: "1px solid rgba(255,255,255,0.1)" }}>{[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", width: size * (0.3 + i * 0.22), height: size * (0.3 + i * 0.22), borderRadius: "50%", border: `2px solid rgba(226,98,5,${0.8 - i * 0.25})` }} />)}</div>;
    case 5: return <div style={{ ...base, background: "#1c1c1c" }}><div style={{ width: "70%", display: "flex", flexDirection: "column", gap: 6 }}>{[1, 0.7, 0.85, 0.5].map((w, i) => <div key={i} style={{ height: 8, width: `${w * 100}%`, borderRadius: 4, background: i === 0 ? C.accent : "rgba(255,255,255,0.3)" }} />)}</div></div>;
    case 6: return <div style={{ ...base, background: "radial-gradient(circle at 30% 30%, #ffb070, #E26205 45%, #3a1606)" }} />;
    case 7: return <div style={{ ...base, background: NEUTRAL }}><div style={{ width: size * 0.36, height: size * 0.36, borderRadius: "50%", background: C.accent }} /></div>;
    case 8: return <div style={{ ...base, background: "#111", border: "1px solid rgba(255,255,255,0.1)", fontFamily: fonts.display, fontWeight: 800, fontSize: size * 0.22, color: C.accent, letterSpacing: "-0.04em" }}>FNGN</div>;
    case 9: return <div style={{ ...base, background: "repeating-linear-gradient(90deg, #1a1a1a 0 10px, #222 10px 20px)" }} />;
    case 10: return <div style={{ ...base, background: "#0b0b0b", border: `2px solid ${C.accent}` }}><div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: size * 0.12, color: C.fg, letterSpacing: "0.2em" }}>#E26205</div></div>;
    default: return <div style={{ ...base, background: `linear-gradient(180deg, ${NEUTRAL}, #cbbfae)` }} />;
  }
};
const Mood: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.mood);
  const zoomOut = interpolate(t, [T.mood, T.lang + 0.8], [1.25, 0.95], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const size = 230;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 300, left: 90, right: 90, opacity: pr(t, T.mood) }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 44, color: C.muted }}>Stratejiyi kitleye konuşan</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 96, color: C.fg, letterSpacing: "-0.045em", lineHeight: 1 }}>bir <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>görsel dile</span> çeviriyoruz.</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", transform: `scale(${zoomOut})` }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(3, ${size}px)`, gap: 16 }}>
          {Array.from({ length: 12 }, (_, i) => {
            const sp = spr(frame, 41.4 + i * 0.12, T.mood, 13, 150);
            return (
              <div key={i} style={{ transform: `scale(${sp}) rotate(${(1 - sp) * (i % 2 ? 8 : -8)}deg)`, opacity: Math.min(1, sp * 1.5) }}>
                <Tile k={i} size={size} />
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 8. Logo directions ---------- */
const LogoA = () => (
  <svg width={190} height={190} viewBox="0 0 64 64"><rect x={4} y={4} width={56} height={56} fill={C.fg} /><path d="M18 50 V24 Q18 14 28 14 H46 V24 H30 Q28 24 28 26 V50 Z" fill="#0b0b0b" /></svg>
);
const LogoB = () => (
  <svg width={190} height={190} viewBox="0 0 64 64"><path d="M12 12 H52 L40 26 H26 V32 H42 L32 44 H26 V54 H12 Z" fill={C.fg} /></svg>
);
const Logos: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.logos);
  const pick = pr(t, T.pick, 0.5);
  const check = spr(frame, T.pick + 0.3, T.logos, 9, 190);
  const row = (el: React.ReactNode, i: number, chosen: boolean) => {
    const sp = spr(frame, T.logos + i * 0.18, T.logos, 13, 150);
    const dim = chosen ? 1 : 1 - pick * 0.75;
    return (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 60, opacity: Math.min(1, sp * 1.5) * dim, transform: `scale(${sp * (chosen ? 1 + pick * 0.08 : 1)})` }}>
        <div style={{ width: 260, height: 260, borderRadius: 30, background: "#121212", border: `2px solid ${chosen ? `rgba(226,98,5,${0.3 + pick * 0.7})` : "rgba(255,255,255,0.1)"}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: chosen ? `0 0 ${60 * pick}px rgba(226,98,5,0.4)` : "none" }}>{el}</div>
        <div style={{ width: 90, height: 90 }}>
          {chosen && (
            <svg width={90} height={90} viewBox="0 0 24 24" style={{ transform: `scale(${check})` }} fill="none" stroke={C.accent} strokeWidth={2.8} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6" /></svg>
          )}
        </div>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 300, left: 90, opacity: pr(t, T.logos) }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 44, color: C.muted }}>Yönleri araştırıyor,</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 96, color: C.fg, letterSpacing: "-0.045em" }}>en <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>doğrusunu</span> seçiyoruz.</div>
      </div>
      <div style={{ position: "absolute", top: 560, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 40, paddingLeft: 90 }}>
        {row(<LogoA />, 0, false)}
        {row(<FMark size={210} />, 1, true)}
        {row(<LogoB />, 2, false)}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 9. Applications (quick cuts) ---------- */
const Card: React.FC<{ w: number; dark?: boolean }> = ({ w, dark }) => (
  <div style={{ width: w, height: w * 0.58, borderRadius: w * 0.04, background: dark ? "#111" : NEUTRAL, border: dark ? "1px solid rgba(255,255,255,0.12)" : "none", boxShadow: "0 50px 90px -30px rgba(0,0,0,0.9)", padding: w * 0.08, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <FMark size={w * 0.16} />
    <div>
      <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: w * 0.06, color: dark ? C.fg : "#141414" }}>FNGN Dijital</div>
      <div style={{ fontFamily: fonts.sans, fontSize: w * 0.035, color: dark ? C.muted : "#6b6258" }}>hello@fngn.com.tr · {SITE}</div>
    </div>
    <div style={{ position: "absolute", right: w * 0.08, top: w * 0.08, width: w * 0.05, height: w * 0.05, borderRadius: "50%", background: C.accent }} />
  </div>
);
const Apply: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.apply);
  const cut = t < 48.66 ? 0 : t < 49.16 ? 1 : 2;
  const local = t - [T.apply, 48.66, 49.16][cut];
  const z = 1.08 - Math.min(local, 1.2) * 0.06;
  return (
    <AbsoluteFill style={{ background: ["linear-gradient(160deg, #2a2420, #0e0c0a)", "linear-gradient(180deg, #d9d2c7, #9c958a)", "linear-gradient(200deg, #1a1a1d, #070708)"][cut] }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})` }}>
        {cut === 0 && (
          <>
            {Array.from({ length: 14 }, (_, i) => <div key={i} style={{ position: "absolute", left: 0, right: 0, top: 200 + i * 110, height: 50, background: "rgba(255,255,255,0.025)", transform: "skewY(-12deg)" }} />)}
            <div style={{ position: "absolute", left: 160, top: 700, transform: "rotate(-14deg)" }}><Card w={760} /></div>
          </>
        )}
        {cut === 1 && (
          <>
            <div style={{ position: "absolute", left: 120, top: 660, width: 40, height: 140, background: "#8f877b" }} />
            <div style={{ position: "absolute", left: 160, top: 700, width: 120, height: 30, background: "#8f877b" }} />
            <div style={{ position: "absolute", left: 280, top: 560, width: 520, height: 520, background: `linear-gradient(135deg, #1a1a1a, #0b0b0b)`, boxShadow: "60px 80px 120px rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <FMark size={300} />
            </div>
          </>
        )}
        {cut === 2 && (
          <div style={{ position: "absolute", left: 340, top: 380, width: 400, height: 820, borderRadius: 60, background: "#0a0a0a", border: "6px solid #2a2a2a", boxShadow: "0 60px 120px rgba(0,0,0,0.8)", overflow: "hidden" }}>
            <div style={{ padding: 30, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6, marginTop: 80 }}>
              {Array.from({ length: 12 }, (_, i) => <Tile key={i} k={(i * 5) % 12} size={108} />)}
            </div>
            <div style={{ position: "absolute", top: 34, left: 0, right: 0, textAlign: "center", fontFamily: fonts.sans, fontWeight: 600, fontSize: 24, color: C.fg }}>{HANDLE}</div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 90, top: 300, fontFamily: fonts.display, fontWeight: 800, fontSize: 84, letterSpacing: "-0.04em", color: cut === 1 ? "#141414" : C.fg }}>
        Her temas <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>noktasına.</span>
      </div>
      <div style={{ position: "absolute", left: 90, top: 410, fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, letterSpacing: "0.2em", color: cut === 1 ? "#3a352f" : C.muted }}>
        {["KARTVİZİT", "TABELA", "SOSYAL MEDYA"][cut]}
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: interpolate(local, [0, 0.12], [0.35, 0], clamp) }} />
    </AbsoluteFill>
  );
};

/* ---------- 10. Remember ---------- */
const Remember: React.FC = () => {
  const t = useT(T.remember);
  const a = pr(t, T.remember, 0.5);
  const m = pr(t, T.meaning, 0.5);
  const d = pr(t, T.design, 0.5);
  const up = pr(t, T.meaning - 0.2, 0.5);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, right: 90, top: interpolate(up, [0, 1], [820, 360]) }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 92, color: C.fg, opacity: a, filter: `blur(${(1 - a) * 10}px)` }}>Unutmayın…</div>
        <div style={{ marginTop: 60, fontFamily: fonts.display, fontWeight: 300, fontSize: 82, lineHeight: 1.08, color: C.fg, opacity: m, transform: `translateY(${(1 - m) * 20}px)` }}>
          <b style={{ fontWeight: 800 }}>Strateji</b> markanıza <span style={{ fontFamily: fonts.serif, color: C.accent, fontSize: 96 }}>anlam</span> verir.
        </div>
        <div style={{ marginTop: 60, fontFamily: fonts.display, fontWeight: 300, fontSize: 82, lineHeight: 1.08, color: C.fg, opacity: d, transform: `translateY(${(1 - d) * 20}px)` }}>
          <b style={{ fontWeight: 800 }}>Tasarım</b> ise o anlamı <span style={{ fontFamily: fonts.serif, color: C.accent, fontSize: 96 }}>nasıl ilettiğinizdir.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 11. CTA with the real FNGN site ---------- */
const Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.cta);
  const h = pr(t, T.cta + 0.1, 0.6);
  const sub = pr(t, T.link, 0.5);
  const phone = spring({ frame: frame - 8, fps: 30, config: { damping: 16, stiffness: 80 } });
  // only hero + stats are shown (the capture is cropped above the About section)
  const scroll = interpolate(t, [57.5, T.end - 0.5], [0, 560], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const follow = pr(t, 60.6, 0.5);
  const out = interpolate(t, [T.end - 0.6, T.end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <div style={{ position: "absolute", top: 270, left: 60, right: 60, textAlign: "center", opacity: h, transform: `translateY(${(1 - h) * 24}px)` }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 70, color: C.fg, letterSpacing: "-0.04em", lineHeight: 1.05 }}>Siz de anlamı olan bir</div>
        <div style={{ fontFamily: fonts.serif, fontSize: 96, color: C.accent, lineHeight: 1 }}>marka mı kuruyorsunuz?</div>
        <div style={{ marginTop: 18, fontFamily: fonts.sans, fontWeight: 600, fontSize: 40, color: C.fg, opacity: sub }}>Profildeki bağlantıdan ulaşın · {SITE}</div>
        <div style={{ marginTop: 18, fontFamily: fonts.sans, fontSize: 32, color: C.muted, opacity: follow }}>Daha fazlası için {HANDLE} ↗</div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 540 - 250,
          top: 720,
          width: 500,
          height: 1040,
          borderRadius: 70,
          background: "#050505",
          border: "8px solid #2b2b2b",
          boxShadow: "0 80px 160px -40px rgba(0,0,0,0.95), 0 0 0 2px rgba(255,255,255,0.06)",
          overflow: "hidden",
          transform: `perspective(1800px) rotateX(${(1 - phone) * 30 + 12}deg) translateY(${(1 - phone) * 300}px)`,
          transformOrigin: "50% 0%",
        }}
      >
        <Img src={staticFile("site/fngn-mobile-tr.jpg")} style={{ width: "100%", transform: `translateY(${-scroll * (484 / 600)}px)` }} />
        <div style={{ position: "absolute", top: 16, left: "50%", marginLeft: -60, width: 120, height: 32, borderRadius: 16, background: "#000" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 360, background: "linear-gradient(180deg, transparent, #000)" }} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Audio ---------- */
const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 1 }) => (
  <Sequence from={s(at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);
const musicVolume = (f: number) => {
  const t = f / 30;
  return interpolate(t, [0, 0.05, 1.3, 1.8, 60.4, 61.2, T.end - 1.4, T.end], [0, 0.45, 0.45, 0.2, 0.2, 0.55, 0.55, 0], clamp);
};
const SoundDesign: React.FC = () => (
  <>
    <Audio src={staticFile("music07.mp3")} startFrom={s(11.5)} volume={musicVolume} />
    <Audio src={staticFile("vo07_a.mp3")} volume={1} />
    {LIST.map(([w, a]) => <Sfx key={w} at={a} src="tick" vol={0.25} />)}
    <Sfx at={T.tip} src="whoosh" vol={0.3} />
    <Sfx at={T.dive} src="whoosh" vol={0.35} />
    <Sfx at={T.full} src="boom" vol={0.45} />
    <Sfx at={T.proc - 0.1} src="whoosh" vol={0.25} />
    <Sfx at={T.lock} src="tick" vol={0.5} />
    <Sfx at={T.venn - 0.1} src="whoosh" vol={0.25} />
    <Sfx at={T.center} src="boom" vol={0.4} />
    <Sfx at={T.mood - 0.1} src="whoosh" vol={0.25} />
    <Sfx at={T.pick + 0.3} src="pop" vol={0.3} />
    <Sfx at={T.apply} src="whoosh" vol={0.3} />
    <Sfx at={48.66} src="whoosh" vol={0.3} />
    <Sfx at={49.16} src="whoosh" vol={0.3} />
    <Sfx at={T.cta} src="whoosh" vol={0.3} />
  </>
);

/* ---------- Composition ---------- */
const Fade: React.FC<{ dur: number; children: React.ReactNode; inF?: number; outF?: number }> = ({ dur, children, inF = 6, outF = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, inF, dur - outF, dur], [0, 1, 1, 0], clamp);
  const b = interpolate(frame, [dur - outF, dur], [0, 10], clamp);
  return <AbsoluteFill style={{ opacity: o, filter: `blur(${b}px)` }}>{children}</AbsoluteFill>;
};
const scenes: { from: number; to: number; C: React.FC; inF?: number; outF?: number }[] = [
  { from: 0, to: T.tip, C: Intro, inF: 1 },
  { from: T.tip, to: T.proc, C: Iceberg },
  { from: T.proc, to: T.venn, C: Process },
  { from: T.venn, to: T.mood, C: Venn },
  { from: T.mood, to: T.logos, C: Mood },
  { from: T.logos, to: T.apply, C: Logos },
  { from: T.apply, to: T.remember, C: Apply, inF: 1, outF: 4 },
  { from: T.remember, to: T.cta, C: Remember },
  { from: T.cta, to: T.end, C: Cta, outF: 1 },
];
export const Reel07Kimlik: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#060606" }}>
    <AbsoluteFill style={{ background: "radial-gradient(1100px 1300px at 50% 35%, #111, #050505 75%)" }} />
    {scenes.map(({ from, to, C: Scene, inF, outF }, i) => {
      const dur = s(to) - s(from);
      return (
        <Sequence key={i} from={s(from)} durationInFrames={dur}>
          <Fade dur={dur} inF={inF} outF={outF}>
            <Scene />
          </Fade>
        </Sequence>
      );
    })}
    <Caption />
    <Chrome total={REEL07_FRAMES} />
    <SoundDesign />
  </AbsoluteFill>
);
