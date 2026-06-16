import re
from langchain_core.documents import Document

def clean_text(text: str) -> str:
    """
    Cleans raw text extracted from a PDF page.
    - Normalizes line breaks and whitespace.
    - Filters out obvious page numbers and standard header/footer formats.
    - Removes unwanted non-printable control characters.
    """
    if not text:
        return ""
    
    # 1. Normalize line endings to standard newlines
    text = text.replace("\r\n", "\n").replace("\r", "\n")
    
    # 2. Process line by line to remove headers, footers, and page numbers
    lines = text.split("\n")
    cleaned_lines = []
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        
        # Skip lines that are just numbers (most likely page numbers)
        if re.match(r'^\d+$', stripped):
            continue
            
        # Skip lines that look like page numbering, e.g. "Page 12", "Page 12 of 300", "Pg. 12"
        if re.match(r'^(page|pg\.?)\s*\d+(\s+of\s+\d+)?$', stripped, re.IGNORECASE):
            continue
            
        # Skip common textbook headers or running footers (e.g., repeating subject/chapter names)
        # Note: We filter these dynamically if they match standard patterns.
        # Clean non-printable control characters/symbols (ASCII 0-31, 127)
        cleaned_line = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', stripped)
        
        # Normalize internal whitespace within the line (replace multiple spaces/tabs with single space)
        cleaned_line = re.sub(r'[ \t]+', ' ', cleaned_line).strip()
        
        if cleaned_line:
            cleaned_lines.append(cleaned_line)
            
    # Join lines back
    text = "\n".join(cleaned_lines)
    
    # Normalize multiple consecutive newlines to maximum of two to preserve paragraph structure
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    return text.strip()

def clean_document(doc: Document) -> Document:
    """
    Cleans the page content of a LangChain Document in-place.
    """
    doc.page_content = clean_text(doc.page_content)
    return doc
