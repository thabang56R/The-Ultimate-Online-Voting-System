import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { getSuspiciousVotes, reviewVote } from "../api/adminApi";
import AdminLayout from "../components/layout/AdminLayout";
import AdminHeader from "../components/layout/AdminHeader";
import SuspiciousVotesTable from "../components/dashboard/SuspiciousVotesTable";

export default function ReviewQueuePage() {
  const [votes, setVotes] = useState([]);
  const [decisionFilter, setDecisionFilter] = useState("all");
  const [reviewingId, setReviewingId] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadVotes = async (silent = false) => {
    try {
      setError("");
      if (silent) setRefreshing(true);
      else setLoading(true);

      const res = await getSuspiciousVotes();
      setVotes(res.votes || []);
    } catch (err) {
      setError(err.message || "Failed to load suspicious votes");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVotes();
  }, []);

  const handleReview = async (voteId, decision) => {
    try {
      setReviewingId(voteId);

      await reviewVote(
        voteId,
        decision,
        decision === "approved"
          ? "Cleared by admin after review."
          : "Rejected by admin after suspicious activity review."
      );

      await loadVotes(true);
    } catch (err) {
      setError(err.message || "Failed to review vote");
    } finally {
      setReviewingId("");
    }
  };

  const filteredVotes = useMemo(() => {
    if (decisionFilter === "all") return votes;
    return votes.filter((vote) => vote.voteStatus === decisionFilter);
  }, [votes, decisionFilter]);

  return (
    <AdminLayout>
      <AdminHeader
        title="Review Queue"
        subtitle="Review challenged and flagged vote submissions that require human verification."
      />

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => loadVotes(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh Queue
        </button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
          Loading suspicious votes...
        </div>
      ) : (
        <>
          <SuspiciousVotesTable
            votes={filteredVotes}
            decisionFilter={decisionFilter}
            setDecisionFilter={setDecisionFilter}
            reviewingId={reviewingId}
            onReviewVote={handleReview}
          />

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3">
                <AlertTriangle className="h-5 w-5 text-slate-700" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Review Guidance</h2>
                <p className="text-sm text-slate-500">
                  Use this queue to decide whether suspicious votes should be accepted or rejected.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">Challenged Votes</h3>
                <p className="mt-2 text-sm text-slate-600">
                  These are medium-risk votes. They may be valid after a quick review.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">Flagged Votes</h3>
                <p className="mt-2 text-sm text-slate-600">
                  These are high-risk votes. Review them first and document your decision clearly.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-900">Audit Trail</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Every approval or rejection should align with your audit logs and election rules.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}