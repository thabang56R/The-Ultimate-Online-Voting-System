from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    f1_score,
    precision_score,
    recall_score,
)
from sklearn.model_selection import train_test_split


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "voting_risk_dataset.csv"
MODELS_DIR = BASE_DIR / "models"
ARTIFACTS_DIR = BASE_DIR / "artifacts"

BEST_MODEL_PATH = MODELS_DIR / "best_model.pkl"
FEATURE_COLUMNS_PATH = MODELS_DIR / "feature_columns.pkl"
METADATA_PATH = MODELS_DIR / "model_metadata.json"
METRICS_PATH = ARTIFACTS_DIR / "metrics.json"


def evaluate_model(name: str, model, x_train, x_test, y_train, y_test) -> dict:
    model.fit(x_train, y_train)
    preds = model.predict(x_test)

    metrics = {
        "model_name": name,
        "accuracy": round(float(accuracy_score(y_test, preds)), 4),
        "precision": round(float(precision_score(y_test, preds, zero_division=0)), 4),
        "recall": round(float(recall_score(y_test, preds, zero_division=0)), 4),
        "f1": round(float(f1_score(y_test, preds, zero_division=0)), 4),
        "classification_report": classification_report(
            y_test, preds, zero_division=0, output_dict=True
        ),
    }
    return metrics


def main():
    MODELS_DIR.mkdir(parents=True, exist_ok=True)
    ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)

    if not DATA_PATH.exists():
        raise FileNotFoundError(f"Dataset not found: {DATA_PATH}")

    df = pd.read_csv(DATA_PATH)
    target_col = "risk_label"

    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataset")

    feature_cols = [col for col in df.columns if col != target_col]

    x = df[feature_cols]
    y = df[target_col]

    x_train, x_test, y_train, y_test = train_test_split(
        x,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    candidates = {
        "logistic_regression": LogisticRegression(max_iter=1000),
        "random_forest": RandomForestClassifier(
            n_estimators=250,
            max_depth=10,
            min_samples_split=4,
            random_state=42,
        ),
        "gradient_boosting": GradientBoostingClassifier(
            n_estimators=150,
            learning_rate=0.08,
            max_depth=3,
            random_state=42,
        ),
    }

    all_metrics = {}
    best_name = None
    best_model = None
    best_f1 = -1.0

    for name, model in candidates.items():
        metrics = evaluate_model(name, model, x_train, x_test, y_train, y_test)
        all_metrics[name] = metrics

        if metrics["f1"] > best_f1:
            best_f1 = metrics["f1"]
            best_name = name
            best_model = model

    assert best_model is not None
    best_model.fit(x_train, y_train)

    joblib.dump(best_model, BEST_MODEL_PATH)
    joblib.dump(feature_cols, FEATURE_COLUMNS_PATH)

    metadata = {
        "model_version": f"{best_name}_v1",
        "best_model_name": best_name,
        "trained_at_utc": datetime.now(timezone.utc).isoformat(),
        "dataset_path": str(DATA_PATH.name),
        "target_column": target_col,
        "feature_count": len(feature_cols),
        "feature_columns": feature_cols,
        "thresholds": {
            "medium": 0.40,
            "high": 0.75,
        },
        "selection_metric": "f1",
        "best_f1": round(best_f1, 4),
    }

    with open(METADATA_PATH, "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    with open(METRICS_PATH, "w", encoding="utf-8") as f:
        json.dump(all_metrics, f, indent=2)

    print("Training complete.")
    print(f"Best model: {best_name}")
    print(f"Saved model to: {BEST_MODEL_PATH}")
    print(f"Saved feature columns to: {FEATURE_COLUMNS_PATH}")
    print(f"Saved metadata to: {METADATA_PATH}")
    print(f"Saved metrics to: {METRICS_PATH}")


if __name__ == "__main__":
    main()