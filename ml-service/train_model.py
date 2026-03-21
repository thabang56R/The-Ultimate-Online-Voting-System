from pathlib import Path
import joblib
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

BASE_DIR = Path(__file__).resolve().parent
DATA_PATH = BASE_DIR / "data" / "voting_risk_dataset.csv"
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "risk_model.pkl"
FEATURES_PATH = MODELS_DIR / "feature_columns.pkl"


def main():
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(DATA_PATH)

    target_col = "risk_label"
    feature_cols = [col for col in df.columns if col != target_col]

    X = df[feature_cols]
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=8,
        random_state=42
    )
    model.fit(X_train, y_train)

    preds = model.predict(X_test)

    print("Accuracy:", accuracy_score(y_test, preds))
    print("\nClassification Report:\n")
    print(classification_report(y_test, preds))

    joblib.dump(model, MODEL_PATH)
    joblib.dump(feature_cols, FEATURES_PATH)

    print(f"\nModel saved to: {MODEL_PATH}")
    print(f"Feature columns saved to: {FEATURES_PATH}")


if __name__ == "__main__":
    main()