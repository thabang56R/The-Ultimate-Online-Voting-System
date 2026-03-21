import axios from "axios";

const ML_SERVICE_URL =
  process.env.ML_SERVICE_URL || "http://127.0.0.1:8002";

export async function predictVotingRisk(features) {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict-risk`,
      features,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    return response.data;
  } catch (error) {
    console.error("ML service error:", error.message);

    return {
      prediction: 0,
      risk_score: 0,
      risk_level: "low",
      flags: ["ml_service_unavailable"],
    };
  }
}