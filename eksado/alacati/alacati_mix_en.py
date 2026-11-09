"""EKSADO Alaçatı Reels – İngilizce: ElevenLabs v3 (Olivia) seslendirmesi + altyazı + videonun kendi müziği.
Sonda yorum çağrısı yok; "For more details, contact us at eksado.com" ile biter.
Kullanım: python3 alacati_mix_en.py <vo.mp3> <video> <çıktı.wav> <altyazı.json>
Okuma 34 sn: sahnelere oturması için %5 hızlandırılır."""
import sys, json, subprocess, wave, re
import numpy as np
VO, VID, OUT, SUBJ = sys.argv[1:5]
SR = 48000; TEMPO = 1.05
def dec(p, ch, af=None):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn'] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (take 1, hızlandırma öncesi); ekranda görünen yazımla (TTS için "Alachatuh" / "Eksado dot com" yazıldı)
W = [("Diagonal",0,.48),("wood,",.544,.88),("and",.9,.96),("a",1,1.04),("white",1.093,1.36),("metal",1.413,1.68),("facade.",1.76,2.48),("Meet",2.592,3.04),("Alaçatı.",3.147,4),
 ("A",4.48,4.96),("bright",5.017,5.36),("living",5.406,5.68),("area,",5.76,6.16),("with",6.176,6.24),("floor-to-ceiling",6.307,7.12),("glass.",7.2,7.92),
 ("A",8.12,8.32),("smart",8.36,8.56),("TV|",8.68,9.04),("and",9.08,9.2),("air",9.24,9.36),("conditioning,",9.409,10.08),("as",10.133,10.24),("standard.",10.302,10.96),
 ("The",11.16,11.76),("kitchen",11.8,12.08),("comes|",12.133,12.4),("with",12.416,12.48),("a",12.56,12.64),("two-ring",12.68,13.04),("hob,",13.14,13.68),("a",13.72,13.76),("mini",13.824,14.08),("oven|",14.144,14.4),("and",14.46,14.64),("a",14.74,14.84),("cooker",14.869,15.04),("hood.",15.104,15.6),
 ("Plus,",15.712,16.24),("a",16.28,16.32),("separate",16.373,16.8),("bedroom.",16.86,17.44),
 ("A",17.84,18.24),("mini",18.288,18.48),("fridge|",18.537,18.88),("and",18.9,18.96),("a",19,19.04),("water",19.107,19.44),("heater,",19.486,19.84),("included.",19.902,20.72),
 ("A",20.96,21.2),("bathroom|",21.253,21.68),("with",21.696,21.76),("a",21.8,21.84),("walk-in",21.904,22.32),("shower.",22.377,22.88),
 ("23",23.017,24.08),("square",24.137,24.48),("metres,",24.549,25.04),("sleeping",25.111,25.68),("five.",25.792,26.48),
 ("Take",26.64,27.28),("the",27.3,27.36),("storage",27.42,27.84),("stairs,",27.897,28.32),("and",28.34,28.4),("the",28.42,28.48),("loft",28.56,28.88),("is",28.933,29.04),("all",29.1,29.28),("yours.",29.373,30.16),
 ("For",30.32,30.8),("more",30.832,30.96),("details,",31.03,31.6),("contact",31.66,32.08),("us",32.187,32.4),("at",32.453,32.56),("eksado.com.",32.6,34)]
W = [(w, s / TEMPO, e / TEMPO) for w, s, e in W]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç) — sahneler: dış cephe 0–4,8 | oturma 5 | merdiven+TV 7,5 | mutfak 10 | yatak odası 15 |
# mutfak/koridor 17 | banyo 20,3 | genel 25 | loft'a çıkış 27 | kapanış animasyonu 33,3
P = [(0, 2.48, .20), (2.592, 4.0, 2.65), (4.48, 7.92, 4.75), (8.12, 10.96, 8.10), (11.16, 15.6, 10.90), (15.712, 17.44, 15.20),
     (17.84, 20.72, 17.20), (20.96, 22.88, 21.00), (23.017, 26.48, 24.60), (26.64, 30.16, 28.40), (30.32, 34.0, 33.45)]
P = [(a / TEMPO, b / TEMPO, t) for a, b, t in P]
src = dec(VO, 1, f'atempo={TEMPO}')
env = np.sqrt(np.convolve(src ** 2, np.ones(480) / 480, 'same') + 1e-12)
def quiet(lo, hi):
    i0, i1 = max(0, int(lo * SR)), min(len(src) - 1, int(hi * SR))
    return (i0 + int(np.argmin(env[i0:i1 + 1]))) / SR if i1 > i0 else lo
vo = np.zeros(N); speech = np.zeros(N, bool); prev = 0; shift = []
def put(seg, j):
    global prev
    f = int(.012 * SR); seg = seg.copy(); seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    seg = seg[:max(0, N - j)]; vo[j:j + len(seg)] += seg; speech[j:j + len(seg)] = True; prev = j + len(seg)
for a, b, t in P:
    lo = quiet(a - .1, a + .02) if a > .05 else 0.0; hi = quiet(b - .02, b + .09)
    j = max(int((t - (a - lo)) * SR), prev + int(.04 * SR))
    if j / SR + (a - lo) > t + .01: print(f'  kaydırıldı +{j / SR + (a - lo) - t:.2f} sn @ {t}')
    put(src[int(lo * SR):int(hi * SR)], j); shift.append((a, b, j / SR + (a - lo) - a))
print('son konuşma biter:', round(prev / SR, 2), '/', round(N / SR, 2))
# ---- altyazı: noktalamada böl, 28 karakteri aşanı ortadan böl, yan yana kısa öbekleri birleştir ----
def off(t): return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
def L(p): return len(' '.join(w.rstrip('|') for w, _, _ in p).rstrip('.,:?'))
phr, cur = [], []
for w in W:
    cur.append(w)
    if re.search(r'[.,:?|]$', w[0]): phr.append(cur); cur = []  # '|' = elle konan altyazı kırılması
if cur: phr.append(cur)
def split(p):
    if L(p) <= 28 or len(p) == 1: return [p]
    k = min(range(1, len(p)), key=lambda k: abs(L(p[:k]) - L(p) / 2)); return split(p[:k]) + split(p[k:])
chunks = []
for p in phr:
    for c in split(p):
        if chunks and L(chunks[-1] + c) <= 28 and not chunks[-1][-1][0].endswith(('.', '|')) and abs(off(chunks[-1][0][1]) - off(c[0][1])) < 1e-6:
            chunks[-1] = chunks[-1] + c
        else: chunks.append(c)
def html(ws):
    return ' '.join(w.rstrip('|') for w, _, _ in ws).rstrip('.,:').replace('Alaçatı', '<b class="hl">Alaçatı</b>').replace('eksado.com', '<b class="hl">eksado.com</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(min(en, N / SR), 3), html(c)])
subs = [x + ['dark'] if x[0] >= 33.2 else x for x in subs]  # kapanış beyaz zemini: koyu altyazı
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik -3 dB, konuşmada ek -6 dB; seslendirme konuşmada müziğin ~10 dB üstünde ----
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 10 ** (-3 / 20) * (1 - .5 * np.clip(duck, 0, 1))
mus = music * g[:, None]
rm = np.sqrt((mus[speech] ** 2).mean() + 1e-12); rv = np.sqrt((vo[speech] ** 2).mean() + 1e-12)
vo *= (rm * 10 ** (10 / 20)) / rv
mix = mus + vo[:, None]
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print(len(subs), 'altyazı'); [print(s) for s in subs]
