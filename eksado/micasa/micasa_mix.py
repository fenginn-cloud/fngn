"""EKSADO Micasa Reels: ElevenLabs v3 (Hale) kadın seslendirmesi + altyazı + videonun kendi müziği.
Kullanım: python3 micasa_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, json, subprocess, wave, re
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 1); ekranda görünen yazımla: (kelime, başlangıç, bitiş)
W = [("8",0,.24),("metrede,",.307,.8),("5",.84,.96),("kişilik",1.02,1.36),("bir",1.4,1.52),("ev",1.6,1.76),("mi?",1.813,2.08),("Micasa.",2.18,2.8),
 ("Thermowood",2.912,3.6),("cephe,",3.68,4.08),("geniş",4.173,4.64),("pencereler,",4.68,5.36),("bol",5.42,5.6),("gün",5.64,5.76),("ışığı.",5.84,6.16),
 ("Masif",6.26,6.72),("mutfak,",6.76,7.2),("ikili",7.253,7.52),("ocak",7.573,7.84),("ve",7.893,8),("mini",8.048,8.24),("buzdolabı.",8.267,8.8),
 ("Pencere",8.96,9.44),("önünde",9.486,9.76),("kahve",9.82,10.08),("keyfi.",10.14,10.56),
 ("Klima,",10.72,11.2),("akıllı",11.28,11.6),("televizyon",11.644,12.08),("ve",12.133,12.24),("iki",12.28,12.4),("loft.",12.464,12.8),
 ("Mini",12.88,13.2),("fırın",13.24,13.44),("da",13.467,13.52),("burada.",13.566,14),
 ("Duşlu",14.133,14.56),("banyo",14.64,14.92),("ve",14.933,14.96),("tuvalet,",15.04,15.64),("termosifonuyla",15.68,16.32),("hazır.",16.373,16.72),
 ("Merdivenler",16.82,17.52),("bile",17.568,17.76),("dolap.",17.8,18.16),
 ("Toplam",18.251,18.8),("26,5",18.88,19.6),("metrekare.",19.66,20.32)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–6,7 | mutfak 6,75 | pencere önü ~11,8 | genel/loft 14 | mini fırın 17,4 | banyo 18 | merdiven 21,75 | logo 26,5
P = [(0, 2.8, .30), (2.912, 6.16, 3.40), (6.26, 8.8, 7.50), (8.96, 10.56, 11.80), (10.72, 12.8, 14.00), (12.88, 14.0, 17.25),
     (14.133, 16.72, 18.60), (16.82, 18.16, 21.90), (18.251, 20.32, 23.60)]
CTA_SRC = (20.42, 23.04); CTA_T = 27.05
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
    lo = quiet(a - .1, a + .02) if a > .05 else 0.0; hi = quiet(b - .02, b + .09)
    j = max(int((t - (a - lo)) * SR), prev + int(.04 * SR)); put(src[int(lo * SR):int(hi * SR)], j)
    shift.append((a, b, j / SR + (a - lo) - a))
lo = quiet(CTA_SRC[0] - .09, CTA_SRC[0] + .02); put(src[int(lo * SR):int((CTA_SRC[1] + .15) * SR)], int((CTA_T - (CTA_SRC[0] - lo)) * SR))
# ---- altyazı: noktalamada böl; 24 karakteri aşan öbeği ortadan ikiye ayır ----
def off(t): return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
phr, cur = [], []
for w in W:
    cur.append(w)
    if re.search(r'[.,:?]$', w[0]): phr.append(cur); cur = []
if cur: phr.append(cur)
chunks = []
for p in phr:
    txt = ' '.join(w for w, _, _ in p)
    if len(txt) <= 24 or len(p) == 1: chunks.append(p); continue
    best = min(range(1, len(p)), key=lambda k: abs(len(' '.join(w for w, _, _ in p[:k])) - len(txt) / 2))
    chunks += [p[:best], p[best:]]
def html(ws):
    txt = ' '.join(w for w, _, _ in ws).rstrip('.,:')
    return txt.replace('Micasa', '<b class="hl">Micasa</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
subs.append([round(CTA_T - .03, 3), round(CTA_T + 1.31, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 1.33, 3), round(END, 3), 'yorumlara <b class="hl big">Micasa</b> yazın', 'dark'])
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
