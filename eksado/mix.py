"""EKSADO film – ses miksajı: sentez müzik altyapısı + paketteki gerçek ses efektleri (60 sn, 48 kHz stereo).
Kullanım: python3 mix.py <sfx_klasörü> <çıktı.wav> [seslendirme.wav]
Zamanlar film çıktısı saniyesidir. Anatomi sonrası sahneler film.html'deki zaman eşlemesiyle (K) hızlandırılmıştır."""
import sys, os, subprocess, wave
import numpy as np

SFX, OUT = sys.argv[1], sys.argv[2]
VO = sys.argv[3] if len(sys.argv) > 3 else None
SR, DUR = 48000, 60.0
N = int(SR * DUR)
K = (64.6 - 31.9) / (60 - 31.9)
def O(tc):  # orijinal (anatomi sonrası) sahne zamanı -> çıktı zamanı
    return 31.9 + (tc - 27.3) / K
rng = np.random.default_rng(7)
mus = np.zeros((N, 2)); fx = np.zeros((N, 2))

def place(buf, sig, t0, gain_db=0.0, pan=0.0):
    i0 = int(round(t0 * SR))
    if sig.ndim == 1: sig = np.stack([sig, sig], 1)
    if i0 < 0: sig = sig[-i0:]; i0 = 0
    if i0 >= N: return
    sig = sig[:N - i0] * 10 ** (gain_db / 20)
    l, r = np.cos((pan + 1) * np.pi / 4) * 1.414, np.sin((pan + 1) * np.pi / 4) * 1.414
    buf[i0:i0 + len(sig), 0] += sig[:, 0] * l; buf[i0:i0 + len(sig), 1] += sig[:, 1] * r

# ---------------- ses efekti dosyaları ----------------
_cache = {}
def load(name, maxlen=None, fade=.08, rate=1.0):
    key = (name, maxlen, rate)
    if key in _cache: return _cache[key]
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(SFX, name), '-f', 'f32le', '-ac', '2', '-ar', str(int(SR / rate)), '-'],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(float)
    on = np.nonzero(np.abs(x).max(1) > 10 ** (-48 / 20))[0]
    x = x[on[0]:] if len(on) else x
    if maxlen: x = x[:int(maxlen * SR)]
    fn = min(len(x), int(fade * SR)); x[-fn:] *= np.linspace(1, 0, fn)[:, None] ** 2
    _cache[key] = x; return x

def sfx(name, t, db=0.0, pan=0.0, maxlen=None, rate=1.0, align_peak=False):
    x = load(name, maxlen, rate=rate)
    if align_peak: t -= np.argmax(np.abs(x).max(1)) / SR
    place(fx, x, t, db, pan)

# ---------------- müzik (yumuşak altyapı) ----------------
def nf(n):
    m = {'C': -9, 'C#': -8, 'D': -7, 'D#': -6, 'E': -5, 'F': -4, 'F#': -3, 'G': -2, 'G#': -1, 'A': 0, 'A#': 1, 'B': 2}
    return 440.0 * 2 ** ((m[n[:-1]] + (int(n[-1]) - 4) * 12) / 12)
def env(n, a, r):
    e = np.ones(n); ai, ri = max(1, int(a * SR)), max(1, int(r * SR))
    e[:ai] = np.linspace(0, 1, ai) ** 2; e[-ri:] *= np.linspace(1, 0, ri) ** 2; return e
def pad(names, t0, t1, amp=.04, bright=.5):
    n = int((t1 - t0) * SR); t = np.arange(n) / SR; s = np.zeros(n)
    for f in map(nf, names):
        for det in (-.0025, 0, .0028):
            ph = rng.uniform(0, 6.28)
            for h in range(1, 7):
                s += np.sin(2 * np.pi * f * (1 + det) * h * t + ph * h) / h * np.exp(-h * bright)
    s *= env(n, 1.6, 2.0) * (1 + .06 * np.sin(2 * np.pi * .2 * t))
    place(mus, s / len(names), t0, 20 * np.log10(amp))
def note(n_, t0, amp=.05, dec=.9, pan=0.0):
    f = nf(n_); n = int(min(3, dec * 5) * SR); t = np.arange(n) / SR
    s = (np.sin(2 * np.pi * f * t) + .25 * np.sin(4 * np.pi * f * t) * np.exp(-t * 5)) * np.exp(-t / dec) * np.minimum(1, t / .006)
    place(mus, s, t0, 20 * np.log10(amp), pan)

