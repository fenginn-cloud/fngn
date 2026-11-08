// Illustration kit for story-style reels (Reel 05+). Pure SVG/CSS, brand palette.
import React from "react";
import { C, fonts } from "../brand";

export const PAPER = "#F1EADF";
export const PAPER_D = "#E3D8C6";
export const INK = "#1A1614";
export const BULB = "#FFD9A0";
export const SKIN = ["#F2C9A0", "#D9A27A", "#B57B55", "#8C5A3C", "#F5D3B5"];
export const SHIRTS = ["#E26205", "#F2E3CF", "#5E7A8C", "#8F6BB3", "#C9524A", "#6F9E6B", "#D9A441", "#4E6FA8", "#B9B2A6"];

/* ---------- Chicken ---------- */
export const Chicken: React.FC<{ size: number; bob?: number; flip?: boolean }> = ({ size, bob = 0, flip }) => (
  <svg width={size} height={size} viewBox="0 0 200 200" style={{ transform: flip ? "scaleX(-1)" : undefined, overflow: "visible" }}>
    <g transform={`translate(0 ${bob})`}>
      {/* legs */}
      <path d="M92 150 L88 186 M112 150 L116 186" stroke="#E8912C" strokeWidth={6} strokeLinecap="round" />
      <path d="M78 188 H98 M106 188 H126" stroke="#E8912C" strokeWidth={6} strokeLinecap="round" />
      {/* tail */}
      <path d="M150 92 C 178 70, 186 92, 172 112 C 186 110, 180 134, 160 128 Z" fill="#ECE6DC" />
      {/* body */}
      <ellipse cx={108} cy={118} rx={58} ry={44} fill="#FBF8F2" />
      <path d="M70 92 C 64 60, 72 36, 92 34 C 112 32, 118 56, 112 84 Z" fill="#FBF8F2" />
      {/* wing */}
      <path d="M100 112 C 120 100, 150 106, 150 124 C 136 138, 112 136, 100 126 Z" fill="#ECE6DC" />
      {/* comb + wattle */}
      <path d="M80 34 C 78 22, 88 20, 90 28 C 92 16, 104 18, 100 30 C 108 24, 114 34, 104 38 Z" fill="#D9412F" />
      <path d="M72 62 C 66 70, 70 80, 78 74 Z" fill="#D9412F" />
      {/* beak */}
      <path d="M72 50 L56 56 L72 60 Z" fill="#F2A03A" />
      {/* eye */}
      <circle cx={84} cy={48} r={4.5} fill={INK} />
      <circle cx={85.5} cy={46.5} r={1.4} fill="#fff" />
      <ellipse cx={108} cy={160} rx={46} ry={6} fill="rgba(0,0,0,0.18)" />
    </g>
  </svg>
);

