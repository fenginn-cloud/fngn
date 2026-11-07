// Reel 01 — "Dikkat pahalıdır. Netlik bir kaldıraçtır."
// Timings (seconds) are locked to the voiceover take public/vo_a.mp3 (pauses measured with silencedetect).
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { Background, C, Chrome, Outro, Pill, Reveal, SceneFade, fonts, prog, s, useSpring } from "../brand";

const T = {
  cunku: 1.73,
  clock: 3.8,
  kayb: 6.18,
  musteri: 8.24,
  ivme: 9.68,
  firsat: 11.12,
  pazar: 12.89,
  net: 15.66,
  keskin: 16.46,
  bilincli: 17.48,
  surt: 18.62,
  anlas: 20.19,
  karar: 21.96,
  netlik: 23.77,
  kaldirac: 25.84,
  outro: 27.4,
  end: 31.5,
};
export const REEL01_FRAMES = s(T.end);

const center: React.CSSProperties = {
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  padding: "0 80px",
  textAlign: "center",
};

/* ---------- A. Hook ---------- */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const coins = Array.from({ length: 7 }, (_, i) => i);
  const zoom = interpolate(frame, [0, s(T.cunku)], [1, 1.06]);
  return (
    <AbsoluteFill style={{ ...center, transform: `scale(${zoom})` }}>
      {coins.map((i) => {
        const start = i * 4;
        const t = Math.max(0, frame - start);
        const x = Math.sin(i * 2.3) * 380;
        const y = 300 - t * (5 + (i % 3)) + Math.cos(i) * 80;
        const o = interpolate(t, [0, 8, 40], [0, 0.9, 0], { extrapolateRight: "clamp" });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 540 + x - 30,
              top: 960 + y,
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 52 + (i % 3) * 16,
              color: C.accent,
              opacity: o,
              filter: "drop-shadow(0 0 18px rgba(226,98,5,0.6))",
            }}
          >
            ₺
          </div>
        );
      })}
      <Reveal
        text="Dikkat"
        at={0}
        style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 190, color: C.fg, letterSpacing: "-0.045em" }}
      />
      <Reveal
        text="pahalıdır."
        at={8}
        style={{ fontFamily: fonts.serif, fontSize: 210, color: C.accent, lineHeight: 0.9, marginTop: -10 }}
      />
    </AbsoluteFill>
  );
};

/* ---------- B1. Audience ---------- */
const Person: React.FC<{ scale: number; color: string; delay: number }> = ({ scale, color, delay }) => {
  const sp = useSpring(delay, 12, 160);
  return (
    <svg width={140 * scale} height={170 * scale} viewBox="0 0 140 170" style={{ transform: `scale(${sp})` }}>
      <circle cx="70" cy="48" r="36" fill={color} />
      <path d="M8 168c0-42 28-70 62-70s62 28 62 70Z" fill={color} />
    </svg>
  );
};

