# ml-service/app/predictor.py
def predict_risk(features):
    score = 0.0
    flags = []

    if features.failed_logins_last_24h > 5:
        score += 0.2
        flags.append("many_failed_logins")

    if features.account_age_minutes < 30:
        score += 0.2
        flags.append("new_account")

    if features.time_to_vote_after_login_seconds < 10:
        score += 0.2
        flags.append("rapid_vote")

    if features.ip_used_by_multiple_accounts == 1:
        score += 0.2
        flags.append("shared_ip")

    if features.is_new_device == 1:
        score += 0.1
        flags.append("new_device")

    if features.votes_from_same_ip_last_hour > 3:
        score += 0.2
        flags.append("ip_spike")

    score = min(score, 1.0)

    if score >= 0.7:
        level = "high"
    elif score >= 0.4:
        level = "medium"
    else:
        level = "low"

    return {
        "risk_score": round(score, 2),
        "risk_level": level,
        "flags": flags
    }