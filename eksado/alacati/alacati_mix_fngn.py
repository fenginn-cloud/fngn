"""EKSADO Alaçatı Reels: ElevenLabs v3 "fngn dijital vol1" (kullanıcının kendi klon sesi) seslendirmesi + altyazı + videonun kendi müziği + yorum çağrısı.
Kullanım: python3 alacati_mix_fngn.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, json, subprocess, wave, re
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 1); ekranda görünen yazımla
W = [("Diyagonal",0,.56),("ahşap,",.667,1.36),("beyaz",1.4,1.6),("metal",1.667,2),("cephe.",2.06,2.6),("Karşınızda",2.65,3.28),("Alaçatı.",3.38,4.16),
 ("Geniş",4.36,5.12),("camlı,",5.2,5.6),("ferah",5.66,5.92),("bir",5.98,6.16),("oturma",6.24,6.56),("alanı.",6.627,7.12),
 ("Akıllı",7.28,8.08),("televizyon",8.109,8.4),("ve",8.453,8.56),("klima,",8.64,9.12),("standart.",9.2,9.92),
 ("Mutfakta",10.16,10.96),("ikili",11.013,11.36),("ocak,",11.413,11.76),("mini",11.808,12),("fırın",12.06,12.32),("ve",12.373,12.48),("davlumbaz",12.56,13.2),("hazır.",13.267,13.76),
 ("Ve",13.947,14.32),("bağımsız",14.382,14.88),("bir",14.92,15.04),("yatak",15.08,15.36),("odası.",15.413,15.92),
 ("Mini",16.016,16.4),("buzdolabı",16.453,16.96),("ve",17.013,17.12),("termosifon",17.184,17.84),("da",17.893,18),("dahil.",18.067,18.56),
 ("Duşakabinli",18.667,19.52),("banyo",19.6,20),("ve",20.053,20.16),("tuvalet.",20.24,20.88),
 ("23",21.12,21.76),("metrekare,",21.82,22.56),("5",22.6,22.72),("kişilik",22.78,23.2),("konaklama.",23.24,23.92),
 ("Dolap",24.06,24.64),("merdivenden",24.7,25.28),("çıkın,",25.36,25.84),("loft",25.92,26.24),("sizi",26.288,26.48),("bekliyor.",26.54,27.04)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | oturma 5 | merdiven+TV 7,5 | mutfak 10 | yatak odası 15 |
# mutfak/koridor 17 | banyo 20,3 | genel 25 | loft'a çıkış 27 | kapanış animasyonu 33,3
P = [(0, 2.6, .25), (2.65, 4.16, 2.95), (4.36, 7.12, 4.95), (7.28, 9.92, 7.85), (10.16, 13.76, 10.75), (13.947, 15.92, 15.00),
     (16.016, 18.56, 17.30), (18.667, 20.88, 21.10), (21.12, 23.92, 24.80), (24.06, 27.04, 28.30)]
CTA_SRC = (27.18, 30.32); CTA_T = 33.60
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
subs.append([round(CTA_T - .03, 3), round(CTA_T + 1.40, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 1.42, 3), round(END, 3), 'yorumlara <b class="hl big">Alaçatı</b> yazın', 'dark'])
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
