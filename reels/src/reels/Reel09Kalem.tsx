// Reel 09 — "Az önce 8 saniye bir kaleme baktınız." (motion-design hook)
// Original animation: the slow-motion pencil-vs-blade hook is drawn here, NOT taken from the reference footage.
// VO (public/vo09.mp3) starts at VO_AT; word times below are Scribe times + VO_AT.
import React from "react";
import { AbsoluteFill, Audio, Img, OffthreadVideo, Sequence, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, Easing, random } from "remotion";
import { C, FMark, HANDLE, fonts, s } from "../brand";

const VO_AT = 7.4;
const v = (x: number) => x + VO_AT;
const T = {
  macro: 0.9, oneFrame: 6.6, restyle: v(0.16), sec8: v(1.14), still: v(3.62), count: v(3.82),
  impact: v(5.0), imagine: v(5.46), product: v(6.36), we: v(8.44), cant: v(9.44), motion: v(10.46),
  logo: v(12.0), dm: v(14.26), end: 24.4,
};
export const REEL09_FRAMES = s(T.end);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const useT = () => useCurrentFrame() / 30;

/* ---------- 1. Hook: reference footage (used with the creator's permission) → same frame split into layers ---------- */
// The reference shows English captions from ~8.8s, so we cut at frame 261 (8.70s). The "OBJECT" titles were
// painted out of public/ref/hook09.mp4; pencil09.png / knife09.png are that exact frame split at y=1135.
const CUT = 8.7;
const SPLIT = 1135;
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT();
  if (t < CUT) {
    const chip = pr(t, 8.05, 0.12);
    return (
      <AbsoluteFill style={{ background: "#000" }}>
        <OffthreadVideo src={staticFile("ref/hook09.mp4")} muted style={{ width: 1080, height: 1920 }} />
        {/* cover the small English "1 frame to impact" label with a Turkish one */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 1006, display: "flex", justifyContent: "center", opacity: chip }}>
          <div style={{ padding: "8px 20px", borderRadius: 999, background: C.accent, fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, color: "#0b0b0b" }}>çarpışmaya 1 kare</div>
        </div>
      </AbsoluteFill>
    );
  }
  // open a gap for the lines (like the reference does), hold, then the pencil snaps onto the blade
  const open = interpolate(t, [CUT + 0.05, CUT + 0.75], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const snap = interpolate(t, [T.impact - 0.18, T.impact], [0, 1], { ...clamp, easing: Easing.in(Easing.cubic) });
  const pencilY = -220 * open + snap * (220 + 150 + 62) * open + snap * (1 - open) * 62;
  const knifeY = 150 * open;
  const push = interpolate(t, [CUT, T.impact], [1, 1.035], clamp);
  const flash = interpolate(t, [T.impact, T.impact + 0.05, T.impact + 0.25], [0, 0.9, 0], clamp);
  const shake = t > T.impact - 0.05 ? (random(`s${frame}`) - 0.5) * 14 : 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <div style={{ position: "absolute", inset: 0, transform: `translate(${shake}px, ${shake * 0.5}px) scale(${push})`, transformOrigin: "540px 1140px" }}>
        <Img src={staticFile("ref/knife09.png")} style={{ position: "absolute", left: 0, top: SPLIT + knifeY, width: 1080, mixBlendMode: "lighten" }} />
        <Img src={staticFile("ref/pencil09.png")} style={{ position: "absolute", left: 0, top: pencilY, width: 1080, mixBlendMode: "lighten" }} />
      </div>
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* ---------- On-screen lines in the gap ---------- */
const HookText: React.FC = () => {
  const t = useT();
  if (t < CUT + 0.3 || t > T.impact - 0.2) return null;
  const a = pr(t, CUT + 0.35, 0.3);
  const b = pr(t, T.sec8, 0.3);
  const c = pr(t, T.still, 0.3);
  const secs = t.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 1010, textAlign: "center" }}>
      <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 44, color: C.fg, opacity: a }}>{c > 0.5 ? "Ve hâlâ izliyorsunuz," : "Az önce bir kaleme baktınız"}</div>
      <div style={{ marginTop: 4, fontFamily: fonts.display, fontWeight: 800, fontSize: 96, color: C.fg, letterSpacing: "-0.03em", opacity: Math.max(b, c) }}>
        tam <span style={{ color: C.accent, fontVariantNumeric: "tabular-nums" }}>{c > 0.5 ? secs : "8"}</span> saniye.
      </div>
    </div>
  );
};

