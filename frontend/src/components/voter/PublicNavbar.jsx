import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Vote, LogIn } from "lucide-react";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
            <Vote className="h-5 w-5" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              SecureVote AI
            </p>
            <h1 className="text-base font-bold text-slate-900">
              Online Voting Platform
            </h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            to="/"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Home
          </Link>
          <Link
            to="/elections"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Elections
          </Link>
          <Link
            to="/results"
            className="text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Results
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/voter/login"
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            <LogIn className="h-4 w-4" />
            Voter Login
          </Link>

          <Link
            to="/admin/login"
            className="hidden items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white sm:inline-flex"
          >
            <ShieldCheck className="h-4 w-4" />
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}