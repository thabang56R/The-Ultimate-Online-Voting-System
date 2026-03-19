
import React, { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { createElection, deleteElection, getElections } from "../api/adminApi";
import AdminLayout from "../components/layout/AdminLayout";
import AdminHeader from "../components/layout/AdminHeader";
import StatusBadge from "../components/dashboard/StatusBadge";

export default function ElectionsPage() {
  const [elections, setElections] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", startDate: "", endDate: "", status: "draft" });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadElections = async () => {
    try {
      setLoading(true);
      const res = await getElections();
      setElections(res.elections || []);
    } catch (err) {
      setError(err.message || "Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElections();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      await createElection(form);
      setForm({ title: "", description: "", startDate: "", endDate: "", status: "draft" });
      await loadElections();
    } catch (err) {
      setError(err.message || "Failed to create election");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteElection(id);
      await loadElections();
    } catch (err) {
      setError(err.message || "Failed to delete election");
    }
  };

  return (
    <AdminLayout>
      <AdminHeader title="Election Management" subtitle="Create, review, and manage all election cycles in one place." />
      {error ? <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
          <div className="mb-4 flex items-center gap-2 text-slate-900"><Plus className="h-5 w-5" /><h2 className="text-lg font-bold">Create Election</h2></div>
          <form onSubmit={handleCreate} className="space-y-4">
            <input name="title" value={form.title} onChange={handleChange} placeholder="Election title" className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full rounded-2xl border border-slate-200 px-4 py-3" rows={4} />
            <input type="datetime-local" name="startDate" value={form.startDate} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <input type="datetime-local" name="endDate" value={form.endDate} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3" />
            <select name="status" value={form.status} onChange={handleChange} className="w-full rounded-2xl border border-slate-200 px-4 py-3">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
            <button disabled={submitting} className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">{submitting ? "Creating..." : "Create Election"}</button>
          </form>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h2 className="mb-4 text-lg font-bold text-slate-900">All Elections</h2>
          {loading ? (
            <p className="text-sm text-slate-500">Loading elections...</p>
          ) : (
            <div className="space-y-4">
              {elections.map((election) => (
                <div key={election._id} className="flex flex-col gap-4 rounded-2xl border border-slate-200 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{election.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{election.description || "No description"}</p>
                    <p className="mt-2 text-xs text-slate-400">{new Date(election.startDate).toLocaleString()} - {new Date(election.endDate).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={election.status} />
                    <button className="rounded-xl bg-slate-100 p-2 text-slate-700"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(election._id)} className="rounded-xl bg-rose-100 p-2 text-rose-700"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
              {elections.length === 0 ? <p className="text-sm text-slate-500">No elections created yet.</p> : null}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
