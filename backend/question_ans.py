import re
import faiss
import torch
import numpy as np
from transformers import AutoTokenizer, AutoModelForQuestionAnswering
from sentence_transformers import SentenceTransformer

# Load models
embed_model = SentenceTransformer('all-MiniLM-L6-v2')
qa_tokenizer = AutoTokenizer.from_pretrained("deepset/roberta-base-squad2")
qa_model = AutoModelForQuestionAnswering.from_pretrained("deepset/roberta-base-squad2")

def split_sentences(text):
    return re.split(r'(?<=[.!?])\s+', text.strip())

def create_faiss_index(sentences):
    embeddings = embed_model.encode(sentences).astype("float32")
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index, embeddings, sentences

def get_relevant_context(question, text, top_n=5):
    sentences = split_sentences(text)
    index, embeddings, sentences = create_faiss_index(sentences)
    q_embedding = embed_model.encode([question]).astype("float32")
    _, indices = index.search(q_embedding, top_n)
    return " ".join([sentences[i] for i in indices[0]])

def generate_answer(question, context):
    inputs = qa_tokenizer(question, context, return_tensors="pt", truncation=True)
    with torch.no_grad():
        outputs = qa_model(**inputs)
    start = torch.argmax(outputs.start_logits)
    end = torch.argmax(outputs.end_logits) + 1
    answer = qa_tokenizer.convert_tokens_to_string(
        qa_tokenizer.convert_ids_to_tokens(inputs["input_ids"][0][start:end])
    )
    return answer.strip()

def answer_question_from_text(text, question):
    context = get_relevant_context(question, text)
    answer = generate_answer(question, context)
    return answer if answer else "Sorry, I couldn't find a relevant answer."

