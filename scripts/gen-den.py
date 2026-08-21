# Génère la tanière pixel (160x90) en SVG
W, H = 160, 90
C = {
    "sky": "#161326",
    "sky2": "#1e1a36",
    "sky3": "#2a2448",
    "star": "#efe6d0",
    "moon": "#f4e8c1",
    "moon2": "#d9c89a",
    "hill": "#24283a",
    "hill2": "#1c2030",
    "pine": "#1a3a30",
    "pine2": "#245445",
    "pine3": "#2f6a56",
    "grass": "#2a4638",
    "grass2": "#355c48",
    "wood": "#5a3324",
    "wood2": "#7a4a32",
    "wood3": "#9a6444",
    "roof": "#3a2422",
    "roof2": "#4a302c",
    "window": "#e8a872",
    "window2": "#f4d09a",
    "glow": "#c47848",
    "water": "#1e3a52",
    "water2": "#2a5470",
    "water3": "#3a6a88",
    "foam": "#8eb8c8",
    "dock": "#4a3024",
    "dock2": "#6a4430",
    "otter": "#6a4030",
    "otter2": "#8a5840",
    "belly": "#d4b08a",
    "eye": "#1a1210",
    "cream": "#f3ead8",
    "crt": "#1a2018",
    "screen": "#3d8f6a",
    "screen2": "#7dcea0",
    "book1": "#c45c4a",
    "book2": "#4a6aa8",
    "book3": "#d4a04a",
    "synth": "#2a2838",
    "key": "#efe6d0",
    "key2": "#3a3048",
    "mail": "#c9b48a",
    "tool": "#4a4a52",
    "metal": "#8a8a92",
    "accent": "#7dcea0",
    "lamp": "#f0c070",
}

grid = [[None] * W for _ in range(H)]


def pset(x, y, c):
    if 0 <= x < W and 0 <= y < H:
        grid[y][x] = c


def rect(x, y, w, h, c):
    for j in range(h):
        for i in range(w):
            pset(x + i, y + j, c)


def ellipse(cx, cy, rx, ry, c):
    for y in range(cy - ry, cy + ry + 1):
        for x in range(cx - rx, cx + rx + 1):
            if ((x - cx) / max(rx, 0.01)) ** 2 + ((y - cy) / max(ry, 0.01)) ** 2 <= 1.05:
                pset(x, y, c)


# ciel
for y in range(62):
    t = y / 62
    if t < 0.4:
        c = "sky"
    elif t < 0.75:
        c = "sky2"
    else:
        c = "sky3"
    rect(0, y, W, 1, c)

stars = [
    (8, 6), (18, 12), (28, 4), (42, 9), (55, 5), (70, 11), (88, 7),
    (102, 13), (118, 4), (132, 10), (148, 6), (22, 20), (48, 18),
    (76, 16), (96, 21), (140, 18), (12, 28), (64, 8), (154, 22),
    (35, 14), (110, 19), (125, 8),
]
for x, y in stars:
    pset(x, y, "star")
    if (x + y) % 3 == 0:
        pset(x + 1, y, "star")

# lune
ellipse(138, 16, 8, 8, "moon")
ellipse(141, 14, 3, 3, "moon2")
pset(134, 14, "moon2")
pset(136, 19, "moon2")

# collines
for x in range(W):
    h1 = int(48 + 6 * __import__("math").sin(x * 0.07) + 3 * __import__("math").sin(x * 0.19))
    for y in range(h1, 68):
        pset(x, y, "hill2" if y > h1 + 4 else "hill")

# pins à gauche
def pine(base_x, base_y, h):
    w = 1
    for y in range(h):
        yy = base_y - h + y
        ww = 1 + y // 3
        rect(base_x - ww, yy, ww * 2 + 1, 1, "pine3" if y % 4 == 0 else ("pine2" if y % 2 == 0 else "pine"))
    rect(base_x - 1, base_y, 3, 4, "wood")

pine(10, 64, 28)
pine(22, 66, 22)
pine(148, 64, 26)
pine(158, 67, 18)

# herbe / berge
rect(0, 62, W, 12, "grass")
for x in range(0, W, 3):
    pset(x, 62, "grass2")
    pset(x + 1, 63, "grass2")

