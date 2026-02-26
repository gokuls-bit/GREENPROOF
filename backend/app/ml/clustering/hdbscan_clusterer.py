import hdbscan
import numpy as np

class HDBSCANClusterer:
    def __init__(self, min_cluster_size=5, min_samples=3):
        self.model = hdbscan.HDBSCAN(min_cluster_size=min_cluster_size, min_samples=min_samples, prediction_data=True)

    def fit(self, embeddings):
        self.model.fit(embeddings)
        return self.model.labels_

    def predict(self, embeddings):
        labels, strengths = hdbscan.approximate_predict(self.model, embeddings)
        return labels, strengths