/* ---------- 2. Shatter → "imagine it was your product" ---------- */
const SHARDS = Array.from({ length: 70 }, (_, i) => {
  const a = random(`a${i}`) * Math.PI * 2;
  const d = 300 + random(`d${i}`) * 900;
  const size = 20 + random(`z${i}`) * 90;
  // target: outline of a phone (rounded rect 420x860 centered at 540,1000)
  const k = i / 70;
  const per = 2 * (420 + 860);
  let p = k * per;
  let tx = 0, ty = 0;
  if (p < 420) { tx = 330 + p; ty = 570; } else if ((p -= 420) < 860) { tx = 750; ty = 570 + p; } else if ((p -= 860) < 420) { tx = 750 - p; ty = 1430; } else { p -= 420; tx = 330; ty = 1430 - p; }
  return { a, d, size, rot: random(`r${i}`) * 360, tx, ty, pts: Array.from({ length: 4 }, (_, j) => `${Math.cos((j / 4) * 6.28 + random(`p${i}${j}`)) * 50 + 50},${Math.sin((j / 4) * 6.28 + random(`q${i}${j}`)) * 50 + 50}`).join(" ") };
});
const Shatter: React.FC = () => {
  const t = useT();
  const burst = interpolate(t, [T.impact, T.impact + 0.6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const form = interpolate(t, [T.imagine, T.imagine + 0.9], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const fade = pr(t, T.product - 0.1, 0.4);
  return (
    <AbsoluteFill style={{ background: "#050505" }}>
      {SHARDS.map((sh, i) => {
        const bx = 540 + Math.cos(sh.a) * sh.d * burst;
        const by = 980 + Math.sin(sh.a) * sh.d * burst;
        const x = bx + (sh.tx - bx) * form;
        const y = by + (sh.ty - by) * form;
        const sz = sh.size * (1 - form * 0.6);
        return (
          <svg key={i} width={sz} height={sz} viewBox="0 0 100 100" style={{ position: "absolute", left: x - sz / 2, top: y - sz / 2, transform: `rotate(${sh.rot * (1 - form) + t * 40 * (1 - form)}deg)`, opacity: 1 - fade }}>
            <polygon points={sh.pts} fill={i % 3 === 0 ? "#ff8a3d" : i % 3 === 1 ? "#c8432a" : C.accent} />
          </svg>
        );
      })}
      <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: pr(t, T.imagine) }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 52, color: C.fg }}>Şimdi bunun</div>
        <div style={{ fontFamily: fonts.serif, fontSize: 100, color: C.accent, lineHeight: 1.05, opacity: pr(t, T.product) }}>sizin ürününüz olduğunu</div>
        <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 52, color: C.fg, opacity: pr(t, v(7.56)) }}>hayal edin.</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 3. Phone screens ---------- */
