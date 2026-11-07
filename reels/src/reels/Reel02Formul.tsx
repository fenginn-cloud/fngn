// Reel 02 — "Viral içeriğin formülü"
// Timings (seconds) are locked to public/vo02_a.mp3 (pauses measured with silencedetect).
// Music: public/music02.mp3 (ElevenLabs Music), ducked under the voice.
import React from "react";
import {
  AbsoluteFill,
  Audio,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Background, C, Chrome, Outro, SceneFade, fonts, prog, s } from "../brand";

/* ---------- Timeline (seconds) ---------- */
const T = {
  kanca: 2.0,
  vaat: 4.94,
  deger1: 8.59,
  dongu1: 11.29,
  deger2: 14.87,
  dongu2: 16.41,
  deger3: 19.41,
  brk: 21.0, // "Ama bir şey daha var..."
  cta: 23.3,
  shot: 27.38,
  outro: 29.4,
  end: 33.0,
};
export const REEL02_FRAMES = s(T.end);

const NODES = ["Kanca", "Vaat", "Değer", "Açık Döngü 1", "Değer", "Açık Döngü 2", "Değer", "CTA"];
// when the wheel rotates to node i
const STEP_AT = [T.kanca, T.vaat, T.deger1, T.dongu1, T.deger2, T.dongu2, T.deger3, T.cta];

/* Spoken phrases -> word-level timing (spread by character length inside each phrase) */
type Seg = { text: string; a: number; b: number };
const SEGS: Seg[] = [
  { text: "ilk saniyede kaydırmayı durdurur.", a: 2.81, b: 4.59 },
  { text: "izleyiciye ne kazanacağını en baştan söyler.", a: 5.69, b: 8.23 },
  { text: "hemen işe yarayan bir şey verir.", a: 9.36, b: 10.92 },
  { text: "merak uyandırır, cevabı sonraya saklar.", a: 12.26, b: 14.57 },
  { text: "sonra yine değer.", a: 14.87, b: 16.06 },
  { text: "asıl önemli kısım birazdan…", a: 17.69, b: 19.12 },
  { text: "ve tekrar değer.", a: 19.41, b: 20.6 },
  { text: "harekete geçirici mesaj.", a: 23.34, b: 24.71 },
];
type Word = { w: string; t: number; seg: number };
const WORDS: Word[] = SEGS.flatMap((sg, si) => {
  const ws = sg.text.split(" ");
  const total = ws.reduce((n, w) => n + w.length + 1, 0);
  let acc = 0;
  return ws.map((w) => {
    const t = sg.a + ((sg.b - sg.a) * acc) / total;
    acc += w.length + 1;
    return { w, t, seg: si };
  });
});

/* ---------- Kinetic caption (current phrase, word-by-word) ---------- */
const Caption: React.FC<{ y: number; size?: number }> = ({ y, size = 66 }) => {
  const frame = useCurrentFrame();
  const now = frame / 30;
  // active segment = last one that started and hasn't been over for > 0.5s
  const si = SEGS.findIndex((sg) => now >= sg.a - 0.05 && now <= sg.b + 0.45);
  if (si < 0) return null;
  const words = WORDS.filter((w) => w.seg === si);
  const out = interpolate(now, [SEGS[si].b + 0.25, SEGS[si].b + 0.45], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: y,
        left: 90,
        right: 90,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.28em",
        fontFamily: fonts.display,
        fontWeight: 600,
        fontSize: size,
        lineHeight: 1.15,
        letterSpacing: "-0.02em",
        opacity: out,
        textAlign: "center",
      }}
    >
      {words.map((w, i) => {
        const p = prog(frame, s(w.t) - 2, 8);
        const live = now >= w.t && (i === words.length - 1 || now < words[i + 1].t);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: interpolate(p, [0, 1], [0.0, 1]),
              transform: `translateY(${(1 - p) * 24}px) scale(${0.9 + p * 0.1})`,
              filter: `blur(${(1 - p) * 8}px)`,
              color: live ? C.accent : C.fg,
            }}
          >
            {w.w}
          </span>
        );
      })}
    </div>
  );
};

/* ---------- The formula wheel ---------- */
const octagon = (r: number) =>
  Array.from({ length: 8 }, (_, i) => {
    const a = ((45 * i - 90 + 22.5) * Math.PI) / 180;
    return `${Math.cos(a) * r},${Math.sin(a) * r}`;
  }).join(" ");

