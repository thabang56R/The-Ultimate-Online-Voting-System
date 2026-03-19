# ml-service/app/schemas.py
from pydantic import BaseModel

class RiskFeatures(BaseModel):
    failed_logins_last_24h: float
    account_age_minutes: float
    time_to_vote_after_login_seconds: float
    ip_used_by_multiple_accounts: int
    is_new_device: int
    session_actions_count: float
    votes_from_same_ip_last_hour: float