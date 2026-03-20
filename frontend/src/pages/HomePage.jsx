import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ShieldCheck,
  Vote,
  LockKeyhole,
  BarChart3,
  Users,
} from "lucide-react";
import PublicLayout from "../components/voter/PublicLayout";

export default function HomePage() {
  const features = [
    {
      title: "Secure Vote Casting",
      text: "One-voter-one-vote enforcement, protected election access, and a clean voting workflow.",
      icon: Vote,
      iconBg: "bg-linear-to-br from-indigo-500 to-sky-500",
    },
    {
      title: "ML Fraud Detection",
      text: "Suspicious behavior is risk-scored in real time before it can affect trusted outcomes.",
      icon: BrainCircuit,
      iconBg: "bg-linear-to-br from-violet-500 to-fuchsia-500",
    },
    {
      title: "Transparent Oversight",
      text: "Admins can review suspicious votes, inspect risk events, and audit every critical action.",
      icon: ShieldCheck,
      iconBg: "bg-linear-to-br from-emerald-500 to-teal-500",
    },
  ];

  const quickStats = [
    { label: "Security", value: "End-to-End" },
    { label: "Fraud Checks", value: "ML Assisted" },
    { label: "Oversight", value: "Review Ready" },
  ];

  const highlights = [
    "Enterprise-style admin dashboard",
    "Results aggregation with valid vote counting",
    "Audit logs and fraud review workflows",
    "Premium voter experience with clean UI",
  ];

  return (
    <PublicLayout>
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-black">
  {/* Glow overlay */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.25),transparent_30%)]" />

  <div className="relative mx-auto max-w-7xl px-6 py-24 lg:grid lg:grid-cols-2 lg:gap-12">
    
    {/* LEFT SIDE */}
    <div className="flex flex-col justify-center">
      <p className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-indigo-300">
        SecureVote AI Platform
      </p>

      <h1 className="mt-6 text-5xl font-bold leading-tight text-white">
        Online voting built for trust, security, and real oversight.
      </h1>

      <p className="mt-6 text-lg text-slate-300 max-w-xl">
        SecureVote AI combines modern digital voting, premium administration tools,
        real results aggregation, and ML-powered fraud detection.
      </p>

      {/* Buttons */}
      <div className="mt-8 flex gap-4">
        <button className="px-6 py-3 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-500 transition shadow-lg">
          Browse Elections
        </button>

        <button className="px-6 py-3 rounded-2xl border border-white/30 text-white hover:bg-white/10 transition">
          Voter Login
        </button>
      </div>
    </div>

    {/* RIGHT SIDE CARD */}
    <div className="mt-12 lg:mt-0">
      <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">
          Platform Highlights
        </h3>

        <ul className="space-y-3 text-slate-300">
          <li>✔ Enterprise-style admin dashboard</li>
          <li>✔ Results aggregation with valid vote counting</li>
          <li>✔ Audit logs and fraud review workflows</li>
          <li>✔ Premium voter experience</li>
        </ul>
      </div>
    </div>
  </div>
</section>

      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 py-20">
  <div className="max-w-7xl mx-auto px-6">

    {/* Section Title */}
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-white">
        Why SecureVote AI stands out
      </h2>
      <p className="mt-4 text-slate-400 max-w-2xl mx-auto">
        A real-world election platform built with security, transparency, and scalability in mind.
      </p>
    </div>

    {/* Cards */}
    <div className="grid md:grid-cols-3 gap-8">

      {/* Card 1 */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition">
        <h3 className="text-xl font-bold text-white mb-3">
          Secure Voting
        </h3>
        <p className="text-slate-400">
          Each vote is protected with authentication, validation, and strict one-user-one-vote enforcement.
        </p>
      </div>

      {/* Card 2 */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition">
        <h3 className="text-xl font-bold text-white mb-3">
          ML Fraud Detection
        </h3>
        <p className="text-slate-400">
          Intelligent risk scoring detects suspicious voting patterns in real time.
        </p>
      </div>

      {/* Card 3 */}
      <div className="bg-white/5 border border-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-xl hover:scale-105 transition">
        <h3 className="text-xl font-bold text-white mb-3">
          Admin Oversight
        </h3>
        <p className="text-slate-400">
          Admins can review flagged votes, approve valid ones, and reject fraudulent activity.
        </p>
      </div>

    </div>

  </div>
</section>

     <section className="bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 py-20">
  <div className="max-w-7xl mx-auto px-6 text-center text-white">

    <h2 className="text-4xl font-bold">
      Ready to experience secure digital voting?
    </h2>

    <p className="mt-4 text-indigo-100 max-w-2xl mx-auto">
      Explore elections, participate as a voter, or manage the system through the admin dashboard.
    </p>

    <div className="mt-8 flex justify-center gap-4">
      <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-semibold shadow-lg hover:scale-105 transition">
        View Elections
      </button>

      <button className="px-6 py-3 border border-white/40 rounded-2xl hover:bg-white/20 transition">
        Admin Panel
      </button>
    </div>

  </div>
</section>
    </PublicLayout>
  );
}