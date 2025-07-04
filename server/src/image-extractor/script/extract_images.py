import cv2
import numpy as np
import json
import os

SOURCE_DIR = "/app/source"
OUTPUT_DIR = "/app/output"

def extract_images():
    source_path = os.path.join(SOURCE_DIR, "source_image.png")
    img = cv2.imread(source_path)
    if img is None:
        print(f"Failed to load image: {source_path}")
        return

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    _, thresh = cv2.threshold(gray, 250, 255, cv2.THRESH_BINARY_INV)

    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for i, contour in enumerate(contours):
        x, y, w, h = cv2.boundingRect(contour)

        small_img = img[y:y+h, x:x+w]

        img_filename = f"image_{i+1}.png"
        cv2.imwrite(os.path.join(OUTPUT_DIR, img_filename), small_img)

        json_data = {
            "position": {
                "left": x,
                "top": y,
                "width": w,
                "height": h
            },
            "css": {
                "position": "absolute",
                "left": f"{x}px",
                "top": f"{y}px",
                "width": f"{w}px",
                "height": f"{h}px"
            }
        }
        json_filename = f"image_{i+1}.json"
        with open(os.path.join(OUTPUT_DIR, json_filename), 'w') as f:
            json.dump(json_data, f, indent=2)

        print(f"Saved {img_filename} and {json_filename}")

if __name__ == "__main__":
    extract_images()
