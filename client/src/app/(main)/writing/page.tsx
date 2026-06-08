"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FeedbackItem {
  original: string;
  suggestion: string;
  explanation: string;
  severity: "error" | "warning" | "info";
}

interface WritingFeedback {
  overallScore: number;
  band: string;
  summary: string;
  grammarErrors: FeedbackItem[];
  vocabularySuggestions: FeedbackItem[];
  coherencePoints: FeedbackItem[];
  strengths: string[];
  improvements: string[];
  correctedText: string;
}

// ── Config ────────────────────────────────────────────────────────────────────
const TASK_TYPES = [
  { value: "essay", label: "General Essay" },
  { value: "ielts", label: "IELTS Task 2" },
  { value: "email", label: "Email / Letter" },
  { value: "grammar", label: "Grammar Check" },
  { value: "creative", label: "Creative Writing" },
];

const TARGET_LEVELS = ["A2", "B1", "B2", "C1", "C2"];

// ── Helpers ───────────────────────────────────────────────────────────────────
function scoreColor(score: number) {
  if (score >= 85)
    return {
      text: "text-emerald-400",
      ring: "stroke-emerald-400",
      bg: "from-emerald-500/20 to-green-500/10",
      border: "border-emerald-500/20",
      label: "Excellent",
    };
  if (score >= 70)
    return {
      text: "text-blue-400",
      ring: "stroke-blue-400",
      bg: "from-blue-500/20 to-cyan-500/10",
      border: "border-blue-500/20",
      label: "Good",
    };
  if (score >= 55)
    return {
      text: "text-amber-400",
      ring: "stroke-amber-400",
      bg: "from-amber-500/20 to-yellow-500/10",
      border: "border-amber-500/20",
      label: "Fair",
    };
  return {
    text: "text-rose-400",
    ring: "stroke-rose-400",
    bg: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/20",
    label: "Needs Work",
  };
}

function severityStyle(severity: string) {
  switch (severity) {
    case "error":
      return {
        badge: "bg-rose-500/20 text-rose-400 border border-rose-500/20",
        dot: "bg-rose-400",
        icon: "🔴",
      };
    case "warning":
      return {
        badge: "bg-amber-500/20 text-amber-400 border border-amber-500/20",
        dot: "bg-amber-400",
        icon: "🟡",
      };
    default:
      return {
        badge: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
        dot: "bg-blue-400",
        icon: "🔵",
      };
  }
}

