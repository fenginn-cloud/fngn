// Reel 05 — "Tavuk mu, yumurta mı?" (soğuk başlangıç problemi)
// Illustrated story reel. Word timings: ElevenLabs Scribe transcript of public/vo05_a.mp3.
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
import { C, Chrome, Outro, Background, fonts, s } from "../brand";
import {
  BULB, Book, Bubble, Bunting, Car, Chicken, Egg, INK, Label, LoopRing, Marquee, Mascot, PAPER, PAPER_D, Pedestal, Person, Placard, Spot, Ticket,
} from "./illus";

/* ---------- Voice timing ---------- */
const W: [string, number, number][] = [
  ["İşte", 0.12, 0.4], ["bir", 0.44, 0.52], ["paradoks.", 0.6, 1.18],
  ["Ürününüzü", 1.64, 2.16], ["satmak", 2.2, 2.54], ["için", 2.6, 2.84], ["müşteriye", 2.88, 3.32], ["ihtiyacınız", 3.36, 4.0], ["var.", 4.04, 4.22],
  ["Müşteri", 4.56, 4.9], ["bulmak", 4.94, 5.22], ["için", 5.26, 5.48], ["de…", 5.54, 6.0], ["ürüne.", 6.08, 6.38],
  ["Peki", 6.84, 7.14], ["hangisi", 7.42, 7.78], ["önce", 7.82, 8.04], ["gelir?", 8.1, 8.38],
  ["Birinci", 8.86, 9.22], ["delil:", 9.28, 9.58], ["bir", 9.94, 10.06], ["kitap.", 10.14, 10.48],
  ["Andrew", 10.94, 11.22], ["Chen,", 11.32, 11.56], ["2021.", 11.94, 12.6],
  ["Soğuk", 12.98, 13.22], ["Başlangıç", 13.26, 13.76], ["Problemi.", 13.86, 14.28],
  ["Kimse", 14.72, 15.04], ["boş", 15.14, 15.34], ["bir", 15.36, 15.48], ["partiye", 15.5, 15.84], ["katılmaz.", 15.92, 16.46],
  ["İçeride", 16.8, 17.26], ["sıfır", 17.3, 17.56], ["kişi", 17.64, 17.84], ["varsa…", 17.88, 18.3],
  ["girmek", 18.64, 18.92], ["için", 18.98, 19.18], ["de", 19.22, 19.4], ["sıfır", 19.44, 19.68], ["sebep", 19.76, 20.06], ["vardır.", 20.1, 20.48],
  ["İkinci", 20.98, 21.32], ["delil:", 21.36, 21.68], ["bir", 21.96, 22.1], ["hikâye.", 22.14, 22.66],
  ["2016.", 23.18, 23.76], ["Tesla,", 24.12, 24.62], ["Model", 24.66, 24.94], ["3'ü", 25.08, 25.16], ["tanıttı.", 25.22, 25.62],
  ["Henüz", 25.98, 26.28], ["satın", 26.32, 26.58], ["alınamayan", 26.64, 27.14], ["bir", 27.16, 27.24], ["arabayı.", 27.32, 27.68],
  ["Bir", 28.04, 28.12], ["hafta", 28.18, 28.46], ["içinde,", 28.52, 29.1], ["300.000'den", 29.18, 29.86], ["fazla", 29.9, 30.16], ["kişi", 30.22, 30.46], ["kapora", 30.5, 30.82], ["yatırdı.", 30.84, 31.24],
  ["Araba", 31.62, 31.9], ["almadılar.", 31.96, 32.46], ["Sırada", 32.8, 33.1], ["yer", 33.14, 33.26], ["aldılar.", 33.34, 33.74],
  ["Peki", 34.18, 34.64], ["henüz", 34.7, 35.0], ["var", 35.02, 35.22], ["olmayan", 35.28, 35.62], ["bir", 35.66, 35.76], ["şeyin", 35.8, 36.04], ["pazarlamasını", 36.06, 36.76], ["yapmalı", 36.78, 37.12], ["mısınız?", 37.16, 37.58],
  ["Evet…", 37.98, 38.28], ["dürüstseniz.", 38.6, 39.24],
  ["“Çok", 39.64, 39.82], ["yakında”", 39.88, 40.46], ["bir", 40.5, 40.6], ["sözdür.", 40.66, 41.14],
  ["Hazır", 41.46, 41.72], ["değilken", 41.78, 42.26], ["“şimdi", 42.58, 42.84], ["satışta”", 42.9, 43.3], ["demek…", 43.36, 43.68], ["yalandır.", 43.96, 44.48],
  ["Rahatsız", 44.94, 45.34], ["edici", 45.38, 45.62], ["gerçek", 45.68, 46.08], ["şu:", 46.18, 46.36],
  ["İlk", 46.74, 46.88], ["inşa", 46.96, 47.26], ["ettiğiniz", 47.32, 47.76], ["şey", 47.8, 48.12], ["ürün", 48.18, 48.4], ["değil.", 48.46, 48.76], ["Kitledir.", 49.08, 49.62],
  ["Ürün,", 50.04, 50.28], ["onlara", 50.56, 50.84], ["kalmak", 50.92, 51.26], ["için", 51.3, 51.54], ["bir", 51.56, 51.68], ["sebep", 51.72, 52.04], ["verir.", 52.08, 52.38],
  ["Yani", 52.72, 53.2], ["tavuk", 53.26, 53.54], ["mu,", 53.64, 53.86], ["yumurta", 53.9, 54.28], ["mı?", 54.34, 54.44],
  ["Yumurtadan", 54.8, 55.3], ["önce…", 55.36, 55.9], ["insanlarla", 55.98, 56.56], ["başlayın.", 56.62, 57.08],
];
const ACCENT = new Set(["paradoks.", "müşteriye", "ürüne.", "önce", "kitap.", "Problemi.", "boş", "sıfır", "hikâye.", "alınamayan", "kapora", "Sırada", "yer", "aldılar.", "dürüstseniz.", "sözdür.", "yalandır.", "Kitledir.", "sebep", "tavuk", "yumurta", "insanlarla"]);
type Line = { words: { w: string; a: number }[]; a: number; b: number };
const LINES: Line[] = (() => {
  const out: Line[] = [];
  let cur: { w: string; a: number }[] = [];
  let a = 0;
  W.forEach(([w, ws, we], i) => {
    if (cur.length === 0) a = ws;
    cur.push({ w, a: ws });
    if (/[.,:?…]$/.test(w) || i === W.length - 1) {
      out.push({ words: cur, a, b: we });
      cur = [];
    }
  });
  return out;
})();

