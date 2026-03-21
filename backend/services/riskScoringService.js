import { buildVotingRiskFeatures } from "./riskFeatureBuilder.js";
import { predictVotingRisk } from "./mlService.js";

export async function scoreVotingRisk({ user, req, electionId, voteStartTime }) {
  const built = await buildVotingRiskFeatures({
    user,
    req,
    electionId,
    voteStartTime,
  });

  const mlPayload = {
    account_age_days: built.account_age_days,
    votes_last_24h: built.votes_last_24h,
    ip_change_count: built.ip_change_count,
    device_change_count: built.device_change_count,
    failed_login_attempts: built.failed_login_attempts,
    is_proxy_ip: built.is_proxy_ip,
    geo_distance_km: built.geo_distance_km,
    time_to_vote_seconds: built.time_to_vote_seconds,
  };

  const prediction = await predictVotingRisk(mlPayload);

  let voteStatus = "accepted";

  if (prediction.risk_level === "medium") {
    voteStatus = "challenged";
  }

  if (prediction.risk_level === "high") {
    voteStatus = "flagged";
  }

  return {
    voteStatus,
    riskScore: prediction.risk_score ?? 0,
    riskLevel: prediction.risk_level ?? "low",
    flags: prediction.flags || [],
    modelPrediction: prediction.prediction ?? 0,
    features: built,
  };
}