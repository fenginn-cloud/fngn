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
# Kaynak zamanları ElevenLabs Scribe kelime zaman damgalarından (eleven_v4, UGUR ISIK sesi, take 1).
P = [
    (0.164, 3.084, 2.70, "Bir evi tanımak için, kapısını açmak gerekir."),
    (3.284, 6.284, 6.05, "Çünkü bir evi ev yapan, içindekilerdir."),
    (6.484, 8.844, 9.30, "Dinlendiğiniz yatak. Mutfağınız."),
    (9.044, 11.164, 11.85, "Serinliğiniz. Akşamlarınız."),
    (11.284, 13.124, 16.55, "Ve göremediğiniz her şey."),
    (13.284, 14.511, 18.50, "Thermowood cephe."),
    (14.537, 15.804, 20.40, "Nefes alan membran."),
    (15.844, 17.324, 22.40, "Sekiz santim taş yünü."),
    (17.364, 18.844, 24.35, "Galvaniz çelik karkas."),
    (18.884, 20.124, 25.95, "Ladin iç kaplama."),
    (20.164, 22.484, 28.50, "Ve hepsini taşıyan galvaniz şasi."),
    (22.564, 25.084, 32.40, "Elektriğinden suyuna, tesisatı hazır."),
    (25.124, 28.697, 36.35, "2017'den bu yana, Sakarya'daki tesisimizde üretiyoruz."),
    (28.751, 30.831, 40.05, "Bugün evlerimiz, on yedi ülkede."),
    (30.857, 33.817, 42.40, "Bir evi değerlendirirken, hepsini birlikte düşünün."),
    (33.871, 35.164, 47.65, "O2 tip onaylı."),
    (35.204, 35.884, 49.05, "Plakalı."),
    (35.924, 37.164, 49.85, "İki yıl garantili."),
    (37.204, 39.724, 52.45, "Size kalan tek şey, anahtarı çevirmek."),
    (39.764, 40.604, O(55.47), None),   # Ekolojik
    (40.644, 41.404, O(56.42), None),   # Sağlam
    (41.444, 42.111, O(57.37), None),   # Doğal
    (42.137, 42.804, O(58.25), None),   # Eksado (logo tamamlanınca)
]
env = np.sqrt(np.convolve(src ** 2, np.ones(int(.01 * SR)) / int(.01 * SR), 'same') + 1e-12)
def quiet(lo, hi):  # [lo, hi] aralığındaki en sessiz an (kesim noktası)
    i0, i1 = max(0, int(lo * SR)), min(len(src) - 1, int(hi * SR))
    return (i0 + int(np.argmin(env[i0:i1 + 1]))) / SR if i1 > i0 else lo
srcs = sorted(p_[:2] for p_ in P)
def bounds(a, b):
    prev = max([e for s_, e in srcs if e <= a + 1e-6], default=None)
    nxt = min([s_ for s_, e in srcs if s_ >= b - 1e-6], default=None)
    lo = quiet(prev - .02, a + .03) if prev is not None else max(0, a - .08)
    hi = quiet(b - .03, nxt + .02) if nxt is not None else b + .15
    return lo, hi
vo = np.zeros(N); subs = []; prev_end = 0
for a, b, t, txt in P:
    lo, hi = bounds(a, b); pre = a - lo
    i0, i1 = int(lo * SR), int(hi * SR)
    seg = src[max(0, i0):i1].copy(); f = int(.012 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    j = int((t - pre) * SR)
    if j < prev_end + int(.04 * SR):
        print(f'  kaydırıldı +{(prev_end + int(.04 * SR) - j) / SR:.2f} sn: {txt or t}'); j = prev_end + int(.04 * SR); t = j / SR + pre
    vo[j:j + len(seg)] += seg[:N - j]; prev_end = j + len(seg)
    if txt: subs.append([round(t - .1, 2), round(t + (b - a) + .25, 2), txt])
for k in range(len(subs) - 1):
    subs[k][1] = min(subs[k][1], round(subs[k + 1][0] - .02, 2))
st = np.stack([vo, vo], 1); pcm = (np.clip(st, -1, 1) * 32767).astype(np.int16)
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
h = open(HTML).read()
block = '/*OUTSUBS*/const OUTSUBS=' + json.dumps(subs, ensure_ascii=False) + ';/*END*/'
h = re.sub(r'/\*OUTSUBS\*/.*?/\*END\*/', lambda m: block, h, flags=re.S) if '/*OUTSUBS*/' in h else h.replace('const ASUBS=', block + '\nconst ASUBS=')
open(HTML, 'w').write(h)
for s_ in subs: print(s_)