const Audience: React.FC = () => {
  const frame = useCurrentFrame();
  const br = prog(frame, 6, 18);
  const q = (i: number) => prog(frame, 22 + i * 6, 14);
  const people = [
    { sc: 0.6, c: "rgba(226,98,5,0.55)", d: 10 },
    { sc: 0.8, c: C.accent, d: 6 },
    { sc: 1.25, c: C.fg, d: 0 },
    { sc: 0.8, c: C.accent, d: 6 },
    { sc: 0.6, c: "rgba(226,98,5,0.55)", d: 10 },
  ];
  const bracket = (rot: number, x: number, y: number) => (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 90,
        height: 90,
        borderTop: `6px solid ${C.accent}`,
        borderLeft: `6px solid ${C.accent}`,
        transform: `rotate(${rot}deg)`,
        opacity: br,
      }}
    />
  );
  const inset = interpolate(br, [0, 1], [-60, 0]);
  return (
    <AbsoluteFill style={center}>
      <Reveal
        text="Kitleniz"
        at={0}
        style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 120, color: C.fg, letterSpacing: "-0.04em" }}
      />
      <Reveal
        text="mesajınızı çözmeye çalışıyor"
        at={6}
        stagger={2}
        style={{ fontFamily: fonts.serif, fontSize: 92, color: C.accent, lineHeight: 1, marginTop: 6 }}
      />
      <div style={{ position: "relative", width: 900, height: 520, marginTop: 70 }}>
        {bracket(0, 60 - inset, 0 - inset)}
        {bracket(90, 750 + inset, 0 - inset)}
        {bracket(270, 60 - inset, 430 + inset)}
        {bracket(180, 750 + inset, 430 + inset)}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 26,
            paddingBottom: 80,
          }}
        >
          {people.map((p, i) => (
            <Person key={i} scale={p.sc} color={p.c} delay={p.d} />
          ))}
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: 230 + i * 190,
              top: 20 - (i === 1 ? 40 : 0),
              fontFamily: fonts.display,
              fontWeight: 800,
              fontSize: 110,
              color: "rgba(245,245,245,0.85)",
              opacity: q(i),
              transform: `translateY(${(1 - q(i)) * 40}px) rotate(${(i - 1) * 12}deg)`,
            }}
          >
            ?
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- B2. Clock ---------- */
const Clock: React.FC = () => {
  const frame = useCurrentFrame();
  const R = 720;
  const cx = -80;
  const cy = 1250;
  const angle = 12 + frame * 0.9; // hand sweeps across the dial
  const arc = prog(frame, 0, 30);
  const ticks = Array.from({ length: 60 }, (_, i) => i);
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke={C.accent}
          strokeWidth={6}
          strokeDasharray={2 * Math.PI * R}
          strokeDashoffset={2 * Math.PI * R * (1 - arc * 0.3)}
          transform={`rotate(-110 ${cx} ${cy})`}
        />
        {ticks.map((i) => {
          const a = ((i * 6 - 90) * Math.PI) / 180;
          const long = i % 5 === 0;
          const r1 = R - 30;
          const r2 = R - (long ? 110 : 60);
          return (
            <line
              key={i}
              x1={cx + Math.cos(a) * r1}
              y1={cy + Math.sin(a) * r1}
              x2={cx + Math.cos(a) * r2}
              y2={cy + Math.sin(a) * r2}
              stroke={long ? C.fg : "rgba(245,245,245,0.25)"}
              strokeWidth={long ? 6 : 3}
            />
          );
        })}
        <g transform={`rotate(${angle} ${cx} ${cy})`}>
          <line x1={cx} y1={cy + 120} x2={cx} y2={cy - R + 140} stroke={C.fg} strokeWidth={14} strokeLinecap="round" />
          <path
            d={`M${cx} ${cy - R + 300} l-26 -80 l26 -80 l26 80Z`}
            fill={C.bg}
            stroke={C.fg}
            strokeWidth={8}
          />
        </g>
        <circle cx={cx} cy={cy} r={34} fill={C.accent} />
        <circle cx={cx} cy={cy} r={14} fill={C.bg} />
      </svg>
      <div style={{ position: "absolute", right: 90, top: 560, textAlign: "right" }}>
        <Reveal
          text="Çünkü"
          at={2}
          style={{ justifyContent: "flex-end", fontFamily: fonts.display, fontWeight: 600, fontSize: 92, color: C.fg }}
        />
        <Reveal
          text="her saniye"
          at={20}
          style={{ justifyContent: "flex-end", fontFamily: fonts.serif, fontSize: 150, color: C.accent, lineHeight: 0.95 }}
        />
        <Reveal
          text="kitlenizin anlamaya harcadığı her an"
          at={34}
          stagger={1}
          style={{
            justifyContent: "flex-end",
            maxWidth: 520,
            marginLeft: "auto",
            marginTop: 20,
            fontFamily: fonts.sans,
            fontSize: 36,
            color: C.muted,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- C. Countdown ring ---------- */
const Countdown: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = s(T.musteri - T.kayb);
  const p = interpolate(frame, [0, dur - 6], [1, 0], { extrapolateRight: "clamp" });
  const n = Math.max(0, Math.ceil(p * 10));
  const R = 260;
  const circ = 2 * Math.PI * R;
  const ring = useSpring(0, 14, 120);
  return (
    <AbsoluteFill style={center}>
      <div style={{ position: "relative", width: 640, height: 640, transform: `scale(${ring})` }}>
        <svg width={640} height={640} style={{ position: "absolute", left: 0, top: 0 }}>
          <circle cx={320} cy={320} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={40} />
          <circle
            cx={320}
            cy={320}
            r={R}
            fill="none"
            stroke={C.accent}
            strokeWidth={40}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - p)}
            transform="rotate(-90 320 320)"
            style={{ filter: "drop-shadow(0 0 30px rgba(226,98,5,0.7))" }}
          />
        </svg>
        <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: fonts.display,
              fontWeight: 700,
              fontSize: 260,
              color: C.fg,
              letterSpacing: "-0.05em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {n}
          </div>
        </AbsoluteFill>
      </div>
      <Reveal
        text="kaybettiğiniz"
        at={4}
        style={{ marginTop: 60, fontFamily: fonts.display, fontWeight: 600, fontSize: 96, color: C.fg }}
      />
      <Reveal text="bir saniyedir." at={14} style={{ fontFamily: fonts.serif, fontSize: 130, color: C.accent, lineHeight: 1 }} />
    </AbsoluteFill>
  );
};

