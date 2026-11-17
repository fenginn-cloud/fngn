// Reel 16 — "Siten yayında. Harika. Peki sen çevrimiçi değilken ne oluyor?" (website = front door, the system behind it)
// Editorial collage look (light paper, blurred grey shapes, B&W cutouts). The cutouts in public/ref/sil16_*.png are
// original generations; browser, question cards, chart, gears and flow chips are drawn here.
import React from "react";
import { AbsoluteFill, Audio, Img, Sequence, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import { HANDLE, LOGO_ORANGE, Logo, SITE, fonts, s } from "../brand";
import { W16 } from "./words16";

const VO_AT = 0.4;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.3) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const pop = (t: number, a: number, d = 0.35) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.back(1.8)) });
const pio = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const useT = () => useCurrentFrame() / 30;
const w = (i: number) => W16[i][1] + VO_AT;
const we = (i: number) => W16[i][2] + VO_AT;
const END = we(52) + 2.6;
export const REEL16_FRAMES = s(END);

const PAPER = "#F3F1ED", INK = "#151515", OR = LOGO_ORANGE, GREY = "#8f8c88";
const S = { harika: w(2) - 0.1, peki: w(3) - 0.15, q: w(9) - 0.15, conv: w(24) - 0.15, biz: w(31) - 0.15, site: w(35) - 0.15, sys: w(41) - 0.15, door: w(45) - 0.15, hand: w(49) - 0.15 };

