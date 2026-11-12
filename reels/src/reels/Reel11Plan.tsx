// Reel 11 — "İki kahve markası. Aynı bütçe." (content planning story)
// Original motion design: the cups, calendar and cards are drawn here; nothing is taken from the reference footage.
// VO (public/vo11.mp3) starts at VO_AT; word times come from words11.ts (+ VO_AT).
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, FMark, HANDLE, fonts, s } from "../brand";
import { W11 } from "./words11";

const VO_AT = 0.5;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const pio = (t: number, a: number, d = 0.6) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const useT = () => useCurrentFrame() / 30;
const w = (i: number) => W11[i][1] + VO_AT;
const we = (i: number) => W11[i][2] + VO_AT;

// scene boundaries
const S = {
  a: w(13) - 0.15,  // A markası
  a2: w(23) - 0.1,  // Yine bir latte fotoğrafı
  b: w(27) - 0.15,  // B markası
  later: w(36) - 0.15,
  diff: w(49) - 0.1,
  plan: w(52) - 0.05,
  us: w(54) - 0.15,
  follow: w(62) - 0.1,
};
const END = we(68) + 2.4;
export const REEL11_FRAMES = s(END);

const BROWN = "#7B4B3A";
const CREAM = "#EDE7DF";

/* ---------- paper cup ---------- */
const Cup: React.FC<{ color: string; h: number; dot?: boolean; steam?: number }> = ({ color, h, dot, steam = 0 }) => {
  const t = useT();
  const id = color.replace("#", "");
  return (
    <svg width={h * 0.76} height={h} viewBox="0 0 124 164" style={{ overflow: "visible", filter: "drop-shadow(0 30px 40px rgba(0,0,0,0.55))" }}>
      <defs>
        <linearGradient id={`b${id}`} x1="0" x2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.78" />
          <stop offset="0.35" stopColor={color} />
          <stop offset="0.8" stopColor={color} />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id={`l${id}`} x1="0" x2="1">
          <stop offset="0" stopColor="#cfc9c1" />
          <stop offset="0.4" stopColor="#f6f3ef" />
          <stop offset="1" stopColor="#b9b3ab" />
        </linearGradient>
      </defs>
      {steam > 0 && [0, 1].map((k) => (
        <path key={k} d={`M${52 + k * 16} ${-6 - k * 4} q -8 -14 0 -26 q 8 -12 0 -26`} stroke="rgba(255,255,255,0.35)" strokeWidth="2.4" fill="none" strokeLinecap="round"
          style={{ opacity: steam * (0.5 + 0.5 * Math.sin(t * 3 + k * 2)), transform: `translateY(${-((t * 10 + k * 6) % 8)}px)` }} />
      ))}
      <path d="M14 40 L110 40 L102 156 Q101 162 94 162 L30 162 Q23 162 22 156 Z" fill={`url(#b${id})`} />
      <path d="M16.5 72 L107.5 72 L105 112 L19 112 Z" fill="#000" opacity="0.12" />
      <path d="M22.6 150 L101.4 150 L101 157 Q100.5 162 94 162 L30 162 Q23.5 162 23 157 Z" fill={CREAM} opacity="0.9" />
      <rect x="6" y="28" width="112" height="16" rx="7" fill={`url(#l${id})`} />
      <path d="M18 28 Q22 6 40 4 L84 4 Q102 6 106 28 Z" fill={`url(#l${id})`} />
      <rect x="66" y="8" width="18" height="6" rx="3" fill="#a9a39b" />
      {dot && <circle cx="96" cy="-6" r="7" fill={C.accentHi} />}
    </svg>
  );
};

const Label: React.FC<{ text: string; o: number; color?: string }> = ({ text, o, color = C.muted }) => (
  <div style={{ opacity: o, display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: 999, background: "rgba(255,255,255,0.06)", border: `1.5px solid ${C.line}`, fontFamily: fonts.sans, fontWeight: 600, fontSize: 24, letterSpacing: "0.14em", color: C.fg }}>
    <span style={{ width: 10, height: 10, borderRadius: 5, background: color }} /> {text}
  </div>
);

