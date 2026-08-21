# Photos reelles + pixelisation en grille nette (nearest-neighbor).
import os
import urllib.request
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw

CACHE = "/workspace/scripts/cache"
OUT = "/workspace/public/assets"
W, H = 1920, 1080
PX = 4
UA = "SamuelDen/1.0 (github.com/SamuelOgulluk)"

LOCAL = {
    "laptop.jpg": "/tmp/den-src/laptop1.jpg",
    "paris.jpg": "/tmp/den-src/Toits_de_Paris_soleil_d'hiver,_novembre_.jpg",
    "window.jpg": "/tmp/den-src/window2.jpg",
    "piano.jpg": "/tmp/den-src/piano.jpg",
    "guitar.jpg": "/tmp/den-src/guitar.jpg",
    "diploma.jpg": "/tmp/den-src/diploma.jpg",
    "otter.jpg": "/tmp/den-src/otter.jpg",
}

URLS = {
    "laptop.jpg": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=2000&q=80",
    "paris.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Toits%20de%20Paris%20soleil%20d%27hiver%2C%20novembre%202014.jpg",
    "window.jpg": "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1800&q=80",
    "piano.jpg": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Erard_Upright_piano.jpg/1280px-Erard_Upright_piano.jpg",
    "guitar.jpg": "https://upload.wikimedia.org/wikipedia/commons/2/24/Guitar_1.jpg",
    "diploma.jpg": "https://commons.wikimedia.org/wiki/Special:FilePath/Diploma.jpg",
    "otter.jpg": "https://upload.wikimedia.org/wikipedia/commons/0/02/Sea_Otter_%28Enhydra_lutris%29_%2825169790524%29_crop.jpg",
}


def fetch(name):
    os.makedirs(CACHE, exist_ok=True)
    dest = os.path.join(CACHE, name)
    if os.path.exists(dest) and os.path.getsize(dest) > 20000:
        return dest
    src = LOCAL.get(name)
    if src and os.path.exists(src) and os.path.getsize(src) > 20000:
        Image.open(src).convert("RGB").save(dest, quality=92)
        return dest
    req = urllib.request.Request(URLS[name], headers={"User-Agent": UA})
    open(dest, "wb").write(urllib.request.urlopen(req, timeout=90).read())
    return dest


def load(name):
    return Image.open(fetch(name)).convert("RGBA")


def cover(im, w, h):
    s = max(w / im.size[0], h / im.size[1])
    im = im.resize((int(im.size[0] * s) + 2, int(im.size[1] * s) + 2), Image.LANCZOS)
    l = (im.size[0] - w) // 2
    t = (im.size[1] - h) // 2
    return im.crop((l, t, l + w, t + h))


def fit_h(im, h):
    s = h / im.size[1]
    return im.resize((max(1, int(im.size[0] * s)), h), Image.LANCZOS)


def fit_w(im, w):
    s = w / im.size[0]
    return im.resize((w, max(1, int(im.size[1] * s))), Image.LANCZOS)


def trim(im):
    a = np.array(im)
    m = a[:, :, 3] > 12
    ys, xs = np.where(m)
    if len(xs) == 0:
        return im
    return im.crop((int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1))


def key_white(im, t=226):
    a = np.array(im.convert("RGBA"))
    rgb = a[:, :, :3].astype(np.int16)
    white = (rgb.min(axis=2) > t) | ((rgb.max(axis=2) - rgb.min(axis=2) < 16) & (rgb.min(axis=2) > t - 14))
    a[:, :, 3] = np.where(white, 0, a[:, :, 3])
    return Image.fromarray(a)


