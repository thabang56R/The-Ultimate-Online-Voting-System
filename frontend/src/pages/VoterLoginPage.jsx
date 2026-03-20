import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Vote, ShieldCheck } from "lucide-react";
import { loginAdmin } from "../api/adminApi";
import PublicLayout from "../components/voter/PublicLayout";

export default function VoterLoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await loginAdmin(form.email, form.password);
      localStorage.setItem("token", res.data?.token || res.token);

      navigate("/voter/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto flex min-h-[calc(100vh-180px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-700 p-10 text-white lg:block">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              <Vote className="h-4 w-4" />
              Secure Voting Access
            </p>

            <h1 className="mt-6 text-4xl font-bold">Voter portal login</h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
              Sign in securely to view active elections, cast your vote, and
              participate in a polished election platform experience.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-100">
                <ShieldCheck className="h-4 w-4" />
                Secure voter session flow
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-100">
                <ShieldCheck className="h-4 w-4" />
                Clean election access
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-100">
                <ShieldCheck className="h-4 w-4" />
                Fraud-aware voting workflow
              </div>
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <LockKeyhole className="h-6 w-6" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">Voter Login</h2>
              <p className="mt-2 text-sm text-slate-500">
                Access your elections and cast your vote.
              </p>

              {error ? (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-2xl bg-gradient-to-r from-indigo-600 to-sky-500 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.01] disabled:opacity-60"
                >
                  {loading ? "Signing in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