/* ---------- top-left text, revealed word by word with the VO ---------- */
type Tok = [string, number, boolean?];
const Line: React.FC<{ toks: Tok[]; old?: number; size?: number }> = ({ toks, old = 0, size = 70 }) => {
  const t = useT();
  return (
    <div style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: size, lineHeight: 1.18, letterSpacing: "-0.015em", color: old > 0.5 ? "rgba(245,245,245,0.38)" : C.fg }}>
      {toks.map(([txt, i, acc], k) => {
        const o = pr(t, w(i) - 0.06, 0.22);
        return (
          <span key={k} style={{ opacity: 0.08 + o * 0.92, filter: `blur(${(1 - o) * 6}px)`, ...(acc ? { fontFamily: fonts.serif, fontWeight: 400, fontSize: size * 1.12, color: old > 0.5 ? "rgba(226,98,5,0.45)" : C.accent } : {}) }}>
            {txt}{k < toks.length - 1 ? " " : ""}
          </span>
        );
      })}
    </div>
  );
};
const TextBlock: React.FC<{ lines: Tok[][] }> = ({ lines }) => {
  const t = useT();
  return (
    <div style={{ position: "absolute", top: 250, left: 80, right: 90, display: "flex", flexDirection: "column", gap: 10 }}>
      {lines.map((l, i) => {
        if (t < w(l[0][1]) - 0.1) return null;
        const old = i < lines.length - 1 && t >= w(lines[i + 1][0][1]) ? 1 : 0;
        return <Line key={i} toks={l} old={old} />;
      })}
    </div>
  );
};

const Header: React.FC = () => (
  <div style={{ position: "absolute", top: 130, left: 80, right: 80, display: "flex", justifyContent: "space-between", fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, letterSpacing: "0.22em", color: C.muted }}>
    <span>İKİ KAHVE MARKASI</span>
    <span style={{ display: "flex", alignItems: "center", gap: 10 }}><FMark size={34} /> FNGN DİJİTAL</span>
  </div>
);

