"""EKSADO 1453 Istanbul Reels – İngilizce (42,5 sn): ElevenLabs v3 (Olivia) seslendirme + kelime kelime vurgulanan dinamik altyazı
(subs_pop.html) + videonun kendi müziği; sonu "For more details, contact us at eksado.com".
Kullanım: python3 ist1453_en_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 2); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("Anthracite",0,.64), ("metal",.693,.96,'','|'), ("meets",1,1.2), ("warm",1.28,1.6), ("timber",1.669,2.4,'','|'), ("Meet",2.48,2.8), ("the",2.82,2.88,'','|'), ("1453 Istanbul",2.924,5.04,'hl','|'),
     ("A",5.32,5.6), ("solid",5.653,5.92), ("wood",5.952,6.08,'','|'), ("kitchen,",6.15,6.8), ("with",6.816,6.88,'','|'), ("a",6.96,7.04), ("two-ring",7.08,7.44), ("hob,",7.52,8.16,'','|'),
     ("a",8.2,8.24), ("mini",8.288,8.48), ("oven",8.56,8.88,'','|'), ("and",8.94,9.12), ("a",9.16,9.2), ("mini",9.248,9.44,'','|'), ("dishwasher",9.491,10.32,'','|'),
     ("A",10.52,10.72), ("corner",10.766,11.04), ("sofa,",11.136,11.6,'','|'), ("by",11.627,11.68), ("the",11.7,11.76), ("pointed",11.81,12.16,'','|'), ("window",12.217,12.96,'','|'),
     ("A",13.16,13.36), ("smart",13.413,13.68), ("TV",13.8,14.16,'','|'), ("and",14.22,14.4), ("air",14.44,14.56), ("conditioning,",14.603,15.2,'','|'), ("as",15.253,15.36), ("standard",15.422,16.24,'','|'),
     ("8",16.36,16.96), ("metres,",17.04,17.92,'','|'), ("26.6",17.954,18.96), ("square",19.017,19.36), ("metres,",19.44,20.24,'','|'), ("sleeping",20.276,20.56), ("four",20.624,21.2,'','|'),
     ("Upstairs,",21.493,22.56,'','|'), ("a",22.72,22.88), ("spacious",22.933,23.36), ("loft,",23.456,23.92,'','|'), ("under",23.987,24.32), ("a",24.36,24.4), ("warm",24.464,24.72,'','|'), ("wooden",24.766,25.04), ("ceiling",25.1,25.84,'','|'),
     ("Softly",25.984,26.64), ("lit",26.7,26.88), ("stairs,",26.949,27.44,'','|'), ("and",27.46,27.52), ("a",27.56,27.6), ("tall",27.664,27.92), ("wardrobe",27.991,28.88,'','|'),
     ("In",29.067,29.44), ("the",29.46,29.52), ("bathroom,",29.582,30.16,'','|'), ("a",30.32,30.48), ("washing",30.52,30.8), ("machine",30.86,31.28,'','|'), ("and",31.34,31.52), ("a",31.56,31.6), ("water",31.653,31.92), ("heater",31.977,32.72,'','|'),
     ("For",32.86,33.28), ("more",33.312,33.44), ("details,",33.51,34.32,'','|'), ("contact",34.38,34.8), ("us",34.907,35.12), ("at",35.173,35.28,'','|'), ("eksado.com",35.32,36.8,'hl','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | mutfak 5 | köşe koltuk + sivri pencere 10 | TV duvarı 12,5 |
# mutfak 15 | loft yatağı 21–29,5 | ahşap basamaklar 30 | ışıklı merdiven + dolap 34 | banyo 35,5 | logo kapanışı 38,4
P = [(0, 2.4, .20), (2.48, 5.04, 2.70), (5.32, 10.32, 5.35), (10.52, 12.96, 10.45), (13.16, 16.24, 12.95), (16.36, 21.2, 16.10),
     (21.493, 25.84, 21.40), (25.984, 28.88, 30.80), (29.067, 32.72, 34.40), (32.86, 36.8, 38.45)]
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
    dark = st >= 38.3  # kapanış beyaz zemin
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