/* ---------- D. Losses (hexagons) ---------- */
const IconUsers = () => (
  <g fill="none" stroke="#0b0b0b" strokeWidth={7} strokeLinecap="round">
    <circle cx="0" cy="-18" r="18" />
    <path d="M-34 36c0-22 15-34 34-34s34 12 34 34" />
    <circle cx="-44" cy="-8" r="12" />
    <circle cx="44" cy="-8" r="12" />
    <path d="M-70 30c0-14 10-22 22-22M70 30c0-14-10-22-22-22" />
  </g>
);
const IconTrendDown = () => (
  <g fill="none" stroke="#0b0b0b" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M-55 -35 L-15 5 L10 -20 L55 30" />
    <path d="M25 30 H55 V0" />
  </g>
);
const IconCoin = () => (
  <g fill="none" stroke="#0b0b0b" strokeWidth={7} strokeLinecap="round">
    <circle cx="0" cy="0" r="46" />
    <text
      x="0"
      y="20"
      textAnchor="middle"
      fontSize="58"
      fontWeight={800}
      fill="#0b0b0b"
      stroke="none"
      fontFamily="sans-serif"
    >
      ₺
    </text>
    <path d="M-30 64 H30" />
  </g>
);

const Hex: React.FC<{
  x: number;
  y: number;
  at: number;
  label: string;
  icon: React.ReactNode;
  labelSide: "up" | "down";
}> = ({ x, y, at, label, icon, labelSide }) => {
  const frame = useCurrentFrame();
  const sp = useSpring(at, 11, 150);
  const line = prog(frame, at + 6, 14);
  const txt = prog(frame, at + 12, 14);
  const R = 150;
  const pts = Array.from({ length: 6 }, (_, i) => {
    const a = ((60 * i - 90) * Math.PI) / 180;
    return `${Math.cos(a) * R},${Math.sin(a) * R}`;
  }).join(" ");
  const dir = labelSide === "up" ? -1 : 1;
  const ly1 = dir * R;
  const ly2 = dir * (R + 90);
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d={`M0 ${ly1} V${ly1 + (ly2 - ly1) * line} `}
        stroke="rgba(245,245,245,0.7)"
        strokeWidth={4}
        fill="none"
      />
      <path
        d={`M0 ${ly2} L${-60 * line} ${ly2 + dir * 60 * line}`}
        stroke="rgba(245,245,245,0.7)"
        strokeWidth={4}
        fill="none"
        opacity={line >= 0.99 ? 1 : 0}
      />
      <text
        x={-70}
        y={ly2 + dir * 100}
        textAnchor="middle"
        fontFamily={fonts.sans}
        fontWeight={500}
        fontSize={46}
        fill={C.fg}
        opacity={txt}
      >
        {label}
      </text>
      <g transform={`scale(${sp}) rotate(${(1 - sp) * 40})`}>
        <polygon points={pts} fill={C.accent} style={{ filter: "drop-shadow(0 0 40px rgba(226,98,5,0.55))" }} />
        <polygon points={pts} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={3} transform="scale(0.82)" />
        <g transform="scale(1.25)">{icon}</g>
      </g>
    </g>
  );
};

