
import React, { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createCandidate, deleteCandidate, getCandidatesByElection, getElections } from "../api/adminApi";
import AdminLayout from "../components/layout/AdminLayout";
import AdminHeader from "../components/layout/AdminHeader";

export default function CandidatesPage() {
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [form, setForm] = useState({ fullName: "", manifesto: "", imageUrl: "" });
  const [error, setError] = useState("");

  const loadElections = async () => {
    try {
      const res = await getElections();
      const list = res.elections || [];
      setElections(list);
      if (list.length && !selectedElection) setSelectedElection(list[0]._id);
    } catch (err) {
      setError(err.message || "Failed to load elections");
    }
  };

  const loadCandidates = async (electionId) => {
    if (!electionId) return;
    try {
      const res = await getCandidatesByElection(electionId);
      setCandidates(res.candidates || []);
    } catch (err) {
      setError(err.message || "Failed to load candidates");
    }
  };

  useEffect(() => { loadElections(); }, []);
  useEffect(() => { loadCandidates(selectedElection); }, [selectedElection]);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCandidate({ electionId: selectedElection, ...form });
      setForm({ fullName: "", manifesto: "", imageUrl: "" });
      await loadCandidates(selectedElection);
    } catch (err) {
      setError(err.message || "Failed to create candidate");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCandidate(id);
      await loadCandidates(selectedElection);
    } catch (err) {
      setError(err.message || "Failed to delete candidate");
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Candidate Management" subtitle="Manage candidate entries by election and keep each ballot accurate." />
      {error ? <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2 text-slate-900"><Plus className="h-5 w-5" /><h2 className="text-lg font-bold">Add Candidate</h2></div>
          <form onSubmit={handleCreate} className="space-y-4">
            <select value={selectedElection} onChange={(e) => setSelectedElection(e.target.value)} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
              {elections.map((election) => <option key={election._id} value={election._id}>{election.title}</option>)}
            </select>
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Candidate full name" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea name="manifesto" value={form.manifesto} onChange={handleChange} placeholder="Manifesto" rows={4} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input name="imageUrl" value={form.imageUrl} onChange={handleChange} placeholder="Image URL" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">Add Candidate</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Candidates</h2>
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div key={candidate._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{candidate.fullName}</h3>
                  <p className="mt-1 text-sm text-slate-500">{candidate.manifesto || "No manifesto"}</p>
                </div>
                <button onClick={() => handleDelete(candidate._id)} className="rounded-xl bg-rose-100 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            {candidates.length === 0 ? <p className="text-sm text-slate-500">No candidates yet for this election.</p> : null}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}