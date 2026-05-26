"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
  const [lessons, setLessons] = useState<any[]>([]);
  const [loadingLessons, setLoadingLessons] = useState(false);

  useEffect(() => {
    if (!activeMode) {
      setLessons([]);
      return;
    }
    const fetchSkillLessons = async () => {
      setLoadingLessons(true);
      try {
        const data = await apiClient.getLessons({ skill: activeMode });
        setLessons(data || []);
      } catch (err) {
        console.error("Failed to fetch lessons for practice skill:", activeMode, err);
        setLessons([]);
      } finally {
        setLoadingLessons(false);
      }
    };
    fetchSkillLessons();
  }, [activeMode]);

  return (
    <div className="p-8 min-h-screen bg-gray-950 text-slate-100">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
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
                    {activeMode === mode.id ? "Close Details" : "Start Practice"}
                    <svg className={`w-3 h-3 transition-transform ${activeMode === mode.id ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Expanded Skill Lessons Sub-list */}
      {activeMode && (
        <div className="mb-10 p-6 rounded-3xl bg-white/[0.02] border border-white/5 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
            <div>
              <h3 className="text-white font-bold text-base flex items-center gap-2">
                🎯 Bài tập thực hành sẵn có ({practiceModes.find(m => m.id === activeMode)?.title})
              </h3>
              <p className="text-slate-400 text-xs mt-0.5">Chọn một bài học thực hành được đồng bộ trực tiếp từ máy chủ.</p>
            </div>
            <span className="text-xs text-indigo-400 font-bold bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
              {lessons.length} bài học
            </span>
          </div>

          {loadingLessons ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : lessons.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">Không tìm thấy bài học phù hợp cho kỹ năng này.</p>
              <Link href="/lessons" className="text-indigo-400 text-xs font-bold hover:underline mt-2 inline-block">
                Khám phá tất cả các bài học →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lessons.map((lesson) => (
                <Link href={`/lessons/${lesson.id}`} key={lesson.id} className="block group">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/20 group-hover:bg-white/[0.08] transition-all flex justify-between items-center gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-indigo-500/25 text-indigo-300 border border-indigo-500/25 rounded">
                          {lesson.level}
                        </span>
                        {lesson.duration && (
                          <span className="text-[10px] text-slate-500⏱️">⏱️ {lesson.duration} phút</span>
                        )}
                      </div>
                      <h4 className="text-white font-bold text-sm truncate group-hover:text-indigo-400 transition-colors">
                        {lesson.title}
                      </h4>
                    </div>
                    <span className="text-xs font-bold text-indigo-400 shrink-0 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Làm bài <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
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
