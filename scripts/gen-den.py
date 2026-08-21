# Bureau zoomé de nuit, lampadaire à la fenêtre, lumière soignée.
import numpy as np
import zlib
import struct

W, H = 1920, 1080
rng = np.random.default_rng(11)
alb = np.zeros((H, W, 3), np.float32)
yy, xx = np.ogrid[0:H, 0:W]
Y = yy.astype(np.float32)
X = xx.astype(np.float32)


def rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)], np.float32)


def fill(x, y, w, h, c):
    x0, y0 = max(int(x), 0), max(int(y), 0)
    x1, y1 = min(int(x + w), W), min(int(y + h), H)
    if x1 > x0 and y1 > y0:
        alb[y0:y1, x0:x1] = c


def disc_aa(cx, cy, r, c):
    d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
    k = np.clip((r + 1.4) - d, 0, 1)
    alb[:] = alb * (1.0 - k[..., None]) + c * k[..., None]


def glow(cx, cy, r, c, a=1.0):
    d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
    k = np.clip(1.0 - d / r, 0, 1) ** 1.7 * a
    alb[:] = alb + (c - alb) * k[..., None]


def lerp(a, b, t):
    return a * (1 - t) + b * t


WALL = rgb("#262033")
CEIL = rgb("#16121f")
WOOD = rgb("#8a5638")
WOOD2 = rgb("#623c28")
WOOD3 = rgb("#b07850")
FLOOR = rgb("#2c1e16")
FLOOR2 = rgb("#22180f")
SKY = rgb("#12101f")
SKY2 = rgb("#1a1636")
MOON = rgb("#f4ead0")
PINE = rgb("#102822")
FRAME = rgb("#cbb08a")
AMBER = rgb("#ffb24d")
LAMP = rgb("#ffe1a8")
CRT = rgb("#171b19")
SCREEN = rgb("#16382c")
GREEN = rgb("#86d4a8")
PAPER = rgb("#f2ead8")
MAIL = rgb("#dcc8a4")
SYNTH = rgb("#23212c")
KEY = rgb("#f2ead8")
KEY2 = rgb("#3a3248")
METAL = rgb("#9696a0")
TOOL = rgb("#3c3c44")
PCB = rgb("#1f5a3a")
COPPER = rgb("#cc804c")
MUG = rgb("#b44838")
PLANT = rgb("#2c6e58")
POT = rgb("#7a4030")
CHAIR = rgb("#3c2c24")
INK = rgb("#1c1612")
CREAM = rgb("#f2ead8")
BOOKS = [rgb("#c45c4a"), rgb("#4a6aa8"), rgb("#d4a04a"), rgb("#3a7a5a"), rgb("#7a4a8a"), rgb("#8a3a3a"), rgb("#2f5f8a")]

# mur
for y in range(0, 820):
    t = y / 820
    alb[y, :] = lerp(CEIL, WALL, t * 0.9)

# parquet
fill(0, 800, W, 280, FLOOR)
for y in range(800, H, 8):
    fill(0, y, W, 1, FLOOR2)
for x in range(0, W, 48):
    fill(x, 800, 2, 280, FLOOR2)
fill(380, 880, 1100, 160, rgb("#3a2422"))
fill(400, 896, 1060, 128, rgb("#4e2e2c"))

# ---- fenetre + nuit + lampadaire ----
fill(0, 0, 430, 560, FRAME)
for y in range(18, 542):
    t = (y - 18) / 524
    alb[y, 18:412] = lerp(SKY, SKY2, t)
disc_aa(118, 110, 52, MOON)
disc_aa(138, 96, 11, rgb("#e6d6ae"))
disc_aa(104, 128, 8, rgb("#ead9b6"))
for x, y in [(40, 70), (70, 180), (160, 48), (200, 150), (48, 250), (250, 70), (360, 90), (330, 190), (90, 320), (220, 230), (380, 140)]:
    disc_aa(x, y, 1.4, CREAM)
fill(18, 430, 394, 112, rgb("#16141c"))
fill(18, 470, 394, 72, rgb("#121018"))

def pine(bx, by, hh):
    for n in range(hh):
        ww = 4 + n // 8
        fill(bx - ww, by - hh + n, ww * 2, 1, PINE)
    fill(bx - 5, by, 10, 22, rgb("#1a1410"))

