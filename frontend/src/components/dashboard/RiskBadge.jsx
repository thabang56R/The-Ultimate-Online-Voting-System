
import React from "react";

export default function RiskBadge({ level }) {
  const map = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-rose-100 text-rose-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
        map[level] || "bg-slate-100 text-slate-700"
      }`}
    >
      {level}
    </span>
  );
}