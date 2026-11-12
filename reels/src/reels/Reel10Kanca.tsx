// Reel 10 — "Bu bir beklenti kancası." (anticipation hooks + 50+ hook library CTA)
// The three hook clips are the reference's own clean segments (public/ref/hook10{a,b,c}.mp4: audio removed,
// the source creator's watermark painted out with delogo and covered by our handle chip).
// VO (public/vo10.mp3) is one take, cut at its pauses into three placements (SEG below).
import React from "react";
import { AbsoluteFill, Audio, Img, Loop, OffthreadVideo, Sequence, interpolate, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, FMark, HANDLE, Outro, fonts, s } from "../brand";
import { W10 } from "./words10";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.4) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const useT = () => useCurrentFrame() / 30;

// VO pieces: [src from, src to, global start]
const SEG: [number, number, number][] = [
  [0, 7.2, 3.35],
  [7.2, 11.44, 14.5],
  [11.44, 28.6, 21.6],
];
const g = (src: number) => {
  for (const [a, b, at] of SEG) if (src >= a && src < b) return src - a + at;
  return src;
};
const WORDS = W10.map(([w, a, b]) => ({ w, a: g(a), b: g(b) }));
const wt = (i: number) => WORDS[i].a;

// clip windows (clean footage) and freeze windows (dimmed, text on top)
const CL = {
  a: { from: 0, len: 3.3, src: "ref/hook10a.mp4", last: "ref/last10a.jpg", chip: { right: 18, top: 476 } },
  b: { from: 10.6, len: 3.9, src: "ref/hook10b.mp4", last: "ref/last10b.jpg", chip: { left: 40, top: 1030 } },
  c: { from: 18.8, len: 2.77, src: "ref/hook10c.mp4", last: "ref/last10c.jpg", chip: { right: 18, top: 466 } },
};
const IMPACT = 2.8;
const T = {
  explain: g(15.5) + 0.05, // "İşin sırrı şu"
  cta: g(22.83),           // "Yorumlara KANCA yaz"
  lib: g(25.08),           // "kütüphanemizi"
  grow: g(27.02),
  outro: g(28.28) + 0.45,
};
const END = T.outro + 2.9;
export const REEL10_FRAMES = s(END);