/* ---------- Scene timing ---------- */
const T = {
  paradox: 0, ring: 1.6, needUsers: 2.88, needApp: 6.08, which: 6.84,
  exA: 8.8, book: 10.9, cold: 12.98,
  party: 14.6, zero: 16.8, door: 18.4, sad: 19.44,
  exB: 20.9, y2016: 23.18,
  car: 23.9, unveil: 24.12, notSale: 25.98,
  queue: 28.0, deposit: 30.5, noCar: 31.62, inLine: 32.8,
  market: 34.1, honest: 38.6,
  promise: 39.5, soonOk: 40.66, now: 42.5, lie: 43.96,
  truth: 44.85, l1: 46.74, l2: 49.08, l3: 50.04,
  fin: 52.6, people: 54.8,
  outro: 57.5, end: 61.3,
};
export const REEL05_FRAMES = s(T.end);
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const useT = () => useCurrentFrame() / 30;
/** spring that fires at absolute second `at` inside a scene that began at `base` */
const sp = (frame: number, at: number, base: number, damping = 13, stiffness = 150) =>
  spring({ frame: frame - s(at - base), fps: 30, config: { damping, stiffness } });
const pr = (t: number, a: number, b: number) => interpolate(t, [a, b], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });

/* ---------- Shared bits ---------- */
const Title: React.FC<{ a: string; b?: string; at: number; base: number; top?: number; size?: number }> = ({ a, b, at, base, top = 300, size = 100 }) => {
  const frame = useCurrentFrame();
  const p = sp(frame, at, base, 15, 130);
  return (
    <div style={{ position: "absolute", top, left: 60, right: 60, textAlign: "center", opacity: Math.min(1, p * 1.4), transform: `translateY(${(1 - p) * 30}px)` }}>
      <span style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: size, color: C.fg, letterSpacing: "-0.02em" }}>{a} </span>
      {b && <span style={{ fontFamily: fonts.serif, fontSize: size * 1.08, color: C.accent }}>{b}</span>}
    </div>
  );
};
const Room: React.FC<{ tone?: string; children?: React.ReactNode }> = ({ tone = "#15110f", children }) => (
  <AbsoluteFill style={{ background: `radial-gradient(900px 1100px at 50% 45%, ${tone}, #070606 75%)` }}>{children}</AbsoluteFill>
);
const Dust: React.FC<{ n?: number }> = ({ n = 26 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const x = (i * 173) % 1080;
        const y = (((i * 311) % 1600) + 200 - frame * (0.4 + (i % 5) * 0.12)) % 1700;
        return <div key={i} style={{ position: "absolute", left: x, top: (y + 1700) % 1700 + 100, width: 4, height: 4, borderRadius: 2, background: "rgba(255,230,190,0.25)" }} />;
      })}
    </>
  );
};

/* ---------- Caption ---------- */
const Caption: React.FC = () => {
  const t = useT();
  const idx = LINES.findIndex((l, i) => t >= l.a - 0.05 && t < (LINES[i + 1]?.a ?? l.b + 0.8) && t < l.b + 1.0);
  if (idx < 0 || t > T.outro) return null;
  const line = LINES[idx];
  const o = interpolate(t, [line.a - 0.05, line.a + 0.1, line.b + 0.7, line.b + 1.0], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 1480, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: o }}>
      <div
        style={{
          maxWidth: 900,
          padding: "16px 32px",
          borderRadius: 22,
          background: "rgba(12,10,9,0.78)",
          border: "1.5px solid rgba(255,255,255,0.08)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "baseline",
          gap: "0 0.26em",
          fontFamily: fonts.sans,
          fontWeight: 700,
          fontSize: 44,
          lineHeight: 1.3,
        }}
      >
        {line.words.map((w, i) => {
          const p = interpolate(t, [w.a - 0.05, w.a + 0.12], [0, 1], clamp);
          const acc = ACCENT.has(w.w);
          return (
            <span
              key={i}
              style={{
                color: interpolateColors(p, [0, 1], ["rgba(245,245,245,0.25)", acc ? C.accent : C.fg]),
                fontFamily: acc ? fonts.serif : fonts.sans,
                fontWeight: acc ? 400 : 700,
                fontSize: acc ? 50 : 44,
              }}
            >
              {w.w}
            </span>
          );
        })}
      </div>
    </div>
  );
};

