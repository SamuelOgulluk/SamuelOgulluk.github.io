import json
import os
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
RAW = os.path.join(ROOT, "public/assets/den/den-color-raw.png")
DEPTH = os.path.join(ROOT, "public/assets/den/den-depth-raw.png")
SPOTS = os.path.join(ROOT, "public/assets/den/den-spots.json")
OUT_DIR = os.path.join(ROOT, "public/assets/den")


def main():
    # keep the bake smooth; only the guitar model is already illustrated
    rgb = Image.open(RAW).convert("RGB")
    dim = Image.open(DEPTH).convert("L")
    os.makedirs(OUT_DIR, exist_ok=True)
    rgb.save(os.path.join(OUT_DIR, "den-color.png"))
    rgb.save(os.path.join(OUT_DIR, "den-color.webp"), "WEBP", quality=92, method=4)
    dim.save(os.path.join(OUT_DIR, "den-depth.png"))
    dim.save(os.path.join(OUT_DIR, "den-depth.webp"), "WEBP", quality=88, method=4)
    if os.path.exists(SPOTS):
        data = json.load(open(SPOTS))
        print("spots", data.get("spots"))
    print("ok", rgb.size, "no outlines")


if __name__ == "__main__":
    main()
