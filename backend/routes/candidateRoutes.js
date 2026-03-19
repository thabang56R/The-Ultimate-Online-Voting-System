// backend/routes/candidateRoutes.js
import express from "express";
import {
  createCandidate,
  getCandidatesByElection,
  getCandidateById,
  updateCandidate,
  deleteCandidate,
} from "../controllers/candidateController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/election/:electionId", getCandidatesByElection);
router.get("/:id", getCandidateById);

router.post("/", protect, authorizeRoles("admin", "election_officer"), createCandidate);
router.put("/:id", protect, authorizeRoles("admin", "election_officer"), updateCandidate);
router.delete("/:id", protect, authorizeRoles("admin"), deleteCandidate);

export default router;