from PIL import Image

photos = {
    "/home/ubuntu/upload/IMG_0469.PNG": ("/home/ubuntu/webdev-static-assets/mary-chesapeake-frenchies.jpg", (0, 507, 1206, 2110)),
    "/home/ubuntu/upload/IMG_0474.PNG": ("/home/ubuntu/webdev-static-assets/mary-family-travel.jpg", (0, 511, 1206, 1765)),
    "/home/ubuntu/upload/IMG_0470.PNG": ("/home/ubuntu/webdev-static-assets/mary-orioles-family.jpg", (0, 508, 1206, 2110)),
}
for src, (out, box) in photos.items():
    image = Image.open(src).convert("RGB")
    cropped = image.crop(box)
    cropped.save(out, format="JPEG", quality=94, subsampling=0)
    print(out, cropped.size)
