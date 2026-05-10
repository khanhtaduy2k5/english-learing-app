"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api";

const levelColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  BEGINNER: { bg: "from-emerald-500/20 to-green-500/10", text: "text-emerald-400", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
  INTERMEDIATE: { bg: "from-amber-500/20 to-orange-500/10", text: "text-amber-400", border: "border-amber-500/20", glow: "shadow-amber-500/10" },
  ADVANCED: { bg: "from-rose-500/20 to-pink-500/10", text: "text-rose-400", border: "border-rose-500/20", glow: "shadow-rose-500/10" },
};

export default function LessonsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredLessons = lessons.filter((lesson) => {
    const matchesFilter = filter === "ALL" || lesson.level === filter;
    const matchesSearch = lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filters = ["ALL", "BEGINNER", "INTERMEDIATE", "ADVANCED"];

  return (
    <div className="p-8 min-h-screen">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Lessons</h1>
            <p className="text-slate-400 text-sm">Explore our structured curriculum</p>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === f
                  ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/20 text-white border border-indigo-500/30"
                  : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
              }`}
            >
              {f === "ALL" ? "All Levels" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm">Loading lessons...</p>
          </div>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
            <span className="text-4xl">📚</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Lessons Found</h3>
          <p className="text-slate-400 max-w-sm">
            {searchQuery || filter !== "ALL"
              ? "Try adjusting your filters or search query."
              : "New lessons are being prepared. Check back soon!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLessons.map((lesson: any, index: number) => {
            const colors = levelColors[lesson.level] || levelColors.BEGINNER;
            return (
              <div
                key={lesson.id}
                className={`group relative p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-indigo-500/20 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1 shadow-lg ${colors.glow}`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Level Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r ${colors.bg} ${colors.text} border ${colors.border}`}>
                    {lesson.level}
                  </span>
                  <span className="text-slate-500 text-xs">
                    {lesson.contentBlocks?.length || 0} sections
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {lesson.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                  {lesson.description}
                </p>

                {/* Progress Bar (placeholder) */}
                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="text-slate-400">0%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/5">
                    <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500" style={{ width: "0%" }}></div>
                  </div>
                </div>

                {/* CTA */}
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="inline-flex items-center gap-2 w-full justify-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30"
                >
                  Start Lesson
                  <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
