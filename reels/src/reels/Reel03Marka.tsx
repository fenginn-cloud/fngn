// Reel 03 — "Logonuz markanızın belki %10'u. İşte geri kalan %90."
// The example brand shown on screen is FNGN's own identity (palette, type, F-mark dot pattern).
// Word timings come from an ElevenLabs Scribe transcript of public/vo03_a.mp3.
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
} from "remotion";
import { Background, C, Chrome, FMark, HANDLE, fonts, prog, s } from "../brand";

/* ---------- Voice timing ---------- */
const W: [string, number, number][] = [
  ["Logonuz", 0.12, 0.62], ["markanızın", 0.82, 1.38], ["belki", 1.44, 1.8], ["%10'u.", 1.82, 2.4],
  ["İşte", 2.76, 2.98], ["geri", 3.1, 3.26], ["kalan", 3.34, 3.6], ["%90.", 3.66, 4.1],
  ["Bir:", 4.66, 4.88], ["Renk.", 5.3, 5.6],
  ["Bir", 6.02, 6.12], ["ana", 6.28, 6.42], ["renk", 6.48, 6.64], ["seçin,", 6.72, 7.04],
  ["bir", 7.32, 7.44], ["nötr,", 7.48, 7.78], ["bir", 8.0, 8.08], ["de", 8.12, 8.2], ["vurgu.", 8.28, 8.58],
  ["Sonra", 8.92, 9.12], ["gerçekten", 9.22, 9.78], ["bunlara", 9.82, 10.1], ["sadık", 10.2, 10.52], ["kalın.", 10.56, 10.82],
  ["İki:", 11.3, 11.54], ["Yazı", 11.94, 12.14], ["tipi.", 12.22, 12.46],
  ["Başlıklar", 12.84, 13.28], ["için", 13.34, 13.56], ["bir", 13.62, 13.74], ["font,", 13.78, 14.02],
  ["geri", 14.3, 14.44], ["kalan", 14.5, 14.78], ["her", 14.84, 14.96], ["şey", 15.04, 15.16], ["için", 15.2, 15.4], ["bir", 15.46, 15.56], ["tane.", 15.6, 15.86],
  ["Bu", 16.12, 16.16], ["kadar.", 16.22, 16.5],
  ["Üç:", 17.02, 17.2], ["Şekiller.", 17.62, 18.16],
  ["Logonuzdan", 18.5, 19.06], ["bir", 19.1, 19.22], ["parça", 19.26, 19.58], ["alın,", 19.64, 19.84],
  ["onu", 20.1, 20.22], ["bir", 20.26, 20.4], ["desene", 20.44, 20.76], ["dönüştürün.", 20.82, 21.32],
  ["Artık", 21.58, 21.86], ["her", 21.9, 22.04], ["şey", 22.14, 22.3], ["birbirine", 22.38, 22.8], ["ait", 22.88, 23.06], ["hissettirir.", 23.1, 23.68],
  ["Dört:", 24.22, 24.5], ["Fotoğraflar.", 24.84, 25.5],
  ["Aynı", 25.92, 26.14], ["ışık,", 26.22, 26.52], ["aynı", 26.8, 26.98], ["düzenleme,", 27.04, 27.56], ["her", 27.8, 27.94], ["seferinde.", 28.02, 28.52],
  ["İnsanlar", 28.86, 29.28], ["isminizi", 29.42, 29.82], ["görmeden", 29.92, 30.4], ["sizi", 30.48, 30.72], ["tanımalı.", 30.76, 31.18],
  ["Beş:", 31.7, 32.0], ["Ses.", 32.42, 32.74],
  ["Nasıl", 33.1, 33.34], ["konuştuğunuza", 33.42, 34.04], ["karar", 34.08, 34.34], ["verin", 34.4, 34.7], ["ve", 34.74, 34.8], ["bunu", 34.9, 35.1], ["yazın.", 35.14, 35.46],
  ["Samimi", 35.86, 36.24], ["mi?", 36.3, 36.4], ["Cesur", 36.7, 37.0], ["mu?", 37.08, 37.18], ["Esprili", 37.46, 37.86], ["mi?", 37.92, 38.0],
  ["Birini", 38.28, 38.54], ["seçin.", 38.6, 38.9],
  ["Altı:", 39.46, 39.72], ["Her", 40.08, 40.24], ["yerde", 40.3, 40.64], ["test", 40.68, 40.92], ["edin.", 40.98, 41.16],
  ["Kartvizitinizde.", 41.44, 42.32], ["Web", 42.58, 42.74], ["sitenizde.", 42.8, 43.34], ["Akışınızda.", 43.62, 44.24],
  ["Bunların", 44.56, 44.94], ["hepsi", 45.0, 45.28], ["uyuştuğunda,", 45.34, 46.02],
  ["insanlar", 46.42, 46.88], ["bir", 46.96, 47.06], ["logo", 47.1, 47.3], ["görmeyi", 47.38, 47.72], ["bırakır…", 47.78, 48.18],
  ["ve", 48.5, 48.58], ["bir", 48.64, 48.74], ["marka", 48.86, 49.16], ["görmeye", 49.24, 49.58], ["başlar.", 49.64, 50.08],
];
const NUMBER_WORDS = new Set(["Bir:", "İki:", "Üç:", "Dört:", "Beş:", "Altı:"]);

