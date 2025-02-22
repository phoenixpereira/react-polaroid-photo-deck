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

# Get the list of image files in the folder
image_files = [f for f in os.listdir(image_folder_path) if os.path.isfile(os.path.join(image_folder_path, f))]

# Ensure that we have photo entries to process
if len(image_files) == 0:
    print("No photo entries found in the image folder.")
else:
    photos = []
    # Loop through each image file and determine its orientation
    for image_file in image_files:
        image_path = os.path.join(image_folder_path, image_file)

        try:
            orientation = get_image_orientation(image_path)
            photo = {"url": image_file, "orientation": orientation}
            photos.append(photo)
            print(f"Processed {image_file} as {orientation}.")
        except Exception as e:
            print(f"Error processing {image_file}: {e}")

    # Save the photo data to the JSON file
    json_file_path = "src/photos.json"
    with open(json_file_path, "w") as file:
        json.dump(photos, file, indent=4)

    print("Photo orientations updated successfully.")