/* ---------- handle chip that sits over the painted-out source watermark ---------- */
const HandleChip: React.FC<{ pos: React.CSSProperties }> = ({ pos }) => (
  <div
    style={{
      position: "absolute", ...pos, width: 392, height: 176, borderRadius: 30,
      background: "rgba(10,10,10,0.62)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)",
      border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 18, padding: "0 26px",
    }}
  >
    <div style={{ width: 92, height: 92, borderRadius: 24, background: "#0c0c0c", border: `1.5px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <FMark size={82} />
    </div>
    <div>
      <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 38, color: C.fg }}>
        FNGN <span style={{ color: C.muted, fontWeight: 500 }}>Dijital</span>
      </div>
      <div style={{ fontFamily: fonts.sans, fontSize: 28, color: C.muted, marginTop: 2 }}>{HANDLE}</div>
    </div>
  </div>
);

/* ---------- one hook: clean clip, then a dimmed slow push on its last frame ---------- */
const HookBlock: React.FC<{ k: keyof typeof CL; to: number; title: string }> = ({ k, to, title }) => {
  const t = useT();
  const c = CL[k];
  const end = c.from + c.len;
  if (t < c.from || t >= to) return null;
  const frozen = t >= end;
  const dim = frozen ? pr(t, end, 0.35) : 0;
  const push = frozen ? interpolate(t, [end, to], [1, 1.08], clamp) : 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {!frozen ? (
        <Sequence from={s(c.from)} layout="none">
          <OffthreadVideo src={staticFile(c.src)} muted style={{ width: 1080, height: 1920 }} />
        </Sequence>
      ) : (
        <Img src={staticFile(c.last)} style={{ width: 1080, height: 1920, transform: `scale(${push})`, filter: `blur(${dim * 7}px)` }} />
      )}
      {!frozen && <HandleChip pos={c.chip} />}
      <AbsoluteFill style={{ background: `rgba(6,6,6,${dim * 0.62})` }} />
      {frozen && <Title t={t} at={end + 0.1} text={title} />}
    </AbsoluteFill>
  );
};

const Title: React.FC<{ t: number; at: number; text: string }> = ({ t, at, text }) => {
  const a = pr(t, at, 0.35);
  const b = pr(t, at + 0.18, 0.45);
  const c2 = pr(t, at + 0.4, 0.35);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 560, textAlign: "center", color: C.fg }}>
      <div style={{ opacity: a, transform: `translateY(${(1 - a) * 24}px)`, fontFamily: fonts.display, fontWeight: 700, fontSize: 64 }}>{text}</div>
      <div style={{ opacity: b, transform: `scale(${0.85 + b * 0.15})`, fontFamily: fonts.serif, fontSize: 190, lineHeight: 1, color: C.accent, marginTop: 6 }}>beklenti</div>
      <div style={{ opacity: c2, transform: `translateY(${(1 - c2) * 24}px)`, fontFamily: fonts.display, fontWeight: 800, fontSize: 92, letterSpacing: "0.02em", textTransform: "uppercase" }}>kancası</div>
    </div>
  );
};

/* ---------- word-by-word captions (chunks split on punctuation / 3 words) ---------- */
const CHUNKS: number[][] = (() => {
  const out: number[][] = [];
  let cur: number[] = [];
  WORDS.forEach((w, i) => {
    cur.push(i);
    const gap = i + 1 < WORDS.length ? WORDS[i + 1].a - w.b : 9;
    if (/[.,]$/.test(w.w) || cur.length >= 3 || gap > 0.3) { out.push(cur); cur = []; }
  });
  if (cur.length) out.push(cur);
  return out;
})();
const KEY = new Set(["beklenti", "kanca", "kanca,", "\"KANCA\"", "direğin", "balta", "sırrı", "videon.", "kütüphanemizi", "büyütmeye", "izledin.", "kaldın."]);
const Captions: React.FC<{ top: number }> = ({ top }) => {
  const t = useT();
  const ci = CHUNKS.findIndex((ch, n) => t >= WORDS[ch[0]].a - 0.05 && (n + 1 >= CHUNKS.length || t < WORDS[CHUNKS[n + 1][0]].a - 0.05) && t < WORDS[ch[ch.length - 1]].b + 0.6);
  if (ci < 0) return null;
  const ch = CHUNKS[ci];
  const inA = pr(t, WORDS[ch[0]].a - 0.05, 0.12);
  return (
    <div style={{ position: "absolute", left: 60, right: 60, top, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "0 22px", opacity: inA, transform: `translateY(${(1 - inA) * 14}px)` }}>
      {ch.map((i) => {
        const w = WORDS[i];
        const on = t >= w.a - 0.03;
        const key = KEY.has(w.w);
        const txt = w.w.replace(/[.,"]/g, "");
        return key ? (
          <span key={i} style={{ fontFamily: fonts.serif, fontSize: 96, lineHeight: 1.05, color: on ? C.accent : "rgba(255,255,255,0.35)", textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>{txt}</span>
        ) : (
          <span key={i} style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, lineHeight: 1.45, textTransform: "uppercase", color: on ? C.fg : "rgba(255,255,255,0.35)", textShadow: "0 4px 30px rgba(0,0,0,0.6)" }}>{txt.toLocaleUpperCase("tr")}</span>
        );
      })}
    </div>
  );
};

/* ---------- explainer: KANCA + SENİN VİDEON ---------- */
const Explainer: React.FC = () => {
  const t = useT();
  const at = T.explain;
  const head = pr(t, at, 0.4);
  const c1 = pr(t, wt(43) - 0.1, 0.45); // "Bu tarz bir sahneyi"
  const plus = pr(t, wt(47), 0.3);      // "kendi videonun"
  const c2 = pr(t, wt(48), 0.45);
  const hi1 = pr(t, wt(53), 0.2) * (1 - pr(t, wt(55), 0.2)); // "Önce kanca"
  const hi2 = pr(t, wt(55), 0.2);                            // "hemen ardından kendi videon"
  const bar = interpolate(t, [wt(53), wt(58) + 0.3], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const card: React.CSSProperties = { width: 400, height: 690, borderRadius: 40, overflow: "hidden", position: "relative" };
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, rgba(226,98,5,0.22), transparent 60%)" }} />
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", opacity: head, transform: `translateY(${(1 - head) * 30}px)`, fontFamily: fonts.display, fontWeight: 800, fontSize: 84, color: C.fg, letterSpacing: "-0.01em" }}>
        <span style={{ color: C.accent }}>KANCA</span> + SENİN VİDEON
      </div>
      <div style={{ position: "absolute", top: 480, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 34 }}>
        <div style={{ opacity: c1, transform: `translateY(${(1 - c1) * 60}px) scale(${1 + hi1 * 0.05})` }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, color: C.accent, marginBottom: 14, letterSpacing: "0.08em" }}>1 · KANCA</div>
          <div style={{ ...card, border: `4px solid ${hi1 > 0.1 || hi2 < 0.1 ? C.accent : C.line}`, boxShadow: hi1 > 0.1 ? `0 30px 90px -20px rgba(226,98,5,0.7)` : "none" }}>
            <Sequence from={s(at)} layout="none">
              <Loop durationInFrames={s(2.75)} layout="none">
                <OffthreadVideo src={staticFile("ref/hook10c.mp4")} muted style={{ position: "absolute", width: 400, height: 711, top: -10 }} />
              </Loop>
            </Sequence>
            <div style={{ position: "absolute", left: 18, bottom: 18, padding: "8px 18px", borderRadius: 999, background: "rgba(0,0,0,0.6)", fontFamily: fonts.sans, fontWeight: 600, fontSize: 26, color: C.fg }}>0–3 sn</div>
          </div>
        </div>
        <div style={{ opacity: plus, transform: `scale(${0.5 + plus * 0.5})`, width: 76, height: 76, borderRadius: 38, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 56, color: "#0b0b0b", marginTop: 50 }}>+</div>
        <div style={{ opacity: c2, transform: `translateY(${(1 - c2) * 60}px) scale(${1 + hi2 * 0.05})` }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, color: hi2 > 0.1 ? C.accent : C.muted, marginBottom: 14, letterSpacing: "0.08em" }}>2 · SENİN VİDEON</div>
          <div style={{ ...card, background: C.surface2, border: `4px solid ${hi2 > 0.1 ? C.accent : C.line}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 26, boxShadow: hi2 > 0.1 ? `0 30px 90px -20px rgba(226,98,5,0.7)` : "none" }}>
            <div style={{ width: 130, height: 130, borderRadius: 65, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 0, height: 0, borderTop: "28px solid transparent", borderBottom: "28px solid transparent", borderLeft: `46px solid #0b0b0b`, marginLeft: 12 }} />
            </div>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 50, color: C.fg, textAlign: "center", lineHeight: 1.05 }}>ASIL<br />İÇERİĞİN</div>
          </div>
        </div>
      </div>
      {/* timeline bar */}
      <div style={{ position: "absolute", top: 1290, left: 120, right: 120, opacity: c2 }}>
        <div style={{ height: 14, borderRadius: 7, background: "rgba(255,255,255,0.08)", overflow: "hidden", display: "flex" }}>
          <div style={{ width: `${Math.min(bar, 0.22) * 100}%`, background: C.accent }} />
          <div style={{ width: `${Math.max(0, bar - 0.22) * 100}%`, background: C.fg }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, fontFamily: fonts.sans, fontSize: 28, color: C.muted }}>
          <span style={{ color: C.accent }}>izleyiciyi durdur</span><span>vaadini karşıla</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- CTA: Yorumlara KANCA yaz → 50+ kanca kütüphanesi ---------- */