// Group words into caption lines: break after , . ? : …  (Samimi mi? Cesur mu? Esprili mi? stay together)
type Line = { words: { w: string; a: number }[]; a: number; b: number };
const LINES: Line[] = (() => {
  const out: Line[] = [];
  let cur: { w: string; a: number }[] = [];
  let a = 0;
  W.forEach(([w, ws, we], i) => {
    if (cur.length === 0) a = ws;
    cur.push({ w, a: ws });
    const brk = /[.,:…]$/.test(w) || (w === "mi?" && W[i + 1]?.[0] === "Birini");
    if (brk || i === W.length - 1) {
      out.push({ words: cur, a, b: we });
      cur = [];
    }
  });
  return out.filter((l) => !(l.words.length === 1 && NUMBER_WORDS.has(l.words[0].w)));
})();

/* ---------- Section timing (seconds) ---------- */
const SEC = [
  { n: "01", title: "Renk.", num: 4.66, head: 5.3 },
  { n: "02", title: "Yazı tipi.", num: 11.3, head: 11.94 },
  { n: "03", title: "Şekiller.", num: 17.02, head: 17.62 },
  { n: "04", title: "Fotoğraflar.", num: 24.22, head: 24.84 },
  { n: "05", title: "Ses.", num: 31.7, head: 32.42 },
  { n: "06", title: "Her yerde test et.", num: 39.46, head: 40.08 },
];
const FINALE = 44.5;
const OUTRO = 50.55;
const END = 55.5;
export const REEL03_FRAMES = s(END);

const NEUTRAL = "#EFE9E1";
const MAIN = "#141414";

/* ---------- Helpers ---------- */
const useT = () => useCurrentFrame() / 30;
/** spring that starts at absolute second `at`, measured inside a Sequence that started at `base` */
const useSp = (at: number, base: number, damping = 13, stiffness = 150) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - s(at - base), fps, config: { damping, stiffness } });
};
const P = (frame: number, at: number, base: number, dur = 14) => prog(frame, s(at - base), dur);

