"use client";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const emailId = useId();
  const passwordId = useId();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiClient.login(email, password);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      document.cookie = `token=${token}; Path=/; SameSite=Lax`;
      setToken(token);
      setUser(user);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl w-full max-w-md backdrop-blur-xl relative z-10">
        <div className="flex justify-center mb-6">
          <Link href="/" className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Welcome back
        </h1>
        <p className="text-slate-400 text-center mb-8">Sign in to continue your learning journey.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor={emailId}
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="block text-sm font-medium text-slate-300 mb-2"
            >
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-white placeholder-slate-500 transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-400 hover:to-purple-500 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-indigo-500/25 mt-4"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
