import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthConfig() {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  };
}

export async function fetchFraudReviews(params = {}) {
  const query = new URLSearchParams();

  if (params.riskLevel) query.append("riskLevel", params.riskLevel);
  if (params.reviewStatus) query.append("reviewStatus", params.reviewStatus);
  if (params.electionId) query.append("electionId", params.electionId);

  const url = `${API_BASE_URL}/fraud-reviews${
    query.toString() ? `?${query.toString()}` : ""
  }`;

  const response = await axios.get(url, getAuthConfig());
  return response.data;
}

export async function fetchFraudReviewStats() {
  const response = await axios.get(
    `${API_BASE_URL}/fraud-reviews/stats`,
    getAuthConfig()
  );
  return response.data;
}

export async function updateFraudReviewStatus(
  reviewId,
  reviewStatus,
  adminDecisionNote = ""
) {
  const response = await axios.put(
    `${API_BASE_URL}/fraud-reviews/${reviewId}/status`,
    {
      reviewStatus,
      adminDecisionNote,
    },
    getAuthConfig()
  );

  return response.data;
}