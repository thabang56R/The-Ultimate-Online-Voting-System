import FraudReview from "../models/FraudReview.js";

export const getFraudReviews = async (req, res) => {
  try {
    const { riskLevel, reviewStatus, electionId } = req.query;

    const query = {};

    if (riskLevel) query.riskLevel = riskLevel;
    if (reviewStatus) query.reviewStatus = reviewStatus;
    if (electionId) query.electionId = electionId;

    const reviews = await FraudReview.find(query)
      .populate("voteId", "candidate election voter createdAt")
      .populate("voterId", "name email")
      .populate("electionId", "title")
      .populate("adminDecisionBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fraud reviews",
      error: error.message,
    });
  }
};

export const getFraudReviewStats = async (req, res) => {
  try {
    const stats = await FraudReview.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          low: {
            $sum: { $cond: [{ $eq: ["$riskLevel", "low"] }, 1, 0] },
          },
          medium: {
            $sum: { $cond: [{ $eq: ["$riskLevel", "medium"] }, 1, 0] },
          },
          high: {
            $sum: { $cond: [{ $eq: ["$riskLevel", "high"] }, 1, 0] },
          },
          pending_review: {
            $sum: {
              $cond: [{ $eq: ["$reviewStatus", "pending_review"] }, 1, 0],
            },
          },
          confirmed_fraud: {
            $sum: {
              $cond: [{ $eq: ["$reviewStatus", "confirmed_fraud"] }, 1, 0],
            },
          },
          false_positive: {
            $sum: {
              $cond: [{ $eq: ["$reviewStatus", "false_positive"] }, 1, 0],
            },
          },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: stats[0] || {
        total: 0,
        low: 0,
        medium: 0,
        high: 0,
        pending_review: 0,
        confirmed_fraud: 0,
        false_positive: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch fraud review stats",
      error: error.message,
    });
  }
};

export const updateFraudReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { reviewStatus, adminDecisionNote } = req.body;

    const allowedStatuses = [
      "pending_review",
      "approved",
      "blocked",
      "confirmed_fraud",
      "false_positive",
    ];

    if (!allowedStatuses.includes(reviewStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid reviewStatus value",
      });
    }

    const review = await FraudReview.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Fraud review not found",
      });
    }

    review.reviewStatus = reviewStatus;
    review.adminDecisionNote = adminDecisionNote || "";
    review.adminDecisionAt = new Date();
    review.adminDecisionBy = req.user?._id || null;

    await review.save();

    res.status(200).json({
      success: true,
      message: "Fraud review updated successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update fraud review",
      error: error.message,
    });
  }
};