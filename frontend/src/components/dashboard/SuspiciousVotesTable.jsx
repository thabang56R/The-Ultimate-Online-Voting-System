
import React from "react";
import RiskBadge from "./RiskBadge";
import StatusBadge from "./StatusBadge";

export default function SuspiciousVotesTable({
  votes,
  decisionFilter,
  setDecisionFilter,
  reviewingId,
  onReviewVote,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Suspicious Vote Review Queue</h2>
          <p className="text-sm text-slate-500">Manually clear or reject challenged and flagged votes.</p>
        </div>

        <select
          value={decisionFilter}
          onChange={(e) => setDecisionFilter(e.target.value)}
          className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
        >
          <option value="all">All suspicious votes</option>
          <option value="challenged">Challenged only</option>
          <option value="flagged">Flagged only</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Voter</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Election</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Candidate</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Risk</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {votes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No suspicious votes found.
                  </td>
                </tr>
              ) : (
                votes.map((vote) => (
                  <tr key={vote._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4 align-top">
                      <div className="font-medium text-slate-900">{vote.voterId?.fullName || "Unknown voter"}</div>
                      <div className="text-xs text-slate-500">{vote.voterId?.email || "No email"}</div>
                    </td>
                    <td className="px-4 py-4 align-top">{vote.electionId?.title || "Unknown election"}</td>
                    <td className="px-4 py-4 align-top">{vote.candidateId?.fullName || "Unknown candidate"}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        <RiskBadge level={vote.riskLevel} />
                        <span className="text-xs text-slate-500">Score: {vote.riskScore ?? 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <StatusBadge status={vote.voteStatus} />
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={reviewingId === vote._id}
                          onClick={() => onReviewVote(vote._id, "approved")}
                          className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          Approve
                        </button>
                        <button
                          disabled={reviewingId === vote._id}
                          onClick={() => onReviewVote(vote._id, "rejected")}
                          className="rounded-xl bg-rose-600 px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