const Losses: React.FC = () => {
  const base = s(T.musteri) - 6;
  const at = (t: number) => s(t) - base;
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 330, left: 0, right: 0 }}>
        <Reveal
          text="Her belirsiz saniye"
          at={0}
          style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 84, color: C.fg, letterSpacing: "-0.03em" }}
        />
        <Reveal text="bir kayıp demek." at={6} style={{ fontFamily: fonts.serif, fontSize: 100, color: C.accent }} />
      </div>
      <svg width={1080} height={1920} style={{ position: "absolute" }}>
        <Hex x={340} y={1010} at={at(T.musteri)} label="Müşteri kaybı" icon={<IconUsers />} labelSide="up" />
        <Hex x={740} y={1010} at={at(T.ivme)} label="İvme kaybı" icon={<IconTrendDown />} labelSide="up" />
        <Hex x={540} y={1290} at={at(T.firsat)} label="Fırsat kaybı" icon={<IconCoin />} labelSide="down" />
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- E. Not louder ---------- */
const NotLouder: React.FC = () => {
  const frame = useCurrentFrame();
  const base = s(T.pazar) - 6;
  const strikeAt = s(14.6) - base;
  const strike = prog(frame, strikeAt, 12);
  const shake = frame < strikeAt ? Math.sin(frame * 2.2) * 6 : 0;
  return (
    <AbsoluteFill style={center}>
      <Reveal
        text="Pazarı kazanan"
        at={6}
        style={{ fontFamily: fonts.display, fontWeight: 600, fontSize: 96, color: C.muted, letterSpacing: "-0.03em" }}
      />
      <Reveal
        text="markalar"
        at={s(13.6) - base}
        style={{ fontFamily: fonts.serif, fontSize: 170, color: C.accent, lineHeight: 1 }}
      />
      <div style={{ position: "relative", marginTop: 40, transform: `translateX(${shake}px)` }}>
        <Reveal
          text="DAHA GÜRÜLTÜLÜ"
          at={s(14.25) - base}
          stagger={2}
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 118,
            color: C.fg,
            letterSpacing: "-0.03em",
            opacity: 1 - strike * 0.6,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -20,
            top: "52%",
            height: 14,
            width: `${strike * 104}%`,
            background: C.accent,
            borderRadius: 8,
            transform: "rotate(-3deg)",
            boxShadow: "0 0 30px rgba(226,98,5,0.7)",
          }}
        />
      </div>
      <Reveal
        text="değil."
        at={strikeAt + 4}
        style={{ marginTop: 20, fontFamily: fonts.serif, fontSize: 150, color: C.fg }}
      />
    </AbsoluteFill>
  );
};

