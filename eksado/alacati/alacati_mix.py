"""EKSADO Alaçatı Reels: ElevenLabs v3 (Hale) kadın seslendirmesi + altyazı + videonun kendi müziği + yorum çağrısı.
Kullanım: python3 alacati_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, json, subprocess, wave, re
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 2); ekranda görünen yazımla
W = [("Diyagonal",0,.48),("ahşap,",.56,1.16),("beyaz",1.193,1.36),("metal",1.413,1.68),("cephe.",1.74,2.2),("Karşınızda",2.25,2.72),("Alaçatı.",2.78,3.48),
 ("Geniş",3.53,3.76),("camlı,",3.84,4.24),("ferah",4.28,4.56),("bir",4.58,4.64),("oturma",4.693,4.96),("alanı.",5.027,5.6),
 ("Akıllı",5.68,6),("televizyon",6.044,6.48),("ve",6.507,6.56),("klima,",6.624,7.04),("standart.",7.111,7.92),
 ("Mutfakta",8.04,8.64),("ikili",8.693,8.96),("ocak,",9.013,9.36),("mini",9.408,9.6),("fırın",9.64,9.84),("ve",9.893,10),("davlumbaz",10.06,10.56),("hazır.",10.613,10.96),
 ("Ve",11.093,11.36),("bağımsız",11.413,11.84),("bir",11.86,11.92),("yatak",11.96,12.16),("odası.",12.213,12.88),
 ("Mini",12.928,13.12),("buzdolabı",13.173,13.6),("ve",13.653,13.76),("termosifon",13.808,14.4),("da",14.427,14.48),("dahil.",14.547,14.96),
 ("Duşakabinli",15.093,15.84),("banyo",15.88,16.2),("ve",16.213,16.24),("tuvalet.",16.32,16.88),
 ("23",17.04,17.52),("metrekare,",17.58,18.24),("5",18.28,18.4),("kişilik",18.44,18.8),("konaklama.",18.84,19.36),
 ("Dolap",19.5,20),("merdivenden",20.06,20.64),("çıkın,",20.7,21.28),("loft",21.328,21.52),("sizi",21.568,21.76),("bekliyor.",21.82,22.32)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | oturma 5 | merdiven+TV 7,5 | mutfak 10 | yatak odası 15 |
# mutfak/koridor 17 | banyo 20,3 | genel 25 | loft'a çıkış 27 | kapanış animasyonu 33,3
P = [(0, 2.2, .30), (2.25, 3.48, 2.75), (3.53, 5.6, 5.10), (5.68, 7.92, 7.70), (8.04, 10.96, 11.00), (11.093, 12.88, 15.10),
     (12.928, 14.96, 17.40), (15.093, 16.88, 21.30), (17.04, 19.36, 24.90), (19.5, 22.32, 28.60)]
CTA_SRC = (22.44, 25.28); CTA_T = 33.70
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
    j = max(int((t - (a - lo)) * SR), prev + int(.04 * SR))
    if j / SR + (a - lo) > t + .01: print(f'  kaydırıldı +{j / SR + (a - lo) - t:.2f} sn @ {t}')
    put(src[int(lo * SR):int(hi * SR)], j); shift.append((a, b, j / SR + (a - lo) - a))
lo = quiet(CTA_SRC[0] - .09, CTA_SRC[0] + .02); put(src[int(lo * SR):int((CTA_SRC[1] + .15) * SR)], int((CTA_T - (CTA_SRC[0] - lo)) * SR))
# ---- altyazı: noktalamada böl, 24 karakteri aşanı ortadan böl, yan yana kısa öbekleri birleştir ----
def off(t): return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
def L(p): return len(' '.join(w for w, _, _ in p).rstrip('.,:?'))
phr, cur = [], []
for w in W:
    cur.append(w)
    if re.search(r'[.,:?]$', w[0]): phr.append(cur); cur = []
if cur: phr.append(cur)
def split(p):
    if L(p) <= 24 or len(p) == 1: return [p]
    k = min(range(1, len(p)), key=lambda k: abs(L(p[:k]) - L(p) / 2) + (99 if p[k - 1][0] in ('ve', 'bir', 'da', 'ile') else 0)); return split(p[:k]) + split(p[k:])  # bağlaçla bitirme
chunks = []
for p in phr:
    for c in split(p):
        if chunks and L(chunks[-1] + c) <= 24 and not chunks[-1][-1][0].endswith('.') and abs(off(chunks[-1][0][1]) - off(c[0][1])) < 1e-6:
            chunks[-1] = chunks[-1] + c
        else: chunks.append(c)
def html(ws):
    return ' '.join(w for w, _, _ in ws).rstrip('.,:').replace('Alaçatı', '<b class="hl">Alaçatı</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
# kapanış beyaz zeminde: koyu yazı (logonun ve eksado.com'un altında)
subs.append([round(CTA_T - .03, 3), round(CTA_T + 1.28, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 1.30, 3), round(END, 3), 'yorumlara <b class="hl big">Alaçatı</b> yazın', 'dark'])
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik -3 dB, konuşmada ek -6 dB (konuşma bitince geri yükselir); seslendirme konuşmada müziğin ~10 dB üstünde ----
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
