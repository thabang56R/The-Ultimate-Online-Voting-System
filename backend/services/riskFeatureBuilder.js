import Vote from "../models/Vote.js";

function toNumber(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function diffInSeconds(dateA, dateB) {
  if (!dateA || !dateB) return 0;
  return Math.max(
    0,
    Math.floor((new Date(dateA).getTime() - new Date(dateB).getTime()) / 1000)
  );
}

function diffInDays(dateA, dateB) {
  if (!dateA || !dateB) return 0;
  return Math.max(
    0,
    Math.floor((new Date(dateA).getTime() - new Date(dateB).getTime()) / (1000 * 60 * 60 * 24))
  );
}

function calculateGeoDistanceKm(lat1, lon1, lat2, lon2) {
  if (
    [lat1, lon1, lat2, lon2].some(
      (value) => value === undefined || value === null || Number.isNaN(Number(value))
    )
  ) {
    return 0;
  }

  const toRadians = (deg) => (deg * Math.PI) / 180;
  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export async function buildVotingRiskFeatures({
  user,
  req,
  electionId,
  voteStartTime,
}) {
  const now = new Date();

  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  const recentVotes = await Vote.find({
    voterId: user._id,
    createdAt: { $gte: twentyFourHoursAgo },
  })
    .select("createdAt metadata")
    .sort({ createdAt: -1 });

  const votesLast24h = recentVotes.length;

  const ipSet = new Set();
  const deviceSet = new Set();

  recentVotes.forEach((vote) => {
    if (vote?.metadata?.ipAddress) {
      ipSet.add(vote.metadata.ipAddress);
    }
    if (vote?.metadata?.deviceFingerprint) {
      deviceSet.add(vote.metadata.deviceFingerprint);
    }
  });

  if (req.ip) {
    ipSet.add(req.ip);
  }

  if (req.headers["x-device-fingerprint"]) {
    deviceSet.add(req.headers["x-device-fingerprint"]);
  }

  const ipChangeCount = Math.max(0, ipSet.size - 1);
  const deviceChangeCount = Math.max(0, deviceSet.size - 1);

  const accountAgeDays = diffInDays(now, user.createdAt);

  const failedLoginAttempts = toNumber(user.failedLoginAttempts, 0);

  const isProxyIp =
    req.headers["x-forwarded-for"] ||
    req.headers["via"] ||
    req.headers["forwarded"]
      ? 1
      : 0;

  const currentLat = toNumber(req.headers["x-latitude"], null);
  const currentLon = toNumber(req.headers["x-longitude"], null);

  const lastKnownLat = toNumber(user.lastLoginLatitude, null);
  const lastKnownLon = toNumber(user.lastLoginLongitude, null);

  const geoDistanceKm =
    currentLat !== null &&
    currentLon !== null &&
    lastKnownLat !== null &&
    lastKnownLon !== null
      ? calculateGeoDistanceKm(
          lastKnownLat,
          lastKnownLon,
          currentLat,
          currentLon
        )
      : 0;

  const timeToVoteSeconds = diffInSeconds(now, voteStartTime || now);

  return {
    account_age_days: accountAgeDays,
    votes_last_24h: votesLast24h,
    ip_change_count: ipChangeCount,
    device_change_count: deviceChangeCount,
    failed_login_attempts: failedLoginAttempts,
    is_proxy_ip: isProxyIp,
    geo_distance_km: geoDistanceKm,
    time_to_vote_seconds: timeToVoteSeconds,
    metadata: {
      electionId,
      currentIp: req.ip || null,
      forwardedFor: req.headers["x-forwarded-for"] || null,
      userAgent: req.headers["user-agent"] || null,
      deviceFingerprint: req.headers["x-device-fingerprint"] || null,
    },
  };
}