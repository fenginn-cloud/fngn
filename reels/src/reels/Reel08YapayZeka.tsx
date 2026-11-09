// Reel 08 — "Yapay zekâ 5 dakikada site yapar mı?" → Saat değil, sonuç + sorumluluk satın.
// Word timings: src/reels/words08.ts (Scribe on public/vo08.mp3). The client site shown is a fictional business ("Liman Mobilya").
import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, Easing } from "remotion";
import { C, Chrome, FMark, HANDLE, fonts, s } from "../brand";
import { W08 } from "./words08";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const pr = (t: number, a: number, d = 0.45) => interpolate(t, [a, a + d], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
const spr = (frame: number, at: number, base: number, damping = 13, stiffness = 150) =>
  spring({ frame: frame - s(at - base), fps: 30, config: { damping, stiffness } });
const useT = (base: number) => useCurrentFrame() / 30 + base;
const MONO = "'Courier New', monospace";
const PANEL = "#141416";
const LINE = "rgba(255,255,255,0.1)";

const T = {
  hook: 0, gen: 1.2, quote: 2.78, reply: 4.88, del: 6.9,
  ask: 7.66, type: 9.4, card: 12.98,
  diff: 13.42, works: 15.8, neq: 18.58,
  q1: 19.94, q2: 21.52, q3: 23.46, q4: 25.16, q5: 28.1, q6: 29.64,
  ai: 33.54, code: 35.46, design: 35.92, content: 36.68,
  but: 37.88, c1: 39.2, c2: 40.24, c3: 41.52, c4: 43.28,
  quote2: 45.06, hours: 47.12, outcome: 48.26, plus: 49.36, resp: 50.46,
  turn: 51.48, end: 60.2,
};
export const REEL08_FRAMES = s(T.end);

/* ---------- caption ---------- */
type Line = { words: { w: string; a: number }[]; a: number; b: number };
const LINES: Line[] = (() => {
  const out: Line[] = [];
  let cur: { w: string; a: number }[] = [];
  let a = 0;
  W08.forEach(([w, ws, we], i) => {
    if (cur.length === 0) a = ws;
    cur.push({ w, a: ws });
    if (/[.,;:?!”]$/.test(w) || i === W08.length - 1) {
      out.push({ words: cur, a, b: we });
      cur = [];
    }
  });
  return out;
})();
const ACC = new Set(["müşteri", "beş", "dakikada", "açıklamaya", "soru", "başarmalı?”", "üretmekle", "çalışan", "farklı", "kim?", "oluyor?", "alınıyor?", "bağlanıyor?", "yapacak?", "açacak?", "yardımcı", "sorumluluk", "bu.", "satmayın,", "sonucu", "sorumluluk.", "ucuz", "yorumlarda"]);
const Caption: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const idx = LINES.findIndex((l, i) => t >= l.a - 0.05 && t < (LINES[i + 1]?.a ?? l.b + 0.8) && t < l.b + 1.0);
  if (idx < 0 || t > T.turn - 0.1) return null;
  const line = LINES[idx];
  const o = interpolate(t, [line.a - 0.05, line.a + 0.1, line.b + 0.7, line.b + 1.0], [0, 1, 1, 0], clamp);
  return (
    <div style={{ position: "absolute", top: 1520, left: 90, right: 90, opacity: o, display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0 0.26em", fontFamily: fonts.sans, fontWeight: 700, fontSize: 46, lineHeight: 1.25, textAlign: "center" }}>
      {line.words.map((w, i) => {
        const p = interpolate(t, [w.a - 0.05, w.a + 0.12], [0, 1], clamp);
        return <span key={i} style={{ color: interpolateColors(p, [0, 1], ["rgba(245,245,245,0.22)", ACC.has(w.w) ? C.accent : C.fg]) }}>{w.w}</span>;
      })}
    </div>
  );
};

/* ---------- shared: fictional client site + reply box ---------- */
const SiteMock: React.FC<{ w: number; build: number; dim?: number }> = ({ w, build, dim = 1 }) => {
  const k = w / 820;
  const part = (a: number) => interpolate(build, [a, a + 0.25], [0, 1], clamp);
  return (
    <div style={{ width: w, borderRadius: 22 * k, background: "#F5F2ED", overflow: "hidden", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)", opacity: dim }}>
      <div style={{ height: 46 * k, background: "#E7E2DA", display: "flex", alignItems: "center", gap: 8 * k, padding: `0 ${18 * k}px` }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => <div key={c} style={{ width: 13 * k, height: 13 * k, borderRadius: "50%", background: c }} />)}
        <div style={{ marginLeft: 18 * k, flex: 1, height: 24 * k, borderRadius: 12 * k, background: "#F5F2ED", fontFamily: fonts.sans, fontSize: 15 * k, color: "#8a8378", display: "flex", alignItems: "center", paddingLeft: 14 * k }}>limanmobilya.site</div>
      </div>
      <div style={{ padding: `${28 * k}px ${34 * k}px`, height: 470 * k, position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", opacity: part(0) }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 24 * k, color: "#151515" }}>Liman Mobilya</span>
          <span style={{ fontFamily: fonts.sans, fontSize: 16 * k, color: "#7a7368" }}>Ürünler · Hakkımızda · İletişim</span>
        </div>
        <div style={{ display: "flex", gap: 24 * k, marginTop: 30 * k }}>
          <div style={{ flex: 1, opacity: part(0.2), transform: `translateY(${(1 - part(0.2)) * 20}px)` }}>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 46 * k, lineHeight: 1.02, color: "#151515", letterSpacing: "-0.03em" }}>Evinize yakışan sade mobilyalar.</div>
            <div style={{ marginTop: 14 * k, fontFamily: fonts.sans, fontSize: 16 * k, color: "#7a7368" }}>El yapımı, uzun ömürlü, sizin için.</div>
            <div style={{ marginTop: 18 * k, display: "inline-block", padding: `${10 * k}px ${22 * k}px`, borderRadius: 999, background: "#151515", color: "#fff", fontFamily: fonts.sans, fontWeight: 600, fontSize: 15 * k }}>Keşfet</div>
          </div>
          <div style={{ width: 260 * k, height: 220 * k, borderRadius: 16 * k, background: `linear-gradient(135deg, #f0a35e, ${C.accent})`, opacity: part(0.4), transform: `scale(${0.9 + part(0.4) * 0.1})`, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", left: 40 * k, bottom: 30 * k, width: 180 * k, height: 70 * k, borderRadius: `${30 * k}px ${30 * k}px ${8 * k}px ${8 * k}px`, background: "rgba(255,255,255,0.55)" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 14 * k, marginTop: 30 * k }}>
          {["Hızlı teslimat", "Güvenli ödeme", "Destek"].map((l, i) => (
            <div key={l} style={{ flex: 1, height: 100 * k, borderRadius: 12 * k, background: "#EBE6DE", padding: 14 * k, opacity: part(0.6 + i * 0.1) }}>
              <div style={{ width: 22 * k, height: 22 * k, borderRadius: 6 * k, background: i === 1 ? "#151515" : C.accent }} />
              <div style={{ marginTop: 10 * k, fontFamily: fonts.sans, fontWeight: 600, fontSize: 15 * k, color: "#151515" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const ReplyBox: React.FC<{ text: string; shown: number; w?: number; caret?: boolean; strike?: number }> = ({ text, shown, w = 900, caret = true, strike = 0 }) => (
  <div style={{ width: w, minHeight: 230, borderRadius: 26, background: PANEL, border: `1.5px solid ${LINE}`, padding: "26px 30px", boxShadow: "0 30px 70px -30px rgba(0,0,0,0.9)", position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, fontFamily: fonts.sans, fontWeight: 600, fontSize: 24, color: C.muted }}>
      <div style={{ width: 34, height: 34, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><FMark size={24} dot={false} /></div>
      Müşteriye yanıt
    </div>
    <div style={{ marginTop: 18, fontFamily: fonts.sans, fontSize: 38, lineHeight: 1.35, color: C.fg, position: "relative" }}>
      <span style={{ textDecoration: strike > 0 ? "line-through" : "none", textDecorationColor: C.accent, opacity: 1 - strike * 0.6 }}>{text.slice(0, Math.floor(shown))}</span>
      {caret && <span style={{ display: "inline-block", width: 3, height: 40, background: C.accent, marginLeft: 3, verticalAlign: "-6px" }} />}
    </div>
    <div style={{ position: "absolute", right: 26, bottom: 22, width: 56, height: 56, borderRadius: "50%", background: shown > 3 ? C.accent : "#2a2a2c", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#0b0b0b" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M21 3 3 10l7 3 3 7 8-17Z" /></svg>
    </div>
  </div>
);
const Kicker: React.FC<{ text: string; o: number; top?: number }> = ({ text, o, top = 280 }) => (
  <div style={{ position: "absolute", top, left: 90, fontFamily: MONO, fontWeight: 700, fontSize: 26, letterSpacing: "0.25em", color: C.accent, opacity: o }}>{text}</div>
);

/* ---------- 1. Hook: "AI builds it in 5 minutes" ---------- */
const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(0);
  const prompt = "+ İşletme sitemi yap";
  const typed = Math.floor(interpolate(t, [0.1, 1.0], [0, prompt.length], clamp));
  const build = interpolate(t, [T.gen, 3.9], [0, 1], clamp);
  const secs = Math.max(0, Math.round(interpolate(t, [T.gen, 3.9], [300, 0], clamp)));
  const timer = `${String(Math.floor(secs / 60)).padStart(2, "0")}:${String(secs % 60).padStart(2, "0")}`;
  const shrink = pr(t, T.reply - 0.2, 0.6);
  const replyText = "Aslında düzgün bir site araştırma, strateji, UX, tasarım, geliştirme ve test ister. Yıllardır bu işi yapıyorum, o yüzden fiyatım…";
  const shown = interpolate(t, [T.reply + 0.2, T.del], [0, replyText.length], clamp);
  const del = pr(t, T.del - 0.1, 0.35);
  const quote = pr(t, T.quote, 0.4) * (1 - shrink);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 0, right: 0, top: interpolate(shrink, [0, 1], [290, 250]), display: "flex", flexDirection: "column", alignItems: "center", transform: `scale(${interpolate(shrink, [0, 1], [1, 0.62])})`, transformOrigin: "50% 0%" }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 22 }}>
          <div style={{ padding: "14px 28px", borderRadius: 999, background: "#1d1d20", border: `1.5px solid ${LINE}`, fontFamily: fonts.sans, fontWeight: 600, fontSize: 32, color: C.fg }}>{prompt.slice(0, typed)}<span style={{ color: C.accent }}>|</span></div>
          <div style={{ padding: "12px 20px", borderRadius: 12, background: secs === 0 ? "#3a0d10" : "#0a0a0a", border: `1.5px solid ${secs === 0 ? "#ff4d5e" : LINE}`, fontFamily: MONO, fontWeight: 700, fontSize: 34, color: secs === 0 ? "#ff6a7a" : C.fg, fontVariantNumeric: "tabular-nums" }}>{timer}</div>
        </div>
        <SiteMock w={860} build={build} />
      </div>
      <div style={{ position: "absolute", top: 1130, left: 0, right: 0, textAlign: "center", opacity: quote, transform: `translateY(${(1 - quote) * 20}px)` }}>
        <span style={{ fontFamily: fonts.serif, fontSize: 92, color: C.fg }}>“Yapay zekâ </span>
        <span style={{ fontFamily: fonts.serif, fontSize: 100, color: C.accent }}>5 dakikada</span>
        <span style={{ fontFamily: fonts.serif, fontSize: 92, color: C.fg }}> yapar.”</span>
      </div>
      <div style={{ position: "absolute", left: 90, top: 760, opacity: shrink, transform: `translateY(${(1 - shrink) * 40}px)` }}>
        <ReplyBox text={replyText} shown={shown * (1 - del)} strike={del} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", opacity: del, fontFamily: fonts.display, fontWeight: 800, fontSize: 74, color: C.fg, letterSpacing: "-0.04em" }}>
        Açıklamaya <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>çalışmayın.</span>
      </div>
      <div style={{ display: "none" }}>{frame}</div>
    </AbsoluteFill>
  );
};

/* ---------- 2. Ask one question ---------- */
const Ask: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.ask);
  const q = "Harika! Bu site işletmeniz için tam olarak ne başarmalı?";
  const shown = interpolate(t, [T.type, T.card - 0.2], [0, q.length], clamp);
  const card = spr(frame, T.card, T.ask, 12, 140);
  const thinking = t > T.card + 0.2;
  return (
    <AbsoluteFill>
      <Kicker text="BUNU SORUN" o={pr(t, T.ask)} />
      <div style={{ position: "absolute", top: 330, left: 90, opacity: pr(t, 7.8) * (1 - card) }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 120, color: C.fg, letterSpacing: "-0.05em", lineHeight: 1 }}>Tek bir</div>
        <div style={{ fontFamily: fonts.serif, fontSize: 150, color: C.accent, lineHeight: 1 }}>soru sorun.</div>
      </div>
      <div style={{ position: "absolute", left: 90, top: interpolate(card, [0, 1], [820, 340]), transform: `scale(${interpolate(card, [0, 1], [1, 1.02])})`, transformOrigin: "0 0" }}>
        {card < 0.5 ? (
          <ReplyBox text={q} shown={shown} />
        ) : (
          <div style={{ width: 900, padding: "44px 46px", borderRadius: 30, background: `linear-gradient(135deg, ${C.accentHi}, ${C.accent})`, boxShadow: "0 40px 90px -30px rgba(226,98,5,0.8)", fontFamily: fonts.display, fontWeight: 800, fontSize: 70, lineHeight: 1.08, color: "#0b0b0b", letterSpacing: "-0.03em" }}>
            Harika! Bu site işletmeniz için tam olarak ne <span style={{ textDecoration: "underline", textDecorationThickness: 6, textUnderlineOffset: 10 }}>başarmalı?</span>
          </div>
        )}
      </div>
      {thinking && (
        <div style={{ position: "absolute", left: 90, top: 820, display: "flex", alignItems: "center", gap: 16, fontFamily: fonts.sans, fontSize: 30, color: C.muted }}>
          <div style={{ display: "flex", gap: 7, padding: "12px 16px", borderRadius: 18, background: PANEL }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: C.fg, opacity: 0.3 + 0.7 * Math.abs(Math.sin(frame / 5 + i)) }} />)}
          </div>
          Müşteri düşünüyor…
        </div>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 3. Generated ≠ works for a business ---------- */
const Branch: React.FC<{ items: string[]; p: number; x: number; y: number }> = ({ items, p, x, y }) => (
  <>
    <svg width={1080} height={1920} style={{ position: "absolute", left: 0, top: 0 }}>
      {items.map((_, i) => {
        const ty = y - 120 + i * 80;
        return <path key={i} d={`M ${x} ${y} C ${x + 90} ${y}, ${x + 90} ${ty}, ${x + 190} ${ty}`} fill="none" stroke={C.accent} strokeWidth={3} pathLength={1} strokeDasharray={`${pr(p, i * 0.12, 0.4)} 1`} />;
      })}
    </svg>
    {items.map((l, i) => (
      <div key={l} style={{ position: "absolute", left: x + 196, top: y - 146 + i * 80, padding: "10px 22px", borderRadius: 12, background: PANEL, border: `1.5px solid ${LINE}`, fontFamily: fonts.sans, fontWeight: 600, fontSize: 28, color: C.fg, opacity: pr(p, 0.2 + i * 0.12, 0.3) }}>{l}</div>
    ))}
  </>
);
const Diff: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.diff);
  const top = spr(frame, T.diff, T.diff, 14, 120);
  const bot = spr(frame, T.works, T.diff, 14, 120);
  const neq = spr(frame, T.neq, T.diff, 10, 170);
  const branch = interpolate(t, [16.6, 17.8], [0, 1], clamp);
  const tag = (txt: string, o: number, hot?: boolean) => (
    <div style={{ display: "inline-block", padding: "8px 18px", borderRadius: 999, background: hot ? C.accent : "#2a2a2c", color: hot ? "#0b0b0b" : C.fg, fontFamily: fonts.sans, fontWeight: 700, fontSize: 24, marginBottom: 14, opacity: o }}>{txt}</div>
  );
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 280, transform: `scale(${top})`, transformOrigin: "0 0" }}>
        {tag("Üretildi", top)}
        <SiteMock w={520} build={1} />
      </div>
      <div style={{ position: "absolute", left: 60, right: 60, top: 860, height: 3, background: "rgba(255,255,255,0.15)" }} />
      <div style={{ position: "absolute", left: 540 - 50, top: 811, width: 100, height: 100, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 64, color: "#0b0b0b", transform: `scale(${neq})`, boxShadow: "0 0 40px rgba(226,98,5,0.7)" }}>≠</div>
      <div style={{ position: "absolute", left: 90, top: 960, transform: `scale(${bot})`, transformOrigin: "0 0" }}>
        {tag("İşletme için çalışan", bot, true)}
        <SiteMock w={380} build={1} />
      </div>
      <div style={{ opacity: bot }}>
        <Branch items={["Talepler", "Ödemeler", "CRM", "Destek"]} p={branch} x={480} y={1180} />
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 4. The five (+1) questions ---------- */
const QSTEPS = [T.q1, T.q2, T.q3, T.q4, T.q5];
const Grid: React.FC = () => (
  <AbsoluteFill style={{ background: "radial-gradient(800px 900px at 50% 70%, rgba(226,98,5,0.14), transparent 70%)" }}>
    <svg width={1080} height={1920} style={{ position: "absolute", opacity: 0.5 }}>
      {Array.from({ length: 16 }, (_, i) => <line key={`v${i}`} x1={i * 72} x2={540 + (i * 72 - 540) * 2.2} y1={900} y2={1920} stroke="rgba(226,98,5,0.12)" />)}
      {Array.from({ length: 12 }, (_, i) => <line key={`h${i}`} x1={0} x2={1080} y1={900 + i * i * 9} y2={900 + i * i * 9} stroke="rgba(226,98,5,0.1)" />)}
    </svg>
  </AbsoluteFill>
);
const QHead: React.FC<{ n: string; q: string; o: number }> = ({ n, q, o }) => (
  <div style={{ position: "absolute", left: 90, right: 90, top: 330, opacity: o, transform: `translateY(${(1 - o) * 20}px)` }}>
    <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: 32, color: C.accent }}>{n}</div>
    <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 84, lineHeight: 1.04, color: C.fg, letterSpacing: "-0.04em" }}>{q}</div>
  </div>
);
const Chip: React.FC<{ children: React.ReactNode; hot?: boolean; o?: number; style?: React.CSSProperties }> = ({ children, hot, o = 1, style }) => (
  <div style={{ padding: "16px 26px", borderRadius: 14, background: hot ? C.accent : PANEL, border: `1.5px solid ${hot ? C.accent : LINE}`, color: hot ? "#0b0b0b" : C.fg, fontFamily: fonts.sans, fontWeight: 700, fontSize: 32, opacity: o, boxShadow: hot ? "0 0 40px rgba(226,98,5,0.6)" : "none", whiteSpace: "nowrap", ...style }}>{children}</div>
);
const Questions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.q1);
  const step = t >= T.q6 ? 5 : t >= T.q5 ? 4 : t >= T.q4 ? 3 : t >= T.q3 ? 2 : t >= T.q2 ? 1 : 0;
  const local = t - [...QSTEPS, T.q6][step];
  const o = pr(local, 0, 0.35);
  const p = (a: number, d = 0.4) => pr(local, a, d);
  return (
    <AbsoluteFill style={{ background: "#070707" }}>
      <Grid />
      {/* progress segments */}
      <div style={{ position: "absolute", top: 250, left: 90, right: 90, display: "flex", gap: 10 }}>
        {QSTEPS.map((_, i) => <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i <= Math.min(step, 4) ? C.accent : "rgba(255,255,255,0.12)" }} />)}
      </div>
      {step === 0 && (
        <>
          <QHead n="01" q="Hedef müşteriniz kim?" o={o} />
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {Array.from({ length: 30 }, (_, i) => {
              const cx = 200 + (i % 6) * 136, cy = 760 + Math.floor(i / 6) * 120;
              const target = i === 15;
              const lock = p(0.6, 0.5);
              return <circle key={i} cx={cx} cy={cy} r={target ? 20 + lock * 8 : 18} fill={target ? interpolateColors(lock, [0, 1], ["#555", C.accent]) : `rgba(255,255,255,${0.35 - lock * 0.2})`} opacity={p(i * 0.012, 0.3)} />;
            })}
            <g opacity={p(0.4)} transform={`translate(${interpolate(p(0.3, 0.9), [0, 1], [300, 608])} ${interpolate(p(0.3, 0.9), [0, 1], [820, 1000])})`}>
              <circle r={70} fill="none" stroke={C.accent} strokeWidth={4} />
              <path d="M -100 0 H -50 M 50 0 H 100 M 0 -100 V -50 M 0 50 V 100" stroke={C.accent} strokeWidth={4} />
            </g>
          </svg>
          <div style={{ position: "absolute", left: 608 - 110, top: 1100, width: 220, textAlign: "center", opacity: p(1.0) }}><Chip hot>Müşteriniz</Chip></div>
        </>
      )}
      {step === 1 && (
        <>
          <QHead n="02" q="Biri form doldurunca ne oluyor?" o={o} />
          <div style={{ position: "absolute", left: 90, top: 760, width: 420, padding: 28, borderRadius: 22, background: PANEL, border: `1.5px solid ${LINE}`, opacity: p(0.1) }}>
            {["Ad Soyad", "Telefon", "Mesaj"].map((l) => <div key={l} style={{ height: 52, borderRadius: 10, background: "#1f1f22", marginBottom: 14, fontFamily: fonts.sans, fontSize: 24, color: C.muted, display: "flex", alignItems: "center", paddingLeft: 16 }}>{l}</div>)}
            <div style={{ height: 60, borderRadius: 12, background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 26, color: "#0b0b0b", transform: `scale(${local > 0.6 && local < 0.75 ? 0.94 : 1})` }}>Talep gönder</div>
          </div>
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {[0, 1, 2].map((i) => <path key={i} d={`M 512 960 C 590 960, 590 ${820 + i * 140}, 660 ${820 + i * 140}`} fill="none" stroke={i === 2 && local > 1.2 ? C.accent : "rgba(245,245,245,0.4)"} strokeWidth={3} pathLength={1} strokeDasharray={`${p(0.6 + i * 0.12)} 1`} />)}
          </svg>
          {["E-posta?", "WhatsApp?", "CRM?"].map((l, i) => (
            <div key={l} style={{ position: "absolute", left: 670, top: 790 + i * 140 }}><Chip o={p(0.75 + i * 0.12)} hot={i === 2 && local > 1.2}>{i === 2 && local > 1.2 ? "CRM ✓" : l}</Chip></div>
          ))}
        </>
      )}
      {step === 2 && (
        <>
          <QHead n="03" q="Ödemeler nasıl alınıyor?" o={o} />
          {["Sepet", "Ödeme altyapısı", "Banka", "Sipariş onaylandı"].map((l, i) => {
            const on = local > 0.4 + i * 0.3;
            return (
              <React.Fragment key={l}>
                <div style={{ position: "absolute", left: 270, top: 740 + i * 150, width: 540 }}><Chip hot={on && i === 3} o={p(0.1 + i * 0.15)} style={{ textAlign: "center", border: `1.5px solid ${on ? C.accent : LINE}` }}>{l}</Chip></div>
                {i < 3 && <div style={{ position: "absolute", left: 538, top: 830 + i * 150, width: 4, height: 60, background: on ? C.accent : "rgba(255,255,255,0.15)", opacity: p(0.2 + i * 0.15) }} />}
              </React.Fragment>
            );
          })}
        </>
      )}
      {step === 3 && (
        <>
          <QHead n="04" q="Site mevcut sistemlerinize nasıl bağlanıyor?" o={o} />
          <svg width={1080} height={1920} style={{ position: "absolute" }}>
            {[[220, 830], [860, 830], [220, 1250], [860, 1250]].map(([x, y], i) => <line key={i} x1={540} y1={1040} x2={540 + (x - 540) * p(0.4 + i * 0.12)} y2={1040 + (y - 1040) * p(0.4 + i * 0.12)} stroke={C.accent} strokeWidth={3} />)}
          </svg>
          <div style={{ position: "absolute", left: 540 - 110, top: 1040 - 110, width: 220, height: 220, borderRadius: "50%", background: C.accent, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: `scale(${spr(frame, T.q4 + 0.1, T.q1, 11, 160)})`, boxShadow: "0 0 70px rgba(226,98,5,0.7)", fontFamily: fonts.display, fontWeight: 800, fontSize: 40, color: "#0b0b0b" }}>Site</div>
          {[["CRM", 120, 790], ["Stok", 760, 790], ["Muhasebe", 90, 1210], ["E-posta", 750, 1210]].map(([l, x, y], i) => (
            <div key={l as string} style={{ position: "absolute", left: x as number, top: y as number }}><Chip o={p(0.55 + i * 0.12)}>{l}</Chip></div>
          ))}
        </>
      )}
      {step === 4 && (
        <>
          <QHead n="05" q="Bakımını kim yapacak?" o={o} />
          <div style={{ position: "absolute", left: -200 - local * 160, top: 900, display: "flex", gap: 120, fontFamily: fonts.sans, fontWeight: 600, fontSize: 32, color: C.muted }}>
            {["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu"].map((m, i) => (
              <div key={m} style={{ position: "relative", width: 80, textAlign: "center" }}>
                {(i === 1 || i === 4 || i === 6) && <div style={{ position: "absolute", top: -64, left: -30, padding: "6px 14px", borderRadius: 999, background: C.accent, color: "#0b0b0b", fontSize: 22, fontWeight: 700 }}>{i === 4 ? "Yedek" : "Güncelleme"}</div>}
                {m}
              </div>
            ))}
          </div>
          <div style={{ position: "absolute", left: 540 - 90, top: 1060, width: 180, height: 180, borderRadius: "50%", border: `4px dashed ${C.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 110, color: C.accent, opacity: p(0.4) }}>?</div>
        </>
      )}
      {step === 5 && (
        <>
          <div style={{ position: "absolute", left: 90, right: 90, top: 420, padding: "26px 30px", borderRadius: 24, background: "#1a1a1d", border: "1.5px solid rgba(255,77,94,0.5)", transform: `translateY(${(1 - p(0, 0.35)) * -120}px)`, opacity: p(0, 0.3), display: "flex", gap: 20, alignItems: "center", boxShadow: "0 20px 60px -20px rgba(0,0,0,0.9)" }}>
            <div style={{ width: 54, height: 54, borderRadius: 14, background: "#ff4d5e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.display, fontWeight: 800, fontSize: 36, color: "#fff" }}>!</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: fonts.sans, fontSize: 24, color: C.muted }}><span>Mağaza uyarısı</span><span>02:14</span></div>
              <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 36, color: C.fg }}>Ödeme başarısız</div>
              <div style={{ fontFamily: fonts.sans, fontSize: 26, color: C.muted }}>Müşteriler ödeme yapamıyor.</div>
            </div>
          </div>
          <div style={{ position: "absolute", left: 90, top: 760, opacity: p(1.8), transform: `translateY(${(1 - p(1.8)) * 20}px)` }}>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 116, color: C.fg, letterSpacing: "-0.05em", lineHeight: 1 }}>Telefonu</div>
            <div style={{ fontFamily: fonts.serif, fontSize: 140, color: C.accent, lineHeight: 1 }}>kim açacak?</div>
          </div>
          <div style={{ position: "absolute", left: 760, top: 1060, transform: `rotate(${Math.sin(frame * 1.6) * 12 * (local > 2 ? 1 : 0)}deg)`, opacity: p(2.0) }}>
            <svg width={160} height={160} viewBox="0 0 24 24" fill="none" stroke={C.accent} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z" /></svg>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

/* ---------- 5. AI can help ---------- */
const AiCard: React.FC<{ label: string; o: number; children: React.ReactNode }> = ({ label, o, children }) => (
  <div style={{ width: 900, padding: "22px 28px", borderRadius: 22, background: PANEL, border: `1.5px solid ${LINE}`, opacity: o, transform: `translateY(${(1 - o) * 30}px)`, marginBottom: 22 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.2em", color: C.muted }}>
      {label}
      <span style={{ padding: "4px 14px", borderRadius: 999, background: "#2a2a2c", color: C.fg, letterSpacing: 0, fontFamily: fonts.sans, fontSize: 22 }}>+ YZ</span>
    </div>
    <div style={{ marginTop: 14 }}>{children}</div>
  </div>
);
const AiHelp: React.FC = () => {
  const t = useT(T.ai);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 300, opacity: pr(t, T.ai) }}>
        <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 104, color: C.fg, letterSpacing: "-0.05em", lineHeight: 1 }}>Yapay zekâ</div>
        <div style={{ fontFamily: fonts.serif, fontSize: 130, color: C.accent, lineHeight: 1 }}>yardımcı olabilir.</div>
      </div>
      <div style={{ position: "absolute", left: 90, top: 680 }}>
        <AiCard label="KOD" o={pr(t, T.code)}>
          <div style={{ fontFamily: MONO, fontSize: 28, lineHeight: 1.4, color: C.fg }}><span style={{ color: C.accent }}>&lt;section class="hero"&gt;</span><br />&nbsp;&nbsp;&lt;h1&gt;{"{başlık}"}&lt;/h1&gt;<br />&lt;/section&gt;</div>
        </AiCard>
        <AiCard label="TASARIM" o={pr(t, T.design)}>
          <div style={{ display: "flex", gap: 12 }}><div style={{ flex: 2, height: 70, borderRadius: 10, background: "rgba(226,98,5,0.35)" }} /><div style={{ flex: 1, height: 70, borderRadius: 10, background: "#2a2a2c" }} /><div style={{ flex: 1, height: 70, borderRadius: 10, background: "#2a2a2c" }} /></div>
        </AiCard>
        <AiCard label="İÇERİK" o={pr(t, T.content)}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 600, fontSize: 32, color: C.fg }}>Evinize yakışan sade mobilyalar.</div>
        </AiCard>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 6. But someone still needs to… ---------- */
const Check: React.FC<{ on: number }> = ({ on }) => (
  <div style={{ width: 54, height: 54, borderRadius: "50%", border: `3px solid ${on > 0.5 ? C.accent : "rgba(255,255,255,0.2)"}`, background: on > 0.5 ? C.accent : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${0.85 + on * 0.15})` }}>
    {on > 0.5 && <svg width={30} height={30} viewBox="0 0 24 24" fill="none" stroke="#0b0b0b" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round"><path d="M4 12.5 9.5 18 20 6" /></svg>}
  </div>
);
const Someone: React.FC = () => {
  const t = useT(T.but);
  const items: [string, number][] = [["İşi anlaması", T.c1], ["Kararları vermesi", T.c2], ["Her şeyi test etmesi", T.c3], ["Sorumluluk alması", T.c4]];
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, top: 280, display: "flex", gap: 12, opacity: pr(t, T.but) }}>
        {["Kod", "Tasarım", "İçerik"].map((l) => <span key={l} style={{ padding: "6px 18px", borderRadius: 999, border: `1.5px solid ${LINE}`, fontFamily: fonts.sans, fontSize: 24, color: C.muted }}>✓ {l}</span>)}
      </div>
      <div style={{ position: "absolute", left: 90, top: 380, fontFamily: fonts.sans, fontWeight: 600, fontSize: 58, color: C.muted, opacity: pr(t, T.but) }}>Ama birinin hâlâ…</div>
      <div style={{ position: "absolute", left: 90, top: 560 }}>
        {items.map(([l, a], i) => {
          const on = pr(t, a, 0.3);
          const last = i === 3;
          return (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 30, marginBottom: 54, opacity: 0.35 + on * 0.65 }}>
              <Check on={on} />
              <span style={{ fontFamily: last ? fonts.serif : fonts.display, fontWeight: last ? 400 : 800, fontSize: last ? 104 : 80, letterSpacing: last ? 0 : "-0.04em", color: last && on > 0.5 ? C.accent : C.fg, textDecoration: last && on > 0.5 ? "underline" : "none", textUnderlineOffset: 12 }}>{l}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 7–8. Quotation: don't sell hours, sell the outcome ---------- */
const Quotation: React.FC = () => {
  const frame = useCurrentFrame();
  const t = useT(T.quote2);
  const rows = ["Strateji ve planlama", "Tasarım ve geliştirme", "Entegrasyonlar", "Test", "Sürekli destek", "Sorumluluk"];
  const hours = pr(t, T.hours, 0.35);
  const strike = pr(t, 47.5, 0.35);
  const sellO = pr(t, T.outcome, 0.4);
  const head = t < T.hours ? 0 : t < T.outcome ? 1 : 2;
  const o1 = spr(frame, T.plus, T.quote2, 10, 170);
  const o2 = spr(frame, T.resp, T.quote2, 10, 170);
  const cardDown = pr(t, T.plus - 0.2, 0.5);
  return (
    <AbsoluteFill>
      <div style={{ position: "absolute", left: 90, right: 90, top: 290, minHeight: 260 }}>
        {head === 0 && (
          <div style={{ opacity: pr(t, T.quote2) }}>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 90, color: C.fg, letterSpacing: "-0.045em", lineHeight: 1.02 }}>Asıl ücretini aldığınız</div>
            <div style={{ fontFamily: fonts.serif, fontSize: 112, color: C.accent, lineHeight: 1 }}>şey bu.</div>
          </div>
        )}
        {head === 1 && <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 112, color: C.fg, letterSpacing: "-0.05em" }}>Saat satmayın.</div>}
        {head === 2 && (
          <div style={{ opacity: sellO }}>
            <div style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 112, color: C.fg, letterSpacing: "-0.05em", lineHeight: 1 }}>Sonucu</div>
            <div style={{ fontFamily: fonts.serif, fontSize: 140, color: C.accent, lineHeight: 1 }}>satın.</div>
          </div>
        )}
      </div>
      <div style={{ position: "absolute", left: 140, right: 140, top: 640, padding: "30px 34px", borderRadius: 24, background: "#F5F2ED", boxShadow: "0 40px 90px -30px rgba(0,0,0,0.9)", opacity: 1 - cardDown, transform: `translateY(${cardDown * 80}px) scale(${1 - cardDown * 0.1})` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: fonts.display, fontWeight: 800, fontSize: 44, color: "#151515" }}>Teklif</span>
          <span style={{ fontFamily: MONO, fontSize: 20, color: "#8a8378", letterSpacing: "0.1em" }}>İŞLETMENİZ İÇİN</span>
        </div>
        {hours > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid #e2dcd2", fontFamily: fonts.sans, fontSize: 30, color: "#8a8378", opacity: hours, position: "relative" }}>
            <span>Kodlama saati</span><span style={{ fontFamily: MONO, fontSize: 24 }}>× saatlik ücret</span>
            <div style={{ position: "absolute", left: -6, top: "50%", height: 4, width: `${strike * 102}%`, background: "#ff4d5e", borderRadius: 2 }} />
          </div>
        )}
        {rows.map((r, i) => {
          const last = i === rows.length - 1;
          const on = pr(t, 45.2 + i * 0.12, 0.3);
          return (
            <div key={r} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 12px", margin: last ? "6px -12px 0" : 0, borderRadius: last ? 12 : 0, background: last ? "rgba(226,98,5,0.14)" : "transparent", borderBottom: last ? "none" : "1px solid #e2dcd2", fontFamily: fonts.sans, fontWeight: last ? 800 : 500, fontSize: 32, color: "#151515", opacity: on }}>
              {r}
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: last ? C.accent : "#d6d0c6", boxShadow: last ? "0 0 12px rgba(226,98,5,0.8)" : "none" }} />
            </div>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ transform: `scale(${o1})`, opacity: Math.min(1, o1 * 2), padding: "26px 70px", borderRadius: 999, background: C.accent, fontFamily: fonts.display, fontWeight: 800, fontSize: 72, color: "#0b0b0b", boxShadow: "0 0 60px rgba(226,98,5,0.6)" }}>Sonuç</div>
        <div style={{ fontFamily: fonts.display, fontWeight: 300, fontSize: 80, color: C.muted, opacity: o2 }}>+</div>
        <div style={{ transform: `scale(${o2})`, opacity: Math.min(1, o2 * 2), padding: "26px 70px", borderRadius: 999, background: C.fg, fontFamily: fonts.display, fontWeight: 800, fontSize: 72, color: "#0b0b0b" }}>Sorumluluk</div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 9. Your turn ---------- */
