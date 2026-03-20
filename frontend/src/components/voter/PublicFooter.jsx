import React from "react";
import { ShieldCheck, Vote, BrainCircuit } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-500 text-white shadow-lg shadow-indigo-200">
              <Vote className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                SecureVote AI
              </p>
              <h3 className="text-base font-bold text-slate-900">
                Trusted Digital Voting
              </h3>
            </div>
          </div>

          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
            A modern election platform with secure workflows, admin review,
            auditability, and ML-powered fraud detection.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-900">
            Platform Highlights
          </h4>

          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-indigo-600" />
              Secure vote casting
            </div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-sky-600" />
              ML fraud detection
            </div>
            <div className="flex items-center gap-2">
              <Vote className="h-4 w-4 text-violet-600" />
              Election management
            </div>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700">
            <ShieldCheck className="h-4 w-4" />
            Election Integrity First
          </div>

          <p className="mt-4 text-sm text-slate-600">
            © 2026 SecureVote AI. Built with MERN and ML-powered fraud
            detection.
          </p>

          <p className="mt-2 text-sm font-medium text-slate-800">
            Designed and Developed by Thabang Rakeng
          </p>
        </div>
      </div>
    </footer>
  );
}