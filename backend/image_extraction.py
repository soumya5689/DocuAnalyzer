import fitz  # PyMuPDF
import os
import uuid

UPLOAD_DIR = "uploaded_pdfs"  # Consistent upload directory name

def extract_images(file_path):
    try:
        doc = fitz.open(file_path)
        output_dir = os.path.join(UPLOAD_DIR, "images")
        os.makedirs(output_dir, exist_ok=True)
        saved_images = []

        for page_num in range(len(doc)):
            page = doc.load_page(page_num)
            images = page.get_images(full=True)
            for img_index, img in enumerate(images):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                image_name = f"{uuid.uuid4()}.{image_ext}"
                image_path = os.path.join(output_dir, image_name)
                with open(image_path, "wb") as img_file:
                    img_file.write(image_bytes)
                saved_images.append(os.path.basename(image_path))  # Return just the filename for consistency with other endpoints
        return {"image_paths": saved_images} # Return a dictionary for better structure
    except Exception as e:
        return f"Error extracting images: {str(e)}"