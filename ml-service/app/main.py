from fastapi import FastAPI, HTTPException

from app.schemas import RiskFeatures
from app.model_loader import load_model, load_metadata
from app.predictor import predict_risk

app = FastAPI(title="SecureVote AI ML Service", version="2.0.0")

model, feature_columns = load_model()
metadata = load_metadata()


@app.get("/")
def root():
    return {
        "message": "SecureVote AI ML service running",
        "model_version": metadata.get("model_version", "fraud_model_unknown"),
        "best_model_name": metadata.get("best_model_name", "unknown"),
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model_loaded": True,
        "model_version": metadata.get("model_version", "fraud_model_unknown"),
    }


@app.post("/predict-risk")
def predict(features: RiskFeatures):
    try:
        payload = features.model_dump()
        result = predict_risk(model, feature_columns, payload, metadata)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}"
        ) from exc