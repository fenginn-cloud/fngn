// Reel 06 — "Kolay bir hayır değil, bir seçim sunun." (satış kuralı #1)
// Minimal line-art explainer. Timings from silencedetect on public/vo06_a.mp3 (phrase level).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { Background, C, Chrome, Outro, fonts, s } from "../brand";

/* ---------- Phrase timing ---------- */
const PH: [string, number, number][] = [
  ["Müşteriler", 0.0, 0.73],
  ["“sadece bakıyorum” der…", 0.88, 2.2],
  ["çünkü ilk sorduğunuz şey yüzünden.", 2.51, 4.51],
  ["Çoğu satışçı şunu sorar:", 5.14, 6.5],
  ["“Yardımcı olabilir miyim?”", 6.9, 7.89],
  ["Bu bir izin sorusudur.", 8.33, 9.62],
  ["Müşteri de düşünmeden", 9.98, 11.1],
  ["“hayır” der.", 11.29, 11.79],
  ["Bunun yerine,", 12.34, 13.02],
  ["iki seçenek gösterin ve sorun:", 13.18, 14.79],
  ["“Hangisini seçerdiniz?”", 15.2, 16.36],
  ["Fikri sorulan insan cevap verir…", 16.8, 18.49],
  ["ve çoğu zaman nedenini de söyler.", 18.74, 20.57],
  ["Artık kapıyı değil,", 20.96, 22.03],
  ["ürünü konuşuyorsunuz.", 22.26, 23.4],
  ["Mesajlarda da “fiyat ne?”", 23.86, 25.46],
  ["sorusuna iki fiyatlı seçenekle cevap verin,", 25.65, 28.13],
  ["ve hangisinin daha uygun olduğunu sorun.", 28.43, 30.43],
  ["Satış kuralı bir numara:", 30.96, 32.4],
  ["İnsanlara kolay bir “hayır” değil…", 32.81, 34.69],
  ["bir seçim sunun.", 34.97, 35.85],
];
const T = {
  a: 0, because: 2.51,
  b: 5.0, help: 6.9,
  c: 8.25, tilt: 9.98, no: 11.29,
  d: 12.25, opts: 13.18, which: 15.2,
  e: 16.7, why: 18.74,
  f: 20.85, prod: 22.26,
  g: 23.75, reply: 25.65, ask: 28.43,
  h: 30.85, choice: 32.81, sel: 34.97,
  outro: 36.4, end: 40.2,
};
export const REEL06_FRAMES = s(T.end);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.45) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const spr = (frame: number, at: number, base: number, damping = 12, stiffness = 160) =>
  spring({ frame: frame - s(at - base), fps: 30, config: { damping, stiffness } });
const useT = (base: number) => useCurrentFrame() / 30 + base;
const LINE = "rgba(245,245,245,0.9)";
const DIM = "rgba(245,245,245,0.35)";
const GROUND = 1240;

/* ---------- Typography ---------- */
const Head: React.FC<{ small?: string; big: string; accent?: boolean; t: number; a: number; top?: number; size?: number; smallAfter?: string }> = ({ small, big, accent, t, a, top = 290, size = 104, smallAfter }) => {
  const p1 = pr(t, a);
  const p2 = pr(t, a + 0.18);
  return (
    <div style={{ position: "absolute", top, left: 80, right: 80 }}>
      {small && <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 44, color: C.muted, opacity: p1, transform: `translateY(${(1 - p1) * 16}px)` }}>{small}</div>}
      <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: size, lineHeight: 1.02, letterSpacing: "-0.045em", color: accent ? C.accent : C.fg, opacity: p2, filter: `blur(${(1 - p2) * 10}px)`, transform: `translateY(${(1 - p2) * 20}px)` }}>{big}</div>
      {smallAfter && <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 44, color: C.muted, opacity: p2 }}>{smallAfter}</div>}
    </div>
  );
};
const Quote: React.FC<{ text: string; t: number; a: number; size?: number; color?: string; style?: React.CSSProperties }> = ({ text, t, a, size = 64, color = C.fg, style }) => {
  const n = text.length;
  const shown = Math.floor(interpolate(t, [a, a + Math.min(0.9, n * 0.035)], [0, n], clamp));
  return <div style={{ fontFamily: fonts.serif, fontSize: size, color, whiteSpace: "nowrap", ...style }}>{text.slice(0, shown)}</div>;
};
const Ground: React.FC<{ y?: number; tilt?: number }> = ({ y = GROUND, tilt = 0 }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
    <g transform={`rotate(${tilt} 540 ${y})`}>
      <line x1={-100} x2={1180} y1={y} y2={y} stroke={DIM} strokeWidth={2} />
      {Array.from({ length: 70 }, (_, i) => (
        <line key={i} x1={-100 + i * 20} x2={-112 + i * 20} y1={y + 2} y2={y + 14} stroke="rgba(245,245,245,0.15)" strokeWidth={2} />
      ))}
    </g>
  </svg>
);

