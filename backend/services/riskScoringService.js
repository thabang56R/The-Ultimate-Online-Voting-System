// backend/services/riskScoringService.js
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const scoreVotingRisk = async (payload) => {
  const response = await axios.post(
    `${process.env.ML_SERVICE_URL}/predict-risk`,
    payload
  );
  return response.data;
};