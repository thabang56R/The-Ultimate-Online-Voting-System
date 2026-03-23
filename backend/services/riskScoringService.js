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

  const riskLevel = prediction?.risk_level ?? "low";
  const riskScore = Number(prediction?.risk_score ?? 0);
  const flags = Array.isArray(prediction?.flags) ? prediction.flags : [];
  const topReasons = Array.isArray(prediction?.top_reasons)
    ? prediction.top_reasons
    : [];
  const explanation = prediction?.explanation || "";
  const reviewRecommendation = prediction?.review_recommendation || "allow";
  const modelPrediction = prediction?.prediction ?? 0;
  const modelVersion = prediction?.model_version || "fraud_model_unknown";
  const bestModelName = prediction?.best_model_name || "unknown";
  const thresholds = prediction?.thresholds || {};

  let voteStatus = "accepted";

  if (riskLevel === "medium") {
    voteStatus = "challenged";
  }

  if (riskLevel === "high") {
    voteStatus = "flagged";
  }

  return {
    voteStatus,
    riskScore,
    riskLevel,
    flags,
    modelPrediction,
    features: built,
    explanation,
    topReasons,
    reviewRecommendation,
    modelVersion,
    bestModelName,
    thresholds,
  };
}