from fastapi import FastAPI
from app.schemas import RiskFeatures
from app.model_loader import load_model
from app.predictor import predict_risk

app = FastAPI(title="SecureVote AI ML Service", version="1.0.0")

model, feature_columns = load_model()


@app.get("/")
def root():
    return {"message": "SecureVote AI ML service running"}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict-risk")
def predict(features: RiskFeatures):
    payload = features.model_dump()
    result = predict_risk(model, feature_columns, payload)
    return result