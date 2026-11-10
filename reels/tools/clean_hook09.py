# Remove the "OBJECT" overlays from the hook clip (raw rgb24 stdin -> stdout).
import sys
import numpy as np

W, H = 1080, 1920
FR = W * H * 3
Y0, Y1, X0, X1 = 320, 540, 340, 760   # big title box
TOP_UNTIL = 80

def grow(m, r=2):
    g = m.copy()
    for dy in range(-r, r + 1):
        for dx in range(-r, r + 1):
            g |= np.roll(np.roll(m, dy, 0), dx, 1)
    return g

stdin, stdout = sys.stdin.buffer, sys.stdout.buffer
n = 0
while True:
    buf = stdin.read(FR)
    if len(buf) < FR:
        break
    a = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()
    if n < TOP_UNTIL:
        box = a[Y0:Y1, X0:X1].astype(np.float32)
        R, G, B = box[..., 0] + 1, box[..., 1], box[..., 2]
        gr, br, s = G / R, B / R, box.sum(-1)
        strong = (gr > 0.8) & (br < 0.35) & (s > 12)          # unmistakable yellow lettering
        title = strong | (grow(strong, 4) & (gr > 0.72))        # + grey bevel only when it touches the lettering
        edge = grow(title, 3) & ((br < 0.35) | (s < 90))        # orange/yellow rim and dark outline
        kill = title | edge
        skin_c = (br > 0.42) & (s > 110) & (gr < 0.95)           # skin incl. its pale lilac/grey patches
        skin = grow(~grow(~skin_c, 4), 4)                         # opening: drops thin letter rims, keeps the hand
        near_skin = grow(skin, 6)
        yellowish = (gr > 0.7) & (br < 0.38)
        pencil = (gr < 0.7) & (br > 0.22) & (box[..., 0] > 45) & (s > 95)  # pencil wood has some blue; gold rims do not
        # away from the hand only the pencil is real; everything else in this box is black studio background
        far = ~near_skin & ~pencil & (s > 0)
        fill = near_skin & yellowish                             # yellow/olive fringe at the hand's edge: inpaint
        box[far] = 0
        if fill.any():
            known = ~fill
            img = box.copy()
            img[fill] = 0
            for _ in range(40):                                # simple diffusion inpainting from surrounding pixels
                acc = np.zeros_like(img); cnt = np.zeros(fill.shape, np.float32)
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    sh = np.roll(np.roll(img, dy, 0), dx, 1)
                    kn = np.roll(np.roll(known, dy, 0), dx, 1)
                    acc += sh * kn[..., None]; cnt += kn
                upd = fill & (cnt > 0)
                img[upd] = acc[upd] / cnt[upd][:, None]
                known = known | upd
            box = img
        a[Y0:Y1, X0:X1] = box.astype(np.uint8)
    if n >= 60:
        reg = a[1440:1780, 0:372].astype(np.int16)
        R, G = reg[..., 0], reg[..., 1]
        orange_edge = (R > G * 1.5) & (R > 80)
        reg[(reg.sum(-1) < 240) & ~orange_edge] = 0
        a[1440:1780, 0:372] = reg.astype(np.uint8)
    stdout.write(a.tobytes())
    n += 1
sys.stderr.write(f"frames {n}\n")
