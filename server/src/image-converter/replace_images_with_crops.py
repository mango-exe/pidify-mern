import fitz  # PyMuPDF
import sys
import json
import os
import subprocess
import shutil
import tempfile

CROPPED_IMAGES_OUTPUT_DIR = "cropped_images"
EXTRACTED_IMAGES_OUTPUT_DIR = "extracted_images"

os.makedirs(CROPPED_IMAGES_OUTPUT_DIR, exist_ok=True)
os.makedirs(EXTRACTED_IMAGES_OUTPUT_DIR, exist_ok=True)

def run_subprocess(cmd, name):
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print("Subprocess output:", result.stdout.strip(), cmd)
        return result.stdout
    except subprocess.CalledProcessError as e:
        print(f"[{name}] Error running subprocess:", e.stderr.strip(), cmd)
        return None

def save_cropped_images(doc):
    results = []

    for page_number, page in enumerate(doc):
        blocks = page.get_text("dict")["blocks"]
        images = page.get_images(full=True)

        # Build a list of image xrefs on this page (in order)
        image_xrefs = [img[0] for img in images]
        image_index = 0

        for block in blocks:
            if block["type"] == 1:  # Image block
                x0, y0, x1, y1 = block["bbox"]
                width = x1 - x0
                height = y1 - y0

                if image_index >= len(image_xrefs):
                    print(f"Warning: No matching xref for image block on page {page_number + 1}")
                    continue

                xref = image_xrefs[image_index]
                image_index += 1

                clip_rect = fitz.Rect(x0, y0, x1, y1)
                pix = page.get_pixmap(clip=clip_rect, dpi=300)

                output_file = f"{CROPPED_IMAGES_OUTPUT_DIR}/img_{xref}.png"
                pix.save(output_file)

                results.append({
                    "page": page_number + 1,
                    "xref": xref,
                    "x": x0,
                    "y": y0,
                    "width": width,
                    "height": height,
                    "output_file": output_file
                })

    print(json.dumps(results, indent=2))



def rename_extracted_images_with_object_ids(pdf_path):
    doc = fitz.open(pdf_path)

    # Gather all unique image xrefs (object IDs) from the PDF pages
    image_xrefs = []
    for page_num in range(len(doc)):
        page = doc[page_num]
        images = page.get_images(full=True)
        for img in images:
            xref = img[0]
            if xref not in image_xrefs:
                image_xrefs.append(xref)

    # Sort xrefs - assumption: pdfcpu extracts images in ascending order
    # image_xrefs.sort()

    # List extracted files and sort (should be image_1.png, image_2.jpg, etc.)
    extracted_files = sorted(os.listdir(EXTRACTED_IMAGES_OUTPUT_DIR))

    if len(extracted_files) != len(image_xrefs):
        print(f"Warning: Number of extracted images ({len(extracted_files)}) "
              f"does not match number of image objects found in PDF ({len(image_xrefs)}).")

    # Rename files to include object IDs
    for i, filename in enumerate(extracted_files):
        if i >= len(image_xrefs):
            break
        old_path = os.path.join(EXTRACTED_IMAGES_OUTPUT_DIR, filename)
        ext = os.path.splitext(filename)[1]
        new_filename = f"image_{image_xrefs[i]}{ext}"
        new_path = os.path.join(EXTRACTED_IMAGES_OUTPUT_DIR, new_filename)
        print(f"Renaming {filename} -> {new_filename}")
        os.rename(old_path, new_path)

def extract_images_from_pdf(doc_name):
    cmd = [
        "pdfcpu", "images", "extract",
        doc_name, EXTRACTED_IMAGES_OUTPUT_DIR
    ]
    run_subprocess(cmd, "PDFCPU_IMAGE_EXTRACT")
    rename_extracted_images_with_object_ids(doc_name)

def get_extracted_images_sizes():
    image_sizes = {}

    print(os.listdir(EXTRACTED_IMAGES_OUTPUT_DIR), 'extracted images dir')
    for image_filename in os.listdir(EXTRACTED_IMAGES_OUTPUT_DIR):
        image_path = os.path.join(EXTRACTED_IMAGES_OUTPUT_DIR, image_filename)
        image_filename_without_extension = os.path.splitext(image_filename)[0]
        print('found image in extracted images dir', image_filename_without_extension)
        parts = image_filename_without_extension.split("_")

        # if len(parts) < 3:
        #     continue

        image_object_id = parts[1]
        print(image_object_id, "image object id", image_filename)
        print("image_object_id:", image_object_id, parts)

        cmd = [
            'ffprobe', '-v', 'error',
            '-select_streams', 'v:0',
            '-show_entries', 'stream=width,height',
            '-of', 'csv=s=x:p=0',
            image_path
        ]

        result = run_subprocess(cmd, "GET_IMAGE_SIZE")

        if result:
            try:
                width, height = result.strip().split('x')
                image_sizes[image_object_id] = {
                    'width': int(width),
                    'height': int(height)
                }
            except ValueError:
                print(f"Warning: Unexpected ffprobe output for {image_path}: {result.strip()}")

    return image_sizes

def update_cropped_images_sizes(image_sizes):
    for image_filename in os.listdir(CROPPED_IMAGES_OUTPUT_DIR):
        image_path = os.path.join(CROPPED_IMAGES_OUTPUT_DIR, image_filename)
        image_filename_without_extension = os.path.splitext(image_filename)[0]
        parts = image_filename_without_extension.split("_")

        if len(parts) < 2:
            continue

        image_object_id = parts[1]
        image_size = image_sizes.get(image_object_id)

        if not image_size:
            print(f"Warning: No size found for image {image_object_id}, skipping.")
            continue

        width = image_size['width']
        height = image_size['height']

        # Create a temporary output file path
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp_file:
            tmp_output_path = tmp_file.name

        cmd = [
            'ffmpeg', '-y', '-i', image_path,
            '-vf', f'scale={width}:{height}',
            tmp_output_path
        ]

        run_subprocess(cmd, "UPDATE_CROPPED_IMAGE_SIZE")

        # Replace original file with resized one
        shutil.move(tmp_output_path, image_path)

def update_images_in_pdf(doc_name):
    for image_filename in os.listdir(CROPPED_IMAGES_OUTPUT_DIR):
        parts = os.path.splitext(image_filename)[0].split("_")
        if len(parts) < 2:
            continue

        image_object_id = parts[1]
        image_path = os.path.join(CROPPED_IMAGES_OUTPUT_DIR, image_filename)

        cmd = [
            "pdfcpu", "images", "update",
            doc_name, image_path, image_object_id
        ]

        run_subprocess(cmd, "PDFCPU_IMAGE_UPDATE")

def main():
    if len(sys.argv) != 2:
        print("Usage: python3 extract_and_crop_images.py file.pdf")
        sys.exit(1)

    pdf_path = sys.argv[1]
    doc = fitz.open(pdf_path)
    doc_name = os.path.basename(pdf_path)

    save_cropped_images(doc)
    extract_images_from_pdf(doc_name)
    image_sizes = get_extracted_images_sizes()
    update_cropped_images_sizes(image_sizes)
    update_images_in_pdf(doc_name)

if __name__ == '__main__':
    main()
