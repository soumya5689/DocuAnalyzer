import re
import faiss
import torch
from sentence_transformers import SentenceTransformer
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

# =========================
# MODELS (LOAD ONCE)
# =========================
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-base")
llm = AutoModelForSeq2SeqLM.from_pretrained("google/flan-t5-base")

# =========================
# TEXT CLEANING & CHUNKING
# =========================
def clean_text(text):
    text = re.sub(r'\s+', ' ', text)
    return text.strip()

def chunk_text(text, chunk_size=400, overlap=80):
    text = clean_text(text)
    words = text.split()

    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start = end - overlap

    return chunks

# =========================
# VECTOR STORE (IN-MEMORY)
# =========================
def build_faiss_index(chunks):
    embeddings = embed_model.encode(
        chunks,
        normalize_embeddings=True
    ).astype("float32")

    index = faiss.IndexFlatIP(embeddings.shape[1])
    index.add(embeddings)

    return index, chunks

# =========================
# RETRIEVAL
# =========================
def retrieve_context(question, index, chunks, top_k=5):
    q_embed = embed_model.encode(
        [question],
        normalize_embeddings=True
    ).astype("float32")

    scores, indices = index.search(q_embed, top_k * 2)

    relevant_chunks = []
    for i, score in zip(indices[0], scores[0]):
        if score > 0.45:  # 🔒 relevance threshold
            relevant_chunks.append(chunks[i])

    return "\n".join(relevant_chunks[:top_k])


# =========================
# GENERATION (KEY PART)
# =========================
def generate_answer(question, context):
    prompt = f"""
You are a senior Python instructor.

Answer the question using the context.
If the question asks for a definition, explain clearly.
Do NOT mention algorithms unless asked.

Context:
{context}

Question:
{question}

Answer in 3–6 clear sentences:
"""

    inputs = tokenizer(
        prompt,
        return_tensors="pt",
        truncation=True,
        max_length=1024
    )

    with torch.no_grad():
        outputs = llm.generate(
            **inputs,
            max_new_tokens=300,
            temperature=0.25
        )

    return tokenizer.decode(outputs[0], skip_special_tokens=True)


# =========================
# MAIN PIPELINE (RAG)
# =========================
def answer_question_from_text(text, question):
    chunks = chunk_text(text)
    index, chunks = build_faiss_index(chunks)
    context = retrieve_context(question, index, chunks)
    answer = generate_answer(question, context)
    return answer
