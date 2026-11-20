"""EKSADO California 9 m Reels – İngilizce (30 sn): ElevenLabs v3 (Olivia) seslendirme + kelime kelime vurgulanan dinamik altyazı
(subs_pop.html) + videonun kendi müziği; sonda yorum çağrısı yok, "For more details, contact us at eksado.com" ile biter.
Kullanım: python3 california_en_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 1); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("Meet",0,.16,'','|'), ("California",.218,.88,'hl','|'), ("9",.992,1.44), ("metres",1.497,1.84,'','|'), ("of",1.893,2), ("light",2.053,2.32), ("and",2.34,2.4), ("space",2.493,3.04,'','|'),
     ("A",3.24,3.44), ("cosy",3.52,3.84), ("seat,",3.904,4.24,'','|'), ("under",4.28,4.48), ("the",4.5,4.56,'','|'), ("pointed",4.61,4.96), ("window",5.017,5.52,'','|'),
     ("A",5.76,6), ("two-ring",6.06,6.48), ("hob,",6.58,6.96,'','|'), ("a",7,7.04), ("mini",7.104,7.36), ("oven,",7.44,8.16,'','|'), ("even",8.208,8.4), ("a",8.44,8.48,'','|'), ("mini",8.512,8.64), ("dishwasher",8.698,9.44,'','|'),
     ("A",9.68,9.92), ("retro",9.987,10.32), ("fridge,",10.389,10.88,'','|'), ("and",10.9,10.96), ("the",10.98,11.04), ("loft",11.12,11.44,'','|'), ("right",11.48,11.68), ("above",11.747,12.24,'','|'),
     ("29.8",12.366,13.84), ("square",13.886,14.16), ("metres,",14.229,14.72,'','|'), ("sleeping",14.773,15.2), ("four",15.28,15.68,'','|'),
     ("A",15.96,16.24), ("marble-look",16.297,16.8,'','|'), ("bathroom,",16.862,17.52,'','|'), ("ready",17.547,17.68), ("to",17.733,17.84), ("go",17.947,18.32,'','|'),
     ("Air",18.46,18.88), ("conditioning",18.929,19.52,'','|'), ("and",19.56,19.68), ("a",19.72,19.76), ("smart",19.813,20.08), ("TV,",20.24,20.76,'','|'), ("as",20.8,20.88), ("standard",20.942,21.52,'','|'),
     ("For",21.66,22.08), ("more",22.128,22.32), ("details,",22.38,22.88,'','|'), ("contact",22.93,23.28), ("us",23.36,23.52), ("at",23.573,23.68,'','|'), ("eksado.com",23.76,24.88,'hl','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0,4–3,3 | sivri pencereli oturma köşesi 3,5 | mutfak adası 6 |
# retro buzdolabı + loft 10,5 | loft yatağı 13 | banyo 17 | geçiş 19,5 | dış cephe 20,5 | logo kapanışı 26,6
P = [(0, 3.04, .35), (3.24, 5.52, 3.60), (5.76, 9.44, 6.20), (9.68, 12.24, 10.45), (12.366, 15.68, 13.30), (15.96, 18.32, 17.00),
     (18.46, 21.52, 20.70), (21.66, 24.88, 26.70)]
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
    dark = st >= 26.6  # kapanış beyaz zemin
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
