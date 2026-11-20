"""EKSADO Los Angeles 9 m Reels – İngilizce (41,8 sn; Türkçe versiyonla aynı kurgu): ElevenLabs v3 (Olivia) seslendirme
+ kelime kelime vurgulanan dinamik altyazı (subs_pop.html) + videonun kendi müziği; sonu "For more details, contact us at eksado.com".
Kullanım: python3 la_v2_en_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 2); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("9",0,.16), ("metres,",.24,.96,'','|'), ("a",1,1.04), ("separate",1.084,1.44), ("bedroom",1.5,1.92,'','|'), ("and",2,2.24), ("a",2.28,2.32), ("loft",2.4,3.04,'','|'),
     ("Meet",3.088,3.28,'','|'), ("Los Angeles",3.32,4.56,'hl','|'),
     ("A",4.76,4.96), ("bright",4.994,5.2), ("living",5.246,5.52), ("area,",5.584,5.92,'','|'), ("with",5.936,6), ("big",6.06,6.24), ("windows",6.32,7.28,'','|'),
     ("A",7.32,7.36), ("solid",7.413,7.68), ("wood",7.728,7.92), ("kitchen,",7.97,8.4,'','|'), ("with",8.416,8.48), ("a",8.52,8.56), ("retro",8.627,8.96), ("fridge,",9.029,9.84,'','|'),
     ("a",9.88,9.92), ("two-ring",9.98,10.4), ("hob",10.48,10.72,'','|'), ("and",10.76,10.88), ("a",10.92,10.96), ("mini",11.008,11.2), ("oven",11.28,11.96,'','|'),
     ("Even",12.032,12.32), ("a",12.38,12.44,'','|'), ("mini",12.464,12.56), ("dishwasher",12.618,13.36,'','|'),
     ("Air",13.58,14.24), ("conditioning",14.283,14.8,'','|'), ("and",14.84,14.96), ("a",15,15.04), ("smart",15.093,15.36), ("TV,",15.48,15.84,'','|'), ("as",15.893,16), ("standard",16.071,16.72,'','|'),
     ("And",16.82,17.12), ("a",17.16,17.2), ("separate",17.236,17.52,'','|'), ("bedroom,",17.58,18,'','|'), ("with",18.032,18.16), ("its",18.2,18.32), ("own",18.36,18.48), ("door",18.56,19.2,'','|'),
     ("28",19.314,20.16), ("square",20.206,20.48), ("metres,",20.549,21.04,'','|'), ("sleeping",21.084,21.44), ("five",21.552,22.08,'','|'),
     ("A",22.4,22.72), ("marble-look",22.777,23.36,'','|'), ("bathroom,",23.413,23.92,'','|'), ("with",23.936,24), ("a",24.1,24.2), ("water",24.233,24.4), ("heater",24.469,25.2,'','|'),
     ("Climb",25.467,26.08), ("the",26.12,26.24), ("ladder,",26.286,26.64,'','|'), ("up",26.693,26.8), ("to",26.853,26.96), ("the",26.98,27.04), ("loft",27.12,27.52,'','|'),
     ("For",27.68,28.16), ("more",28.192,28.32), ("details,",28.4,29.04,'','|'), ("contact",29.09,29.44), ("us",29.547,29.76), ("at",29.813,29.92,'','|'), ("eksado.com",29.96,31.28,'hl','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | oturma alanı 5 | mutfak 10 | lavabo yakın 14 |
# koridor + televizyon 18,5 | bağımsız yatak odası 24 | kapı/koridor 31 | banyo 33 | genel + loft 35 | kapanış 37,7
P = [(0, 3.04, .30), (3.088, 4.56, 3.45), (4.76, 7.28, 5.30), (7.32, 11.96, 10.20), (12.032, 13.36, 14.95), (13.58, 16.72, 18.60),
     (16.82, 19.2, 24.20), (19.314, 22.08, 27.40), (22.4, 25.2, 31.90), (25.467, 27.52, 35.00), (27.68, 31.28, 38.00)]
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
