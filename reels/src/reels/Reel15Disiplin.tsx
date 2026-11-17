// Reel 15 — "Sonuç yok mu? Çalışmaya devam." (discipline edit, Turkish)
// Timed 1:1 to the reference's cuts (seconds = song time; music15.mp3 is the reference's own track).
// The two ink illustrations (public/ref/ink15a.png, ink15b.png) are original generations, not the reference's art.
import React from "react";
import { AbsoluteFill, Audio, Img, interpolate, random, staticFile, useCurrentFrame, Easing } from "remotion";
import { loadFont as loadType } from "@remotion/google-fonts/CourierPrime";
import { loadFont as loadHand } from "@remotion/google-fonts/Kalam";
import { LOGO_ORANGE, Logo, fonts, s } from "../brand";

const subsets: ("latin" | "latin-ext")[] = ["latin", "latin-ext"];
const TYPE = loadType("normal", { weights: ["400", "700"], subsets }).fontFamily;
const HAND = loadHand("normal", { weights: ["700"], subsets }).fontFamily;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.2) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const pio = (t: number, a: number, d = 0.3) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
const useT = () => useCurrentFrame() / 30;
const END = 17.6;
export const REEL15_FRAMES = s(END);
const INK = "#1b1714";
const HL = "#FF8A3D";

/* paper with grain and a soft top shadow, like a photographed sheet */
const Paper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "linear-gradient(180deg, #a9a49d 0%, #cfcac3 22%, #dcd8d1 60%, #cdc8c1 100%)", overflow: "hidden" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", inset: 0, opacity: 0.35, mixBlendMode: "multiply" }}>
      <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" /><feColorMatrix type="saturate" values="0" /></filter>
      <rect width="1080" height="1920" filter="url(#grain)" />
    </svg>
    {children}
  </AbsoluteFill>
);

/* typewriter text: reveals characters from `at` */
const Typed: React.FC<{ text: string; at: number; cps?: number; style?: React.CSSProperties }> = ({ text, at, cps = 40, style }) => {
  const t = useT();
  const n = Math.max(0, Math.min(text.length, Math.floor((t - at) * cps)));
  if (t < at) return null;
  return <div style={{ fontFamily: TYPE, fontSize: 62, color: INK, whiteSpace: "nowrap", ...style }}>{text.slice(0, n)}</div>;
};

