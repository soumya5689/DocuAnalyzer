from pathlib import Path
from PIL import Image
import pytesseract
from docx import Document
import fitz

def extract_text(file_path: str) -> str:
    file = Path(file_path)
    ext = file.suffix.lower()

    try:
        if ext == ".pdf":
            text = ""
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
            return text if text else "No text found in the PDF."

        elif ext == ".docx":
            doc = Document(file_path)
            return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])

        elif ext in [".png", ".jpg", ".jpeg"]:
            img = Image.open(file_path)
            return pytesseract.image_to_string(img)

        else:
            return "Unsupported file type for text extraction."

    except Exception as e:
        return f"Error extracting text: {e}"
