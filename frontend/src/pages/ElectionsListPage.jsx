import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, ArrowRight, Vote } from "lucide-react";
import { getElections } from "../api/adminApi";
import PublicLayout from "../components/voter/PublicLayout";
import StatusBadge from "../components/dashboard/StatusBadge";

export default function ElectionsListPage() {
  const [elections, setElections] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getElections();
        setElections(res.elections || []);
      } catch (err) {
        setError(err.message || "Failed to load elections");
      }
    };

    load();
  }, []);

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 rounded-[2rem] bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 px-6 py-10 text-white shadow-xl sm:px-10">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-300">
            Elections
          </p>
          <h1 className="mt-3 text-4xl font-bold">Available Elections</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Browse active, draft, and closed elections across the platform with
            a cleaner public voting experience.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {elections.map((election) => (
            <div
              key={election._id}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <StatusBadge status={election.status} />

                <div className="inline-flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  {new Date(election.startDate).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Vote className="h-5 w-5" />
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                {election.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {election.description || "No description available."}
              </p>

              <Link
                to={`/elections/${election._id}`}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                View Election
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}