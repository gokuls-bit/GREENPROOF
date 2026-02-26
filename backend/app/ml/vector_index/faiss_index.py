import faiss
import numpy as np

class FaissIndex:
    def __init__(self, dim, index_type="flat"):
        if index_type == "flat":
            self.index = faiss.IndexFlatL2(dim)
        else:
            self.index = faiss.IndexFlatIP(dim)

    def add(self, embeddings):
        self.index.add(embeddings.astype(np.float32))

    def search(self, query, top_k=5):
        distances, indices = self.index.search(query.astype(np.float32), top_k)
        return distances, indices
