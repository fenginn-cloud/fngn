"""EKSADO İstanbul (Avusturya özel üretim) Reels: ElevenLabs v3 (Hale) kadın seslendirmesi + altyazı + videonun kendi müziği + yorum çağrısı.
Kullanım: python3 istanbul_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, json, subprocess, wave, re
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 1); ekranda görünen yazımla
W = [("Avusturya'ya",0,.56),("özel",.608,.8),("üretim:",.857,1.44),("İstanbul.",1.502,2.08),
 ("Thermowood",2.256,3.12),("cephe,",3.18,3.6),("antrasit",3.68,4.16),("doğramalar.",4.2,4.88),
 ("Adaçayı",5.06,5.76),("yeşili",5.787,6.08),("mutfakta,",6.14,6.8),("çamaşır",6.88,7.2),("makinesi",7.26,7.68),("bile",7.712,7.84),("var.",7.92,8.24),
 ("Masif",8.36,8.8),("tezgâh,",8.88,9.36),("dörtlü",9.413,9.76),("ocak,",9.813,10.16),("fırın",10.2,10.4),("ve",10.453,10.56),("davlumbaz.",10.62,11.36),
 ("Sivri",11.56,12),("pencerenin",12.048,12.48),("önünde,",12.537,12.96),("ferah",13.06,13.44),("bir",13.48,13.6),("oturma",13.653,13.92),("alanı.",13.973,14.4),
 ("Taş",14.54,14.96),("lavabolu",15,15.44),("banyo",15.48,15.76),("ve",15.787,15.84),("tuvalet,",15.893,16.32),("termosifonuyla",16.416,17.28),("hazır.",17.347,17.76),
 ("Klima",18.04,18.56),("ve",18.587,18.64),("akıllı",18.693,18.96),("televizyon",19.004,19.44),("da",19.467,19.52),("standart.",19.591,20.56),
 ("Dolap",20.66,21.12),("merdivenle",21.2,21.84),("loft'a",21.904,22.28),("çıkın.",22.31,22.56),
 ("24",22.72,23.2),("metrekare,",23.26,23.92),("4",23.952,24.08),("kişilik",24.12,24.48),("konfor.",24.54,25.12)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | iç uzun plan + çamaşır makinesi 5 | mutfak 7,5 |
# oturma/sivri pencere 12,3 | banyo 15 | genel 20 | merdiven 22,5 | loft 25 | kapanış animasyonu 30,2
P = [(0, 2.08, .30), (2.256, 4.88, 2.50), (5.06, 8.24, 5.25), (8.36, 11.36, 8.60), (11.56, 14.4, 12.00), (14.54, 17.76, 15.20),
     (18.04, 20.56, 20.00), (20.66, 22.56, 22.70), (22.72, 25.12, 25.60)]
CTA_SRC = (25.26, 27.92); CTA_T = 30.60
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
    k = min(range(1, len(p)), key=lambda k: abs(L(p[:k]) - L(p) / 2) + (99 if p[k - 1][0] in ('ve', 'bir', 'da', 'ile', 'akıllı') else 0)); return split(p[:k]) + split(p[k:])  # bağlaçla bitirme
chunks = []
for p in phr:
    for c in split(p):
        if chunks and L(chunks[-1] + c) <= 26 and not chunks[-1][-1][0].endswith('.') and abs(off(chunks[-1][0][1]) - off(c[0][1])) < 1e-6:
            chunks[-1] = chunks[-1] + c
        else: chunks.append(c)
def html(ws):
    return ' '.join(w for w, _, _ in ws).rstrip('.,:').replace('İstanbul', '<b class="hl">İstanbul</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
# kapanış beyaz zeminde: koyu yazı (logonun ve eksado.com'un altında)
subs.append([round(CTA_T - .03, 3), round(CTA_T + 1.33, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 1.35, 3), round(END, 3), 'yorumlara <b class="hl big">İstanbul</b> yazın', 'dark'])
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
