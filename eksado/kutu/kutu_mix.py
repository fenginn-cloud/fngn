"""EKSADO 3x9 Kutu Ev Reels: ElevenLabs v3 (Hale) kadın seslendirmesi + altyazı + videonun kendi müziği.
Kullanım: python3 kutu_mix.py <vo.mp3> <vo.mp3> <video> <sfx_klasörü> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, os, json, subprocess, wave, re
import numpy as np
VO, CTA, VID, SFX, OUT, SUBJ = sys.argv[1:7]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (ana okuma, take 2): (kelime, başlangıç, bitiş)
W = [("Karşınızda,",0,.72),("3×9",.8,1.28),("metre",1.333,1.6),("Kutu",1.66,1.92),("Ev.",2,2.48),
 ("Tamamen",2.52,2.88),("mobilyalı",2.94,3.44),("ve",3.467,3.52),("eşyalı.",3.6,4.16),
 ("Çamaşır",4.28,4.72),("makinesi,",4.78,5.28),("buzdolabı",5.307,5.76),("ve",5.813,5.92),("rahat",5.96,6.16),("bir",6.2,6.319),("yatak",6.32,6.56),("odası.",6.613,7.04),
 ("Banyosu",7.28,7.92),("da",7.947,8),("boileriyle,",8.069,8.8),("duşuyla",8.827,9.2),("eksiksiz.",9.24,10.2),
 ("Masif",10.29,10.64),("meşe",10.7,10.96),("tezgâh,",11.02,11.44),("ikili",11.52,11.84),("ocak,",11.92,12.32),("televizyon",12.364,12.8),("ünitesi",12.853,13.2),("ve",13.253,13.36),("klima.",13.424,14.04),
 ("Yirmi",14.18,14.48),("yedi",14.52,14.64),("metrekare.",14.7,15.28),("Dışarıdan",15.42,16.08),("kompakt,",16.16,16.72),("içeriden",16.784,17.28),("ferah.",17.34,17.76)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç)
P = [(0, 2.48, .30), (2.52, 4.16, 2.85), (4.28, 7.04, 4.45), (7.28, 10.2, 7.35), (10.29, 14.04, 10.70), (14.18, 17.76, 16.00)]
CTA_SRC = (17.92, 20.48)
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
CTA_T = 22.30; put(cta, int(CTA_T * SR))
# ---- altyazı parçaları (en fazla 4 kelime, noktalamada böl; "Los Angeles" birlikte) ----
def off(t):
    return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
chunks, cur = [], []
for i, (w, s, e) in enumerate(W):
    cur.append((w, s, e))
    nxt = W[i + 1][0] if i + 1 < len(W) else None
    if re.search(r'[.,:]$', w) or len(cur) == 4 or (nxt == 'Kutu' and len(cur) > 2):
        if w == 'Kutu': continue
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
def html(ws):
    txt = ' '.join(w for w, _, _ in ws).rstrip('.,:')
    return txt.replace('Kutu Ev', '<b class="hl">Kutu Ev</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
subs.append([round(CTA_T + .02, 3), round(CTA_T + 1.30, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 1.32, 3), 27.0, 'yorumlara <b class="hl big">Kutu Ev</b> yazın', 'dark'])
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik genel olarak -5 dB, konuşmada ek ~-4 dB ----
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 10 ** (-5 / 20) * (1 - .4 * np.clip(duck, 0, 1))
mix = music * g[:, None] + vo[:, None]
w = dec(os.path.join(SFX, 'simple-whoosh-382724.mp3'), 2)
i0 = int(2.95 * SR) - int(np.argmax(np.abs(w).max(1))); w = w[:N - i0] * 10 ** (-22 / 20); mix[i0:i0 + len(w)] += w
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print(len(subs), 'altyazı'); [print(s) for s in subs]
