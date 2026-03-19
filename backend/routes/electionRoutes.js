// backend/routes/electionRoutes.js
import express from "express";
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
} from "../controllers/electionController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllElections);
router.get("/:id", getElectionById);

router.post("/", protect, authorizeRoles("admin", "election_officer"), createElection);
router.put("/:id", protect, authorizeRoles("admin", "election_officer"), updateElection);
router.delete("/:id", protect, authorizeRoles("admin"), deleteElection);

export default router;