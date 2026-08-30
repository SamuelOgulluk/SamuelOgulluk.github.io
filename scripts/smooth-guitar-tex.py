import io
import json
import os
import struct
from PIL import Image, ImageFilter, ImageDraw
import numpy as np

GLB = "/workspace/public/models/guitar-round.glb"
OUT0 = "/workspace/public/assets/sprites/guitar-body.png"
OUT3 = "/workspace/public/assets/sprites/guitar-details.png"


def glb_images():
    with open(GLB, "rb") as f:
        f.read(12)
        chunk_len, _ = struct.unpack("<I4s", f.read(8))
        gltf = json.loads(f.read(chunk_len))
        chunk_len, _ = struct.unpack("<I4s", f.read(8))
        blob = f.read(chunk_len)
    out = []
    for im in gltf.get("images", []):
        bv = gltf["bufferViews"][im["bufferView"]]
        data = blob[bv.get("byteOffset", 0) : bv.get("byteOffset", 0) + bv["byteLength"]]
        out.append(Image.open(io.BytesIO(data)).convert("RGB"))
    return out


def paint_body(im):
    hi = im.resize((2048, 2048), Image.LANCZOS)
    arr = np.array(hi).astype(np.float32)
    r, g, b = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2]
    wood = (r > 70) & (g > 40) & (b < 180) & (r + g > 2.2 * b)
    yy, xx = np.indices((2048, 2048))
    cx, cy = 1024.0, 900.0
    d = np.sqrt(((xx - cx) / 980.0) ** 2 + ((yy - cy) / 820.0) ** 2)
    d = np.clip(d, 0, 1.35)
    honey = np.array([232, 196, 98], np.float32)
    amber = np.array([176, 92, 36], np.float32)
    cherry = np.array([92, 36, 22], np.float32)
    t = np.clip(d, 0, 1)[..., None]
    t2 = np.clip(d - 0.55, 0, 1)[..., None] / 0.8
    col = honey * (1 - t) + amber * t
    col = col * (1 - t2) + cherry * t2
    out = arr.copy()
    m = wood.astype(np.float32)[..., None]
    out = out * (1 - m) + col * m
    painted = Image.fromarray(out.astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.4))
    return painted


def paint_details(im):
    hi = im.resize((2048, 2048), Image.LANCZOS)
    arr = np.array(hi)
    g = 0.299 * arr[:, :, 0] + 0.587 * arr[:, :, 1] + 0.114 * arr[:, :, 2]
    sat = arr.max(axis=2).astype(np.int16) - arr.min(axis=2).astype(np.int16)
    keep = (g < 38) | ((sat > 68) & (arr[:, :, 0] > 135))
    soft = Image.fromarray(arr).filter(ImageFilter.GaussianBlur(6.0))
    out = np.array(soft)
    out[keep] = arr[keep]
    return Image.fromarray(out)


def main():
    imgs = glb_images()
    os.makedirs(os.path.dirname(OUT0), exist_ok=True)
    paint_body(imgs[0]).save(OUT0, optimize=True)
    paint_details(imgs[3]).save(OUT3, optimize=True)
    print("ok", OUT0, OUT3)


if __name__ == "__main__":
    main()
