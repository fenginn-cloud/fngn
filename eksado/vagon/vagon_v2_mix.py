"""EKSADO Vagon Ahşap – yeni kurgu (24,8 sn), kampanyada son 8 gün, 1.270.000 TL. Kanca yok.
ElevenLabs v3 (Hale) seslendirme + kelime kelime vurgulanan dinamik altyazı (subs_pop.html) + videonun kendi müziği.
7,1–7,6 sn'deki ışık söndü/yandı geçişi seslendirmesiz bırakılır; müzik 21,7 sn'de biter, yorum çağrısı kapanışta.
Kullanım: python3 vagon_v2_mix.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>"""
import sys, json, subprocess, wave
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music); END = N / SR
# Scribe kelime zaman damgaları (take 1); ekranda görünen yazım. 4. alan: 'hl' turuncu kutu; 5. alan: '|' = altyazı öbeği burada biter
W = [("Bu",0,.16), ("evi",.213,.4), ("dünyada",.47,.96,'','|'), ("başka",1.013,1.28), ("kimse",1.347,1.68,'','|'), ("üretmiyor",1.728,2.4,'','|'),
     ("Vagon Ahşap",2.44,3.28,'hl','|'),
     ("Köşe",3.44,3.92), ("koltuk",4,4.48,'','|'), ("klima",4.528,5,'','|'), ("akıllı",5.04,5.28), ("televizyon",5.331,5.92,'','|'),
     ("Kampanyada",6.02,6.72,'','|'), ("son",6.78,6.96), ("8",7.02,7.28), ("gün",7.34,7.6,'','|'), ("1.270.000 TL",7.68,9.52,'hl','|'),
     ("İkili",9.88,10.4), ("ocak,",10.507,11), ("fırın",11.03,11.36,'','|'), ("duşlu",11.413,11.76), ("banyo",11.8,12.16,'','|'), ("hepsi",12.227,12.56), ("hazır",12.613,12.96,'','|'),
     ("Işıklı",13.12,13.52), ("merdivenle",13.56,14.08,'','|'), ("loft'a",14.128,14.4), ("çıkın",14.46,15,'','|'),
     ("3",15.067,15.2), ("kişilik",15.24,15.6), ("konfor",15.66,16.08,'','|'), ("Bu",16.187,16.4), ("fiyat",16.467,16.8), ("sadece",16.869,17.28,'','|'), ("8",17.34,17.6), ("gün!",17.66,17.92,'','|'),
     ("Detaylı",18.06,18.64), ("bilgi",18.693,18.96), ("için",19.024,19.44,'','|'), ("yorumlara",19.467,19.84,'','|'), ("Vagon Ahşap",19.88,20.56,'hl'), ("yazın",20.62,20.96,'','|')]
W = [w + ('',) * (5 - len(w)) for w in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: siyahtan giriş 0–0,4 | dış cephe 0,4–4,4 | köşe koltuk 4,5 |
# karar → ışıklı merdiven 7,1–7,6 | merdiven + mutfak 7,6 | mutfak/banyo 11 | banyo 14 | merdiven 15 | loft 17,5 | kapanış 21,1
P = [(0, 3.28, .40), (3.44, 5.92, 4.60), (6.02, 9.52, 7.65), (9.88, 12.96, 11.20), (13.12, 15.0, 15.05), (15.067, 16.08, 17.55),
     (16.187, 17.92, 18.75), (18.06, 20.96, 21.45)]
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
    dark = st >= 21.0  # kapanış beyaz zemin
    cls = ('dark' + (' sm' if len(' '.join(w[0] for w in c)) > 20 else '')) if dark else ''
    if k + 1 == len(chunks): en = END
    subs.append([round(st, 3), round(en, 3), cls, [[w[0], round(w[1] + off(w[1]), 3), round(w[2] + off(w[2]), 3), w[3]] for w in c]])
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik -3 dB, konuşmada ek -7 dB (konuşma bitince geri yükselir); seslendirme konuşmada müziğin ~10 dB üstünde ----
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 10 ** (-3 / 20) * (1 - .55 * np.clip(duck, 0, 1))
mus = music * g[:, None]
mspeech = speech & (np.abs(music).max(1) > 1e-4)  # müzik 21,7 sn'de bitiyor; dengeyi müzikli konuşmadan hesapla
rm = np.sqrt((mus[mspeech] ** 2).mean() + 1e-12); rv = np.sqrt((vo[mspeech] ** 2).mean() + 1e-12)
vo *= (rm * 10 ** (10 / 20)) / rv
mix = mus + vo[:, None]
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print(len(subs), 'altyazı'); [print(s[0], s[1], s[2], ' '.join(w[0] for w in s[3])) for s in subs]
