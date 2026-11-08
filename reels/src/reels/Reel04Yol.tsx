// Reel 04 — "Bütün yolu görmen gerekmiyor. 50 metre yeterli."
// Word timings come from an ElevenLabs Scribe transcript of public/vo04_a.mp3.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  interpolateColors,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";
import { Background, C, Chrome, Outro, fonts, prog, s } from "../brand";
import { TR_ANATOLIA, TR_CITIES, TR_H, TR_ROUTE_PTS, TR_THRACE, TR_W } from "./turkiye";

/* ---------- Voice timing ---------- */
const W: [string, number, number][] = [
  ["Bütün", 0.12, 0.4], ["yolu", 0.44, 0.58], ["görmen", 0.64, 0.98], ["gerekmiyor.", 1.04, 1.66],
  ["Gece", 2.14, 2.44], ["farların", 2.68, 3.1], ["sana", 3.14, 3.36], ["önünü", 3.4, 3.62], ["gösterir.", 3.68, 4.24],
  ["Belki", 4.62, 4.96], ["50", 5.12, 5.2], ["metre…", 5.26, 5.56], ["O", 5.92, 5.94], ["kadar.", 6.0, 6.3],
  ["Yine", 6.74, 6.92], ["de", 7.0, 7.28], ["koca", 7.36, 7.62], ["bir", 7.68, 7.76], ["ülkeyi", 7.82, 8.14], ["geçebilirsin.", 8.2, 8.9],
  ["Edirne'den", 9.26, 9.84], ["Kars'a,", 9.96, 10.42], ["her", 10.92, 11.08], ["seferinde", 11.16, 11.76], ["50", 11.94, 12.04], ["metre.", 12.1, 12.4],
  ["Tam", 12.78, 12.92], ["haritayı", 12.98, 13.34], ["beklemeyi", 13.38, 13.82], ["bırak.", 13.86, 14.14],
  ["Bir", 14.48, 14.56], ["sonraki", 14.64, 15.02], ["adımı", 15.06, 15.28], ["aydınlat.", 15.32, 15.82],
  ["Sonra", 16.18, 16.52], ["bir", 16.68, 16.76], ["sonrakini.", 16.84, 17.36],
  ["50", 17.88, 17.98], ["metre", 18.02, 18.36], ["yeterli.", 18.78, 19.22],
];
const ACCENT_WORDS = new Set(["yolu", "farların", "50", "metre…", "metre.", "metre", "ülkeyi", "Kars'a,", "haritayı", "adımı", "aydınlat.", "sonrakini.", "yeterli."]);
type Line = { words: { w: string; a: number }[]; a: number; b: number };
const LINES: Line[] = (() => {
  const out: Line[] = [];
  let cur: { w: string; a: number }[] = [];
  let a = 0;
  W.forEach(([w, ws, we], i) => {
    if (cur.length === 0) a = ws;
    cur.push({ w, a: ws });
    if (/[.,…]$/.test(w) || i === W.length - 1) {
      out.push({ words: cur, a, b: we });
      cur = [];
    }
  });
  return out;
})();

const T = {
  lights: 2.6,
  bracket: 5.1,
  okadar: 5.92,
  map: 6.7,
  go: 9.26,
  arrive: 11.6,
  times: 11.94,
  paper: 12.7,
  stamp: 13.86,
  beam: 14.42,
  step1: 15.06,
  step2: 16.6,
  enough: 17.85,
  yeterli: 18.78,
  outro: 20.9,
  end: 24.6,
};
export const REEL04_FRAMES = s(T.end);