/* ---------- Egg ---------- */
export const Egg: React.FC<{ size: number; crack?: number; face?: boolean }> = ({ size, crack = 0, face }) => (
  <svg width={size} height={size * 1.25} viewBox="0 0 160 200" style={{ overflow: "visible" }}>
    <defs>
      <radialGradient id="eggG" cx="38%" cy="30%" r="75%">
        <stop offset="0%" stopColor="#FCE6CC" />
        <stop offset="60%" stopColor="#EFC7A0" />
        <stop offset="100%" stopColor="#D9A57A" />
      </radialGradient>
    </defs>
    <ellipse cx={80} cy={190} rx={54} ry={8} fill="rgba(0,0,0,0.25)" />
    <path d="M80 6 C 128 6, 152 92, 150 128 C 148 170, 118 192, 80 192 C 42 192, 12 170, 10 128 C 8 92, 32 6, 80 6 Z" fill="url(#eggG)" />
    <ellipse cx={56} cy={56} rx={14} ry={24} fill="#fff" opacity={0.45} transform="rotate(18 56 56)" />
    {[
      [100, 80], [112, 120], [70, 140], [92, 160], [120, 150], [60, 110],
    ].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r={2.6} fill="#B9855E" opacity={0.6} />
    ))}
    {crack > 0 && (
      <path
        d="M24 96 L44 88 L56 104 L74 90 L88 106 L104 92 L120 104 L138 94"
        fill="none"
        stroke="#7A5638"
        strokeWidth={3}
        strokeLinejoin="round"
        strokeDasharray={200}
        strokeDashoffset={200 * (1 - crack)}
      />
    )}
    {face && (
      <g>
        <path d="M58 116 q6 -6 12 0 M90 116 q6 -6 12 0" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M70 136 q10 8 20 0" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

/* ---------- Loop ring (the chicken-egg cycle) ---------- */
export const LoopRing: React.FC<{ w: number; h: number; lit: number; spin: number }> = ({ w, h, lit, spin }) => {
  const rx = w / 2 - 30;
  const ry = h / 2 - 30;
  const n = 22;
  return (
    <svg width={w} height={h} style={{ overflow: "visible" }}>
      <ellipse cx={w / 2} cy={h / 2 + 14} rx={rx} ry={ry} fill="none" stroke="rgba(0,0,0,0.45)" strokeWidth={46} />
      <ellipse cx={w / 2} cy={h / 2} rx={rx} ry={ry} fill="none" stroke="#3A3532" strokeWidth={46} />
      <ellipse
        cx={w / 2}
        cy={h / 2}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={C.accent}
        strokeWidth={46}
        pathLength={100}
        strokeDasharray={`${lit * 100} 100`}
        style={{ filter: lit > 0 ? "drop-shadow(0 0 18px rgba(226,98,5,0.7))" : undefined }}
      />
      <ellipse cx={w / 2} cy={h / 2} rx={rx} ry={ry} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} transform={`translate(0 -18)`} />
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 + spin;
        const x = w / 2 + Math.cos(a) * rx;
        const y = h / 2 + Math.sin(a) * ry;
        const deg = (Math.atan2(Math.cos(a) * ry, -Math.sin(a) * rx) * 180) / Math.PI;
        return (
          <path
            key={i}
            d="M-7 -9 L5 0 L-7 9"
            transform={`translate(${x} ${y}) rotate(${deg + 180})`}
            fill="none"
            stroke="rgba(255,226,190,0.55)"
            strokeWidth={5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
};

/* ---------- Speech bubble icons ---------- */
export const Bubble: React.FC<{ size: number; kind: "people" | "box" }> = ({ size, kind }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible", filter: "drop-shadow(0 0 16px rgba(226,98,5,0.6))" }}>
    <path d="M50 6 C 76 6, 94 22, 94 44 C 94 66, 76 82, 50 82 L 42 96 L 36 80 C 18 76, 6 62, 6 44 C 6 22, 24 6, 50 6 Z" fill={C.accent} />
    {kind === "people" ? (
      <g fill="#0b0b0b">
        <circle cx={50} cy={34} r={8} />
        <path d="M36 58 c0 -10 6 -15 14 -15 s14 5 14 15 Z" />
        <circle cx={30} cy={40} r={6} />
        <path d="M19 60 c0 -8 5 -12 11 -12 s9 3 10 8 Z" />
        <circle cx={70} cy={40} r={6} />
        <path d="M81 60 c0 -8 -5 -12 -11 -12 s-9 3 -10 8 Z" />
      </g>
    ) : (
      <g fill="none" stroke="#0b0b0b" strokeWidth={6} strokeLinejoin="round">
        <rect x={30} y={26} width={40} height={38} rx={6} />
        <path d="M30 40 H70 M50 26 V40" />
      </g>
    )}
  </svg>
);

/* ---------- Museum placard ---------- */
export const Placard: React.FC<{ title: string; sub: string; w?: number; rot?: number }> = ({ title, sub, w = 520, rot = -4 }) => (
  <div
    style={{
      width: w,
      padding: "34px 40px 30px",
      background: PAPER,
      borderRadius: 8,
      transform: `rotate(${rot}deg)`,
      boxShadow: "0 30px 60px -20px rgba(0,0,0,0.85)",
      position: "relative",
      textAlign: "center",
    }}
  >
    <div style={{ position: "absolute", top: 16, left: 22, width: 18, height: 18, borderRadius: "50%", background: INK }} />
    <div style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: w * 0.12, color: INK, letterSpacing: "0.02em" }}>{title}</div>
    <div style={{ height: 2, background: "rgba(26,22,20,0.3)", margin: "8px 30px 6px" }} />
    <div style={{ fontFamily: fonts.serif, fontSize: w * 0.075, color: "#6b5d50" }}>{sub}</div>
  </div>
);

export const Label: React.FC<{ top: string; main: string; w?: number }> = ({ top, main, w = 520 }) => (
  <div
    style={{
      width: w,
      padding: "18px 24px",
      background: "linear-gradient(180deg, #E9DCC4, #D6C4A4)",
      borderRadius: 10,
      textAlign: "center",
      boxShadow: "0 18px 40px -16px rgba(0,0,0,0.8), inset 0 2px 0 rgba(255,255,255,0.5)",
    }}
  >
    <div style={{ fontFamily: fonts.serif, fontSize: 34, color: "#7a6a58" }}>{top}</div>
    <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 40, color: INK }}>{main}</div>
  </div>
);

