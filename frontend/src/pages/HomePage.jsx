import React from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  Vote,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import PublicLayout from "../components/voter/PublicLayout";

export default function HomePage() {
  const features = [
    {
      title: "Secure digital voting",
      text: "Role-based access, one-voter-one-vote enforcement, and clean election workflows.",
      icon: Vote,
    },
    {
      title: "ML fraud detection",
      text: "Real-time anomaly scoring flags suspicious voting behavior before it impacts trust.",
      icon: BrainCircuit,
    },
    {
      title: "Admin audit visibility",
      text: "Transparent review queue, risk events, and decision logs for accountable oversight.",
      icon: ShieldCheck,
    },
  ];

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200">
              <ShieldCheck className="h-4 w-4" /> SecureVote AI
            </p>

            <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
              Trusted online voting with intelligent fraud detection.
            </h1>

            <p className="mt-6 max-w-2xl text-base text-slate-300 md:text-lg">
              A modern election platform that combines secure voting, premium
              administration tools, and ML-powered risk scoring to protect
              election integrity.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/elections"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-900"
              >
                Explore Elections <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                to="/voter/login"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 font-semibold text-white"
              >
                Voter Sign In
              </Link>
            </div>
          </div>

          <div className="grid gap-4 self-center">
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur">
              <h2 className="text-xl font-bold">Platform highlights</h2>

              <div className="mt-5 space-y-4">
                {[
                  "End-to-end voting workflow",
                  "Risk-based vote review",
                  "Real-time admin dashboard",
                  "Election and candidate management",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-slate-200"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <h2 className="text-3xl font-bold text-slate-900">
            Why this platform stands out
          </h2>
          <p className="mt-3 text-slate-600">
            Designed like a real election-tech product, not just a CRUD app.
            Every layer is built to support secure operations and credible
            oversight.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                  <Icon className="h-5 w-5 text-slate-700" />
                </div>

                <h3 className="mt-5 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm text-slate-600">{feature.text}</p>
              </div>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}