/* ---------- background: paper + soft blurred shapes drifting in the corners ---------- */
const Star4: React.FC<{ x: number; y: number; r: number; rot: number }> = ({ x, y, r, rot }) => (
  <path transform={`translate(${x} ${y}) rotate(${rot}) scale(${r / 100})`} d="M0 -100 C12 -20 20 -12 100 0 C20 12 12 20 0 100 C-12 20 -20 12 -100 0 C-20 -12 -12 -20 0 -100 Z" fill={GREY} />
);
const Flower: React.FC<{ x: number; y: number; r: number; rot: number }> = ({ x, y, r, rot }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${r / 100})`}>
    {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={0} cy={-55} rx={30} ry={55} fill={GREY} transform={`rotate(${i * 60})`} />)}
  </g>
);
const Bg: React.FC<{ grid?: boolean }> = ({ grid }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: PAPER, overflow: "hidden" }}>
      {grid && (
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.5 }}>
          {Array.from({ length: 12 }).map((_, i) => <line key={`v${i}`} x1={i * 96} x2={i * 96} y1={0} y2={1920} stroke="#e1ddd7" strokeWidth={2} />)}
          {Array.from({ length: 21 }).map((_, i) => <line key={`h${i}`} x1={0} x2={1080} y1={i * 96} y2={i * 96} stroke="#e1ddd7" strokeWidth={2} />)}
        </svg>
      )}
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, filter: "blur(14px)", opacity: 0.55 }}>
        <Star4 x={-20 + Math.sin(t * 0.7) * 20} y={180} r={210} rot={t * 8} />
        <Flower x={1100} y={120 + Math.cos(t * 0.6) * 20} r={170} rot={-t * 6} />
        <Star4 x={1090} y={1820} r={190} rot={-t * 7} />
        <Flower x={-30} y={1780 + Math.sin(t * 0.8) * 20} r={150} rot={t * 5} />
      </svg>
    </AbsoluteFill>
  );
};

/* editorial headline: small serif line + big bold line */
const Head: React.FC<{ serif: [string, number][]; bold?: [string, number]; top?: number; boldSize?: number }> = ({ serif, bold, top = 260, boldSize = 104 }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center" }}>
      <div style={{ fontFamily: fonts.serif, fontSize: 74, color: INK, lineHeight: 1.1 }}>
        {serif.map(([x, a], i) => <span key={i} style={{ opacity: 0.12 + pr(t, a - 0.05, 0.2) * 0.88, filter: `blur(${(1 - pr(t, a - 0.05, 0.2)) * 4}px)` }}>{x}{i < serif.length - 1 ? " " : ""}</span>)}
      </div>
      {bold && (
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: boldSize, color: INK, letterSpacing: "-0.01em", lineHeight: 1, marginTop: 8, opacity: pr(t, bold[1] - 0.05, 0.15), transform: `scale(${0.9 + pop(t, bold[1] - 0.05, 0.3) * 0.1})`, filter: `blur(${(1 - pr(t, bold[1] - 0.05, 0.18)) * 8}px)` }}>{bold[0]}</div>
      )}
    </div>
  );
};

const Cut: React.FC<{ src: string; x: number; y: number; h: number; o?: number; dx?: number }> = ({ src, x, y, h, o = 1, dx = 0 }) => (
  <Img src={staticFile(src)} style={{ position: "absolute", left: x + dx, top: y, height: h, mixBlendMode: "multiply", opacity: o, filter: "grayscale(1) contrast(1.1)" }} />
);

/* simple browser window showing a website */
const Browser: React.FC<{ w?: number; style?: React.CSSProperties }> = ({ w: W = 520, style }) => (
  <div style={{ width: W, borderRadius: 18, background: "#fff", boxShadow: "0 30px 70px -20px rgba(0,0,0,0.35)", overflow: "hidden", border: "1.5px solid #ddd", ...style }}>
    <div style={{ height: W * 0.07, background: "#ece9e4", display: "flex", alignItems: "center", gap: W * 0.012, padding: `0 ${W * 0.03}px` }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => <span key={c} style={{ width: W * 0.02, height: W * 0.02, borderRadius: 99, background: c }} />)}
      <span style={{ marginLeft: W * 0.03, flex: 1, height: W * 0.035, borderRadius: 99, background: "#fff", fontFamily: fonts.sans, fontSize: W * 0.024, color: GREY, display: "flex", alignItems: "center", paddingLeft: W * 0.02 }}>www.markan.com</span>
    </div>
    <div style={{ padding: W * 0.05 }}>
      <div style={{ height: W * 0.28, borderRadius: W * 0.02, background: "linear-gradient(135deg,#1b1b1b,#3a3a3a)", position: "relative" }}>
        <div style={{ position: "absolute", left: W * 0.05, top: W * 0.06, width: W * 0.35, height: W * 0.035, borderRadius: 6, background: "#fff" }} />
        <div style={{ position: "absolute", left: W * 0.05, top: W * 0.12, width: W * 0.25, height: W * 0.025, borderRadius: 6, background: "#8a8a8a" }} />
        <div style={{ position: "absolute", left: W * 0.05, top: W * 0.19, width: W * 0.14, height: W * 0.045, borderRadius: 99, background: OR }} />
      </div>
      <div style={{ display: "flex", gap: W * 0.03, marginTop: W * 0.04 }}>
        {[0, 1, 2].map((i) => <div key={i} style={{ flex: 1, height: W * 0.14, borderRadius: W * 0.02, background: "#efede9" }} />)}
      </div>
    </div>
  </div>
);

/* ---------- scenes ---------- */
const S1: React.FC = () => {
  const t = useT();
  const br = pop(t, w(0), 0.45);
  const cool = t >= S.harika;
  const click = pr(t, S.harika + 0.25, 0.15) * (1 - pr(t, S.harika + 0.45, 0.2));
  return (
    <AbsoluteFill>
      <Bg />
      {!cool ? <Head serif={[["Siten", w(0)]]} bold={["YAYINDA", w(1)]} /> : (
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", fontFamily: fonts.serif, fontSize: 150, color: INK, letterSpacing: "0.04em", opacity: pr(t, S.harika, 0.2), transform: `scale(${0.85 + pop(t, S.harika, 0.4) * 0.15})` }}>Harika.</div>
      )}
      <div style={{ position: "absolute", left: 540, top: cool ? 620 : 640, transform: `translate(-50%,0) scale(${br}) rotate(${cool ? -3 : 0}deg)` }}><Browser w={620} /></div>
      {cool && (
        <div style={{ position: "absolute", left: 640, top: 1020, transform: `scale(${pop(t, S.harika, 0.3)})` }}>
          <div style={{ padding: "16px 34px", borderRadius: 18, border: `4px solid ${INK}`, background: "#fff", fontFamily: fonts.display, fontWeight: 800, fontSize: 46, color: INK, transform: `scale(${1 - click * 0.08})` }}>www.</div>
          <svg width={70} height={70} viewBox="0 0 24 24" style={{ position: "absolute", left: 150, top: 50 }}><path d="M4 2 L4 20 L9 15 L12 22 L15 21 L12 14 L19 14 Z" fill={INK} stroke="#fff" strokeWidth={1.2} /></svg>
        </div>
      )}
      <Cut src="ref/sil16_hat.png" x={30} y={1260} h={560} dx={(1 - pr(t, 0.1, 0.5)) * -300} />
    </AbsoluteFill>
  );
};

const S2: React.FC = () => {
  const t = useT();
  const off = pr(t, w(6), 0.3);
  return (
    <AbsoluteFill>
      <Bg grid />
      <Head serif={[["Peki", w(3)], ["sen", w(4)], ["çevrimiçi", w(5)], ["değilken", w(6)]]} bold={["NE OLUYOR?", w(7)]} />
      <div style={{ position: "absolute", left: 540, top: 600, transform: "translateX(-50%)", display: "flex", alignItems: "center", gap: 14, padding: "14px 30px", borderRadius: 99, background: "#fff", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, color: INK, opacity: pr(t, S.peki + 0.1) }}>
        <span style={{ width: 20, height: 20, borderRadius: 10, background: off > 0.5 ? "#b9b6b1" : "#28c840" }} />{off > 0.5 ? "Çevrimdışı" : "Çevrimiçi"}
      </div>
      <Cut src="ref/sil16_wave.png" x={150} y={760 + (1 - pr(t, S.peki, 0.5)) * 200} h={1160} />
    </AbsoluteFill>
  );
};

const QS: [string, number][] = [["Yeni gelen müşteriyle kim ilgileniyor?", w(9)], ["Teklifi kim gönderiyor?", w(14)], ["Müşteriye kim hatırlatıyor?", w(17)], ["Onu kim geri getiriyor?", w(20)]];
const S3: React.FC = () => {
  const t = useT();
  const z = interpolate(t, [S.q, S.conv], [1, 1.08], clamp);
  return (
    <AbsoluteFill>
      <Bg grid />
      <div style={{ position: "absolute", inset: 0, transform: `scale(${z})` }}>
        {QS.map(([q, a], i) => {
          const k = pop(t, a - 0.05, 0.35);
          const active = i === QS.filter(([, b]) => t >= b - 0.05).length - 1;
          return (
            <div key={i} style={{ position: "absolute", left: 90, right: 90, top: 520 + i * 220, opacity: k, transform: `translateY(${(1 - k) * 40}px) scale(${active ? 1.03 : 0.97})`, display: "flex", alignItems: "center", gap: 24, padding: "34px 40px", borderRadius: 999, background: "#fff", boxShadow: active ? "0 24px 60px -20px rgba(0,0,0,0.35)" : "0 10px 30px -15px rgba(0,0,0,0.2)", border: `2px solid ${active ? OR : "#e6e2dc"}` }}>
              <span style={{ width: 22, height: 22, borderRadius: 11, background: active ? OR : "#cfcbc5", flexShrink: 0 }} />
              <span style={{ fontFamily: fonts.serif, fontSize: 52, color: INK, lineHeight: 1.1 }}>{q}</span>
              <span style={{ marginLeft: "auto", fontFamily: fonts.sans, fontSize: 24, color: GREY, flexShrink: 0 }}>{["şimdi", "2 dk", "1 sa", "3 gün"][i]}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

const S4: React.FC = () => {
  const t = useT();
  const bars = [0.25, 0.4, 0.55, 0.75, 1.0];
  const grow = interpolate(t, [S.conv + 0.1, w(28)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const swap = pio(t, w(28) - 0.1, 0.35);
  const arrowLen = 900;
  return (
    <AbsoluteFill>
      <Bg grid />
      <Head serif={[["O", w(24)], ["ziyaretçiyi", w(25)]]} bold={[t < w(28) ? "TRAFİĞİ" : "GERÇEK BİR İŞE", t < w(28) ? w(25) : w(26)]} boldSize={t < w(28) ? 120 : 100} />
      <div style={{ opacity: 1 - swap, transform: `translateX(${-swap * 300}px)` }}>
        {bars.map((b, i) => <div key={i} style={{ position: "absolute", left: 170 + i * 150, top: 1500 - 600 * b * grow, width: 110, height: 600 * b * grow, background: INK, borderRadius: "10px 10px 0 0" }} />)}
        <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
          <path d="M140 1400 C 380 1380, 520 1180, 900 900" stroke={OR} strokeWidth={16} fill="none" strokeLinecap="round" strokeDasharray={arrowLen} strokeDashoffset={arrowLen * (1 - grow)} />
          {grow > 0.95 && <path d="M860 880 L915 890 L900 945" stroke={OR} strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
        </svg>
      </div>
      <Cut src="ref/sil16_pair.png" x={190} y={720} h={1100} o={swap} dx={(1 - swap) * 300} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", fontFamily: fonts.serif, fontSize: 60, color: INK, opacity: pr(t, w(29), 0.2) }}>kim <span style={{ color: OR }}>dönüştürüyor?</span></div>
    </AbsoluteFill>
  );
};

/* gears + bulb */
const Gear: React.FC<{ x: number; y: number; r: number; rot: number; fill?: string }> = ({ x, y, r, rot, fill = INK }) => {
  const teeth = 10;
  let d = "";
  for (let i = 0; i < teeth * 2; i++) {
    const a = (i / (teeth * 2)) * Math.PI * 2;
    const rr = i % 2 ? r : r * 1.2;
    const a2 = a + Math.PI / (teeth * 2);
    d += `${i ? "L" : "M"}${Math.cos(a) * rr} ${Math.sin(a) * rr} L${Math.cos(a2) * rr} ${Math.sin(a2) * rr} `;
  }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={d + "Z"} fill={fill} />
      <circle r={r * 0.45} fill={PAPER} />
    </g>
  );
};
const Gears: React.FC<{ t: number; x: number; y: number; k: number; bulb?: boolean }> = ({ t, x, y, k, bulb }) => (
  <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      {bulb && <path d="M-170 40 C-240 -60 -200 -260 0 -270 C200 -260 240 -60 170 40 C120 100 110 150 110 200 L-110 200 C-110 150 -120 100 -170 40 Z" fill="none" stroke={INK} strokeWidth={10} />}
      {bulb && <rect x={-90} y={215} width={180} height={70} rx={14} fill={INK} />}
      <Gear x={-50} y={-90} r={70} rot={t * 60} />
      <Gear x={70} y={-10} r={50} rot={-t * 84} fill={OR} />
      <Gear x={-30} y={80} r={44} rot={t * 95} />
    </g>
  </svg>
);

const S5: React.FC = () => {
  const t = useT();
  const k = pop(t, S.biz + 0.1, 0.4);
  const glitch = t > S.site - 0.15;
  return (
    <AbsoluteFill style={{ filter: glitch ? `contrast(2) invert(${random(`gi${Math.floor(t * 30)}`) > 0.5 ? 1 : 0})` : "none" }}>
      <Bg grid />
      <div style={{ position: "absolute", left: 540, top: 470, transform: "translateX(-50%)", padding: "24px 50px", border: `3px solid ${INK}`, textAlign: "center", opacity: pr(t, w(31), 0.2) }}>
        <div style={{ fontFamily: fonts.serif, fontSize: 58, color: INK }}>İşte biz bunu</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 92, color: INK, opacity: pr(t, w(34) - 0.05, 0.15) }}>KURUYORUZ.</div>
        {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => <span key={i} style={{ position: "absolute", left: sx < 0 ? -8 : undefined, right: sx > 0 ? -8 : undefined, top: sy < 0 ? -8 : undefined, bottom: sy > 0 ? -8 : undefined, width: 14, height: 14, background: OR }} />)}
      </div>
      <Gears t={t} x={540} y={1180} k={1.3 * k} bulb />
    </AbsoluteFill>
  );
};

const S6: React.FC = () => {
  const t = useT();
  const drift = Math.sin((t - S.site) * 1.6) * 30;
  const ring = pr(t, S.site + 0.2, 0.6);
  return (
    <AbsoluteFill>
      <Bg />
      <Head serif={[["İnternette", w(35)], ["öylece", w(36)], ["duran", w(37)]]} bold={["BİR SİTE DEĞİL", w(38)]} boldSize={96} />
      <svg width={1080} height={1920} style={{ position: "absolute", inset: 0 }}>
        <circle cx={540} cy={1100} r={380 * ring} fill="none" stroke={INK} strokeWidth={4} strokeDasharray="16 14" transform={`rotate(${t * 10} 540 1100)`} />
      </svg>
      <div style={{ position: "absolute", left: 540, top: 1100 + drift, transform: `translate(-50%,-50%) rotate(${drift * 0.15}deg) scale(${pop(t, S.site, 0.4)})`, filter: `grayscale(${pr(t, w(40), 0.3)})`, opacity: 1 - pr(t, w(40), 0.3) * 0.4 }}><Browser w={520} /></div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1540, textAlign: "center", fontFamily: fonts.serif, fontSize: 46, color: GREY, opacity: pr(t, w(39), 0.3) }}>sadece bekliyor…</div>
    </AbsoluteFill>
  );
};

const FLOW = ["Form", "CRM", "Teklif", "Hatırlatma", "Tekrar satış"];
const S7: React.FC = () => {
  const t = useT();
  const back = pio(t, S.sys, 0.5);
  return (
    <AbsoluteFill>
      <Bg grid />
      <Head serif={[["arkasında", w(41)], ["çalışan", w(42)]]} bold={["BİR SİSTEM", w(43)]} boldSize={112} />
      <Gears t={t * 1.6} x={540} y={1060} k={1.6 * back} />
      <div style={{ position: "absolute", left: 540, top: 1060, transform: `translate(-50%,-50%) scale(${1 - back * 0.35}) translateY(${back * -320}px)` }}><Browser w={520} /></div>
      {FLOW.map((f, i) => {
        const k = pop(t, S.sys + 0.35 + i * 0.22, 0.3);
        const x = 90 + (i % 3) * 300 + (i >= 3 ? 150 : 0);
        const y = 1420 + (i >= 3 ? 130 : 0);
        return (
          <div key={f} style={{ position: "absolute", left: x, top: y, transform: `scale(${k})`, padding: "16px 28px", borderRadius: 99, background: i === 4 ? OR : "#fff", color: i === 4 ? "#0b0b0b" : INK, border: `2px solid ${i === 4 ? OR : INK}`, fontFamily: fonts.sans, fontWeight: 600, fontSize: 32, whiteSpace: "nowrap" }}>
            {i + 1}. {f}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

const S8: React.FC = () => {
  const t = useT();
  const walk = interpolate(t, [S.door, S.hand], [-120, 60], clamp);
  return (
    <AbsoluteFill>
      <Bg />
      <Head serif={[["Siten", w(45)], ["sadece", w(46)]]} bold={["ÖN KAPI.", w(47)]} boldSize={130} />
      <Cut src="ref/sil16_door.png" x={200} y={700} h={1120} dx={walk} />
    </AbsoluteFill>
  );
};

const S9: React.FC = () => {
  const t = useT();
  const z = interpolate(t, [S.hand, END], [1.05, 1.18], clamp);
  const endCard = pio(t, we(52) + 0.4, 0.5);
  return (
    <AbsoluteFill>
      <Bg />
      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center", fontFamily: fonts.sans, fontWeight: 600, fontSize: 40, letterSpacing: "0.3em", color: INK, opacity: pr(t, w(49), 0.25) * (1 - endCard) }}>ASIL İŞ</div>
      <Img src={staticFile("ref/sil16_hand.png")} style={{ position: "absolute", left: -280, top: 640, width: 1640, mixBlendMode: "multiply", filter: "grayscale(1) contrast(1.1)", transform: `scale(${z})`, opacity: pr(t, S.hand, 0.3) * (1 - endCard) }} />
      <div style={{ position: "absolute", top: 1560, left: 0, right: 0, textAlign: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 84, color: INK, opacity: pr(t, w(51), 0.2) * (1 - endCard) }}>
        ARKASINDA <span style={{ color: OR }}>BAŞLIYOR</span>
      </div>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 40, opacity: endCard }}>
        <Logo width={700} color={INK} />
        <div style={{ fontFamily: fonts.serif, fontSize: 56, color: INK }}>Site + arkasında çalışan sistem.</div>
        <div style={{ fontFamily: fonts.sans, fontSize: 36, color: GREY, letterSpacing: "0.06em" }}>{HANDLE} · {SITE}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const SoundDesign: React.FC = () => {
  const vol = (f: number) => {
    const t = f / 30;
    return interpolate(t, [0, 0.3, VO_AT + 0.2, we(52), we(52) + 0.4, END - 0.7, END], [0, 0.35, 0.2, 0.2, 0.42, 0.42, 0], clamp);
  };
  const pops = [w(0), S.harika, w(9), w(14), w(17), w(20), w(28), S.biz + 0.1, ...FLOW.map((_, i) => S.sys + 0.35 + i * 0.22)];
  return (
    <>
      <Audio src={staticFile("music16.mp3")} startFrom={s(1.26)} volume={vol} />
      <Sequence from={s(VO_AT)}><Audio src={staticFile("vo16.mp3")} /></Sequence>
      {pops.map((x, i) => <Sequence key={i} from={s(x - 0.03)}><Audio src={staticFile("sfx/pop.wav")} volume={0.28} /></Sequence>)}
      {[S.peki, S.q, S.conv, S.biz, S.site, S.sys, S.door, S.hand].map((x, i) => <Sequence key={`w${i}`} from={s(x - 0.05)}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.22} /></Sequence>)}
    </>
  );
};

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const o = interpolate(t, [from, from + 0.12], [0, 1], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

export const Reel16Sistem: React.FC = () => (
  <AbsoluteFill style={{ background: PAPER }}>
    <Scene from={0} to={S.peki}><S1 /></Scene>
    <Scene from={S.peki} to={S.q}><S2 /></Scene>
    <Scene from={S.q} to={S.conv}><S3 /></Scene>
    <Scene from={S.conv} to={S.biz}><S4 /></Scene>
    <Scene from={S.biz} to={S.site}><S5 /></Scene>
    <Scene from={S.site} to={S.sys}><S6 /></Scene>
    <Scene from={S.sys} to={S.door}><S7 /></Scene>
    <Scene from={S.door} to={S.hand}><S8 /></Scene>
    <Scene from={S.hand} to={END}><S9 /></Scene>
    <div style={{ position: "absolute", right: 50, top: 120, opacity: 0.6 }}><Logo width={150} sub={false} color={INK} /></div>
    <SoundDesign />
  </AbsoluteFill>
);
