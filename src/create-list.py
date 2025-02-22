import os
import json
from PIL import Image

# Determine orientation based on image size
def get_image_orientation(image_path):
    with Image.open(image_path) as img:
        width, height = img.size
        print(f"Image size: {width}x{height}")
        if width > height:
            return "landscape"
        else:
            return "portrait"

# Path to the image folder
image_folder_path = "public/img"

# Get the list of image files in the folder and subfolders
image_files = []
subfolders = set()
for root, dirs, files in os.walk(image_folder_path):
    for file in files:
        if os.path.isfile(os.path.join(root, file)):
            image_files.append(os.path.join(root, file))
    for dir in dirs:
        subfolders.add(os.path.relpath(os.path.join(root, dir), image_folder_path))

# Ensure that we have photo entries to process
if len(image_files) == 0:
    print("No photo entries found in the image folder.")
else:
    photos = []
    # Loop through each image file and determine its orientation
    for image_path in image_files:
        try:
            orientation = get_image_orientation(image_path)
            folder = os.path.relpath(os.path.dirname(image_path), image_folder_path)
            photo = {
                "url": os.path.basename(image_path),
                "orientation": orientation,
                "folder": folder
            }
            photos.append(photo)
            print(f"Processed {image_path} as {orientation} in folder {folder}.")
        except Exception as e:
            print(f"Error processing {image_path}: {e}")

    # Save the photo data to the JSON file
    json_file_path = "src/photos.json"
    with open(json_file_path, "w") as file:
        json.dump(photos, file, indent=4)

    print("Photo orientations updated successfully.")
