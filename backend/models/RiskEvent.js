import mongoose from "mongoose";

const riskEventSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    voteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vote",
      required: true,
    },
    eventType: {
      type: String,
      default: "vote_risk_detected",
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },
    riskScore: {
      type: Number,
      default: 0,
    },
    flags: {
      type: [String],
      default: [],
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

export default mongoose.model("RiskEvent", riskEventSchema);