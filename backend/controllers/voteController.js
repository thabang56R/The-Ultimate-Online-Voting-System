import Vote from "../models/Vote.js";
import RiskEvent from "../models/RiskEvent.js";
import AuditLog from "../models/AuditLog.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import User from "../models/User.js";
import { scoreVotingRisk } from "../services/riskScoringService.js";

export const castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;

    if (!electionId || !candidateId) {
      return res.status(400).json({
        success: false,
        message: "electionId and candidateId are required",
      });
    }

    let currentUser = req.user;

    if (!currentUser && req.headers["x-user-id"]) {
      currentUser = await User.findById(req.headers["x-user-id"]);
    }

    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const voterId = currentUser._id;

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    // Ensure candidate belongs to this election
    const candidateElectionId =
      candidate.electionId?.toString?.() || candidate.election?.toString?.();

    if (candidateElectionId && candidateElectionId !== electionId.toString()) {
      return res.status(400).json({
        success: false,
        message: "Candidate does not belong to the selected election",
      });
    }

    const existingVote = await Vote.findOne({ voterId, electionId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "You have already voted in this election",
      });
    }

    // Accept either body or header value; normalize to a valid date
    const rawVoteStartTime =
      req.body.voteStartTime || req.headers["x-vote-start-time"];

    let voteStartTime = new Date();
    if (rawVoteStartTime) {
      const parsed = new Date(rawVoteStartTime);
      if (!Number.isNaN(parsed.getTime())) {
        voteStartTime = parsed;
      }
    }

    // Call the ML / risk scoring layer
    const riskResult = await scoreVotingRisk({
      user: currentUser,
      req,
      electionId,
      voteStartTime,
    });

    const normalizedRiskResult = {
      voteStatus: riskResult?.voteStatus || "accepted",
      riskScore: Number(riskResult?.riskScore ?? 0),
      riskLevel: riskResult?.riskLevel || "low",
      flags: Array.isArray(riskResult?.flags) ? riskResult.flags : [],
      modelPrediction: riskResult?.modelPrediction ?? null,
      features: riskResult?.features || {},
      explanation: riskResult?.explanation || "",
      topReasons: Array.isArray(riskResult?.topReasons)
        ? riskResult.topReasons
        : [],
      reviewRecommendation: riskResult?.reviewRecommendation || "allow",
      modelVersion: riskResult?.modelVersion || "fraud_model_unknown",
      bestModelName: riskResult?.bestModelName || "unknown",
      thresholds: riskResult?.thresholds || {},
    };

    const vote = await Vote.create({
      voterId,
      electionId,
      candidateId,
      voteStatus: normalizedRiskResult.voteStatus,
      riskScore: normalizedRiskResult.riskScore,
      riskLevel: normalizedRiskResult.riskLevel,
      flags: normalizedRiskResult.flags,
      metadata: {
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
        deviceFingerprint: req.headers["x-device-fingerprint"] || null,

        // ML / risk info
        mlPrediction: normalizedRiskResult.modelPrediction,
        riskFeatures: normalizedRiskResult.features,
        explanation: normalizedRiskResult.explanation,
        topReasons: normalizedRiskResult.topReasons,
        reviewRecommendation: normalizedRiskResult.reviewRecommendation,
        modelVersion: normalizedRiskResult.modelVersion,
        bestModelName: normalizedRiskResult.bestModelName,
        thresholds: normalizedRiskResult.thresholds,

        // Useful timing/debug context
        voteStartTime,
        voteSubmittedAt: new Date(),
      },
    });

    if (normalizedRiskResult.riskLevel !== "low") {
      await RiskEvent.create({
        voterId,
        electionId,
        voteId: vote._id,
        riskLevel: normalizedRiskResult.riskLevel,
        riskScore: normalizedRiskResult.riskScore,
        flags: normalizedRiskResult.flags,
        eventType: "vote_risk_detected",
        metadata: {
          modelPrediction: normalizedRiskResult.modelPrediction,
          features: normalizedRiskResult.features,
          explanation: normalizedRiskResult.explanation,
          topReasons: normalizedRiskResult.topReasons,
          reviewRecommendation: normalizedRiskResult.reviewRecommendation,
          modelVersion: normalizedRiskResult.modelVersion,
          bestModelName: normalizedRiskResult.bestModelName,
        },
      });
    }

    await AuditLog.create({
      actorId: voterId,
      action: "CAST_VOTE",
      entityType: "Vote",
      entityId: vote._id,
      metadata: {
        electionId,
        candidateId,
        voteStatus: vote.voteStatus,
        riskLevel: vote.riskLevel,
        riskScore: vote.riskScore,
        flags: vote.flags,
        reviewRecommendation: normalizedRiskResult.reviewRecommendation,
        modelVersion: normalizedRiskResult.modelVersion,
      },
    });

    return res.status(201).json({
      success: true,
      message:
        vote.voteStatus === "accepted"
          ? "Vote submitted successfully"
          : "Vote submitted and marked for review",
      vote: {
        _id: vote._id,
        voteStatus: vote.voteStatus,
        riskLevel: vote.riskLevel,
        riskScore: vote.riskScore,
        flags: vote.flags,
        explanation: normalizedRiskResult.explanation,
        topReasons: normalizedRiskResult.topReasons,
        reviewRecommendation: normalizedRiskResult.reviewRecommendation,
        modelVersion: normalizedRiskResult.modelVersion,
      },
    });
  } catch (error) {
    console.error("Cast vote error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to cast vote",
      error: error.message,
    });
  }
};