/* ---------- 1. questions + highlighter (0 – 7.5) ---------- */
const SceneQ: React.FC = () => {
  const t = useT();
  const pan = interpolate(t, [3.95, 4.35], [0, -360], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const zoom = interpolate(t, [0, 7.5], [1, 1.12], clamp);
  const card = interpio(t);
  const Q = ["Sonuç yok mu?", "Kötü sonuç mu?", "İyi sonuç mu?"];
  const QA = [0.125, 1.125, 2.125];
  const HA = [4.0, 4.6, 5.15];
  return (
    <Paper>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom}) translateX(${pan}px)`, transformOrigin: "40% 45%", filter: `blur(${card * 6}px)` }}>
        {Q.map((q, i) => (
          <div key={i} style={{ position: "absolute", left: 80, top: 760 + i * 130 }}>
            <Typed text={q} at={QA[i]} />
          </div>
        ))}
        {HA.map((a, i) => {
          const w = interpolate(t, [a, a + 0.22], [0, 1], { ...clamp, easing: Easing.out(Easing.quad) });
          return (
            <div key={i} style={{ position: "absolute", left: 690, top: 748 + i * 130, opacity: t >= a ? 1 : 0 }}>
              <div style={{ position: "absolute", left: -12, top: 8, height: 78, width: `calc(${w * 100}% + 24px)`, background: HL, opacity: 0.9, transform: "skewX(-6deg) rotate(-0.6deg)", borderRadius: 4 }} />
              <div style={{ position: "relative", fontFamily: TYPE, fontWeight: 700, fontSize: 64, color: INK, whiteSpace: "nowrap", clipPath: `inset(0 ${(1 - w) * 100}% 0 0)` }}>Çalışmaya devam.</div>
            </div>
          );
        })}
      </div>
    </Paper>
  );
};
const interpio = (t: number) => pio(t, 7.45, 0.3);

/* ---------- 2. handwritten card (7.5 – 9.5) ---------- */
const SceneCard: React.FC = () => {
  const t = useT();
  const inn = interpolate(t, [7.45, 8.1], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const sc = interpolate(inn, [0, 1], [0.5, 1.5]);
  const write = interpolate(t, [8.45, 8.85], [0, 1], clamp);
  const shake = t > 8.1 ? (random(`c${Math.floor(t * 15)}`) - 0.5) * 6 : 0;
  return (
    <AbsoluteFill style={{ background: "#2a2826" }}>
      <div style={{ position: "absolute", left: 540 + shake, top: 900, transform: `translate(-50%,-50%) scale(${sc}) rotate(${(1 - inn) * -8}deg)`, width: 640, height: 640, background: "linear-gradient(180deg,#e9e7e3,#f6f5f2 30%,#e2e0dc)", borderRadius: 10, boxShadow: "0 30px 80px rgba(0,0,0,0.5)", padding: "70px 60px", fontFamily: HAND, fontWeight: 700, color: INK, lineHeight: 1.05 }}>
        <div style={{ fontSize: 92 }}>Plana sadık kal.</div>
        <div style={{ fontSize: 100, marginTop: 40, clipPath: `inset(0 ${(1 - write) * 100}% 0 0)` }}>Moduna değil.</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. black squares (9.5 – 11.0) ---------- */
const SceneBlack: React.FC = () => {
  const t = useT();
  const sq = interpolate(t, [9.45, 9.65], [0.3, 1], { ...clamp, easing: Easing.out(Easing.back(1.6)) });
  const glitch = t >= 10.45 && t < 10.62;
  const gx = glitch ? (random(`gl${Math.floor(t * 30)}`) - 0.5) * 60 : 0;
  return (
    <AbsoluteFill style={{ background: "#d8d4ce" }}>
      <div style={{ position: "absolute", left: 540 + gx, top: 900, width: 860, height: 860, transform: `translate(-50%,-50%) scale(${sq})`, background: "#050505", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 90px rgba(0,0,0,0.45)", filter: glitch ? "blur(6px)" : "none" }}>
        {t < 10.1 && <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 86, color: "#fff", transform: "skewX(-8deg)" }}>İstikrarlı ol.</div>}
        {t >= 10.1 && t < 10.6 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 92, lineHeight: 0.98, color: "#fff", opacity: pr(t, 10.1 + i * 0.03, 0.08), WebkitMaskImage: `linear-gradient(90deg, rgba(0,0,0,${0.25 + i * 0.1}) 0%, #000 ${30 + i * 8}%)` }}>TEKRAR</div>
            ))}
          </div>
        )}
        {t >= 10.6 && (
          <div style={{ textAlign: "center", fontFamily: fonts.display, fontWeight: 800, color: "#fff", lineHeight: 1.15 }}>
            <div style={{ fontSize: 66, position: "relative", display: "inline-block" }}>
              Başaramadım
              <div style={{ position: "absolute", left: -10, right: -10, top: "52%", height: 7, background: LOGO_ORANGE, transform: `scaleX(${pr(t, 10.65, 0.15)})`, transformOrigin: "0 50%" }} />
            </div>
            <div style={{ fontSize: 74, opacity: pr(t, 10.7, 0.12) }}>Öğrendim</div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4. ink art + text overlays ---------- */
const InkScene: React.FC<{ src: string; from: number; children: React.ReactNode }> = ({ src, from, children }) => {
  const t = useT();
  const z = interpolate(t, [from, from + 1.6], [1.12, 1.0], { ...clamp, easing: Easing.out(Easing.cubic) });
  return (
    <AbsoluteFill style={{ background: "#fff", overflow: "hidden" }}>
      <Img src={staticFile(src)} style={{ position: "absolute", left: 0, top: 820, width: 1080, height: 884, transform: `scale(${z})`, transformOrigin: "60% 40%", filter: "contrast(1.15)" }} />
      {children}
    </AbsoluteFill>
  );
};
const Ital: React.FC<{ on: number; size?: number; children: React.ReactNode }> = ({ on, size = 76, children }) => (
  <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: size, color: INK, lineHeight: 1.08, transform: `skewX(-9deg) translateY(${(1 - on) * 14}px)`, opacity: on, textShadow: "0 0 24px rgba(255,255,255,0.9)" }}>{children}</div>
);

