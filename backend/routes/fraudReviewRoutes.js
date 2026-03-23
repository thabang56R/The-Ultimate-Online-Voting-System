import express from "express";
import {
  getFraudReviews,
  getFraudReviewStats,
  updateFraudReviewStatus,
} from "../controllers/fraudReviewController.js";


import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getFraudReviews);
router.get("/stats", protect, adminOnly, getFraudReviewStats);
router.put("/:id/status", protect, adminOnly, updateFraudReviewStatus);

export default router;