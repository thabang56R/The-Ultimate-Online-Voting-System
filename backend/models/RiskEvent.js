import mongoose from "mongoose";

const riskEventSchema = new mongoose.Schema(
  {
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
    },
    eventType: {
      type: String,
      enum: ["login", "vote_attempt", "vote_submit"],
      required: true,
    },
    ipHash: String,
    deviceHash: String,
    userAgent: String,
    geoRegion: String,
    failedLoginsLast24h: {
      type: Number,
      default: 0,
    },
    accountAgeMinutes: {
      type: Number,
      default: 0,
    },
    timeToVoteAfterLoginSeconds: {
      type: Number,
      default: 0,
    },
    ipUsedByMultipleAccounts: {
      type: Boolean,
      default: false,
    },
    isNewDevice: {
      type: Boolean,
      default: false,
    },
    riskScore: {
      type: Number,
      default: 0,
    },
    riskLevel: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    flags: [String],
  },
  { timestamps: true }
);

const RiskEvent =
  mongoose.models.RiskEvent || mongoose.model("RiskEvent", riskEventSchema);

export default RiskEvent;