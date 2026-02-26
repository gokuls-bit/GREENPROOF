from sklearn.ensemble import IsolationForest
import numpy as np

class AnomalyDetector:
    def __init__(self, contamination=0.1):
        self.model = IsolationForest(contamination=contamination, random_state=42)

    def fit(self, embeddings):
        self.model.fit(embeddings)

    def predict(self, embeddings):
        return self.model.predict(embeddings)
