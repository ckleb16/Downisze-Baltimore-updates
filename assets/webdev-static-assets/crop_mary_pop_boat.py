from PIL import Image

src = "/home/ubuntu/upload/IMG_0126.PNG"
out = "/home/ubuntu/webdev-static-assets/mary-and-pop-boat-cropped.jpg"
image = Image.open(src).convert("RGB")
# The supplied screenshot contains a phone-gallery header and controls. Keep only the
# central documentary photograph; no enhancement, retouching, or face alteration.
cropped = image.crop((198, 510, 1006, 1049))
cropped.save(out, format="JPEG", quality=94, subsampling=0)
print(out)
print(cropped.size)
