// backend/models/Candidate.js
import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    electionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Election",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    manifesto: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Candidate", candidateSchema);