const Cta: React.FC = () => {
  const t = useT();
  const at = T.cta;
  const chip = pr(t, at, 0.35);
  const typed = "KANCA".slice(0, Math.max(0, Math.min(5, Math.floor((t - wt(60)) / 0.07) + 1)));
  const bubble = pr(t, wt(59), 0.35);
  const lib = pr(t, T.lib - 0.1, 0.5);
  const sent = pr(t, wt(66), 0.3);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <Img src={staticFile(CL.c.last)} style={{ width: 1080, height: 1920, filter: "blur(14px)", transform: "scale(1.12)" }} />
      <AbsoluteFill style={{ background: "rgba(6,6,6,0.72)" }} />
      <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: chip, transform: `translateY(${(1 - chip) * -20}px) rotate(-3deg)` }}>
        <div style={{ padding: "14px 30px", borderRadius: 14, background: C.accent, fontFamily: fonts.display, fontWeight: 800, fontSize: 40, color: "#0b0b0b", letterSpacing: "0.03em" }}>50+ KANCA KÜTÜPHANESİ</div>
      </div>
      {/* comment bubble */}
      <div style={{ position: "absolute", top: 420, left: 110, right: 110, opacity: bubble, transform: `translateY(${(1 - bubble) * 40}px)` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "26px 30px", borderRadius: 34, background: "rgba(24,24,24,0.92)", border: `1.5px solid ${C.line}` }}>
          <div style={{ width: 76, height: 76, borderRadius: 38, background: "linear-gradient(135deg,#3a3a3a,#1c1c1c)" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 28, color: C.muted }}>sen · şimdi</div>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 56, color: C.fg, letterSpacing: "0.04em", minHeight: 64 }}>
              {typed}
              <span style={{ opacity: Math.floor(t * 3) % 2 ? 1 : 0, color: C.accent }}>|</span>
            </div>
          </div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 30, color: typed.length === 5 ? C.accent : "rgba(255,255,255,0.3)" }}>Paylaş</div>
        </div>
      </div>
      {/* library cover */}
      <div style={{ position: "absolute", top: 720, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: lib, transform: `translateY(${(1 - lib) * 120}px) rotate(${(1 - lib) * 6 + 2}deg)` }}>
        <div style={{ width: 470, height: 640, borderRadius: 26, padding: "40px 38px", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "radial-gradient(circle at 80% 15%, rgba(226,98,5,0.45), transparent 60%), #0b0b0b", border: `1.5px solid ${C.line}`, boxShadow: "0 50px 120px -30px rgba(0,0,0,0.9)" }}>
          <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 28, color: C.fg }}>FNGN <span style={{ color: C.muted, fontWeight: 500 }}>Dijital</span></div>
          <div>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 76, color: C.fg, lineHeight: 1 }}>50+ <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent, fontSize: 92 }}>Kanca</span></div>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: C.fg, lineHeight: 1.05 }}>Kütüphanesi</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[0.9, 0.75, 0.82, 0.6].map((w, i) => <div key={i} style={{ height: 12, width: `${w * 100}%`, borderRadius: 6, background: i === 0 ? C.accent : "rgba(255,255,255,0.14)" }} />)}
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", top: 1390, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: sent }}>
        <div style={{ padding: "14px 30px", borderRadius: 999, border: `2px solid ${C.accent}`, fontFamily: fonts.sans, fontWeight: 600, fontSize: 32, color: C.fg }}>DM'den ücretsiz gönderiyoruz</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- sound ---------- */
