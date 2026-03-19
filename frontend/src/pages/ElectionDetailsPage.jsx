import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import {
  apiRequest,
  getCandidatesByElection,
  getElections,
} from "../api/adminApi";
import PublicLayout from "../components/voter/PublicLayout";
import StatusBadge from "../components/dashboard/StatusBadge";

export default function ElectionDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [election, setElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const electionsRes = await getElections();
        const current = (electionsRes.elections || []).find(
          (item) => item._id === id
        );
        setElection(current || null);

        const candidatesRes = await getCandidatesByElection(id);
        setCandidates(candidatesRes.candidates || []);
      } catch (err) {
        setError(err.message || "Failed to load election details");
      }
    };

    load();
  }, [id]);

  const handleVote = async () => {
    try {
      setSubmitting(true);
      setError("");
      setMessage("");

      const res = await apiRequest("/votes/cast", {
        method: "POST",
        body: JSON.stringify({
          electionId: id,
          candidateId: selectedCandidate,
        }),
      });

      setMessage(res.message || "Vote submitted successfully.");
      navigate("/voter/dashboard");
    } catch (err) {
      setError(err.message || "Failed to cast vote");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PublicLayout>
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {election ? (
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-4">
                  <StatusBadge status={election.status} />
                </div>

                <h1 className="text-4xl font-bold text-slate-900">
                  {election.title}
                </h1>

                <p className="mt-3 max-w-3xl text-slate-600">
                  {election.description || "No description available."}
                </p>
              </div>

              <div className="rounded-3xl bg-slate-50 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Election Security
                </p>

                <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                  <ShieldCheck className="h-4 w-4" />
                  ML-backed fraud review enabled
                </div>
              </div>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {candidates.map((candidate) => {
                const active = selectedCandidate === candidate._id;

                return (
                  <button
                    key={candidate._id}
                    onClick={() => setSelectedCandidate(candidate._id)}
                    className={`rounded-3xl border p-6 text-left shadow-sm transition ${
                      active
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-900"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold">{candidate.fullName}</h2>
                      {active ? <CheckCircle2 className="h-5 w-5" /> : null}
                    </div>

                    <p
                      className={`mt-3 text-sm ${
                        active ? "text-slate-200" : "text-slate-600"
                      }`}
                    >
                      {candidate.manifesto || "No manifesto available."}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="mt-8">
              <button
                disabled={
                  !selectedCandidate || submitting || election.status !== "active"
                }
                onClick={handleVote}
                className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white disabled:opacity-50"
              >
                {submitting ? "Submitting vote..." : "Cast Vote"}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-500 shadow-sm">
            Election not found.
          </div>
        )}
      </section>
    </PublicLayout>
  );
}