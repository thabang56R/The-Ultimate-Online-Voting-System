// backend/controllers/candidateController.js
import Candidate from "../models/Candidate.js";
import Election from "../models/Election.js";

export const createCandidate = async (req, res) => {
  try {
    const { electionId, fullName, manifesto, imageUrl } = req.body;

    if (!electionId || !fullName) {
      return res.status(400).json({
        success: false,
        message: "electionId and fullName are required",
      });
    }

    const election = await Election.findById(electionId);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    const candidate = await Candidate.create({
      electionId,
      fullName,
      manifesto,
      imageUrl,
    });

    return res.status(201).json({
      success: true,
      message: "Candidate created successfully",
      candidate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create candidate",
      error: error.message,
    });
  }
};

export const getCandidatesByElection = async (req, res) => {
  try {
    const candidates = await Candidate.find({
      electionId: req.params.electionId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      candidates,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidates",
      error: error.message,
    });
  }
};

export const getCandidateById = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    return res.status(200).json({
      success: true,
      candidate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch candidate",
      error: error.message,
    });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    const { fullName, manifesto, imageUrl } = req.body;

    candidate.fullName = fullName || candidate.fullName;
    candidate.manifesto = manifesto ?? candidate.manifesto;
    candidate.imageUrl = imageUrl ?? candidate.imageUrl;

    await candidate.save();

    return res.status(200).json({
      success: true,
      message: "Candidate updated successfully",
      candidate,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update candidate",
      error: error.message,
    });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    const candidate = await Candidate.findById(req.params.id);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    await candidate.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Candidate deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete candidate",
      error: error.message,
    });
  }
};