const SoundDesign: React.FC = () => {
  const vol = (f: number) => {
    const t = f / 30;
    return interpolate(t, [0, 0.3, 3.2, 3.6, 24.4, 25.4, T.outro - 0.3, T.outro + 0.2, END - 0.6, END], [0.0, 0.42, 0.42, 0.2, 0.2, 0.16, 0.16, 0.5, 0.5, 0], clamp);
  };
  const vol2 = (f: number) => {
    const t = f / 30 + 23.6;
    return interpolate(t, [23.6, 24.6, T.cta, T.cta + 0.4, T.outro - 0.3, T.outro], [0, 0.2, 0.2, 0.15, 0.15, 0], clamp);
  };
  return (
    <>
      {/* music: body 0–27s, a second pass of the body under the explainer/CTA, the track's final hit on the outro */}
      <Sequence durationInFrames={s(25.6)}>
        <Audio src={staticFile("music10.mp3")} volume={vol} />
      </Sequence>
      <Sequence from={s(23.6)} durationInFrames={s(T.outro - 23.6)}>
        <Audio src={staticFile("music10.mp3")} startFrom={s(6)} volume={vol2} />
      </Sequence>
      <Sequence from={s(T.outro - 0.25)}>
        <Audio src={staticFile("music10.mp3")} startFrom={s(31.75)} volume={(f) => interpolate(f / 30, [0, 0.1, END - T.outro - 0.4, END - T.outro + 0.25], [0, 0.55, 0.55, 0], clamp)} />
      </Sequence>
      {SEG.map(([a, b, at], i) => (
        <Sequence key={i} from={s(at)} durationInFrames={s(b - a)}>
          <Audio src={staticFile("vo10.mp3")} startFrom={s(a)} volume={1} />
        </Sequence>
      ))}
      <Sequence from={s(IMPACT - 0.02)}><Audio src={staticFile("sfx/boom.wav")} volume={0.75} /></Sequence>
      {[CL.a, CL.b, CL.c].map((c, i) => (
        <Sequence key={i} from={s(c.from + c.len - 0.18)}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.45} /></Sequence>
      ))}
      <Sequence from={s(T.explain)}><Audio src={staticFile("sfx/whoosh.wav")} volume={0.4} /></Sequence>
      {[wt(43), wt(48), wt(59), T.lib].map((x, i) => (
        <Sequence key={i} from={s(x - 0.05)}><Audio src={staticFile("sfx/pop.wav")} volume={0.45} /></Sequence>
      ))}
    </>
  );
};