const NIGHT = "#06070b";
const LIGHT = "#F4D9A6"; // warm headlight
const useT = () => useCurrentFrame() / 30;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* ---------- Caption pill ---------- */
const Caption: React.FC = () => {
  const t = useT();
  const idx = LINES.findIndex((l, i) => t >= l.a - 0.05 && t < (LINES[i + 1]?.a ?? l.b + 0.8) && t < l.b + 1.0);
  if (idx < 0 || t > T.outro) return null;
  const line = LINES[idx];
  const o = interpolate(t, [line.a - 0.05, line.a + 0.1, line.b + 0.7, line.b + 1.0], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 1470, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          maxWidth: 860,
          padding: "18px 34px",
          borderRadius: 22,
          background: "rgba(10,10,12,0.72)",
          border: "1.5px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0 0.26em",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 46,
          lineHeight: 1.25,
        }}
      >
        {line.words.map((w, i) => {
          const p = interpolate(t, [w.a - 0.05, w.a + 0.12], [0, 1], clamp);
          const on = ACCENT_WORDS.has(w.w) ? C.accent : C.fg;
          return (
            <span key={i} style={{ color: interpolateColors(p, [0, 1], ["rgba(245,245,245,0.25)", on]) }}>
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- Distance counter ---------- */
const kmAt = (t: number) => {
  if (t < T.lights) return 0;
  if (t < T.map) return interpolate(t, [T.lights, T.map], [0, 4.8], clamp);
  if (t < T.go) return interpolate(t, [T.map, T.go], [4.8, 31.2], clamp);
  if (t < T.arrive) return interpolate(t, [T.go, T.arrive], [31.2, 1600], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  return 1600 + (t - T.arrive) * 0.9;
};
const fmtKm = (v: number) =>
  v.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " km";
const Counter: React.FC = () => {
  const t = useT();
  const o = interpolate(t, [T.lights, T.lights + 0.3, T.beam - 0.3, T.beam], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          minWidth: 260,
          textAlign: "center",
          padding: "16px 34px",
          borderRadius: 16,
          border: "2px solid rgba(255,255,255,0.14)",
          background: "rgba(10,10,12,0.8)",
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 44,
          color: C.accent,
          letterSpacing: "0.02em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {fmtKm(kmAt(t))}
      </div>
    </div>
  );
};

/* ---------- Scene 1–2: night road ---------- */
const HZ = 760; // horizon
const Road: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT();
  const lights = interpolate(t, [T.lights, T.lights + 0.12, T.lights + 0.2, T.lights + 0.35], [0, 0.7, 0.35, 1], clamp);
  const title = prog(frame, 2, 14);
  const strike = interpolate(t, [0.95, 1.45], [0, 1], clamp);
  const titleOut = interpolate(t, [T.lights - 0.3, T.lights], [1, 0], clamp);
  const bracket = interpolate(t, [T.bracket, T.bracket + 0.5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const dark = interpolate(t, [T.okadar, T.okadar + 0.4], [0, 1], clamp);
  // dashes travel toward the viewer once the lights are on
  const speed = t < T.lights ? 0 : (t - T.lights) * 1.6;
  const dashes = Array.from({ length: 14 }, (_, i) => {
    const z = ((i - speed) % 14 + 14) % 14 + 0.6; // depth 0.6..14.6
    return z;
  });
  const yAt = (z: number) => HZ + 640 / z;
  const halfW = (z: number) => 900 / z;
  const stars = Array.from({ length: 40 }, (_, i) => ({ x: (i * 211) % 1080, y: 120 + ((i * 97) % 520), r: 1 + (i % 3) * 0.7 }));
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, #0b0d16 0%, ${NIGHT} 55%, #050505 100%)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="beam" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={LIGHT} stopOpacity={0.55} />
            <stop offset="70%" stopColor={LIGHT} stopOpacity={0.12} />
            <stop offset="100%" stopColor={LIGHT} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={NIGHT} stopOpacity={1} />
            <stop offset="100%" stopColor={NIGHT} stopOpacity={0} />
          </linearGradient>
        </defs>
        {stars.map((st, i) => (
          <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#fff" opacity={0.25 + 0.2 * Math.sin(frame / 10 + i)} />
        ))}
        {/* hills */}
        <path d={`M0 ${HZ} C 180 ${HZ - 60}, 320 ${HZ - 20}, 470 ${HZ - 40} S 760 ${HZ - 80}, 1080 ${HZ - 30} V ${HZ + 10} H 0 Z`} fill="#12151f" />
        {/* ground */}
        <rect x={0} y={HZ} width={1080} height={1920 - HZ} fill="#0a0a0d" />
        {/* road */}
        <path d={`M ${540 - 14} ${HZ} L ${540 + 14} ${HZ} L ${540 + 900} 1920 L ${540 - 900} 1920 Z`} fill="#16161a" />
        {/* light cone on the road */}
        <path
          d={`M ${540 - 70} ${HZ + 70} L ${540 + 70} ${HZ + 70} L ${540 + 420} 1460 L ${540 - 420} 1460 Z`}
          fill="url(#beam)"
          opacity={lights}
        />
        {/* road edge posts */}
        {dashes.map((z, i) => (
          <g key={`p${i}`} opacity={i % 2 ? 0 : interpolate(z, [0.6, 6, 14], [0.9, 0.5, 0.1]) * (0.25 + lights * 0.75)}>
            <rect x={540 - halfW(z) * 0.95} y={yAt(z) - 30 / z} width={5 / Math.sqrt(z)} height={60 / z} fill="#ddd" />
            <rect x={540 + halfW(z) * 0.95} y={yAt(z) - 30 / z} width={5 / Math.sqrt(z)} height={60 / z} fill="#ddd" />
          </g>
        ))}
        {/* centre dashes */}
        {dashes.map((z, i) => {
          const y1 = yAt(z);
          const y2 = yAt(z + 0.45);
          const w = 22 / z;
          const lit = interpolate(y1, [HZ + 60, 1000, 1460], [0.1, 0.9, 1], clamp);
          return <rect key={i} x={540 - w / 2} y={y2} width={w} height={Math.max(1, y1 - y2)} fill="#f2f2f2" opacity={(0.15 + lights * 0.85) * lit * (y1 > 1500 ? 0 : 1)} />;
        })}
        {/* darkness beyond the lit 50m */}
        <rect x={0} y={HZ - 90} width={1080} height={300} fill="url(#fade)" opacity={dark * 0.95} />
        <rect x={0} y={0} width={1080} height={HZ - 90} fill={NIGHT} opacity={dark * 0.7} />
        {/* 50 m bracket */}
        <g opacity={bracket}>
          <path
            d={`M 930 ${1460} H 960 V ${1460 - (1460 - (HZ + 70)) * bracket} H 930`}
            fill="none"
            stroke={C.accent}
            strokeWidth={5}
          />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          right: 140,
          top: 1080,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 76,
          color: C.accent,
          opacity: bracket,
          letterSpacing: "-0.03em",
        }}
      >
        50 m
      </div>
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 180,
          color: "rgba(245,245,245,0.25)",
          opacity: dark,
          transform: `scale(${0.8 + dark * 0.2})`,
        }}
      >
        ?
      </div>
      {/* title */}
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: title * titleOut }}>
        <div style={{ position: "relative", fontFamily: fonts.display, fontWeight: 800, fontSize: 132, letterSpacing: "-0.04em", color: C.fg, transform: `translateY(${(1 - title) * 30}px)` }}>
          BÜTÜN YOLU
          <div
            style={{
              position: "absolute",
              left: -14,
              top: "50%",
              height: 12,
              width: `calc(${strike * 100}% + ${strike * 28}px)`,
              opacity: strike > 0 ? 1 : 0,
              background: C.accent,
              borderRadius: 6,
              transform: "rotate(-2deg)",
              boxShadow: "0 0 24px rgba(226,98,5,0.7)",
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Scene 3: Türkiye ---------- */
const routeLen = (() => {
  const seg: number[] = [0];
  for (let i = 1; i < TR_ROUTE_PTS.length; i++) {
    const [x1, y1] = TR_ROUTE_PTS[i - 1];
    const [x2, y2] = TR_ROUTE_PTS[i];
    seg.push(seg[i - 1] + Math.hypot(x2 - x1, y2 - y1));
  }
  return seg;
})();
const ROUTE_TOTAL = routeLen[routeLen.length - 1];
const pointAt = (p: number): [number, number] => {
  const d = p * ROUTE_TOTAL;
  let i = 1;
  while (i < routeLen.length - 1 && routeLen[i] < d) i++;
  const f = (d - routeLen[i - 1]) / (routeLen[i] - routeLen[i - 1] || 1);
  const [x1, y1] = TR_ROUTE_PTS[i - 1];
  const [x2, y2] = TR_ROUTE_PTS[i];
  return [x1 + (x2 - x1) * f, y1 + (y2 - y1) * f];
};
const ROUTE_D = "M" + TR_ROUTE_PTS.map(([x, y]) => `${x} ${y}`).join(" L");

const MapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = useT() + T.map;
  const inP = spring({ frame, fps, config: { damping: 16, stiffness: 90 } });
  const dots = prog(frame, 10, 20);
  const p = interpolate(t, [T.go, T.arrive], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const [hx, hy] = pointAt(p);
  const arrived = spring({ frame: frame - s(T.arrive - T.map), fps, config: { damping: 10, stiffness: 140 } });
  const times = prog(frame, s(T.times - T.map), 14);
  const count = Math.round(interpolate(p, [0, 1], [0, 32000]));
  const OX = (1080 - TR_W) / 2;
  const OY = 760;
  return (
    <AbsoluteFill>
      {/* faint grid */}
      <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.35 }}>
        {Array.from({ length: 28 }, (_, i) => (
          <line key={`h${i}`} x1={0} x2={1080} y1={i * 70} y2={i * 70} stroke="rgba(255,255,255,0.05)" />
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <line key={`v${i}`} y1={0} y2={1920} x1={i * 70} x2={i * 70} stroke="rgba(255,255,255,0.05)" />
        ))}
      </svg>
      <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
        <g transform={`translate(${OX} ${OY}) translate(${TR_W / 2} ${TR_H / 2}) scale(${0.9 + inP * 0.1}) translate(${-TR_W / 2} ${-TR_H / 2})`} opacity={inP}>
          {[TR_THRACE, TR_ANATOLIA].map((d, i) => (
            <path key={i} d={d} fill="#15161b" stroke="rgba(226,98,5,0.55)" strokeWidth={2.5} strokeLinejoin="round" />
          ))}
          {/* planned route (dotted) */}
          <path d={ROUTE_D} fill="none" stroke="rgba(245,245,245,0.45)" strokeWidth={3} strokeDasharray="2 12" strokeLinecap="round" opacity={dots} />
          {/* travelled route */}
          <path
            d={ROUTE_D}
            fill="none"
            stroke={C.accent}
            strokeWidth={7}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={ROUTE_TOTAL}
            strokeDashoffset={ROUTE_TOTAL * (1 - p)}
            style={{ filter: "drop-shadow(0 0 10px rgba(226,98,5,0.8))" }}
          />
          {TR_CITIES.map(([name, x, y], i) => {
            const end = i === 0 || i === TR_CITIES.length - 1;
            return (
              <g key={name} opacity={dots}>
                <circle cx={x} cy={y} r={end ? 9 : 6} fill={end ? C.fg : "rgba(245,245,245,0.6)"} />
                <text
                  x={x}
                  y={y + (i % 2 ? 40 : -22)}
                  textAnchor="middle"
                  fontFamily={fonts.sans}
                  fontWeight={end ? 700 : 500}
                  fontSize={end ? 30 : 24}
                  fill={end ? C.fg : "rgba(245,245,245,0.55)"}
                >
                  {name}
                </text>
              </g>
            );
          })}
          {/* headlight dot */}
          <circle cx={hx} cy={hy} r={34} fill="rgba(244,217,166,0.25)" />
          <circle cx={hx} cy={hy} r={13} fill={LIGHT} style={{ filter: "drop-shadow(0 0 16px rgba(244,217,166,1))" }} />
          {/* labels */}
          <text x={TR_ROUTE_PTS[0][0] - 10} y={TR_ROUTE_PTS[0][1] - 66} fontFamily={fonts.sans} fontWeight={700} fontSize={24} letterSpacing="0.18em" fill={C.accent} opacity={dots}>
            BAŞLANGIÇ
          </text>
          <g opacity={arrived}>
            <circle cx={TR_ROUTE_PTS[TR_ROUTE_PTS.length - 1][0]} cy={TR_ROUTE_PTS[TR_ROUTE_PTS.length - 1][1]} r={20 + arrived * 30} fill="none" stroke={C.accent} strokeWidth={3} opacity={1 - arrived * 0.7} />
            <text x={TR_ROUTE_PTS[TR_ROUTE_PTS.length - 1][0] - 40} y={TR_ROUTE_PTS[TR_ROUTE_PTS.length - 1][1] - 70} textAnchor="middle" fontFamily={fonts.sans} fontWeight={700} fontSize={24} letterSpacing="0.18em" fill={C.accent}>
              HEDEF
            </text>
          </g>
        </g>
      </svg>
      <div style={{ position: "absolute", top: 450, left: 0, right: 0, textAlign: "center", opacity: inP }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 84, color: C.fg, letterSpacing: "-0.04em" }}>Koca bir ülke.</div>
        <div style={{ fontFamily: fonts.serif, fontSize: 96, color: C.accent, lineHeight: 1 }}>Edirne → Kars</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 1290,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "'Courier New', monospace",
          fontWeight: 700,
          fontSize: 58,
          color: C.fg,
          opacity: Math.max(times, interpolate(p, [0.02, 0.1], [0, 1], clamp)),
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count.toLocaleString("tr-TR")} <span style={{ color: C.accent }}>×</span> 50 m
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Scene 4: stop waiting for the full map ---------- */
const Paper: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const stamp = spring({ frame: frame - s(T.stamp - T.paper), fps, config: { damping: 9, stiffness: 220, mass: 0.6 } });
  const shake = frame >= s(T.stamp - T.paper) && frame < s(T.stamp - T.paper) + 6 ? Math.sin(frame * 3) * 8 : 0;
  const panels = ["#F1ECE3", "#E7DFD2", "#F1ECE3", "#E7DFD2"];
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "relative", marginTop: -120, transform: `scale(${inP}) rotate(${(1 - inP) * -8}deg) translateX(${shake}px)` }}>
        <div style={{ display: "flex", borderRadius: 10, overflow: "hidden", boxShadow: "0 50px 100px -30px rgba(0,0,0,0.9)" }}>
          {panels.map((c, i) => (
            <div key={i} style={{ width: 170, height: 560, background: c }} />
          ))}
        </div>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30 }}>
          <svg width={110} height={110} viewBox="0 0 50 50" style={{ transform: `rotate(${frame * 9}deg)` }}>
            <circle cx={25} cy={25} r={20} fill="none" stroke="rgba(20,20,20,0.15)" strokeWidth={4} />
            <path d="M25 5 A20 20 0 0 1 45 25" fill="none" stroke="#141414" strokeWidth={4} strokeLinecap="round" />
          </svg>
          <div style={{ fontFamily: "'Courier New', monospace", fontWeight: 700, fontSize: 30, letterSpacing: "0.12em", color: "#5a5248" }}>
            TAM HARİTA YÜKLENİYOR…
          </div>
        </AbsoluteFill>
        <div
          style={{
            position: "absolute",
            left: 40,
            right: 40,
            bottom: 70,
            display: "flex",
            justifyContent: "center",
            transform: `scale(${interpolate(stamp, [0, 1], [2.6, 1])}) rotate(-8deg)`,
            opacity: Math.min(1, stamp * 3),
          }}
        >
          <div
            style={{
              border: `8px solid ${C.accent}`,
              borderRadius: 14,
              padding: "14px 34px",
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 54,
              whiteSpace: "nowrap",
              letterSpacing: "0.02em",
              color: C.accent,
              background: "rgba(241,236,227,0.6)",
              mixBlendMode: "multiply",
            }}
          >
            BEKLEMEYİ BIRAK
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Scene 5–6: light up the next step ---------- */
const Chip: React.FC<{ label: string; at: number; y: number; hot?: boolean; size?: number }> = ({ label, at, y, hot, size = 52 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - s(at - T.beam), fps, config: { damping: 12, stiffness: 170 } });
  return (
    <div style={{ position: "absolute", top: y, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          transform: `scale(${sp}) translateY(${(1 - sp) * 40}px)`,
          opacity: Math.min(1, sp * 1.6),
          padding: `${size * 0.45}px ${size * 0.95}px`,
          borderRadius: 18,
          background: hot ? C.accent : LIGHT,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: size,
          letterSpacing: "0.01em",
          color: "#0b0b0b",
          boxShadow: hot ? "0 0 70px rgba(226,98,5,0.75)" : "0 20px 40px -20px rgba(0,0,0,0.7)",
        }}
      >
        {label}
      </div>
    </div>
  );
};
const Steps: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.beam;
  // beam reaches higher with each step
  const top = interpolate(t, [T.beam, T.beam + 0.5, T.step2, T.step2 + 0.5, T.yeterli - 0.1, T.yeterli + 0.4], [1920, 1180, 1180, 960, 960, 700], { ...clamp, easing: Easing.out(Easing.cubic) });
  const head = prog(frame, s(T.enough - T.beam), 16);
  const beamTopHalf = interpolate(top, [700, 1920], [330, 90]);
  return (
    <AbsoluteFill style={{ background: NIGHT }}>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="beam2" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0%" stopColor={LIGHT} stopOpacity={0.6} />
            <stop offset="75%" stopColor={LIGHT} stopOpacity={0.1} />
            <stop offset="100%" stopColor={LIGHT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <path d={`M ${540 - 70} 1920 L ${540 + 70} 1920 L ${540 + beamTopHalf} ${top} L ${540 - beamTopHalf} ${top} Z`} fill="url(#beam2)" />
      </svg>
      <div
        style={{
          position: "absolute",
          top: 420,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: head,
          transform: `translateY(${(1 - head) * 30}px)`,
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 140,
          letterSpacing: "-0.05em",
          color: C.fg,
        }}
      >
        50 metre
      </div>
      <Chip label="SONRAKİ ADIM" at={T.step1} y={1240} />
      <Chip label="SONRA BİR SONRAKİ" at={T.step2} y={1040} size={46} />
      <Chip label="YETERLİ." at={T.yeterli} y={760} hot size={84} />
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
  return interpolate(t, [0, 0.05, 1.8, 2.4, 19.3, 20.6, T.end - 1.4, T.end], [0, 0.5, 0.5, 0.26, 0.26, 0.6, 0.6, 0], clamp);
};
const SoundDesign: React.FC = () => (
  <>
    <Audio src={staticFile("music04.mp3")} startFrom={s(3.5)} volume={musicVolume} />
    <Audio src={staticFile("vo04_a.mp3")} volume={1} />
    <Sfx at={1.0} src="whoosh" vol={0.3} />
    <Sfx at={T.lights} src="tick" vol={0.7} />
    <Sfx at={T.lights + 0.2} src="tick" vol={0.5} />
    <Sfx at={T.bracket} src="pop" vol={0.25} />
    <Sfx at={T.map - 0.1} src="whoosh" vol={0.3} />
    <Sfx at={T.arrive} src="pop" vol={0.3} />
    <Sfx at={T.paper - 0.1} src="whoosh" vol={0.3} />
    <Sfx at={T.stamp} src="boom" vol={0.7} />
    <Sfx at={T.step1} src="pop" vol={0.3} />
    <Sfx at={T.step2} src="pop" vol={0.3} />
    <Sfx at={T.yeterli} src="boom" vol={0.6} />
    <Sfx at={T.outro} src="whoosh" vol={0.3} />
  </>
);

/* ---------- Composition ---------- */
const Fade: React.FC<{ dur: number; children: React.ReactNode; inF?: number }> = ({ dur, children, inF = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, inF, dur - 7, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
const scenes: { from: number; to: number; C: React.FC; inF?: number }[] = [
  { from: 0, to: T.map, C: Road, inF: 1 },
  { from: T.map, to: T.paper, C: MapScene },
  { from: T.paper, to: T.beam, C: Paper },
  { from: T.beam, to: T.outro, C: Steps },
];

export const Reel04Yol: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: NIGHT }}>
    {scenes.map(({ from, to, C: Scene, inF }, i) => {
      const dur = s(to) - s(from);
      return (
        <Sequence key={i} from={s(from)} durationInFrames={dur}>
          <Fade dur={dur} inF={inF}>
            <Scene />
          </Fade>
        </Sequence>
      );
    })}
    <Sequence from={s(T.outro)}>
      <Fade dur={s(T.end - T.outro)}>
        <Background />
        <Outro cta="İlk adımı birlikte atalım" />
      </Fade>
    </Sequence>
    <Counter />
    <Caption />
    <Chrome total={REEL04_FRAMES} />
    <SoundDesign />
  </AbsoluteFill>
);
