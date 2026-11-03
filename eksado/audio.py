"""EKSADO film – sentez müzik + ses efektleri (60 sn, 48 kHz stereo). Kullanım: python3 audio.py out.wav"""
import sys, wave
import numpy as np

SR = 48000
DUR = 60.0
N = int(SR * DUR)
rng = np.random.default_rng(7)
mixL = np.zeros(N); mixR = np.zeros(N)

def nf(name):
    notes = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
    n, o = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((notes[n] + (o - 4) * 12) / 12)

def add(sig, t0, amp=1.0, pan=0.0):
    i0 = int(t0 * SR)
    if i0 >= N: return
    sig = sig[: N - i0] * amp
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mixL[i0:i0 + len(sig)] += sig * l * 1.414
    mixR[i0:i0 + len(sig)] += sig * r * 1.414

def env_ar(n, a, r):
    e = np.ones(n); ai = max(1, int(a * SR)); ri = max(1, int(r * SR))
    e[:ai] = np.linspace(0, 1, ai) ** 2
    e[-ri:] *= np.linspace(1, 0, ri) ** 2
    return e

def pad(freqs, t0, t1, amp=.05, bright=.38):
    n = int((t1 - t0) * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in freqs:
        for det in (-0.0028, 0.0, 0.0031):
            ph = rng.uniform(0, 6.28)
            for h in range(1, 9):
                s += np.sin(2 * np.pi * f * (1 + det) * h * t + ph * h) * (1 / h) * np.exp(-h * bright)
    s *= env_ar(n, 1.4, 1.8) * (1 + .08 * np.sin(2 * np.pi * .23 * t))
    add(s / len(freqs), t0, amp)

def pluck(f, t0, amp=.12, dec=.55, pan=0.0):
    n = int(min(2.2, dec * 5) * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + .35 * np.sin(4 * np.pi * f * t) * np.exp(-t * 6) + .12 * np.sin(6 * np.pi * f * t) * np.exp(-t * 10))
    s *= np.exp(-t / dec) * np.minimum(1, t / .004)
    add(s, t0, amp, pan)

def noise_band(n, lo, hi):
    x = rng.standard_normal(n); X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR)
    X *= np.exp(-((np.log(fr + 1) - np.log((lo * hi) ** .5)) ** 2) / (2 * (np.log(hi / lo) / 2) ** 2))
    y = np.fft.irfft(X, n); return y / (np.abs(y).max() + 1e-9)

def whoosh(tc, amp=.22, length=.9):
    n = int(length * SR); t = np.arange(n) / SR
    a = noise_band(n, 300, 2400) * np.sin(np.pi * t / length) ** 2
    b = noise_band(n, 1200, 7000) * np.sin(np.pi * np.clip((t - .25 * length) / (.75 * length), 0, 1)) ** 3
    add(a * .7 + b * .4, tc - length * .6, amp)

def click(t0, amp=.5):
    n = int(.12 * SR); t = np.arange(n) / SR
    s = noise_band(n, 2500, 9000) * np.exp(-t * 90) + .6 * np.sin(2 * np.pi * 180 * t) * np.exp(-t * 40)
    add(s, t0, amp); add(noise_band(int(.05 * SR), 3000, 10000) * np.exp(-np.arange(int(.05 * SR)) / SR * 120), t0 + .07, amp * .5)

def tok(t0, amp=.16, f=520, pan=0.0):
    n = int(.25 * SR); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * f * t) * np.exp(-t * 28) + .5 * np.sin(2 * np.pi * f * 2.7 * t) * np.exp(-t * 45) + .3 * noise_band(n, 800, 4000) * np.exp(-t * 80)
    add(s, t0, amp, pan)

def boom(t0, amp=.5, f=48, dec=1.6):
    n = int(dec * 3 * SR); t = np.arange(n) / SR
    add(np.sin(2 * np.pi * f * t * (1 + .4 * np.exp(-t * 6))) * np.exp(-t / dec) * np.minimum(1, t / .01), t0, amp)

def slide(t0, amp=.12, length=1.0):
    n = int(length * SR); t = np.arange(n) / SR
    add(noise_band(n, 200, 1400) * np.sin(np.pi * t / length) ** 2 * (1 + .3 * np.sin(2 * np.pi * 11 * t)), t0, amp)

def shimmer(t0, length, amp=.05):
    n = int(length * SR); t = np.arange(n) / SR
    add(noise_band(n, 4000, 12000) * env_ar(n, length * .5, length * .4) * (1 + .5 * np.sin(2 * np.pi * 7 * t)), t0, amp)

# ---------------- MUSIC ----------------
ch = lambda *names: [nf(x) for x in names]
pad(ch('A1', 'E2'), 0.0, 3.6, .035, .9)                       # açılış dronu
prog1 = [(3.0, ch('A2', 'C3', 'E3', 'B3')), (6.4, ch('F2', 'A2', 'C3', 'E3')), (9.8, ch('C3', 'E3', 'G3', 'D4')), (13.2, ch('G2', 'B2', 'D3', 'A3'))]
for i, (t0, c) in enumerate(prog1):
    pad(c, t0, (prog1[i + 1][0] + 1.4) if i + 1 < len(prog1) else 16.9, .05)