/* ---------- 1. Paradox ---------- */
const Paradox: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT();
  const zoom = interpolate(t, [T.ring - 0.2, T.ring + 0.8], [2.6, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const lit = interpolate(t, [2.2, 4.0, 4.6, 6.4], [0, 0.5, 0.5, 1], clamp);
  const which = pr(t, T.which, T.which + 0.5);
  const chick = sp(frame, T.ring + 0.3, 0, 12, 140);
  const b1 = sp(frame, T.needUsers, 0, 10, 170);
  const b2 = sp(frame, T.needApp, 0, 10, 170);
  const bob = Math.sin(frame / 5) * 3;
  // on "hangisi önce?" chicken and egg hop around the ring
  const hop = interpolate(t, [T.which, T.which + 1.2], [0, Math.PI], clamp);
  const cx = 540 + Math.cos(Math.PI + hop) * 300;
  const cy = 980 + Math.sin(Math.PI + hop) * 130 - Math.abs(Math.sin(hop * 4)) * 30 * which;
  const ex = 540 + Math.cos(hop) * 300;
  const ey = 980 + Math.sin(hop) * 130 - Math.abs(Math.sin(hop * 4 + 1)) * 30 * which;
  const q = sp(frame, T.which + 0.6, 0, 10, 160);
  return (
    <Room tone="#1d1714">
      <Dust />
      <div style={{ position: "absolute", inset: 0, opacity: 1 - which }}>
        <Title a="İşte bir" b="paradoks." at={0.1} base={0} top={300} size={92} />
      </div>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "830px 980px" }}>
        <div style={{ position: "absolute", left: 540 - 380, top: 980 - 200 }}>
          <LoopRing w={760} h={400} lit={lit} spin={-frame / 18} />
        </div>
        {/* chicken */}
        <div style={{ position: "absolute", left: cx - 120, top: cy - 230, transform: `scale(${chick})`, transformOrigin: "50% 100%" }}>
          <Chicken size={240} bob={bob} />
          <div style={{ position: "absolute", left: 30, top: -110, transform: `scale(${b1})`, transformOrigin: "50% 100%" }}>
            <Bubble size={120} kind="people" />
          </div>
        </div>
        {/* egg */}
        <div style={{ position: "absolute", left: ex - 85, top: ey - 210 }}>
          <Egg size={170} />
          <div style={{ position: "absolute", left: 30, top: -120, transform: `scale(${b2})`, transformOrigin: "50% 100%" }}>
            <Bubble size={120} kind="box" />
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: "Georgia, serif",
          fontWeight: 700,
          fontSize: 200,
          color: C.accent,
          transform: `scale(${q}) rotate(${(1 - q) * 30}deg)`,
          opacity: q,
          textShadow: "0 0 40px rgba(226,98,5,0.6)",
        }}
      >
        ?
      </div>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", opacity: which, transform: `translateY(${(1 - which) * 30}px)` }}>
        <span style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 92, color: C.fg }}>Hangisi </span>
        <span style={{ fontFamily: fonts.serif, fontSize: 100, color: C.accent }}>önce?</span>
      </div>
    </Room>
  );
};

/* ---------- 2. Exhibit A: the book ---------- */
const Gallery: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "radial-gradient(900px 1200px at 50% 40%, #1b2124, #07090a 75%)" }}>
    <Spot x={540} top={0} w={900} h={1500} />
    {children}
  </AbsoluteFill>
);
const ExhibitA: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.exA;
  const base = T.exA;
  const plac = sp(frame, T.exA, base, 12, 120);
  const placUp = pr(t, T.book - 0.3, T.book + 0.4);
  const book = sp(frame, T.book, base, 14, 110);
  const float = Math.sin(frame / 14) * 8;
  return (
    <Gallery>
      <Dust n={18} />
      <div
        style={{
          position: "absolute",
          left: 540 - 260,
          top: interpolate(placUp, [0, 1], [640, 280]),
          transform: `translateY(${(1 - plac) * -700}px) rotate(${(1 - plac) * -20}deg) scale(${interpolate(placUp, [0, 1], [1, 0.7])})`,
          transformOrigin: "50% 0%",
        }}
      >
        <Placard title="DELİL A" sub="bir kitap" w={520} />
      </div>
      <div style={{ position: "absolute", left: 540 - 140, top: 720 + float, opacity: book, transform: `scale(${0.8 + book * 0.2})` }}>
        <Book w={280} />
      </div>
      <div style={{ position: "absolute", left: 540 - 150, top: 1070, opacity: book }}>
        <Pedestal w={300} h={420} tone="#55606a" />
      </div>
      <div style={{ position: "absolute", left: 540 - 260, top: 1040, transform: `scale(${book})` }}>
        <Label top="bir kitap, 2021" main="Andrew Chen" w={520} />
      </div>
      <Title a="Soğuk başlangıç" b="problemi." at={T.cold} base={base} top={500} size={70} />
    </Gallery>
  );
};

