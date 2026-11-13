"""Vagon Ahşap – 3,2 sn "ışıklar yanıyor" görsel kancası.
Işıklı merdiven planı (videonun 10. saniyesi) karanlıkta başlar; LED'ler iki kez titrer, ışık merdivenden aşağıdan yukarı yayılır,
kısa bir parlama (bloom) ile ev aydınlanır; yavaş ileri zoom sürer, son 0,2 sn beyaza açılır (ev videosu beyazdan girer).
Kullanım: python3 vagon_hook_frames.py <video> <çıktı.mp4>"""
import sys, subprocess
import numpy as np
from PIL import Image, ImageFilter

VID, OUT = sys.argv[1:3]
W, H, FPS, DUR, SRC = 720, 1280, 30, 3.2, 10.0
NF = int(round(DUR * FPS))
raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(SRC), '-i', VID, '-frames:v', str(NF), '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
                     capture_output=True, check=True).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3)
enc = subprocess.Popen(['ffmpeg', '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-c:v', 'libx264', '-preset', 'slow', '-crf', '14', '-pix_fmt', 'yuv420p', OUT], stdin=subprocess.PIPE)
ys = np.arange(H, dtype=np.float32)[:, None, None]
ease = lambda x: 1 - (1 - np.clip(x, 0, 1)) ** 3
for k in range(NF):
    t = k / FPS
    img = Image.fromarray(frames[min(k, len(frames) - 1)])
    z = 1.06 + .06 * t / DUR                                  # yavaş ileri zoom
    cw, ch = W / z, H / z
    img = img.resize((W, H), Image.LANCZOS, box=((W - cw) / 2, (H - ch) / 2, (W + cw) / 2, (H + ch) / 2))
    F = np.asarray(img, np.float32) / 255
    L = F @ np.array([.299, .587, .114], np.float32)
    hot = np.clip((L - .78) / .22, 0, 1)[..., None]
    dark = (F ** 2.4 * .09 + F * hot * .22) * np.array([.82, .9, 1.18], np.float32)   # karanlık, soğuk ton; LED'ler hafif seçilir
    # ışık önü: 0,86–1,40 sn arasında aşağıdan yukarı yayılır; öncesinde iki kısa titreme
    p = ease((t - .86) / .54)
    front = H * (1.15 - 1.45 * p)
    m = np.clip((ys - front) / 260 + .5, 0, 1) if t >= .86 else np.zeros((H, 1, 1), np.float32)
    if .70 <= t < .74 or .78 <= t < .81: m = np.maximum(m, .35)
    boost = 1 + .3 * np.exp(-max(0, t - 1.35) / .28) * (t >= 1.0)   # parlama
    lit = F * boost
    if t >= 1.0 and boost > 1.03:
        glow = Image.fromarray((np.clip(F * hot, 0, 1) * 255).astype(np.uint8)).resize((W // 4, H // 4)).filter(ImageFilter.GaussianBlur(10)).resize((W, H))
        lit = lit + np.asarray(glow, np.float32) / 255 * (boost - 1) * 1.0
    out = dark * (1 - m) + lit * m
    if t > DUR - .2: w = (t - (DUR - .2)) / .2; out = out * (1 - w) + w   # beyaza açıl
    enc.stdin.write((np.clip(out, 0, 1) * 255).astype(np.uint8).tobytes())
enc.stdin.close(); enc.wait()
print('kanca', NF, 'kare ->', OUT)
