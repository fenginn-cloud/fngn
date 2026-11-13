// Reel 13 — "Reklamın çalışıyordu. Sonra bir gün… birden durdu." (Meta ad fatigue)
// Original pseudo-3D animation: a field of spheres (the audience) projected with a simple orbit camera,
// the ad as a big orange sphere, new creatives as new shapes. Nothing is taken from the reference footage.
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, FMark, HANDLE, fonts, s } from "../brand";
import { W13 } from "./words13";

const VO_AT = 0.6;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const pio = (t: number, a: number, d = 0.6) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const useT = () => useCurrentFrame() / 30;
const w = (i: number) => W13[i][1] + VO_AT;
const we = (i: number) => W13[i][2] + VO_AT;

const S = { cta: w(65) - 0.2 };
const END = we(71) + 2.6;
export const REEL13_FRAMES = s(END);

/* ---------- camera ---------- */
type Cam = { d: number; el: number; yaw: number; F: number };
const KEYS: [number, Cam][] = [
  [0, { d: 950, el: 9, yaw: 0, F: 1150 }],
  [w(2), { d: 1150, el: 14, yaw: 4, F: 1150 }],
  [w(7), { d: 2300, el: 48, yaw: 0, F: 1150 }],
  [w(18), { d: 2200, el: 44, yaw: 10, F: 1150 }],
  [w(28), { d: 2350, el: 50, yaw: 16, F: 1150 }],
  [w(33), { d: 1500, el: 20, yaw: 8, F: 1150 }],
  [w(38), { d: 1700, el: 26, yaw: 4, F: 1150 }],
  [w(41), { d: 3000, el: 52, yaw: 0, F: 1150 }],
  [w(53), { d: 3900, el: 62, yaw: -8, F: 1150 }],
  [S.cta, { d: 4200, el: 66, yaw: -12, F: 1150 }],
];
const camAt = (t: number): Cam => {
  let i = 0;
  while (i < KEYS.length - 1 && t >= KEYS[i + 1][0]) i++;
  if (i === KEYS.length - 1) return KEYS[i][1];
  const [t0, a] = KEYS[i];
  const [t1, b] = KEYS[i + 1];
  const k = Easing.inOut(Easing.cubic)(Math.min(1, Math.max(0, (t - t0) / Math.max(0.8, Math.min(1.6, t1 - t0)))));
  const L = (x: number, y: number) => x + (y - x) * k;
  return { d: L(a.d, b.d), el: L(a.el, b.el), yaw: L(a.yaw, b.yaw), F: L(a.F, b.F) };
};
const CY = 1060;
const makeProj = (c: Cam) => {
  const el = (c.el * Math.PI) / 180, yaw = (c.yaw * Math.PI) / 180;
  const pos = [c.d * Math.sin(yaw) * Math.cos(el), c.d * Math.sin(el), -c.d * Math.cos(yaw) * Math.cos(el)];
  const len = Math.hypot(pos[0], pos[1], pos[2]);
  const f = [-pos[0] / len, -pos[1] / len, -pos[2] / len];
  // right = up x forward ; camUp = forward x right
  let r = [1 * f[2] - 0 * f[1], 0 * f[0] - 0 * f[2], 0 * f[1] - 1 * f[0]];
  const rl = Math.hypot(r[0], r[1], r[2]);
  r = r.map((x) => x / rl);
  const u = [f[1] * r[2] - f[2] * r[1], f[2] * r[0] - f[0] * r[2], f[0] * r[1] - f[1] * r[0]];
  return (x: number, y: number, z: number) => {
    const dx = x - pos[0], dy = y - pos[1], dz = z - pos[2];
    const zc = dx * f[0] + dy * f[1] + dz * f[2];
    const xc = dx * r[0] + dy * r[1] + dz * r[2];
    const yc = dx * u[0] + dy * u[1] + dz * u[2];
    return { x: 540 + (c.F * xc) / zc, y: CY - (c.F * yc) / zc, k: c.F / zc, z: zc };
  };
};

