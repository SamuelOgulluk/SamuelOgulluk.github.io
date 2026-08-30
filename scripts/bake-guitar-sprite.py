import os
import numpy as np
from PIL import Image

RAW = "/tmp/guitar-raw.png"
OUT_SPRITE = "/workspace/public/assets/sprites/01-guitar.png"
OUT_PREV = "/tmp/sprites-preview/01-guitar.png"
OUT_ART = "/opt/cursor/artifacts/sprites/01-guitar-preview.png"
CELL = 8
INK = (20, 10, 8)
BG = (236, 224, 204)
COLOR_T = 42


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


def main():
    raw = Image.open(RAW).convert("RGBA")
    arr = np.array(raw)
    pad = CELL * 3
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

    gw, gh = max(1, w // CELL), max(1, h // CELL)
    small = np.array(Image.fromarray(np.dstack([rgb, alpha])).resize((gw, gh), Image.BOX))
    g = 0.299 * small[:, :, 0] + 0.587 * small[:, :, 1] + 0.114 * small[:, :, 2]
    a = small[:, :, 3]
    opaque = a > 40

    outer = dilate(opaque, 2) & ~opaque
    sil = opaque & ~erode(opaque, 1)
    dx = np.abs(np.diff(g, axis=1, prepend=g[:, :1]))
    dy = np.abs(np.diff(g, axis=0, prepend=g[:1, :]))
    inner = ((dx > COLOR_T) | (dy > COLOR_T)) & opaque & ~dilate(~opaque, 1)
    edge = outer | sil | inner
    em = np.array(Image.fromarray(edge.astype(np.uint8) * 255).resize((w, h), Image.NEAREST)) > 127

    out = arr.copy()
    ink = em & (alpha > 15)
    out[ink, 0] = INK[0]
    out[ink, 1] = INK[1]
    out[ink, 2] = INK[2]
    out[ink, 3] = 255

    ys, xs = np.where(out[:, :, 3] > 20)
    margin = CELL
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
    os.makedirs(os.path.dirname(OUT_ART), exist_ok=True)
    sprite.save(OUT_SPRITE)
    prev = Image.new("RGB", (sprite.size[0] + 80, sprite.size[1] + 80), BG)
    prev.paste(sprite, (40, 40), sprite)
    prev.save(OUT_PREV, quality=95)
    prev.save(OUT_ART, quality=95)
    print("ok", sprite.size, OUT_SPRITE)


if __name__ == "__main__":
    main()
