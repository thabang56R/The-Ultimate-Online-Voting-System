import React, { useEffect, useMemo, useState } from "react";
import { getElections, getElectionResults } from "../api/adminApi";
import PublicLayout from "../components/voter/PublicLayout";
import StatusBadge from "../components/dashboard/StatusBadge";

export default function ResultsPage() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [resultsData, setResultsData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadElections = async () => {
      try {
        const res = await getElections();
        const list = res.elections || [];
        setElections(list);

        if (list.length) {
          setSelectedElection(list[0]._id);
        }
      } catch (err) {
        setError(err.message || "Failed to load elections");
      }
    };

    loadElections();
  }, []);

  useEffect(() => {
    const loadResults = async () => {
      if (!selectedElection) return;

      try {
        const res = await getElectionResults(selectedElection);
        setResultsData(res);
      } catch (err) {
        setError(err.message || "Failed to load election results");
      }
    };

    loadResults();
  }, [selectedElection]);

  const selectedElectionRecord = useMemo(
    () => elections.find((item) => item._id === selectedElection),
    [elections, selectedElection]
  );

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Election Results</h1>
          <p className="mt-3 text-slate-600">
            View counted vote totals based on accepted and approved votes only.
          </p>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        ) : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Select election</h2>
              <p className="text-sm text-slate-500">
                Switch between elections to inspect valid vote totals.
              </p>
            </div>

            <select
              value={selectedElection}
              onChange={(e) => setSelectedElection(e.target.value)}
              className="rounded-2xl border border-slate-200 px-4 py-3"
            >
              {elections.map((election) => (
                <option key={election._id} value={election._id}>
                  {election.title}
                </option>
              ))}
            </select>
          </div>

          {selectedElectionRecord && resultsData ? (
            <div>
              <div className="mb-6 flex flex-wrap items-center gap-3">
                <StatusBadge status={selectedElectionRecord.status} />
                <h3 className="text-xl font-bold text-slate-900">
                  {resultsData.election?.title}
                </h3>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  Total Valid Votes: {resultsData.totalValidVotes}
                </span>
              </div>

              {resultsData.winner ? (
                <div className="mb-6 rounded-3xl bg-slate-900 p-6 text-white">
                  <p className="text-sm text-slate-300">Current Leader</p>
                  <h4 className="mt-2 text-2xl font-bold">
                    {resultsData.winner.fullName}
                  </h4>
                  <p className="mt-2 text-sm text-slate-300">
                    {resultsData.winner.totalVotes} valid votes
                    {resultsData.winner.isTie ? " • tied lead" : ""}
                  </p>
                </div>
              ) : null}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {(resultsData.results || []).map((candidate) => (
                  <div
                    key={candidate.candidateId}
                    className="rounded-3xl border border-slate-200 p-5"
                  >
                    <h4 className="text-lg font-bold text-slate-900">
                      {candidate.fullName}
                    </h4>
                    <p className="mt-2 text-sm text-slate-600">
                      {candidate.manifesto || "No manifesto available."}
                    </p>
                    <div className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm font-medium text-slate-700">
                      Valid Votes: {candidate.totalVotes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">Loading results...</p>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}