/* ---------- Book ---------- */
export const Book: React.FC<{ w: number }> = ({ w }) => (
  <svg width={w} height={w * 1.15} viewBox="0 0 200 230" style={{ overflow: "visible" }}>
    <path d="M30 20 L170 10 L180 200 L40 212 Z" fill="#E9E2D6" />
    <path d="M24 24 L164 14 L174 204 L34 216 Z" fill="#1E2A2E" />
    <path d="M24 24 L164 14 L174 204 L34 216 Z" fill="url(#bookSheen)" />
    <defs>
      <linearGradient id="bookSheen" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
        <stop offset="50%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <path d="M40 40 L150 32 L158 190 L48 198 Z" fill="none" stroke={C.accent} strokeWidth={2} opacity={0.8} />
    <text x={98} y={92} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={22} fill="#F1EADF" transform="rotate(-4 98 92)">SOĞUK</text>
    <text x={100} y={118} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={22} fill="#F1EADF" transform="rotate(-4 100 118)">BAŞLANGIÇ</text>
    <text x={102} y={144} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={15} fill={C.accent} transform="rotate(-4 102 144)">problemi</text>
    {/* frost branches */}
    <path d="M150 170 l-20 -14 m10 7 l-4 -14 m-6 4 l-12 -2" stroke="rgba(255,255,255,0.35)" strokeWidth={2} fill="none" />
  </svg>
);

/* ---------- Pedestal ---------- */
export const Pedestal: React.FC<{ w: number; h: number; tone?: string }> = ({ w, h, tone = "#8E8A93" }) => (
  <div style={{ width: w, height: h, position: "relative" }}>
    <div style={{ position: "absolute", top: 0, left: -14, right: -14, height: 26, borderRadius: 6, background: "#B3AEB8" }} />
    <div style={{ position: "absolute", top: 26, left: 0, right: 0, bottom: 0, background: `linear-gradient(90deg, ${tone}, #A7A2AC 50%, ${tone})` }} />
  </div>
);

/* ---------- Spotlight cone ---------- */
export const Spot: React.FC<{ x: number; top: number; w: number; h: number; o?: number }> = ({ x, top, w, h, o = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: x - w / 2,
      top,
      width: w,
      height: h,
      background: "linear-gradient(180deg, rgba(255,236,200,0.20), rgba(255,236,200,0.02))",
      clipPath: "polygon(42% 0, 58% 0, 100% 100%, 0 100%)",
      opacity: o,
      filter: "blur(2px)",
    }}
  />
);

