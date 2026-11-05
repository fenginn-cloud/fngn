"""EKSADO Los Angeles (ahşap) Reels v2: ElevenLabs v3 (Evren/Adrian Vale) seslendirmesi + altyazı + videonun kendi müziği.
Kullanım: python3 la_mix2.py <ana_vo.mp3> <cta_vo.mp3> <video> <sfx_klasörü> <çıktı.wav> <altyazı.json>"""
import sys, os, json, subprocess, wave, re
import numpy as np
VO, CTA, VID, SFX, OUT, SUBJ = sys.argv[1:7]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (ana okuma, take 2): (kelime, başlangıç, bitiş)
W = [("Size,",0,.4),("Los",.44,.56),("Angeles",.62,1.04),("ahşabı",1.093,1.36),("tanıtacağım.",1.42,2.16),
 ("Dışarıda",2.3,3.04),("ahşabın",3.093,3.52),("sıcaklığı,",3.56,4.24),("içeride",4.336,4.88),("beyazın",4.947,5.36),("konforu.",5.44,6.24),
 ("Ferah",6.32,6.64),("bir",6.68,6.8),("oturma",6.853,7.12),("alanı,",7.173,7.52),("geniş",7.6,8),("pencereler",8.08,8.64),("ve",8.747,8.96),("üstte",9.04,9.44),("bir",9.48,9.6),("loft.",9.68,10.08),
 ("Mutfakta",10.36,11.12),("buzdolabı,",11.147,11.76),("ikili",11.813,12.16),("ocak,",12.213,12.64),("mini",12.672,12.8),("fırın",12.84,13.12),("ve",13.173,13.28),("bulaşık",13.32,13.68),("makinesi.",13.72,14.24),
 ("Hepsi",14.32,14.64),("standart.",14.711,15.36),
 ("Bağımsız",15.52,16.08),("yatak",16.12,16.4),("odası,",16.453,16.88),("yatağıyla",16.92,17.36),("birlikte",17.404,17.76),("geliyor.",17.82,18.32),
 ("Klima",18.48,18.88),("ve",18.933,19.04),("akıllı",19.12,19.44),("televizyon",19.484,19.92),("da",19.973,20.08),("dahil.",20.147,20.56),
 ("Ve",20.747,21.12),("banyo:",21.2,21.68),("duşu,",21.813,22.32),("lavabosu,",22.38,23.04),("tuvaletiyle",23.067,23.6),("eksiksiz.",23.66,24.44)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç)
P = [(0, 2.16, .30), (2.3, 6.24, 3.20), (6.32, 10.08, 7.30), (10.36, 14.24, 11.20), (14.32, 15.36, 15.20),
     (15.52, 18.32, 16.50), (18.48, 20.56, 19.45), (20.747, 24.44, 21.75)]
src = dec(VO, 1); cta = dec(CTA, 1)
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
CTA_T = 26.85; put(cta[int(.06 * SR):], int(CTA_T * SR))
# ---- altyazı parçaları (en fazla 4 kelime, noktalamada böl; "Los Angeles" birlikte) ----
def off(t):
    return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
chunks, cur = [], []
for i, (w, s, e) in enumerate(W):
    cur.append((w, s, e))
    nxt = W[i + 1][0] if i + 1 < len(W) else None
    if re.search(r'[.,:]$', w) or len(cur) == 4 or (nxt == 'Los'):
        if w == 'Los': continue
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
def html(ws):
    txt = ' '.join(w for w, _, _ in ws).rstrip('.,:')
    return txt.replace('Los Angeles', '<b class="hl">Los Angeles</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
subs.append([round(CTA_T + .02, 3), round(CTA_T + 1.15, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 1.17, 3), 31.0, 'yorumlara <b class="hl big">Los Angeles</b> yazın', 'dark'])
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik genel olarak -5 dB, konuşmada ek ~-4 dB ----
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 10 ** (-5 / 20) * (1 - .4 * np.clip(duck, 0, 1))
mix = music * g[:, None] + vo[:, None]
w = dec(os.path.join(SFX, 'simple-whoosh-382724.mp3'), 2)
i0 = int(3.05 * SR) - int(np.argmax(np.abs(w).max(1))); w = w[:N - i0] * 10 ** (-22 / 20); mix[i0:i0 + len(w)] += w
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print(len(subs), 'altyazı'); [print(s) for s in subs]
