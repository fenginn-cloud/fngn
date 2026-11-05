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
# Kaynak zamanları ElevenLabs Scribe kelime zaman damgalarından (eleven_multilingual_v2, Hasan Yasin sesi, take 1).
P = [
    (0.000, 3.216, 2.60, "Bir evi tanımak için, kapısını açmak gerekir."),
    (3.379, 6.026, 5.95, "Çünkü bir evi ev yapan, içindekilerdir."),
    (6.502, 9.334, 8.75, "Dinlendiğiniz yatak. Mutfağınız."),
    (9.636, 12.074, 11.70, "Serinliğiniz. Akşamlarınız."),
    (12.725, 14.164, 16.55, "Ve göremediğiniz her şey."),
    (14.640, 15.615, 18.40, "Thermowood cephe."),
    (15.766, 16.951, 20.40, "Nefes alan membran."),
    (17.183, 18.669, 22.40, "Sekiz santim taş yünü."),
    (18.901, 20.422, 24.35, "Galvaniz çelik karkas."),
    (20.689, 22.059, 25.95, "Ladin iç kaplama."),
    (22.268, 24.834, 28.40, "Ve hepsini taşıyan galvaniz şasi."),
    (25.217, 27.980, 32.30, "Elektriğinden suyuna, tesisatı hazır."),
    (28.305, 32.578, 36.00, "2017'den bu yana, Sakarya'daki tesisimizde üretiyoruz."),
    (32.613, 35.585, 40.35, "Bugün evlerimiz, on yedi ülkede."),
    (35.863, 39.021, 43.45, "Bir evi değerlendirirken, hepsini birlikte düşünün."),
    (39.346, 40.542, 47.65, "O2 tip onaylı."),
    (40.693, 41.425, 48.95, "Plakalı."),
    (41.599, 42.632, 49.80, "İki yıl garantili."),
    (42.678, 45.744, 52.30, "Size kalan tek şey, anahtarı çevirmek."),
    (45.802, 46.556, O(55.47), None),   # Ekolojik
    (46.672, 47.392, O(56.42), None),   # Sağlam
    (47.601, 48.170, O(57.37), None),   # Doğal
    (48.379, 49.273, O(58.25), None),   # Eksado (logo tamamlanınca)
]
env = np.sqrt(np.convolve(src ** 2, np.ones(int(.01 * SR)) / int(.01 * SR), 'same') + 1e-12)
def quiet(lo, hi):  # [lo, hi] aralığındaki en sessiz an (kesim noktası)
    i0, i1 = max(0, int(lo * SR)), min(len(src) - 1, int(hi * SR))
    return (i0 + int(np.argmin(env[i0:i1 + 1]))) / SR if i1 > i0 else lo
srcs = sorted(p_[:2] for p_ in P)
def bounds(a, b):
    prev = max([e for s_, e in srcs if e <= a + 1e-6], default=None)
    nxt = min([s_ for s_, e in srcs if s_ >= b - 1e-6], default=None)
    lo = quiet(max(a - .12, (prev + a) / 2) if prev is not None else a - .12, a + .02) if a > .05 else 0.0
    hi = quiet(b - .02, min(b + .18, (b + nxt) / 2)) if nxt is not None else b + .2
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
