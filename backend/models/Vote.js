import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    voterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    voteStatus: {
      type: String,
      enum: ["accepted", "challenged", "flagged", "approved", "rejected"],
      default: "accepted",
    },
    reviewNotes: {
      type: String,
      default: "",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    ipHash: String,
    deviceHash: String,
    userAgent: String,
  },
  { timestamps: true }
);

voteSchema.index({ electionId: 1, voterId: 1 }, { unique: true });

const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);

export default Vote;