beat = 60 / 96 / 2
arp1 = {3.0: ['A4', 'C5', 'E5', 'B4'], 6.4: ['A4', 'C5', 'E5', 'C5'], 9.8: ['G4', 'C5', 'E5', 'D5']}
k = 0; t = 5.0
while t < 13.2:
    base = max(x for x in arp1 if x <= t); notes = arp1[base]
    pluck(nf(notes[k % 4]), t, .085, .45, pan=(-.35 if k % 2 else .35)); k += 1; t += beat
# anatomi – koyu, ağır
pad(ch('D2', 'A2', 'E3', 'F3'), 16.4, 22.0, .055, .7); pad(ch('A#1', 'F2', 'D3', 'A3'), 21.6, 27.6, .055, .7)
for i in range(11):
    pluck(nf('D3'), 16.6 + i * beat * 2, .05, .9)
# tesisat – parıltı
pad(ch('E3', 'B3', 'F#4', 'G4'), 27.3, 32.8, .04, .45)
for i in range(int(4.8 / (beat / 2))):
    pluck(nf(['E5', 'B5', 'F#5', 'G5', 'B5', 'E6'][i % 6]), 27.5 + i * beat / 2, .035, .25, pan=np.sin(i))
# üretim – güvenli, ileri
prog2 = [(32.3, ch('C3', 'E3', 'G3', 'D4')), (34.0, ch('G2', 'B2', 'D3', 'A3')), (35.7, ch('A2', 'C3', 'E3', 'B3')), (37.4, ch('F2', 'A2', 'C3', 'G3'))]
for i, (t0, c) in enumerate(prog2):
    pad(c, t0, t0 + 2.9, .055)
k = 0; t = 32.4
while t < 38.9:
    seq = ['C5', 'G4', 'E5', 'G4'] if t < 34 else ['B4', 'G4', 'D5', 'G4'] if t < 35.7 else ['C5', 'A4', 'E5', 'A4'] if t < 37.4 else ['C5', 'A4', 'F5', 'A4']
    pluck(nf(seq[k % 4]), t, .08, .4, pan=(-.3 if k % 2 else .3)); k += 1; t += beat
# dönüş + akşam – sıcak
prog3 = [(39.0, ch('F2', 'A2', 'C3', 'E3')), (42.0, ch('C3', 'E3', 'G3', 'B3')), (45.0, ch('G2', 'B2', 'D3', 'A3')), (48.0, ch('A2', 'C3', 'E3', 'G3'))]
for i, (t0, c) in enumerate(prog3):
    pad(c, t0, t0 + 4.4, .06)
for i in range(int(11.5 / (beat * 2))):
    pluck(nf(['A4', 'C5', 'E5', 'G5'][i % 4]), 39.4 + i * beat * 2, .06, .7, pan=(-.25 if i % 2 else .25))
# anahtar – seyrek
pad(ch('F2', 'C3', 'A3'), 51.0, 55.9, .045, .6)
for t0, n_ in [(51.4, 'E5'), (52.6, 'C5'), (53.8, 'A4')]:
    pluck(nf(n_), t0, .09, 1.2)
# final
pad(ch('C2', 'G2', 'E3', 'B3', 'D4'), 55.4, 60.0, .085, .4)
for i, n_ in enumerate(['C5', 'E5', 'G5', 'B5', 'D6']):
    pluck(nf(n_), 56.2 + i * .55, .07, 1.4, pan=(i - 2) * .2)

# ---------------- SFX ----------------
click(1.85, .55); click(53.35, .5)
for i in range(10):
    tok(5.3 + i * .42 + 2.15, .17, 480 + (i % 3) * 60, pan=(-.4 if i in (0, 1, 2, 3) else .4))
for i in range(10):
    tok(39.7 + i * .3 + 1.7, .08, 620, pan=.2)
for i in range(4):
    slide(17.6 + i * 1.2, .13, 1.0)
shimmer(27.9, 3.4, .06)
for i in range(17):
    tok(35.9 + 1.3 * (1 - (1 - (i + 1) / 17) ** (1 / 3)), .06, 1500, pan=0)
for tc in (16.4, 27.3, 32.3, 39.0):
    whoosh(tc, .2)
whoosh(55.5, .16, 1.2); boom(55.45, .45); boom(44.8, .28, 70, .35); boom(16.45, .3, 42, 1.2)

# ---------------- reverb + master ----------------
ir_n = int(2.2 * SR); ir_t = np.arange(ir_n) / SR
def reverb(x, seed):
    r = np.random.default_rng(seed).standard_normal(ir_n) * np.exp(-ir_t / .55); r[0] = 0
    L = 1 << int(np.ceil(np.log2(len(x) + ir_n)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(r, L), L)[:len(x)]
    return y / (np.abs(y).max() + 1e-9) * np.abs(x).max()
L_, R_ = mixL + .32 * reverb(mixL, 1), mixR + .32 * reverb(mixR, 2)
fade = np.ones(N); fn = int(.8 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 2
st = np.stack([L_, R_], 1) * fade[:, None]
st = np.tanh(st / (np.abs(st).max() + 1e-9) * 1.25) * .89
pcm = (st * 32767).astype(np.int16)
with wave.open(sys.argv[1] if len(sys.argv) > 1 else 'film.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', pcm.shape)