pine(70, 448, 130)
pine(140, 452, 100)
pine(370, 446, 140)
pine(310, 450, 80)

# lampadaire
fill(248, 160, 9, 300, rgb("#2c2620"))
fill(232, 154, 78, 9, rgb("#2c2620"))
fill(300, 154, 9, 36, rgb("#2c2620"))
glow(304, 210, 120, AMBER, 0.7)
disc_aa(304, 210, 26, AMBER)
disc_aa(304, 210, 12, LAMP)
glow(304, 470, 150, AMBER, 0.42)

# croisillons
fill(18, 18, 394, 10, FRAME)
fill(18, 268, 394, 8, FRAME)
fill(18, 532, 394, 10, FRAME)
fill(18, 18, 10, 524, FRAME)
fill(206, 18, 10, 524, FRAME)
fill(402, 18, 10, 524, FRAME)
fill(0, 548, 430, 32, WOOD3)
fill(0, 580, 430, 16, WOOD2)

# plante
fill(48, 512, 44, 48, POT)
fill(60, 430, 12, 84, PLANT)
fill(42, 468, 52, 16, rgb("#3d8f6a"))
fill(72, 414, 16, 36, PLANT)

# bibliotheque
fill(448, 90, 200, 470, WOOD2)
fill(458, 100, 180, 450, WOOD)
for i, sy in enumerate(range(180, 540, 68)):
    fill(458, sy, 180, 8, WOOD2)
    x = 468
    for k in range(14):
        bw = 7 + (k * 5 + i) % 8
        bh = 40 + (k * 7) % 20
        if x + bw < 628:
            fill(x, sy - bh, bw, bh, BOOKS[(i * 3 + k) % len(BOOKS)])
            x += bw + 2

# ---- bureau (gros plan) ----
fill(80, 560, 1760, 42, WOOD3)
fill(100, 602, 1720, 230, WOOD)
fill(100, 602, 34, 230, WOOD2)
fill(1786, 602, 34, 230, WOOD2)
fill(80, 560, 1760, 7, rgb("#c4885c"))
fill(120, 824, 1680, 22, rgb("#140e0a"))

# ecran
fill(620, 130, 620, 430, CRT)
fill(638, 148, 584, 390, SCREEN)
fill(658, 176, 120, 48, GREEN)
fill(658, 244, 360, 18, rgb("#4aa078"))
fill(658, 280, 250, 14, GREEN)
fill(658, 312, 400, 14, rgb("#3d8f6a"))
fill(658, 344, 190, 14, GREEN)
fill(658, 376, 320, 14, rgb("#4aa078"))
fill(658, 430, 280, 50, rgb("#12261e"))
fill(860, 556, 140, 12, CRT)
fill(820, 568, 220, 18, METAL)

# lampe
fill(1288, 300, 12, 260, METAL)
disc_aa(1294, 278, 40, LAMP)
disc_aa(1294, 278, 16, rgb("#fff6d4"))
fill(1236, 548, 130, 18, rgb("#e8a872"))

# courrier
fill(140, 528, 110, 36, PAPER)
fill(160, 518, 96, 36, MAIL)
fill(210, 532, 10, 10, rgb("#c45c4a"))

# mug
fill(1220, 524, 42, 38, MUG)
fill(1262, 532, 12, 22, MUG)
fill(1232, 516, 10, 10, PAPER)

# synthé
fill(1390, 500, 340, 84, SYNTH)
fill(1404, 518, 312, 50, rgb("#141218"))
for i in range(34):
    fill(1412 + i * 9, 530, 7, 28, KEY if i % 4 else KEY2)
fill(1414, 508, 26, 14, GREEN)
fill(1448, 508, 16, 14, AMBER)

# chaise
fill(760, 650, 200, 32, rgb("#5a3e30"))
fill(810, 580, 110, 80, CHAIR)
fill(780, 678, 32, 130, rgb("#5a3e30"))
fill(900, 678, 32, 130, rgb("#5a3e30"))
fill(768, 800, 56, 16, CHAIR)
fill(888, 800, 56, 16, CHAIR)