/* ---------- F. Pills ---------- */
const Pills: React.FC = () => {
  const base = s(T.net) - 10;
  const at = (t: number) => s(t) - base;
  return (
    <AbsoluteFill style={{ ...center, justifyContent: "center" }}>
      <Reveal
        text="Kazananlar"
        at={0}
        style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 110, color: C.fg, letterSpacing: "-0.04em" }}
      />
      <Reveal text="daha net konuşur." at={4} style={{ fontFamily: fonts.serif, fontSize: 100, color: C.accent, marginBottom: 90 }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={{ display: "flex", gap: 26 }}>
          <Pill label="Daha net" at={at(T.net)} filled size={54} />
          <Pill label="Daha keskin" at={at(T.keskin)} size={54} />
        </div>
        <div style={{ display: "flex", gap: 26 }}>
          <Pill label="Daha bilinçli" at={at(T.bilincli)} size={54} />
          <Pill label="Sürtünmeyi kaldırır" at={at(T.surt)} filled size={46} />
        </div>
        <Pill label="Anlaşılmayı hızlandırır" at={at(T.anlas)} filled size={50} />
        <Pill label="Kararı zahmetsiz kılar" at={at(T.karar)} size={50} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- G. Leverage ---------- */
const Leverage: React.FC = () => {
  const frame = useCurrentFrame();
  const base = s(T.netlik) - 6;
  const hit = s(T.kaldirac) - base;
  const dim = prog(frame, hit - 4, 14);
  const big = useSpring(hit, 12, 130);
  const draw = prog(frame, hit + 8, 22);
  const L = 2600;
  return (
    <AbsoluteFill style={center}>
      <div style={{ opacity: 1 - dim * 0.7, filter: `blur(${dim * 5}px)`, transform: `translateY(${-dim * 60}px)` }}>
        <Reveal
          text="Çünkü netlik"
          at={6}
          style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 112, color: C.fg, letterSpacing: "-0.04em" }}
        />
        <Reveal
          text="bir avantaj değil."
          at={s(24.6) - base}
          stagger={3}
          style={{ fontFamily: fonts.sans, fontSize: 80, color: C.muted }}
        />
      </div>
      <div style={{ position: "relative", marginTop: 60, transform: `scale(${big})`, opacity: Math.min(1, big * 2) }}>
        <div
          style={{
            fontFamily: fonts.display,
            fontWeight: 800,
            fontSize: 150,
            color: C.fg,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            padding: "40px 60px",
          }}
        >
          Bir <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>kaldıraç.</span>
        </div>
        <svg
          width={920}
          height={340}
          viewBox="0 0 920 340"
          style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", overflow: "visible" }}
        >
          <path
            d="M120 60 C 330 0, 820 20, 880 150 C 930 270, 520 330, 300 310 C 90 290, -10 220, 30 140 C 60 80, 200 40, 420 30"
            fill="none"
            stroke={C.accent}
            strokeWidth={8}
            strokeLinecap="round"
            strokeDasharray={L}
            strokeDashoffset={L * (1 - draw)}
            style={{ filter: "drop-shadow(0 0 16px rgba(226,98,5,0.8))" }}
          />
        </svg>
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

const SoundDesign: React.FC = () => {
  const whooshes = [1.62, 3.7, 6.05, 8.0, 12.65, 15.4, 23.55, 27.3];
  const ticks = Array.from({ length: 5 }, (_, i) => T.clock + 0.25 + i * 0.45);
  const pops = [T.musteri, T.ivme, T.firsat, T.net, T.keskin, T.bilincli, T.surt, T.anlas, T.karar];
  return (
    <>
      <Audio src={staticFile("sfx/pad.wav")} volume={0.5} />
      <Audio src={staticFile("vo_a.mp3")} volume={1} />
      <Sfx at={0} src="boom" vol={0.7} />
      {whooshes.map((t) => (
        <Sfx key={`w${t}`} at={t} src="whoosh" vol={0.35} />
      ))}
      {ticks.map((t) => (
        <Sfx key={`t${t}`} at={t} src="tick" vol={0.25} />
      ))}
      {pops.map((t) => (
        <Sfx key={`p${t}`} at={t} src="pop" vol={0.3} />
      ))}
      <Sfx at={T.kaldirac} src="boom" vol={0.8} />
      <Sfx at={T.outro} src="boom" vol={0.5} />
    </>
  );
};

/* ---------- Timeline ---------- */
const scenes: { from: number; to: number; C: React.FC; inF?: number }[] = [
  { from: 0, to: 1.68, C: Hook, inF: 1 },
  { from: 1.68, to: 3.78, C: Audience },
  { from: 3.78, to: 6.12, C: Clock },
  { from: 6.12, to: 8.08, C: Countdown },
  { from: 8.08, to: 12.72, C: Losses },
  { from: 12.72, to: 15.5, C: NotLouder },
  { from: 15.5, to: 23.6, C: Pills },
  { from: 23.6, to: T.outro, C: Leverage },
  { from: T.outro, to: T.end, C: () => <Outro /> },
];

export const Reel01Dikkat: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Background />
    {scenes.map(({ from, to, C: Scene, inF }, i) => {
      const dur = s(to) - s(from);
      return (
        <Sequence key={i} from={s(from)} durationInFrames={dur}>
          <SceneFade dur={dur} inF={inF} outF={i === scenes.length - 1 ? 1 : 8}>
            <Scene />
          </SceneFade>
        </Sequence>
      );
    })}
    <Chrome total={REEL01_FRAMES} series="Günün Notu #01" />
    <SoundDesign />
  </AbsoluteFill>
);
