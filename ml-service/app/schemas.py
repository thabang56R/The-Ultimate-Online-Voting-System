from pydantic import BaseModel


class RiskFeatures(BaseModel):
    account_age_days: float
    votes_last_24h: float
    ip_change_count: float
    device_change_count: float
    failed_login_attempts: float
    is_proxy_ip: float
    geo_distance_km: float
    time_to_vote_seconds: float