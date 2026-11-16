"""EKSADO Abu Dabi Reels (48,5 sn): ElevenLabs v3 (Hale) seslendirme + kelime kelime vurgulanan dinamik altyazı (subs_pop.html)
+ videonun kendi müziği (konuşmada kısılır, aralarda yükselir) + kapanışta "yorumlara Abu Dabi yazın" çağrısı.
Kullanım: python3 abudabi_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 2); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("8",0,.24), ("metrede",.307,.8,'','|'), ("iki",.86,1.04), ("ayrı",1.104,1.36), ("loft",1.424,1.76,'','|'), ("5",1.8,1.92), ("kişilik",1.98,2.32), ("bir",2.36,2.48), ("yaşam",2.547,2.96,'','|'),
     ("Karşınızda",3.08,3.76,'','|'), ("Abu Dabi",3.8,4.32,'hl','|'),
     ("Geniş",4.52,5.2), ("camlı",5.26,5.52,'','|'), ("oturma",5.573,5.92), ("alanı",5.96,6.16,'','|'), ("ve",6.213,6.32), ("keyifli",6.4,6.8,'','|'), ("bir",6.82,6.88), ("bar",6.94,7.12), ("masası",7.16,7.68,'','|'),
     ("Mint",7.792,8.24), ("yeşili",8.293,8.56,'','|'), ("mutfakta",8.6,9.12,'','|'), ("masif",9.2,9.52), ("tezgâh",9.58,10.08,'','|'), ("ikili",10.133,10.4), ("ocak",10.453,10.72,'','|'), ("ve",10.773,10.88), ("ankastre",10.94,11.44), ("fırın",11.48,12.2,'','|'),
     ("Retro",12.273,12.64), ("siyah",12.72,12.96,'','|'), ("buzdolabı",13.013,13.52), ("da",13.547,13.6,'','|'), ("mutfağın",13.66,14.08), ("yıldızı",14.107,14.64,'','|'),
     ("Klima",14.92,15.44), ("ve",15.467,15.52,'','|'), ("akıllı",15.6,16.12), ("televizyon",16.145,16.4,'','|'), ("standart",16.471,17.12,'','|'),
     ("Basamaklı",17.28,18.08,'','|'), ("merdivenin",18.14,18.64), ("altında",18.69,19.12,'','|'), ("çamaşır",19.2,19.52), ("makinesi",19.56,20,'','|'), ("bile",20.032,20.16), ("var",20.24,20.56,'','|'),
     ("Mermer",20.74,21.44), ("desenli",21.5,21.92,'','|'), ("banyo",21.96,22.24), ("ve",22.267,22.32), ("tuvalet",22.373,22.8,'','|'), ("termosifonuyla",22.848,23.6), ("hazır",23.667,24.16,'','|'),
     ("29,5",24.48,25.44), ("metrekare",25.5,26.08,'','|'), ("ferah",26.14,26.4), ("ve",26.453,26.56), ("aydınlık",26.613,27.2,'','|'),
     ("Tırmanma",27.48,28.08,'','|'), ("merdiveniyle",28.14,28.72,'','|'), ("ikinci",28.766,29.04), ("loft'a",29.104,29.48), ("çıkın",29.51,29.76,'','|'), ("yatağınız",29.84,30.32), ("hazır",30.373,30.72,'','|'),
     ("Detaylı",30.92,31.76), ("bilgi",31.813,32.08), ("için",32.128,32.4,'','|'), ("yorumlara",32.44,32.88,'','|'), ("Abu Dabi",32.94,33.36,'hl'), ("yazın",33.42,33.76,'','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | oturma + bar masası 5 | mutfak 10 | retro buzdolabı 15 |
# yemek/oturma + klima 20 | basamaklı merdiven + çamaşır makinesi 26 | banyo 30 | genel 35 | tırmanma merdiveni → 2. loft 40 | kapanış 44,6
P = [(0, 2.96, .30), (3.08, 4.32, 3.40), (4.52, 7.68, 5.10), (7.792, 12.2, 10.10), (12.273, 14.64, 15.30), (14.92, 17.12, 20.30),
     (17.28, 20.56, 26.20), (20.74, 24.16, 30.40), (24.48, 27.2, 35.60), (27.48, 30.72, 40.30), (30.92, 33.76, 45.00)]
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
    dark = st >= 44.5  # kapanış beyaz zemin
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
