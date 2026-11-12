// Reel 12 — "Henüz hiç yorumun yok mu?" (first clients, testimonials, climbing prices)
// Original pictogram animation drawn in code; the reference was only used for the story beats.
// VO (public/vo12.mp3) starts at VO_AT; word times come from words12.ts (+ VO_AT).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, FMark, HANDLE, fonts, s } from "../brand";
import { W12 } from "./words12";

const VO_AT = 0.4;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const pio = (t: number, a: number, d = 0.6) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const pop = (t: number, a: number, d = 0.35) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2.2)) });
const useT = () => useCurrentFrame() / 30;
const w = (i: number) => W12[i][1] + VO_AT;
const we = (i: number) => W12[i][2] + VO_AT;
const END = we(80) + 2.0;
export const REEL12_FRAMES = s(END);

const WHITE = "#F2F0EC";
const FLOOR = 1480;
const tl = (n: number) => `${Math.round(n / 50) * 50 >= 1000 ? (Math.round(n / 50) * 50).toLocaleString("tr-TR") : Math.round(n)} ₺`;

// scene windows
const P = {
  c1: w(7) - 0.2, c2: w(21) - 0.2, c3: w(31) - 0.2, stairs: w(38) - 0.15, course: w(45) - 0.15,
  bars: w(54) - 0.2, seen: w(59) - 0.15, end: w(66) - 0.15,
};