const Phone: React.FC<{ children: React.ReactNode; scale?: number }> = ({ children, scale = 1 }) => (
  <div style={{ position: "absolute", left: 540 - 210, top: 570, width: 420, height: 860, borderRadius: 64, background: "#0a0a0a", border: "6px solid #2a2a2a", overflow: "hidden", boxShadow: "0 60px 140px -30px rgba(226,98,5,0.35)", transform: `scale(${scale})` }}>
    <div style={{ position: "absolute", top: 18, left: "50%", marginLeft: -55, width: 110, height: 30, borderRadius: 15, background: "#000", zIndex: 5 }} />
    <div style={{ position: "absolute", top: 20, left: 34, fontFamily: fonts.sans, fontWeight: 700, fontSize: 20, color: C.fg, zIndex: 5 }}>9:41</div>
    {children}
  </div>
);
const Screens: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT();
  const pIn = spring({ frame: frame - s(T.product), fps: 30, config: { damping: 14, stiffness: 120 } });
  const screen = t < T.we ? 0 : t < T.cant ? 1 : 2;
  const local = t - [T.product, T.we, T.cant][screen];
  const icon = spring({ frame: frame - s(T.product) - 8, fps: 30, config: { damping: 9, stiffness: 160 } });
  const head = (txt: React.ReactNode, o: number) => (
    <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: o }}>{txt}</div>
  );
  const watch = (
    <div style={{ position: "absolute", left: 0, right: 0, top: 250, display: "flex", justifyContent: "center" }}>
      <div style={{ padding: "8px 20px", borderRadius: 999, background: "#151515", border: "1px solid rgba(255,255,255,0.1)", fontFamily: fonts.sans, fontSize: 24, color: C.muted, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ width: 10, height: 10, borderRadius: 5, background: C.accent }} /> izleniyor <b style={{ color: C.fg, fontVariantNumeric: "tabular-nums" }}>{t.toLocaleString("tr-TR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} sn</b>
      </div>
    </div>
  );
  return (
    <AbsoluteFill style={{ background: "radial-gradient(900px 1000px at 50% 55%, #1a120c, #050505 70%)" }}>
      {watch}
      {screen === 0 && head(<div style={{ fontFamily: fonts.serif, fontSize: 96, color: C.accent }}>sizin ürününüz.</div>, 1)}
      {screen >= 1 && head(
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 70, color: C.fg, letterSpacing: "-0.03em", lineHeight: 1.05, padding: "0 70px" }}>
          İnsanların <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>kaydırıp geçemediği</span>
          <span style={{ opacity: pr(t, T.motion) }}> hareketli tasarımlar.</span>
        </div>, pr(t, T.we))}
      <Phone scale={0.96 + pIn * 0.04}>
        {screen === 0 && (
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 50% 40%, #ff8a3d, ${C.accent} 55%, #6a2300)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <div style={{ width: 150, height: 150, borderRadius: 40, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${icon}) rotate(${(1 - icon) * -30}deg)`, boxShadow: "0 30px 60px -20px rgba(0,0,0,0.5)" }}>
              <svg width={84} height={84} viewBox="0 0 24 24"><path d="M12 2 L14.2 9.8 L22 12 L14.2 14.2 L12 22 L9.8 14.2 L2 12 L9.8 9.8 Z" fill={C.accent} /></svg>
            </div>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 40, color: "#fff" }}>Ürününüz</div>
          </div>
        )}
        {screen === 1 && (
          <div style={{ position: "absolute", inset: 0, background: "#0d0d0d" }}>
            <div style={{ height: 300, background: C.accent, display: "flex", gap: 14, alignItems: "flex-end", padding: "0 30px 30px" }}>
              {Array.from({ length: 6 }, (_, i) => <div key={i} style={{ flex: 1, height: 40 + Math.abs(Math.sin(frame / 4 + i)) * 160, borderRadius: 8, background: "rgba(255,255,255,0.85)" }} />)}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 480, background: "#F1ECE3", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
              <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 260, color: "#111", letterSpacing: "-0.06em", transform: `scale(${1 + Math.sin(local * 5) * 0.06}) skewX(${Math.sin(local * 4) * -6}deg)`, filter: `blur(${Math.abs(Math.sin(local * 6)) * 3}px)` }}>Aa</div>
              <div style={{ position: "absolute", right: 70, top: 120, width: 44, height: 44, borderRadius: 22, background: C.accent }} />
            </div>
          </div>
        )}
        {screen === 2 && (
          <div style={{ position: "absolute", inset: 0, background: "#0a0a0a", paddingTop: 70 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 22px", fontFamily: fonts.sans, fontWeight: 700, fontSize: 22, color: C.fg }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: "#111", border: `2px solid ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center" }}><FMark size={24} /></div>
              {HANDLE.replace("@", "")}
            </div>
            <div style={{ position: "relative", marginTop: 16, height: 600, background: "#030303", overflow: "hidden" }}>
              <Img src={staticFile("ref/still09.png")} style={{ position: "absolute", left: 0, top: -180 + Math.min(local, 2) * 20, width: "100%" }} />
            </div>
            <div style={{ display: "flex", gap: 22, padding: "16px 22px" }}>
              {["♥", "💬", "➤"].map((g, i) => <span key={i} style={{ fontSize: 30, color: i === 0 ? C.accent : C.fg }}>{g}</span>)}
            </div>
          </div>
        )}
      </Phone>
    </AbsoluteFill>
  );
};

