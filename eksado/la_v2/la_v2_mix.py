"""EKSADO Los Angeles 9 m Reels (41,8 sn): ElevenLabs v3 (Hale) seslendirme ("Los Ancılıs" diye okutulur, altyazıda "Los Angeles")
+ kelime kelime vurgulanan dinamik altyazı (subs_pop.html) + videonun kendi müziği + kapanışta "yorumlara Los Angeles yazın" çağrısı.
Kullanım: python3 la_v2_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 1); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("9",0,.24), ("metrede",.307,.72,'','|'), ("ayrı",.784,1.04), ("yatak",1.08,1.36), ("odası",1.413,1.68,'','|'), ("ve",1.707,1.76), ("loft",1.856,2.4,'','|'),
     ("Karşınızda",2.44,3.04,'','|'), ("Los Angeles",3.1,4.0,'hl','|'),
     ("Oturma",4.267,4.96), ("alanı",5.027,5.52,'','|'), ("geniş",5.547,5.68), ("pencereler",5.72,6.24,'','|'), ("ve",6.293,6.4), ("bol",6.46,6.64), ("ışık",6.704,7.04,'','|'),
     ("Masif",7.16,7.6), ("tezgâhlı",7.66,8.16,'','|'), ("mutfakta",8.22,8.72,'','|'), ("retro",8.773,9.04), ("buzdolabı",9.093,9.68,'','|'), ("ikili",9.76,10.08), ("ocak",10.133,10.4,'','|'), ("ve",10.427,10.48), ("mini",10.544,10.8), ("fırın",10.84,11.4,'','|'),
     ("Mini",11.456,11.68), ("bulaşık",11.72,12,'','|'), ("makinesi",12.06,12.52), ("bile",12.544,12.64), ("var",12.7,12.96,'','|'),
     ("Klima",13.24,13.76), ("ve",13.787,13.84,'','|'), ("akıllı",13.893,14.16), ("televizyon",14.204,14.64,'','|'), ("standart",14.711,15.36,'','|'),
     ("Ve",15.52,15.84), ("kapısı",15.9,16.24), ("kapanan",16.28,16.72,'','|'), ("bağımsız",16.764,17.12), ("bir",17.16,17.279,'','|'), ("yatak",17.28,17.52), ("odası",17.573,18,'','|'),
     ("28",18.36,19.12), ("metrekare",19.18,19.761,'','|'), ("5",19.82,20), ("kişilik",20.06,20.4,'','|'), ("konaklama",20.44,21.04,'','|'),
     ("Mermer",21.22,21.92), ("desenli",21.98,22.32,'','|'), ("banyo",22.4,22.8,'','|'), ("termosifonuyla",22.848,23.6), ("hazır",23.667,24.08,'','|'),
     ("Tırmanma",24.36,25.08,'','|'), ("merdiveniyle",25.11,25.68,'','|'), ("loft'a",25.744,26.08), ("çıkın",26.12,26.8,'','|'),
     ("Detaylı",26.9,27.44), ("bilgi",27.493,27.76), ("için",27.808,28.16,'','|'), ("yorumlara",28.187,28.56,'','|'), ("Los Angeles",28.62,29.28,'hl'), ("yazın",29.32,29.68,'','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | oturma alanı 5 | mutfak 10 | lavabo yakın 14 |
# koridor + televizyon 18,5 | yatak odasına geçiş 22,5 | bağımsız yatak odası 24 | kapı/koridor 31 | banyo 33 | genel + loft 35 | kapanış 37,7
P = [(0, 2.4, .30), (2.44, 4.0, 2.80), (4.267, 7.04, 5.30), (7.16, 11.4, 10.20), (11.456, 12.96, 14.60), (13.24, 15.36, 18.60),
     (15.52, 18.0, 24.20), (18.36, 21.04, 27.60), (21.22, 24.08, 31.90), (24.36, 26.8, 34.90), (26.9, 29.68, 38.30)]
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
    dark = st >= 37.6  # kapanış beyaz zemin
    cls = ('dark' + (' sm' if len(' '.join(w[0] for w in c)) > 20 else '')) if dark else ''
    if k + 1 == len(chunks): en = END
    subs.append([round(st, 3), round(en, 3), cls, [[w[0], round(w[1] + off(w[1]), 3), round(w[2] + off(w[2]), 3), w[3]] for w in c]])
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
