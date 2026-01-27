"""
Content filter for detecting and blocking inappropriate content
"""
import re
from typing import Tuple

# List of inappropriate words/patterns (add more as needed)
INAPPROPRIATE_WORDS = {
    # Profanity
    'fuck', 'shit', 'ass', 'bitch', 'bastard', 'damn', 'crap',
    'dick', 'cock', 'pussy', 'cunt', 'whore', 'slut',
    # Slurs and hate speech
    'nigger', 'nigga', 'faggot', 'fag', 'retard', 'retarded',
    # Violence
    'kill yourself', 'kys', 'murder', 'rape',
    # Variations with numbers/symbols
    'f*ck', 'sh*t', 'b*tch', 'a$$', 'd1ck', 'fck', 'sht',
}

# Patterns for detecting leetspeak and character substitutions
LEETSPEAK_MAP = {
    '0': 'o', '1': 'i', '3': 'e', '4': 'a', '5': 's',
    '7': 't', '@': 'a', '$': 's', '!': 'i', '*': '',
}


def normalize_text(text: str) -> str:
    """
    Normalize text by converting leetspeak and removing special characters
    """
    normalized = text.lower()
    
    # Replace leetspeak characters
    for leet, normal in LEETSPEAK_MAP.items():
        normalized = normalized.replace(leet, normal)
    
    # Remove repeated characters (e.g., 'fuuuck' -> 'fuck')
    normalized = re.sub(r'(.)\1{2,}', r'\1', normalized)
    
    # Remove spaces between letters (e.g., 'f u c k' -> 'fuck')
    words = normalized.split()
    if len(words) > 3:
        # Check if single letters spell out bad words
        single_letters = ''.join(w for w in words if len(w) == 1)
        if any(bad in single_letters for bad in INAPPROPRIATE_WORDS):
            return single_letters
    
    return normalized


def check_content(text: str) -> Tuple[bool, str]:
    """
    Check if text contains inappropriate content
    
    Args:
        text: The text to check
        
    Returns:
        Tuple of (is_appropriate, message)
        - is_appropriate: True if content is OK, False if inappropriate
        - message: Explanation if inappropriate, empty string if OK
    """
    if not text or not text.strip():
        return True, ""
    
    # Normalize the text
    normalized = normalize_text(text)
    original_lower = text.lower()
    
    # Check for exact matches and partial matches
    for bad_word in INAPPROPRIATE_WORDS:
        # Check in normalized text
        if bad_word in normalized:
            return False, f"Message contains inappropriate language."
        
        # Check in original text (lowercase)
        if bad_word in original_lower:
            return False, f"Message contains inappropriate language."
        
        # Check with word boundaries (to catch variations)
        pattern = r'\b' + re.escape(bad_word) + r'\b'
        if re.search(pattern, original_lower):
            return False, f"Message contains inappropriate language."
    
    return True, ""


def filter_response(text: str) -> str:
    """
    Filter inappropriate words from response text (for LLM outputs)
    Replaces bad words with asterisks
    """
    filtered = text
    for bad_word in INAPPROPRIATE_WORDS:
        # Create case-insensitive pattern
        pattern = re.compile(re.escape(bad_word), re.IGNORECASE)
        replacement = '*' * len(bad_word)
        filtered = pattern.sub(replacement, filtered)
    
    return filtered