/* ---------- Bottom caption ---------- */
const Caption: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const i = PH.findIndex(([, a, b], k) => t >= a - 0.05 && t < (PH[k + 1]?.[1] ?? b + 0.6));
  if (i < 0 || t > T.outro) return null;
  const [txt, a, b] = PH[i];
  const o = interpolate(t, [a - 0.05, a + 0.1, b + 0.4, b + 0.6], [0, 1, 1, 0.0], clamp);
  return (
    <div style={{ position: "absolute", top: 1500, left: 90, right: 90, textAlign: "center", opacity: o * 0.9, fontFamily: fonts.sans, fontWeight: 600, fontSize: 38, color: "rgba(245,245,245,0.75)" }}>
      {txt}
    </div>
  );
};

/* ---------- A. "Sadece bakıyorum" ---------- */
const SceneA: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.a);
  const circle = spr(frame, 0.1, 0, 12, 140);
  const quoteLine = pr(t, 0.88, 0.8);
  const square = spr(frame, 1.7, 0, 12, 170);
  const labels = pr(t, T.because, 0.4);
  const dot = interpolate(t, [T.because + 0.3, T.because + 1.3], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Head small={undefined} big="Müşteriler" t={t} a={0} smallAfter="der:" />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={220} cy={760} r={110 * circle} fill="none" stroke={LINE} strokeWidth={4} />
        <line x1={350} x2={350 + 520 * quoteLine} y1={790} y2={790} stroke={DIM} strokeWidth={2} />
        <rect x={900 - 50 * square} y={730 - 50 * square} width={100 * square} height={100 * square} fill="#8E8A93" opacity={0.85} />
        {/* cause -> effect */}
        <g opacity={labels}>
          <text x={370} y={650} fontFamily={fonts.sans} fontSize={24} letterSpacing="0.3em" fill={C.muted}>SONUÇ</text>
          <text x={860} y={650} fontFamily={fonts.sans} fontSize={24} letterSpacing="0.3em" fill={C.accent}>SEBEP</text>
          <line x1={860} x2={360} y1={800} y2={800} stroke={C.accent} strokeWidth={3} strokeDasharray="8 10" />
          <path d="M372 788 L356 800 L372 812" fill="none" stroke={C.accent} strokeWidth={3} />
          <circle cx={860 - 500 * dot} cy={800} r={10} fill={C.accent} style={{ filter: "drop-shadow(0 0 10px rgba(226,98,5,0.9))" }} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 370, top: 700, opacity: 1 - labels * 0.55 }}>
        <Quote text="“sadece bakıyorum”" t={t} a={0.88} size={60} />
      </div>
      <div style={{ position: "absolute", left: 80, top: 960 }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 46, color: C.muted, opacity: pr(t, T.because) }}>çünkü ilk sorduğunuz</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: "-0.045em", color: C.fg, opacity: pr(t, 3.5), filter: `blur(${(1 - pr(t, 3.5)) * 10}px)` }}>
          şey <span style={{ color: C.accent }}>yüzünden.</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B. "Yardımcı olabilir miyim?" ---------- */
