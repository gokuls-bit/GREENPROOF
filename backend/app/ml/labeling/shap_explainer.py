import shap

class SHAPExplainer:
    def explain(self, model, data):
        explainer = shap.Explainer(model, data)
        shap_values = explainer(data)
        return shap_values
