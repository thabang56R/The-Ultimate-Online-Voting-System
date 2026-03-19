// backend/controllers/resultController.js
import mongoose from "mongoose";
import Election from "../models/Election.js";
import Candidate from "../models/Candidate.js";
import Vote from "../models/Vote.js";

export const getElectionResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(electionId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid election id",
      });
    }

    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    const candidates = await Candidate.find({ electionId }).sort({ createdAt: 1 });

    const voteCounts = await Vote.aggregate([
      {
        $match: {
          electionId: new mongoose.Types.ObjectId(electionId),
          voteStatus: { $in: ["accepted", "approved"] },
        },
      },
      {
        $group: {
          _id: "$candidateId",
          totalVotes: { $sum: 1 },
        },
      },
    ]);

    const voteCountMap = new Map(
      voteCounts.map((item) => [item._id.toString(), item.totalVotes])
    );

    const results = candidates.map((candidate) => ({
      candidateId: candidate._id,
      fullName: candidate.fullName,
      manifesto: candidate.manifesto,
      imageUrl: candidate.imageUrl,
      totalVotes: voteCountMap.get(candidate._id.toString()) || 0,
    }));

    const totalValidVotes = results.reduce(
      (sum, candidate) => sum + candidate.totalVotes,
      0
    );

    const sortedResults = [...results].sort((a, b) => b.totalVotes - a.totalVotes);

    const topCandidate = sortedResults[0] || null;
    const secondCandidate = sortedResults[1] || null;

    const isTie =
      topCandidate &&
      secondCandidate &&
      topCandidate.totalVotes === secondCandidate.totalVotes;

    return res.status(200).json({
      success: true,
      election: {
        _id: election._id,
        title: election.title,
        description: election.description,
        status: election.status,
        startDate: election.startDate,
        endDate: election.endDate,
      },
      totalValidVotes,
      countedStatuses: ["accepted", "approved"],
      winner: topCandidate
        ? {
            candidateId: topCandidate.candidateId,
            fullName: topCandidate.fullName,
            totalVotes: topCandidate.totalVotes,
            isTie: Boolean(isTie),
          }
        : null,
      results: sortedResults,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch election results",
      error: error.message,
    });
  }
};