/* ---------- 4. Logo + DM ---------- */
const EndCard: React.FC = () => {
  const t = useT();
  const l = pr(t, T.logo, 0.6);
  const d = spring({ frame: s(t - T.dm), fps: 30, config: { damping: 11, stiffness: 160 } });
  const out = interpolate(t, [T.end - 0.5, T.end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(700px 600px at 50% 45%, #22160e, #030303 70%)", opacity: out }}>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, textAlign: "center", opacity: l, transform: `translateY(${(1 - l) * 20}px)` }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 22 }}>
          <div style={{ width: 120, height: 120, borderRadius: 30, background: "#0c0c0c", border: "2px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}><FMark size={104} /></div>
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 104, color: C.fg, letterSpacing: "-0.04em" }}>FNGN<span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}> Dijital</span></div>
        </div>
        <div style={{ marginTop: 18, fontFamily: fonts.sans, fontSize: 40, color: C.muted }}>Markalar ve uygulamalar için hareketli tasarım.</div>
        <div style={{ marginTop: 50, display: "inline-block", padding: "20px 40px", borderRadius: 999, border: `3px solid ${C.accent}`, background: "rgba(226,98,5,0.12)", fontFamily: fonts.sans, fontWeight: 700, fontSize: 38, color: C.fg, transform: `scale(${t > T.dm ? d : 0})`, boxShadow: "0 0 40px rgba(226,98,5,0.4)" }}>
          DM'den <span style={{ color: C.accent }}>“HAREKET”</span> yaz · ücretsiz lansman fikri
        </div>
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
export const MUSIC09_AT = 0.8; // music's impact hit (~11s in the bed) lands on T.impact
const SoundDesign: React.FC = () => (
  <>
    <Sequence from={s(MUSIC09_AT)} layout="none">
      <Audio src={staticFile("music09.mp3")} volume={(f) => interpolate(f / 30 + MUSIC09_AT, [MUSIC09_AT, MUSIC09_AT + 0.5, 8.75, 9.0, T.impact - 0.05, T.impact + 0.1, 23.15, 23.5, 23.9, T.end], [0, 0.6, 0.6, 0.5, 0.5, 0.32, 0.32, 0.6, 0.6, 0], clamp)} />
    </Sequence>
    <Sequence from={s(VO_AT)} layout="none">
      <Audio src={staticFile("vo09.mp3")} volume={1} />
    </Sequence>
    {Array.from({ length: 6 }, (_, i) => <Sfx key={`t${i}`} at={2.6 + i} src="tick" vol={0.12} />)}
    <Sfx at={2.25} src="whoosh" vol={0.3} />
    <Sfx at={T.impact} src="boom" vol={0.8} />
    <Sfx at={T.impact} src="whoosh" vol={0.4} />
    <Sfx at={T.imagine} src="whoosh" vol={0.25} />
    <Sfx at={T.we} src="whoosh" vol={0.25} />
    <Sfx at={T.cant} src="whoosh" vol={0.25} />
    <Sfx at={T.dm} src="pop" vol={0.35} />
  </>
);

/* ---------- Composition (all scenes on the absolute clock) ---------- */
const Window: React.FC<{ from: number; to: number; children: React.ReactNode; fadeIn?: number; fadeOut?: number }> = ({ from, to, children, fadeIn = 0.12, fadeOut = 0.2 }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const o = interpolate(t, [from, from + fadeIn, to - fadeOut, to], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
export const Reel09Kalem: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#030303" }}>
    <Window from={0} to={T.impact + 0.05} fadeIn={0.01} fadeOut={0.01}>
      <Hook />
      <HookText />
    </Window>
    <Window from={T.impact} to={T.product + 0.2} fadeIn={0.01}>
      <Shatter />
    </Window>
    <Window from={T.product} to={T.logo}>
      <Screens />
    </Window>
    <Window from={T.logo} to={T.end} fadeOut={0.01}>
      <EndCard />
    </Window>
    <SoundDesign />
  </AbsoluteFill>
);
