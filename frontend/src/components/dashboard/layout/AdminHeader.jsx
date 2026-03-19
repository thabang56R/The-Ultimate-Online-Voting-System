
import React from "react";
import { Bell, ShieldCheck } from "lucide-react";

export default function AdminHeader({ title, subtitle }) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div>
        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-600">
          <ShieldCheck className="h-4 w-4" /> Secure Admin Workspace
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>

      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
        <Bell className="h-5 w-5 text-slate-700" />
      </div>
    </div>
  );
}