const SceneB: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.b);
  const lines = pr(t, 5.8, 0.6);
  const arrow = pr(t, T.help + 0.4, 0.4);
  const circle = spr(frame, 5.4, T.b, 12, 140);
  return (
    <AbsoluteFill>
      <Head small="Çoğu satışçı" big="şunu sorar:" t={t} a={5.14} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {Array.from({ length: 5 }, (_, i) => {
          const sp = spr(frame, 5.3 + i * 0.07, T.b, 12, 180);
          const x = 160 + i * 190;
          return (
            <g key={i}>
              <rect x={x - 45 * sp} y={620 - 45 * sp} width={90 * sp} height={90 * sp} fill="#8E8A93" />
              <line x1={x} y1={665} x2={x + (540 - x) * lines} y2={665 + 170 * lines} stroke={DIM} strokeWidth={2} />
            </g>
          );
        })}
        <line x1={540} x2={540} y1={960} y2={960 + 140 * arrow} stroke={LINE} strokeWidth={3} />
        <path d={`M526 ${1086 * 1} L540 1100 L554 1086`} fill="none" stroke={LINE} strokeWidth={3} opacity={arrow} />
        <circle cx={540} cy={1170} r={66 * circle} fill="none" stroke={LINE} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 860, display: "flex", justifyContent: "center" }}>
        <Quote text="“Yardımcı olabilir miyim?”" t={t} a={T.help} size={70} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- C. Permission -> easy "no" ---------- */