/* ---------- FNGN mascot (rounded orange block with a face) ---------- */
export const Mascot: React.FC<{ size: number; mood?: "happy" | "sad" | "wow"; hat?: boolean; blink?: number; squash?: number }> = ({
  size,
  mood = "happy",
  hat = true,
  blink = 0,
  squash = 0,
}) => (
  <svg width={size} height={size * 1.3} viewBox="0 0 200 260" style={{ overflow: "visible" }}>
    <ellipse cx={100} cy={250} rx={74} ry={10} fill="rgba(0,0,0,0.35)" />
    <g transform={`translate(100 245) scale(${1 + squash * 0.08} ${1 - squash * 0.08}) translate(-100 -245)`}>
      <rect x={20} y={90} width={160} height={155} rx={46} fill={C.accent} />
      <rect x={20} y={90} width={160} height={155} rx={46} fill="url(#mascotShade)" />
      <defs>
        <linearGradient id="mascotShade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.18)" />
        </linearGradient>
      </defs>
      <ellipse cx={62} cy={118} rx={20} ry={10} fill="#fff" opacity={0.25} />
      {/* eyes */}
      <ellipse cx={74} cy={160} rx={9} ry={11 * (1 - blink)} fill={INK} />
      <ellipse cx={126} cy={160} rx={9} ry={11 * (1 - blink)} fill={INK} />
      {mood === "happy" && <path d="M82 192 q18 16 36 0" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />}
      {mood === "sad" && <path d="M82 202 q18 -14 36 0" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />}
      {mood === "wow" && <ellipse cx={100} cy={198} rx={10} ry={13} fill={INK} />}
      <ellipse cx={56} cy={186} rx={11} ry={6} fill="#FF8A3D" opacity={0.8} />
      <ellipse cx={144} cy={186} rx={11} ry={6} fill="#FF8A3D" opacity={0.8} />
      {hat && (
        <g transform="rotate(-12 100 90)">
          <path d="M70 96 L104 10 L134 96 Z" fill={PAPER} />
          <path d="M82 66 L124 66 M90 44 L116 44" stroke={C.accent} strokeWidth={8} />
          <circle cx={104} cy={10} r={11} fill={BULB} />
        </g>
      )}
    </g>
  </svg>
);

/* ---------- Simple person (for crowds/queues) ---------- */
export const Person: React.FC<{ w: number; i: number; back?: boolean }> = ({ w, i, back }) => {
  const skin = SKIN[i % SKIN.length];
  const shirt = SHIRTS[(i * 7) % SHIRTS.length];
  const hair = ["#2a1d17", "#5a3a22", "#c08a4a", "#1b1b1b", "#7a4b2c"][(i * 3) % 5];
  return (
    <svg width={w} height={w * 1.9} viewBox="0 0 60 114" style={{ overflow: "visible" }}>
      <rect x={8} y={42} width={44} height={66} rx={18} fill={shirt} />
      <rect x={8} y={42} width={44} height={66} rx={18} fill="rgba(0,0,0,0.12)" style={{ mixBlendMode: "multiply" }} />
      <circle cx={30} cy={24} r={17} fill={back ? hair : skin} />
      {!back && <path d="M13 22 C 13 8, 47 8, 47 22 C 40 14, 20 14, 13 22 Z" fill={hair} />}
    </svg>
  );
};

/* ---------- Bunting ---------- */
export const Bunting: React.FC<{ w: number; n: number; sag?: number; y?: number }> = ({ w, n, sag = 40, y = 0 }) => {
  const cols = [C.accent, PAPER, "#8F6BB3", "#6F9E6B", "#D9A441", "#5E7A8C"];
  return (
    <svg width={w} height={sag + 80} style={{ position: "absolute", left: 0, top: y, overflow: "visible" }}>
      <path d={`M0 0 Q ${w / 2} ${sag * 2} ${w} 0`} stroke="rgba(255,255,255,0.4)" strokeWidth={3} fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const t = (i + 0.5) / n;
        const x = t * w;
        const yy = 2 * (1 - t) * t * sag * 2;
        return <path key={i} d={`M${x - 22} ${yy} L${x + 22} ${yy} L${x} ${yy + 52} Z`} fill={cols[i % cols.length]} />;
      })}
    </svg>
  );
};

/* ---------- Marquee sign with bulbs ---------- */
export const Marquee: React.FC<{ text: string; w: number; frame: number; on?: number; size?: number }> = ({ text, w, frame, on = 1, size = 64 }) => {
  const bulbs = Math.round(w / 34);
  return (
    <div
      style={{
        width: w,
        padding: `${size * 0.42}px 20px`,
        borderRadius: 18,
        background: "linear-gradient(180deg, #2B2420, #1A1512)",
        border: "4px solid #C9A46A",
        position: "relative",
        textAlign: "center",
        fontFamily: fonts.display,
        fontWeight: 800,
        fontSize: size,
        letterSpacing: "0.04em",
        color: on > 0.5 ? "#FFE7BF" : "#6b5e50",
        textShadow: on > 0.5 ? "0 0 18px rgba(255,190,110,0.9)" : "none",
        boxShadow: "0 30px 60px -20px rgba(0,0,0,0.9)",
      }}
    >
      {Array.from({ length: bulbs }, (_, i) => (
        <React.Fragment key={i}>
          {[-14, null].map((tp, k) => (
            <div
              key={k}
              style={{
                position: "absolute",
                left: 14 + (i * (w - 36)) / (bulbs - 1),
                top: tp === null ? undefined : tp + 4,
                bottom: tp === null ? -10 + 4 : undefined,
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: on > 0.5 && (i + Math.floor(frame / 4)) % 3 !== 0 ? BULB : "#5a4a3a",
                boxShadow: on > 0.5 && (i + Math.floor(frame / 4)) % 3 !== 0 ? "0 0 10px rgba(255,210,140,0.9)" : "none",
              }}
            />
          ))}
        </React.Fragment>
      ))}
      {text}
    </div>
  );
};

