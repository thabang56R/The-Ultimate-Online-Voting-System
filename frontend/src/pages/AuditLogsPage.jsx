import React, { useEffect, useState } from "react";
import { ClipboardList, RefreshCw } from "lucide-react";
import { getAuditLogs } from "../api/adminApi";
import AdminLayout from "../components/layout/AdminLayout";
import AdminHeader from "../components/layout/AdminHeader";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
  });

  const loadLogs = async (silent = false) => {
    try {
      setError("");
      if (silent) setRefreshing(true);
      else setLoading(true);

      const res = await getAuditLogs({
        action: filters.action || undefined,
        entityType: filters.entityType || undefined,
        limit: 50,
      });

      setLogs(res.logs || []);
    } catch (err) {
      setError(err.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const applyFilters = async () => {
    await loadLogs(true);
  };

  return (
    <AdminLayout>
      <AdminHeader
        title="Audit Logs"
        subtitle="Track sensitive actions across the platform for compliance, transparency, and accountability."
      />

      {error ? (
        <div className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3">
            <ClipboardList className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Filter Audit Logs</h2>
            <p className="text-sm text-slate-500">
              Narrow logs by action type or entity type.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <input
            type="text"
            name="action"
            value={filters.action}
            onChange={handleFilterChange}
            placeholder="Action e.g. CAST_VOTE"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <input
            type="text"
            name="entityType"
            value={filters.entityType}
            onChange={handleFilterChange}
            placeholder="Entity e.g. Vote"
            className="rounded-2xl border border-slate-200 px-4 py-3"
          />

          <button
            onClick={applyFilters}
            className="rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white"
          >
            Apply Filters
          </button>

          <button
            onClick={() => loadLogs(true)}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-100 px-4 py-3 font-semibold text-slate-800"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3">
            <ClipboardList className="h-5 w-5 text-slate-700" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Audit Entries</h2>
            <p className="text-sm text-slate-500">
              Live records from backend audit tracking.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center text-sm text-slate-500">
            Loading audit logs...
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Entity</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Actor</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Metadata</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 font-medium text-slate-900">
                        {log.action}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {log.entityType}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        <div className="font-medium">
                          {log.actorId?.fullName || "System"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {log.actorId?.email || "No email"}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {log.actorId?.role || "system"}
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <pre className="max-w-xs overflow-auto whitespace-pre-wrap text-xs">
                          {JSON.stringify(log.metadata || {}, null, 2)}
                        </pre>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}

                  {logs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                        No audit logs found.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}