import mongoose from "mongoose";

const fraudReviewSchema = new mongoose.Schema(
  {
    voteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vote",
      required: true,
      index: true,
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
      index: true,
    },
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    modelVersion: {
      type: String,
      default: "fraud_model_unknown",
    },
    bestModelName: {
      type: String,
      default: "unknown",
    },

    rawFeatures: {
      account_age_days: { type: Number, required: true, min: 0 },
      votes_last_24h: { type: Number, required: true, min: 0 },
      ip_change_count: { type: Number, required: true, min: 0 },
      device_change_count: { type: Number, required: true, min: 0 },
      failed_login_attempts: { type: Number, required: true, min: 0 },
      is_proxy_ip: { type: Number, required: true, enum: [0, 1] },
      geo_distance_km: { type: Number, required: true, min: 0 },
      time_to_vote_seconds: { type: Number, required: true, min: 0 },
    },

    prediction: {
      type: Number,
      enum: [0, 1],
      required: true,
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
      index: true,
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      index: true,
    },

    flags: {
      type: [String],
      default: [],
    },

    topReasons: [
      {
        feature: { type: String, required: true },
        value: { type: mongoose.Schema.Types.Mixed, required: true },
        impact: {
          type: String,
          enum: ["low", "medium", "high"],
          required: true,
        },
      },
    ],

    explanation: {
      type: String,
      default: "",
    },

    reviewRecommendation: {
      type: String,
      enum: ["allow", "flag_for_review", "block_and_review"],
      default: "allow",
      index: true,
    },

    reviewStatus: {
      type: String,
      enum: [
        "pending_review",
        "approved",
        "blocked",
        "confirmed_fraud",
        "false_positive",
      ],
      default: "pending_review",
      index: true,
    },

    adminDecisionBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    adminDecisionNote: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500,
    },
    adminDecisionAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

fraudReviewSchema.index({ electionId: 1, riskLevel: 1, createdAt: -1 });
fraudReviewSchema.index({ reviewStatus: 1, createdAt: -1 });

const FraudReview = mongoose.model("FraudReview", fraudReviewSchema);

export default FraudReview;