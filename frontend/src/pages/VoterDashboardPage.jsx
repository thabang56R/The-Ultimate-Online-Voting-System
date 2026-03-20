import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, getElections } from "../api/adminApi";
import PublicLayout from "../components/voter/PublicLayout";
import StatusBadge from "../components/dashboard/StatusBadge";
import { Vote, ShieldCheck } from "lucide-react";

export default function VoterDashboardPage() {
  const [user, setUser] = useState(null);
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [userRes, electionsRes] = await Promise.all([
          getCurrentUser(),
          getElections(),
        ]);

        setUser(userRes.data || userRes.user || userRes);
        setElections(
          (electionsRes.elections || []).filter(
            (item) => item.status === "active"
          )
        );
      } catch (err) {
        setError(err.message || "Failed to load voter dashboard");
      }
    };

    load();
  }, []);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-[2rem] bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 p-8 text-white shadow-xl">
          <p className="text-sm text-indigo-100">Welcome back</p>
          <h1 className="mt-2 text-4xl font-bold">
            {user?.fullName || "Voter"}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-indigo-100">
            Review active elections, cast your vote securely, and participate in
            a modern voting experience.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Vote className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Active Elections
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              {elections.length} active election{elections.length === 1 ? "" : "s"} available.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Secure Access
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Your vote flow is protected with fraud checks and review-ready safeguards.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">Active Elections</h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {elections.map((election) => (
              <div
                key={election._id}
                className="rounded-3xl border border-slate-200 p-5 transition hover:shadow-md"
              >
                <div className="mb-3">
                  <StatusBadge status={election.status} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {election.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {election.description || "No description available."}
                </p>

                <Link
                  to={`/elections/${election._id}`}
                  className="mt-5 inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
                >
                  Open Election
                </Link>
              </div>
            ))}

            {elections.length === 0 ? (
              <p className="text-sm text-slate-500">
                No active elections available.
              </p>
            ) : null}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}