import re
from PyPDF2 import PdfReader

def extract_links(file_path):
    try:
        reader = PdfReader(file_path)
        links = set()
        for page in reader.pages:
            text = page.extract_text() or ''
            found_links = re.findall(r'(https?://\S+)', text)
            links.update(found_links)
        return list(links)
    except Exception as e:
        return f"Error extracting links: {str(e)}"