/* ---------- pieces ---------- */
const Stars: React.FC<{ n: number; size: number; fill?: string; gap?: number }> = ({ n, size, fill = C.accent, gap = 14 }) => (
  <div style={{ display: "flex", gap }}>
    {[0, 1, 2, 3, 4].map((i) => {
      const f = Math.min(1, Math.max(0, n - i));
      return (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ transform: `scale(${0.85 + f * 0.15})` }}>
          <path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8z" fill={f > 0.5 ? fill : "none"} stroke={f > 0.5 ? fill : "rgba(242,240,236,0.6)"} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    })}
  </div>
);

type Look = "plain" | "beard" | "long";
const Person: React.FC<{ look: Look; x: number; o: number }> = ({ look, x, o }) => (
  <svg width={340} height={360} viewBox="0 0 340 360" style={{ position: "absolute", left: x, top: FLOOR - 360, opacity: o }}>
    {look === "long" && <path d="M95 120 Q95 40 170 38 Q245 40 245 120 L252 230 L88 230 Z" fill="#3a3734" />}
    <path d="M20 360 Q20 248 120 236 L220 236 Q320 248 320 360 Z" fill={WHITE} />
    <rect x="140" y="190" width="60" height="56" rx="20" fill={WHITE} />
    <ellipse cx="170" cy="130" rx="66" ry="80" fill={WHITE} />
    {look === "plain" && <path d="M104 118 Q106 52 170 50 Q236 52 236 118 Q214 84 170 84 Q128 84 104 118 Z" fill="#3a3734" />}
    {look === "beard" && <>
      <path d="M106 110 Q110 50 170 48 Q230 50 234 110 Q206 86 170 86 Q134 86 106 110 Z" fill="#3a3734" />
      <path d="M124 158 Q128 212 170 214 Q212 212 216 158 Q200 180 170 180 Q140 180 124 158 Z" fill="#3a3734" />
    </>}
  </svg>
);

const Tag: React.FC<{ price: number; o: number; x: number; y: number; badge?: number }> = ({ price, o, x, y, badge = 0 }) => (
  <div style={{ position: "absolute", left: x, top: y, opacity: o, transform: `translateY(${(1 - o) * 40}px)` }}>
    <svg width={360} height={130} viewBox="0 0 360 130" style={{ position: "absolute", left: 0, top: 0 }}>
      <path d="M48 6 L344 6 Q354 6 354 16 L354 114 Q354 124 344 124 L48 124 L6 65 Z" fill={WHITE} />
      <circle cx="44" cy="65" r="10" fill={C.bg} />
    </svg>
    <div style={{ position: "relative", width: 360, height: 130, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 40, fontFamily: fonts.display, fontWeight: 800, fontSize: 58, color: "#111" }}>{tl(price)}</div>
    <div style={{ position: "absolute", right: -26, top: -36, transform: `scale(${badge}) rotate(8deg)`, padding: "10px 20px", borderRadius: 999, background: C.accent, fontFamily: fonts.display, fontWeight: 800, fontSize: 36, color: "#0b0b0b" }}>-%50</div>
  </div>
);

const Testimonial: React.FC<{ lines: number; stars: number; ask?: number }> = ({ lines, stars, ask = 0 }) => (
  <div style={{ width: 380, height: 250, borderRadius: 28, background: WHITE, padding: "30px 34px", position: "relative", boxShadow: "0 30px 80px -30px rgba(0,0,0,0.9)" }}>
    <div style={{ fontFamily: fonts.serif, fontSize: 90, lineHeight: 0.6, color: C.accent }}>“</div>
    {[0.9, 0.75, 0.55].map((v, i) => (
      <div key={i} style={{ marginTop: i ? 14 : 8, height: 12, borderRadius: 6, background: "#c9c5bf", width: `${v * Math.min(1, Math.max(0, lines * 3 - i)) * 100}%` }} />
    ))}
    <div style={{ position: "absolute", left: 34, bottom: 26 }}><Stars n={stars} size={38} gap={8} /></div>
    <div style={{ position: "absolute", left: -40, top: -60, transform: `scale(${ask})`, width: 84, height: 84, borderRadius: 22, background: C.bg, border: `3px solid ${WHITE}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 52, color: WHITE }}>?</div>
  </div>
);

const ProofBox: React.FC<{ n: number; o: number; x?: number; scale?: number }> = ({ n, o, x = 740, scale = 1 }) => {
  const h = 70 + Math.max(0, n) * 46;
  const k = Math.round(n);
  return (
    <div style={{ position: "absolute", left: x, top: FLOOR - h * scale, width: 230 * scale, height: h * scale, opacity: o, transformOrigin: "50% 100%" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: `${18 * scale}px ${18 * scale}px 4px 4px`, background: WHITE, display: "flex", flexDirection: "column-reverse", alignItems: "center", padding: `${16 * scale}px 0`, gap: 10 * scale }}>
        {Array.from({ length: Math.max(0, k) }).map((_, i) => (
          <svg key={i} width={30 * scale} height={30 * scale} viewBox="0 0 24 24"><path d="M12 2.6l2.9 6 6.5.8-4.8 4.5 1.2 6.5L12 17.3l-5.8 3.1 1.2-6.5L2.6 9.4l6.5-.8z" fill={C.accent} /></svg>
        ))}
      </div>
      <div style={{ position: "absolute", top: h * scale + 22, left: -40, right: -40, textAlign: "center", fontFamily: fonts.display, fontWeight: 700, fontSize: 36 * Math.max(1, scale * 0.9), color: WHITE }}>
        {k} yorum
      </div>
    </div>
  );
};

/* ---------- captions: one phrase at a time ---------- */
const CHUNKS: number[][] = (() => {
  const out: number[][] = [];
  let cur: number[] = [];
  W12.forEach(([word, , b], i) => {
    cur.push(i);
    const gap = i + 1 < W12.length ? W12[i + 1][1] - b : 9;
    if (/[.,?”]$/.test(word) || cur.length >= 4 || gap > 0.28) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const KEY = new Set(["yorumun", "çözüm.", "yarısını", "dürüst", "kanıtın.", "fazla", "iste.", "fazlasını", "yükseltir", "büyütür.", "aynısını", "Ucuz", "kanıt", "tırman.", "kimse", "kanıtı", "hatırla.", "takip"]);
const Caption: React.FC = () => {
  const t = useT();
  const ci = CHUNKS.findIndex((ch, n) => t >= w(ch[0]) - 0.08 && (n + 1 >= CHUNKS.length || t < w(CHUNKS[n + 1][0]) - 0.08));
  if (ci < 0) return null;
  const ch = CHUNKS[ci];
  const o = pr(t, w(ch[0]) - 0.08, 0.15) * (1 - pr(t, we(ch[ch.length - 1]) + 0.9, 0.2));
  return (
    <div style={{ position: "absolute", top: 330, left: 70, right: 70, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 20px", opacity: o, transform: `translateY(${(1 - o) * 12}px)` }}>
      {ch.map((i) => {
        const word = W12[i][0];
        const on = t >= w(i) - 0.04;
        const key = KEY.has(word);
        return (
          <span key={i} style={key
            ? { fontFamily: fonts.serif, fontSize: 92, lineHeight: 1.1, color: on ? C.accent : "rgba(226,98,5,0.3)" }
            : { fontFamily: fonts.display, fontWeight: 700, fontSize: 70, lineHeight: 1.3, color: on ? WHITE : "rgba(242,240,236,0.28)" }}>
            {word.replace(/[,]$/, "")}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- scenes ---------- */
const Floor: React.FC<{ o: number }> = ({ o }) => <div style={{ position: "absolute", left: 80, right: 80, top: FLOOR, height: 4, borderRadius: 2, background: "rgba(242,240,236,0.5)", opacity: o }} />;

const Clients: React.FC = () => {
  const t = useT();
  // which person is visible
  const p1 = pio(t, P.c1, 0.4) * (1 - pio(t, P.c2 - 0.1, 0.3));
  const p2 = pio(t, P.c2 + 0.1, 0.4) * (1 - pio(t, P.c3 - 0.1, 0.3));
  const p3 = pio(t, P.c3 + 0.1, 0.4) * (1 - pio(t, P.stairs - 0.1, 0.3));
  // price
  const price = t < P.c2
    ? interpolate(t, [w(10), we(10) + 0.2], [20000, 10000], { ...clamp, easing: Easing.inOut(Easing.cubic) })
    : t < P.c3
      ? interpolate(t, [w(24), we(26)], [10000, 13000], clamp)
      : interpolate(t, [w(34), we(36)], [13000, 16500], clamp);
  const tagO = pr(t, w(8), 0.35) * (1 - pio(t, P.stairs - 0.1, 0.3));
  const badge = pop(t, w(10) + 0.1) * (1 - pio(t, P.c2 - 0.2, 0.3));
  const tagDip = (x: number) => interpolate(t, [x - 0.15, x, x + 0.25], [0, -14, 0], clamp);
  const bump = tagDip(w(26)) + tagDip(w(36));
  // testimonial card 1
  const card1 = pop(t, w(12), 0.4);
  const fly1 = pio(t, w(19), 0.55);
  const lines1 = interpolate(t, [w(14), we(17)], [0, 1], clamp);
  const stars1 = interpolate(t, [w(15), we(17) + 0.2], [0, 5], clamp);
  // card 2 (ask)
  const card2 = pop(t, w(28) - 0.05, 0.4);
  const ask2 = pop(t, w(28), 0.3) * (1 - pr(t, we(30), 0.2));
  const fly2 = pio(t, we(30) + 0.15, 0.5);
  const lines2 = interpolate(t, [w(29), we(30)], [0, 1], clamp);
  const stars2 = interpolate(t, [w(29) + 0.1, we(30) + 0.1], [0, 5], clamp);
  // card 3 (quick)
  const card3 = pop(t, we(36) - 0.1, 0.35);
  const fly3 = pio(t, we(37) + 0.05, 0.45);
  const n = (fly1 > 0.95 ? 1 : 0) + (fly2 > 0.95 ? 1 : 0) + (fly3 > 0.95 ? 1 : 0);
  const boxO = pr(t, w(18) - 0.2, 0.4);
  const flyStyle = (k: number, f: number): React.CSSProperties => ({
    position: "absolute", left: 470 + f * (740 + 115 - 470 - 190), top: 870 + f * (FLOOR - 120 - 870 - 125),
    opacity: k * (1 - interpolate(f, [0.8, 1], [0, 1], clamp)), transform: `scale(${(0.6 + k * 0.4) * (1 - f * 0.75)})`, transformOrigin: "50% 50%",
  });
  return (
    <AbsoluteFill>
      <Person look="plain" x={90} o={p1} />
      <Person look="beard" x={90} o={p2} />
      <Person look="long" x={90} o={p3} />
      <Tag price={price} o={tagO} x={600} y={740 + bump} badge={badge} />
      {t < P.c2 + 0.2 && <div style={flyStyle(card1, fly1)}><Testimonial lines={lines1} stars={stars1} /></div>}
      {t > P.c2 && t < P.c3 + 0.2 && <div style={flyStyle(card2, fly2)}><Testimonial lines={lines2} stars={stars2} ask={ask2} /></div>}
      {t > P.c3 && <div style={flyStyle(card3, fly3)}><Testimonial lines={1} stars={5} /></div>}
      <ProofBox n={n} o={boxO} />
    </AbsoluteFill>
  );
};

const Stairs: React.FC = () => {
  const t = useT();
  const draw = interpolate(t, [P.stairs + 0.1, we(41)], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const price = interpolate(draw, [0, 1], [16500, 30000]);
  const n = interpolate(t, [w(43), we(44)], [3, 5], clamp);
  const steps = 5, sx = 120, sy = FLOOR, sw = 110, sh = 120;
  let d = `M${sx} ${sy}`;
  for (let i = 0; i < steps; i++) d += ` L${sx + i * sw} ${sy - (i + 1) * sh} L${sx + (i + 1) * sw} ${sy - (i + 1) * sh}`;
  const len = steps * (sw + sh);
  const tip = { x: sx + steps * sw, y: sy - steps * sh };
  const o = pr(t, P.stairs, 0.3);
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <path d={d} stroke={WHITE} strokeWidth="10" fill="none" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - draw)} />
        <g style={{ opacity: draw > 0.95 ? 1 : 0 }} transform={`translate(${tip.x} ${tip.y - 20})`}>
          <path d="M0 0 L0 -70 M-24 -46 L0 -70 L24 -46" stroke={C.accent} strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
      <div style={{ position: "absolute", left: tip.x - 170 + 0 * draw, top: tip.y - 230, fontFamily: fonts.display, fontWeight: 800, fontSize: 60, color: WHITE, opacity: pr(t, P.stairs + 0.2) }}>{tl(price)}</div>
      <ProofBox n={n} o={1} x={780} scale={0.95} />
    </AbsoluteFill>
  );
};

const Course: React.FC = () => {
  const t = useT();
  const doc = pop(t, w(47), 0.45);
  const eq = pop(t, w(52), 0.35);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 120, top: FLOOR - 470, width: 340, height: 470, borderRadius: 24, background: WHITE, opacity: doc, transform: `translateY(${(1 - doc) * 60}px)`, padding: "40px 36px" }}>
        <div style={{ width: 120, height: 120, borderRadius: 60, border: `8px solid #111`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 72, color: "#111" }}>₺</div>
        {[0.95, 0.8, 0.9, 0.6].map((v, i) => <div key={i} style={{ marginTop: i ? 18 : 40, height: 14, borderRadius: 7, background: "#c9c5bf", width: `${v * 100}%` }} />)}
        <div style={{ position: "absolute", left: 0, right: 0, top: 500, textAlign: "center", fontFamily: fonts.sans, fontWeight: 600, fontSize: 32, color: C.muted }}>Fiyatlandırma kursu</div>
      </div>
      <div style={{ position: "absolute", left: 505, top: FLOOR - 290, fontFamily: fonts.display, fontWeight: 800, fontSize: 130, color: C.accent, transform: `scale(${eq})` }}>=</div>
      <ProofBox n={5} o={1} x={720} />
    </AbsoluteFill>
  );
};

const Bars: React.FC = () => {
  const t = useT();
  const H = [170, 330, 520];
  const at = [w(54), w(56), w(58)];
  const seen = pio(t, w(59), 0.6);              // first discount disappears
  const crowd = pop(t, w(63), 0.45);
  const big = pop(t, w(64), 0.45);
  const prices = [10000, 16500, 30000];
  return (
    <AbsoluteFill>
      {H.map((h, i) => {
        const g = interpolate(t, [at[i] - 0.1, at[i] + 0.4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const hide = i === 0 ? seen : 0;
        const x = 140 + i * 280;
        return (
          <div key={i} style={{ opacity: 1 - hide }}>
            <div style={{ position: "absolute", left: x, top: FLOOR - h * g, width: 240, height: h * g, borderRadius: "16px 16px 4px 4px", background: i === 2 ? C.accent : WHITE }} />
            <div style={{ position: "absolute", left: x + 10, top: FLOOR - h * g - 92, opacity: g, transform: `scale(0.62)`, transformOrigin: "0 100%" }}>
              <Tag price={prices[i]} o={1} x={0} y={0} badge={i === 0 ? 1 : 0} />
            </div>
            {i === 1 && <div style={{ position: "absolute", left: x + 60, top: FLOOR - h * g + 40, opacity: g }}><Stars n={3 * g} size={34} gap={4} fill="#111" /></div>}
          </div>
        );
      })}
      {/* people looking at the proof */}
      <div style={{ position: "absolute", left: 30, top: FLOOR - 330, opacity: crowd, transformOrigin: "0 100%", transform: `translateY(${(1 - crowd) * 60}px) scale(0.75)` }}>
        <svg width={460} height={330} viewBox="0 0 460 330">
          {[[110, "#3a3734"], [300, WHITE]].map(([cx, hair], k) => (
            <g key={k}>
              <path d={`M${(cx as number) - 120} 330 Q${(cx as number) - 120} 214 ${(cx as number) - 30} 204 L${(cx as number) + 30} 204 Q${(cx as number) + 120} 214 ${(cx as number) + 120} 330 Z`} fill={k ? WHITE : "#d8d4ce"} />
              <ellipse cx={cx as number} cy={128} rx={62} ry={74} fill={k ? WHITE : "#d8d4ce"} />
              <path d={`M${(cx as number) - 64} 130 Q${(cx as number) - 62} 52 ${cx} 50 Q${(cx as number) + 62} 52 ${(cx as number) + 64} 130 Z`} fill={k ? "#3a3734" : (hair as string)} />
            </g>
          ))}
        </svg>
      </div>
      <div style={{ position: "absolute", left: 640, top: FLOOR - 520 - 280, transform: `scale(${big})`, transformOrigin: "50% 100%" }}>
        <div style={{ width: 300, padding: "26px 26px", borderRadius: 24, background: WHITE, boxShadow: "0 30px 80px -20px rgba(0,0,0,0.9)" }}>
          <Stars n={5} size={44} gap={6} />
          {[0.9, 0.7].map((v, i) => <div key={i} style={{ marginTop: 16, height: 12, borderRadius: 6, background: "#c9c5bf", width: `${v * 100}%` }} />)}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Ending: React.FC = () => {
  const t = useT();
  const a = pr(t, P.end + 0.1, 0.4);
  const fill = interpolate(t, [w(74), we(75)], [0, 5], clamp);
  const n = fill > 0.5 ? Math.round(fill) : 0;
  const brand = pr(t, w(76), 0.45);
  const press = interpolate(t, [w(79), w(79) + 0.08, w(79) + 0.2], [1, 0.92, 1], clamp);
  const done = t >= w(79) + 0.08;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 30, paddingTop: 120 }}>
      <div style={{ opacity: a, transform: `scale(${0.9 + a * 0.1})` }}><Stars n={fill} size={130} gap={18} /></div>
      <div style={{ opacity: a, fontFamily: fonts.display, fontWeight: 700, fontSize: 46, color: n ? C.accent : C.muted }}>{n} yorum</div>
      <div style={{ marginTop: 90, opacity: brand, transform: `translateY(${(1 - brand) * 30}px)`, display: "flex", flexDirection: "column", alignItems: "center", gap: 30 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: fonts.display, fontWeight: 700, fontSize: 60, color: WHITE }}>
          <div style={{ width: 84, height: 84, borderRadius: 22, background: "#0c0c0c", border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><FMark size={74} /></div>
          FNGN <span style={{ color: C.muted, fontWeight: 500 }}>Dijital</span>
        </div>
        <div style={{ transform: `scale(${press})`, padding: "24px 46px", borderRadius: 999, background: done ? "rgba(255,255,255,0.06)" : WHITE, border: `2px solid ${done ? C.accent : WHITE}`, color: done ? C.accent : "#0b0b0b", fontFamily: fonts.sans, fontWeight: 600, fontSize: 36 }}>
          {done ? "Takip ediliyor ✓" : `${HANDLE} · Takip et`}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Hook: React.FC = () => {
  const t = useT();
  const a = pr(t, 0.05, 0.5);
  const out = pio(t, w(5), 0.5);
  const tagIn = pop(t, w(6), 0.4);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 900, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 26, opacity: a * (1 - out), transform: `scale(${1 - out * 0.2})` }}>
        <Stars n={0} size={140} gap={18} />
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 46, color: C.muted }}>0 yorum</div>
      </div>
      <div style={{ position: "absolute", left: 360, top: 960, transform: `scale(${tagIn})`, opacity: tagIn * (1 - pio(t, P.c1, 0.35)) }}>
        <Tag price={20000} o={1} x={0} y={0} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const SoundDesign: React.FC = () => {
  const vol = (f: number) => {
    const t = f / 30;
    return interpolate(t, [0, 0.3, VO_AT + 0.1, we(80), we(80) + 0.4, END - 0.6, END], [0, 0.35, 0.2, 0.2, 0.45, 0.45, 0], clamp);
  };
  const pops = [w(6), w(8), w(10) + 0.1, w(12), we(17), w(19) + 0.5, w(28), we(30) + 0.6, we(37) + 0.5, w(43), w(47), w(52), w(54), w(56), w(58), w(64), we(75), w(79)];
  return (
    <>
      <Audio src={staticFile("music12.mp3")} volume={vol} />
      <Sequence from={s(VO_AT)}><Audio src={staticFile("vo12.mp3")} /></Sequence>
      {pops.map((x, i) => <Sequence key={i} from={s(x - 0.03)}><Audio src={staticFile("sfx/pop.wav")} volume={0.32} /></Sequence>)}
      {[P.c1, P.c2, P.c3, P.stairs, P.course, P.bars, P.end].map((x, i) => <Sequence key={`w${i}`} from={s(x - 0.05)}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.22} /></Sequence>)}
      {[w(10), w(24), w(34), P.stairs + 0.2].map((x, i) => <Sequence key={`k${i}`} from={s(x)}><Audio src={staticFile("sfx/tick.wav")} volume={0.3} /></Sequence>)}
    </>
  );
};

const Window: React.FC<{ from: number; to: number; children: React.ReactNode; fadeIn?: number; fadeOut?: number }> = ({ from, to, children, fadeIn = 0.2, fadeOut = 0.25 }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const o = interpolate(t, [from, from + fadeIn, to - fadeOut, to], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Reel12Kanit: React.FC = () => {
  const t = useT();
  const floorO = t >= P.c1 - 0.2 && t < P.end ? pr(t, P.c1 - 0.2, 0.4) * (1 - pio(t, P.end - 0.3, 0.3)) : 0;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 55%, #161616, #050505 75%)` }}>
      <div style={{ position: "absolute", top: 130, left: 80, right: 80, display: "flex", justifyContent: "space-between", fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, letterSpacing: "0.22em", color: C.muted }}>
        <span>İLK YORUMLAR</span>
        <span style={{ display: "flex", alignItems: "center", gap: 10 }}><FMark size={34} /> FNGN DİJİTAL</span>
      </div>
      <Floor o={floorO} />
      <Window from={0} to={P.c1 + 0.3} fadeIn={0.01}><Hook /></Window>
      <Window from={P.c1} to={P.stairs + 0.1} fadeIn={0.1}><Clients /></Window>
      <Window from={P.stairs} to={P.course + 0.1}><Stairs /></Window>
      <Window from={P.course} to={P.bars + 0.1}><Course /></Window>
      <Window from={P.bars} to={P.end + 0.1}><Bars /></Window>
      <Window from={P.end} to={END} fadeOut={0.01}><Ending /></Window>
      <Caption />
      <SoundDesign />
    </AbsoluteFill>
  );
};
