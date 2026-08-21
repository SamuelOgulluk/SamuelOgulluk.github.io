# Textures de la taniere 3D : Paris au crepuscule, bois, tapis, loutre.
import os
import urllib.request
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance

OUT = "/workspace/public/assets"
os.makedirs(OUT, exist_ok=True)
UA = "SamuelDen/1.0 (github.com/SamuelOgulluk)"


def save(im, name):
    path = os.path.join(OUT, name)
    im.save(path, quality=92)
    print(name, im.size)


def paint_paris():
    w, h = 1920, 1080
    y = np.broadcast_to(np.linspace(0, 1, h)[:, None], (h, w))
    r = (18 + 210 * (y ** 1.6)).clip(0, 255)
    g = (16 + 90 * (y ** 1.35) + 40 * (y ** 3)).clip(0, 255)
    b = (42 + 30 * (1 - y) + 20 * (y ** 2)).clip(0, 255)
    sky = np.dstack([r, g, b]).astype(np.uint8)
    im = Image.fromarray(sky, "RGB")
    d = ImageDraw.Draw(im, "RGBA")
    rng = np.random.default_rng(7)

    def roof_row(y0, scale, tint, n):
        x = -80
        for i in range(n):
            rw = int((140 + rng.integers(0, 90)) * scale)
            rh = int((70 + rng.integers(0, 50)) * scale)
            peak = int(rh * (0.35 + 0.2 * rng.random()))
            x2 = x + rw
            col = (
                int(tint[0] + rng.integers(-14, 15)),
                int(tint[1] + rng.integers(-12, 13)),
                int(tint[2] + rng.integers(-10, 12)),
                255,
            )
            d.polygon(
                [(x, y0), (x + rw * 0.12, y0 - peak), (x2 - rw * 0.08, y0 - peak * 0.85), (x2, y0), (x2, y0 + rh), (x, y0 + rh)],
                fill=col,
            )
            chim = x + rw * 0.55
            cw, ch = int(10 * scale), int(22 * scale)
            d.rectangle([chim, y0 - peak - ch, chim + cw, y0 - peak + 4], fill=(92, 48, 40, 255))
            d.rectangle([chim - 2, y0 - peak - ch - 4, chim + cw + 2, y0 - peak - ch + 2], fill=(70, 36, 32, 255))
            if rng.random() > 0.35:
                wx, wy = x + rw * 0.3, y0 + rh * 0.35
                ww, wh = max(4, int(7 * scale)), max(5, int(9 * scale))
                glow = (255, 196, 110, int(180 * min(1, scale)))
                d.rectangle([wx, wy, wx + ww, wy + wh], fill=glow)
            x = x2 - int(18 * scale)

    roof_row(430, 0.55, (78, 72, 88), 22)
    roof_row(500, 0.75, (86, 78, 82), 18)
    d.ellipse([1180, 355, 1320, 430], fill=(232, 214, 196, 230))
    d.polygon([(1210, 410), (1250, 330), (1290, 410)], fill=(236, 220, 200, 240))
    d.rectangle([1238, 400, 1262, 455], fill=(228, 210, 190, 230))
    roof_row(590, 1.0, (96, 86, 80), 16)
    roof_row(700, 1.25, (70, 64, 68), 14)
    d.rectangle([0, 820, w, h], fill=(48, 42, 46, 255))
    for i in range(28):
        x = 40 + i * 70
        d.rectangle([x, 790, x + 16, 860], fill=(88, 46, 40, 255))
        d.rectangle([x - 3, 782, x + 19, 792], fill=(64, 34, 30, 255))
    haze = Image.new("RGB", (w, h), (255, 140, 70))
    im = Image.blend(im.convert("RGB"), haze, 0.12)
    im = ImageEnhance.Color(im).enhance(1.15)
    im = ImageEnhance.Contrast(im).enhance(1.08)
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    return im


def fetch_paris():
    url = "https://commons.wikimedia.org/wiki/Special:FilePath/Toits%20de%20Paris%20soleil%20d%27hiver%2C%20novembre%202014.jpg"
    dest = "/tmp/paris-roofs.jpg"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        open(dest, "wb").write(urllib.request.urlopen(req, timeout=40).read())
        src = Image.open(dest).convert("RGB")
        src = src.resize((1920, 1080), Image.LANCZOS)
        arr = np.array(src).astype(np.float32)
        y = np.linspace(0, 1, arr.shape[0])[:, None, None]
        dusk = np.array([1.15, 0.72, 0.42]) * (0.45 + 0.7 * y)
        arr = np.clip(arr * dusk, 0, 255).astype(np.uint8)
        painted = paint_paris()
        return Image.blend(Image.fromarray(arr), painted, 0.28)
    except Exception:
        return paint_paris()


