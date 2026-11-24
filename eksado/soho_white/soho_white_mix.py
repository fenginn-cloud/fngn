"""EKSADO Soho White 8 m Reels (27,3 sn): ElevenLabs v3 (Hale) seslendirme ("Soho Vayt" diye okutulur, altyazıda "Soho White")
+ kelime kelime vurgulanan dinamik altyazı (subs_pop.html) + videonun kendi müziği; tam eşyalı fiyat (1.600.000 TL), dünyaya gönderim
ve kapanışta "yorumlara Soho White yazın" çağrısı. Kullanım: python3 soho_white_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 2); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("8",0,.24), ("metre",.32,.88,'','|'), ("1",.9,.96), ("yatak",1,1.28), ("odası",1.307,1.6,'','|'), ("ve",1.627,1.68), ("1",1.72,1.84), ("loft",1.904,2.4,'','|'),
     ("Karşınızda",2.44,2.96,'','|'), ("Soho White",3.013,3.76,'hl','|'),
     ("Işıl",4.16,4.72), ("ışıl",4.8,4.96,'','|'), ("merdiveni",5,5.52,'','|'), ("ilk",5.56,5.68), ("bakışta",5.733,6.08,'','|'), ("büyülüyor",6.12,6.64,'','|'),
     ("Buzdolabı",6.76,7.36), ("ve",7.387,7.44,'','|'), ("ikili",7.493,7.76), ("ocak",7.813,8.08), ("hazır",8.133,8.48,'','|'),
     ("Geniş",8.58,8.96), ("camların",9.02,9.36,'','|'), ("önünde",9.406,9.68), ("koltuk",9.76,10.24,'','|'), ("klima",10.304,10.64), ("ve",10.667,10.72,'','|'), ("50",10.8,10.96), ("litrelik",11.013,11.36,'','|'), ("termosifon",11.408,12.08,'','|'),
     ("Ve",12.187,12.4), ("dünyanın",12.453,12.88,'','|'), ("her",12.94,13.12), ("yerine",13.166,13.44,'','|'), ("gönderiyoruz",13.486,14.24,'','|'),
     ("Tam",14.34,14.64), ("eşyalı",14.693,15.04), ("fiyatı",15.093,15.52,'','|'), ("1.600.000 TL",15.6,17.04,'hl','|'),
     ("Detaylı",17.18,17.76), ("bilgi",17.813,18.08), ("için",18.128,18.4,'','|'), ("yorumlara",18.453,18.96,'','|'), ("Soho White",19.067,19.72,'hl'), ("yazın",19.75,20,'','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–5,8 | ışıklı merdiven 6 | mutfak + TV 10 | koltuk + geniş cam 12,5 |
# geçiş 17 | mutfak + merdiven 17,5 | loft yatağı 20 | logo kapanışı 23,4
P = [(0, 2.4, .40), (2.44, 3.76, 3.00), (4.16, 6.64, 6.40), (6.76, 8.48, 10.20), (8.58, 12.08, 12.80), (12.187, 14.24, 17.60),
     (14.34, 17.04, 20.30), (17.18, 20.0, 23.80)]
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
    dark = st >= 23.4  # kapanış beyaz zemin
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
