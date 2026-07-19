#!/usr/bin/env python3
"""Generate the macOS app icon sets from the Vocast logo mark.

Draws the same five-bar waveform as packages/design-system/src/assets/logo-mark.svg
so the app icon and the web logo stay one mark. Produces two variants:

  release  brand orange bars, the icon users get
  beta     cyan bars, so a test build is unmistakable in the Dock next to a release

Run:  python3 apps/mac/make_icons.py
Writes Vocast/Vocast/Assets.xcassets/AppIcon.appiconset (release) and
AppIconBeta.appiconset (beta). Needs Pillow (system python3 has it).
"""
import json
import os

from PIL import Image, ImageDraw

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "Vocast", "Vocast", "Assets.xcassets")

# Palette lifted from Theme.swift so the icon matches the app.
CANVAS = (7, 8, 10)            # 0x07080A, window background
ORANGE = (245, 115, 43)        # 0xF5732B, brand accent
CYAN = (43, 182, 245)          # beta only, chosen to read as clearly not-orange

# The logo mark in its own 64x72 coordinate space (from logo-mark.svg).
MARK_W, MARK_H = 64, 72
BARS = [  # x, y, w, h  (rx is always w/2, fully rounded ends)
    (2, 30, 8, 12),
    (15, 21, 8, 30),
    (28, 11, 8, 50),
    (41, 21, 8, 30),
    (54, 30, 8, 12),
]

# macOS icon grid: the art sits inside the canvas with a margin, and the rounded
# square uses roughly a 22% corner radius. 824/1024 matches Apple's macOS template.
ART_RATIO = 824 / 1024
CORNER_RATIO = 185 / 824
MARK_RATIO = 0.52  # mark height as a fraction of the art square

# size, scale pairs Xcode expects for the "mac" idiom.
MAC_SIZES = [(16, 1), (16, 2), (32, 1), (32, 2), (128, 1), (128, 2),
             (256, 1), (256, 2), (512, 1), (512, 2)]


def render(px, bar_color, supersample=4):
    """Render one icon at px by px, drawn large then downsampled for clean edges."""
    s = px * supersample
    img = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    art = s * ART_RATIO
    off = (s - art) / 2
    d.rounded_rectangle([off, off, off + art, off + art],
                        radius=art * CORNER_RATIO, fill=CANVAS + (255,))

    # Fit the mark inside the art square, centred.
    mark_h = art * MARK_RATIO
    scale = mark_h / MARK_H
    mark_w = MARK_W * scale
    mx = off + (art - mark_w) / 2
    my = off + (art - mark_h) / 2
    for bx, by, bw, bh in BARS:
        x0, y0 = mx + bx * scale, my + by * scale
        x1, y1 = x0 + bw * scale, y0 + bh * scale
        d.rounded_rectangle([x0, y0, x1, y1], radius=(bw * scale) / 2,
                            fill=bar_color + (255,))

    return img.resize((px, px), Image.LANCZOS)


def write_set(name, bar_color):
    out = os.path.join(ASSETS, name)
    os.makedirs(out, exist_ok=True)
    images = []
    for size, scale in MAC_SIZES:
        px = size * scale
        fname = f"icon_{size}x{size}{'@2x' if scale == 2 else ''}.png"
        render(px, bar_color).save(os.path.join(out, fname))
        images.append({"size": f"{size}x{size}", "idiom": "mac",
                       "filename": fname, "scale": f"{scale}x"})
    with open(os.path.join(out, "Contents.json"), "w") as f:
        json.dump({"images": images,
                   "info": {"version": 1, "author": "xcode"}}, f, indent=2)
    print(f"wrote {out} ({len(images)} images)")


if __name__ == "__main__":
    write_set("AppIcon.appiconset", ORANGE)
    write_set("AppIconBeta.appiconset", CYAN)
