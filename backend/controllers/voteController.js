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

    const existingVote = await Vote.findOne({ voterId, electionId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "You have already voted in this election",
      });
    }

    const voteStartTime =
      req.body.voteStartTime || req.headers["x-vote-start-time"] || new Date();

    const riskResult = await scoreVotingRisk({
      user: currentUser,
      req,
      electionId,
      voteStartTime,
    });

    const vote = await Vote.create({
      voterId,
      electionId,
      candidateId,
      voteStatus: riskResult.voteStatus,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel,
      flags: riskResult.flags,
      metadata: {
        ipAddress: req.ip || null,
        userAgent: req.headers["user-agent"] || null,
        deviceFingerprint: req.headers["x-device-fingerprint"] || null,
        mlPrediction: riskResult.modelPrediction,
        riskFeatures: riskResult.features,
      },
    });

    if (riskResult.riskLevel !== "low") {
      await RiskEvent.create({
        voterId,
        electionId,
        voteId: vote._id,
        riskLevel: riskResult.riskLevel,
        riskScore: riskResult.riskScore,
        flags: riskResult.flags,
        eventType: "vote_risk_detected",
        metadata: {
          modelPrediction: riskResult.modelPrediction,
          features: riskResult.features,
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