// ── Sub-Components ────────────────────────────────────────────────────────────
function FeedbackCard({
  items,
  title,
  icon,
  emptyMsg,
}: {
  items: FeedbackItem[];
  title: string;
  icon: string;
  emptyMsg: string;
}) {
  if (items.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-card/80 dark:bg-white/[0.03] border border-border">
        <h3 className="text-foreground font-semibold mb-3 flex items-center gap-2">
          <span>{icon}</span> {title}
        </h3>
        <p className="text-muted-foreground text-sm italic">{emptyMsg}</p>
      </div>
    );
  }
  return (
    <div className="p-5 rounded-2xl bg-card/80 dark:bg-white/[0.03] border border-border">
      <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
        <span className="ml-auto px-2 py-0.5 rounded-full text-xs bg-card text-muted-foreground border border-border">
          {items.length}
        </span>
      </h3>
      <div className="space-y-4">
        {items.map((item, i) => {
          const style = severityStyle(item.severity);
          return (
            <div key={i} className="relative pl-4 border-l-2 border-border">
              <div className="flex items-start gap-2 mb-1">
                <span
                  className={`mt-0.5 flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${style.badge}`}
                >
                  {item.severity}
                </span>
                <p className="text-foreground text-sm line-through opacity-70">
                  {item.original}
                </p>
              </div>
              <p className="text-foreground text-sm font-medium mb-1">
                → {item.suggestion}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {item.explanation}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WritingPage() {
  const [text, setText] = useState("");
  const [taskType, setTaskType] = useState("essay");
  const [targetLevel, setTargetLevel] = useState("B2");
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCorrected, setShowCorrected] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 10) {
      setError("Please write at least 10 characters before analyzing.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setFeedback(null);
    setShowCorrected(false);

    try {
      const data = await apiClient.post<WritingFeedback>("/api/writing/feedback", {
        text,
        taskType,
        targetLevel,
      });
      setFeedback(data);
      // Scroll to results
      setTimeout(() => {
        document
          .getElementById("writing-results")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Analysis failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const colors = feedback ? scoreColor(feedback.overallScore) : null;
  const circumference = 2 * Math.PI * 45; // r=45

  return (
    <div className="p-8 min-h-screen">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
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
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              AI Writing Coach
            </h1>
            <p className="text-muted-foreground text-sm">
              Get instant feedback powered by Groq AI
            </p>
          </div>
        </div>
      </div>

      {/* ── Input Section ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
        {/* Textarea */}
        <div className="xl:col-span-2 space-y-4">
          <div className="relative">
            <textarea
              id="writing-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write or paste your English text here… (minimum 10 characters)"
              rows={14}
              maxLength={5000}
              className="w-full p-5 bg-card/80 dark:bg-white/[0.03] border border-border rounded-2xl text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all leading-relaxed text-sm"
            />
            <div className="absolute bottom-4 right-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{wordCount} words</span>
              <span className={charCount > 4500 ? "text-amber-400" : ""}>
                {charCount}/5000
              </span>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Settings Panel */}
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-card/80 dark:bg-white/[0.03] border border-border">
            <h3 className="text-foreground font-semibold mb-4 text-sm">
              Analysis Settings
            </h3>

            {/* Task Type */}
            <div className="mb-4">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">
                Task Type
              </label>
              <div className="grid grid-cols-1 gap-2">
                {TASK_TYPES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTaskType(t.value)}
                    className={`px-4 py-2.5 rounded-xl text-sm text-left font-medium transition-all duration-200 ${
                      taskType === t.value
                        ? "bg-gradient-to-r from-amber-500/25 to-orange-500/15 text-amber-300 border border-amber-500/30"
                        : "bg-card/70 dark:bg-white/[0.03] text-muted-foreground border border-border hover:bg-card hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Level */}
            <div className="mb-5">
              <label className="text-xs text-slate-400 font-medium uppercase tracking-wider block mb-2">
                Target CEFR Level
              </label>
              <div className="flex gap-2 flex-wrap">
                {TARGET_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setTargetLevel(lvl)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      targetLevel === lvl
                        ? "bg-indigo-500/25 text-indigo-300 border-indigo-500/30"
                        : "bg-card/70 dark:bg-white/[0.03] text-muted-foreground border-border hover:text-foreground hover:bg-card"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Analyze Button */}
            <button
              id="analyze-btn"
              onClick={handleAnalyze}
              disabled={isLoading || text.trim().length < 10}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Analyzing…
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Analyze Writing
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-2xl bg-indigo-500/[0.06] border border-indigo-500/15">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              💡 Tips for better feedback
            </p>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Write at least 100 words for detailed feedback</li>
              <li>• Choose the task type that matches your goal</li>
              <li>• Set target level to your goal, not current level</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Results ────────────────────────────────────────────── */}
      {feedback && colors && (
        <div id="writing-results" className="space-y-6">
          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
              Analysis Results
            </span>
            <div className="flex-1 h-px bg-white/5" />
          </div>

          {/* Score + Summary Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Circular Score */}
            <div
              className={`flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border}`}
            >
              <svg className="w-36 h-36 -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  className="stroke-white/5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  strokeWidth="8"
                  className={`${colors.ring} transition-[stroke-dashoffset] duration-1000 ease-in-out`}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={
                    circumference -
                    (feedback.overallScore / 100) * circumference
                  }
                />
              </svg>
              <div className="text-center -mt-28">
                <p className={`text-5xl font-black ${colors.text}`}>
                  {feedback.overallScore}
                </p>
                <p
                  className={`text-sm font-semibold mt-1 ${colors.text} opacity-80`}
                >
                  {colors.label}
                </p>
              </div>
              <div className="mt-20 text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">
                  CEFR Level
                </p>
                <span className={`text-2xl font-black ${colors.text}`}>
                  {feedback.band}
                </span>
              </div>
            </div>

            {/* Summary */}
            <div className="md:col-span-2 p-6 rounded-2xl bg-card/80 dark:bg-white/[0.03] border border-border flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">
                  Overall Assessment
                </p>
                <p className="text-foreground leading-relaxed">
                  {feedback.summary}
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-3 mt-5">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/15 text-center">
                  <p className="text-2xl font-bold text-rose-400">
                    {feedback.grammarErrors.length}
                  </p>
                  <p className="text-xs text-rose-400/70 mt-0.5">
                    Grammar Issues
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/15 text-center">
                  <p className="text-2xl font-bold text-blue-400">
                    {feedback.vocabularySuggestions.length}
                  </p>
                  <p className="text-xs text-blue-400/70 mt-0.5">Vocab Tips</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/15 text-center">
                  <p className="text-2xl font-bold text-amber-400">
                    {feedback.coherencePoints.length}
                  </p>
                  <p className="text-xs text-amber-400/70 mt-0.5">Coherence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <FeedbackCard
              items={feedback.grammarErrors}
              title="Grammar Issues"
              icon="📝"
              emptyMsg="No grammar errors detected. Great job!"
            />
            <FeedbackCard
              items={feedback.vocabularySuggestions}
              title="Vocabulary Suggestions"
              icon="📚"
              emptyMsg="Vocabulary looks good!"
            />
            <FeedbackCard
              items={feedback.coherencePoints}
              title="Coherence & Flow"
              icon="🔗"
              emptyMsg="Your text flows well!"
            />
          </div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20">
              <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Strengths
              </h3>
              <ul className="space-y-2.5">
                {feedback.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 text-xs font-bold mt-0.5">
                      ✓
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-amber-500/[0.06] border border-amber-500/20">
              <h3 className="text-amber-400 font-semibold mb-4 flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Areas to Improve
              </h3>
              <ul className="space-y-2.5">
                {feedback.improvements.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-sm text-foreground"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 text-xs font-bold mt-0.5">
                      →
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Corrected Text Toggle */}
          {feedback.correctedText && (
            <div className="rounded-2xl bg-card/80 dark:bg-white/[0.03] border border-border overflow-hidden">
              <button
                id="corrected-text-toggle"
                onClick={() => setShowCorrected(!showCorrected)}
                className="w-full flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-foreground font-semibold flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Corrected Version
                </span>
                <svg
                  className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${showCorrected ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {showCorrected && (
                <div className="px-5 pb-5 border-t border-white/5">
                  <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap mt-4">
                    {feedback.correctedText}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Try Again */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => {
                setFeedback(null);
                setText("");
                setShowCorrected(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-card/70 border border-border text-muted-foreground hover:text-foreground hover:bg-card transition-all text-sm font-medium"
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
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Analyze Another Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
