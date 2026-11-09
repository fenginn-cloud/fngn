"""EKSADO Quartz Series L Model Reels – İngilizce: ElevenLabs v3 (Olivia) seslendirmesi + altyazı + videonun kendi müziği. Sonda çağrı yok.
Kullanım: python3 kuvars_mix_en.py <vo.mp3> <vo.mp3> <video> <sfx_klasörü> <çıktı.wav> <altyazı.json>"""
import sys, os, json, subprocess, wave, re
import numpy as np
VO, CTA, VID, SFX, OUT, SUBJ = sys.argv[1:7]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (ana okuma, take 2): (kelime, başlangıç, bitiş)
W = [("Meet",0,.08),("the",.12,.24),("Quartz",.297,.64),("Series",.697,1.04),("L",1.16,1.28),("Model.",1.333,2.08),
 ("A",2.12,2.16),("premium",2.21,2.56),("home,",2.64,3.04),("crafted",3.09,3.44),("with",3.456,3.52),("care",3.6,3.92),("in",3.973,4.08),("every",4.12,4.32),("detail.",4.389,5.36),
 ("A",5.48,5.6),("sofa",5.68,6),("bed,",6.06,6.4),("a",6.44,6.48),("mini",6.528,6.72),("table",6.8,7.2),("and",7.24,7.36),("a",7.4,7.44),("TV",7.56,8),("put",8.06,8.24),("comfort",8.3,8.72),("first.",8.827,9.52),
 ("The",9.64,10),("kitchen",10.04,10.32),("comes",10.373,10.64),("with",10.672,10.8),("a",10.84,10.88),("hob,",10.96,11.28),("fridge",11.337,11.68),("and",11.74,11.92),("oven,",11.984,12.64),("plus",12.688,12.88),("a",12.92,12.96),("fifty-litre",13.013,13.6),("water",13.653,13.92),("heater.",13.977,14.64),
 ("A",14.92,15.2),("modern",15.246,15.52),("bathroom,",15.582,16.16),("with",16.176,16.24),("a",16.28,16.32),("walk-in",16.384,16.72),("shower.",16.789,17.52),
 ("Two",17.68,18.16),("separate",18.196,18.48),("bedrooms,",18.551,19.2),("for",19.22,19.28),("easy",19.344,19.6),("living.",19.657,20.32),
 ("Step",20.432,20.88),("up",20.933,21.04),("to",21.093,21.2),("the",21.22,21.28),("second,",21.36,21.92),("on",22,22.16),("softly",22.217,22.56),("lit",22.62,22.8),("stairs.",22.88,23.68),
 ("The",23.78,24.08),("elegance",24.133,24.56),("of",24.587,24.64),("quartz",24.709,25.12),("grey,",25.2,25.76),("the",25.78,25.84),("warmth",25.909,26.32),("of",26.373,26.48),("wood,",26.544,27.12),
 ("and",27.14,27.2),("the",27.22,27.28),("comfort",27.33,27.68),("of",27.733,27.84),("home,",27.904,28.24),("all",28.34,28.64),("in",28.72,28.88),("one.",28.92,29.36)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — önceki cümle bitmeden başlamaz (otomatik kaydırma)
P = [(0, 2.08, .20), (2.12, 5.36, 2.30), (5.48, 9.52, 5.60), (9.64, 14.64, 9.00), (14.92, 17.52, 13.20),
     (17.68, 20.32, 16.30), (20.432, 23.68, 19.20), (23.78, 27.12, 23.40), (27.14, 29.36, 26.70)]
CTA_SRC = None
src = dec(VO, 1)
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
    lo = quiet(a - .1, a + .02) if a > .05 else 0.0; hi = quiet(b - .02, b + .14)
    j = max(int((t - (a - lo)) * SR), prev + int(.04 * SR)); put(src[int(lo * SR):int(hi * SR)], j)
    shift.append((a, b, j / SR + (a - lo) - a))
# ---- altyazı parçaları (en fazla 4 kelime, noktalamada böl; "Los Angeles" birlikte) ----
def off(t):
    return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
chunks, cur = [], []
for i, (w, s, e) in enumerate(W):
    cur.append((w, s, e))
    nxt = W[i + 1][0] if i + 1 < len(W) else None
    if re.search(r'[.,:]$', w) or len(cur) == 4 or (nxt == 'Quartz'):
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
def html(ws):
    txt = ' '.join(w for w, _, _ in ws).rstrip('.,:')
    return txt.replace('Quartz Series L Model', '<b class="hl">Quartz Series L Model</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
subs = [x + ['dark'] if x[0] >= 26.55 else x for x in subs]  # logo beyaz zemini: koyu altyazı
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
