"""Generate web-sized media and brand identity assets from approved source files."""

from __future__ import annotations

import base64
import io
import json
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "client" / "public"
MEDIA = PUBLIC / "manus-storage"

PHOTO_SOURCES = [
    "AugustwebsiteHOMEphoto_6750abaf.png",
    "aging-in-place-consultation_1b627f71.jpg",
    "aging-in-place-hero_627154ed.jpg",
    "downsizing-hero_718d6bc8.jpeg",
    "downsizing-room_d33a128b.jpeg",
    "mary-and-pop-boat.png",
    "mary-chesapeake-frenchies_ed69a28d.jpg",
    "mary-family-travel_7af40885.jpg",
    "mary-lynch-buying-selling-hero_41a29217.jpg",
    "mary-lynch-contact-chair_dd829984.jpg",
    "mary-lynch-downsizing_b73a2d4f.jpg",
    "mary-lynch-meet-mary-hero_8902efd8.jpg",
    "mary-lynch-resource-center_4f151291.jpg",
    "mary-orioles-family_627afe9d.jpg",
    "Mary_Lynch_3d838598.jpg",
    "pop-and-baby-mary-boat_ef16c849.jpg",
    "pop-driving-the-boat-thumbnail_d6758521.jpg",
]

TEXTURE_SOURCES = [
    "downsize-baltimore-contour-lines_aaa317b7.png",
    "downsize-baltimore-paper-texture_268a29f4.png",
    "downsize-baltimore-warm-wash_0631c386.png",
]

MARK_SOURCES = ["downsize-baltimore-mark_c3769b0a.png"]


def font(name: str, size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidate = Path("C:/Windows/Fonts") / name
    if candidate.exists():
        return ImageFont.truetype(str(candidate), size=size)
    return ImageFont.load_default()


def webp_variants(
    source_name: str,
    widths: tuple[int, ...],
    quality: int,
    manifest: dict[str, dict[str, object]],
) -> None:
    source = MEDIA / source_name
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert(
            "RGBA" if opened.mode in {"RGBA", "LA"} else "RGB"
        )
        source_width, source_height = image.size
        generated_widths = sorted({min(width, source_width) for width in widths})
        variants: list[dict[str, object]] = []
        for width in generated_widths:
            height = round(source_height * width / source_width)
            resized = (
                image
                if width == source_width
                else image.resize((width, height), Image.Resampling.LANCZOS)
            )
            output_name = f"{source.stem}-{width}w.webp"
            output = MEDIA / output_name
            resized.save(
                output,
                "WEBP",
                quality=quality,
                method=6,
                exact=True,
            )
            variants.append(
                {
                    "src": f"/manus-storage/{output_name}",
                    "width": width,
                    "height": height,
                    "bytes": output.stat().st_size,
                }
            )
        manifest[f"/manus-storage/{source_name}"] = {
            "sourceWidth": source_width,
            "sourceHeight": source_height,
            "variants": variants,
        }


def brand_icon(size: int, maskable: bool = False) -> Image.Image:
    navy = (16, 42, 67, 255)
    canvas = Image.new("RGBA", (size, size), navy)
    logo_path = MEDIA / "DownsizeBaltimoreB-YelWhite_850df9b1.png"
    with Image.open(logo_path) as source:
        logo = source.convert("RGBA")
        # The approved roof/house symbol occupies the top portion of the vertical mark.
        symbol = logo.crop((145, 0, 605, 318))
        alpha_bbox = symbol.getchannel("A").getbbox()
        if alpha_bbox:
            symbol = symbol.crop(alpha_bbox)
        padding = round(size * (0.22 if maskable else 0.13))
        fitted = ImageOps.contain(
            symbol,
            (size - 2 * padding, size - 2 * padding),
            Image.Resampling.LANCZOS,
        )
        x = (size - fitted.width) // 2
        y = (size - fitted.height) // 2
        canvas.alpha_composite(fitted, (x, y))
    return canvas


def generate_identity_assets() -> None:
    for size, filename in [
        (32, "favicon-32x32.png"),
        (180, "apple-touch-icon.png"),
        (192, "icon-192.png"),
        (512, "icon-512.png"),
    ]:
        brand_icon(size).convert("RGB").save(PUBLIC / filename, "PNG", optimize=True)

    brand_icon(512, maskable=True).convert("RGB").save(
        PUBLIC / "icon-maskable-512.png", "PNG", optimize=True
    )
    brand_icon(256).save(
        PUBLIC / "favicon.ico", "ICO", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)]
    )

    buffer = io.BytesIO()
    brand_icon(192).save(buffer, "PNG", optimize=True)
    encoded = base64.b64encode(buffer.getvalue()).decode("ascii")
    (PUBLIC / "favicon.svg").write_text(
        "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 192 192\">"
        f"<image width=\"192\" height=\"192\" href=\"data:image/png;base64,{encoded}\"/>"
        "</svg>\n",
        encoding="utf-8",
    )


def generate_social_card() -> None:
    with Image.open(MEDIA / "AugustwebsiteHOMEphoto_6750abaf.png") as source:
        background = ImageOps.fit(
            source.convert("RGB"),
            (1200, 630),
            method=Image.Resampling.LANCZOS,
            centering=(0.56, 0.5),
        ).convert("RGBA")

    overlay = Image.new("RGBA", background.size, (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    for x in range(900):
        opacity = max(0, round(238 * (1 - x / 900)))
        overlay_draw.line((x, 0, x, 630), fill=(16, 42, 67, opacity))
    overlay_draw.rectangle((0, 0, 470, 630), fill=(16, 42, 67, 222))
    card = Image.alpha_composite(background, overlay)

    with Image.open(MEDIA / "DownsizeBaltimoreWide-YelWhite_e501a303.png") as source:
        logo = ImageOps.contain(source.convert("RGBA"), (430, 145), Image.Resampling.LANCZOS)
    card.alpha_composite(logo, (58, 62))

    draw = ImageDraw.Draw(card)
    heading_font = font("georgia.ttf", 58)
    detail_font = font("arial.ttf", 24)
    gold = (229, 201, 135, 255)
    cream = (247, 243, 234, 255)
    draw.multiline_text(
        (64, 252),
        "A Clear Plan for\nWhat Comes Next.",
        font=heading_font,
        fill=cream,
        spacing=5,
    )
    draw.line((64, 430, 350, 430), fill=gold, width=3)
    draw.text(
        (64, 458),
        "DOWNSIZING  •  AGING IN PLACE  •  REAL ESTATE",
        font=detail_font,
        fill=gold,
    )
    card.convert("RGB").save(
        PUBLIC / "downsize-baltimore-social-share.jpg",
        "JPEG",
        quality=86,
        optimize=True,
        progressive=True,
    )


def main() -> None:
    MEDIA.mkdir(parents=True, exist_ok=True)
    manifest: dict[str, dict[str, object]] = {}
    for source in PHOTO_SOURCES:
        webp_variants(source, (480, 768, 1200, 1600), 82, manifest)
    for source in TEXTURE_SOURCES:
        webp_variants(source, (960, 1600, 1920), 64, manifest)
    for source in MARK_SOURCES:
        webp_variants(source, (320, 640, 960), 82, manifest)

    generate_identity_assets()
    generate_social_card()
    (MEDIA / "responsive-media-manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Generated {sum(len(item['variants']) for item in manifest.values())} variants")


if __name__ == "__main__":
    main()
