"""EKSADO Micasa Reels – İngilizce: ElevenLabs v3 (Olivia) seslendirmesi + altyazı + videonun kendi müziği. Sonda çağrı yok.
Kullanım: python3 micasa_mix_en.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>
Okuma 32 sn, video 30 sn: %4 hızlandırılır, "Even a mini oven." ve "in total" çıkarılır."""
import sys, json, subprocess, wave, re
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000; TEMPO = 1.04
def dec(p, ch, af=None):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn'] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (take 1, hızlandırma öncesi); ekranda görünen yazımla
W = [("8",0,.08),("metres.",.171,.8),("Room",.896,1.28),("for",1.32,1.44),("five.",1.552,2.32),("Meet",2.48,3.12),("Micasa.",3.16,4.44),
 ("Thermowood",4.54,5.28),("on",5.307,5.36),("the",5.38,5.44),("outside,",5.52,6.16),("and",6.2,6.32),("wide",6.384,6.64),("windows",6.7,7.12),("that",7.152,7.28),("let",7.32,7.44),("the",7.46,7.52),("daylight",7.573,8),("in.",8.08,8.64),
 ("A",8.88,9.12),("solid",9.187,9.52),("wood",9.552,9.68),("kitchen,",9.74,10.24),("with",10.256,10.32),("a",10.36,10.4),("two-ring",10.48,10.96),("hob",11.04,11.28),("and",11.32,11.439),("a",11.44,11.441),("mini",11.488,11.68),("fridge.",11.749,12.56),
 ("Your",12.624,12.88),("morning",12.92,13.2),("coffee,",13.257,13.68),("right",13.72,13.92),("by",13.973,14.08),("the",14.1,14.16),("window.",14.229,14.96),
 ("Air",15.14,15.68),("conditioning,",15.735,16.48),("a",16.52,16.56),("smart",16.627,16.96),("TV,",17.08,17.52),("and",17.54,17.6),("two",17.68,17.92),("lofts.",18,18.56),
 ("A",20.52,21.04),("bathroom",21.093,21.52),("with",21.552,21.68),("a",21.72,21.76),("shower,",21.817,22.32),("and",22.34,22.4),("a",22.44,22.48),("water",22.533,22.8),("heater,",22.846,23.24),("ready",23.26,23.36),("to",23.413,23.52),("go.",23.6,24.16),
 ("Stairs",24.347,24.96),("that",24.976,25.04),("double",25.074,25.28),("as",25.333,25.44),("storage.",25.52,26.16),
 ("26.5",26.274,27.68),("square",27.737,28.08),("metres.",28.137,28.48),
 ("Micasa.",29.8,30.64),("Made",30.784,31.36),("for",31.4,31.52),("living.",31.566,32.16)]
W = [(w, s / TEMPO, e / TEMPO) for w, s, e in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–6,7 | mutfak 6,75 | pencere önü ~11,7 | genel/loft 13,9 | banyo 18 | merdiven 21,75 | logo 26,5
P = [(0, 4.44, .15), (4.54, 8.64, 4.55), (8.88, 12.56, 8.45), (12.624, 14.96, 11.95), (15.14, 18.56, 14.25),
     (20.52, 24.16, 18.15), (24.347, 26.16, 21.85), (26.274, 28.48, 23.75), (29.8, 32.16, 26.95)]
P = [(a / TEMPO, b / TEMPO, t) for a, b, t in P]
src = dec(VO, 1, f'atempo={TEMPO}')
env = np.sqrt(np.convolve(src ** 2, np.ones(480) / 480, 'same') + 1e-12)
def quiet(lo, hi):
    i0, i1 = max(0, int(lo * SR)), min(len(src) - 1, int(hi * SR))
    return (i0 + int(np.argmin(env[i0:i1 + 1]))) / SR if i1 > i0 else lo
vo = np.zeros(N); speech = np.zeros(N, bool); prev = 0; shift = []
def put(seg, j):
    global prev
    f = int(.012 * SR); seg = seg.copy(); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    seg = seg[:max(0, N - j)]; vo[j:j + len(seg)] += seg; speech[j:j + len(seg)] = True; prev = j + len(seg)
for a, b, t in P:
    lo = quiet(a - .1, a + .02) if a > .05 else 0.0; hi = quiet(b - .02, b + .09)
    j = max(int((t - (a - lo)) * SR), prev + int(.04 * SR))
    if j / SR + (a - lo) > t + .01: print(f'  kaydırıldı +{j / SR + (a - lo) - t:.2f} sn @ {t}')
    put(src[int(lo * SR):int(hi * SR)], j); shift.append((a, b, j / SR + (a - lo) - a))
print('son konuşma biter:', round(prev / SR, 2), '/', round(N / SR, 2))
# ---- altyazı: noktalamada böl, 26 karakteri aşanı ortadan böl, yan yana kısa öbekleri birleştir ----
def off(t): return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
def L(p): return len(' '.join(w for w, _, _ in p).rstrip('.,:?'))
phr, cur = [], []
for w in W:
    cur.append(w)
    if re.search(r'[.,:?]$', w[0]): phr.append(cur); cur = []
if cur: phr.append(cur)
def split(p):
    if L(p) <= 26 or len(p) == 1: return [p]
    k = min(range(1, len(p)), key=lambda k: abs(L(p[:k]) - L(p) / 2)); return split(p[:k]) + split(p[k:])
chunks = []
for p in phr:
    for c in split(p):
        if chunks and L(chunks[-1] + c) <= 26 and not chunks[-1][-1][0].endswith('.') and abs(off(chunks[-1][0][1]) - off(c[0][1])) < 1e-6:
            chunks[-1] = chunks[-1] + c
        else: chunks.append(c)
def html(ws):
    return ' '.join(w for w, _, _ in ws).rstrip('.,:').replace('Micasa', '<b class="hl">Micasa</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(min(en, N / SR), 3), html(c)])
subs = [x + ['dark'] if x[0] >= 26.5 else x for x in subs]  # logo beyaz zemini: koyu altyazı
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik -3 dB, konuşmada ek -6 dB; seslendirme konuşmada müziğin ~10 dB üstünde ----
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 10 ** (-3 / 20) * (1 - .5 * np.clip(duck, 0, 1))
mus = music * g[:, None]
rm = np.sqrt((mus[speech] ** 2).mean() + 1e-12); rv = np.sqrt((vo[speech] ** 2).mean() + 1e-12)
vo *= (rm * 10 ** (10 / 20)) / rv
mix = mus + vo[:, None]
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print(len(subs), 'altyazı'); [print(s) for s in subs]
