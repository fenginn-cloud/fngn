"""Seslendirmeyi parçalara ayırıp filmdeki anlarına yerleştirir; altyazı zamanlarını film.html'e yazar.
Kullanım: python3 vo_place.py <vo_kaynak.wav> <çıktı_vo.wav> <film.html>
Kaynak parça sınırları sessizlik analizinden (silencedetect -38 dB, 0,25 sn) alınmıştır."""
import sys, json, re, subprocess, wave
import numpy as np

SRC, OUT, HTML = sys.argv[1:4]
SR, N = 48000, 48000 * 60
K = (64.6 - 31.9) / (60 - 31.9)
O = lambda tc: 31.9 + (tc - 27.3) / K
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
src = np.frombuffer(raw, dtype=np.float32).astype(float)

# (kaynak başlangıç, kaynak bitiş, filmde başlangıç, altyazı | None)
P = [
    (0.00, 2.62, 3.30, "Bir evi tanımak için, kapısını açmak gerekir."),
    (3.46, 5.52, 6.15, "Çünkü bir evi ev yapan, içindekilerdir."),
    (6.25, 8.49, 8.45, "Dinlendiğiniz yatak. Mutfağınız."),
    (8.76, 11.29, 10.85, "Serinliğiniz. Akşamlarınız."),
    (11.69, 12.89, 16.70, "Ve göremediğiniz her şey."),
    (13.55, 14.46, 18.40, "Thermowood cephe."),
    (14.95, 16.10, 20.40, "Nefes alan membran."),
    (16.44, 17.79, 22.40, "Sekiz santim taş yünü."),
    (18.40, 19.71, 24.35, "Galvaniz çelik karkas."),
    (20.19, 21.24, 25.85, "Ladin iç kaplama."),
    (21.73, 23.94, 28.50, "Ve hepsini taşıyan galvaniz şasi."),
    (24.26, 26.75, 32.40, "Elektriğinden suyuna, tesisatı hazır."),
    (27.02, 31.02, 36.35, "2017'den bu yana, Sakarya'daki tesisimizde üretiyoruz."),
    (31.64, 33.55, 40.50, "Bugün evlerimiz, on yedi ülkede."),
    (34.16, 37.27, 43.00, "Bir evi değerlendirirken, hepsini birlikte düşünün."),
    (37.69, 38.67, 47.65, "O2 tip onaylı."),
    (39.03, 39.52, 48.90, "Plakalı."),
    (39.98, 41.01, 49.60, "İki yıl garantili."),
    (41.55, 44.05, 52.55, "Size kalan tek şey, anahtarı çevirmek."),
    (45.71, 46.37, O(55.52), None),   # Ekolojik
    (46.74, 47.35, O(56.37), None),   # Sağlam
    (47.75, 48.19, O(57.22), None),   # Doğal
    (44.65, 45.21, O(58.15), None),   # Eksado (logo tamamlanınca)
]
vo = np.zeros(N); subs = []; prev_end = 0
for a, b, t, txt in P:
    pre, post = (.05, .10) if txt else (.02, .04)
    i0, i1 = int((a - pre) * SR), int((b + post) * SR)
    seg = src[max(0, i0):i1].copy(); f = int(.03 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    j = int((t - pre) * SR)
    assert j >= prev_end - int(.02 * SR), f'çakışma: {txt or t}'
    vo[j:j + len(seg)] += seg[:N - j]; prev_end = j + len(seg)
    if txt: subs.append([round(t - .12, 2), round(t + (b - a) + .35, 2), txt])
st = np.stack([vo, vo], 1); pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
h = open(HTML).read()
block = '/*OUTSUBS*/const OUTSUBS=' + json.dumps(subs, ensure_ascii=False) + ';/*END*/'
h = re.sub(r'/\*OUTSUBS\*/.*?/\*END\*/', lambda m: block, h, flags=re.S) if '/*OUTSUBS*/' in h else h.replace('const ASUBS=', block + '\nconst ASUBS=')
open(HTML, 'w').write(h)
for s_ in subs: print(s_)
