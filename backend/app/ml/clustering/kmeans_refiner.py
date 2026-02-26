from sklearn.cluster import KMeans
import numpy as np

class KMeansRefiner:
    def __init__(self, n_clusters=10):
        self.model = KMeans(n_clusters=n_clusters, random_state=42, n_init=10)

    def fit(self, embeddings):
        self.model.fit(embeddings)
        return self.model.labels_

    def predict(self, embeddings):
        return self.model.predict(embeddings)
