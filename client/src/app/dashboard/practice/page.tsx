"use client";

import { useState } from "react";

type PracticeMode = "speaking" | "listening" | "writing" | "reading";

const practiceModes: { id: PracticeMode; title: string; description: string; icon: string; color: string; bg: string; border: string; sessions: number }[] = [
  {
    id: "speaking",
    title: "Speaking Practice",
    description: "Improve your pronunciation with AI-powered speech recognition and real-time feedback.",
    icon: "🎤",
    color: "text-rose-400",
    bg: "from-rose-500/20 to-pink-500/10",
    border: "border-rose-500/20",
    sessions: 12,
  },
  {
    id: "listening",
    title: "Listening Comprehension",
    description: "Train your ear with native speaker audio clips, dialogues, and dictation exercises.",
    icon: "🎧",
    color: "text-blue-400",
    bg: "from-blue-500/20 to-cyan-500/10",
    border: "border-blue-500/20",
    sessions: 18,
  },
  {
    id: "writing",
    title: "Writing Exercises",
    description: "Practice essay writing, sentence construction, and creative writing with AI corrections.",
    icon: "✍️",
    color: "text-amber-400",
    bg: "from-amber-500/20 to-yellow-500/10",
    border: "border-amber-500/20",
    sessions: 15,
  },
  {
    id: "reading",
    title: "Reading Practice",
    description: "Read articles, stories, and passages with vocabulary highlights and comprehension questions.",
    icon: "📖",
    color: "text-emerald-400",
    bg: "from-emerald-500/20 to-green-500/10",
    border: "border-emerald-500/20",
    sessions: 20,
  },
];

const dailyChallenges = [
  { id: 1, title: "Tongue Twister Challenge", type: "Speaking", difficulty: "Medium", xp: 50, timeMin: 5 },
  { id: 2, title: "News Article Comprehension", type: "Reading", difficulty: "Hard", xp: 80, timeMin: 15 },
  { id: 3, title: "Fill in the Blanks", type: "Writing", difficulty: "Easy", xp: 30, timeMin: 8 },
  { id: 4, title: "Dialogue Listening", type: "Listening", difficulty: "Medium", xp: 60, timeMin: 10 },
];

const recentSessions = [
  { id: 1, type: "Speaking", title: "Pronunciation: TH sounds", score: 85, date: "Today", duration: "12 min" },
  { id: 2, type: "Listening", title: "Business Meeting Dialogue", score: 72, date: "Yesterday", duration: "18 min" },
  { id: 3, type: "Writing", title: "Essay: My Hometown", score: 90, date: "2 days ago", duration: "25 min" },
];

export default function PracticePage() {
  const [activeMode, setActiveMode] = useState<PracticeMode | null>(null);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Practice</h1>
            <p className="text-slate-400 text-sm">Sharpen your skills with interactive exercises</p>
          </div>
        </div>
      </div>

      {/* Practice Modes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {practiceModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setActiveMode(activeMode === mode.id ? null : mode.id)}
            className={`group relative p-6 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1 overflow-hidden ${
              activeMode === mode.id
                ? `bg-gradient-to-br ${mode.bg} border ${mode.border} shadow-lg`
                : "bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.06]"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{mode.icon}</span>
              <div className="flex-1">
                <h3 className={`text-lg font-bold mb-1 ${activeMode === mode.id ? mode.color : "text-white"}`}>
                  {mode.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{mode.description}</p>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500">{mode.sessions} sessions available</span>
                  <span className={`inline-flex items-center gap-1 text-xs font-medium ${mode.color}`}>
                    Start Practice
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Daily Challenges */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold text-white">Daily Challenges</h2>
            <p className="text-slate-400 text-sm">Complete challenges to earn bonus XP</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <span className="text-amber-400 text-sm font-medium">🔥 3/4 completed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {dailyChallenges.map((challenge, i) => (
            <div
              key={challenge.id}
              className={`p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 ${
                i < 3
                  ? "bg-emerald-500/[0.05] border-emerald-500/20"
                  : "bg-white/[0.03] border-white/5 hover:border-indigo-500/20"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-white/5 text-slate-300 border border-white/10">
                  {challenge.type}
                </span>
                {i < 3 ? (
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <span className="text-xs text-slate-500">{challenge.timeMin} min</span>
                )}
              </div>
              <h4 className="text-white font-semibold text-sm mb-2">{challenge.title}</h4>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${
                  challenge.difficulty === "Easy" ? "text-emerald-400" :
                  challenge.difficulty === "Medium" ? "text-amber-400" : "text-rose-400"
                }`}>
                  {challenge.difficulty}
                </span>
                <span className="text-xs text-purple-400 font-medium">+{challenge.xp} XP</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sessions */}
      <div>
        <h2 className="text-xl font-bold text-white mb-5">Recent Sessions</h2>
        <div className="space-y-3">
          {recentSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center gap-5 p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.05] transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center">
                <span className="text-lg">
                  {session.type === "Speaking" ? "🎤" : session.type === "Listening" ? "🎧" : session.type === "Writing" ? "✍️" : "📖"}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-medium text-sm">{session.title}</h4>
                <p className="text-slate-500 text-xs">{session.type} • {session.date} • {session.duration}</p>
              </div>
              <div className="text-right">
                <div className={`text-lg font-bold ${
                  session.score >= 90 ? "text-emerald-400" :
                  session.score >= 70 ? "text-amber-400" : "text-rose-400"
                }`}>
                  {session.score}%
                </div>
                <p className="text-xs text-slate-500">Score</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
