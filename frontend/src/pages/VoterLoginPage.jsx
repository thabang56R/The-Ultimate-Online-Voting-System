import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Vote } from "lucide-react";
import { loginAdmin } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";
import PublicLayout from "../components/voter/PublicLayout";

export default function VoterLoginPage() {
  const navigate = useNavigate();
  const { login, reloadUser } = useAuth();

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
      const token = res.data?.token || res.token;

      login(token);
      await reloadUser();

      navigate("/voter/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-7xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full overflow-hidden rounded-[2rem] bg-white shadow-xl lg:grid-cols-2">
          <div className="hidden bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-white lg:block">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em]">
              <Vote className="h-4 w-4" /> Secure Voting Access
            </p>
            <h1 className="mt-6 text-4xl font-bold">Voter portal login</h1>
            <p className="mt-4 max-w-md text-sm text-slate-300">
              Sign in securely to view active elections, cast your vote, and review your participation status.
            </p>
          </div>

          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                <LockKeyhole className="h-6 w-6 text-slate-700" />
              </div>

              <h2 className="text-3xl font-bold text-slate-900">Voter Login</h2>
              <p className="mt-2 text-sm text-slate-500">Access your elections and cast your vote.</p>

              {error ? (
                <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3"
                />

                <button
                  disabled={loading}
                  className="w-full rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white"
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
