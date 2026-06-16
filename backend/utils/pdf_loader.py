import os
from typing import List
import pypdf
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.documents import Document

# Set decompression limits to 1 GB to prevent LimitReachedError on large, graphic-heavy PDFs
pypdf.filters.ZLIB_MAX_OUTPUT_LENGTH = 1000 * 1024 * 1024
pypdf.filters.ZLIB_MAX_RECOVERY_INPUT_LENGTH = 1000 * 1024 * 1024

def load_pdf(file_path: str) -> List[Document]:
    """
    Loads a PDF file page-by-page using PyPDFLoader.
    """
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"PDF file not found: {file_path}")
    
    loader = PyPDFLoader(file_path)
    documents = loader.load()
    return documents