# cabane / atelier
rect(36, 38, 58, 30, "wood")
rect(36, 38, 58, 3, "wood3")
# toit
for i in range(14):
    rect(32 + i, 26 + i, 66 - i * 2, 1, "roof" if i % 2 == 0 else "roof2")
rect(34, 38, 62, 2, "roof")
# porte
rect(42, 50, 10, 18, "wood2")
rect(50, 58, 1, 2, "lamp")
# fenêtre chaude
rect(60, 46, 16, 12, "glow")
rect(62, 48, 12, 8, "window")
rect(66, 50, 4, 4, "window2")
rect(60, 51, 16, 1, "wood")
rect(67, 46, 1, 12, "wood")
# cheminée
rect(80, 22, 8, 16, "roof2")
rect(78, 20, 12, 3, "roof")
for i in range(4):
    pset(82 + (i % 2), 16 - i * 2, "cream")
    pset(84, 15 - i * 2, "star")

# intérieur visible : bureau sous la fenêtre
rect(58, 58, 32, 10, "wood2")
# CRT
rect(62, 50, 14, 10, "crt")
rect(64, 52, 10, 6, "screen")
pset(66, 54, "screen2")
pset(68, 55, "screen2")
pset(70, 54, "accent")
rect(66, 60, 6, 2, "crt")
# livres
rect(78, 54, 3, 8, "book1")
rect(81, 52, 3, 10, "book2")
rect(84, 55, 3, 7, "book3")
# lampe de bureau
rect(88, 48, 2, 8, "metal")
ellipse(89, 46, 4, 3, "lamp")
pset(89, 46, "window2")
# crate + synthé dehors
rect(96, 62, 18, 8, "dock2")
rect(97, 58, 16, 6, "synth")
for i in range(7):
    pset(99 + i * 2, 60, "key" if i % 3 else "key2")
rect(99, 58, 2, 2, "accent")
# caisse à outils
rect(116, 60, 12, 10, "tool")
rect(118, 58, 8, 3, "metal")
pset(120, 63, "lamp")
pset(122, 65, "metal")
pset(124, 63, "accent")
# fiole / labo à gauche
rect(16, 56, 4, 8, "accent")
rect(17, 54, 2, 3, "screen2")
pset(17, 58, "window")

# ponton
rect(18, 70, 42, 4, "dock")
rect(18, 74, 4, 8, "dock2")
rect(54, 74, 4, 8, "dock2")
rect(20, 69, 38, 1, "dock2")

# eau
rect(0, 74, W, 16, "water")
for y in range(74, 90):
    c = "water" if y < 80 else ("water2" if y < 85 else "water3")
    rect(0, y, W, 1, c)
# reflets
for x in range(0, W, 7):
    rect(x + (x // 7) % 3, 76, 4, 1, "water3")
    rect(x + 3, 82, 5, 1, "foam")
# reflet lune
rect(132, 76, 10, 1, "moon2")
rect(134, 80, 6, 1, "moon")
rect(133, 84, 8, 1, "moon2")
# reflet fenêtre
rect(62, 76, 12, 1, "window")
rect(64, 79, 8, 1, "glow")

# rocher (la loutre y vit, mais elle est animée à part)
rect(128, 70, 16, 8, "hill")
rect(130, 68, 12, 4, "hill2")

# boîte aux lettres
rect(28, 56, 6, 8, "mail")
rect(29, 54, 4, 3, "book1")
rect(30, 50, 2, 4, "metal")
pset(31, 58, "eye")

# étoiles filantes minuscules
pset(50, 10, "star")
pset(51, 11, "star")
pset(52, 12, "cream")

# fusion horizontale
rects = []
for y in range(H):
    x = 0
    while x < W:
        c = grid[y][x]
        if not c:
            x += 1
            continue
        x0 = x
        while x < W and grid[y][x] == c:
            x += 1
        rects.append((x0, y, x - x0, 1, c))

parts = []
for x, y, w, h, c in rects:
    parts.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{C[c]}"/>')

svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}" shape-rendering="crispEdges">
{"".join(parts)}
</svg>
'''
open("/workspace/public/assets/den.svg", "w").write(svg)
print("rects", len(rects))
