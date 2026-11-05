"""EKSADO Los Angeles (ahşap) Reels: ElevenLabs seslendirmesini videonun kendi müziğinin üstüne yerleştirir.
Kullanım: python3 la_mix.py <vo.mp3> <orijinal_video> <sfx_klasörü> <çıktı.wav>
Kaynak zamanları ElevenLabs Scribe kelime zaman damgalarından (Hasan Yasin, multilingual_v2, take 2)."""
import sys, os, subprocess, wave
import numpy as np
VO, VID, SFX, OUT = sys.argv[1:5]
SR = 48000
def dec(path, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).astype(float).reshape(-1, ch) if ch > 1 else np.frombuffer(raw, dtype=np.float32).astype(float)
music = dec(VID, 2); N = len(music)
src = dec(VO, 1)
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç)
P = [(0.000, 2.961, 0.15),    # Size, Los Angeles ahşabı tanıtacağım.
     (3.286, 7.198, 3.25),    # Dışarıda ahşabın sıcaklığı, içeride beyazın konforu.
     (7.639, 12.179, 7.30),   # Ferah bir oturma alanı, geniş pencereler ve üstte bir loft.
     (12.504, 16.707, 11.95), # Mutfakta buzdolabı, ikili ocak, mini fırın ve bulaşık makinesi.
     (17.090, 18.378, 16.25), # Hepsi standart.
     (20.305, 23.266, 17.65), # Bağımsız yatak odası, yatağıyla birlikte geliyor.
     (23.591, 25.751, 20.70), # Klima ve Smart TV de dahil.
     (26.134, 30.093, 22.95), # Ve banyo: duşu, lavabosu, WC'siyle eksiksiz.
     (30.418, 32.368, 27.00), # O iki tip onaylı Los Angeles.
     (32.751, 33.808, 29.20)] # Eksado.
env = np.sqrt(np.convolve(src ** 2, np.ones(480) / 480, 'same') + 1e-12)
def quiet(lo, hi):
    i0, i1 = max(0, int(lo * SR)), min(len(src) - 1, int(hi * SR))
    return (i0 + int(np.argmin(env[i0:i1 + 1]))) / SR if i1 > i0 else lo
vo = np.zeros(N); speech = np.zeros(N, bool); prev_end = 0
for a, b, t in P:
    lo = quiet(a - .12, a + .02) if a > .05 else 0.0
    hi = quiet(b - .02, b + .18)
    seg = src[int(lo * SR):int(hi * SR)].copy(); f = int(.012 * SR)
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    j = max(int((t - (a - lo)) * SR), prev_end + int(.04 * SR))
    seg = seg[:max(0, N - j)]; vo[j:j + len(seg)] += seg; speech[j:j + len(seg)] = True; prev_end = j + len(seg)
    print(f'{j / SR:6.2f}-{prev_end / SR:6.2f}')
# müziği konuşma altında yumuşakça kıs (~-4 dB), yumuşak geçişlerle
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 1 - float(os.environ.get('DUCK', '.35')) * np.clip(duck, 0, 1)
vo_gain = 10 ** (float(os.environ.get('VO_GAIN_DB', '0')) / 20)
mix = music * g[:, None] + (vo * vo_gain)[:, None]
# içeri girişte çok hafif bir geçiş sesi
w = dec(os.path.join(SFX, 'simple-whoosh-382724.mp3'), 2)
i0 = int(2.95 * SR) - int(np.argmax(np.abs(w).max(1))); w = w[:N - i0] * 10 ** (-20 / 20); mix[i0:i0 + len(w)] += w
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as fw:
    fw.setnchannels(2); fw.setsampwidth(2); fw.setframerate(SR); fw.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print('ok', OUT)
