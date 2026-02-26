from sentence_transformers import SentenceTransformer
import numpy as np

class TransformerEncoder:
    def __init__(self, model_name="all-MiniLM-L6-v2"):
        self.model = SentenceTransformer(model_name)

    def encode(self, texts, batch_size=64):
        return self.model.encode(texts, batch_size=batch_size, show_progress_bar=False)
