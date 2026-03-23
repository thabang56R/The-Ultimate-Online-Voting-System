from __future__ import annotations

import json
from pathlib import Path

import joblib


BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"

MODEL_PATH = MODELS_DIR / "best_model.pkl"
FEATURES_PATH = MODELS_DIR / "feature_columns.pkl"
METADATA_PATH = MODELS_DIR / "model_metadata.json"


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found at {MODEL_PATH}. Train the model first."
        )

    if not FEATURES_PATH.exists():
        raise FileNotFoundError(
            f"Feature columns file not found at {FEATURES_PATH}. Train the model first."
        )

    model = joblib.load(MODEL_PATH)
    feature_columns = joblib.load(FEATURES_PATH)

    return model, feature_columns


def load_metadata() -> dict:
    if not METADATA_PATH.exists():
        return {
            "model_version": "fraud_model_unknown",
            "best_model_name": "unknown",
            "thresholds": {"medium": 0.40, "high": 0.75},
        }

    with open(METADATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)