import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Vote, LogIn } from "lucide-react";

export default function PublicNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-200">
            <Vote className="h-5 w-5" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
              SecureVote AI
            </p>
            <h1 className="text-lg font-bold text-slate-900">
              Online Voting Platform
            </h1>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            Home
          </Link>
          <Link
            to="/elections"
            className="text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            Elections
          </Link>
          <Link
            to="/results"
            className="text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            Results
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/voter/login" className="btn-secondary">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Voter Login</span>
          </Link>

          <Link to="/admin/login" className="btn-primary">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}