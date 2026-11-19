"""EKSADO duyuru animasyonu için yazma (typing) ve geçiş efektleri — duyuru.html zamanlamasıyla birebir.
Tuş sesleri keyboard-typing-fast kaydından tek tek kesilir (vuruş anı tespiti), rastgele seçilip hafif perde farkıyla çalınır.
Kullanım: python3 duyuru_sfx.py <sfx_klasörü> <çıktı.wav> [süre=14.5]"""
import sys, subprocess, wave
import numpy as np
SFX, OUT = sys.argv[1:3]; DUR = float(sys.argv[3]) if len(sys.argv) > 3 else 14.5
SR = 48000; N = int(DUR * SR); rng = np.random.default_rng(3)
def load(name):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f'{SFX}/{name}', '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(float)
def norm(a): return a / (np.sqrt((a ** 2).mean()) + 1e-9)
# ---- tek tuş vuruşlarını kes ----
kb = load('keyboard-typing-fast-371229.mp3')
env = np.convolve(np.abs(kb), np.ones(96) / 96, 'same')
thr = np.percentile(env, 92); keys = []; last = -SR
for i in np.where((env[1:-1] > thr) & (env[1:-1] >= env[:-2]) & (env[1:-1] >= env[2:]))[0] + 1:
    if i - last < int(.07 * SR): continue
    a = kb[max(0, i - int(.006 * SR)):i + int(.085 * SR)].copy()
    if len(a) < int(.06 * SR): continue
    f = int(.025 * SR); a[-f:] *= np.linspace(1, 0, f) ** 2; a[:int(.002 * SR)] *= np.linspace(0, 1, int(.002 * SR))
    keys.append(norm(a)); last = i
keys = keys[:40]; print(len(keys), 'tuş vuruşu')
mix = np.zeros(N)
def add(a, t, db, rate=1.0):
    if rate != 1.0:  # basit perde/hız değişimi
        idx = np.arange(0, len(a) - 1, rate); a = np.interp(idx, np.arange(len(a)), a)
    j = int(t * SR); a = a[:max(0, N - j)]; mix[j:j + len(a)] += a * 10 ** (db / 20)
def key(t, db=-14, low=False):
    add(keys[rng.integers(len(keys))], t + rng.uniform(-.006, .006), db + rng.uniform(-2, 1.5), (.8 if low else 1) * rng.uniform(.94, 1.06))
pop, plop, shine = norm(load('soft-pop-sfx-433612.mp3')), norm(load('creatorshome-plop-333525.mp3')), norm(load('shine-6-268910.mp3'))
wh1, wh2, fall = norm(load('simple-whoosh-382724.mp3')), norm(load('swoosh-015-383769.mp3')), norm(load('whoosh-arrow-start-243483.mp3'))
thock = norm(load('soft-subtle-ui-pop-sfx-348820.mp3'))
# ---- zaman çizelgesi (duyuru.html ile aynı) ----
add(pop, .1, -16)                                                     # ikon açılır
TITLE = 'SEVKİYAT BİRİMİNDEN DUYURU'
for i, ch in enumerate(TITLE):                                        # başlık harf harf (her ikinci harfte tuş)
    if ch != ' ' and i % 2 == 0: key(.85 + i * .035, -15)
add(wh1, 2.55 - .15, -22)                                             # ikon + başlık üste kayar
LINES = ['GTA 6’nın çıkışıyla birlikte', '“Vice City’ye tiny house', 'gönderiyor musunuz?”', 'sorusu gelmeye başladı.']
words = ' '.join(LINES).split(' ')
for i, w in enumerate(words):                                         # metin kelime kelime: kelime başına 2–3 tuş
    s = 3.4 + i * .15
    for k in range(min(3, max(1, len(w) // 3))): key(s + k * .048, -15)
for i in range(3):                                                    # "Konum atın, bakalım." — tok vuruş
    key(6.85 + i * .26, -9, low=True); add(thock, 6.85 + i * .26, -20)
add(fall, 7.75 - .05, -24)                                            # pin düşer
add(plop, 7.75 + .43, -12)                                            # pin oturur
add(wh2, 10.75 - .1, -22)                                             # sahne kaybolur
add(shine, 12.35, -24)                                                # logo dolar
for i in range(6): key(12.55 + i * .09, -14)                          # EKSADO harfleri
mix = mix / (np.abs(mix).max() + 1e-9) * 10 ** (-3 / 20)
fo = int(.4 * SR); mix[-fo:] *= np.linspace(1, 0, fo)
st = (np.stack([mix, mix], 1) * 32767).astype(np.int16)
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes(st.tobytes())
print('ok', OUT)
