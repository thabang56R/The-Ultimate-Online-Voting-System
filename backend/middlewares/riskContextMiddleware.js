import crypto from "crypto";
import Vote from "../models/Vote.js";

const hashValue = (value = "") =>
  crypto.createHash("sha256").update(value).digest("hex");

export const buildRiskContext = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection?.remoteAddress || "";
    const userAgent = req.headers["user-agent"] || "";

    const deviceHash = hashValue(`${userAgent}-${ip}`);
    const ipHash = hashValue(ip);

    const votesFromSameIpLastHour = await Vote.countDocuments({
      ipHash,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) },
    });

    req.riskContext = {
      ipHash,
      deviceHash,
      geoRegion: "unknown",
      failedLoginsLast24h: 0,
      accountAgeMinutes: 60,
      timeToVoteAfterLoginSeconds: 12,
      ipUsedByMultipleAccounts: false,
      isNewDevice: true,
      sessionActionsCount: 4,
      votesFromSameIpLastHour,
    };

    next();
  } catch (error) {
    next(error);
  }
};