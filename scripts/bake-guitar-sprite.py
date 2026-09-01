import os
import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW = os.path.join(ROOT, "public", "assets", "sprites", "01-guitar-raw.png")
OUT_SPRITE = os.path.join(ROOT, "public", "assets", "sprites", "01-guitar.png")
OUT_PREV = os.path.join(ROOT, "scripts", "cache", "01-guitar-preview.png")
CELL = 5
INK = (32, 20, 16)
BG = (236, 224, 204)
COLOR_T = 78


def dilate(m, n=1):
    out = m.copy()
    for _ in range(n):
        p = np.pad(out, 1, mode="edge")
        out = out | p[:-2, 1:-1] | p[2:, 1:-1] | p[1:-1, :-2] | p[1:-1, 2:]
    return out


def erode(m, n=1):
    out = m.copy()
    for _ in range(n):
        p = np.pad(out, 1, mode="constant")
        out = out & p[:-2, 1:-1] & p[2:, 1:-1] & p[1:-1, :-2] & p[1:-1, 2:]
    return out


def snap(mask, w, h, keep=0.35):
    gw, gh = max(1, w // CELL), max(1, h // CELL)
    small = np.array(Image.fromarray(mask.astype(np.uint8) * 255).resize((gw, gh), Image.BOX))
    return np.array(Image.fromarray((small > int(255 * keep)).astype(np.uint8) * 255).resize((w, h), Image.NEAREST)) > 127


def main():
    raw = Image.open(RAW).convert("RGBA")
    arr = np.array(raw)
    cream = (arr[:, :, 0] > 220) & (arr[:, :, 1] > 205) & (arr[:, :, 2] > 185)
    arr[cream, 3] = 0
    pad = CELL * 5
    h0, w0 = arr.shape[:2]
    big = np.zeros((h0 + pad * 2, w0 + pad * 2, 4), np.uint8)
    big[pad : pad + h0, pad : pad + w0] = arr
    arr = big
    alpha = arr[:, :, 3]
    h, w = alpha.shape

    bg = np.zeros((h, w, 3), np.uint8)
    bg[:, :] = BG
    al = alpha.astype(np.float32)[..., None] / 255.0
    rgb = (arr[:, :, :3].astype(np.float32) * al + bg.astype(np.float32) * (1 - al)).astype(np.uint8)

    opaque = alpha > 28
    sil = (opaque & ~erode(opaque, 1)) | (dilate(opaque, 1) & ~opaque)
    g = 0.299 * rgb[:, :, 0] + 0.587 * rgb[:, :, 1] + 0.114 * rgb[:, :, 2]
    dx = np.abs(np.diff(g, axis=1, prepend=g[:, :1]))
    dy = np.abs(np.diff(g, axis=0, prepend=g[:1, :]))
    major = ((dx > 110) | (dy > 110)) & erode(opaque, 6)
    edge = snap(sil, w, h, 0.32) | snap(major, w, h, 0.55)
    out = arr.copy()
    out[:, :, :3] = rgb
    out[:, :, 3] = np.where(opaque | edge, 255, 0)
    out[edge, 0] = INK[0]
    out[edge, 1] = INK[1]
    out[edge, 2] = INK[2]
    out[edge, 3] = 255

    ys, xs = np.where(out[:, :, 3] > 20)
    margin = CELL * 3
    sprite = Image.fromarray(out).crop(
        (
            max(0, int(xs.min()) - margin),
            max(0, int(ys.min()) - margin),
            min(w, int(xs.max()) + margin),
            min(h, int(ys.max()) + margin),
        )
    )
    os.makedirs(os.path.dirname(OUT_SPRITE), exist_ok=True)
    os.makedirs(os.path.dirname(OUT_PREV), exist_ok=True)
    sprite.save(OUT_SPRITE)
    prev = Image.new("RGB", (sprite.size[0] + 64, sprite.size[1] + 64), BG)
    prev.paste(sprite, (32, 32), sprite)
    prev.save(OUT_PREV, quality=95)
    print("ok", sprite.size, "ink", float(edge.sum()) / max(1, opaque.sum()))


if __name__ == "__main__":
    main()