/* ---------- Covered car / outline car ---------- */
export const Car: React.FC<{ w: number; cover: number; glow?: number }> = ({ w, cover, glow = 0 }) => (
  <svg width={w} height={w * 0.42} viewBox="0 0 500 210" style={{ overflow: "visible" }}>
    <ellipse cx={250} cy={196} rx={240} ry={14} fill="rgba(0,0,0,0.4)" />
    {/* car body */}
    <g opacity={1 - cover * 0.95}>
      <path
        d="M30 150 C 30 120, 60 112, 110 106 L 170 60 C 190 46, 240 42, 300 46 C 350 50, 380 70, 410 100 L 450 108 C 476 114, 482 130, 480 150 Z"
        fill="#3A4142"
        stroke={C.accent}
        strokeWidth={3 + glow * 3}
        style={{ filter: glow ? `drop-shadow(0 0 ${14 * glow}px rgba(226,98,5,0.9))` : undefined }}
      />
      <path d="M180 66 L 236 56 L 240 100 L 140 104 Z" fill="#9FB3B5" opacity={0.6} />
      <path d="M252 56 C 300 54, 344 62, 378 96 L 256 100 Z" fill="#9FB3B5" opacity={0.6} />
      <rect x={462} y={124} width={18} height={10} rx={3} fill="#FFD9A0" />
      <rect x={28} y={126} width={14} height={10} rx={3} fill="#D9412F" />
    </g>
    {/* wheels */}
    {[120, 390].map((x) => (
      <g key={x}>
        <circle cx={x} cy={152} r={36} fill="#151515" />
        <circle cx={x} cy={152} r={18} fill="#6b6b6b" />
      </g>
    ))}
    {/* cover cloth */}
    <g opacity={cover}>
      <path
        d="M14 156 C 10 110, 70 96, 120 92 C 150 50, 220 30, 300 34 C 370 38, 410 70, 440 96 C 480 104, 494 130, 488 158 C 400 166, 100 168, 14 156 Z"
        fill="#E8DFD0"
      />
      {[110, 180, 250, 320, 390].map((x, i) => (
        <path key={i} d={`M${x} ${60 + (i % 2) * 10} C ${x - 10} 110, ${x + 10} 130, ${x - 4} 160`} stroke="rgba(120,100,80,0.35)" strokeWidth={4} fill="none" />
      ))}
    </g>
  </svg>
);

/* ---------- Ticket ---------- */
export const Ticket: React.FC<{ w: number }> = ({ w }) => (
  <div
    style={{
      width: w,
      display: "flex",
      borderRadius: 14,
      overflow: "hidden",
      boxShadow: "0 30px 60px -20px rgba(0,0,0,0.9)",
      background: PAPER,
    }}
  >
    <div style={{ width: w * 0.2, borderRight: "4px dashed rgba(26,22,20,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={w * 0.1} height={w * 0.1} viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 12.5 9.5 18 20 6" />
      </svg>
    </div>
    <div style={{ flex: 1, padding: `${w * 0.05}px ${w * 0.06}px`, position: "relative" }}>
      <div style={{ position: "absolute", inset: 10, border: `3px solid ${C.accent}`, borderRadius: 8 }} />
      <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: w * 0.1, color: INK, letterSpacing: "0.02em" }}>REZERVE</div>
      <div style={{ fontFamily: fonts.serif, fontSize: w * 0.06, color: C.accent }}>iade edilebilir kapora</div>
    </div>
  </div>
);
