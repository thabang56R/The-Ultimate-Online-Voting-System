import React from "react";

export default function StatusBadge({ status }) {
  const map = {
    accepted: "bg-emerald-100 text-emerald-700",
    approved: "bg-emerald-100 text-emerald-700",
    challenged: "bg-amber-100 text-amber-700",
    flagged: "bg-rose-100 text-rose-700",
    rejected: "bg-slate-200 text-slate-700",
    active: "bg-emerald-100 text-emerald-700",
    closed: "bg-slate-200 text-slate-700",
    draft: "bg-amber-100 text-amber-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        map[status] || "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}