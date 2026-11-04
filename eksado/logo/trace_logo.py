"""EKSADO logosunu (raster) renk katmanlarına ayırıp potrace ile SVG'ye çevirir.
Kullanım: python3 trace_logo.py <girdi.jpg> <çıktı.svg>"""
import sys, colorsys
import numpy as np
from PIL import Image, ImageFilter
import potrace

src, out = sys.argv[1], sys.argv[2]
S = 4
im = Image.open(src).convert('RGB')
im = im.resize((im.width * S, im.height * S), Image.LANCZOS)
a = np.asarray(im).astype(float) / 255
h = np.zeros(a.shape[:2]); s = np.zeros_like(h); v = np.zeros_like(h)
mx, mn = a.max(2), a.min(2); v = mx; s = np.where(mx > 0, (mx - mn) / np.maximum(mx, 1e-6), 0)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
d = np.maximum(mx - mn, 1e-6)
hh = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
col = s > .35
green = col & (hh > 70) & (hh < 170)
orange = col & (hh >= 15) & (hh <= 45) & (v > .75)
brown = col & (hh >= 10) & (hh <= 45) & (v <= .75)

def med(mask):
    p = (a[mask] * 255).astype(int); return '#%02X%02X%02X' % tuple(np.median(p, 0).astype(int))

def trace(mask):
    m = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2.2))
    bm = potrace.Bitmap(np.asarray(m) < 128)
    plist = bm.trace(turdsize=60, alphamax=1.1, opticurve=True, opttolerance=.25)
    parts = []
    for c in plist:
        st = c.start_point; d = [f'M{st.x/S:.2f},{st.y/S:.2f}']
        for seg in c.segments:
            if seg.is_corner:
                d.append(f'L{seg.c.x/S:.2f},{seg.c.y/S:.2f}L{seg.end_point.x/S:.2f},{seg.end_point.y/S:.2f}')
            else:
                d.append(f'C{seg.c1.x/S:.2f},{seg.c1.y/S:.2f} {seg.c2.x/S:.2f},{seg.c2.y/S:.2f} {seg.end_point.x/S:.2f},{seg.end_point.y/S:.2f}')
        parts.append(''.join(d) + 'Z')
    return ''.join(parts)

H = a.shape[0]
ys = np.arange(H)[:, None] / S
word = orange & (ys > 365)
leafo = orange & (ys <= 365)
ys_all, xs_all = np.nonzero(green | orange | brown)
x0, y0, x1, y1 = xs_all.min() / S - 6, ys_all.min() / S - 6, xs_all.max() / S + 6, ys_all.max() / S + 6
layers = [('house', brown), ('leaf-orange', leafo), ('leaf-green', green), ('word', word)]
# EKSADO yazısını sütun boşluklarından harflere ayır
colsum = word.sum(0) > 0
runs, cx_ = [], 0
while cx_ < len(colsum):
    if colsum[cx_]:
        ce_ = cx_
        while ce_ < len(colsum) and colsum[ce_]: ce_ += 1
        runs.append([cx_, ce_]); cx_ = ce_
    else: cx_ += 1
merged = []
for r in runs:
    if merged and r[0] - merged[-1][1] < 3 * S: merged[-1][1] = r[1]
    else: merged.append(r)
cnt = word.sum(0)
mw = sorted(r[1] - r[0] for r in merged)[len(merged) // 2]
segs = []
for r in merged:
    if r[1] - r[0] > 1.6 * mw:
        lo, hi = r[0] + int(.3 * (r[1] - r[0])), r[0] + int(.7 * (r[1] - r[0]))
        cut = lo + int(np.argmin(cnt[lo:hi])); segs += [[r[0], cut], [cut, r[1]]]
    else: segs.append(r)
merged = segs
assert len(merged) == 6, merged
for i, (a0, a1) in enumerate(merged):
    m = np.zeros_like(word); m[:, a0:a1] = word[:, a0:a1]
    layers.append((f'w{i}', m))
body = '\n'.join(f'  <path id="{n}" fill="{med(m)}" fill-rule="evenodd" d="{trace(m)}"/>' for n, m in layers)
svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{x0:.1f} {y0:.1f} {x1-x0:.1f} {y1-y0:.1f}">\n{body}\n</svg>\n'
open(out, 'w').write(svg)
print('ok', out, [(n, med(m), int(m.sum())) for n, m in layers])
