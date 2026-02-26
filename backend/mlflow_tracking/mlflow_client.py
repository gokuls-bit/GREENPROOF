import mlflow

def log_metric(key, value, step=None):
    mlflow.log_metric(key, value, step=step)

def log_param(key, value):
    mlflow.log_param(key, value)

def log_artifact(path):
    mlflow.log_artifact(path)
