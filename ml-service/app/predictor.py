import pandas as pd


def interpret_flags(features: dict) -> list[str]:
    flags = []

    if features["votes_last_24h"] >= 5:
        flags.append("high_vote_frequency")

    if features["ip_change_count"] >= 2:
        flags.append("multiple_ip_changes")

    if features["device_change_count"] >= 2:
        flags.append("multiple_device_changes")

    if features["failed_login_attempts"] >= 3:
        flags.append("repeated_failed_logins")

    if features["is_proxy_ip"] >= 1:
        flags.append("proxy_or_vpn_detected")

    if features["geo_distance_km"] >= 500:
        flags.append("unusual_geo_distance")

    if features["time_to_vote_seconds"] <= 15:
        flags.append("very_fast_vote_submission")

    return flags


def risk_level_from_probability(probability: float) -> str:
    if probability >= 0.75:
        return "high"
    if probability >= 0.40:
        return "medium"
    return "low"


def predict_risk(model, feature_columns, payload: dict) -> dict:
    row = {col: payload[col] for col in feature_columns}
    df = pd.DataFrame([row])

    prediction = int(model.predict(df)[0])
    probability = float(model.predict_proba(df)[0][1])

    flags = interpret_flags(payload)
    risk_level = risk_level_from_probability(probability)

    return {
        "prediction": prediction,
        "risk_score": round(probability, 4),
        "risk_level": risk_level,
        "flags": flags,
    }