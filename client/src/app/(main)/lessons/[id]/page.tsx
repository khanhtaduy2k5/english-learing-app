"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";
import { Lesson } from "@/types";
import {
  BookOpen,
  HelpCircle,
  ArrowLeft,
  GraduationCap,
  Sparkles,
  BookOpenText,
  Flame
} from "lucide-react";

// Import modular tab components
import VocabTab from "./components/VocabTab";
import ContentTab from "./components/ContentTab";
import TipsTab from "./components/TipsTab";
import QuizTab from "./components/QuizTab";

export default function LessonPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  
  // Data State
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"vocab" | "content" | "tips" | "quiz">("vocab");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await apiClient.getLessonDetail(params.id);
        setLesson(data);
      } catch (err) {
        console.error("Failed to fetch lesson details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLesson();
    }
  }, [isAuthenticated, params.id]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-slate-800 dark:text-white">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 dark:text-slate-400 text-sm animate-pulse">Đang tải dữ liệu bài học...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-transparent text-slate-800 dark:text-white p-6 text-center">
        <h2 className="text-2xl font-bold mb-2">Không Tìm Thấy Bài Học</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-md">Bài học này không tồn tại hoặc đã bị xóa khỏi hệ thống.</p>
        <button
          onClick={() => router.push("/lessons")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all duration-200"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const vocabList = lesson.vocab || [];

  // Helper render badge kỹ năng
  const getSkillBadge = (skill: string) => {
    const badges: Record<string, { label: string; style: string }> = {
      reading: { label: "📖 Đọc (Reading)", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
      listening: { label: "🎧 Nghe (Listening)", style: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
      grammar: { label: "✍️ Ngữ pháp (Grammar)", style: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
      speaking: { label: "🎤 Nói (Speaking)", style: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
      writing: { label: "📝 Viết (Writing)", style: "bg-amber-500/10 text-amber-400 border-amber-500/20" }
    };
    const skillLower = skill.toLowerCase();
    const config = badges[skillLower] || { label: skill, style: "bg-white/5 text-slate-300 border-white/10" };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.style}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-800 dark:text-slate-100 flex flex-col animate-fadeIn">
      {/* Header */}
      <header className="border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/lessons")}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all"
              title="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight line-clamp-1">{lesson.title}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/10">
                  {lesson.level}
                </span>
                {getSkillBadge(lesson.skill)}
                {lesson.duration && (
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    ⏱️ {lesson.duration} phút
                  </span>
                )}
                {lesson.xp && (
                  <span className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                    ✨ +{lesson.xp} XP
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Flame className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-semibold text-amber-300">Streak: 3 ngày</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full flex flex-col md:flex-row gap-6">
        
        {/* Left Side: Study Tracker Panel */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-4">
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-5 rounded-2xl shadow-xl flex flex-col gap-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> Tiến trình học
            </h3>
            
            {/* Tabs List */}
            <div className="flex flex-col gap-1.5">
              {[
                { id: "vocab", label: "Từ vựng cốt lõi", count: vocabList.length, icon: BookOpen },
                { id: "content", label: "Nội dung bài học", icon: BookOpenText },
                { id: "tips", label: "Mẹo & Ghi chú", count: lesson.tips?.length, icon: Sparkles },
                { id: "quiz", label: "Luyện tập & Quiz", count: lesson.questions?.length, icon: HelpCircle }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl text-left text-sm font-medium transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                        : "bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-md ${isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-white/5 text-slate-500"}`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/5 text-center">
              <p className="text-xs text-slate-500 leading-relaxed">
                Tất cả dữ liệu được đồng bộ hóa với cơ sở dữ liệu PostgreSQL local của bạn.
              </p>
            </div>
          </div>
        </aside>

        {/* Right Side: Tab Panel Container */}
        <section className="flex-1 min-w-0">
          <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 p-6 md:p-8 rounded-3xl shadow-xl min-h-[500px] flex flex-col">
            
            {activeTab === "vocab" && (
              <VocabTab vocabList={vocabList} />
            )}

            {activeTab === "content" && (
              <ContentTab lesson={lesson} />
            )}

            {activeTab === "tips" && (
              <TipsTab tips={lesson.tips} />
            )}

            {activeTab === "quiz" && (
              <QuizTab
                questions={lesson.questions}
                lessonId={lesson.id}
                userId={user?.id}
                xp={lesson.xp}
              />
            )}

          </div>
        </section>

      </main>
    </div>
  );
}
