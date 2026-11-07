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
# İngilizce: ElevenLabs Scribe kelime zaman damgaları (eleven_v3, Adrian Vale sesi, take 1). Kapanışta seslendirme yok.
P = [
    (0.000, 2.760, 2.60, "To truly know a home, you have to open the door."),
    (2.815, 6.160, 6.05, "Because what makes a house a home is what's inside."),
    (6.180, 8.000, 9.50, "The bed you rest in. Your kitchen."),
    (8.032, 10.160, 11.70, "Your cool comfort. Your evenings."),
    (10.200, 11.440, 16.55, "And everything you don't see."),
    (11.560, 12.881, 18.40, "Thermowood cladding."),
    (13.040, 14.280, 20.40, "A breathable membrane."),
    (14.313, 15.920, 22.40, "Eight centimetres of stone wool."),
    (16.000, 17.280, 24.35, "A galvanised steel frame."),
    (17.380, 18.720, 25.95, "Spruce interior panelling."),
    (18.800, 21.120, 28.40, "And beneath it all, a galvanised chassis."),
    (21.248, 23.920, 32.30, "From electrics to plumbing, everything's ready."),
    (24.040, 27.960, 36.00, "Since 2017, built in our own facility in Sakarya."),
    (28.047, 30.400, 40.35, "Today, our homes are in seventeen countries."),
    (30.512, 33.200, 43.45, "When you weigh up a home, consider the whole picture."),
    (33.440, 34.720, 47.65, "O2 type-approved."),
    (34.827, 36.080, 48.95, "Plated and licensed."),
    (36.144, 37.840, 49.80, "With a two-year warranty."),
    (37.940, 40.000, 52.30, "All that's left is to turn the key."),
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
