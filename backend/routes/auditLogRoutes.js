
import express from "express";
import { getAuditLogs } from "../controllers/auditLogController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  authorizeRoles("admin", "election_officer"),
  getAuditLogs
);

export default router;