/* ---------- audience ---------- */
const SP = 92, EXT = 1700, PR = 24;
type P = { x: number; z: number; r1: number; r2: number; d0: number };
const PEOPLE: P[] = [];
for (let gx = -EXT; gx <= EXT; gx += SP) for (let gz = -EXT; gz <= EXT; gz += SP) {
  const i = PEOPLE.length;
  const x = gx + (random(`x${i}`) - 0.5) * 40, z = gz + (random(`z${i}`) - 0.5) * 40;
  PEOPLE.push({ x, z, r1: random(`a${i}`), r2: random(`b${i}`), d0: Math.hypot(x, z) });
}
const RING = 640;
const R0 = (t: number) => interpolate(t, [0.5, w(5)], [130, RING], clamp);

// new creatives: [label, x, z, start, kind]
type Kind = "cube" | "cone" | "torus" | "sphere";
const NEW: [string, number, number, number, Kind][] = [
  ["YENİ KANCA", -1150, 900, w(41), "cube"],
  ["YENİ AÇI", 1180, 760, w(43), "cone"],
  ["YENİ YÜZ", 150, -1250, w(45), "torus"],
  ["HAFTA 2", -1200, -900, w(61), "cube"],
  ["HAFTA 3", 1200, -900, w(62) + 0.3, "torus"],
  ["HAFTA 4", -150, 1400, w(63) + 0.4, "cone"],
];
const NR = 560;
const reachOf = (k: number, t: number) => interpolate(t, [NEW[k][3] + 0.7, NEW[k][3] + 3.2], [0, NR], { ...clamp, easing: Easing.out(Easing.quad) });

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * k)).join(",")})`;
};
const GREY = "#bcb7b0", ORANGE = "#E26205", DULL = "#6e4b3a", FRESH = "#FF7A1A";

const Field: React.FC = () => {
  const t = useT();
  const cam = camAt(t);
  const P = makeProj(cam);
  const fatigue = interpolate(t, [w(19), we(23) + 0.4], [0, 1], clamp);
  const r0 = R0(t);
  const spread0 = t < w(6) ? 1 : 0;
  // people
  const items: { z: number; el: React.ReactNode }[] = [];
  PEOPLE.forEach((p, i) => {
    let col = GREY, hop = 0;
    if (p.r1 < 0.5 && p.d0 < r0 && p.d0 > 120) {
      col = mix(ORANGE, DULL, fatigue);
      const at = interpolate(p.d0, [130, RING], [0.5, w(5)], clamp);
      hop = spread0 ? Math.sin(Math.PI * Math.min(1, Math.max(0, (t - at) / 0.45))) : 0;
    }
    for (let k = 0; k < NEW.length; k++) {
      const [, cx, cz, st] = NEW[k];
      const d = Math.hypot(p.x - cx, p.z - cz);
      const rk = reachOf(k, t);
      if (p.r2 < 0.52 && d < rk && d > 90 && p.d0 > RING * 0.9) {
        col = FRESH;
        const at = st + 0.7 + (d / NR) * 2.5;
        hop = Math.max(hop, Math.sin(Math.PI * Math.min(1, Math.max(0, (t - at) / 0.45))));
      }
    }
    const q = P(p.x, PR + hop * 46, p.z);
    if (q.z < 50) return;
    const r = PR * q.k;
    if (q.x < -r || q.x > 1080 + r || q.y < 180 || q.y > 1920 + r) return;
    const sh = P(p.x, 0, p.z);
    const fog = 1 - interpolate(Math.max(Math.abs(p.x), Math.abs(p.z)), [1150, 1650], [0, 1], clamp);
    if (fog <= 0.02) return;
    items.push({
      z: q.z,
      el: (
        <g key={i} opacity={fog}>
          <ellipse cx={sh.x} cy={sh.y} rx={r * 1.05} ry={r * 0.35 * Math.max(0.3, Math.sin((cam.el * Math.PI) / 180) * 1.6)} fill="rgba(0,0,0,0.45)" />
          <circle cx={q.x} cy={q.y} r={r} fill={col} />
          <circle cx={q.x} cy={q.y} r={r} fill="url(#shade)" />
        </g>
      ),
    });
  });
  // the ad (big sphere)
  const inflate = interpolate(t, [w(36) - 0.1, w(36) + 0.5, w(37) + 0.2, w(37) + 0.6], [1, 1.9, 1.9, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const adGone = pio(t, w(40), 0.5);
  const AR = 110 * inflate * (1 - adGone * 0.55);
  const ad = P(0, AR, 0);
  items.push({
    z: ad.z,
    el: (
      <g key="ad">
        <ellipse cx={P(0, 0, 0).x} cy={P(0, 0, 0).y} rx={AR * ad.k * 1.1} ry={AR * ad.k * 0.4} fill="rgba(0,0,0,0.5)" />
        <circle cx={ad.x} cy={ad.y} r={AR * ad.k} fill={mix(ORANGE, DULL, fatigue * 0.7)} />
        <circle cx={ad.x} cy={ad.y} r={AR * ad.k} fill="url(#shade)" />
      </g>
    ),
  });
  // new creative shapes, flying out from the ad
  NEW.forEach(([, cx, cz, st, kind], k) => {
    if (t < st - 0.05) return;
    const fly = pio(t, st, 0.75);
    const x = cx * fly, z = cz * fly, y = 130 + Math.sin(Math.PI * fly) * 520;
    const q = P(x, y, z);
    const g = P(x, 0, z);
    const R = 130 * q.k * pr(t, st - 0.05, 0.3);
    items.push({ z: q.z - 1, el: <g key={`n${k}`}><ellipse cx={g.x} cy={g.y} rx={R * 1.1} ry={R * 0.4} fill="rgba(0,0,0,0.45)" /><Shape kind={kind} x={q.x} y={q.y} R={R} rot={t * 40 + k * 30} /></g> });
  });
  items.sort((a, b) => b.z - a.z);
  // reach ring of the original ad
  const ringO = pr(t, w(10), 0.6) * (1 - pio(t, w(41), 0.6));
  const ringPts = Array.from({ length: 73 }).map((_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const q = P(Math.cos(a) * RING, 0, Math.sin(a) * RING);
    return `${q.x.toFixed(1)},${q.y.toFixed(1)}`;
  }).join(" ");
  const pulse = ((t - w(10)) % 1.1) / 1.1;
  const pulsePts = Array.from({ length: 73 }).map((_, i) => {
    const a = (i / 72) * Math.PI * 2;
    const q = P(Math.cos(a) * RING * pulse, 0, Math.sin(a) * RING * pulse);
    return `${q.x.toFixed(1)},${q.y.toFixed(1)}`;
  }).join(" ");
  const lab = P(0, 0, -RING - 60);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="shade" cx="0.36" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#fff" stopOpacity="0.75" />
            <stop offset="0.25" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="0.7" stopColor="#000" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000" stopOpacity="0.55" />
          </radialGradient>
        </defs>
        <polyline points={ringPts} fill="none" stroke="rgba(245,245,245,0.75)" strokeWidth="4" strokeDasharray="14 12" opacity={ringO} />
        {t > w(10) && t < w(33) && <polyline points={pulsePts} fill="none" stroke={ORANGE} strokeWidth="3" opacity={ringO * (1 - pulse) * 0.8} />}
        {items.map((it) => it.el)}
      </svg>
      <div style={{ position: "absolute", left: lab.x - 300, width: 600, top: lab.y - 60, textAlign: "center", opacity: ringO * (1 - pio(t, w(33), 0.4)) }}>
        <span style={{ whiteSpace: "nowrap", padding: "8px 18px", borderRadius: 10, background: "rgba(10,10,10,0.75)", border: `1.5px solid ${C.line}`, fontFamily: fonts.sans, fontWeight: 600, fontSize: 26, letterSpacing: "0.12em", color: C.fg }}>AYNI KİTLE · {Math.round(interpolate(t, [w(10), we(23)], [1.4, 6.2], clamp) * 10) / 10}× GÖRDÜ</span>
      </div>
      {NEW.map(([label, cx, cz, st], k) => {
        const q = P(cx, 360, cz);
        const o = pr(t, st + 0.6, 0.3) * (1 - pio(t, S.cta - 0.3, 0.3));
        if (o <= 0) return null;
        return (
          <div key={k} style={{ position: "absolute", left: q.x - 150, width: 300, top: q.y - 40, textAlign: "center", opacity: o, transform: `translateY(${(1 - o) * 14}px)` }}>
            <span style={{ padding: "8px 16px", borderRadius: 10, background: ORANGE, fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, letterSpacing: "0.1em", color: "#0b0b0b" }}>{label}</span>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const Shape: React.FC<{ kind: Kind; x: number; y: number; R: number; rot: number }> = ({ kind, x, y, R, rot }) => {
  if (R <= 0.5) return null;
  if (kind === "cube") {
    const a = (rot * Math.PI) / 180;
    const c = Math.cos(a) * R * 0.9, sn = Math.sin(a) * R * 0.45;
    const top = [[x - c, y - R * 0.5 - sn * 0.5], [x + sn * 2, y - R * 0.5 - Math.abs(c) * 0.35 - R * 0.25], [x + c, y - R * 0.5 + sn * 0.5], [x - sn * 2, y - R * 0.5 + Math.abs(c) * 0.35 - R * 0.25]];
    const ptsTop = `${x - R * 0.85},${y - R * 0.45} ${x},${y - R * 0.95} ${x + R * 0.85},${y - R * 0.45} ${x},${y + R * 0.05 - R * 0.1}`;
    void top;
    return (
      <g>
        <polygon points={`${x - R * 0.85},${y - R * 0.45} ${x},${y - R * 0.05} ${x},${y + R * 0.95} ${x - R * 0.85},${y + R * 0.5}`} fill="#b84f04" />
        <polygon points={`${x + R * 0.85},${y - R * 0.45} ${x},${y - R * 0.05} ${x},${y + R * 0.95} ${x + R * 0.85},${y + R * 0.5}`} fill="#8f3d03" />
        <polygon points={ptsTop} fill={FRESH} />
      </g>
    );
  }
  if (kind === "cone") {
    return (
      <g>
        <defs><linearGradient id="cone" x1="0" x2="1"><stop offset="0" stopColor={FRESH} /><stop offset="1" stopColor="#8f3d03" /></linearGradient></defs>
        <ellipse cx={x} cy={y + R * 0.75} rx={R * 0.9} ry={R * 0.3} fill="#8f3d03" />
        <polygon points={`${x},${y - R} ${x - R * 0.9},${y + R * 0.75} ${x + R * 0.9},${y + R * 0.75}`} fill="url(#cone)" />
      </g>
    );
  }
  if (kind === "torus") {
    const ry = R * (0.55 + 0.35 * Math.abs(Math.sin((rot * Math.PI) / 180)));
    return (
      <g>
        <ellipse cx={x} cy={y} rx={R * 0.95} ry={ry} fill="none" stroke="#b84f04" strokeWidth={R * 0.42} />
        <ellipse cx={x} cy={y - R * 0.05} rx={R * 0.95} ry={ry} fill="none" stroke={FRESH} strokeWidth={R * 0.28} />
      </g>
    );
  }
  return <circle cx={x} cy={y} r={R} fill={FRESH} />;
};

/* ---------- HUD ---------- */
const CHAPTERS: [number, string][] = [[0, "01 · REKLAM ÇALIŞIYOR"], [w(2), "02 · BİRDEN DURDU"], [w(10), "03 · AYNI KİŞİLER"], [w(24), "04 · REKLAM YORGUNLUĞU"], [w(33), "05 · YENİ KREATİF"], [w(53), "06 · HER HAFTA"]];
const Hud: React.FC = () => {
  const t = useT();
  const ch = CHAPTERS.filter(([a]) => t >= a).pop()!;
  const cost = t < w(47)
    ? interpolate(t, [w(28), we(32)], [120, 245], clamp)
    : interpolate(t, [w(47), we(64)], [245, 95], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const up = t >= w(28) && t < w(47);
  const o = 1 - pio(t, S.cta - 0.3, 0.3);
  const flash = interpolate(t, [w(31), w(31) + 0.2, we(32) + 0.3], [0, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 120, left: 60, right: 60, display: "flex", justifyContent: "space-between", alignItems: "center", opacity: o, fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, letterSpacing: "0.14em", color: C.fg }}>
      <span style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(10,10,10,0.7)", border: `1.5px solid ${C.line}` }}>{ch[1]}</span>
      <span style={{ padding: "10px 16px", borderRadius: 10, background: "rgba(10,10,10,0.7)", border: `1.5px solid ${up ? ORANGE : C.line}`, boxShadow: `0 0 ${flash * 40}px rgba(226,98,5,${flash * 0.8})` }}>
        SATIŞ BAŞI <b style={{ color: up ? ORANGE : C.fg, fontFamily: fonts.display, fontSize: 26, letterSpacing: "0.02em" }}>{Math.round(cost)} ₺</b> {up ? "▲" : t >= w(47) ? "▼" : ""}
      </span>
    </div>
  );
};

/* ---------- captions: 3-word groups, current word in an orange pill ---------- */
const CHUNKS: number[][] = (() => {
  const out: number[][] = [];
  let cur: number[] = [];
  W13.forEach(([word, , b], i) => {
    cur.push(i);
    const gap = i + 1 < W13.length ? W13[i + 1][1] - b : 9;
    if (/[.,?”]$/.test(word) || cur.length >= 3 || gap > 0.3) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const Caption: React.FC = () => {
  const t = useT();
  const ci = CHUNKS.findIndex((ch, n) => t >= w(ch[0]) - 0.06 && (n + 1 >= CHUNKS.length || t < w(CHUNKS[n + 1][0]) - 0.06));
  if (ci < 0 || t >= w(69) - 0.1) return null;
  const ch = CHUNKS[ci];
  const cur = ch.filter((i) => t >= w(i) - 0.04).pop() ?? ch[0];
  return (
    <div style={{ position: "absolute", top: 250, left: 50, right: 50, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 16px" }}>
      {ch.map((i) => {
        const on = t >= w(i) - 0.04;
        const hi = i === cur;
        return (
          <span key={i} style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 74, lineHeight: 1.15, letterSpacing: "-0.01em", padding: hi ? "0 16px 6px" : "0", borderRadius: 14, background: hi ? ORANGE : "transparent", color: on ? (hi ? "#0b0b0b" : C.fg) : "rgba(245,245,245,0.3)", textShadow: hi ? "none" : "0 4px 24px rgba(0,0,0,0.7)" }}>
            {W13[i][0].replace(/[,]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- CTA ---------- */
const Cta: React.FC = () => {
  const t = useT();
  const a = pr(t, S.cta + 0.1, 0.6);
  const word = pr(t, w(69) - 0.1, 0.35);
  const pill = interpolate(t, [w(70) - 0.05, w(70) + 0.3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const brand = pr(t, we(71) + 0.2, 0.5);
  const orb = t * 1.4;
  const mx = 540 + Math.cos(orb) * 300, my = 1080 + Math.sin(orb) * 70;
  const front = Math.sin(orb) > 0;
  const moon = <circle cx={mx} cy={my} r={26} fill={ORANGE} />;
  return (
    <AbsoluteFill style={{ opacity: a }}>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", opacity: word }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 96, color: C.fg }}>Yorumlara</div>
        <div style={{ display: "inline-block", marginTop: 10, transform: `scale(${pill})`, padding: "6px 40px 16px", borderRadius: 26, background: ORANGE, fontFamily: fonts.display, fontWeight: 800, fontSize: 132, color: "#0b0b0b" }}>REKLAM</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 96, color: C.fg, marginTop: 6, opacity: pr(t, w(71) - 0.05, 0.3) }}>yaz</div>
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <defs>
          <radialGradient id="ball" cx="0.38" cy="0.32" r="0.8"><stop offset="0" stopColor="#ffffff" /><stop offset="0.55" stopColor="#d9d4cd" /><stop offset="1" stopColor="#6d6862" /></radialGradient>
        </defs>
        <ellipse cx={540} cy={1290} rx={190} ry={36} fill="rgba(0,0,0,0.6)" />
        {!front && moon}
        <ellipse cx={540} cy={1080} rx={300} ry={70} fill="none" stroke="#2a2a2a" strokeWidth={14} transform="rotate(-12 540 1080)" />
        <circle cx={540} cy={1080} r={180} fill="url(#ball)" />
        <path d={`M ${540 - 300} 1080 A 300 70 0 0 0 ${540 + 300} 1080`} fill="none" stroke="#2a2a2a" strokeWidth={14} transform="rotate(-12 540 1080)" />
        {front && moon}
      </svg>
      <div style={{ position: "absolute", top: 1400, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: brand, transform: `translateY(${(1 - brand) * 24}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.display, fontWeight: 700, fontSize: 56, color: C.fg }}>
          <div style={{ width: 76, height: 76, borderRadius: 20, background: "#0c0c0c", border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><FMark size={66} /></div>
          FNGN <span style={{ color: C.muted, fontWeight: 500 }}>Dijital</span>
        </div>
        <div style={{ fontFamily: fonts.sans, fontSize: 32, color: C.muted, textAlign: "center", lineHeight: 1.4 }}>Markan için her hafta yeni reklam kreatifleri.<br />{HANDLE}</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const SoundDesign: React.FC = () => {
  const vol = (f: number) => {
    const t = f / 30;
    return interpolate(t, [0, 0.3, VO_AT + 0.2, we(71), we(71) + 0.4, END - 0.7, END], [0, 0.4, 0.2, 0.2, 0.45, 0.45, 0], clamp);
  };
  return (
    <>
      <Sequence from={s(1.5)}><Audio src={staticFile("music13.mp3")} volume={(f) => vol(f + s(1.5))} /></Sequence>
      <Sequence from={s(VO_AT)}><Audio src={staticFile("vo13.mp3")} /></Sequence>
      {[0.7, 1.2, 1.7, 2.2].map((x, i) => <Sequence key={`p${i}`} from={s(x)}><Audio src={staticFile("sfx/pop.wav")} volume={0.22} /></Sequence>)}
      <Sequence from={s(w(6))}><Audio src={staticFile("sfx/boom.wav")} volume={0.35} /></Sequence>
      <Sequence from={s(w(36) - 0.1)}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.35} /></Sequence>
      {NEW.map(([, , , st], k) => <Sequence key={`n${k}`} from={s(st)}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} /></Sequence>)}
      {NEW.map(([, , , st], k) => <Sequence key={`q${k}`} from={s(st + 0.8)}><Audio src={staticFile("sfx/pop.wav")} volume={0.3} /></Sequence>)}
      <Sequence from={s(w(70))}><Audio src={staticFile("sfx/pop.wav")} volume={0.4} /></Sequence>
    </>
  );
};

export const Reel13Yorgunluk: React.FC = () => {
  const t = useT();
  const fieldO = 1 - pio(t, S.cta - 0.1, 0.6);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 60%, #1c1b1a, #070707 75%)" }}>
      {fieldO > 0 && <AbsoluteFill style={{ opacity: fieldO }}><Field /></AbsoluteFill>}
      {t >= S.cta && <Cta />}
      <Hud />
      <Caption />
      <SoundDesign />
    </AbsoluteFill>
  );
};