# posters
fill(1688, 40, 220, 250, WOOD2)
fill(1698, 50, 200, 230, rgb("#d8c8b0"))
fill(1710, 66, 80, 72, rgb("#1a3a5a"))
fill(1800, 66, 72, 72, rgb("#5a1a1a"))
fill(1710, 152, 96, 100, PAPER)
fill(1814, 152, 70, 100, rgb("#1a3a5a"))
for px, py in [(1714, 62), (1868, 62), (1714, 148), (1878, 148)]:
    fill(px, py, 6, 6, rgb("#c45c4a"))

# etabli
fill(1608, 560, 312, 220, WOOD2)
fill(1620, 572, 288, 26, METAL)
fill(1632, 612, 150, 88, PCB)
for i in range(11):
    fill(1644 + i * 12, 628, 6, 6, COPPER)
    fill(1650 + i * 12, 652, 6, 6, GREEN)
fill(1800, 612, 72, 24, TOOL)
fill(1824, 588, 14, 44, METAL)
fill(1868, 636, 36, 36, TOOL)

# caisse
fill(1640, 720, 100, 58, TOOL)
fill(1654, 708, 72, 18, METAL)
fill(1674, 736, 12, 12, AMBER)
fill(1696, 744, 12, 12, COPPER)

# cartouche
fill(90, 740, 52, 36, rgb("#4a6aa8"))
fill(98, 748, 36, 20, rgb("#c45c4a"))
fill(104, 754, 8, 8, rgb("#d4a04a"))
fill(118, 754, 8, 8, GREEN)

# SAMUEL
fill(780, 48, 300, 64, WOOD2)
fill(788, 56, 284, 48, PAPER)
FONT = {
    "S": ["###", "#  ", "###", "  #", "###"],
    "A": [" # ", "# #", "###", "# #", "# #"],
    "M": ["# #", "###", "# #", "# #", "# #"],
    "U": ["# #", "# #", "# #", "# #", "###"],
    "E": ["###", "#  ", "## ", "#  ", "###"],
    "L": ["#  ", "#  ", "#  ", "#  ", "###"],
}
ox = 832
for ch in "SAMUEL":
    for j, row in enumerate(FONT[ch]):
        for i, bit in enumerate(row):
            if bit == "#":
                fill(ox + i * 5, 66 + j * 5, 5, 5, INK)
    ox += 22

# cadre
fill(500, 36, 90, 78, FRAME)
fill(510, 46, 70, 58, WALL)
disc_aa(545, 74, 14, LAMP)

grain = (rng.random((H, W, 1)) - 0.5) * 5
alb[:] = np.clip(alb + grain, 0, 255)

# lumieres
illum = np.full((H, W, 3), 0.11, np.float32)

def add_light(cx, cy, color, radius, strength, fall=1.55):
    d = np.sqrt((X - cx) ** 2 + (Y - cy) ** 2)
    att = np.clip(1.0 - d / radius, 0, 1) ** fall * strength
    illum[:] += (color / 255.0) * att[..., None]

add_light(304, 210, rgb("#ffc56a"), 560, 1.7, 1.28)
add_light(118, 110, rgb("#d4def0"), 460, 0.5, 1.1)
add_light(400, 300, rgb("#ffb45a"), 420, 0.45, 1.45)
add_light(1294, 278, rgb("#ffe6b8"), 640, 1.85, 1.38)
add_light(1180, 580, rgb("#ffd19a"), 360, 0.7, 1.9)
add_light(930, 340, rgb("#7dcea0"), 300, 0.5, 1.65)
vign = 1 - 0.28 * (((X - W * 0.58) / (W * 0.92)) ** 2 + ((Y - H * 0.46) / (H * 0.95)) ** 2)
out = np.clip(alb * illum * np.clip(vign, 0.5, 1)[..., None], 0, 255).astype(np.uint8)

raw = np.zeros((H, 1 + W * 3), np.uint8)
raw[:, 1:] = out.reshape(H, -1)

def chunk(tag, data):
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

png = (
    b"\x89PNG\r\n\x1a\n"
    + chunk(b"IHDR", struct.pack(">IIBBBBB", W, H, 8, 2, 0, 0, 0))
    + chunk(b"IDAT", zlib.compress(raw.tobytes(), 6))
    + chunk(b"IEND", b"")
)
open("/workspace/public/assets/den.png", "wb").write(png)
print("png", len(png))
