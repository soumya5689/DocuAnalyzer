from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os

from text_extraction import extract_text
from image_extraction import extract_images
from summarize import summarize_document


from links import extract_links
from question_ans import answer_question_from_text
from upload.upload_file import save_upload_file  # Import the utility function

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "https://docu-analyzer-omega.vercel.app"],  # Corrected origins list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_pdfs"  # Consistent upload directory name
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    print(f"[INFO] Received file: {file.filename}")
    file_path = await save_upload_file(file)
    return {"filename": os.path.basename(file_path)}


@app.get("/extract-text/")
async def extract_text_api(filename: str):
    return {"text": extract_text(os.path.join(UPLOAD_DIR, filename))}

@app.get("/extract-links/")
async def extract_links_api(filename: str):
    return {"links": extract_links(os.path.join(UPLOAD_DIR, filename))}

@app.get("/extract-images/")
async def extract_images_api(filename: str):
    result = extract_images(os.path.join(UPLOAD_DIR, filename))
    return result

@app.post("/ask-question/")
async def ask_question(filename: str = Form(...), question: str = Form(...)):
    # Extract text from the uploaded file
    text = extract_text(os.path.join(UPLOAD_DIR, filename))
    
    # Pass the extracted text and user question to the answer function
    answer = answer_question_from_text(text, question)
    
    return {"answer": answer}

@app.get("/summarize-document/")
async def summarize_document_api(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)

    if not os.path.exists(file_path):
        return {"summary": "File not found."}

    text = extract_text(file_path)
    summary = summarize_document(text)

    return {"summary": summary}

