import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
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
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    voteStatus: {
      type: String,
      enum: ["accepted", "challenged", "flagged", "approved", "rejected"],
      default: "accepted",
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

voteSchema.index({ voterId: 1, electionId: 1 }, { unique: true });

export default mongoose.model("Vote", voteSchema);
