import Vote from "../models/Vote.js";
import RiskEvent from "../models/RiskEvent.js";
import AuditLog from "../models/AuditLog.js";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import { scoreVotingRisk } from "../services/riskScoringService.js";

export const castVote = async (req, res) => {
  try {
    const { electionId, candidateId } = req.body;
    const voterId = req.user._id;

    if (!electionId || !candidateId) {
      return res.status(400).json({
        success: false,
        message: "electionId and candidateId are required",
      });
    }

    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    if (election.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Election is not active",
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    if (candidate.electionId.toString() !== electionId) {
      return res.status(400).json({
        success: false,
        message: "Candidate does not belong to this election",
      });
    }

    const existingVote = await Vote.findOne({ electionId, voterId });
    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: "You have already voted in this election",
      });
    }

    const featurePayload = {
      failed_logins_last_24h: req.riskContext.failedLoginsLast24h || 0,
      account_age_minutes: req.riskContext.accountAgeMinutes || 0,
      time_to_vote_after_login_seconds:
        req.riskContext.timeToVoteAfterLoginSeconds || 0,
      ip_used_by_multiple_accounts:
        req.riskContext.ipUsedByMultipleAccounts ? 1 : 0,
      is_new_device: req.riskContext.isNewDevice ? 1 : 0,
      session_actions_count: req.riskContext.sessionActionsCount || 0,
      votes_from_same_ip_last_hour: req.riskContext.votesFromSameIpLastHour || 0,
    };

    const mlResult = await scoreVotingRisk(featurePayload);

    let voteStatus = "accepted";
    if (mlResult.risk_level === "medium") voteStatus = "challenged";
    if (mlResult.risk_level === "high") voteStatus = "flagged";

    const vote = await Vote.create({
      electionId,
      candidateId,
      voterId,
      riskScore: mlResult.risk_score,
      riskLevel: mlResult.risk_level,
      voteStatus,
      ipHash: req.riskContext.ipHash,
      deviceHash: req.riskContext.deviceHash,
      userAgent: req.headers["user-agent"],
    });

    await RiskEvent.create({
      voterId,
      electionId,
      eventType: "vote_submit",
      ipHash: req.riskContext.ipHash,
      deviceHash: req.riskContext.deviceHash,
      userAgent: req.headers["user-agent"],
      geoRegion: req.riskContext.geoRegion,
      failedLoginsLast24h: req.riskContext.failedLoginsLast24h || 0,
      accountAgeMinutes: req.riskContext.accountAgeMinutes || 0,
      timeToVoteAfterLoginSeconds:
        req.riskContext.timeToVoteAfterLoginSeconds || 0,
      ipUsedByMultipleAccounts:
        req.riskContext.ipUsedByMultipleAccounts || false,
      isNewDevice: req.riskContext.isNewDevice || false,
      riskScore: mlResult.risk_score,
      riskLevel: mlResult.risk_level,
      flags: mlResult.flags,
    });

    await AuditLog.create({
      actorId: voterId,
      action: "CAST_VOTE",
      entityType: "Vote",
      entityId: vote._id.toString(),
      metadata: {
        electionId,
        candidateId,
        riskLevel: mlResult.risk_level,
        riskScore: mlResult.risk_score,
        flags: mlResult.flags,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Vote processed successfully",
      voteStatus,
      mlResult,
      vote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to cast vote",
      error: error.message,
    });
  }
};