const SceneC: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.c);
  const tilt = interpolate(t, [T.tilt, T.tilt + 0.8], [0, 9], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const roll = interpolate(t, [T.tilt + 0.3, T.no + 0.4], [0, 1], { ...clamp, easing: Easing.in(Easing.quad) });
  const no = spr(frame, T.no, T.c, 9, 200);
  const branches = pr(t, 8.9, 0.5);
  const yes = interpolateColors(roll, [0, 0.2], [LINE, "rgba(245,245,245,0.2)"]);
  // ball rolls toward the "no" wall
  const bx = 300 + roll * 560;
  const by = GROUND - 66 + Math.tan((tilt * Math.PI) / 180) * (bx - 540) ;
  return (
    <AbsoluteFill>
      <Head small="Bu bir" big="izin sorusudur." accent t={t} a={8.33} />
      <Ground tilt={tilt} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        {/* decision diamond */}
        <g opacity={1 - roll}>
          <path d="M470 1110 L520 1060 L570 1110 L520 1160 Z" fill="none" stroke={LINE} strokeWidth={3} />
          <line x1={570} y1={1110} x2={570 + 330 * branches} y2={1110 - 200 * branches} stroke={yes} strokeWidth={2} />
          <line x1={570} y1={1110} x2={570 + 330 * branches} y2={1110 + 60 * branches} stroke={LINE} strokeWidth={2} />
          <text x={910} y={890} fontFamily={fonts.sans} fontSize={26} letterSpacing="0.3em" fill={yes} opacity={branches}>EVET</text>
          <text x={910} y={1200} fontFamily={fonts.sans} fontSize={26} letterSpacing="0.3em" fill={C.accent} opacity={branches}>HAYIR</text>
        </g>
        {/* the "no" wall */}
        <rect x={920} y={by - 230} width={70} height={300} fill="none" stroke={LINE} strokeWidth={3} opacity={pr(t, T.tilt, 0.4)} />
        <circle cx={bx} cy={by} r={62} fill="none" stroke={LINE} strokeWidth={4} transform={`rotate(${roll * 400} ${bx} ${by})`} />
        <line x1={bx} y1={by - 62} x2={bx} y2={by - 40} stroke={LINE} strokeWidth={4} transform={`rotate(${roll * 400} ${bx} ${by})`} />
      </svg>
      <div style={{ position: "absolute", right: 120, top: 760, fontFamily: fonts.display, fontWeight: 800, fontSize: 230, letterSpacing: "-0.06em", color: C.fg, transform: `scale(${no})`, opacity: Math.min(1, no * 2) }}>
        hayır
      </div>
      <div style={{ position: "absolute", left: 80, top: 1330, fontFamily: fonts.sans, fontWeight: 500, fontSize: 44, color: C.muted, opacity: pr(t, T.tilt) }}>
        …hem de <span style={{ color: C.fg }}>düşünmeden.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- D. Two options: "Hangisini seçerdiniz?" ---------- */
const SceneD: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.d);
  const sq = spr(frame, T.opts, T.d, 11, 170);
  const tri = spr(frame, T.opts + 0.25, T.d, 11, 170);
  const links = pr(t, T.which + 0.3, 0.6);
  const look = Math.sin(Math.max(0, t - T.which) * 4) * 18 * (t > T.which ? 1 : 0);
  const hop = Math.abs(Math.sin(Math.max(0, t - T.opts) * 5)) * 16 * (t > T.opts && t < T.which ? 1 : 0);
  return (
    <AbsoluteFill>
      <Head big="Bunun yerine," t={t} a={12.34} />
      <div style={{ position: "absolute", left: 80, top: 410, fontFamily: fonts.sans, fontWeight: 500, fontSize: 46, color: C.muted, opacity: pr(t, T.opts) }}>
        iki seçenek gösterin ve sorun:
      </div>
      <Ground />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <rect x={270 - 80 * sq} y={850 - 80 * sq} width={160 * sq} height={160 * sq} fill="none" stroke={LINE} strokeWidth={4} />
        <path d={`M810 ${850 - 90 * tri} L${810 + 95 * tri} ${850 + 75 * tri} L${810 - 95 * tri} ${850 + 75 * tri} Z`} fill="none" stroke={LINE} strokeWidth={4} />
        <path d={`M540 1100 L540 1060 M540 1060 L${540 - 270 * links} ${1060 - 120 * links} M540 1060 L${540 + 270 * links} ${1060 - 120 * links}`} stroke={C.accent} strokeWidth={3} fill="none" opacity={links} />
        <g transform={`translate(${look} ${-hop})`}>
          <circle cx={540} cy={GROUND - 72} r={70} fill="none" stroke={LINE} strokeWidth={4} />
          <circle cx={540 + look * 1.2} cy={GROUND - 82} r={7} fill={LINE} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center" }}>
        <Quote text="“Hangisini seçerdiniz?”" t={t} a={T.which} size={84} color={C.accent} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- E. Opinion -> answer + why ---------- */
const SceneE: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.e);
  const bar1 = pr(t, 17.0, 0.4);
  const segs = [17.4, 17.7, 18.0, 18.3];
  const why = spr(frame, T.why + 0.9, T.e, 10, 170);
  return (
    <AbsoluteFill>
      <Head small="Fikri sorulan insan" big="cevap verir," t={t} a={16.8} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={170} cy={760} r={62} fill="none" stroke={LINE} strokeWidth={4} />
      </svg>
      <div style={{ position: "absolute", left: 270, top: 640 }}>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 24, letterSpacing: "0.12em", color: C.muted }}>“YARDIMCI OLABİLİR MİYİM?”</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 10 }}>
          <div style={{ width: 90 * bar1, height: 34, background: "#8E8A93" }} />
          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 26, color: C.muted, opacity: bar1 }}>HAYIR</span>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 40 }}>
          {segs.map((a, i) => {
            const p = pr(t, a, 0.25);
            return <div key={i} style={{ width: (i === 0 ? 220 : 130) * p, height: 34, background: C.accent, opacity: p }} />;
          })}
        </div>
        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 24, letterSpacing: "0.12em", color: C.accent, marginTop: 10 }}>“HANGİSİNİ SEÇERDİNİZ?”</div>
      </div>
      <div style={{ position: "absolute", left: 80, top: 1000 }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 500, fontSize: 46, color: C.muted, opacity: pr(t, T.why) }}>…ve çoğu zaman söyler:</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 170, letterSpacing: "-0.05em", color: C.accent, transform: `scale(${why})`, transformOrigin: "0 50%", opacity: Math.min(1, why * 2) }}>nedenini.</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- F. Door vs product gauge ---------- */
