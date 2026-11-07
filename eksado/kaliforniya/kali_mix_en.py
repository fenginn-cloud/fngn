"""EKSADO California Wood Reels – İngilizce: ElevenLabs v3 (Olivia) kadın seslendirmesi + altyazı + videonun kendi müziği.
Kullanım: python3 kali_mix_en.py <vo.mp3> <vo.mp3> <video> <sfx_klasörü> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, os, json, subprocess, wave, re
import numpy as np
VO, CTA, VID, SFX, OUT, SUBJ = sys.argv[1:7]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (ana okuma, take 2): (kelime, başlangıç, bitiş)
W = [("Custom-built",0,.56),("for",.58,.64),("Bulgaria:",.702,1.52),("the",1.54,1.6),("California",1.651,2.16),("Wood.",2.224,2.88),
 ("Come",2.944,3.2),("on",3.227,3.28),("in.",3.36,3.6),
 ("A",4.16,4.72),("sage-green",4.784,5.28),("kitchen,",5.34,5.92),("a",5.96,6),("retro",6.067,6.4),("fridge,",6.469,6.96),("a",7.04,7.12),("mini",7.168,7.36),("oven",7.424,7.68),("and",7.72,7.84),("a",7.88,7.92),("dishwasher.",7.971,8.56),
 ("Solid",8.68,9.28),("wood",9.328,9.52),("countertops",9.58,10.24),("and",10.26,10.32),("golden",10.377,10.72),("details.",10.8,11.44),
 ("Your",11.536,11.92),("own",11.96,12.08),("nook,",12.133,12.56),("by",12.613,12.72),("the",12.74,12.8),("pointed",12.85,13.2),("arched",13.253,13.52),("window.",13.577,14.24),
 ("Air",14.34,14.64),("conditioning,",14.689,15.36),("a",15.4,15.44),("smart",15.507,15.84),("TV,",15.92,16.32),("and",16.36,16.48),("a",16.62,16.76),("spacious",16.791,17.04),("loft",17.088,17.28),("above.",17.347,17.84),
 ("Nine",18,18.64),("metres",18.697,19.04),("long,",19.104,19.52),("29.8",19.566,20.48),("square",20.537,20.88),("metres.",20.949,21.68),
 ("The",21.76,22),("bathroom",22.044,22.4),("and",22.42,22.48),("toilet",22.537,22.88),("come",22.912,23.04),("ready,",23.093,23.52),("with",23.536,23.6),("a",23.64,23.68),("water",23.747,24.08),("heater.",24.137,24.56),
 ("And",24.68,25.04),("a",25.08,25.12),("separate",25.156,25.44),("bedroom.",25.5,26),("Comfort",26.08,26.64),("for",26.68,26.8),("up",26.853,26.96),("to",27.013,27.12),("four.",27.184,27.84)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç)
P = [(0, 2.88, .25), (2.944, 3.6, 3.20), (4.16, 8.56, 4.00), (8.68, 11.44, 8.50), (11.536, 14.24, 11.30), (14.34, 17.84, 14.05),
     (18.0, 21.68, 17.60), (21.76, 24.56, 21.35), (24.68, 27.84, 25.00)]
CTA_SRC = (27.92, 31.36)
src = dec(VO, 1); cta = src[int((CTA_SRC[0] - .06) * SR):int((CTA_SRC[1] + .15) * SR)]
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
CTA_T = 30.00; put(cta, int(CTA_T * SR))
# ---- altyazı parçaları (en fazla 4 kelime, noktalamada böl; "Los Angeles" birlikte) ----
def off(t):
    return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
chunks, cur = [], []
for i, (w, s, e) in enumerate(W):
    cur.append((w, s, e))
    nxt = W[i + 1][0] if i + 1 < len(W) else None
    if re.search(r'[.,:]$', w) or len(cur) == 4 or (nxt == 'California'):
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
def html(ws):
    txt = ' '.join(w for w, _, _ in ws).rstrip('.,:')
    return txt.replace('California Wood', '<b class="hl">California Wood</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
subs.append([round(CTA_T + .02, 3), round(CTA_T + 1.20, 3), 'For full details', 'dark'])
subs.append([round(CTA_T + 1.22, 3), 34.0, 'comment <b class="hl big">California Wood</b> below', 'dark'])
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
