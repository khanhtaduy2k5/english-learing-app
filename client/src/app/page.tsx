"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useEffect, useState } from "react";
import { BookOpen, GraduationCap, TrendingUp } from "lucide-react";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`landing-page min-h-screen font-sans selection:bg-indigo-500/30 overflow-hidden relative transition-colors duration-300 ${
        isDark ? "bg-[#030712] text-slate-50" : "bg-slate-50 text-slate-950"
      }`}
    >
      {/* Background glowing orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 blur-[100px] rounded-full mix-blend-screen animate-pulse duration-[3000ms]" />
      </div>

      {/* Navigation */}
      <nav
        className={`fixed top-4 left-4 right-4 z-50 transition-all duration-300 rounded-2xl ${
          scrolled
            ? isDark
              ? "bg-[#030712]/85 backdrop-blur-md border border-white/10 py-3 shadow-lg shadow-black/20"
              : "bg-white/85 backdrop-blur-md border border-slate-200 py-3 shadow-sm"
            : isDark
              ? "bg-white/5 border border-white/10 py-4 backdrop-blur-sm shadow-sm"
              : "bg-white/45 border border-slate-200/40 py-4 backdrop-blur-sm shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300 btn-press">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span
              className={`text-xl font-bold ${
                isDark
                  ? "bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400"
                  : "text-slate-950"
              }`}
            >
              EngSphere
            </span>
          </Link>

          {/* Navigation Links - Hidden on Mobile */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                isDark
                  ? "text-slate-300 hover:text-indigo-400"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Features
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                isDark
                  ? "text-slate-300 hover:text-indigo-400"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              How It Works
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("testimonials")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                isDark
                  ? "text-slate-300 hover:text-indigo-400"
                  : "text-slate-600 hover:text-indigo-600"
              }`}
            >
              Reviews
            </button>
          </div>

          <div className="flex gap-4 items-center">
            <ThemeToggle />

            <Link
              href="/login"
              className={`px-5 py-2.5 transition-colors text-sm font-medium cursor-pointer btn-press ${
                isDark
                  ? "text-slate-300 hover:text-white"
                  : "text-slate-700 hover:text-slate-950"
              }`}
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-full text-sm font-medium transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 cursor-pointer btn-press"
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-8 backdrop-blur-sm ${
              isDark
                ? "bg-white/5 border border-white/10"
                : "bg-white border border-slate-200 shadow-sm"
            }`}
          >
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span
              className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              New Courses Available
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
            Master English with <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Next-Gen Learning
            </span>
          </h1>

          <p
            className={`text-lg lg:text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            Elevate your fluency through immersive lessons, intelligent speech
            recognition, and personalized AI-driven pathways.
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 bg-white text-slate-950 rounded-full text-lg font-semibold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] btn-press cursor-pointer"
              >
                Get Started for Free
              </Link>
              <button
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className={`w-full sm:w-auto px-8 py-4 border rounded-full text-lg font-medium backdrop-blur-sm transition-all duration-300 btn-press cursor-pointer ${
                  isDark
                    ? "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                    : "bg-white hover:bg-slate-100 border-slate-200 text-slate-900 shadow-sm"
                }`}
              >
                Explore Features
              </button>
            </div>
          )}
        </div>

        {/* Floating Abstract Elements */}
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl"></div>
      </main>

      {/* Features Section */}
      <section
        id="features"
        className={`py-24 relative border-t ${isDark ? "border-white/5 bg-[#030712]/50" : "border-slate-200 bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Why choose EngSphere?
            </h2>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              Experience language learning redesigned for the modern era.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div
              className={`group relative p-8 rounded-3xl glass-panel glass-panel-hover overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center mb-6 border border-indigo-500/20 group-hover:scale-110 transition-transform duration-500">
                  <BookOpen className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3
                  className={
                    isDark
                      ? "text-xl font-bold text-white mb-3"
                      : "text-xl font-bold text-slate-950 mb-3"
                  }
                >
                  Structured Curriculum
                </h3>
                <p
                  className={
                    isDark
                      ? "text-slate-400 leading-relaxed"
                      : "text-slate-600 leading-relaxed"
                  }
                >
                  Carefully crafted lessons that naturally progress from
                  fundamentals to advanced fluency without overwhelming you.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div
              className={`group relative p-8 rounded-3xl glass-panel glass-panel-hover overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                  <GraduationCap className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3
                  className={
                    isDark
                      ? "text-xl font-bold text-white mb-3"
                      : "text-xl font-bold text-slate-950 mb-3"
                  }
                >
                  Interactive Quizzes
                </h3>
                <p
                  className={
                    isDark
                      ? "text-slate-400 leading-relaxed"
                      : "text-slate-600 leading-relaxed"
                  }
                >
                  Reinforce your knowledge with dynamic, gamified exercises that
                  adapt to your specific learning pace and style.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div
              className={`group relative p-8 rounded-3xl glass-panel glass-panel-hover overflow-hidden`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-rose-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center mb-6 border border-pink-500/20 group-hover:scale-110 transition-transform duration-500">
                  <TrendingUp className="w-7 h-7 text-pink-600 dark:text-pink-400" />
                </div>
                <h3
                  className={
                    isDark
                      ? "text-xl font-bold text-white mb-3"
                      : "text-xl font-bold text-slate-950 mb-3"
                  }
                >
                  Deep Analytics
                </h3>
                <p
                  className={
                    isDark
                      ? "text-slate-400 leading-relaxed"
                      : "text-slate-600 leading-relaxed"
                  }
                >
                  Visualize your progress with comprehensive dashboards,
                  tracking everything from vocabulary retention to
                  pronunciation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section
        id="how-it-works"
        className={`py-24 relative ${isDark ? "bg-[#030712]" : "bg-slate-50"}`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              How EngSphere Works
            </h2>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              Three simple steps to fluency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-500/0 via-indigo-500/50 to-purple-500/0"></div>
            {/* Step 1 */}
            <div className="relative z-10">
              <div
                className={`w-24 h-24 mx-auto rounded-full border-4 border-indigo-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] hover:scale-110 transition-transform duration-500 ${isDark ? "bg-[#030712]" : "bg-white"}`}
              >
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-400 to-purple-400">
                  1
                </span>
              </div>
              <h3
                className={
                  isDark
                    ? "text-xl font-bold text-white mb-3"
                    : "text-xl font-bold text-slate-950 mb-3"
                }
              >
                Assess Your Level
              </h3>
              <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                Take a quick AI-powered diagnostic test to find your perfect
                starting point.
              </p>
            </div>
            {/* Step 2 */}
            <div className="relative z-10">
              <div
                className={`w-24 h-24 mx-auto rounded-full border-4 border-purple-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(168,85,247,0.3)] hover:scale-110 transition-transform duration-500 ${isDark ? "bg-[#030712]" : "bg-white"}`}
              >
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-400 to-pink-400">
                  2
                </span>
              </div>
              <h3
                className={
                  isDark
                    ? "text-xl font-bold text-white mb-3"
                    : "text-xl font-bold text-slate-950 mb-3"
                }
              >
                Learn & Practice
              </h3>
              <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                Engage with bite-sized lessons, interactive dialogues, and
                real-time pronunciation feedback.
              </p>
            </div>
            {/* Step 3 */}
            <div className="relative z-10">
              <div
                className={`w-24 h-24 mx-auto rounded-full border-4 border-pink-500/30 flex items-center justify-center mb-6 shadow-[0_0_30px_-5px_rgba(236,72,153,0.3)] hover:scale-110 transition-transform duration-500 ${isDark ? "bg-[#030712]" : "bg-white"}`}
              >
                <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-pink-400 to-rose-400">
                  3
                </span>
              </div>
              <h3
                className={
                  isDark
                    ? "text-xl font-bold text-white mb-3"
                    : "text-xl font-bold text-slate-950 mb-3"
                }
              >
                Achieve Fluency
              </h3>
              <p className={isDark ? "text-slate-400" : "text-slate-600"}>
                Track your progress, earn certificates, and start speaking
                English with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className={`py-24 relative border-t overflow-hidden ${isDark ? "border-white/5 bg-[#030712]/50" : "border-slate-200 bg-white"}`}
      >
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Loved by Learners
            </h2>
            <p className={isDark ? "text-slate-400" : "text-slate-600"}>
              Join thousands of students who have mastered English with
              EngSphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl border transition-colors duration-300 ${
                  isDark
                    ? "bg-white/5 border-white/5 hover:bg-white/10"
                    : "bg-slate-50 border-slate-200 hover:bg-white"
                }`}
              >
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <svg
                      key={j}
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p
                  className={`mb-8 leading-relaxed ${isDark ? "text-slate-300" : "text-slate-700"}`}
                >
                  &quot;
                  {i === 1
                    ? "This app completely changed the way I learn. The AI pronunciation feedback is incredible and the lessons are engaging."
                    : i === 2
                      ? "I used to struggle with speaking, but EngSphere gave me the confidence to finally converse fluently. Highly recommended!"
                      : "The structured curriculum makes learning English feel effortless. I advanced from beginner to intermediate in just a few months."}
                  &quot;
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {["S", "M", "A"][i - 1]}
                  </div>
                  <div>
                    <h4
                      className={
                        isDark
                          ? "text-white font-bold"
                          : "text-slate-950 font-bold"
                      }
                    >
                      {["Sarah Chen", "Miguel Santos", "Anna Kowalski"][i - 1]}
                    </h4>
                    <p
                      className={
                        isDark
                          ? "text-slate-400 text-sm"
                          : "text-slate-600 text-sm"
                      }
                    >
                      {
                        ["Software Engineer", "Marketing Manager", "Student"][
                          i - 1
                        ]
                      }
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className={`py-24 relative overflow-hidden border-t ${isDark ? "border-white/5" : "border-slate-200 bg-slate-50"}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-950/30 pointer-events-none"></div>
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h2
            className={
              isDark
                ? "text-4xl lg:text-5xl font-bold mb-6 text-white"
                : "text-4xl lg:text-5xl font-bold mb-6 text-slate-950"
            }
          >
            Ready to start your journey?
          </h2>
          <p
            className={
              isDark
                ? "text-xl text-slate-400 mb-10"
                : "text-xl text-slate-600 mb-10"
            }
          >
            Join today and get access to all our premium courses, completely
            free for the first 7 days.
          </p>
          <Link
            href="/register"
            className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-xl font-bold hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]"
          >
            Create Your Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`border-t py-12 ${isDark ? "border-white/5 bg-[#030712]" : "border-slate-200 bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <svg
                className="w-5 h-5 text-white"
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
            </div>
            <span
              className={
                isDark
                  ? "text-lg font-bold text-white"
                  : "text-lg font-bold text-slate-950"
              }
            >
              EngSphere
            </span>
          </div>
          <div
            className={`flex gap-6 text-sm ${isDark ? "text-slate-400" : "text-slate-600"}`}
          >
            <Link
              href="#"
              className={
                isDark
                  ? "hover:text-white transition-colors"
                  : "hover:text-slate-950 transition-colors"
              }
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className={
                isDark
                  ? "hover:text-white transition-colors"
                  : "hover:text-slate-950 transition-colors"
              }
            >
              Terms of Service
            </Link>
            <Link
              href="#"
              className={
                isDark
                  ? "hover:text-white transition-colors"
                  : "hover:text-slate-950 transition-colors"
              }
            >
              Contact Us
            </Link>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} EngSphere. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
