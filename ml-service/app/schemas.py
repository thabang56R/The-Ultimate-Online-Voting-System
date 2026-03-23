from pydantic import BaseModel, Field


class RiskFeatures(BaseModel):
    account_age_days: int = Field(..., ge=0)
    votes_last_24h: int = Field(..., ge=0)
    ip_change_count: int = Field(..., ge=0)
    device_change_count: int = Field(..., ge=0)
    failed_login_attempts: int = Field(..., ge=0)
    is_proxy_ip: int = Field(..., ge=0, le=1)
    geo_distance_km: float = Field(..., ge=0)
    time_to_vote_seconds: float = Field(..., ge=0)


class PredictionRequest(RiskFeatures):
    pass