const YourTurn: React.FC = () => {
  const t = useT(T.turn);
  const typed = "Ne olduğunu anlat…";
  const shown = Math.floor(interpolate(t, [54.8, 56.2], [0, typed.length], clamp));
  const send = pr(t, 56.4, 0.3);
  const logo = pr(t, 57.0, 0.5);
  const out = interpolate(t, [T.end - 0.6, T.end], [1, 0], clamp);
  return (
    <AbsoluteFill style={{ opacity: out }}>
      <Kicker text="SIRA SENDE" o={pr(t, T.turn)} top={300} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 360, fontFamily: fonts.display, fontWeight: 800, fontSize: 86, lineHeight: 1.06, letterSpacing: "-0.045em", color: C.fg }}>
        <span style={{ opacity: pr(t, 51.48) }}>Size de </span>
        <span style={{ opacity: pr(t, 52.14) }}>“yapay zekâ var, daha </span>
        <span style={{ opacity: pr(t, 53.44), fontFamily: fonts.serif, fontWeight: 400, color: C.accent, fontSize: 100 }}>ucuz</span>
        <span style={{ opacity: pr(t, 53.72) }}> olmalı” dendi mi?</span>
      </div>
      <div style={{ position: "absolute", left: 90, right: 90, top: 820, opacity: pr(t, 54.6), display: "flex", alignItems: "center", gap: 18, padding: "18px 18px 18px 22px", borderRadius: 999, background: "#F5F2ED", boxShadow: "0 30px 70px -30px rgba(0,0,0,0.9)" }}>
        <div style={{ width: 66, height: 66, borderRadius: "50%", background: "#151515", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: fonts.sans, fontWeight: 700, fontSize: 24 }}>Sen</div>
        <div style={{ flex: 1, fontFamily: fonts.sans, fontWeight: 600, fontSize: 38, color: "#151515" }}>{typed.slice(0, shown)}<span style={{ color: C.accent }}>|</span></div>
        <div style={{ width: 76, height: 76, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", transform: `scale(${1 + send * 0.12})`, boxShadow: `0 0 ${30 * send}px rgba(226,98,5,0.8)` }}>
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#0b0b0b" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round"><path d="M21 3 3 10l7 3 3 7 8-17Z" /></svg>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 960, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 28, letterSpacing: "0.25em", color: C.muted, opacity: pr(t, 55.5) }}>YORUMLARA YAZ ↓</div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1110, display: "flex", flexDirection: "column", alignItems: "center", gap: 18, opacity: logo, transform: `translateY(${(1 - logo) * 20}px)` }}>
        <div style={{ width: 150, height: 150, borderRadius: 38, background: "#0c0c0c", border: `2px solid ${LINE}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 30px 80px -30px rgba(226,98,5,0.6)" }}><FMark size={130} /></div>
        <div style={{ fontFamily: fonts.display, fontWeight: 700, fontSize: 56, color: C.fg }}>FNGN <span style={{ fontFamily: fonts.serif, fontWeight: 400, color: C.accent }}>Dijital</span></div>
        <div style={{ fontFamily: fonts.sans, fontSize: 32, color: C.muted }}>{HANDLE} · fngn.com.tr</div>
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
const musicVolume = (f: number) => {
  const t = f / 30;
  return interpolate(t, [0, 0.05, 0.9, 1.4, 56.4, 57.0, T.end - 1.2, T.end], [0, 0.45, 0.45, 0.22, 0.22, 0.55, 0.55, 0], clamp);
};
const SoundDesign: React.FC = () => (
  <>
    <Audio src={staticFile("music08.mp3")} startFrom={s(3)} volume={musicVolume} />
    <Audio src={staticFile("vo08.mp3")} volume={1} />
    {Array.from({ length: 8 }, (_, i) => <Sfx key={`k${i}`} at={0.15 + i * 0.11} src="tick" vol={0.18} />)}
    <Sfx at={3.9} src="pop" vol={0.3} />
    <Sfx at={T.del} src="whoosh" vol={0.3} />
    <Sfx at={T.card} src="boom" vol={0.45} />
    <Sfx at={T.neq} src="pop" vol={0.35} />
    {[...QSTEPS, T.q6].map((a) => <Sfx key={`q${a}`} at={a - 0.08} src="whoosh" vol={0.25} />)}
    <Sfx at={T.q6} src="boom" vol={0.5} />
    {[T.code, T.design, T.content].map((a) => <Sfx key={`a${a}`} at={a} src="pop" vol={0.25} />)}
    {[T.c1, T.c2, T.c3, T.c4].map((a) => <Sfx key={`c${a}`} at={a} src="tick" vol={0.45} />)}
    <Sfx at={47.5} src="whoosh" vol={0.3} />
    <Sfx at={T.plus} src="pop" vol={0.35} />
    <Sfx at={T.resp} src="boom" vol={0.45} />
    <Sfx at={56.4} src="pop" vol={0.3} />
  </>
);

/* ---------- Composition ---------- */
const Fade: React.FC<{ dur: number; children: React.ReactNode; inF?: number; outF?: number }> = ({ dur, children, inF = 6, outF = 6 }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, inF, dur - outF, dur], [0, 1, 1, 0], clamp);
  const b = interpolate(frame, [dur - outF, dur], [0, 10], clamp);
  return <AbsoluteFill style={{ opacity: o, filter: `blur(${b}px)` }}>{children}</AbsoluteFill>;
};
const scenes: { from: number; to: number; C: React.FC; inF?: number; outF?: number }[] = [
  { from: 0, to: T.ask, C: Hook, inF: 1 },
  { from: T.ask, to: T.diff, C: Ask },
  { from: T.diff, to: T.q1, C: Diff },
  { from: T.q1, to: T.ai, C: Questions },
  { from: T.ai, to: T.but, C: AiHelp },
  { from: T.but, to: T.quote2, C: Someone },
  { from: T.quote2, to: T.turn, C: Quotation },
  { from: T.turn, to: T.end, C: YourTurn, outF: 1 },
];
export const Reel08YapayZeka: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: "#080808" }}>
    <AbsoluteFill style={{ background: "radial-gradient(1100px 1300px at 50% 30%, #131313, #060606 75%)" }} />
    {scenes.map(({ from, to, C: Scene, inF, outF }, i) => {
      const dur = s(to) - s(from);
      return (
        <Sequence key={i} from={s(from)} durationInFrames={dur}>
          <Fade dur={dur} inF={inF} outF={outF}>
            <Scene />
          </Fade>
        </Sequence>
      );
    })}
    <Caption />
    <Chrome total={REEL08_FRAMES} />
    <SoundDesign />
  </AbsoluteFill>
);