pad(['A1', 'E2'], 0, 3.6, .03, .9)
for t0, t1, c in [(3.0, 7.8, ['A2', 'C3', 'E3', 'B3']), (6.4, 11.2, ['F2', 'A2', 'C3', 'E3']), (9.8, 14.6, ['C3', 'E3', 'G3', 'D4']), (13.2, 17.2, ['G2', 'B2', 'D3', 'A3'])]:
    pad(c, t0, t1)
beat = 60 / 96
for k, t in enumerate(np.arange(5.0, 13.2, beat)):
    note(['A4', 'E5', 'C5', 'B4'][k % 4], t, .03, .8, pan=(-.3 if k % 2 else .3))
pad(['D2', 'A2', 'E3', 'F3'], 16.4, 24.8, .045, .75); pad(['A#1', 'F2', 'D3', 'A3'], 24.2, 32.4, .045, .75)
for t in np.arange(16.6, 31.5, beat * 2):
    note('D3', t, .025, 1.2)
pad(['E3', 'B3', 'F#4', 'G4'], 31.9, 36.6, .032, .55)
for k, t in enumerate(np.arange(32.2, 36.0, beat / 2)):
    note(['E5', 'B5', 'F#5', 'G5', 'B5', 'E6'][k % 6], t, .014, .35, pan=float(np.sin(k)))
seg = (41.95 - 36.2) / 4
for i, c in enumerate([['C3', 'E3', 'G3', 'D4'], ['G2', 'B2', 'D3', 'A3'], ['A2', 'C3', 'E3', 'B3'], ['F2', 'A2', 'C3', 'G3']]):
    pad(c, 36.2 + i * seg, 36.2 + (i + 1) * seg + 1.2, .045)
for k, t in enumerate(np.arange(36.3, 41.9, beat / 2)):
    note(['C5', 'G4', 'E5', 'G4'][k % 4], t, .02, .45, pan=(-.25 if k % 2 else .25))
seg = (52.27 - 41.95) / 4
for i, c in enumerate([['F2', 'A2', 'C3', 'E3'], ['C3', 'E3', 'G3', 'B3'], ['G2', 'B2', 'D3', 'A3'], ['A2', 'C3', 'E3', 'G3']]):
    pad(c, 41.95 + i * seg, 41.95 + (i + 1) * seg + 1.6, .05)
for k, t in enumerate(np.arange(42.3, 52.0, beat)):
    note(['A4', 'C5', 'E5', 'G5'][k % 4], t, .024, .9, pan=(-.2 if k % 2 else .2))
pad(['F2', 'C3', 'A3'], 52.27, 56.6, .04, .6)
pad(['C2', 'G2', 'E3', 'B3', 'D4'], 56.0, 60.0, .065, .45)
for i, n_ in enumerate(['C5', 'E5', 'G5', 'B5', 'D6']):
    note(n_, O(56.35) + i * .62, .026, 1.5, pan=(i - 2) * .2)

# ---------------- ses efektleri (paket) ----------------
sfx('App Click 1.wav', 1.80, -10); sfx('universfield-computer-mouse-click-352734.mp3', 1.93, 0)          # anahtar
sfx('rope-creak-01-sound-effect-340131.mp3', 2.35, -14, maxlen=1.1)                          # kapı gıcırtısı
sfx('swoosh-015-383769.mp3', 3.75, -16)                                                             # kapı açılıyor
pops = ['soft-subtle-ui-pop-sfx-348820.mp3', 'minimal-pop-click-ui-11-198311.mp3', 'pop-402324.mp3']
for i in range(10):
    sfx(pops[i % 3], 5.3 + i * .42 + 2.15 - .03, -13, pan=(-.45 if i in (0, 1, 2, 3) else .45), maxlen=.6, rate=1 + (i % 4 - 1.5) * .03)
sfx('simple-whoosh-02-433006.mp3', 7.3, -19)                                                        # kamera yükseliyor
sfx('marimba-bloop-3-188151.mp3', 13.35, -11)                                                       # Hepsi içinde.
for t, n_ in [(16.4, 'universfield-swoosh-023-454830.mp3'), (31.9, 'swoosh-2-359826.mp3'), (O(32.3), 'woosh-230554.mp3'), (O(39.0), 'swoosh-015-383769.mp3')]:
    sfx(n_, t, -12, align_peak=True)                                                                # sahne geçişleri
