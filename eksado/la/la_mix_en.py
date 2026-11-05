"""EKSADO Los Angeles (wood) Reels – İngilizce: ElevenLabs v3 (Adrian Vale) seslendirmesi + altyazı + videonun kendi müziği.
Kullanım: python3 la_mix_en.py <vo.mp3> <vo.mp3> <video> <sfx_klasörü> <çıktı.wav> <altyazı.json>  (CTA aynı dosyanın sonunda)"""
import sys, os, json, subprocess, wave, re
import numpy as np
VO, CTA, VID, SFX, OUT, SUBJ = sys.argv[1:7]
SR = 48000
def dec(p, ch):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-vn', '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, dtype=np.float32).astype(float); return a.reshape(-1, ch) if ch > 1 else a
music = dec(VID, 2); N = len(music)
# Scribe kelime zaman damgaları (ana okuma, take 2): (kelime, başlangıç, bitiş)
W = [("Let",0,.16),("me",.187,.24),("show",.288,.48),("you",.5,.56),("the",.6,.72),("Los",.76,.88),("Angeles,",.94,1.44),("in",1.493,1.6),("wood.",1.664,2.64),
 ("The",2.66,2.72),("warmth",2.777,3.12),("of",3.173,3.28),("wood",3.328,3.52),("outside,",3.6,4.4),("the",4.42,4.48),("comfort",4.55,5.04),("of",5.093,5.2),("white",5.253,5.52),("inside.",5.6,6.4),
 ("A",6.56,6.72),("bright",6.766,7.04),("living",7.086,7.36),("area,",7.44,8.08),("large",8.12,8.32),("windows,",8.38,9.04),("and",9.06,9.12),("a",9.16,9.2),("loft",9.264,9.52),("upstairs.",9.582,10.4),
 ("In",10.533,10.8),("the",10.82,10.88),("kitchen:",10.95,11.64),("a",11.74,11.84),("fridge,",11.897,12.48),("a",12.56,12.64),("two-burner",12.68,13.12),("hob,",13.2,13.84),("a",13.88,13.92),("mini",13.968,14.16),("oven",14.24,14.56),("and",14.6,14.72),("a",14.76,14.8),("dishwasher.",14.851,15.68),
 ("All",15.76,16),("standard.",16.062,16.88),
 ("A",17.04,17.2),("separate",17.244,17.6),("bedroom,",17.66,18.32),("bed",18.38,18.56),("included.",18.622,19.44),
 ("Air",19.54,19.84),("conditioning",19.889,20.48),("and",20.54,20.72),("a",20.76,20.8),("smart",20.867,21.2),("TV,",21.24,21.52),("too.",21.58,22.08),
 ("And",22.18,22.48),("the",22.5,22.56),("bathroom:",22.613,23.44),("shower,",23.497,23.92),("sink",24.032,24.48),("and",24.54,24.72),("toilet,",24.789,25.36),("all",25.4,25.52),("complete.",25.582,26.4)]
# (kaynak başlangıç, kaynak bitiş, videoda başlangıç)
P = [(0, 2.64, .30), (2.66, 6.4, 3.20), (6.56, 10.4, 7.15), (10.533, 15.68, 11.10), (15.76, 16.88, 16.35),
     (17.04, 19.44, 17.60), (19.54, 22.08, 20.10), (22.18, 26.4, 22.75)]
CTA_SRC = (26.52, 29.28)
src = dec(VO, 1); cta = src[int((CTA_SRC[0] - .06) * SR):int((CTA_SRC[1] + .15) * SR)]
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
    lo = quiet(a - .1, a + .02) if a > .05 else 0.0; hi = quiet(b - .02, b + .14)
    j = max(int((t - (a - lo)) * SR), prev + int(.04 * SR)); put(src[int(lo * SR):int(hi * SR)], j)
    shift.append((a, b, j / SR + (a - lo) - a))
CTA_T = 27.10; put(cta, int(CTA_T * SR))
# ---- altyazı parçaları (en fazla 4 kelime, noktalamada böl; "Los Angeles" birlikte) ----
def off(t):
    return next(d for a, b, d in shift if a - .01 <= t <= b + .01)
chunks, cur = [], []
for i, (w, s, e) in enumerate(W):
    cur.append((w, s, e))
    nxt = W[i + 1][0] if i + 1 < len(W) else None
    if re.search(r'[.,:]$', w) or len(cur) == 4 or (nxt == 'Los' and len(cur) > 2):
        if w == 'Los': continue
        chunks.append(cur); cur = []
if cur: chunks.append(cur)
def html(ws):
    txt = ' '.join(w for w, _, _ in ws).rstrip('.,:')
    return txt.replace('Los Angeles', '<b class="hl">Los Angeles</b>')
subs = []
for k, c in enumerate(chunks):
    st = c[0][1] + off(c[0][1]); en = c[-1][2] + off(c[-1][2]) + .25
    if k + 1 < len(chunks): en = min(en, chunks[k + 1][0][1] + off(chunks[k + 1][0][1]) - .02)
    subs.append([round(st - .05, 3), round(en, 3), html(c)])
subs.append([round(CTA_T + .02, 3), round(CTA_T + 1.27, 3), 'For full details', 'dark'])
subs.append([round(CTA_T + 1.29, 3), 31.0, 'comment <b class="hl big">Los Angeles</b> below', 'dark'])
json.dump(subs, open(SUBJ, 'w'), ensure_ascii=False)
# ---- miks: müzik genel olarak -5 dB, konuşmada ek ~-4 dB ----
k = int(.25 * SR); duck = np.convolve(speech.astype(float), np.ones(k) / k, 'same')
g = 10 ** (-5 / 20) * (1 - .4 * np.clip(duck, 0, 1))
mix = music * g[:, None] + vo[:, None]
w = dec(os.path.join(SFX, 'simple-whoosh-382724.mp3'), 2)
i0 = int(3.05 * SR) - int(np.argmax(np.abs(w).max(1))); w = w[:N - i0] * 10 ** (-22 / 20); mix[i0:i0 + len(w)] += w
mix = mix / (np.abs(mix).max() + 1e-9) * .89
with wave.open(OUT, 'wb') as f:
    f.setnchannels(2); f.setsampwidth(2); f.setframerate(SR); f.writeframes((np.clip(mix, -1, 1) * 32767).astype(np.int16).tobytes())
print(len(subs), 'altyazı'); [print(s) for s in subs]
