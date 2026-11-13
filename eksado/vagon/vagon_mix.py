"""EKSADO Vagon Ahşap 9 günlük kampanya Reels (1.270.000 TL), düzeltilmiş 28,4 sn video.
HOOK=1 ortam değişkeniyle başa 3,2 sn "ışıklar yanıyor" kancası eklenir: müzik kancada kısık başlar, ışık yanınca açılır;
klik + parıltı + geçiş swoosh efektleri; tüm seslendirme ve altyazılar 3,2 sn kayar. Görüntü: vagon_hook_frames.py: ElevenLabs v3 (Hale) kadın seslendirmesi + altyazı + videonun kendi müziği + yorum çağrısı.
Kullanım: [HOOK=1] python3 vagon_mix.py <vo.mp3> <video> <sfx_klasörü> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, json, subprocess, wave, re
import numpy as np
VO, VID, SFX, OUT, SUBJ = sys.argv[1:6]
import os
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2)
HOOK = os.environ.get('HOOK') == '1'; H = 3.2 if HOOK else 0.0; HSRC = 10.0  # kanca görüntüsü ve müziği ışıklı merdiven planından (10. sn)
if HOOK:
    hm = music[int(HSRC * SR):int((HSRC + H) * SR)].copy(); tt = np.arange(len(hm)) / SR
    env = np.where(tt < .92, .16 * np.clip(tt / .3, 0, 1), np.clip(.16 + (tt - .92) / .08 * .84, 0, 1))  # karanlıkta kısık, ışıkla açılır
    f_ = int(.03 * SR); env[-f_:] *= np.linspace(1, 0, f_); hm *= env[:, None]
    m0 = music.copy(); m0[:f_] *= np.linspace(0, 1, f_)[:, None]; music = np.concatenate([hm, m0])
N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 1); ekranda görünen yazımla
W = [("Dünyada",0,.48),("bu",.533,.64),("vagon",.68,.96),("modelini",1,1.36),("üreten",1.4,1.76),("tek",1.8,1.92),("marka:",1.984,2.4),("EKSADO.",2.52,3.12),
 ("Kavisli",3.4,4),("çatı,",4.04,4.4),("Thermowood",4.48,5.04),("cephe:",5.1,5.52),("Vagon",5.56,5.84),("Ahşap.",5.92,6.4),
 ("Köşe",6.587,7.12),("koltuklu",7.16,7.52),("oturma",7.573,7.92),("alanı,",7.973,8.44),("klima",8.48,8.72),("ve",8.773,8.88),("akıllı",8.933,9.52),("televizyon.",9.549,9.92),
 ("9",11.74,12),("güne",12.027,12.16),("özel,",12.224,12.56),("1.270.000 TL.",12.6,14.48),
 ("İkili",14.6,14.88),("ocak,",14.96,15.36),("fırın",15.4,15.68),("ve",15.707,15.76),("mini",15.808,16),("buzdolabıyla",16.027,16.56),("mutfak",16.6,16.88),("hazır.",16.947,17.36),
 ("Duşlu",17.493,17.92),("banyo",17.96,18.28),("ve",18.293,18.32),("tuvalet.",18.4,18.96),
 ("Işıklı",19.12,19.64),("merdivenden",19.67,20.16),("çıkın,",20.22,20.56),("loft",20.64,20.96),("sizi",21.008,21.2),("bekliyor.",21.26,21.76),
 ("Bu",21.893,22.16),("fiyat",22.213,22.48),("sadece",22.537,22.88),("9",22.92,23.12),("gün",23.16,23.28),("geçerli.",23.35,24.08)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — düzeltilmiş videoda sahneler: dış cephe 0–4,4 | oturma 4,5 |
# ışıklı merdiven + mutfak 8,5 | mutfak 13,5 | banyo 16,5 | merdivenden çıkış 18,5 | loft 21,5 | kapanış animasyonu 24,4
P = [(0, 3.12, .15), (3.4, 6.4, 3.32), (6.587, 9.92, 6.40), (11.74, 14.48, 9.85), (14.6, 17.36, 13.40), (17.493, 18.96, 16.50),
     (19.12, 21.76, 18.60), (21.893, 24.08, 21.60)]  # kısa video: "Ve şimdi kampanyada" çıkarıldı, fiyat "9 güne özel" ile başlar
P = [(a, b, t + H) for a, b, t in P]
CTA_SRC = (24.12, 26.72); CTA_T = 24.75 + H
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
    k = min(range(1, len(p)), key=lambda k: abs(L(p[:k]) - L(p) / 2) + (99 if p[k - 1][0] in ('ve', 'bir', 'da', 'ile', 'akıllı', 'mini') else 0)); return split(p[:k]) + split(p[k:])  # bağlaçla bitirme
chunks = []
for p in phr:
    for c in split(p):
        if chunks and L(chunks[-1] + c) <= 26 and not chunks[-1][-1][0].endswith('.') and abs(off(chunks[-1][0][1]) - off(c[0][1])) < 1e-6:
            chunks[-1] = chunks[-1] + c
        else: chunks.append(c)
def html(ws):
    return ' '.join(w for w, _, _ in ws).rstrip('.,:').replace('Vagon Ahşap', '<b class="hl">Vagon Ahşap</b>').replace('1.270.000 TL', '<b class="hl big">1.270.000 TL</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
# kapanış beyaz zeminde: koyu yazı (logonun ve eksado.com'un altında)
subs.append([round(CTA_T - .03, 3), round(CTA_T + 0.91, 3), 'Detaylı bilgi için', 'dark'])
subs.append([round(CTA_T + 0.93, 3), round(END, 3), 'yorumlara <b class="hl">Vagon Ahşap</b> yazın', 'dark sm'])
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik -3 dB, konuşmada ek -6 dB (konuşma bitince geri yükselir); seslendirme konuşmada müziğin ~10 dB üstünde ----
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 10 ** (-3 / 20) * (1 - .5 * np.clip(duck, 0, 1))
mus = music * g[:, None]
rm = np.sqrt((mus[speech] ** 2).mean() + 1e-12); rv = np.sqrt((vo[speech] ** 2).mean() + 1e-12)
vo *= (rm * 10 ** (10 / 20)) / rv
fx = np.zeros(N)
if HOOK:  # hafif kanca efektleri
    def sfx(name):
        raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{SFX}/{name}', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
        a = np.frombuffer(raw, dtype=np.float32).astype(float); return a / (np.sqrt((a ** 2).mean()) + 1e-9)
    def add(a, t, db):
        j = int(t * SR); a = a[:max(0, N - j)]; fx[j:j + len(a)] += a * rm * 10 ** (db / 20)
    add(sfx('App Click 1.wav'), .84, -2); add(sfx('benkirb-shine-1-268902.mp3'), .93, -12); add(sfx('swoosh-014-383768.mp3'), H - .55, -4)
mix = mus + vo[:, None] + fx[:, None]
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print(len(subs), 'altyazı'); [print(s) for s in subs]