const SceneF: React.FC = () => {
  const t = useT(T.f);
  const ang = interpolate(t, [20.9, 21.4, T.prod, T.prod + 0.7], [-60, -165, -165, -15], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const prodGlow = pr(t, T.prod + 0.4, 0.4);
  const cx = 540, cy = 860, R = 230;
  return (
    <AbsoluteFill>
      <Head small="Artık" big="ürünü konuşuyorsunuz," t={t} a={20.96} size={92} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke={LINE} strokeWidth={3} />
        {Array.from({ length: 24 }, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const l = i % 3 === 0 ? 26 : 12;
          return <line key={i} x1={cx + Math.cos(a) * (R - 6)} y1={cy + Math.sin(a) * (R - 6)} x2={cx + Math.cos(a) * (R - 6 - l)} y2={cy + Math.sin(a) * (R - 6 - l)} stroke={DIM} strokeWidth={2} />;
        })}
        <line x1={cx} y1={cy} x2={cx + Math.cos((ang * Math.PI) / 180) * (R - 40)} y2={cy + Math.sin((ang * Math.PI) / 180) * (R - 40)} stroke={C.fg} strokeWidth={6} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={12} fill={C.accent} />
        {/* door */}
        <rect x={130} y={830} width={80} height={150} fill="none" stroke={DIM} strokeWidth={3} />
        <text x={130} y={1020} fontFamily={fonts.sans} fontSize={24} letterSpacing="0.3em" fill={C.muted}>KAPI</text>
        {/* product */}
        <rect x={870} y={630} width={90} height={90} fill={`rgba(226,98,5,${prodGlow * 0.25})`} stroke={interpolateColors(prodGlow, [0, 1], [DIM, C.accent])} strokeWidth={4} style={{ filter: prodGlow ? `drop-shadow(0 0 ${16 * prodGlow}px rgba(226,98,5,0.8))` : undefined }} />
        <text x={862} y={608} fontFamily={fonts.sans} fontSize={24} letterSpacing="0.3em" fill={interpolateColors(prodGlow, [0, 1], [C.muted, C.accent])}>ÜRÜN</text>
      </svg>
      <div style={{ position: "absolute", left: 80, top: 1150, fontFamily: fonts.display, fontWeight: 700, fontSize: 84, letterSpacing: "-0.04em", opacity: pr(t, 20.96) }}>
        <span style={{ color: "rgba(245,245,245,0.35)", textDecoration: t > T.prod ? "line-through" : "none", textDecorationColor: C.accent }}>kapıyı</span> <span style={{ color: C.fg }}>değil.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- G. In DMs: "fiyat ne?" -> two priced options ---------- */
const Bubble: React.FC<{ me?: boolean; children: React.ReactNode; p: number }> = ({ me, children, p }) => (
  <div style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", opacity: p, transform: `translateY(${(1 - p) * 20}px) scale(${0.9 + p * 0.1})`, transformOrigin: me ? "100% 100%" : "0 100%" }}>
    <div
      style={{
        maxWidth: 640,
        padding: "20px 28px",
        borderRadius: me ? "28px 28px 8px 28px" : "28px 28px 28px 8px",
        background: me ? C.accent : "#1d1d1f",
        border: me ? "none" : "1.5px solid rgba(255,255,255,0.1)",
        color: me ? "#0b0b0b" : C.fg,
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: 40,
      }}
    >
      {children}
    </div>
  </div>
);
const PriceCard: React.FC<{ name: string; price: string; p: number; hot?: boolean }> = ({ name, price, p, hot }) => (
  <div style={{ flex: 1, padding: "22px 22px", borderRadius: 22, background: hot ? "rgba(226,98,5,0.12)" : "rgba(255,255,255,0.04)", border: `2.5px solid ${hot ? C.accent : "rgba(255,255,255,0.18)"}`, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
    <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, color: C.muted }}>{name}</div>
    <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: hot ? C.accent : C.fg, letterSpacing: "-0.03em" }}>{price}</div>
  </div>
);
const SceneG: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.g);
  const q = pr(t, 24.6, 0.35);
  const c1 = pr(t, 26.3, 0.4);
  const c2 = pr(t, 26.9, 0.4);
  const ask = pr(t, T.ask, 0.4);
  const typing = t > 25.0 && t < 26.3;
  const pick = spr(frame, 29.6, T.g, 10, 170);
  return (
    <AbsoluteFill>
      <Head big="Mesajlarda da" t={t} a={23.86} size={92} />
      {/* phone-ish DM panel */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 470, height: 820, borderRadius: 40, border: "2px solid rgba(255,255,255,0.12)", background: "rgba(14,14,16,0.9)", padding: "90px 34px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ position: "absolute", top: 24, left: 34, right: 34, display: "flex", alignItems: "center", gap: 14, fontFamily: fonts.sans, fontWeight: 600, fontSize: 28, color: C.fg }}>
          <div style={{ width: 44, height: 44, borderRadius: "50%", border: `2px solid ${C.muted}` }} />
          müşteri
        </div>
        <Bubble p={q}>Fiyat ne?</Bubble>
        {typing && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingRight: 20 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 14, height: 14, borderRadius: 7, background: C.accent, opacity: 0.3 + 0.7 * Math.abs(Math.sin(frame / 5 + i)) }} />)}
          </div>
        )}
        <div style={{ display: "flex", gap: 18, marginTop: 6 }}>
          <PriceCard name="Başlangıç" price="₺₺" p={c1} />
          <PriceCard name="Profesyonel" price="₺₺₺" p={c2} />
        </div>
        <Bubble me p={ask}>Hangisi size daha uygun?</Bubble>
        <div style={{ display: "flex", justifyContent: "flex-start", opacity: pick, transform: `scale(${0.8 + pick * 0.2})`, transformOrigin: "0 50%" }}>
          <div style={{ padding: "20px 28px", borderRadius: "28px 28px 28px 8px", background: "#1d1d1f", border: "1.5px solid rgba(255,255,255,0.1)", fontFamily: fonts.sans, fontWeight: 600, fontSize: 40, color: C.fg }}>
            Profesyonel, çünkü…
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- H. Sales rule #1 ---------- */
const SceneH: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.h);
  const num = spr(frame, 31.9, T.h, 10, 130);
  const up = pr(t, T.choice - 0.1, 0.5);
  const arcs = pr(t, T.sel, 0.8);
  const strike = pr(t, 34.0, 0.35);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 80, top: interpolate(up, [0, 1], [560, 260]), display: "flex", alignItems: "baseline", gap: 24, transform: `scale(${interpolate(up, [0, 1], [1, 0.62])})`, transformOrigin: "0 0" }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 92, color: C.muted, letterSpacing: "-0.03em", opacity: pr(t, 30.96) }}>SATIŞ KURALI</span>
        <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 260, color: C.fg, letterSpacing: "-0.06em", transform: `scale(${num})`, display: "inline-block", transformOrigin: "0 80%" }}>#1</span>
      </div>
      <div style={{ position: "absolute", left: 80, right: 80, top: 520, opacity: up }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 64, color: C.fg, letterSpacing: "-0.03em" }}>İnsanlara kolay bir</div>
        <div style={{ position: "relative", display: "inline-block", fontFamily: fonts.display, fontWeight: 800, fontSize: 120, color: "rgba(245,245,245,0.4)", letterSpacing: "-0.05em" }}>
          “hayır”
          <div style={{ position: "absolute", left: -10, top: "52%", height: 12, width: `calc(${strike * 100}% + ${strike * 20}px)`, background: C.accent, borderRadius: 6 }} />
        </div>
        <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 64, color: C.fg }}> değil,</span>
        <div style={{ fontFamily: fonts.serif, fontSize: 132, color: C.accent, lineHeight: 1.05, whiteSpace: "nowrap", opacity: pr(t, T.sel), transform: `translateY(${(1 - pr(t, T.sel)) * 20}px)` }}>bir seçim sunun.</div>
      </div>
      <Ground y={1400} />
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle cx={250} cy={1330} r={66} fill="none" stroke={LINE} strokeWidth={4} />
        <rect x={470} y={1270} width={130} height={130} fill="none" stroke={LINE} strokeWidth={4} />
        <path d="M800 1270 L870 1400 L730 1400 Z" fill="none" stroke={LINE} strokeWidth={4} />
        <path d="M290 1270 Q 400 1110 535 1270" fill="none" stroke={C.accent} strokeWidth={4} pathLength={1} strokeDasharray={`${arcs} 1`} />
        <path d="M300 1275 Q 560 1020 800 1270" fill="none" stroke={C.accent} strokeWidth={4} pathLength={1} strokeDasharray={`${arcs} 1`} />
      </svg>
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
  return interpolate(t, [0, 0.05, 35.9, 36.6, T.end - 1.5, T.end], [0, 0.42, 0.42, 0.75, 0.75, 0], clamp);
};
const SoundDesign: React.FC = () => (
  <>
    <Audio src={staticFile("music06.mp3")} volume={musicVolume} />
    <Audio src={staticFile("vo06_a.mp3")} volume={1} />
    {[T.b, T.c, T.d, T.e, T.f, T.g, T.h].map((a) => <Sfx key={a} at={a - 0.1} src="whoosh" vol={0.22} />)}
    <Sfx at={T.no} src="boom" vol={0.55} />
    <Sfx at={T.opts} src="pop" vol={0.28} />
    <Sfx at={T.opts + 0.25} src="pop" vol={0.28} />
    <Sfx at={T.why + 0.9} src="pop" vol={0.3} />
    <Sfx at={T.prod + 0.4} src="tick" vol={0.5} />
    <Sfx at={24.6} src="pop" vol={0.25} />
    <Sfx at={26.3} src="pop" vol={0.25} />
    <Sfx at={26.9} src="pop" vol={0.25} />
    <Sfx at={T.ask} src="pop" vol={0.25} />
    <Sfx at={31.9} src="boom" vol={0.5} />
    <Sfx at={34.0} src="whoosh" vol={0.25} />
  </>
);

