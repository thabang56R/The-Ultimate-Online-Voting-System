export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function loginAdmin(email, password) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser() {
  return apiRequest("/auth/me");
}

export async function getDashboardStats() {
  return apiRequest("/admin/stats");
}

export async function getSuspiciousVotes() {
  return apiRequest("/admin/votes/suspicious");
}

export async function getVotesByStatus(status) {
  return apiRequest(`/admin/votes/status/${status}`);
}

export async function getRiskEvents() {
  return apiRequest("/admin/risk-events");
}

export async function reviewVote(voteId, decision, reviewNotes) {
  return apiRequest(`/admin/votes/${voteId}/review`, {
    method: "PATCH",
    body: JSON.stringify({ decision, reviewNotes }),
  });
}

export async function getElections() {
  return apiRequest("/elections");
}

export async function createElection(payload) {
  return apiRequest("/elections", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateElection(id, payload) {
  return apiRequest(`/elections/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteElection(id) {
  return apiRequest(`/elections/${id}`, {
    method: "DELETE",
  });
}

export async function getCandidatesByElection(electionId) {
  return apiRequest(`/candidates/election/${electionId}`);
}

export async function createCandidate(payload) {
  return apiRequest("/candidates", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCandidate(id, payload) {
  return apiRequest(`/candidates/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteCandidate(id) {
  return apiRequest(`/candidates/${id}`, {
    method: "DELETE",
  });
}

export async function getElectionResults(electionId) {
  return apiRequest(`/results/${electionId}`);
}

export async function getAuditLogs(params = {}) {
  const searchParams = new URLSearchParams();

  if (params.action) searchParams.append("action", params.action);
  if (params.entityType) searchParams.append("entityType", params.entityType);
  if (params.limit) searchParams.append("limit", params.limit);

  const queryString = searchParams.toString();
  const path = queryString
    ? `/admin/audit-logs?${queryString}`
    : "/admin/audit-logs";

  return apiRequest(path);
}