from __future__ import annotations

from typing import Any

import pandas as pd


MEDIUM_RISK_THRESHOLD = 0.40
HIGH_RISK_THRESHOLD = 0.75


def interpret_flags(features: dict[str, Any]) -> list[str]:
    flags: list[str] = []

    if features.get("votes_last_24h", 0) >= 5:
        flags.append("high_vote_frequency")

    if features.get("ip_change_count", 0) >= 2:
        flags.append("multiple_ip_changes")

    if features.get("device_change_count", 0) >= 2:
        flags.append("multiple_device_changes")

    if features.get("failed_login_attempts", 0) >= 3:
        flags.append("repeated_failed_logins")

    if features.get("is_proxy_ip", 0) >= 1:
        flags.append("proxy_or_vpn_detected")

    if features.get("geo_distance_km", 0) >= 500:
        flags.append("unusual_geo_distance")

    if features.get("time_to_vote_seconds", 999999) <= 15:
        flags.append("very_fast_vote_submission")

    if features.get("account_age_days", 999999) <= 3:
        flags.append("very_new_account")

    return flags


def build_top_reasons(features: dict[str, Any], probability: float) -> list[dict[str, Any]]:
    reasons: list[dict[str, Any]] = []

    if features.get("is_proxy_ip", 0) == 1:
        reasons.append(
            {"feature": "is_proxy_ip", "value": 1, "impact": "high"}
        )

    if features.get("ip_change_count", 0) >= 2:
        reasons.append(
            {
                "feature": "ip_change_count",
                "value": features["ip_change_count"],
                "impact": "medium",
            }
        )

    if features.get("device_change_count", 0) >= 2:
        reasons.append(
            {
                "feature": "device_change_count",
                "value": features["device_change_count"],
                "impact": "medium",
            }
        )

    if features.get("failed_login_attempts", 0) >= 3:
        reasons.append(
            {
                "feature": "failed_login_attempts",
                "value": features["failed_login_attempts"],
                "impact": "medium",
            }
        )

    if features.get("geo_distance_km", 0) >= 500:
        reasons.append(
            {
                "feature": "geo_distance_km",
                "value": features["geo_distance_km"],
                "impact": "medium",
            }
        )

    if features.get("time_to_vote_seconds", 999999) <= 15:
        reasons.append(
            {
                "feature": "time_to_vote_seconds",
                "value": features["time_to_vote_seconds"],
                "impact": "high",
            }
        )

    if features.get("votes_last_24h", 0) >= 5:
        reasons.append(
            {
                "feature": "votes_last_24h",
                "value": features["votes_last_24h"],
                "impact": "high",
            }
        )

    if not reasons:
        reasons.append(
            {
                "feature": "overall_behavior",
                "value": round(probability, 4),
                "impact": "low",
            }
        )

    return reasons[:3]


def risk_level_from_probability(probability: float) -> str:
    if probability >= HIGH_RISK_THRESHOLD:
        return "high"
    if probability >= MEDIUM_RISK_THRESHOLD:
        return "medium"
    return "low"


def review_recommendation_from_probability(probability: float) -> str:
    if probability >= HIGH_RISK_THRESHOLD:
        return "block_and_review"
    if probability >= MEDIUM_RISK_THRESHOLD:
        return "flag_for_review"
    return "allow"


def build_explanation(
    risk_level: str,
    flags: list[str],
    top_reasons: list[dict[str, Any]],
) -> str:
    if flags:
        reason_names = ", ".join(flag.replace("_", " ") for flag in flags[:3])
        return (
            f"Vote marked {risk_level}-risk due to {reason_names}. "
            f"Top contributing signals were {[r['feature'] for r in top_reasons]}."
        )

    return (
        f"Vote marked {risk_level}-risk based on the model score and overall behavior pattern."
    )


def predict_risk(model, feature_columns: list[str], payload: dict[str, Any], metadata: dict) -> dict:
    missing = [col for col in feature_columns if col not in payload]
    if missing:
        raise ValueError(f"Missing required feature(s): {', '.join(missing)}")

    row = {col: payload[col] for col in feature_columns}
    df = pd.DataFrame([row])

    prediction = int(model.predict(df)[0])

    if hasattr(model, "predict_proba"):
        probability = float(model.predict_proba(df)[0][1])
    else:
        # Fallback for models that do not expose predict_proba
        probability = float(prediction)

    risk_level = risk_level_from_probability(probability)
    flags = interpret_flags(payload)
    top_reasons = build_top_reasons(payload, probability)
    review_recommendation = review_recommendation_from_probability(probability)
    explanation = build_explanation(risk_level, flags, top_reasons)

    return {
        "prediction": prediction,
        "risk_score": round(probability, 4),
        "risk_level": risk_level,
        "flags": flags,
        "top_reasons": top_reasons,
        "explanation": explanation,
        "review_recommendation": review_recommendation,
        "model_version": metadata.get("model_version", "fraud_model_unknown"),
        "best_model_name": metadata.get("best_model_name", "unknown"),
        "thresholds": metadata.get(
            "thresholds",
            {"medium": MEDIUM_RISK_THRESHOLD, "high": HIGH_RISK_THRESHOLD},
        ),
    }