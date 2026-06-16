from typing import List
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def chunk_documents(documents: List[Document], chunk_size: int = 900, chunk_overlap: int = 120) -> List[Document]:
    """
    Splits LangChain Documents into smaller chunks using RecursiveCharacterTextSplitter.
    """
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    return splitter.split_documents(documents)
