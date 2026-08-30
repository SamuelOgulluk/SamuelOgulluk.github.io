import json
import os
import numpy as np
from PIL import Image

ROOT = "/workspace"
RAW = os.path.join(ROOT, "public/assets/den/den-color-raw.png")
DEPTH = os.path.join(ROOT, "public/assets/den/den-depth-raw.png")
SPOTS = os.path.join(ROOT, "public/assets/den/den-spots.json")
OUT_DIR = os.path.join(ROOT, "public/assets/den")
CELL = 5
INK = (32, 20, 16)


def dilate(m, n=1):
    out = m.copy()
    for _ in range(n):
        p = np.pad(out, 1, mode="edge")
        out = out | p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
    return out


def snap(mask, w, h, keep=0.4):
    gw, gh = max(1, w // CELL), max(1, h // CELL)
    small = np.array(Image.fromarray(mask.astype(np.uint8) * 255).resize((gw, gh), Image.BOX))
    return np.array(Image.fromarray((small > int(255 * keep)).astype(np.uint8) * 255).resize((w, h), Image.NEAREST)) > 127


def main():
    rgb = np.array(Image.open(RAW).convert("RGB"))
    depth = np.array(Image.open(DEPTH).convert("L")).astype(np.float32)
    h, w = rgb.shape[:2]
    g = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    dx = np.abs(np.diff(g, axis=1, prepend=g[:, :1]))
    dy = np.abs(np.diff(g, axis=0, prepend=g[:1, :]))
    cgrad = np.maximum(dx, dy)
    ddx = np.abs(np.diff(depth, axis=1, prepend=depth[:, :1]))
    ddy = np.abs(np.diff(depth, axis=0, prepend=depth[:1, :]))
    dgrad = np.maximum(ddx, ddy)
    near = depth > 48
    mid = depth > 68
    ys = np.linspace(0, 1, h)[:, None]
    floor = ys > 0.8
    sil = (dgrad > 9) & near
    inner = (cgrad > 40) & mid & ~floor
    edge = snap(dilate(sil, 1), w, h, 0.3) | snap(inner, w, h, 0.52)
    edge &= depth > 38
    edge &= ~(floor & (dgrad < 22))
    out = rgb.astype(np.float32)
    out = np.clip((out - 128.0) * 1.05 + 128.0, 0, 255)
    out[edge] = INK
    im = Image.fromarray(out.astype(np.uint8), "RGB")
    os.makedirs(OUT_DIR, exist_ok=True)
    png = os.path.join(OUT_DIR, "den-color.png")
    webp = os.path.join(OUT_DIR, "den-color.webp")
    dim = Image.open(DEPTH).convert("L")
    im.save(png)
    im.save(webp, "WEBP", quality=90, method=4)
    dim.save(os.path.join(OUT_DIR, "den-depth.png"))
    dim.save(os.path.join(OUT_DIR, "den-depth.webp"), "WEBP", quality=88, method=4)
    if os.path.exists(SPOTS):
        data = json.load(open(SPOTS))
        print("spots", data.get("spots"))
    print("ok", im.size, "ink", float(edge.sum()) / edge.size)


if __name__ == "__main__":
    main()
