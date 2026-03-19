import Vote from "../models/Vote.js";
import RiskEvent from "../models/RiskEvent.js";
import AuditLog from "../models/AuditLog.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalVotes,
      acceptedVotes,
      challengedVotes,
      flaggedVotes,
      approvedVotes,
      rejectedVotes,
      totalRiskEvents,
      highRiskEvents,
    ] = await Promise.all([
      Vote.countDocuments(),
      Vote.countDocuments({ voteStatus: "accepted" }),
      Vote.countDocuments({ voteStatus: "challenged" }),
      Vote.countDocuments({ voteStatus: "flagged" }),
      Vote.countDocuments({ voteStatus: "approved" }),
      Vote.countDocuments({ voteStatus: "rejected" }),
      RiskEvent.countDocuments(),
      RiskEvent.countDocuments({ riskLevel: "high" }),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totalVotes,
        acceptedVotes,
        challengedVotes,
        flaggedVotes,
        approvedVotes,
        rejectedVotes,
        totalRiskEvents,
        highRiskEvents,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });
  }
};

export const getVotesByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const votes = await Vote.find({ voteStatus: status })
      .populate("voterId", "fullName email")
      .populate("candidateId", "fullName")
      .populate("electionId", "title status")
      .populate("reviewedBy", "fullName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: votes.length,
      votes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch votes by status",
      error: error.message,
    });
  }
};

export const getSuspiciousVotes = async (req, res) => {
  try {
    const votes = await Vote.find({
      voteStatus: { $in: ["challenged", "flagged"] },
    })
      .populate("voterId", "fullName email")
      .populate("candidateId", "fullName")
      .populate("electionId", "title status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: votes.length,
      votes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch suspicious votes",
      error: error.message,
    });
  }
};

export const getRiskEvents = async (req, res) => {
  try {
    const riskEvents = await RiskEvent.find()
      .populate("voterId", "fullName email")
      .populate("electionId", "title status")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: riskEvents.length,
      riskEvents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch risk events",
      error: error.message,
    });
  }
};

export const reviewVote = async (req, res) => {
  try {
    const { id } = req.params;
    const { decision, reviewNotes } = req.body;

    if (!["approved", "rejected"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be either approved or rejected",
      });
    }

    const vote = await Vote.findById(id);
    if (!vote) {
      return res.status(404).json({
        success: false,
        message: "Vote not found",
      });
    }

    if (!["challenged", "flagged"].includes(vote.voteStatus)) {
      return res.status(400).json({
        success: false,
        message: "Only challenged or flagged votes can be reviewed",
      });
    }

    vote.voteStatus = decision;
    vote.reviewNotes = reviewNotes || "";
    vote.reviewedBy = req.user._id;
    vote.reviewedAt = new Date();

    await vote.save();

    await AuditLog.create({
      actorId: req.user._id,
      action: "REVIEW_VOTE",
      entityType: "Vote",
      entityId: vote._id.toString(),
      metadata: {
        decision,
        reviewNotes: reviewNotes || "",
      },
    });

    return res.status(200).json({
      success: true,
      message: `Vote ${decision} successfully`,
      vote,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to review vote",
      error: error.message,
    });
  }
};