def pixelate(im, n):
    rgb = im.convert("RGB")
    w, h = rgb.size
    small = rgb.resize((w // n, h // n), Image.BOX)
    small = ImageEnhance.Color(small).enhance(1.12)
    small = ImageEnhance.Contrast(small).enhance(1.06)
    small = ImageEnhance.Brightness(small).enhance(1.1)
    return small.resize((w, h), Image.NEAREST)


def dusk(im):
    a = np.array(im.convert("RGBA")).astype(np.float32)
    a[:, :, 0] = np.clip(a[:, :, 0] * 1.08 + 6, 0, 255)
    a[:, :, 1] = np.clip(a[:, :, 1] * 0.98, 0, 255)
    a[:, :, 2] = np.clip(a[:, :, 2] * 0.88, 0, 255)
    return Image.fromarray(a.astype(np.uint8))


# fond plein cadre : toits de Paris
paris_im = load("paris.jpg")
pw, ph = paris_im.size
paris_im = paris_im.crop((0, int(ph * 0.22), pw, ph))
paris = dusk(cover(paris_im, W, H))
canvas = paris.convert("RGBA")

# petit mur a gauche pour le diplome (extrait de la photo du bureau)
wall = load("laptop.jpg").crop((20, 20, 220, 400)).resize((220, 420), Image.LANCZOS)
canvas.alpha_composite(wall, (0, 0))

# bande de bureau (photo du bois)
wood = load("laptop.jpg").crop((200, 860, 1400, 1060))
wood = wood.resize((W, 250), Image.LANCZOS)
canvas.alpha_composite(wood, (0, H - 250))

# bureau + laptop (photo unique), sculptures dorees coupees
desk = load("laptop.jpg").crop((390, 160, 1320, 1067))
da = np.array(desk)
ref = da[6, 6, :3].astype(np.int16)
diff = np.abs(da[:, :, :3].astype(np.int16) - ref).sum(axis=2)
yy = np.arange(da.shape[0])[:, None]
lum = da[:, :, :3].astype(np.float32).mean(axis=2)
wall = (diff < 48) & (yy < da.shape[0] * 0.42) & (lum > 125)
da[:, :, 3] = np.where(wall, 0, 255)
desk = Image.fromarray(da)
desk = fit_w(desk, 760)
dx0 = (W - desk.size[0]) // 2
dy0 = H - desk.size[1] + 22
canvas.alpha_composite(desk, (dx0, dy0))

# diplome
dip = fit_w(load("diploma.jpg"), 110)
wood = load("piano.jpg").crop((90, 50, 260, 220)).resize((dip.size[0] + 18, dip.size[1] + 18), Image.LANCZOS)
fr = Image.new("RGBA", wood.size)
fr.paste(wood, (0, 0))
fr.alpha_composite(dip, (9, 9))
dx, dy = 22, 48
canvas.alpha_composite(fr, (dx, dy))

# piano recadre (sans le sol rouge)
piano = load("piano.jpg").crop((220, 30, 1080, 780))
piano = trim(key_white(piano, 210))
pn = np.array(piano)
lum = pn[:, :, :3].astype(np.float32).mean(axis=2)
pn[:, :, 3] = np.where(lum > 168, 0, pn[:, :, 3])
piano = trim(Image.fromarray(pn))
piano = fit_h(piano, 310)
px, py = 1520, 730
canvas.alpha_composite(piano, (px, py))

guitar = trim(key_white(load("guitar.jpg"), 222))
guitar = fit_h(guitar, 360)
gx, gy = 1768, 640
canvas.alpha_composite(guitar, (gx, gy))

# ecran sombre : crop laptop (390,160)-(1320,1067)
scale = desk.size[0] / 930
sx = dx0 + int((440 - 390) * scale)
sy = dy0 + int((210 - 160) * scale)
sw = int(720 * scale)
sh = int(470 * scale)
ca = np.array(canvas)
y0, y1 = max(sy + 16, 0), min(sy + sh - 24, H)
x0, x1 = max(sx + 16, 0), min(sx + sw - 16, W)
ca[y0:y1, x0:x1, :3] = (ca[y0:y1, x0:x1, :3].astype(np.float32) * 0.13).astype(np.uint8)
canvas = Image.fromarray(ca)

pix = pixelate(canvas, PX)

mask = Image.new("L", (W, H), 0)
ImageDraw.Draw(mask).rectangle((dx0 + 30, dy0 + 10, dx0 + desk.size[0] - 30, H - 8), fill=255)

corn = Image.new("RGBA", (W // PX, H // PX), (0, 0, 0, 0))
r = 15
cw, ch = corn.size
for ox, oy, sxi, syi in ((0, 0, 1, 1), (cw - 1, 0, -1, 1), (0, ch - 1, 1, -1), (cw - 1, ch - 1, -1, -1)):
    for i in range(r):
        for j in range(r):
            if (r - i) ** 2 + (r - j) ** 2 >= (r - 1) ** 2:
                corn.putpixel((ox + sxi * i, oy + syi * j), (12, 10, 16, 255))
corn = corn.resize((W, H), Image.NEAREST)

os.makedirs(OUT, exist_ok=True)
pix.save(os.path.join(OUT, "den.png"))
ov = pix.convert("RGBA")
oa = np.array(ov)
oa[:, :, 3] = np.array(mask)
Image.fromarray(oa).save(os.path.join(OUT, "den-laptop.png"))
corn.save(os.path.join(OUT, "den-corners.png"))

ot = cover(load("otter.jpg"), 340, 260)
on = np.array(ot)
lum = on[:, :, :3].astype(np.float32).mean(axis=2)
on[:, :, 3] = np.where(lum < 82, 0, 255)
ot = pixelate(Image.fromarray(on), 3).convert("RGBA")
on = np.array(ot)
on[:, :, 3] = np.where(on[:, :, :3].mean(axis=2) < 34, 0, on[:, :, 3])
Image.fromarray(on).save(os.path.join(OUT, "otter.png"))


def pct(v, tot):
    return round(100.0 * v / tot, 2)

print("WIN", 0, 0, 100, 62)
print("LAP", pct(dx0, W), pct(dy0, H), pct(desk.size[0], W), pct(desk.size[1], H))
print("SCR", pct(x0, W), pct(y0, H), pct(x1 - x0, W), pct(y1 - y0, H))
print("DEG", pct(dx, W), pct(dy, H), pct(fr.size[0], W), pct(fr.size[1], H))
print("PIANO", pct(px, W), pct(py, H), pct(piano.size[0], W), pct(piano.size[1], H))
print("GUITAR", pct(gx, W), pct(gy, H), pct(guitar.size[0], W), pct(guitar.size[1], H))
print("ok")
