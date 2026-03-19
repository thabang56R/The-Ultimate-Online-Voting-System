
import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ShieldAlert,
  ShieldCheck,
  Vote,
  XCircle,
  RefreshCw,
} from "lucide-react";
import {
  getDashboardStats,
  getSuspiciousVotes,
  getRiskEvents,
  reviewVote as reviewVoteRequest,
} from "../api/adminApi";
import AdminLayout from "../components/layout/AdminLayout";
import AdminHeader from "../components/layout/AdminHeader";
import StatCard from "../components/dashboard/StatCard";
import LoadingBlock from "../components/dashboard/LoadingBlock";
import SuspiciousVotesTable from "../components/dashboard/SuspiciousVotesTable";
import RiskEventsList from "../components/dashboard/RiskEventsList";
import VoteStatusBarChart from "../components/dashboard/charts/VoteStatusBarChart";
import RiskLevelPieChart from "../components/dashboard/charts/RiskLevelPieChart";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [suspiciousVotes, setSuspiciousVotes] = useState([]);
  const [riskEvents, setRiskEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [reviewingId, setReviewingId] = useState("");
  const [decisionFilter, setDecisionFilter] = useState("all");

  const fetchDashboardData = async (silent = false) => {
    try {
      setError("");
      if (silent) setRefreshing(true);
      else setLoading(true);

      const [statsRes, suspiciousRes, riskEventsRes] = await Promise.all([
        getDashboardStats(),
        getSuspiciousVotes(),
        getRiskEvents(),
      ]);

      setStats(statsRes.stats || null);
      setSuspiciousVotes(suspiciousRes.votes || []);
      setRiskEvents(riskEventsRes.riskEvents || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleReviewVote = async (voteId, decision) => {
    try {
      setReviewingId(voteId);
      await reviewVoteRequest(
        voteId,
        decision,
        decision === "approved"
          ? "Reviewed by admin and marked safe."
          : "Reviewed by admin and rejected due to suspicious activity."
      );
      await fetchDashboardData(true);
    } catch (err) {
      setError(err.message || "Failed to review vote");
    } finally {
      setReviewingId("");
    }
  };

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      { title: "Total Votes", value: stats.totalVotes ?? 0, subtitle: "All recorded vote submissions", icon: Vote },
      { title: "Accepted Votes", value: stats.acceptedVotes ?? 0, subtitle: "Low-risk votes processed normally", icon: CheckCircle2 },
      { title: "Challenged Votes", value: stats.challengedVotes ?? 0, subtitle: "Need manual verification or follow-up", icon: Clock3 },
      { title: "Flagged Votes", value: stats.flaggedVotes ?? 0, subtitle: "High-risk votes requiring review", icon: ShieldAlert },
      { title: "Approved Votes", value: stats.approvedVotes ?? 0, subtitle: "Suspicious votes later cleared", icon: ShieldCheck },
      { title: "Rejected Votes", value: stats.rejectedVotes ?? 0, subtitle: "Votes rejected after admin review", icon: XCircle },
    ];
  }, [stats]);

  const voteStatusChartData = useMemo(() => {
    if (!stats) return [];
    return [
      { name: "Accepted", value: stats.acceptedVotes ?? 0 },
      { name: "Challenged", value: stats.challengedVotes ?? 0 },
      { name: "Flagged", value: stats.flaggedVotes ?? 0 },
      { name: "Approved", value: stats.approvedVotes ?? 0 },
      { name: "Rejected", value: stats.rejectedVotes ?? 0 },
    ];
  }, [stats]);

  const riskLevelChartData = useMemo(() => {
    const counts = { low: 0, medium: 0, high: 0 };
    riskEvents.forEach((event) => {
      if (event.riskLevel && counts[event.riskLevel] !== undefined) counts[event.riskLevel] += 1;
    });
    return [
      { name: "Low", value: counts.low },
      { name: "Medium", value: counts.medium },
      { name: "High", value: counts.high },
    ];
  }, [riskEvents]);

  const filteredVotes = useMemo(() => {
    if (decisionFilter === "all") return suspiciousVotes;
    return suspiciousVotes.filter((vote) => vote.voteStatus === decisionFilter);
  }, [decisionFilter, suspiciousVotes]);

  return (
    <AdminLayout>
      <AdminHeader
        title="Election Security Dashboard"
        subtitle="Monitor suspicious voting patterns, review flagged submissions, and track system-wide election integrity."
      />

      {error ? <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <div className="mb-6 flex justify-end">
        <button
          onClick={() => fetchDashboardData(true)}
          className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Refresh Data
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          <LoadingBlock label="Loading dashboard metrics..." />
          <LoadingBlock label="Loading suspicious votes and risk events..." />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => <StatCard key={card.title} {...card} />)}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-3">
              <h2 className="text-lg font-bold text-slate-900">Vote Decision Overview</h2>
              <p className="mb-4 text-sm text-slate-500">Operational distribution of reviewed and unreviewed votes.</p>
              <VoteStatusBarChart data={voteStatusChartData} />
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
              <h2 className="text-lg font-bold text-slate-900">Risk Level Mix</h2>
              <p className="mb-4 text-sm text-slate-500">Distribution of ML-generated risk events.</p>
              <RiskLevelPieChart data={riskLevelChartData} />
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <SuspiciousVotesTable
              votes={filteredVotes}
              decisionFilter={decisionFilter}
              setDecisionFilter={setDecisionFilter}
              reviewingId={reviewingId}
              onReviewVote={handleReviewVote}
            />
            <RiskEventsList riskEvents={riskEvents} />
          </div>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3"><AlertTriangle className="h-5 w-5 text-slate-700" /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Operational Notes</h2>
                <p className="text-sm text-slate-500">Helpful reminders for secure vote review.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">Challenge vs Flag</h3><p className="mt-2 text-sm text-slate-600">Challenged votes indicate moderate risk and may be safe after review. Flagged votes represent high-risk submissions and should be checked first.</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">Audit Awareness</h3><p className="mt-2 text-sm text-slate-600">Every approval or rejection should remain consistent with your audit log and election governance rules.</p></div>
              <div className="rounded-2xl bg-slate-50 p-4"><h3 className="font-semibold text-slate-900">Next UI Upgrade</h3><p className="mt-2 text-sm text-slate-600">Add election filters, export tools, and deeper risk trend pages to strengthen the enterprise feel.</p></div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

