
import React from "react";
import { FileSearch } from "lucide-react";
import RiskBadge from "./RiskBadge";

export default function RiskEventsList({ riskEvents }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-1">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-slate-100 p-3">
          <FileSearch className="h-5 w-5 text-slate-700" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recent Risk Events</h2>
          <p className="text-sm text-slate-500">Latest ML anomaly signals</p>
        </div>
      </div>

      <div className="space-y-4">
        {riskEvents.slice(0, 6).map((event) => (
          <div key={event._id} className="rounded-2xl border border-slate-200 p-4">
            <div className="mb-2 flex items-center justify-between gap-3">
              <RiskBadge level={event.riskLevel} />
              <span className="text-xs text-slate-400">
                {new Date(event.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-900">
              {event.voterId?.fullName || "Unknown voter"}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {event.electionId?.title || "Unknown election"}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(event.flags || []).length > 0 ? (
                event.flags.map((flag, index) => (
                  <span
                    key={`${event._id}-${index}`}
                    className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600"
                  >
                    {flag}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400">No flags</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


