
import React from "react";

export default function LoadingBlock({ label = "Loading..." }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
      {label}
    </div>
  );
}