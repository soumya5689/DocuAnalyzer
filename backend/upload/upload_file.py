import os
from fastapi import UploadFile
import shutil

UPLOAD_DIR = "uploaded_pdfs"  # Consistent upload directory name

async def save_upload_file(file: UploadFile):
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_location = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        return file_location
    except IOError as e:
        return f"Error saving file: {str(e)}"