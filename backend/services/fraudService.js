import axios from "axios";

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8001";

function normalizeNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export function buildFraudFeatures({
  user,
  recentVotesCount = 0,
  ipChangeCount = 0,
  deviceChangeCount = 0,
  failedLoginAttempts = 0,
  isProxyIp = 0,
  geoDistanceKm = 0,
  timeToVoteSeconds = 0,
}) {
  const createdAt = user?.createdAt ? new Date(user.createdAt) : null;
  const now = new Date();

  const accountAgeDays = createdAt
    ? Math.max(
        0,
        Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      )
    : 0;

  return {
    account_age_days: accountAgeDays,
    votes_last_24h: normalizeNumber(recentVotesCount, 0),
    ip_change_count: normalizeNumber(ipChangeCount, 0),
    device_change_count: normalizeNumber(deviceChangeCount, 0),
    failed_login_attempts: normalizeNumber(failedLoginAttempts, 0),
    is_proxy_ip: normalizeNumber(isProxyIp, 0) ? 1 : 0,
    geo_distance_km: normalizeNumber(geoDistanceKm, 0),
    time_to_vote_seconds: normalizeNumber(timeToVoteSeconds, 0),
  };
}

export async function analyzeVoteFraud(features) {
  const url = `${ML_SERVICE_URL}/predict-risk`;

  const { data } = await axios.post(url, features, {
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
}