/* ---------- Bottom caption ---------- */
const Caption: React.FC = () => {
  const t = useT();
  const idx = LINES.findIndex((l, i) => t >= l.a - 0.05 && t < (LINES[i + 1]?.a ?? l.b + 0.7) && t < l.b + 0.9);
  if (idx < 0 || t > OUTRO) return null;
  const line = LINES[idx];
  const fadeOut = interpolate(t, [line.b + 0.6, line.b + 0.9], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 1440,
        left: 110,
        right: 110,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.26em",
        fontFamily: fonts.sans,
        fontWeight: 600,
        fontSize: 50,
        lineHeight: 1.25,
        textAlign: "center",
        opacity: fadeOut,
      }}
    >
      {line.words.map((w, i) => {
        const p = interpolate(t, [w.a - 0.05, w.a + 0.15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
        return (
          <span
            key={i}
            style={{
              color: interpolateColors(p, [0, 1], ["rgba(245,245,245,0.28)", C.fg]),
              transform: `translateY(${(1 - p) * 6}px)`,
              display: "inline-block",
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- Section header: big number -> small number + title ---------- */
const SectionHeader: React.FC<{ n: string; title: string; num: number; head: number }> = ({ n, title, num, head }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const inP = spring({ frame, fps, config: { damping: 14, stiffness: 120 } });
  const move = prog(frame, s(head - num) - 4, 16);
  const blur = interpolate(frame, [0, 10], [24, 0], { extrapolateRight: "clamp" });
  const scale = interpolate(move, [0, 1], [1, 0.24]) * interpolate(inP, [0, 1], [1.4, 1]);
  const y = interpolate(move, [0, 1], [860, 250]);
  const titleP = prog(frame, s(head - num), 14);
  const line = prog(frame, s(head - num) + 6, 14);
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: y,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.display,
          fontWeight: 800,
          fontSize: 380,
          lineHeight: 1,
          letterSpacing: "-0.05em",
          color: C.accent,
          transform: `scale(${scale})`,
          transformOrigin: "50% 0%",
          filter: `blur(${blur}px) drop-shadow(0 0 ${40 * (1 - move)}px rgba(226,98,5,0.6))`,
          opacity: inP,
        }}
      >
        {n}
      </div>
      <div
        style={{
          position: "absolute",
          top: 352,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: titleP,
          transform: `translateY(${(1 - titleP) * 24}px)`,
          fontFamily: fonts.display,
          fontWeight: 700,
          fontSize: n === "06" ? 74 : 96,
          letterSpacing: "-0.04em",
          color: C.fg,
        }}
      >
        {title}
      </div>
      <div
        style={{
          position: "absolute",
          top: n === "06" ? 456 : 470,
          left: 540 - 50 * line,
          width: 100 * line,
          height: 5,
          borderRadius: 3,
          background: C.accent,
        }}
      />
    </>
  );
};

/* ---------- Intro: logo, 10% -> 90%, the six pillars ---------- */
const PILLARS = ["Renk", "Yazı", "Şekil", "Fotoğraf", "Ses", "Uygulama"];
const Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT();
  const logo = useSp(0, 0, 14, 110);
  const logoUp = P(frame, 1.75, 0, 16);
  const big = P(frame, 1.82, 0, 12);
  const pct = Math.round(interpolate(t, [1.82, 2.2, 3.0, 3.95], [0, 10, 10, 90], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const toGrid = P(frame, 3.95, 0, 14);
  const segs = Array.from({ length: 10 }, (_, i) => i);
  return (
    <AbsoluteFill>
      {/* logo */}
      <div
        style={{
          position: "absolute",
          top: interpolate(logoUp, [0, 1], [720, 330]),
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 26,
          transform: `scale(${interpolate(logoUp, [0, 1], [1, 0.62]) * logo})`,
        }}
      >
        <div
          style={{
            width: 190,
            height: 190,
            borderRadius: 48,
            background: "#0c0c0c",
            border: `2px solid ${C.line}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 90px -30px rgba(226,98,5,0.6)",
          }}
        >
          <FMark size={170} />
        </div>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 150, color: C.fg, letterSpacing: "-0.04em" }}>FNGN</div>
      </div>
      {/* percentage + bar */}
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center", opacity: big * (1 - toGrid) }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 330,
            letterSpacing: "-0.06em",
            lineHeight: 1,
            color: pct > 10 ? C.accent : "rgba(245,245,245,0.16)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          %{pct}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 40 }}>
          {segs.map((i) => {
            const on = i * 10 < pct;
            return (
              <div
                key={i}
                style={{
                  width: 62,
                  height: 14,
                  borderRadius: 7,
                  background: !on ? "rgba(255,255,255,0.1)" : i === 0 ? C.fg : C.accent,
                }}
              />
            );
          })}
        </div>
      </div>
      {/* pillars grid */}
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 120,
          right: 120,
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 22,
          opacity: toGrid,
        }}
      >
        {PILLARS.map((p, i) => {
          const sp = spring({ frame: frame - s(3.95) - i * 2, fps: 30, config: { damping: 13, stiffness: 160 } });
          return (
            <div
              key={p}
              style={{
                height: 170,
                borderRadius: 28,
                border: `2px solid ${C.line}`,
                background: "rgba(255,255,255,0.03)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: 8,
                transform: `scale(${sp})`,
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: 30,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: C.fg,
              }}
            >
              <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 30, color: C.accent, letterSpacing: 0 }}>
                0{i + 1}
              </span>
              {p}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 01 Renk ---------- */
const LockIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={C.accent}>
    <path d="M7 10V7a5 5 0 0 1 10 0v3" fill="none" stroke={C.accent} strokeWidth={2.4} strokeLinecap="round" />
    <rect x="4" y="10" width="16" height="12" rx="3" />
  </svg>
);
const Colour: React.FC<{ base: number }> = ({ base }) => {
  const frame = useCurrentFrame();
  const sw = [
    { c: MAIN, w: 480, at: 6.28, lab: "%60 · Ana", hex: "#141414" },
    { c: NEUTRAL, w: 240, at: 7.48, lab: "%30 · Nötr", hex: "#EFE9E1" },
    { c: C.accent, w: 80, at: 8.28, lab: "%10 · Vurgu", hex: "#E26205" },
  ];
  const lock = useSp(10.2, base, 10, 170);
  const frameP = P(frame, 10.0, base, 14);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            gap: 12,
            padding: 18,
            borderRadius: 34,
            border: `4px solid rgba(226,98,5,${frameP})`,
            boxShadow: `0 0 ${60 * frameP}px rgba(226,98,5,${0.35 * frameP})`,
          }}
        >
          {sw.map((x, i) => {
            const sp = spring({ frame: frame - s(x.at - base), fps: 30, config: { damping: 14, stiffness: 140 } });
            return (
              <div key={i} style={{ width: x.w * sp, opacity: Math.min(1, sp * 2), overflow: "visible" }}>
                <div
                  style={{
                    height: 340,
                    borderRadius: 22,
                    background: x.c,
                    border: x.c === MAIN ? "2px solid rgba(255,255,255,0.14)" : "none",
                    boxShadow: "0 30px 60px -30px rgba(0,0,0,0.8)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 380,
                    marginLeft: 4,
                    fontFamily: fonts.sans,
                    fontSize: 24,
                    color: i === 2 ? C.accent : C.muted,
                    whiteSpace: "nowrap",
                    lineHeight: 1.35,
                  }}
                >
                  <b style={{ color: i === 2 ? C.accent : C.fg, fontWeight: 600 }}>{x.lab}</b>
                  <br />
                  {x.hex}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `translateY(${(1 - lock) * -80}px)`,
          opacity: lock,
        }}
      >
        <LockIcon size={110} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1270,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: fonts.sans,
          fontWeight: 600,
          fontSize: 26,
          letterSpacing: "0.3em",
          color: C.accent,
          opacity: P(frame, 10.4, base),
        }}
      >
        KİLİTLİ
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 02 Yazı tipi ---------- */
const Type: React.FC<{ base: number }> = ({ base }) => {
  const frame = useCurrentFrame();
  const chaosOut = P(frame, 12.7, base, 10);
  const chaos = [
    { f: "Georgia, serif", c: "#E2553D", x: -260, y: -120, w: 400, st: "normal" },
    { f: fonts.display, c: "#3B7BF0", x: 220, y: -140, w: 800, st: "normal" },
    { f: "Courier New, monospace", c: "#9a9a9a", x: -20, y: 10, w: 400, st: "normal" },
    { f: "Impact, sans-serif", c: "#F0C030", x: -250, y: 150, w: 400, st: "normal" },
    { f: fonts.serif, c: "#B44FE0", x: 230, y: 150, w: 400, st: "italic" },
  ];
  const head = useSp(12.84, base, 14, 140);
  const body = P(frame, 14.3, base, 16);
  const check = useSp(16.12, base, 10, 180);
  return (
    <AbsoluteFill>
      {chaos.map((c, i) => {
        const sp = spring({ frame: frame - s(11.94 - base) - i * 3, fps: 30, config: { damping: 12, stiffness: 150 } });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + c.x * (1 - chaosOut * 0.6) - 110,
              top: 860 + c.y * (1 - chaosOut * 0.6) - 80,
              width: 220,
              textAlign: "center",
              fontFamily: c.f,
              fontStyle: c.st,
              fontWeight: c.w,
              fontSize: 150,
              color: c.c,
              opacity: sp * (1 - chaosOut),
              transform: `scale(${sp}) rotate(${(i - 2) * 6}deg)`,
              filter: `blur(${chaosOut * 10}px)`,
            }}
          >
            Aa
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, textAlign: "center" }}>
        <div style={{ opacity: head, fontFamily: fonts.sans, fontSize: 22, letterSpacing: "0.22em", color: C.accent, fontWeight: 600 }}>
          BRICOLAGE GROTESQUE — BAŞLIKLAR
        </div>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 160,
            letterSpacing: "-0.05em",
            color: C.fg,
            transform: `scale(${head})`,
            lineHeight: 1.05,
            marginTop: 10,
          }}
        >
          Başlık
        </div>
        <div
          style={{
            opacity: body,
            transform: `translateY(${(1 - body) * 20}px)`,
            fontFamily: fonts.sans,
            fontSize: 38,
            lineHeight: 1.45,
            color: C.muted,
            maxWidth: 660,
            margin: "26px auto 0",
          }}
        >
          Gövde metni altında durur; sakin, okunaklı ve başlıkla asla yarışmaz.
        </div>
        <div style={{ opacity: body, marginTop: 22, fontFamily: fonts.sans, fontSize: 22, letterSpacing: "0.22em", color: C.muted }}>
          HANKEN GROTESK — GERİ KALAN HER ŞEY
        </div>
        <svg
          width={110}
          height={110}
          viewBox="0 0 24 24"
          style={{ marginTop: 34, transform: `scale(${check})`, opacity: check }}
          fill="none"
          stroke={C.accent}
          strokeWidth={2.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 12.5 9.5 18 20 6" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 03 Şekiller ---------- */
const PatternCell: React.FC<{ kind: number; size: number }> = ({ kind, size }) => {
  if (kind === 0) return <div style={{ width: size, height: size, borderRadius: "50%", background: C.accent }} />;
  if (kind === 1) return <div style={{ width: size, height: size, borderRadius: "50%", border: `${size * 0.16}px solid ${C.fg}` }} />;
  if (kind === 2) return <div style={{ width: size * 0.42, height: size * 0.42, borderRadius: "50%", background: C.fg }} />;
  return <div style={{ width: size * 0.9, height: size * 0.9, borderRadius: size * 0.24, border: `${size * 0.12}px solid ${C.accent}` }} />;
};
const Pattern: React.FC<{ cols: number; rows: number; size: number; gap: number; at?: number; base?: number; dim?: number }> = ({
  cols,
  rows,
  size,
  gap,
  at,
  base = 0,
  dim = 1,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, ${size}px)`, gap, opacity: dim }}>
      {Array.from({ length: cols * rows }, (_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        const d = r + c;
        const sp = at === undefined ? 1 : spring({ frame: frame - s(at - base) - d * 2, fps: 30, config: { damping: 12, stiffness: 160 } });
        return (
          <div key={i} style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${sp})` }}>
            <PatternCell kind={(r * 3 + c * 2) % 4} size={size} />
          </div>
        );
      })}
    </div>
  );
};
const MiniCard: React.FC<{ w: number }> = ({ w }) => (
  <div
    style={{
      width: w,
      height: w * 0.58,
      borderRadius: w * 0.05,
      background: NEUTRAL,
      position: "relative",
      overflow: "hidden",
      boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
      display: "flex",
      alignItems: "center",
      padding: w * 0.08,
      gap: w * 0.04,
    }}
  >
    <FMark size={w * 0.2} />
    <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: w * 0.12, color: MAIN, letterSpacing: "-0.03em" }}>FNGN</div>
    <div style={{ position: "absolute", right: -w * 0.06, bottom: -w * 0.06, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: w * 0.03 }}>
      {Array.from({ length: 9 }, (_, i) => (
        <div key={i} style={{ width: w * 0.07, height: w * 0.07, borderRadius: "50%", background: i % 2 ? C.accent : "transparent", border: i % 2 ? "none" : `${w * 0.012}px solid ${MAIN}` }} />
      ))}
    </div>
  </div>
);
const Shapes: React.FC<{ base: number }> = ({ base }) => {
  const frame = useCurrentFrame();
  const markIn = useSp(18.4, base, 14, 120);
  const dotPop = useSp(19.3, base, 10, 140);
  const toPattern = P(frame, 20.1, base, 12);
  const mock = (at: number) => spring({ frame: frame - s(at - base), fps: 30, config: { damping: 13, stiffness: 130 } });
  const m1 = mock(21.6);
  const m2 = mock(21.9);
  const m3 = mock(22.2);
  return (
    <AbsoluteFill>
      {/* F mark with the dot lifting out */}
      <div style={{ position: "absolute", top: 640, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: markIn * (1 - toPattern) }}>
        <div style={{ position: "relative", width: 420, height: 420, transform: `scale(${markIn})` }}>
          <svg width={420} height={420} viewBox="0 0 64 64">
            <path d="M22 15h23v8H31v7.5h12.5v8H31V49h-9V15Z" fill="rgba(226,98,5,0.25)" />
          </svg>
          <div
            style={{
              position: "absolute",
              left: (45.5 / 64) * 420 - 22,
              top: (45.5 / 64) * 420 - 22,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: C.accentHi,
              transform: `translate(${-120 * dotPop}px, ${-140 * dotPop}px) scale(${1 + dotPop * 3})`,
              boxShadow: `0 0 ${60 * dotPop}px rgba(255,122,26,0.8)`,
            }}
          />
        </div>
      </div>
      {/* pattern */}
      <div style={{ position: "absolute", top: 580, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: toPattern }}>
        <Pattern cols={7} rows={7} size={84} gap={26} at={20.1} base={base} dim={interpolate(m1, [0, 1], [1, 0.28])} />
      </div>
      {/* mockups */}
      <div style={{ position: "absolute", top: 820, left: 0, right: 0, height: 400 }}>
        <div style={{ position: "absolute", left: 90, top: 60, transform: `translateY(${(1 - m1) * 500}px) rotate(${-10 * m1}deg)`, opacity: m1 }}>
          <MiniCard w={400} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 520,
            top: 0,
            width: 200,
            height: 270,
            borderRadius: "18px 18px 30px 30px",
            background: C.accent,
            transform: `translateY(${(1 - m2) * 500}px) rotate(${4 * m2}deg)`,
            opacity: m2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
          }}
        >
          <div style={{ position: "absolute", top: -26, left: 10, right: 10, height: 34, borderRadius: 10, background: NEUTRAL }} />
          <div style={{ width: 80, height: 80, borderRadius: "50%", border: `14px solid ${NEUTRAL}` }} />
        </div>
        <div
          style={{
            position: "absolute",
            left: 750,
            top: 40,
            width: 250,
            height: 320,
            borderRadius: 26,
            background: MAIN,
            border: "2px solid rgba(255,255,255,0.12)",
            transform: `translateY(${(1 - m3) * 500}px) rotate(${12 * m3}deg)`,
            opacity: m3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 30px 60px -20px rgba(0,0,0,0.8)",
          }}
        >
          <FMark size={150} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 04 Fotoğraflar ---------- */
const WARM = ["#E07A3A", "#D96F33", "#E58A48"];
const Photo: React.FC<{ w: number; h: number; bg: string; sun: string; shade?: number }> = ({ w, h, bg, sun, shade = 0 }) => (
  <div style={{ width: w, height: h, borderRadius: w * 0.06, background: bg, position: "relative", overflow: "hidden", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.8)" }}>
    <div style={{ position: "absolute", left: w * 0.18, top: h * 0.14, width: w * 0.24, height: w * 0.24, borderRadius: "50%", background: sun }} />
    <div style={{ position: "absolute", left: w * 0.12, top: h * 0.52, width: w * 0.76, height: w * 0.76, borderRadius: "50%", background: "#2a1d18" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: h * 0.28, background: `rgba(20,12,8,${0.55 + shade})` }} />
  </div>
);
const Photos: React.FC<{ base: number }> = ({ base }) => {
  const frame = useCurrentFrame();
  const t = useT() + base;
  const inP = (i: number) => spring({ frame: frame - s(24.84 - base) - i * 3, fps: 30, config: { damping: 13, stiffness: 150 } });
  const wipe = interpolate(t, [25.92, 26.6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const edit = interpolate(t, [26.8, 27.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const grid = P(frame, 27.8, base, 14);
  const phone = P(frame, 28.86, base, 16);
  const raw = [
    { bg: "#3D6FD8", sun: "#F7D27A" },
    { bg: "#D63FA0", sun: "#FBE29A" },
    { bg: "#8A8A8A", sun: "#DADADA" },
  ];
  return (
    <AbsoluteFill>
      {/* three mismatched photos -> brush -> same grade */}
      <div style={{ position: "absolute", top: 760, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 26, opacity: 1 - grid }}>
        {raw.map((r, i) => {
          const local = interpolate(wipe, [i * 0.25, i * 0.25 + 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          const bg = interpolateColors(local, [0, 1], [r.bg, interpolateColors(edit, [0, 1], ["#C98A5E", WARM[i]])]);
          const sun = interpolateColors(local, [0, 1], [r.sun, "#FFD9A8"]);
          return (
            <div key={i} style={{ transform: `scale(${inP(i)}) translateY(${(1 - inP(i)) * 60}px)` }}>
              <Photo w={250} h={300} bg={bg} sun={sun} shade={(1 - edit) * 0.2} />
            </div>
          );
        })}
        {/* brush */}
        <div
          style={{
            position: "absolute",
            top: -60,
            left: interpolate(wipe, [0, 1], [60, 980]),
            width: 46,
            height: 440,
            borderRadius: 23,
            background: "linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.75), rgba(255,255,255,0.0))",
            transform: "rotate(18deg)",
            opacity: wipe > 0 && wipe < 1 ? 1 : 0,
            filter: "blur(2px)",
          }}
        />
      </div>
      {/* 3x3 grid -> phone */}
      <div
        style={{
          position: "absolute",
          top: interpolate(phone, [0, 1], [640, 600]),
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: grid,
        }}
      >
        <div
          style={{
            padding: interpolate(phone, [0, 1], [0, 26]),
            paddingTop: interpolate(phone, [0, 1], [0, 74]),
            borderRadius: 54,
            border: `${4 * phone}px solid rgba(255,255,255,${0.25 * phone})`,
            background: `rgba(10,10,10,${phone})`,
            position: "relative",
            transform: `scale(${interpolate(phone, [0, 1], [1, 0.82])})`,
          }}
        >
          <div style={{ position: "absolute", top: 24, left: 0, right: 0, textAlign: "center", fontFamily: fonts.sans, fontWeight: 600, fontSize: 26, color: C.fg, opacity: phone }}>
            {HANDLE}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 210px)", gap: 12 }}>
            {Array.from({ length: 9 }, (_, i) => {
              const sp = spring({ frame: frame - s(27.8 - base) - i, fps: 30, config: { damping: 14, stiffness: 170 } });
              return (
                <div key={i} style={{ transform: `scale(${sp})` }}>
                  <Photo w={210} h={250} bg={WARM[i % 3]} sun="#FFD9A8" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 05 Ses ---------- */
const Voice: React.FC<{ base: number }> = ({ base }) => {
  const frame = useCurrentFrame();
  const t = useT() + base;
  const doc = useSp(33.1, base, 14, 140);
  const docOut = P(frame, 35.7, base, 10);
  const lines = [0.92, 0.7, 0.85, 0.55, 0.78];
  const opts = [
    { w: "Samimi?", at: 35.86, f: fonts.serif, wt: 400, c: C.fg },
    { w: "Cesur?", at: 36.7, f: fonts.display, wt: 800, c: C.accent },
    { w: "Esprili?", at: 37.46, f: fonts.sans, wt: 500, c: C.muted },
  ];
  const pick = P(frame, 38.28, base, 16);
  const check = useSp(38.6, base, 10, 180);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 230,
          width: 620,
          height: 460,
          borderRadius: 26,
          background: NEUTRAL,
          padding: 40,
          transform: `scale(${doc}) rotate(${(1 - doc) * -6}deg)`,
          opacity: doc * (1 - docOut),
          boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)",
        }}
      >
        <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, color: MAIN, letterSpacing: "0.06em" }}>MARKA_SESİ.doc</div>
        {lines.map((l, i) => {
          const typed = interpolate(t, [33.5 + i * 0.35, 33.9 + i * 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
          return <div key={i} style={{ marginTop: i === 0 ? 40 : 26, height: 18, width: `${l * typed * 100}%`, borderRadius: 9, background: i === 0 ? C.accent : "rgba(20,20,20,0.25)" }} />;
        })}
      </div>
      <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {opts.map((o, i) => {
          const sp = spring({ frame: frame - s(o.at - base), fps: 30, config: { damping: 12, stiffness: 160 } });
          const chosen = i === 1;
          const vis = chosen ? 1 : 1 - pick;
          const h = chosen ? 1 : 1 - pick;
          return (
            <div
              key={i}
              style={{
                fontFamily: o.f,
                fontWeight: o.wt,
                fontSize: chosen ? 150 + pick * 40 : 130,
                lineHeight: 1.1,
                height: (chosen ? 170 + pick * 40 : 150) * h,
                color: o.c,
                opacity: sp * vis,
                transform: `scale(${sp}) translateY(${(1 - sp) * 40}px)`,
                letterSpacing: o.f === fonts.display ? "-0.04em" : "0",
                overflow: "visible",
              }}
            >
              {o.w}
            </div>
          );
        })}
        <svg width={120} height={120} viewBox="0 0 24 24" style={{ marginTop: 20, transform: `scale(${check})`, opacity: check }} fill="none" stroke={C.accent} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5 9.5 18 20 6" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 06 Test everywhere ---------- */
const Website: React.FC<{ w: number }> = ({ w }) => (
  <div style={{ width: w, borderRadius: 22, overflow: "hidden", border: "2px solid rgba(255,255,255,0.12)", background: "#0b0b0b", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)" }}>
    <div style={{ height: 44, background: "#1a1a1a", display: "flex", alignItems: "center", gap: 10, padding: "0 18px" }}>
      {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
        <div key={c} style={{ width: 13, height: 13, borderRadius: "50%", background: c }} />
      ))}
      <div style={{ marginLeft: 16, flex: 1, height: 24, borderRadius: 12, background: "#262626", fontFamily: fonts.sans, fontSize: 15, color: C.muted, display: "flex", alignItems: "center", paddingLeft: 14 }}>
        fngn.com.tr
      </div>
    </div>
    <div style={{ padding: "44px 40px 50px", textAlign: "left" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 34 }}>
        <FMark size={40} />
        <span style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 24, color: C.fg }}>FNGN</span>
      </div>
      <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 52, lineHeight: 1.05, letterSpacing: "-0.04em", color: C.fg }}>
        Fikirlerinizi <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>dijital deneyimlere</span> dönüştürüyoruz.
      </div>
      <div style={{ display: "inline-block", marginTop: 30, padding: "14px 30px", borderRadius: 999, background: C.accent, fontFamily: fonts.sans, fontWeight: 600, fontSize: 22, color: "#0b0b0b" }}>
        Teklif al
      </div>
    </div>
  </div>
);
const FeedTile: React.FC<{ i: number; size: number }> = ({ i, size }) => {
  const k = i % 6;
  const base: React.CSSProperties = { width: size, height: size, borderRadius: size * 0.06, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" };
  if (k === 0) return <div style={{ ...base, background: C.accent }}><FMark size={size * 0.6} dot={false} /></div>;
  if (k === 1) return <div style={{ ...base, background: MAIN, border: "1px solid rgba(255,255,255,0.1)", fontFamily: fonts.serif, fontSize: size * 0.32, color: C.accent }}>net.</div>;
  if (k === 2) return <div style={{ ...base, background: NEUTRAL }}><div style={{ width: size * 0.4, height: size * 0.4, borderRadius: "50%", background: C.accent }} /></div>;
  if (k === 3) return <Photo w={size} h={size} bg={WARM[0]} sun="#FFD9A8" />;
  if (k === 4) return <div style={{ ...base, background: NEUTRAL, fontFamily: fonts.display, fontWeight: 800, fontSize: size * 0.34, color: MAIN }}>Aa</div>;
  return <div style={{ ...base, background: MAIN, border: "1px solid rgba(255,255,255,0.1)" }}><div style={{ width: size * 0.36, height: size * 0.36, borderRadius: "50%", border: `${size * 0.06}px solid ${C.fg}` }} /></div>;
};
const Phone: React.FC<{ w: number; tiles?: number }> = ({ w, tiles = 9 }) => {
  const size = (w - 44 - 16) / 3;
  return (
    <div style={{ width: w, borderRadius: w * 0.12, border: "4px solid rgba(255,255,255,0.22)", background: "#0a0a0a", padding: "64px 22px 40px", position: "relative", boxShadow: "0 40px 80px -30px rgba(0,0,0,0.9)" }}>
      <div style={{ position: "absolute", top: 22, left: 0, right: 0, textAlign: "center", fontFamily: fonts.sans, fontWeight: 600, fontSize: w * 0.055, color: C.fg }}>{HANDLE}</div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(3, ${size}px)`, gap: 8 }}>
        {Array.from({ length: tiles }, (_, i) => (
          <FeedTile key={i} i={i} size={size} />
        ))}
      </div>
    </div>
  );
};
const Everywhere: React.FC<{ base: number }> = ({ base }) => {
  const frame = useCurrentFrame();
  const t = useT() + base;
  const slot = (a: number, b: number | null) => {
    const i = interpolate(t, [a - 0.1, a + 0.35], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    const o = b === null ? 0 : interpolate(t, [b - 0.25, b + 0.05], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return { i, o };
  };
  const card = slot(41.3, 42.5);
  const web = slot(42.5, 43.5);
  const feed = slot(43.5, null);
  const mv = (x: { i: number; o: number }): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "center",
    opacity: x.i * (1 - x.o),
    transform: `translateX(${(1 - x.i) * 700 - x.o * 700}px)`,
    filter: `blur(${(1 - x.i) * 18 + x.o * 18}px)`,
  });
  void frame;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 680, left: 0, right: 0, height: 700 }}>
        <div style={{ ...mv(card), top: 90 }}>
          <div style={{ transform: "rotate(-4deg)" }}>
            <MiniCard w={620} />
          </div>
        </div>
        <div style={mv(web)}>
          <Website w={800} />
        </div>
        <div style={{ ...mv(feed), top: -60 }}>
          <Phone w={500} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Finale bento ---------- */
const Tile: React.FC<{ children: React.ReactNode; bg?: string; at: number; base: number; i: number }> = ({ children, bg = "rgba(255,255,255,0.04)", at, base, i }) => {
  const frame = useCurrentFrame();
  const sp = spring({ frame: frame - s(at - base) - i * 2, fps: 30, config: { damping: 14, stiffness: 150 } });
  return (
    <div
      style={{
        width: 270,
        height: 270,
        borderRadius: 34,
        background: bg,
        border: `2px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        transform: `scale(${sp})`,
        opacity: sp,
      }}
    >
      {children}
    </div>
  );
};
const Finale: React.FC<{ base: number }> = ({ base }) => {
  const frame = useCurrentFrame();
  const t = useT() + base;
  const zoom = interpolate(t, [46.3, 46.9, 48.3, 48.85], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const ez = zoom * zoom * (3 - 2 * zoom);
  const brand = P(frame, 48.6, base, 16);
  const at = 44.56;
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: brand,
          transform: `translateY(${(1 - brand) * 30}px)`,
        }}
      >
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 70, color: C.fg, letterSpacing: "-0.03em" }}>…ve insanlar</div>
        <div style={{ fontFamily: fonts.serif, fontSize: 140, color: C.accent, lineHeight: 1 }}>bir marka görür.</div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          transform: `translateY(${brand * 60}px) scale(${1 + ez * 1.9})`,
          transformOrigin: "50% 427px",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 270px)", gap: 22 }}>
          <Tile at={at} base={base} i={0}>
            <div style={{ display: "flex", gap: 8, height: 150 }}>
              <div style={{ width: 96, borderRadius: 10, background: MAIN, border: "1px solid rgba(255,255,255,0.15)" }} />
              <div style={{ width: 48, borderRadius: 10, background: NEUTRAL }} />
              <div style={{ width: 18, borderRadius: 6, background: C.accent }} />
            </div>
          </Tile>
          <Tile at={at} base={base} i={1}>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 130, color: C.fg, letterSpacing: "-0.05em" }}>Aa</div>
          </Tile>
          <Tile at={at} base={base} i={2}>
            <Pattern cols={3} rows={3} size={52} gap={16} />
          </Tile>
          <Tile at={at} base={base} i={3}>
            <Photo w={200} h={200} bg={WARM[0]} sun="#FFD9A8" />
          </Tile>
          <Tile at={at} base={base} i={4} bg={C.accent}>
            <svg width={200} height={200} viewBox="0 0 64 64">
              <path d="M22 15h23v8H31v7.5h12.5v8H31V49h-9V15Z" fill="#0b0b0b" />
              <circle cx="45.5" cy="45.5" r="3.4" fill={NEUTRAL} />
            </svg>
          </Tile>
          <Tile at={at} base={base} i={5}>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 76, color: C.accent, letterSpacing: "-0.04em" }}>Cesur.</div>
          </Tile>
          <Tile at={at} base={base} i={6}>
            <div style={{ transform: "rotate(-6deg)" }}>
              <MiniCard w={210} />
            </div>
          </Tile>
          <Tile at={at} base={base} i={7}>
            <div style={{ transform: "scale(0.5)" }}>
              <Website w={460} />
            </div>
          </Tile>
          <Tile at={at} base={base} i={8}>
            <div style={{ transform: "scale(0.62)" }}>
              <Phone w={300} tiles={6} />
            </div>
          </Tile>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- Outro: follow card ---------- */
const FollowOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const h1 = prog(frame, 2, 16);
  const h2 = prog(frame, 8, 16);
  const btn = spring({ frame: frame - 16, fps, config: { damping: 13, stiffness: 150 } });
  const clickAt = 58;
  const cur = interpolate(frame, [26, clickAt - 2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: (x) => 1 - Math.pow(1 - x, 3) });
  const press = interpolate(frame, [clickAt - 2, clickAt, clickAt + 4], [1, 0.92, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const done = frame >= clickAt;
  const ring = interpolate(frame, [clickAt, clickAt + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const out = interpolate(frame, [s(END - OUTRO) - 14, s(END - OUTRO)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity: out }}>
      <div style={{ textAlign: "center", marginTop: -80 }}>
        <div style={{ opacity: h1, transform: `translateY(${(1 - h1) * 24}px)`, fontFamily: fonts.display, fontWeight: 700, fontSize: 112, color: C.fg, letterSpacing: "-0.04em" }}>
          Markalaşma,
        </div>
        <div style={{ opacity: h2, transform: `translateY(${(1 - h2) * 24}px)`, fontFamily: fonts.serif, fontSize: 132, color: C.accent, lineHeight: 1 }}>
          sade anlatımla.
        </div>
        <div style={{ position: "relative", display: "inline-block", marginTop: 70, transform: `scale(${btn * press})` }}>
          <div
            style={{
              padding: "30px 60px",
              borderRadius: 999,
              background: done ? "rgba(226,98,5,0.18)" : C.accent,
              border: `3px solid ${C.accent}`,
              fontFamily: fonts.sans,
              fontWeight: 700,
              fontSize: 40,
              letterSpacing: "0.04em",
              color: done ? C.accent : "#0b0b0b",
            }}
          >
            {done ? "Takip ediliyor ✓" : `${HANDLE} takip et`}
          </div>
          <div
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: 999,
              border: `3px solid ${C.accent}`,
              transform: `scale(${1 + ring * 0.25})`,
              opacity: done ? 1 - ring : 0,
            }}
          />
          {/* cursor */}
          <svg
            width={70}
            height={70}
            viewBox="0 0 24 24"
            style={{
              position: "absolute",
              left: interpolate(cur, [0, 1], [560, 300]),
              top: interpolate(cur, [0, 1], [320, 60]),
              opacity: cur > 0 ? 1 : 0,
              transform: `scale(${done && frame < clickAt + 4 ? 0.85 : 1})`,
              filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.6))",
            }}
          >
            <path d="M4 2l16 9-7 1.5L9.5 20 4 2Z" fill={C.fg} stroke="#0b0b0b" strokeWidth={1.2} strokeLinejoin="round" />
          </svg>
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
const MUSIC_OFFSET = 2.5; // the bed resolves at ~58s; start it 2.5s in so it ends with the video
const musicVolume = (f: number) => {
  const t = f / 30;
  return interpolate(
    t,
    [0, 0.05, 0.4, 13.0, 13.8, 48.3, 48.5, 50.3, 51.0, END - 1.6, END],
    [0, 0.5, 0.38, 0.38, 0.2, 0.2, 0.26, 0.26, 0.6, 0.6, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};
const SoundDesign: React.FC = () => {
  const pops = [6.28, 7.48, 8.28, 12.84, 18.5, 21.6, 21.9, 22.2, 24.84, 35.86, 36.7, 37.46, 41.44, 42.58, 43.62];
  return (
    <>
      <Audio src={staticFile("music03.mp3")} startFrom={s(MUSIC_OFFSET)} volume={musicVolume} />
      <Audio src={staticFile("vo03_a.mp3")} volume={1} />
      <Sfx at={0.05} src="boom" vol={0.55} />
      {SEC.map((x) => (
        <Sfx key={x.n} at={x.num - 0.12} src="whoosh" vol={0.3} />
      ))}
      {pops.map((t) => (
        <Sfx key={`p${t}`} at={t} src="pop" vol={0.22} />
      ))}
      <Sfx at={10.2} src="tick" vol={0.5} />
      <Sfx at={16.12} src="tick" vol={0.5} />
      <Sfx at={38.6} src="tick" vol={0.5} />
      <Sfx at={25.92} src="whoosh" vol={0.25} />
      <Sfx at={48.5} src="boom" vol={0.6} />
      <Sfx at={OUTRO + 58 / 30} src="tick" vol={0.8} />
    </>
  );
};

/* ---------- Composition ---------- */
const BODIES = [Colour, Type, Shapes, Photos, Voice, Everywhere];

const Fade: React.FC<{ dur: number; children: React.ReactNode }> = ({ dur, children }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 5, dur - 7, dur], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const b = interpolate(frame, [dur - 7, dur], [0, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: o, filter: `blur(${b}px)` }}>{children}</AbsoluteFill>;
};

export const Reel03Marka: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Background />
    <Sequence durationInFrames={s(SEC[0].num)}>
      <Fade dur={s(SEC[0].num)}>
        <Intro />
      </Fade>
    </Sequence>
    {SEC.map((sec, i) => {
      const from = sec.num;
      const to = SEC[i + 1]?.num ?? FINALE;
      const dur = s(to) - s(from);
      const Body = BODIES[i];
      return (
        <Sequence key={sec.n} from={s(from)} durationInFrames={dur}>
          <Fade dur={dur}>
            <SectionHeader {...sec} />
            <Body base={from} />
          </Fade>
        </Sequence>
      );
    })}
    <Sequence from={s(FINALE)} durationInFrames={s(OUTRO) - s(FINALE)}>
      <Fade dur={s(OUTRO) - s(FINALE)}>
        <Finale base={FINALE} />
      </Fade>
    </Sequence>
    <Sequence from={s(OUTRO)}>
      <FollowOutro />
    </Sequence>
    <Caption />
    <Chrome total={REEL03_FRAMES} />
    <SoundDesign />
  </AbsoluteFill>
);