/* ---------- Composition ---------- */
const Fade: React.FC<{ dur: number; children: React.ReactNode; inF?: number }> = ({ dur, children, inF = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, inF, dur - 6, dur], [0, 1, 1, 0], clamp);
  const b = interpolate(frame, [dur - 6, dur], [0, 10], clamp);
  return <AbsoluteFill style={{ opacity: o, filter: `blur(${b}px)` }}>{children}</AbsoluteFill>;
};
const scenes: { from: number; to: number; C: React.FC; inF?: number }[] = [
  { from: T.a, to: T.b, C: SceneA, inF: 1 },
  { from: T.b, to: T.c, C: SceneB },
  { from: T.c, to: T.d, C: SceneC },
  { from: T.d, to: T.e, C: SceneD },
  { from: T.e, to: T.f, C: SceneE },
  { from: T.f, to: T.g, C: SceneF },
  { from: T.g, to: T.h, C: SceneG },
  { from: T.h, to: T.outro, C: SceneH },
];
export const Reel06Secim: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#0b0b0d" }}>
    <AbsoluteFill style={{ background: "radial-gradient(1100px 1300px at 50% 35%, #141417, #08080a 75%)" }} />
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
        <Outro cta="Teklif al · fngn.com.tr" />
      </Fade>
    </Sequence>
    <Caption />
    <Chrome total={REEL06_FRAMES} />
    <SoundDesign />
  </AbsoluteFill>
);