const SceneInkA: React.FC = () => {
  const t = useT();
  const out = pio(t, 12.4, 0.15);
  return (
    <InkScene src="ref/ink15a.png" from={11.0}>
      <div style={{ position: "absolute", left: 80, top: 330, filter: `blur(${out * 16}px)`, transform: `translateX(${out * 300}px)` }}>
        <Ital on={pr(t, 11.125, 0.12)}>Bahane yok.</Ital>
        <Ital on={pr(t, 11.375, 0.12)}>Devam et.</Ital>
      </div>
    </InkScene>
  );
};

const SceneWish: React.FC = () => {
  const t = useT();
  const inn = interpolate(t, [12.5, 12.7], [1, 0], clamp);
  const out = pio(t, 13.8, 0.2);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 48%, #ffffff 30%, #d6d2cc 100%)" }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 820, textAlign: "center", filter: `blur(${(inn + out) * 18}px)`, transform: `translateX(${(-inn + out) * 260}px)` }}>
        <div style={{ display: "inline-block", textAlign: "left" }}>
          <Ital on={pr(t, 12.6, 0.12)} size={72}>Dilemeyi bırak,</Ital>
          <Ital on={pr(t, 13.0, 0.12)} size={72}>yapmaya başla.</Ital>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneInkB: React.FC = () => {
  const t = useT();
  const grow = interpolate(t, [14.5, 16.3], [1, 1.35], clamp);
  return (
    <InkScene src="ref/ink15b.png" from={14.0}>
      <div style={{ position: "absolute", left: 70, top: 300, transform: `scale(${grow})`, transformOrigin: "0 0" }}>
        <Ital on={pr(t, 14.5, 0.12)} size={86}>Her zaman</Ital>
        <Ital on={pr(t, 15.125, 0.12)} size={86}>devam</Ital>
        <Ital on={pr(t, 15.625, 0.12)} size={86}>et.</Ital>
      </div>
    </InkScene>
  );
};

/* ---------- 5. end: glowing line + FNGN logo (16.5 – END) ---------- */
const SceneEnd: React.FC = () => {
  const t = useT();
  const text = "DisiplinKazandırır";
  const n = Math.floor(interpolate(t, [16.55, 16.95], [0, text.length], clamp));
  const fade = 1 - pr(t, 17.3, 0.3);
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 60, opacity: fade }}>
      <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 70, color: "#fff", letterSpacing: "0.01em", transform: "skewX(-9deg)", textShadow: "0 0 18px rgba(255,255,255,0.75), 0 0 46px rgba(255,138,61,0.55)", minHeight: 90 }}>{text.slice(0, n)}</div>
      <div style={{ opacity: pr(t, 16.95, 0.3), transform: `translateY(${(1 - pr(t, 16.95, 0.3)) * 20}px)` }}><Logo width={360} /></div>
    </AbsoluteFill>
  );
};

const Scene: React.FC<{ from: number; to: number; children: React.ReactNode }> = ({ from, to, children }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  return <AbsoluteFill>{children}</AbsoluteFill>;
};
const Flash: React.FC<{ at: number[] }> = ({ at }) => {
  const t = useT();
  const o = Math.max(0, ...at.map((a) => interpolate(t, [a - 0.04, a, a + 0.12], [0, 0.6, 0], clamp)));
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
};

export const Reel15Disiplin: React.FC<{ music?: boolean }> = ({ music = true }) => {
  const t = useT();
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Scene from={0} to={7.75}><SceneQ /></Scene>
      <Scene from={7.5} to={9.5}><SceneCard /></Scene>
      <Scene from={9.5} to={11.0}><SceneBlack /></Scene>
      <Scene from={11.0} to={12.55}><SceneInkA /></Scene>
      <Scene from={12.55} to={14.0}><SceneWish /></Scene>
      <Scene from={14.0} to={16.5}><SceneInkB /></Scene>
      <Scene from={16.5} to={END}><SceneEnd /></Scene>
      <Flash at={[11.0, 14.0]} />
      {t < 16.5 && <div style={{ position: "absolute", right: 50, bottom: 260, opacity: 0.55 }}><Logo width={150} sub={false} color="#111" accent={LOGO_ORANGE} /></div>}
      {music && <Audio src={staticFile("music15.mp3")} />}
    </AbsoluteFill>
  );
};
export const Reel15DisiplinSessiz: React.FC = () => <Reel15Disiplin music={false} />;