/* ---------- 3. The empty party ---------- */
const Party: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.party;
  const base = T.party;
  const zero = sp(frame, T.zero, base, 10, 180);
  const sad = t > T.sad;
  const blink = frame % 70 < 4 ? 1 : 0;
  // passers-by at the window: walk in, glance, walk away
  const walker = (i: number) => {
    const a = 14.8 + i * 0.35;
    const x = interpolate(t, [a, a + 0.8, a + 1.4, a + 2.2], [-140, 140 + i * 110, 140 + i * 110, 700], clamp);
    return x;
  };
  // the guest at the door
  const doorOpen = interpolate(t, [T.door, T.door + 0.4, T.sad + 0.5, T.sad + 0.9], [0, 1, 1, 0], clamp);
  const ball = frame / 8;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #241a22 0%, #1a1418 60%, #120d0c 60%, #0b0807 100%)" }}>
      {/* wall stripes */}
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ position: "absolute", left: i * 92, top: 0, width: 46, height: 1150, background: "rgba(255,255,255,0.025)" }} />
      ))}
      {/* disco ball */}
      <div style={{ position: "absolute", left: 540 - 2, top: 0, width: 4, height: 300, background: "rgba(255,255,255,0.25)" }} />
      <div style={{ position: "absolute", left: 540 - 70, top: 290, width: 140, height: 140, borderRadius: "50%", overflow: "hidden", background: "#888", boxShadow: "0 0 60px rgba(255,220,180,0.25)" }}>
        {Array.from({ length: 49 }, (_, i) => (
          <div key={i} style={{ position: "absolute", left: (i % 7) * 20, top: Math.floor(i / 7) * 20, width: 18, height: 18, background: (i + Math.floor(ball)) % 5 === 0 ? "#fff" : i % 2 ? "#9a9a9a" : "#6a6a6a" }} />
        ))}
      </div>
      <Bunting w={1080} n={13} sag={50} y={400} />
      {/* window */}
      <div style={{ position: "absolute", left: 70, top: 640, width: 470, height: 440, borderRadius: 12, border: "10px solid #3b2d33", background: "linear-gradient(180deg, #2c3a48, #1a222b)", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 225, top: 0, width: 10, height: "100%", background: "#3b2d33" }} />
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", left: walker(i), top: 220 }}>
            <Person w={90} i={i + 2} />
          </div>
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(255,255,255,0.08), transparent 40%)" }} />
      </div>
      {/* INSIDE sign */}
      <div
        style={{
          position: "absolute",
          left: 620,
          top: 600,
          width: 360,
          padding: "18px 0 10px",
          borderRadius: 14,
          background: "#0d0b0b",
          border: "4px solid #8a7356",
          textAlign: "center",
          boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8)",
        }}
      >
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 46, color: PAPER, letterSpacing: "0.14em" }}>İÇERİDE</div>
        <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 150, lineHeight: 1.05, color: C.accent, transform: `scale(${zero})`, textShadow: "0 0 30px rgba(226,98,5,0.7)" }}>0</div>
      </div>
      {/* door */}
      <div style={{ position: "absolute", left: 650, top: 860, width: 300, height: 300, background: "#0a0808", borderRadius: "8px 8px 0 0", overflow: "hidden" }}>
        <div style={{ position: "absolute", left: 60, top: 40, transform: `translateX(${(1 - doorOpen) * 200}px)`, opacity: doorOpen }}>
          <Person w={150} i={4} />
        </div>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, #9a6a62, #7b524c)",
            transformOrigin: "100% 50%",
            transform: `perspective(800px) rotateY(${doorOpen * 70}deg)`,
            borderRadius: "8px 8px 0 0",
            boxShadow: "inset 0 0 0 10px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ position: "absolute", left: 40, top: 40, right: 40, height: 100, border: "6px solid rgba(0,0,0,0.15)", borderRadius: 6 }} />
          <div style={{ position: "absolute", left: 30, top: 160, width: 18, height: 18, borderRadius: "50%", background: "#d9b56f" }} />
        </div>
      </div>
      {/* balloons */}
      {[
        [40, 980, "#E9A3B0"], [110, 1020, "#F2D37A"], [60, 1080, C.accent],
      ].map(([x, y, c], i) => (
        <div key={i} style={{ position: "absolute", left: x as number, top: (y as number) + Math.sin(frame / 15 + i) * 8 }}>
          <div style={{ width: 120, height: 140, borderRadius: "50%", background: c as string, boxShadow: "inset -14px -18px 0 rgba(0,0,0,0.12)" }} />
          <div style={{ marginLeft: 58, width: 2, height: 180, background: "rgba(255,255,255,0.3)" }} />
        </div>
      ))}
      {/* table + cake */}
      <div style={{ position: "absolute", left: 200, top: 1250, width: 300, height: 20, borderRadius: 6, background: PAPER_D }} />
      <div style={{ position: "absolute", left: 230, top: 1270, width: 12, height: 110, background: "#7a6a58" }} />
      <div style={{ position: "absolute", left: 458, top: 1270, width: 12, height: 110, background: "#7a6a58" }} />
      <div style={{ position: "absolute", left: 290, top: 1196, width: 120, height: 56, borderRadius: "10px 10px 4px 4px", background: PAPER, borderTop: `14px solid ${C.accent}` }} />
      <div style={{ position: "absolute", left: 346, top: 1160, width: 8, height: 36, background: BULB, borderRadius: 3, boxShadow: "0 -8px 20px rgba(255,200,120,0.9)" }} />
      {/* mascot */}
      <div style={{ position: "absolute", left: 470, top: 1060, transform: `rotate(${sad ? 0 : Math.sin(frame / 6) * 4}deg)` }}>
        <Mascot size={230} mood={sad ? "sad" : "happy"} blink={blink} squash={sad ? 0 : (Math.sin(frame / 3) + 1) / 2} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4. Exhibit B + 2016 ---------- */
const ExhibitB: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.exB;
  const base = T.exB;
  const plac = sp(frame, T.exB, base, 12, 120);
  const year = sp(frame, T.y2016, base, 14, 110);
  const placOut = pr(t, T.y2016 - 0.3, T.y2016 + 0.3);
  return (
    <Stage>
      <div style={{ position: "absolute", left: 540 - 260, top: 600, opacity: 1 - placOut, transform: `translateY(${(1 - plac) * -700 - placOut * 200}px) rotate(${(1 - plac) * 20}deg)` }}>
        <Placard title="DELİL B" sub="bir hikâye" w={520} rot={3} />
      </div>
      <Year2016 p={year} />
    </Stage>
  );
};
const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(900px 1200px at 50% 35%, #1f1a24, #08070a 75%)" }}>
      <div style={{ position: "absolute", left: 120, top: -100, transform: `rotate(${18 + Math.sin(frame / 30) * 4}deg)`, transformOrigin: "50% 0%" }}>
        <Spot x={0} top={0} w={500} h={1400} o={0.8} />
      </div>
      <div style={{ position: "absolute", left: 960, top: -100, transform: `rotate(${-18 - Math.sin(frame / 30) * 4}deg)`, transformOrigin: "50% 0%" }}>
        <Spot x={0} top={0} w={500} h={1400} o={0.8} />
      </div>
      {children}
    </AbsoluteFill>
  );
};
const Year2016: React.FC<{ p: number; top?: number }> = ({ p, top = 320 }) => (
  <div style={{ position: "absolute", top, left: 0, right: 0, textAlign: "center", opacity: p, transform: `scale(${0.8 + p * 0.2})` }}>
    <div style={{ display: "flex", justifyContent: "center", gap: 18, marginBottom: 6 }}>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: BULB, opacity: 0.8 }} />)}
    </div>
    <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 230, lineHeight: 1, color: "transparent", WebkitTextStroke: `4px ${BULB}`, textShadow: "0 0 40px rgba(255,200,120,0.35)" }}>2016</div>
    <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 6 }}>
      {Array.from({ length: 22 }, (_, i) => <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: BULB, opacity: 0.8 }} />)}
    </div>
  </div>
);

