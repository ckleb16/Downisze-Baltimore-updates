from PIL import Image

source = "/home/ubuntu/upload/DSC_9165.jpg"
output = "/home/ubuntu/webdev-static-assets/grandfather-story-crop.jpg"

image = Image.open(source).convert("RGB")
# Keep both faces, shoulders, and the shared beach setting while removing the lower legs.
left, top, right, bottom = (245, 105, 1805, 950)
cropped = image.crop((left, top, right, bottom))
cropped.save(output, quality=92, optimize=True)
print(output)
