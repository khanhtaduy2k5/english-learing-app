"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await apiClient.get<any[]>("/api/lessons");
        setLessons(data || []);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Welcome back, <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{user?.name}</span>!
        </h1>
        <p className="text-slate-400 mt-2">Track your progress and continue learning.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "Total Lessons", value: lessons.length, icon: "📚", color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/20", text: "text-blue-400" },
          { label: "Completed", value: 0, icon: "✅", color: "from-emerald-500/20 to-green-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
          { label: "Current Streak", value: "0 days", icon: "🔥", color: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/20", text: "text-orange-400" },
          { label: "XP Points", value: 0, icon: "⭐", color: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/20", text: "text-purple-400" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} border ${stat.border} rounded-2xl p-5 backdrop-blur-sm hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Start Lesson", href: "/lessons", icon: "📖", desc: "Continue learning" },
            { label: "Practice", href: "/practice", icon: "🎯", desc: "Test your skills" },
            { label: "Vocabulary", href: "/vocabulary", icon: "💬", desc: "Learn new words" },
            { label: "Quiz", href: "/quizzes", icon: "📝", desc: "Take a quiz" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="group p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300"
            >
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-200">{action.icon}</span>
              <h3 className="text-white font-semibold text-sm">{action.label}</h3>
              <p className="text-slate-500 text-xs mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Lessons Section */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Your Lessons</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm">Loading lessons...</p>
            </div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white/5 border border-white/5 text-center">
            <span className="text-5xl mb-4 block">📚</span>
            <p className="text-white font-semibold mb-2">No lessons available yet</p>
            <p className="text-slate-400 text-sm">
              Check back soon for new content! We&apos;re preparing amazing lessons for you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lessons.map((lesson: any) => (
              <div
                key={lesson.id}
                className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-indigo-500/20 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-white font-bold group-hover:text-indigo-300 transition-colors">
                      {lesson.title}
                    </h3>
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/20">
                      {lesson.level}
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm mb-5 line-clamp-2">
                  {lesson.description}
                </p>
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/20"
                >
                  Start Lesson
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
