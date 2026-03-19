// backend/controllers/testMlController.js
import { scoreVotingRisk } from "../services/riskScoringService.js";

export const testMl = async (req, res) => {
  try {
    const samplePayload = {
      failed_logins_last_24h: 6,
      account_age_minutes: 10,
      time_to_vote_after_login_seconds: 5,
      ip_used_by_multiple_accounts: 1,
      is_new_device: 1,
      session_actions_count: 3,
      votes_from_same_ip_last_hour: 4
    };

    const result = await scoreVotingRisk(samplePayload);

    return res.status(200).json({
      success: true,
      message: "ML service connected successfully",
      result
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to connect to ML service",
      error: error.message
    });
  }
};