def wood():
    h, w = 512, 512
    yy, xx = np.mgrid[0:h, 0:w]
    grain = np.sin(xx / 13.5 + 2.2 * np.sin(yy / 42.0) + 0.4 * np.sin(yy / 9.0))
    n = np.random.default_rng(3).normal(0, 0.07, (h, w))
    v = 0.58 + 0.14 * grain + n
    plank = ((yy // 64) % 2) * 0.04
    v = np.clip(v - plank, 0.25, 0.9)
    r = (118 + 90 * v).astype(np.uint8)
    g = (78 + 70 * v).astype(np.uint8)
    b = (42 + 40 * v).astype(np.uint8)
    return Image.fromarray(np.dstack([r, g, b]), "RGB")


def rug():
    h, w = 256, 384
    im = Image.new("RGB", (w, h), (46, 92, 78))
    d = ImageDraw.Draw(im)
    d.rectangle([10, 10, w - 11, h - 11], outline=(214, 186, 120), width=8)
    d.rectangle([22, 22, w - 23, h - 23], outline=(232, 210, 150), width=3)
    for i in range(8):
        for j in range(5):
            if (i + j) % 2 == 0:
                d.rectangle([40 + i * 38, 40 + j * 34, 70 + i * 38, 66 + j * 34], fill=(62, 118, 96))
    return im


def otter():
    s = 4
    w, h = 220 * s, 170 * s
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    fur = (196, 132, 88, 255)
    fur_d = (140, 86, 54, 255)
    cream = (245, 220, 190, 255)
    d.ellipse([12 * s, 70 * s, 70 * s, 118 * s], fill=fur_d)
    d.ellipse([40 * s, 48 * s, 168 * s, 150 * s], fill=fur)
    d.ellipse([70 * s, 78 * s, 148 * s, 138 * s], fill=cream)
    d.ellipse([118 * s, 18 * s, 208 * s, 108 * s], fill=fur)
    d.ellipse([148 * s, 8 * s, 176 * s, 36 * s], fill=fur_d)
    d.ellipse([178 * s, 10 * s, 206 * s, 38 * s], fill=fur_d)
    d.ellipse([154 * s, 14 * s, 172 * s, 32 * s], fill=(232, 186, 150, 255))
    d.ellipse([184 * s, 16 * s, 202 * s, 34 * s], fill=(232, 186, 150, 255))
    d.ellipse([150 * s, 48 * s, 176 * s, 74 * s], fill=(255, 248, 236, 255))
    d.ellipse([178 * s, 50 * s, 204 * s, 76 * s], fill=(255, 248, 236, 255))
    d.ellipse([158 * s, 56 * s, 172 * s, 70 * s], fill=(28, 18, 14, 255))
    d.ellipse([186 * s, 58 * s, 200 * s, 72 * s], fill=(28, 18, 14, 255))
    d.ellipse([164 * s, 58 * s, 170 * s, 64 * s], fill=(255, 255, 255, 255))
    d.ellipse([192 * s, 60 * s, 198 * s, 66 * s], fill=(255, 255, 255, 255))
    d.ellipse([168 * s, 78 * s, 188 * s, 96 * s], fill=(36, 22, 16, 255))
    d.ellipse([164 * s, 92 * s, 192 * s, 108 * s], fill=cream)
    d.ellipse([174 * s, 98 * s, 184 * s, 104 * s], fill=(180, 80, 70, 255))
    d.ellipse([28 * s, 100 * s, 70 * s, 128 * s], fill=fur)
    d.ellipse([118 * s, 118 * s, 152 * s, 148 * s], fill=fur_d)
    d.ellipse([78 * s, 120 * s, 112 * s, 150 * s], fill=fur_d)
    d.ellipse([122 * s, 140 * s, 150 * s, 162 * s], fill=(90, 54, 36, 255))
    d.ellipse([82 * s, 142 * s, 110 * s, 164 * s], fill=(90, 54, 36, 255))
    im = im.resize((220, 170), Image.LANCZOS)
    return im


save(fetch_paris(), "paris-window.jpg")
save(wood(), "wood.jpg")
save(rug(), "rug.jpg")
save(otter(), "otter-cute.png")
print("ok")
