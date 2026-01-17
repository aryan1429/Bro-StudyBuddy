"""
File validation utilities
"""
import os
import magic  # python-magic-bin
from fastapi import UploadFile, HTTPException
from app.config import settings


def validate_file(file: UploadFile) -> None:
    """
    Validate uploaded file
    
    Raises:
        HTTPException: If validation fails
    """
    # Check file extension
    filename = file.filename or ""
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
    
    if ext not in settings.allowed_extensions_list:
        raise HTTPException(
            status_code=400,
            detail=f"File type .{ext} not allowed. Allowed: {settings.allowed_extensions}"
        )
    
    # Check file size (if available)
    if hasattr(file, "size") and file.size:
        if file.size > settings.max_file_size_bytes:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {settings.max_file_size_mb}MB"
            )


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal
    """
    # Get just the basename (no path components)
    filename = os.path.basename(filename)
    
    # Remove or replace dangerous characters
    unsafe_chars = ['..', '/', '\\', '\x00']
    for char in unsafe_chars:
        filename = filename.replace(char, '_')
    
    return filename


def get_file_extension(filename: str) -> str:
    """Extract file extension"""
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""
