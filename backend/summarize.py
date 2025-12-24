from transformers import pipeline

# Load once (important for performance)
summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn"
)

def summarize_document(text: str) -> str:
    """
    Generate a structured, explainable summary of the document
    """

    if not text or len(text.strip()) == 0:
        return "No content available for summarization."

    # Chunk long documents safely
    max_chunk_size = 900
    chunks = [
        text[i:i + max_chunk_size]
        for i in range(0, len(text), max_chunk_size)
    ]

    summaries = []

    for chunk in chunks[:5]:  # limit for safety
        result = summarizer(
            chunk,
            max_length=180,
            min_length=80,
            do_sample=False
        )
        summaries.append(result[0]["summary_text"])

    # Structured output
    final_summary = f"""
📄 DOCUMENT OVERVIEW
This document discusses the following key ideas and information.

🔑 KEY TOPICS
{summaries[0] if summaries else ''}

📌 IMPORTANT DETAILS
{' '.join(summaries[1:3]) if len(summaries) > 1 else ''}

✅ CONCLUSION
{' '.join(summaries[3:]) if len(summaries) > 3 else 'The document provides valuable insights and structured information.'}
"""

    return final_summary.strip()
