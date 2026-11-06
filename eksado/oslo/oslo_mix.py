"""EKSADO Oslo Reels: ElevenLabs v3 (Hale) kadın seslendirmesi + altyazı + videonun kendi müziği.
Kullanım: python3 oslo_mix.py <vo.mp3> <vo.mp3> <video> <sfx_klasörü> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, os, json, subprocess, wave, re
import numpy as np
VO, CTA, VID, SFX, OUT, SUBJ = sys.argv[1:7]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (ana okuma, take 2): (kelime, başlangıç, bitiş)
W = [("Bir",0,.16),("ev",.213,.32),("düşünün...",.373,1.12),("İskandinav",1.16,1.68),("sadeliğinde.",1.76,2.56),
 ("Doğal",2.66,3.04),("ahşabın",3.093,3.52),("sıcaklığıyla.",3.56,4.4),("Verandasıyla,",4.54,5.68),("kapısını",5.72,6.08),("doğaya",6.12,6.48),("açan...",6.533,7.36),
 ("Karşınızda,",7.42,8.4),("Oslo.",8.48,8.88),("Dokuz",9.1,9.84),("metre,",9.893,10.32),("yirmi",10.36,10.56),("altı",10.608,10.8),("buçuk",10.853,11.04),("metrekare.",11.1,11.76),
 ("Ranzalı",11.92,12.48),("bir",12.5,12.56),("çocuk",12.613,12.88),("odası.",12.933,13.36),("Buzdolabı",13.6,14.32),("da,",14.347,14.48),("banyo",14.54,14.76),("da",14.773,14.8),("hazır.",14.867,15.28),
 ("Mini",15.36,15.68),("fırın,",15.74,16.04),("bulaşık",16.06,16.4),("makinesi,",16.46,16.96),("ikili",17.013,17.28),("ocak...",17.333,17.68),("hepsi",17.733,18),("standart.",18.053,18.64),
 ("Bir",18.78,19.2),("merdiven",19.26,19.68),("yukarıda...",19.737,20.52),("loft",20.576,20.8),("yatak",20.86,21.04),("odanız.",21.093,21.52),
 ("Masif",21.68,22.24),("ahşap",22.293,22.64),("tezgâh,",22.7,23.2),("ladin",23.24,23.52),("lambri.",23.584,24),("Beş",24.1,24.4),("kişiye",24.448,24.72),("kadar",24.76,24.96),("konfor.",25.04,25.6),
 ("Klima,",25.8,26.32),("akıllı",26.4,26.72),("televizyon",26.771,27.28),("ve",27.333,27.44),("termosifonuyla.",27.504,28.48),("Huzur,",28.76,29.56),("dokuz",29.61,29.84),("metreye",29.92,30.32),("sığdı.",30.36,30.8)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç)
P = [(0, 1.12, .50), (1.16, 2.56, 2.60), (2.66, 4.4, 5.50), (4.54, 7.36, 8.50), (7.42, 8.88, 12.20), (9.1, 11.76, 13.90),
     (11.92, 13.36, 16.90), (13.6, 15.28, 19.20), (15.36, 18.64, 28.00), (18.78, 21.52, 31.50), (21.68, 24.0, 37.00),
     (24.1, 25.6, 40.20), (25.8, 28.48, 46.80), (28.76, 30.8, 53.00)]
CTA_SRC = (30.98, 33.68)
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
CTA_T = 58.20; put(cta, int(CTA_T * SR))
# ---- altyazı parçaları (en fazla 4 kelime, noktalamada böl; "Los Angeles" birlikte) ----
def off(t):
    return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
chunks, cur = [], []
for i, (w, s, e) in enumerate(W):
    cur.append((w, s, e))
    nxt = W[i + 1][0] if i + 1 < len(W) else None
    if re.search(r'[.,:]$', w) or len(cur) == 4 or (nxt == 'Oslo.'):
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
def html(ws):
    txt = ' '.join(w for w, _, _ in ws).rstrip('.,:')
    return txt.replace('Oslo', '<b class="hl">Oslo</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
subs.append([round(CTA_T + .02, 3), round(CTA_T + 1.30, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 1.32, 3), 62.0, 'yorumlara <b class="hl big">Oslo</b> yazın', 'dark'])
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
