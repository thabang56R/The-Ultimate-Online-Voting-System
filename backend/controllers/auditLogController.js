// backend/controllers/auditLogController.js
import AuditLog from "../models/AuditLog.js";

export const getAuditLogs = async (req, res) => {
  try {
    const { action, entityType, limit } = req.query;

    const query = {};

    if (action) {
      query.action = action;
    }

    if (entityType) {
      query.entityType = entityType;
    }

    const parsedLimit = Number(limit) || 50;

    const logs = await AuditLog.find(query)
      .populate("actorId", "fullName email role")
      .sort({ createdAt: -1 })
      .limit(parsedLimit);

    return res.status(200).json({
      success: true,
      count: logs.length,
      logs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch audit logs",
      error: error.message,
    });
  }
};