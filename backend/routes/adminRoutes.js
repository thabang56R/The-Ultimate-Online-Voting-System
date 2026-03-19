import express from "express";
import {
  getDashboardStats,
  getVotesByStatus,
  getSuspiciousVotes,
  getRiskEvents,
  reviewVote,
} from "../controllers/adminController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/stats",
  protect,
  authorizeRoles("admin", "election_officer"),
  getDashboardStats
);

router.get(
  "/votes/suspicious",
  protect,
  authorizeRoles("admin", "election_officer"),
  getSuspiciousVotes
);

router.get(
  "/votes/status/:status",
  protect,
  authorizeRoles("admin", "election_officer"),
  getVotesByStatus
);

router.get(
  "/risk-events",
  protect,
  authorizeRoles("admin", "election_officer"),
  getRiskEvents
);

router.patch(
  "/votes/:id/review",
  protect,
  authorizeRoles("admin", "election_officer"),
  reviewVote
);

export default router;