/** Which node is active at a given time (-1 = overview) */
const activeAt = (t: number) => {
  if (t >= T.shot || t < T.kanca) return -1;
  let idx = 0;
  STEP_AT.forEach((st, i) => {
    if (t >= st) idx = i;
  });
  return idx;
};

const Wheel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const now = frame / fps;

  // rotation: spring toward -45° * step, accumulated per step for smooth motion
  let rot = 0;
  STEP_AT.forEach((st, i) => {
    if (i === 0) return;
    const sp = spring({ frame: frame - s(st) + 2, fps, config: { damping: 15, stiffness: 110 } });
    rot -= 45 * sp;
  });
  // final overview: spin back to 0 as we zoom out
  const back = spring({ frame: frame - s(T.shot) + 2, fps, config: { damping: 18, stiffness: 70 } });
  rot = rot * (1 - back);

  // camera: overview (small, centred) -> zoomed on top node -> overview again
  const zin = spring({ frame: frame - s(T.kanca) + 4, fps, config: { damping: 16, stiffness: 80 } });
  const zoomed = zin * (1 - back);
  const scale = interpolate(zoomed, [0, 1], [0.62, 1.55]);
  const cy = interpolate(zoomed, [0, 1], [1010, 1660]);
  const intro = spring({ frame, fps, config: { damping: 14, stiffness: 90 } });

  // during the "one more thing" break the wheel dims and blurs
  const brk = interpolate(now, [T.brk, T.brk + 0.3, T.cta - 0.2, T.cta + 0.2], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const act = activeAt(now);
  const R_CORE = 200;
  const R_NODE = 400;
  const pulse = 1 + Math.sin(frame / 6) * 0.015;

  return (
    <AbsoluteFill style={{ opacity: 1 - brk * 0.85, filter: `blur(${brk * 10}px)` }}>
      <svg width={1080} height={1920} style={{ position: "absolute", overflow: "visible" }}>
        <defs>
          <radialGradient id="core" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#1d1d1d" />
            <stop offset="100%" stopColor="#0d0d0d" />
          </radialGradient>
        </defs>
        <g transform={`translate(540 ${cy}) scale(${scale * intro})`}>
          <g transform={`rotate(${rot})`}>
            {/* outer guide ring */}
            <circle r={R_NODE} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={2} strokeDasharray="4 10" />
            {NODES.map((label, i) => {
              const ang = 45 * i - 90;
              const a = (ang * Math.PI) / 180;
              const grow = prog(frame, 6 + i * 3, 14);
              const isAct = i === act;
              const visited = act === -1 ? true : i <= act;
              const x1 = Math.cos(a) * (R_CORE + 8);
              const y1 = Math.sin(a) * (R_CORE + 8);
              const x2 = Math.cos(a) * (R_CORE + 8 + (R_NODE - R_CORE - 8) * grow);
              const y2 = Math.sin(a) * (R_CORE + 8 + (R_NODE - R_CORE - 8) * grow);
              const lx = Math.cos(a) * (R_NODE + 70);
              const ly = Math.sin(a) * (R_NODE + 70);
              const actP = isAct
                ? spring({ frame: frame - s(STEP_AT[i]), fps, config: { damping: 12, stiffness: 160 } })
                : 0;
              return (
                <g key={i}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={isAct ? C.accent : visited ? "rgba(245,245,245,0.55)" : "rgba(245,245,245,0.2)"}
                    strokeWidth={isAct ? 5 : 3}
                  />
                  <circle
                    cx={x2}
                    cy={y2}
                    r={isAct ? 16 + actP * 4 : 11}
                    fill={isAct ? C.accent : visited ? C.fg : "#3a3a3a"}
                    style={isAct ? { filter: "drop-shadow(0 0 18px rgba(226,98,5,0.9))" } : undefined}
                  />
                  {isAct && (
                    <circle cx={x2} cy={y2} r={16 + actP * 40} fill="none" stroke={C.accent} strokeWidth={3} opacity={1 - actP} />
                  )}
                  <g transform={`translate(${lx} ${ly}) rotate(${-rot})`}>
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontFamily={fonts.display}
                      fontWeight={isAct ? 700 : 500}
                      fontSize={isAct ? 62 + actP * 6 : 34}
                      letterSpacing="-0.02em"
                      fill={isAct ? C.fg : visited ? "rgba(245,245,245,0.8)" : "rgba(245,245,245,0.35)"}
                      opacity={grow * (isAct ? 1 : 1 - zoomed)}
                    >
                      {label}
                    </text>
                  </g>
                </g>
              );
            })}
            {/* core octagon */}
            <g transform={`scale(${pulse})`}>
              <polygon points={octagon(R_CORE + 22)} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={3} />
              <polygon
                points={octagon(R_CORE)}
                fill="url(#core)"
                stroke={C.accent}
                strokeWidth={5}
                style={{ filter: "drop-shadow(0 0 50px rgba(226,98,5,0.35))" }}
              />
              <polygon points={octagon(R_CORE - 18)} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={2} />
            </g>
          </g>
          {/* core label stays upright */}
          <text
            y={-18}
            textAnchor="middle"
            fontFamily={fonts.sans}
            fontWeight={500}
            fontSize={34}
            fill={C.muted}
            letterSpacing="0.04em"
          >
            Viral içeriğin
          </text>
          <text y={50} textAnchor="middle" fontFamily={fonts.serif} fontSize={86} fill={C.accent}>
            formülü
          </text>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/* ---------- Title (intro) ---------- */
const IntroTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, 0, 14);
  const out = interpolate(frame, [s(T.kanca) - 8, s(T.kanca)], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 330,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: p * out,
        transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 104, color: C.fg, letterSpacing: "-0.04em" }}>
        Viral içeriğin
      </div>
      <div style={{ fontFamily: fonts.serif, fontSize: 130, color: C.accent, lineHeight: 0.95 }}>formülü</div>
    </div>
  );
};

