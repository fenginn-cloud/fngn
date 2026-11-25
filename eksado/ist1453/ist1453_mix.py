"""EKSADO 1453 İstanbul Reels – Türkçe (42,5 sn): ElevenLabs v3 (Hale) seslendirme + kelime kelime vurgulanan dinamik altyazı
(subs_pop.html) + videonun kendi müziği (konuşmada kısılır, aralarda yükselir) + kapanışta "yorumlara 1453 yazın" çağrısı.
Kullanım: python3 ist1453_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 2); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("Antrasit",0,.56), ("metal",.613,.88,'','|'), ("ve",.933,1.04), ("ahşabın",1.093,1.52,'','|'), ("güçlü",1.573,1.84), ("uyumu",1.867,2.32,'','|'),
     ("Karşınızda",2.416,3.28,'','|'), ("1453 İstanbul",3.32,4.8,'hl','|'),
     ("Masif",4.98,5.6), ("mutfakta",5.64,6.16,'','|'), ("ikili",6.213,6.48), ("ocak",6.56,6.96,'','|'), ("mini",6.992,7.12), ("fırın",7.18,7.44), ("ve",7.493,7.6,'','|'), ("mini",7.648,7.84), ("bulaşık",7.88,8.16,'','|'), ("makinesi",8.22,8.8,'','|'),
     ("Sivri",9.0,9.44), ("pencerenin",9.488,10,'','|'), ("önünde",10.057,10.48,'','|'), ("köşe",10.54,10.8), ("koltuk",10.84,11.28,'','|'),
     ("Akıllı",11.44,11.92), ("televizyon",11.964,12.4,'','|'), ("ve",12.427,12.48), ("klima",12.544,12.88,'','|'), ("standart",12.942,13.52,'','|'),
     ("8",13.66,14.16), ("metre",14.24,14.68,'','|'), ("26,6",14.7,15.68), ("metrekare",15.74,16.4,'','|'), ("4",16.48,16.8), ("kişilik",16.86,17.2,'','|'), ("konaklama",17.24,17.84,'','|'),
     ("Ve",18.053,18.48), ("yukarıda",18.537,19.04,'','|'), ("geniş",19.093,19.36), ("yataklı",19.4,19.88,'','|'), ("ferah",19.91,20.08), ("bir",20.12,20.24), ("loft",20.32,20.72,'','|'),
     ("Ahşap",20.88,21.36), ("tavanın",21.4,21.76,'','|'), ("altında",21.82,22.4,'','|'), ("huzurlu",22.44,22.76), ("uykular",22.78,23.28,'','|'),
     ("Işıklı",23.6,24.24), ("basamak",24.26,24.56,'','|'), ("merdiven",24.62,25.12), ("ve",25.147,25.2,'','|'), ("geniş",25.253,25.52), ("dolap",25.56,26,'','|'),
     ("Banyoda",26.16,26.64,'','|'), ("çamaşır",26.72,27.12), ("makinesi",27.16,27.56,'','|'), ("ve",27.573,27.6), ("termosifon",27.664,28.24,'','|'), ("da",28.293,28.4), ("hazır",28.453,28.88,'','|'),
     ("Detaylı",29.02,29.6), ("bilgi",29.653,29.92), ("için",29.968,30.24,'','|'), ("yorumlara",30.293,30.8,'','|'), ("1453",30.86,31.76,'hl'), ("yazın",31.8,32.16,'','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | mutfak 5 | köşe koltuk + sivri pencere 10 | TV duvarı 12,5 |
# mutfak 15 | loft yatağı 21–29,5 | ahşap basamaklar 30 | ışıklı merdiven + dolap 34 | banyo 36 | logo kapanışı 38,4
P = [(0, 4.8, .20), (4.98, 8.8, 5.15), (9.0, 11.28, 10.05), (11.44, 13.52, 12.50), (13.66, 17.84, 15.40), (18.053, 20.72, 21.60),
     (20.88, 23.28, 25.00), (23.6, 26.0, 33.00), (26.16, 28.88, 35.80), (29.02, 32.16, 38.90)]
src = dec(VO, 1)
env = np.sqrt(np.convolve(src ** 2, np.ones(480) / 480, 'same') + 1e-12)
def quiet(lo, hi):
    i0, i1 = max(0, int(lo * SR)), min(len(src) - 1, int(hi * SR))
    return (i0 + int(np.argmin(env[i0:i1 + 1]))) / SR if i1 > i0 else lo
vo = np.zeros(N); speech = np.zeros(N, bool); prev = 0; shift = []
for k, (a, b, t) in enumerate(P):
    lo = quiet(a - .1, a + .02) if a > .05 else 0.0; hi = quiet(b - .02, b + .09) if k + 1 < len(P) else b + .15
    j = max(int((t - (a - lo)) * SR), prev + int(.04 * SR))
    if j / SR + (a - lo) > t + .01: print(f'  kaydırıldı +{j / SR + (a - lo) - t:.2f} sn @ {t}')
    seg = src[int(lo * SR):int(hi * SR)].copy(); f = int(.012 * SR); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    seg = seg[:max(0, N - j)]; vo[j:j + len(seg)] += seg; speech[j:j + len(seg)] = True; prev = j + len(seg)
    shift.append((a, b, j / SR + (a - lo) - a))
def off(t): return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
# ---- dinamik altyazı öbekleri ----
chunks, cur = [], []
for w in W:
    cur.append(w)
    if w[4] == '|': chunks.append(cur); cur = []
if cur: chunks.append(cur)
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]) - .06; en = c[-1][2] + off(c[-1][2]) + .3
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .08)
    dark = st >= 38.4  # kapanış beyaz zemin
    cls = ('dark' + (' sm' if len(' '.join(w[0] for w in c)) > 20 else '')) if dark else ''
    if k + 1 == len(chunks): en = END
    subs.append([round(st, 3), round(en, 3), cls, [[(w[0].rstrip(',.:') if j == len(c) - 1 else w[0]), round(w[1] + off(w[1]), 3), round(w[2] + off(w[2]), 3), w[3]] for j, w in enumerate(c)]])  # öbek sonundaki noktalama gösterilmez
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik -3 dB, konuşmada ek -7 dB (konuşma bitince geri yükselir); seslendirme konuşmada müziğin ~10 dB üstünde ----
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 10 ** (-3 / 20) * (1 - .55 * np.clip(duck, 0, 1))
mus = music * g[:, None]
mspeech = speech & (np.abs(music).max(1) > 1e-4)  # dengeyi müzikli konuşmadan hesapla
rm = np.sqrt((mus[mspeech] ** 2).mean() + 1e-12); rv = np.sqrt((vo[mspeech] ** 2).mean() + 1e-12)
vo *= (rm * 10 ** (10 / 20)) / rv
mix = mus + vo[:, None]
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print(len(subs), 'altyazı'); [print(s[0], s[1], s[2], ' '.join(w[0] for w in s[3])) for s in subs]
