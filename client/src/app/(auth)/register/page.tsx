"use client";

import { useId, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiClient } from "@/lib/api";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const { logout } = useAuthStore();

  useEffect(() => {
    logout();
  }, [logout]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await apiClient.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      // Registration successful — redirect to login page
      router.push("/login?registered=true");
    } catch (err: any) {
      if (err.response?.data) {
        // Handle Spring Boot validation errors format
        if (
          err.response.data.errors &&
          Array.isArray(err.response.data.errors)
        ) {
          setError(
            err.response.data.errors
              .map((e: any) => e.defaultMessage || e.msg)
              .join(", "),
          );
        } else {
          setError(
            err.response.data.message ||
              err.response.data.error ||
              "Registration failed",
          );
        }
      } else {
        setError("Registration failed. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-900 dark:text-slate-50 flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Back to Home Button */}
      <div className="absolute left-6 top-6 z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10 transition-all shadow-sm font-medium"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          EngSphere
        </Link>
      </div>

      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-8 rounded-3xl shadow-xl shadow-purple-500/5 dark:shadow-2xl w-full max-w-md backdrop-blur-xl relative z-10 transition-all duration-300">
        <div className="flex justify-center mb-6">
          <Link
            href="/"
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20"
          >
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Create Account
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-center mb-8">
          Start your journey to fluency today.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor={nameId}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Full Name
            </label>
            <input
              id={nameId}
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:bg-white dark:focus:bg-transparent"
              placeholder="John Doe"
              required
              pattern="^[a-zA-Z0-9 ]+$"
              title="Only letters, numbers, and spaces are allowed"
            />
          </div>

          <div>
            <label
              htmlFor={emailId}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Email address
            </label>
            <input
              id={emailId}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:bg-white dark:focus:bg-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label
              htmlFor={passwordId}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Password
            </label>
            <input
              id={passwordId}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:bg-white dark:focus:bg-transparent"
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <div>
            <label
              htmlFor={confirmPasswordId}
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
            >
              Confirm Password
            </label>
            <input
              id={confirmPasswordId}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:bg-white dark:focus:bg-transparent"
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
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-500 hover:to-pink-500 disabled:opacity-50 transition-all duration-300 shadow-lg shadow-purple-500/25 mt-6"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-600 dark:text-slate-400 text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-purple-600 dark:text-purple-400 font-medium hover:text-purple-500 dark:hover:text-purple-300 transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