/* ---------- Step counter chip ---------- */
const StepChip: React.FC = () => {
  const frame = useCurrentFrame();
  const now = frame / 30;
  const act = activeAt(now);
  const vis = interpolate(now, [T.kanca, T.kanca + 0.3, T.shot - 0.3, T.shot], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  if (act < 0) return null;
  return (
    <div
      style={{
        position: "absolute",
        top: 260,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        gap: 14,
        opacity: vis,
      }}
    >
      {NODES.map((_, i) => (
        <div
          key={i}
          style={{
            width: i === act ? 54 : 16,
            height: 16,
            borderRadius: 8,
            background: i <= act ? C.accent : "rgba(255,255,255,0.15)",
          }}
        />
      ))}
    </div>
  );
};

/* ---------- "Ama bir şey daha var…" break ---------- */
const OneMoreThing: React.FC = () => {
  const frame = useCurrentFrame();
  const dur = s(T.cta - T.brk);
  const wipe = prog(frame, 0, 10);
  const words = ["Ama", "bir", "şey", "daha", "var…"];
  const wordAt = [s(21.53 - T.brk), s(21.85 - T.brk), s(22.05 - T.brk), s(22.25 - T.brk), s(22.45 - T.brk)];
  const outP = interpolate(frame, [dur - 8, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${wipe * 140 * (1 - outP)}% at 50% 50%)`,
        background: C.accent,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.25em", padding: "0 90px" }}>
        {words.map((w, i) => {
          const sp = spring({ frame: frame - wordAt[i], fps: 30, config: { damping: 11, stiffness: 180 } });
          const big = i >= 2;
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                fontFamily: big ? fonts.serif : fonts.display,
                fontWeight: big ? 400 : 800,
                fontSize: big ? 190 : 150,
                color: "#0b0b0b",
                letterSpacing: big ? "-0.01em" : "-0.04em",
                transform: `scale(${sp}) translateY(${(1 - sp) * 60}px)`,
                opacity: Math.min(1, sp * 1.5),
              }}
            >
              {w}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- CTA actions (kaydet / takip et / paylaş) ---------- */
const CtaIcons: React.FC = () => {
  const frame = useCurrentFrame();
  const items = [
    { label: "Kaydet", at: 25.03, d: "M6 3h12v18l-6-4-6 4z" },
    { label: "Takip et", at: 25.73, d: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9c0-4 3-6 7-6s7 2 7 6M19 4v6M16 7h6" },
    { label: "Paylaş", at: 26.52, d: "M21 3 3 10l7 3 3 7 8-17ZM10 13l5-5" },
  ];
  return (
    <div style={{ position: "absolute", top: 600, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 44 }}>
      {items.map((it) => {
        const sp = spring({ frame: frame - s(it.at - T.cta), fps: 30, config: { damping: 11, stiffness: 170 } });
        return (
          <div
            key={it.label}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              transform: `scale(${sp})`,
              opacity: Math.min(1, sp * 1.5),
            }}
          >
            <div
              style={{
                width: 150,
                height: 150,
                borderRadius: 40,
                background: C.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 20px 60px -15px rgba(226,98,5,0.7)",
              }}
            >
              <svg width={78} height={78} viewBox="0 0 24 24" fill="none" stroke="#0b0b0b" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                <path d={it.d} />
              </svg>
            </div>
            <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 38, color: C.fg }}>{it.label}</div>
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Screenshot finale ---------- */
const ScreenshotThis: React.FC = () => {
  const frame = useCurrentFrame();
  const p = prog(frame, 4, 14);
  const flash = interpolate(frame, [s(28.2 - T.shot), s(28.2 - T.shot) + 2, s(28.2 - T.shot) + 10], [0, 0.85, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const corner = prog(frame, 10, 16);
  const inset = interpolate(corner, [0, 1], [-40, 0]);
  const br = (rot: number, st: React.CSSProperties) => (
    <div
      style={{
        position: "absolute",
        width: 110,
        height: 110,
        borderTop: `7px solid ${C.accent}`,
        borderLeft: `7px solid ${C.accent}`,
        borderRadius: "18px 0 0 0",
        transform: `rotate(${rot}deg)`,
        opacity: corner,
        ...st,
      }}
    />
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", top: 300, left: 0, right: 0, textAlign: "center", opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 92, color: C.fg, letterSpacing: "-0.04em" }}>
          Bunun ekran
        </div>
        <div style={{ fontFamily: fonts.serif, fontSize: 116, color: C.accent, lineHeight: 0.95 }}>görüntüsünü al.</div>
      </div>
      {br(0, { left: 70 - inset, top: 600 - inset })}
      {br(90, { right: 70 - inset, top: 600 - inset })}
      {br(270, { left: 70 - inset, top: 1420 + inset })}
      {br(180, { right: 70 - inset, top: 1420 + inset })}
      <AbsoluteFill style={{ background: "#fff", opacity: flash }} />
    </AbsoluteFill>
  );
};

/* ---------- Audio ---------- */
const Sfx: React.FC<{ at: number; src: string; vol?: number }> = ({ at, src, vol = 1 }) => (
  <Sequence from={s(at)} layout="none">
    <Audio src={staticFile(`sfx/${src}.wav`)} volume={vol} />
  </Sequence>
);

/** Music volume envelope: full on the hook, ducked under speech, drop-out before the break, swell on the outro */
const musicVolume = (f: number) => {
  const t = f / 30;
  return interpolate(
    t,
    [0, 0.05, 1.2, 1.9, T.brk - 0.1, T.brk + 0.15, T.cta - 0.3, T.cta, T.shot + 1.4, T.outro, T.end - 1.2, T.end],
    [0, 0.42, 0.42, 0.16, 0.16, 0.0, 0.0, 0.2, 0.16, 0.5, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
};

const SoundDesign: React.FC = () => (
  <>
    <Audio src={staticFile("music02.mp3")} volume={musicVolume} />
    <Audio src={staticFile("vo02_a.mp3")} volume={1} />
    {STEP_AT.map((t) => (
      <Sfx key={`w${t}`} at={t - 0.12} src="whoosh" vol={0.18} />
    ))}
    {STEP_AT.map((t) => (
      <Sfx key={`p${t}`} at={t + 0.15} src="pop" vol={0.22} />
    ))}
    <Sfx at={T.brk + 0.5} src="boom" vol={0.8} />
    <Sfx at={T.cta} src="whoosh" vol={0.35} />
    <Sfx at={28.2} src="tick" vol={0.6} />
    <Sfx at={T.outro} src="boom" vol={0.45} />
  </>
);

/* ---------- Composition ---------- */
export const Reel02Formul: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.bg }}>
    <Background />
    <Sequence durationInFrames={s(T.outro)}>
      <SceneFade dur={s(T.outro)} inF={1} outF={10}>
        <Wheel />
        <IntroTitle />
        <StepChip />
        <Caption y={430} />
        <Sequence from={s(T.cta)} durationInFrames={s(T.shot - T.cta)}>
          <SceneFade dur={s(T.shot - T.cta)} inF={6} outF={6}>
            <CtaIcons />
          </SceneFade>
        </Sequence>
        <Sequence from={s(T.shot)}>
          <ScreenshotThis />
        </Sequence>
      </SceneFade>
    </Sequence>
    <Sequence from={s(T.brk)} durationInFrames={s(T.cta - T.brk)}>
      <OneMoreThing />
    </Sequence>
    <Sequence from={s(T.outro)}>
      <SceneFade dur={s(T.end - T.outro)} outF={1}>
        <Outro />
      </SceneFade>
    </Sequence>
    <Chrome total={REEL02_FRAMES} series="Günün Notu #02" />
    <SoundDesign />
  </AbsoluteFill>
);
