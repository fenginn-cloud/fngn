"""EKSADO California Wood Reels – İngilizce (33,8 sn): ElevenLabs v3 (Olivia) seslendirme + kelime kelime vurgulanan dinamik altyazı
(subs_pop.html) + videonun kendi müziği; sonda yorum çağrısı yok, "For more details, contact us at eksado.com" ile biter.
Kullanım: python3 california_wood_en_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 1); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("Meet",0,.24), ("the",.26,.32,'','|'), ("California Wood",.378,1.76,'hl','|'), ("Warm",1.84,2.16), ("timber,",2.229,2.8,'','|'), ("crisp",2.867,3.2), ("white",3.253,3.52), ("trim",3.6,4,'','|'),
     ("A",4.28,4.56), ("sage-green",4.624,5.12,'','|'), ("kitchen,",5.18,5.68), ("with",5.712,5.84,'','|'), ("a",5.88,5.92), ("retro",5.987,6.32), ("fridge,",6.389,6.88,'','|'),
     ("a",6.92,6.96), ("mini",7.008,7.2), ("oven",7.28,7.6,'','|'), ("and",7.64,7.76), ("a",7.8,7.84), ("dishwasher",7.898,8.56,'','|'),
     ("Your",8.704,9.28), ("own",9.34,9.52,'','|'), ("cosy",9.6,9.92), ("nook,",9.973,10.4,'','|'), ("by",10.533,10.8), ("the",10.82,10.88), ("pointed",10.94,11.36,'','|'), ("arched",11.44,11.76), ("window",11.829,12.4,'','|'),
     ("Air",12.62,13.28), ("conditioning,",13.323,14,'','|'), ("a",14.04,14.08), ("smart",14.147,14.48), ("TV,",14.56,15.04,'','|'), ("and",15.12,15.36), ("a",15.4,15.44), ("loft",15.504,15.76), ("above",15.827,16.32,'','|'),
     ("9",16.464,17.04), ("metres",17.097,17.44), ("long,",17.504,18,'','|'), ("29.8",18.046,18.96), ("square",19.017,19.36), ("metres",19.44,20.08,'','|'),
     ("The",20.3,20.96), ("bathroom",21.013,21.44,'','|'), ("comes",21.493,21.76), ("ready,",21.813,22.16,'','|'), ("with",22.24,22.56), ("a",22.68,22.8), ("shower",22.834,23.04,'','|'), ("and",23.08,23.2), ("a",23.24,23.28), ("water",23.333,23.6), ("heater",23.657,24.16,'','|'),
     ("And",24.28,24.64), ("a",24.68,24.72), ("separate",24.764,25.12,'','|'), ("bedroom",25.18,25.68,'','|'), ("Comfort",25.77,26.4), ("for",26.44,26.56,'','|'), ("up",26.613,26.72), ("to",26.773,26.88), ("four",26.944,27.36,'','|'),
     ("For",27.56,28.16), ("more",28.192,28.32), ("details,",28.39,28.96,'','|'), ("contact",29.01,29.36), ("us",29.44,29.6), ("at",29.653,29.76,'','|'), ("eksado.com",29.84,31.12,'hl','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–3,8 | retro buzdolabı + mutfak 4 | mutfak adası 6 |
# sivri kemerli pencere köşesi 10 | klima + bar 13 | loft'lu genel 15 | koridor 17,5 | banyo 20 | yatak odası 25 | logo kapanışı 30
P = [(0, 4.0, .30), (4.28, 8.56, 4.40), (8.704, 12.4, 9.70), (12.62, 16.32, 13.50), (16.464, 20.08, 17.30), (20.3, 24.16, 21.00),
     (24.28, 27.36, 25.30), (27.56, 31.12, 30.05)]
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
    dark = st >= 29.9  # kapanış beyaz zemin
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