/* ---------- small cards ---------- */
const card: React.CSSProperties = { borderRadius: 30, background: "#141414", border: `1.5px solid ${C.line}`, boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)" };
const PhotoCard: React.FC<{ rot: number }> = ({ rot }) => (
  <div style={{ ...card, width: 300, height: 360, padding: 18, transform: `rotate(${rot}deg)`, position: "absolute", left: 0, top: 0 }}>
    <div style={{ height: 250, borderRadius: 18, background: `radial-gradient(circle at 50% 40%, #fbf7f1, ${CREAM})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Cup color={BROWN} h={170} />
    </div>
    <div style={{ marginTop: 14, fontFamily: fonts.sans, fontWeight: 600, fontSize: 24, color: C.fg }}>Latte fotoğrafı</div>
    <div style={{ marginTop: 8, height: 8, width: "70%", borderRadius: 4, background: "rgba(255,255,255,0.1)" }} />
  </div>
);

const LEG = [C.accent, "#F5F5F5", "#8A8A8A"];
const CAL: [number, number][] = [[2, 0], [5, 0], [1, 1], [3, 1], [6, 1], [0, 2], [2, 2], [4, 2], [5, 2], [1, 3], [3, 3], [6, 3]];
const Calendar: React.FC<{ fill: number; approved: number; scheduled: number }> = ({ fill, approved, scheduled }) => (
  <div style={{ ...card, width: 560, padding: "30px 30px 26px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.sans, fontWeight: 600, fontSize: 20, letterSpacing: "0.18em", color: C.muted }}>
      <span>GELECEK AY</span><span>ÖRNEK</span>
    </div>
    <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
      {Array.from({ length: 28 }).map((_, i) => {
        const x = i % 7, y = Math.floor(i / 7);
        const k = CAL.findIndex(([cx, cy]) => cx === x && cy === y);
        const on = k >= 0 ? Math.min(1, Math.max(0, fill * CAL.length - k)) : 0;
        return (
          <div key={i} style={{ height: 56, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {k >= 0 && <div style={{ width: 20, height: 20, borderRadius: 6, background: LEG[k % 3], opacity: on, transform: `scale(${0.4 + on * 0.6})` }} />}
          </div>
        );
      })}
    </div>
    <div style={{ marginTop: 20, display: "flex", gap: 22, fontFamily: fonts.sans, fontSize: 22, color: C.muted }}>
      {["Lansman", "Demleme rehberi", "Bar arkası"].map((x, i) => (
        <span key={x} style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 12, height: 12, borderRadius: 4, background: LEG[i] }} />{x}</span>
      ))}
    </div>
    <div style={{ marginTop: 20, display: "flex", gap: 14, height: 52 }}>
      <div style={{ opacity: approved, transform: `scale(${0.8 + approved * 0.2})`, padding: "10px 22px", borderRadius: 999, background: C.accent, color: "#0b0b0b", fontFamily: fonts.sans, fontWeight: 600, fontSize: 24 }}>Onaylandı ✓</div>
      <div style={{ opacity: scheduled, transform: `scale(${0.8 + scheduled * 0.2})`, padding: "10px 22px", borderRadius: 999, border: `2px solid ${C.fg}`, color: C.fg, fontFamily: fonts.sans, fontWeight: 600, fontSize: 24 }}>Zamanlandı ⏱</div>
    </div>
  </div>
);

/* ---------- stage ---------- */
const Stage: React.FC = () => {
  const t = useT();
  // cup A (brown) and cup B (orange) positions per scene
  const toA = pio(t, S.a - 0.1, 0.7);          // A takes centre-left, B leaves
  const toB = pio(t, S.b - 0.1, 0.7);          // A leaves, B enters
  const toLater = pio(t, S.later - 0.1, 0.8);  // both small at bottom
  const outDiff = pio(t, w(51), 0.6);          // cups leave
  const intro = pr(t, 0.1, 0.7);

  const ax = interpolate(toA, [0, 1], [330, 300]) + toB * -700 + toLater * (700 + 30);
  const ay = 1440 + toLater * 150;
  const bx = 750 + toA * 600 + toB * (-600 - 530) + toLater * (540 - 220 + 200);
  const by = 1440 + toLater * 150;
  const ah = interpolate(toLater, [0, 1], [400, 290]);
  const bh = ah;
  const cupsO = 1 - outDiff;

  // A scene props
  const bubble = pr(t, w(20) - 0.1, 0.35) * (1 - pio(t, S.b - 0.2, 0.3));
  const photo = pr(t, w(15), 0.5) * (1 - pio(t, S.b - 0.2, 0.4));
  const stack = pio(t, S.a2, 0.6);
  const again = pr(t, w(24), 0.4);
  // B scene props
  const cal = pr(t, S.b + 0.2, 0.6) * (1 - pio(t, S.later - 0.2, 0.4));
  const fill = interpolate(t, [w(30), we(32)], [0, 1], clamp);
  // later
  const qa = pr(t, w(40), 0.5) * (1 - outDiff);
  const rb = pr(t, w(45), 0.5) * (1 - outDiff);
  const bars = interpolate(t, [w(45), we(48)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

  return (
    <AbsoluteFill style={{ opacity: cupsO }}>
      {/* labels */}
      <div style={{ position: "absolute", left: ax - 120, top: ay - ah - 80, opacity: pr(t, w(13), 0.4) * (1 - toB) }}><Label text="A MARKASI" o={1} color={BROWN} /></div>
      <div style={{ position: "absolute", left: bx - 120, top: by - bh - 80, opacity: pr(t, w(27), 0.4) * (1 - toLater) }}><Label text="B MARKASI" o={1} color={C.accent} /></div>
      {/* cups (anchor: bottom-centre) */}
      <div style={{ position: "absolute", left: ax - ah * 0.38, top: ay - ah, opacity: intro, transform: `translateY(${(1 - intro) * 60}px)` }}>
        <Cup color={BROWN} h={ah} steam={1 - toA} />
      </div>
      <div style={{ position: "absolute", left: bx - bh * 0.38, top: by - bh, opacity: intro, transform: `translateY(${(1 - intro) * 60}px)` }}>
        <Cup color={C.accent} h={bh} dot />
      </div>
      {/* A: speech bubble + latte photos */}
      <div style={{ position: "absolute", left: 470, top: 870, opacity: bubble, transform: `scale(${0.7 + bubble * 0.3})`, transformOrigin: "0% 100%" }}>
        <div style={{ padding: "18px 28px", borderRadius: "28px 28px 28px 6px", background: CREAM, color: "#141414", fontFamily: fonts.sans, fontWeight: 600, fontSize: 34 }}>Bugün ne paylaşsak?</div>
      </div>
      <div style={{ position: "absolute", left: 610, top: 1030, width: 300, height: 360, opacity: photo, transform: `translateY(${(1 - photo) * 80}px)` }}>
        {[2, 1].map((k) => (
          <div key={k} style={{ position: "absolute", inset: 0, transform: `translate(${-k * 34 * stack}px, ${k * 6 * stack}px)`, opacity: stack }}><PhotoCard rot={-6 * k * stack} /></div>
        ))}
        <PhotoCard rot={4 * stack} />
        <div style={{ position: "absolute", top: 400, left: -70, right: 0, textAlign: "center", fontFamily: fonts.sans, fontSize: 26, letterSpacing: "0.12em", color: C.muted, opacity: again }}>yine · yine · yine</div>
      </div>
      {/* B: calendar */}
      <div style={{ position: "absolute", left: 430, top: 960, opacity: cal, transform: `translateX(${(1 - cal) * 120}px)` }}>
        <Calendar fill={fill} approved={pr(t, w(33), 0.35)} scheduled={pr(t, w(35), 0.35)} />
      </div>
      {/* later: ? vs what worked */}
      <div style={{ position: "absolute", left: 130, top: 930, width: 400, height: 330, ...card, opacity: qa, transform: `translateY(${(1 - qa) * 50}px)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 200, color: "rgba(255,255,255,0.18)", transform: `rotate(${Math.sin(t * 2.4) * 6}deg)` }}>?</span>
      </div>
      <div style={{ position: "absolute", left: 550, top: 930, width: 400, height: 330, ...card, padding: 30, opacity: rb, transform: `translateY(${(1 - rb) * 50}px)` }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 18, letterSpacing: "0.18em", color: C.muted }}>RAPOR</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 36, color: C.fg, marginTop: 8 }}>Neler işe yaradı</div>
        {[[0.92, C.accent, "Lansman"], [0.64, "#F5F5F5", "Rehber"], [0.4, "#8A8A8A", "Bar arkası"]].map(([v, col, lab], i) => (
          <div key={i} style={{ marginTop: 22 }}>
            <div style={{ fontFamily: fonts.sans, fontSize: 20, color: C.muted, marginBottom: 6 }}>{lab}</div>
            <div style={{ height: 16, borderRadius: 8, background: "rgba(255,255,255,0.06)" }}>
              <div style={{ height: 16, borderRadius: 8, width: `${(v as number) * Math.min(1, Math.max(0, bars * 1.4 - i * 0.2)) * 100}%`, background: col as string }} />
            </div>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- "Fark plandaydı." ---------- */
const PlanTitle: React.FC = () => {
  const t = useT();
  const a = pr(t, w(52) - 0.05, 0.4);
  const b = interpolate(t, [w(53) - 0.05, w(53) + 0.3], [0, 1], { ...clamp, easing: Easing.out(Easing.back(2)) });
  const out = pio(t, S.us - 0.2, 0.35);
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: 1 - out }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, fontFamily: fonts.display, fontWeight: 700, fontSize: 150, color: C.fg, letterSpacing: "-0.03em" }}>
        <span style={{ opacity: a, transform: `translateY(${(1 - a) * 30}px)` }}>Fark</span>
        <span style={{ transform: `scale(${b})`, background: C.accent, color: "#0b0b0b", borderRadius: 40, padding: "4px 38px 14px", fontFamily: fonts.serif, fontWeight: 400, fontSize: 190 }}>plandaydı.</span>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- we plan + follow ---------- */
const UsScene: React.FC = () => {
  const t = useT();
  const a = pr(t, S.us, 0.5);
  const strip = interpolate(t, [w(57), we(61)], [0, 1], clamp);
  const btn = pr(t, w(62), 0.4);
  const press = interpolate(t, [w(64), w(64) + 0.08, w(64) + 0.2], [1, 0.92, 1], clamp);
  const done = t >= w(64) + 0.08;
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 44, paddingTop: 360 }}>
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 30}px)`, display: "flex", alignItems: "center", gap: 16, fontFamily: fonts.display, fontWeight: 700, fontSize: 64, color: C.fg }}>
        <div style={{ width: 84, height: 84, borderRadius: 22, background: "#0c0c0c", border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}><FMark size={74} /></div>
        FNGN <span style={{ color: C.muted, fontWeight: 500 }}>Dijital</span>
      </div>
      <div style={{ ...card, opacity: a, padding: "28px 30px", width: 760 }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 18, letterSpacing: "0.18em", color: C.muted }}>İÇERİK TAKVİMİ · GELECEK AY</div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const on = Math.min(1, Math.max(0, strip * 7 - i));
            return <div key={i} style={{ flex: 1, height: 74, borderRadius: 14, background: on > 0 ? (i % 3 === 0 ? C.accent : i % 3 === 1 ? "#F5F5F5" : "#5a5a5a") : "rgba(255,255,255,0.06)", opacity: 0.35 + on * 0.65, transform: `scale(${0.85 + on * 0.15})` }} />;
          })}
        </div>
      </div>
      <div style={{ height: 96, opacity: btn, transform: `translateY(${(1 - btn) * 30}px) scale(${press})` }}>
        <div style={{ padding: "24px 46px", borderRadius: 999, background: done ? "rgba(255,255,255,0.08)" : C.fg, border: `2px solid ${done ? C.accent : C.fg}`, color: done ? C.accent : "#0b0b0b", fontFamily: fonts.sans, fontWeight: 600, fontSize: 36 }}>
          {done ? "Takip ediliyor ✓" : `${HANDLE} · Takip et`}
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const SoundDesign: React.FC = () => {
  const vol = (f: number) => {
    const t = f / 30;
    return interpolate(t, [0, 0.4, VO_AT + 0.2, w(51), w(52) - 0.1, w(53) + 0.6, we(68), we(68) + 0.4, END - 0.8, END], [0, 0.4, 0.2, 0.2, 0.08, 0.24, 0.24, 0.45, 0.45, 0], clamp);
  };
  return (
    <>
      <Audio src={staticFile("music11.mp3")} startFrom={s(5)} volume={vol} />
      <Sequence from={s(VO_AT)}><Audio src={staticFile("vo11.mp3")} /></Sequence>
      {[w(20), w(15), w(30), w(33), w(35), w(40), w(45), w(53), w(64)].map((x, i) => (
        <Sequence key={i} from={s(x - 0.04)}><Audio src={staticFile("sfx/pop.wav")} volume={0.35} /></Sequence>
      ))}
      {[S.a, S.b, S.later, S.us].map((x, i) => (
        <Sequence key={`w${i}`} from={s(x - 0.1)}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.25} /></Sequence>
      ))}
    </>
  );
};

const Window: React.FC<{ from: number; to: number; children: React.ReactNode; fadeIn?: number; fadeOut?: number }> = ({ from, to, children, fadeIn = 0.2, fadeOut = 0.25 }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const o = interpolate(t, [from, from + fadeIn, to - fadeOut, to], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const tk = (txt: string, i: number, acc = false): Tok => [txt, i, acc];
export const Reel11Plan: React.FC = () => {
  const t = useT();
  const foot = pr(t, 0.6, 0.5) * (1 - pio(t, S.a - 0.3, 0.3));
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 62%, #1d1a18, ${C.bg} 70%)` }}>
      <Header />
      <Window from={0} to={S.plan}><Stage /></Window>
      <Window from={S.plan - 0.05} to={S.us + 0.2}><PlanTitle /></Window>
      <Window from={S.us} to={END} fadeOut={0.01}><UsScene /></Window>
      <div style={{ position: "absolute", left: 80, top: 1560, fontFamily: fonts.sans, fontSize: 24, color: C.muted, opacity: foot }}>A ve B markaları bu örnek için kurgudur.</div>
      <Window from={0} to={S.a} fadeIn={0.01}><TextBlock lines={[[tk("İki", 0), tk("kahve", 1), tk("markası.", 2), tk("Aynı", 3), tk("bütçe.", 4)], [tk("Ama", 5), tk("sadece", 6), tk("biri", 7), tk("gelecek", 8), tk("ay", 9), tk("ne", 10), tk("paylaşacağını", 11), tk("biliyordu.", 12, true)]]} /></Window>
      <Window from={S.a} to={S.a2} fadeOut={0.1}><TextBlock lines={[[tk("A", 13), tk("markası", 14), tk("her", 15), tk("sabah", 16, true), tk("aynı", 17), tk("soruyu", 18), tk("soruyor:", 19)], [tk("“Bugün", 20), tk("ne", 21), tk("paylaşsak?”", 22, true)]]} /></Window>
      <Window from={S.a2} to={S.b} fadeIn={0.1}><TextBlock lines={[[tk("Yine", 23), tk("bir", 24), tk("latte", 25), tk("fotoğrafı.", 26, true)]]} /></Window>
      <Window from={S.b} to={S.later}><TextBlock lines={[[tk("B", 27), tk("markası", 28), tk("ise", 29), tk("ayı", 30), tk("önceden", 31, true), tk("planladı.", 32)], [tk("Onaylandı", 33), tk("ve", 34), tk("zamanlandı.", 35, true)]]} /></Window>
      <Window from={S.later} to={S.diff}><TextBlock lines={[[tk("Bir", 36), tk("ay", 37), tk("sonra", 38), tk("A", 39), tk("hâlâ", 40), tk("tahmin", 41, true), tk("ediyor.", 42)], [tk("B", 43), tk("ise", 44), tk("neyin", 45), tk("işe", 46, true), tk("yaradığını", 47, true), tk("inceliyor.", 48)]]} /></Window>
      <Window from={S.diff} to={S.plan + 0.1}><TextBlock lines={[[tk("Fark", 49), tk("kahvede", 50, true), tk("değildi.", 51)]]} /></Window>
      <Window from={S.us} to={S.follow} fadeOut={0.1}><TextBlock lines={[[tk("Biz", 54), tk("de", 55), tk("markanın", 56), tk("gelecek", 57), tk("ayını,", 58), tk("ay", 59), tk("başlamadan", 60), tk("planlıyoruz.", 61, true)]]} /></Window>
      <Window from={S.follow} to={END} fadeIn={0.1} fadeOut={0.01}><TextBlock lines={[[tk("Sistem", 62), tk("için", 63), tk("takip", 64), tk("et.", 65)], [tk("Gürültü", 66), tk("için", 67), tk("değil.", 68, true)]]} /></Window>
      <SoundDesign />
    </AbsoluteFill>
  );
};
