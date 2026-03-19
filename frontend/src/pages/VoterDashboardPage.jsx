import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, getElections } from "../api/adminApi";
import PublicLayout from "../components/voter/PublicLayout";
import StatusBadge from "../components/dashboard/StatusBadge";

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
        <div className="mb-8 rounded-[2rem] bg-slate-900 p-8 text-white shadow-xl">
          <p className="text-sm text-slate-300">Welcome back</p>
          <h1 className="mt-2 text-4xl font-bold">
            {user?.fullName || "Voter"}
          </h1>
          <p className="mt-3 text-sm text-slate-300">
            Review active elections and participate securely.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            Active Elections
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {elections.map((election) => (
              <div
                key={election._id}
                className="rounded-3xl border border-slate-200 p-5"
              >
                <div className="mb-3">
                  <StatusBadge status={election.status} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {election.title}
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {election.description || "No description available."}
                </p>

                <Link
                  to={`/elections/${election._id}`}
                  className="mt-5 inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
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