/* ---------- 5. The car ---------- */
const CarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.car;
  const base = T.car;
  const cover = 1 - pr(t, T.unveil + 0.1, T.unveil + 0.9);
  const tag = sp(frame, T.notSale, base, 8, 120);
  const swing = Math.sin(frame / 7) * 6 * (1 - Math.min(1, (frame - s(T.notSale - base)) / 60));
  return (
    <Stage>
      <Year2016 p={1} top={260} />
      {/* turntable */}
      <div style={{ position: "absolute", left: 540 - 440, top: 1010, width: 880, height: 120, borderRadius: "50%", background: "radial-gradient(#2b2730, #141217)", border: `3px solid rgba(226,98,5,${0.3 + (1 - cover) * 0.6})`, boxShadow: `0 0 ${60 * (1 - cover)}px rgba(226,98,5,0.35)` }} />
      <div style={{ position: "absolute", left: 540 - 420, top: 770 }}>
        <Car w={840} cover={cover} glow={1 - cover} />
      </div>
      {/* cloth flying off */}
      <div style={{ position: "absolute", left: 540 - 420, top: 770, transform: `translate(${(1 - cover) * 500}px, ${(1 - cover) * -600}px) rotate(${(1 - cover) * 40}deg)`, opacity: cover > 0.02 && cover < 0.98 ? cover : 0 }}>
        <Car w={840} cover={1} />
      </div>
      {/* NOT FOR SALE tag */}
      <div style={{ position: "absolute", left: 600, top: 640, transformOrigin: "50% 0%", transform: `rotate(${-6 + swing}deg) scale(${tag})`, opacity: Math.min(1, tag * 2) }}>
        <div style={{ margin: "0 auto", width: 3, height: 70, background: "rgba(255,255,255,0.5)" }} />
        <div style={{ width: 360, padding: "18px 20px", background: PAPER, borderRadius: 8, textAlign: "center", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8)" }}>
          <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 40, color: INK }}>SATIŞTA DEĞİL</div>
          <div style={{ fontFamily: fonts.serif, fontSize: 36, color: C.accent }}>henüz</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 540 - 270, top: 1180, opacity: pr(t, T.unveil, T.unveil + 0.4) }}>
        <Label top="bir hikâye, 2016" main="Model 3 tanıtımı" w={540} />
      </div>
    </Stage>
  );
};

/* ---------- 6. The queue ---------- */
const Queue: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.queue;
  const base = T.queue;
  const day = Math.max(1, Math.min(7, Math.floor(interpolate(t, [T.queue, T.deposit + 0.4], [1, 7.99], clamp))));
  const rows = interpolate(t, [T.queue, T.deposit], [1, 9], clamp);
  const count = Math.round(interpolate(t, [T.queue, T.deposit + 0.3], [0, 300000], { ...clamp, easing: Easing.in(Easing.quad) }));
  const zoomIn = pr(t, T.noCar - 0.1, T.noCar + 0.6);
  const ghost = sp(frame, T.noCar, base, 12, 120);
  const ticket = sp(frame, T.inLine, base, 9, 170);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(1000px 1300px at 50% 30%, #1d1a22, #08070a 75%)" }}>
      <div style={{ position: "absolute", inset: 0, transform: `scale(${1 + zoomIn * 0.35}) translateY(${zoomIn * 120}px)`, transformOrigin: "50% 40%" }}>
        {/* building */}
        <div style={{ position: "absolute", left: 540 - 260, top: 420, width: 520, height: 420, background: "linear-gradient(180deg, #5a5560, #3f3b45)", borderRadius: "10px 10px 0 0" }}>
          <div style={{ position: "absolute", left: 40, right: 40, top: 30 }}>
            <Marquee text="ÇOK YAKINDA" w={440} frame={frame} size={44} />
          </div>
          <div style={{ position: "absolute", left: 160, top: 180, width: 200, height: 240, background: "#8a6a3a", border: "8px solid #6b5230", borderBottom: "none" }}>
            <div style={{ position: "absolute", left: 92, top: 0, width: 4, height: "100%", background: "#6b5230" }} />
          </div>
        </div>
        {/* day tag */}
        <div style={{ position: "absolute", left: 540 - 80, top: 330, width: 160, borderRadius: 12, overflow: "hidden", textAlign: "center", boxShadow: "0 10px 30px -10px rgba(0,0,0,0.8)" }}>
          <div style={{ height: 16, background: C.accent }} />
          <div style={{ background: PAPER, fontFamily: fonts.display, fontWeight: 800, fontSize: 40, color: INK, padding: "4px 0 8px" }}>{day}. gün</div>
        </div>
        {/* crowd pyramid */}
        {Array.from({ length: 9 }, (_, r) => {
          const vis = interpolate(rows, [r, r + 1], [0, 1], clamp);
          const n = 5 + r * 2;
          const w = 46 + r * 6;
          return (
            <div key={r} style={{ position: "absolute", top: 780 + r * 78, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 2, opacity: vis, transform: `translateY(${(1 - vis) * 30}px)` }}>
              {Array.from({ length: n }, (_, i) => (
                <Person key={i} w={w} i={r * 7 + i} back />
              ))}
            </div>
          );
        })}
      </div>
      {/* counter */}
      <div style={{ position: "absolute", top: 1290, left: 0, right: 0, textAlign: "center", opacity: 1 - zoomIn }}>
        <div style={{ display: "inline-block", padding: "14px 36px", borderRadius: 18, background: "rgba(10,9,8,0.85)", border: `2px solid ${C.accent}` }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 74, color: C.accent, fontVariantNumeric: "tabular-nums" }}>{count.toLocaleString("tr-TR")}+</span>
          <span style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 34, color: C.fg }}> kapora</span>
        </div>
      </div>
      {/* ghost car (they didn't buy a car) */}
      <div style={{ position: "absolute", left: 540 - 230, top: 170, opacity: ghost * (1 - pr(t, T.inLine, T.inLine + 0.3)), transform: `scale(${ghost})` }}>
        <svg width={460} height={200} viewBox="0 0 500 210">
          <path d="M30 150 C 30 120, 60 112, 110 106 L 170 60 C 190 46, 240 42, 300 46 C 350 50, 380 70, 410 100 L 450 108 C 476 114, 482 130, 480 150 Z" fill="none" stroke={C.accent} strokeWidth={5} strokeDasharray="14 10" />
          <circle cx={120} cy={152} r={34} fill="none" stroke={C.accent} strokeWidth={5} strokeDasharray="10 8" />
          <circle cx={390} cy={152} r={34} fill="none" stroke={C.accent} strokeWidth={5} strokeDasharray="10 8" />
        </svg>
      </div>
      {/* reserved ticket */}
      <div style={{ position: "absolute", left: 540 - 300, top: 700, transform: `scale(${interpolate(ticket, [0, 1], [2.2, 1])}) rotate(-6deg)`, opacity: Math.min(1, ticket * 2) }}>
        <Ticket w={600} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 7–8. Pedestal: market something that doesn't exist / promise vs lie ---------- */