const Window: React.FC<{ from: number; to: number; children: React.ReactNode; fadeIn?: number; fadeOut?: number }> = ({ from, to, children, fadeIn = 0.12, fadeOut = 0.2 }) => {
  const t = useT();
  if (t < from || t >= to) return null;
  const o = interpolate(t, [from, from + fadeIn, to - fadeOut, to], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};

const Flash: React.FC = () => {
  const t = useT();
  const o = interpolate(t, [IMPACT, IMPACT + 0.04, IMPACT + 0.22], [0, 0.55, 0], clamp);
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
};

export const Reel10Kanca: React.FC = () => {
  const t = useT();
  const capTop = t >= T.explain && t < T.cta ? 1430 : t >= T.cta ? 1500 : 1180;
  return (
    <AbsoluteFill style={{ backgroundColor: "#030303" }}>
      <Window from={0} to={CL.b.from} fadeIn={0.01} fadeOut={0.08}><HookBlock k="a" to={CL.b.from} title="Bu bir" /></Window>
      <Window from={CL.b.from} to={CL.c.from} fadeIn={0.01} fadeOut={0.08}><HookBlock k="b" to={CL.c.from} title="Bu da bir" /></Window>
      <Window from={CL.c.from} to={T.explain + 0.1} fadeIn={0.01}><HookBlock k="c" to={T.explain + 0.1} title="Bu da bir" /></Window>
      <Window from={T.explain} to={T.cta + 0.1} fadeIn={0.2}><Explainer /></Window>
      <Window from={T.cta} to={T.outro + 0.1} fadeIn={0.2}><Cta /></Window>
      <Window from={T.outro} to={END} fadeIn={0.3} fadeOut={0.01}>
        <AbsoluteFill style={{ background: C.bg }}>
          <Sequence from={s(T.outro)} layout="none"><Outro cta="Yorumlara “KANCA” yaz" /></Sequence>
        </AbsoluteFill>
      </Window>
      {t < T.outro && <Captions top={capTop} />}
      <Flash />
      <SoundDesign />
    </AbsoluteFill>
  );
};
