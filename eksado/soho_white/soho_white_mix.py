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
# Scribe kelime zaman damgaları (take 1, ikinci metin: koltuk ile klima/termosifon ayrı cümlelerde); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("8",0,.24), ("metre",.307,.8,'','|'), ("1",.82,.88), ("yatak",.92,1.12), ("odası",1.173,1.52,'','|'), ("ve",1.573,1.68), ("1",1.7,1.76), ("loft",1.84,2.32,'','|'),
     ("Karşınızda",2.38,2.96,'','|'), ("Soho White",3.04,4.24,'hl','|'),
     ("Işıl",4.28,4.48), ("ışıl",4.56,4.72,'','|'), ("merdiveni",4.78,5.36,'','|'), ("ilk",5.38,5.44), ("bakışta",5.493,5.84,'','|'), ("büyülüyor",5.88,6.4,'','|'),
     ("Mutfakta",6.52,7.04,'','|'), ("buzdolabı",7.093,7.6), ("ve",7.653,7.76,'','|'), ("ikili",7.813,8.08), ("ocak",8.133,8.32), ("hazır",8.373,8.72,'','|'),
     ("Geniş",8.84,9.28), ("camların",9.34,9.68,'','|'), ("önünde",9.726,10.08,'','|'), ("rahat",10.133,10.4), ("bir",10.42,10.48), ("koltuk",10.56,11.04,'','|'),
     ("Dünyanın",16.688,17.12,'','|'), ("her",17.16,17.28), ("yerine",17.326,17.6,'','|'), ("gönderiyoruz",17.646,18.32,'','|'),
     ("Klima",11.2,11.6), ("ve",11.627,11.68,'','|'), ("50",11.84,11.92), ("litrelik",11.973,12.32,'','|'), ("termosifon",12.368,12.88), ("da",12.933,13.04,'','|'), ("standart",13.102,13.68,'','|'),
     ("Tam",13.78,14.08), ("eşyalı",14.16,14.56), ("fiyatı",14.613,15.04,'','|'), ("1.600.000 TL",15.06,16.64,'hl','|'),
     ("Detaylı",18.42,18.88), ("bilgi",18.933,19.2), ("için",19.248,19.52,'','|'), ("yorumlara",19.573,20.08,'','|'), ("Soho White",20.187,20.72,'hl'), ("yazın",20.76,21.12,'','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–5,8 | ışıklı merdiven 6 | mutfak + TV 10 | koltuk + geniş cam 12,5 |
# geçiş 17 | mutfak + merdiven 17,5 | loft yatağı 20 | logo kapanışı 23,4
# cümle sırası videoya göre değiştirildi: koltuk sahnesinde "dünyanın her yerine gönderiyoruz", klima + termosifon mutfakta, fiyat loft'ta
P = [(0, 2.32, .40), (2.38, 4.24, 2.95), (4.28, 6.4, 6.40), (6.52, 8.72, 10.10), (8.84, 11.04, 12.70), (16.688, 18.32, 15.10),
     (11.2, 13.68, 17.60), (13.78, 16.64, 20.30), (18.42, 21.12, 23.80)]
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