for i in range(4):
    sfx('flipcard-91468.mp3', 17.4 + i * 2.0 + .15, 2); sfx('swoosh-06-351021.mp3', 17.4 + i * 2.0, -20)  # katmanlar ayrılıyor
sfx('simple-whoosh-382724.mp3', 27.4, -17)                                                          # şasiye iniş
sfx('benkirb-shine-1-268902.mp3', O(28.0), 4)                                                       # elektrik hatları
sfx('flowing-water-sound-effect-418728.mp3', O(28.3), 2, maxlen=3.2)                               # su hatları
sfx('notification-pluck-off-269290.mp3', O(32.75), -2)                                              # "Sakarya'da"
ticks = [35.9 + 1.3 * (1 - (1 - (i + 1) / 17) ** (1 / 3)) for i in range(17)]
for i, tc in enumerate(ticks):
    sfx('ui-sounds-pack-3-7-359721.mp3', O(tc), 3, pan=(i % 2 - .5) * .3)                           # 17 sayacı
sfx('marimba-bloop-2-188149.mp3', O(36.9), -13)                                                     # basın
for i in range(10):
    sfx('pop-2-269283.mp3', O(39.7 + (9 - i) * .3 + 1.7), -6, pan=.2, maxlen=.4)                   # eşyalar geri dönüyor
sfx('universfield-computer-mouse-click-352734.mp3', O(44.75), -4)                                   # kapı mandalı
for i in range(4):
    sfx(['marimba-bloop-2-188149.mp3', 'marimba-bloop-3-188151.mp3'][i % 2], O(46.0 + i * .85), -15)  # belgeler
sfx('App Click 1.wav', O(53.3), -10); sfx('universfield-computer-mouse-click-352734.mp3', O(53.42), 0)  # anahtar
sfx('simple-whoosh-02-433006.mp3', O(55.0), -18)                                                    # logo girişi
sfx('shine-6-268910.mp3', O(56.1), -12, maxlen=3.6)                                                 # yapraklar
for a_, rest in [(56.35, 6), (57.15, 4), (57.95, 3)]:                                            # Ekolojik / Sağlam / Doğal
    sfx('soft-subtle-ui-pop-sfx-348820.mp3', O(a_), -14, maxlen=.5)
    for j in range(rest):
        sfx('ui-sounds-pack-3-7-359721.mp3', O(a_ + .38 + .24 * j / rest), -2, pan=.15)
    sfx('minimal-pop-click-ui-11-198311.mp3', O(a_ + .93), -12, maxlen=.6)
sfx('marimba-bloop-3-188151.mp3', O(58.95), -12)                                                    # EKSADO tamam

# ---------------- reverb, seslendirme, master ----------------
ir_n = int(2.0 * SR); ir_t = np.arange(ir_n) / SR
def reverb(x, seed, dec=.5):
    r = np.random.default_rng(seed).standard_normal(ir_n) * np.exp(-ir_t / dec); r[0] = 0
    L = 1 << int(np.ceil(np.log2(len(x) + ir_n)))
    y = np.fft.irfft(np.fft.rfft(x, L) * np.fft.rfft(r, L), L)[:len(x)]
    return y / (np.abs(y).max() + 1e-9) * np.abs(x).max()
for c in (0, 1):
    mus[:, c] += .35 * reverb(mus[:, c], c + 1); fx[:, c] += .12 * reverb(fx[:, c], c + 5, .3)
mix = mus * 10 ** (-3 / 20) + fx
if VO:
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', VO, '-f', 'f32le', '-ac', '2', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    v = np.frombuffer(raw, dtype=np.float32).reshape(-1, 2).astype(float)[:N]
    vo = np.zeros((N, 2)); vo[:len(v)] = v
    duck = np.convolve(np.abs(vo[:, 0]) > .02, np.ones(int(.3 * SR)) / int(.3 * SR), 'same')
    mix = mix * (1 - .45 * np.clip(duck * 3, 0, 1))[:, None] + vo
fade = np.ones(N); fn = int(.8 * SR); fade[-fn:] = np.linspace(1, 0, fn) ** 2
mix *= fade[:, None]
mix = mix / (np.abs(mix).max() + 1e-9) * .89
pcm = (np.clip(mix, -1, 1) * 32767).astype(np.int16)
with wave.open(OUT, 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('ok', OUT)
