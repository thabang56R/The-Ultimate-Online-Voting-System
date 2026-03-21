from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "risk_model.pkl"
FEATURES_PATH = BASE_DIR / "models" / "feature_columns.pkl"


def load_model():
    model = joblib.load(MODEL_PATH)
    feature_columns = joblib.load(FEATURES_PATH)
    return model, feature_columns