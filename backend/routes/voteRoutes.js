import express from "express";
import { castVote } from "../controllers/voteController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { buildRiskContext } from "../middlewares/riskContextMiddleware.js";

const router = express.Router();

router.post("/cast", protect, buildRiskContext, castVote);

export default router;