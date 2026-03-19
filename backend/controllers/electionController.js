// backend/controllers/electionController.js
import Election from "../models/Election.js";

export const createElection = async (req, res) => {
  try {
    const { title, description, startDate, endDate, status } = req.body;

    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Title, startDate and endDate are required",
      });
    }

    const election = await Election.create({
      title,
      description,
      startDate,
      endDate,
      status: status || "draft",
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Election created successfully",
      election,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create election",
      error: error.message,
    });
  }
};

export const getAllElections = async (req, res) => {
  try {
    const elections = await Election.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      elections,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch elections",
      error: error.message,
    });
  }
};

export const getElectionById = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    return res.status(200).json({
      success: true,
      election,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch election",
      error: error.message,
    });
  }
};

export const updateElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    const { title, description, startDate, endDate, status } = req.body;

    election.title = title || election.title;
    election.description = description ?? election.description;
    election.startDate = startDate || election.startDate;
    election.endDate = endDate || election.endDate;
    election.status = status || election.status;

    await election.save();

    return res.status(200).json({
      success: true,
      message: "Election updated successfully",
      election,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update election",
      error: error.message,
    });
  }
};

export const deleteElection = async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({
        success: false,
        message: "Election not found",
      });
    }

    await election.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Election deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete election",
      error: error.message,
    });
  }
};
