from fastapi import FastAPI
from .schemas import RiskFeatures
from .predictor import predict_risk

app = FastAPI(title="SecureVote AI ML Service")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict-risk")
def predict(features: RiskFeatures):
    result = predict_risk(features)
    return result