"""EKSADO Kaliforniya Ahşap Reels: ElevenLabs v3 (Hale) kadın seslendirmesi + altyazı + videonun kendi müziği.
Kullanım: python3 kali_mix.py <vo.mp3> <vo.mp3> <video> <sfx_klasörü> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, os, json, subprocess, wave, re
import numpy as np
VO, CTA, VID, SFX, OUT, SUBJ = sys.argv[1:7]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (ana okuma, take 2): (kelime, başlangıç, bitiş)
W = [("Bulgaristan'a",0,.64),("özel",.704,.96),("üretim:",1.017,1.52),("Kaliforniya",1.54,2),("Ahşap.",2.08,2.68),
 ("Hadi,",2.74,3.12),("içeri",3.16,3.36),("girelim.",3.4,3.76),
 ("Adaçayı",3.9,4.48),("yeşili",4.533,4.8),("mutfak,",4.84,5.28),("retro",5.347,5.68),("buzdolabı,",5.733,6.32),("mini",6.416,6.8),("fırın",6.82,7.04),("ve",7.067,7.12),("bulaşık",7.16,7.52),("makinesi.",7.56,8.08),
 ("Masif",8.24,8.8),("tezgâh",8.86,9.28),("ve",9.307,9.36),("altın",9.413,9.68),("detaylar.",9.747,10.56),
 ("Sivri",10.68,10.96),("kemerli",11,11.36),("pencerenin",11.424,11.92),("önünde,",11.966,12.44),("kendi",12.473,12.64),("köşeniz.",12.7,13.28),
 ("Klima,",13.48,14.12),("akıllı",14.16,14.4),("televizyon",14.451,14.96),("ve",15.013,15.12),("üstte",15.2,15.52),("geniş",15.573,15.84),("bir",15.88,16),("loft.",16.08,16.8),
 ("Dokuz",16.86,17.24),("metre,",17.273,17.6),("29,8",17.64,18.64),("metrekare.",18.7,19.68),
 ("Banyo",19.72,20),("ve",20.027,20.08),("tuvalet,",20.133,20.72),("termosifonuyla",20.752,21.44),("hazır.",21.493,21.84),
 ("Ve",21.973,22.24),("ayrı",22.304,22.56),("bir",22.58,22.64),("yatak",22.7,22.88),("odası.",22.933,23.36),("Dört",23.48,23.68),("kişiye",23.728,24),("kadar",24.053,24.32),("konfor.",24.38,24.96)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç)
P = [(0, 2.68, .30), (2.74, 3.76, 3.10), (3.9, 8.08, 4.25), (8.24, 10.56, 8.50), (10.68, 13.28, 10.90), (13.48, 16.8, 13.60),
     (16.86, 19.68, 17.00), (19.72, 21.84, 20.00), (21.973, 24.96, 25.10)]
CTA_SRC = (25.1, 28.32)
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
    if re.search(r'[.,:]$', w) or len(cur) == 4 or (nxt == 'Kaliforniya'):
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
def html(ws):
    txt = ' '.join(w for w, _, _ in ws).rstrip('.,:')
    return txt.replace('Kaliforniya Ahşap', '<b class="hl">Kaliforniya Ahşap</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
subs.append([round(CTA_T + .02, 3), round(CTA_T + 1.30, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 1.32, 3), 34.0, 'yorumlara <b class="hl big">Kaliforniya Ahşap</b> yazın', 'dark'])
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