const Rain: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: 60 }, (_, i) => {
        const x = (i * 97) % 1080;
        const y = ((i * 211 + frame * 28) % 1900) - 100;
        return <div key={i} style={{ position: "absolute", left: x, top: y, width: 2, height: 40, background: "rgba(200,210,230,0.14)", transform: "rotate(8deg)" }} />;
      })}
    </>
  );
};
const PedestalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.market;
  const base = T.market;
  const inP = sp(frame, T.market, base, 14, 100);
  const honest = pr(t, T.honest, T.honest + 0.8);
  const promise = pr(t, T.promise, T.promise + 0.6);
  const soonOk = sp(frame, T.soonOk, base, 9, 170);
  const neonOn = t > T.now ? (Math.floor(frame / 3) % 5 === 0 && t < T.now + 0.6 ? 0.2 : 1) : 0;
  const neon = sp(frame, T.now, base, 12, 150);
  const lie = sp(frame, T.lie, base, 8, 200);
  const glow = 0.5 + Math.sin(frame / 8) * 0.2;
  return (
    <AbsoluteFill style={{ background: "linear-gradient(180deg, #1a1416, #0a0808)" }}>
      {/* brick wall */}
      {Array.from({ length: 30 }, (_, r) => (
        <div key={r} style={{ position: "absolute", top: r * 64, left: r % 2 ? -60 : 0, display: "flex", gap: 6, opacity: 0.18 }}>
          {Array.from({ length: 10 }, (_, i) => <div key={i} style={{ width: 120, height: 58, background: "#4a2a26", borderRadius: 3 }} />)}
        </div>
      ))}
      <Rain />
      {/* shop window frame */}
      <div style={{ position: "absolute", left: 90, top: 330, width: 900, height: 1100, border: "14px solid #3a2f2f", borderRadius: 12, background: `radial-gradient(600px 800px at 50% 40%, rgba(120,80,40,${0.15 + promise * 0.35}), rgba(20,14,12,0.9))`, boxShadow: "inset 0 0 120px rgba(0,0,0,0.7)" }}>
        {/* string lights */}
        <svg width={872} height={120} style={{ position: "absolute", top: 20, left: 0 }}>
          <path d="M20 20 Q 436 110 852 20" stroke="rgba(255,255,255,0.25)" strokeWidth={2} fill="none" />
          {Array.from({ length: 16 }, (_, i) => {
            const tt = (i + 0.5) / 16;
            const x = 20 + tt * 832;
            const y = 20 + 2 * (1 - tt) * tt * 90 * 2 * 0.5 * 2;
            return <circle key={i} cx={x} cy={y + 8} r={7} fill={BULB} opacity={0.4 + promise * 0.6} style={{ filter: "drop-shadow(0 0 6px rgba(255,210,140,0.9))" }} />;
          })}
        </svg>
      </div>
      <Title a="Henüz" b="var olmayan bir şey?" at={T.market + 0.1} base={base} top={225} size={62} />
      {/* marquee (promise) */}
      <div style={{ position: "absolute", left: 540 - 300, top: 470, opacity: promise, transform: `translateY(${(1 - promise) * -60}px)` }}>
        <Marquee text="ÇOK YAKINDA" w={600} frame={frame} size={62} />
        <div style={{ position: "absolute", right: -30, top: -30, width: 76, height: 76, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${soonOk})`, boxShadow: "0 0 30px rgba(226,98,5,0.8)" }}>
          <svg width={44} height={44} viewBox="0 0 24 24" fill="none" stroke="#0b0b0b" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6" /></svg>
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 150, textAlign: "center", fontFamily: fonts.serif, fontSize: 64, color: C.accent, opacity: soonOk }}>= söz</div>
      </div>
      {/* the not-yet-existing product: dashed box */}
      <div style={{ position: "absolute", left: 540 - 150, top: 760, width: 300, height: 300, transform: `scale(${inP})` }}>
        <div style={{ position: "absolute", inset: 0, border: `6px dashed ${C.accent}`, borderRadius: 30, background: `rgba(226,98,5,${0.06 + glow * 0.06})`, boxShadow: `0 0 ${40 * glow}px rgba(226,98,5,0.35)` }} />
        <div style={{ position: "absolute", left: 6, right: 6, bottom: 6, height: `${honest * 38}%`, borderRadius: "0 0 24px 24px", background: C.accent, boxShadow: "0 0 40px rgba(226,98,5,0.7)" }}>
          {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: 20, right: 20, top: 18 + i * 22, height: 6, borderRadius: 3, background: "rgba(0,0,0,0.18)" }} />)}
        </div>
      </div>
      <div style={{ position: "absolute", left: 540 - 180, top: 1060 }}>
        <Pedestal w={360} h={360} tone="#6f6a76" />
      </div>
      {/* neon "ŞİMDİ SATIŞTA" */}
      <div style={{ position: "absolute", left: 540 - 380, top: 1130, width: 760, textAlign: "center", transform: `scale(${neon})`, opacity: Math.min(1, neon * 2) }}>
        <div
          style={{
            display: "inline-block",
            padding: "16px 40px",
            border: `5px solid rgba(255,70,90,${0.3 + neonOn * 0.7})`,
            borderRadius: 18,
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 74,
            letterSpacing: "0.04em",
            color: neonOn ? "#FF6A7E" : "#5a2a30",
            textShadow: neonOn ? "0 0 18px #ff3355, 0 0 40px #ff3355" : "none",
            boxShadow: neonOn ? "0 0 40px rgba(255,51,85,0.6), inset 0 0 30px rgba(255,51,85,0.3)" : "none",
            background: "rgba(20,8,10,0.7)",
            position: "relative",
          }}
        >
          ŞİMDİ SATIŞTA
          <div style={{ position: "absolute", left: -20, right: -20, top: "50%", height: 12, background: PAPER, borderRadius: 6, transform: `rotate(-6deg) scaleX(${lie})`, transformOrigin: "0 50%", boxShadow: "0 4px 12px rgba(0,0,0,0.6)" }} />
        </div>
        <div style={{ marginTop: 18, fontFamily: fonts.serif, fontSize: 70, color: "#FF6A7E", opacity: lie, transform: `scale(${lie})` }}>= yalan</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 9. The uncomfortable truth ---------- */
const Truth: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.truth;
  const base = T.truth;
  const card = sp(frame, T.truth, base, 14, 110);
  const shells = sp(frame, T.truth + 0.3, base, 12, 120) * (1 - pr(t, T.l1 - 0.3, T.l1));
  const line = (a: number) => pr(t, a, a + 0.5);
  const flame = Math.sin(frame / 3) * 3;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(900px 1100px at 50% 35%, #2a201a, #0b0807 75%)" }}>
      {/* desk */}
      <div style={{ position: "absolute", left: 0, right: 0, top: 1240, bottom: 0, background: "linear-gradient(180deg, #4a3526, #2a1d15)" }} />
      <div style={{ position: "absolute", left: 70, top: 1080, transform: "scale(0.7)", transformOrigin: "0 100%" }}>
        <Egg size={160} crack={1} face />
      </div>
      <div style={{ position: "absolute", left: 300, top: 1200, transform: "rotate(-6deg) scale(0.55)", transformOrigin: "0 0" }}>
        <Ticket w={520} />
      </div>
      {/* candle */}
      <div style={{ position: "absolute", left: 930, top: 1150, width: 40, height: 120, background: PAPER, borderRadius: 6 }} />
      <div style={{ position: "absolute", left: 938, top: 1100 + flame, width: 24, height: 44, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", background: "radial-gradient(#fff6c8, #ffb347 60%, rgba(255,120,40,0))", boxShadow: "0 0 50px rgba(255,170,80,0.8)" }} />
      {/* paper */}
      <div
        style={{
          position: "absolute",
          left: 540 - 380,
          top: 280,
          width: 760,
          height: 900,
          background: `linear-gradient(180deg, ${PAPER}, ${PAPER_D})`,
          borderRadius: 8,
          boxShadow: "0 50px 100px -30px rgba(0,0,0,0.9)",
          transform: `translateY(${(1 - card) * 500}px) rotate(${(1 - card) * 6 - 1}deg)`,
          padding: "60px 60px",
          textAlign: "center",
        }}
      >
        <div style={{ position: "absolute", inset: 18, border: "2px solid rgba(26,22,20,0.15)", borderRadius: 4 }} />
        <div style={{ fontFamily: fonts.serif, fontSize: 52, color: "#6b5d50" }}>rahatsız edici</div>
        <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 132, color: "#8E2B1F", letterSpacing: "0.04em", lineHeight: 1 }}>GERÇEK</div>
        <div style={{ height: 3, background: "rgba(142,43,31,0.35)", margin: "26px 120px 40px" }} />
        {/* cracked shells before text */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 360, display: "flex", justifyContent: "center", gap: 40, opacity: shells, transform: `scale(${shells})` }}>
          <div style={{ width: 90, height: 60, borderRadius: "60px 60px 10px 10px", background: "#E7C4A0", clipPath: "polygon(0 100%, 0 30%, 20% 50%, 40% 20%, 60% 55%, 80% 25%, 100% 45%, 100% 100%)" }} />
          <div style={{ width: 90, height: 60, borderRadius: "60px 60px 10px 10px", background: "#E7C4A0", transform: "rotate(160deg)", clipPath: "polygon(0 100%, 0 30%, 20% 50%, 40% 20%, 60% 55%, 80% 25%, 100% 45%, 100% 100%)" }} />
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 50, color: INK, lineHeight: 1.3, opacity: line(T.l1), transform: `translateY(${(1 - line(T.l1)) * 16}px)` }}>
          İlk inşa ettiğiniz şey <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent, fontSize: 58 }}>ürün değil.</span>
        </div>
        <div style={{ marginTop: 34, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 92, color: INK, opacity: line(T.l2), transform: `scale(${0.9 + line(T.l2) * 0.1})` }}>
          <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent, fontSize: 110 }}>Kitledir.</span>
        </div>
        <div style={{ marginTop: 30, fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 44, color: INK, lineHeight: 1.3, opacity: line(T.l3), transform: `translateY(${(1 - line(T.l3)) * 16}px)` }}>
          Ürün, onlara <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent, fontSize: 52 }}>kalmak için bir sebep</span> verir.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 10. Finale: start with the people ---------- */
const Finale: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT() + T.fin;
  const base = T.fin;
  const inP = sp(frame, T.fin, base, 14, 100);
  const q = sp(frame, 53.3, base, 10, 160) * (1 - pr(t, T.people, T.people + 0.4));
  const lit = pr(t, T.people + 0.4, T.people + 2.0);
  const bob = Math.sin(frame / 5) * 3;
  const walk = (i: number) => interpolate(t, [T.people + i * 0.25, T.people + 1.6 + i * 0.25], [-220 - i * 90, 120 + i * 120], { ...clamp, easing: Easing.out(Easing.quad) });
  const step = (i: number) => Math.abs(Math.sin(frame / 3 + i)) * 10 * (t < T.people + 1.6 + i * 0.25 ? 1 : 0);
  const title = pr(t, T.people + 1.2, T.people + 1.8);
  return (
    <Room tone="#1d1714">
      <Dust />
      <div style={{ position: "absolute", left: 540 - 380, top: 900 - 200, transform: `scale(${inP})` }}>
        <LoopRing w={760} h={400} lit={lit} spin={-frame / 18} />
      </div>
      <div style={{ position: "absolute", left: 640, top: 900 - 260, transform: `scale(${inP})`, transformOrigin: "50% 100%" }}>
        <Egg size={170} face={lit > 0.5} />
      </div>
      <div style={{ position: "absolute", left: 230, top: 900 - 160, transform: `scale(${inP})`, transformOrigin: "50% 100%" }}>
        <Chicken size={230} bob={bob} />
      </div>
      <div style={{ position: "absolute", top: 380, left: 0, right: 0, textAlign: "center", fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 200, color: C.accent, transform: `scale(${q})`, opacity: q, textShadow: "0 0 40px rgba(226,98,5,0.6)" }}>?</div>
      {/* people walk in first */}
      {[0, 1, 2, 3].map((i) => (
        <div key={i} style={{ position: "absolute", left: walk(i), top: 1000 - step(i) + (i % 2) * 30 }}>
          <Person w={110} i={i + 1} />
        </div>
      ))}
      <div style={{ position: "absolute", top: 330, left: 60, right: 60, textAlign: "center", opacity: title, transform: `translateY(${(1 - title) * 30}px)` }}>
        <div style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: 80, color: C.fg }}>Yumurtadan önce</div>
        <div style={{ fontFamily: fonts.serif, fontSize: 116, color: C.accent, lineHeight: 1 }}>insanlarla başlayın.</div>
      </div>
    </Room>
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
  return interpolate(t, [0, 0.05, 1.2, 1.7, 57.0, 57.8, T.end - 1.5, T.end], [0, 0.6, 0.6, 0.3, 0.3, 0.75, 0.75, 0], clamp);
};
const SoundDesign: React.FC = () => (
  <>
    <Audio src={staticFile("music05.mp3")} volume={musicVolume} />
    <Audio src={staticFile("vo05_a.mp3")} volume={1} />
    <Sfx at={T.ring - 0.1} src="whoosh" vol={0.3} />
    <Sfx at={T.needUsers} src="pop" vol={0.3} />
    <Sfx at={T.needApp} src="pop" vol={0.3} />
    <Sfx at={T.which + 0.6} src="pop" vol={0.3} />
    <Sfx at={T.exA} src="whoosh" vol={0.3} />
    <Sfx at={T.exA + 0.35} src="tick" vol={0.5} />
    <Sfx at={T.zero} src="boom" vol={0.45} />
    <Sfx at={T.exB} src="whoosh" vol={0.3} />
    <Sfx at={T.exB + 0.35} src="tick" vol={0.5} />
    <Sfx at={T.unveil + 0.1} src="whoosh" vol={0.4} />
    <Sfx at={T.notSale} src="pop" vol={0.3} />
    <Sfx at={T.inLine} src="boom" vol={0.5} />
    <Sfx at={T.soonOk} src="pop" vol={0.3} />
    <Sfx at={T.lie} src="boom" vol={0.55} />
    <Sfx at={T.truth} src="whoosh" vol={0.3} />
    <Sfx at={T.l2} src="pop" vol={0.3} />
    <Sfx at={T.people} src="whoosh" vol={0.3} />
    <Sfx at={T.outro} src="boom" vol={0.4} />
  </>
);

/* ---------- Composition ---------- */
const Fade: React.FC<{ dur: number; children: React.ReactNode; inF?: number }> = ({ dur, children, inF = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, inF, dur - 6, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{ opacity: o }}>{children}</AbsoluteFill>;
};
const scenes: { from: number; to: number; C: React.FC; inF?: number }[] = [
  { from: T.paradox, to: T.exA, C: Paradox, inF: 1 },
  { from: T.exA, to: T.party, C: ExhibitA },
  { from: T.party, to: T.exB, C: Party },
  { from: T.exB, to: T.car, C: ExhibitB },
  { from: T.car, to: T.queue, C: CarScene },
  { from: T.queue, to: T.market, C: Queue },
  { from: T.market, to: T.truth, C: PedestalScene },
  { from: T.truth, to: T.fin, C: Truth },
  { from: T.fin, to: T.outro, C: Finale },
];

export const Reel05Tavuk: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#070606" }}>
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
        <Outro cta="Lansmandan önce kitleni kuralım" />
      </Fade>
    </Sequence>
    <Caption />
    <Chrome total={REEL05_FRAMES} />
    <SoundDesign />
  </AbsoluteFill>
);
