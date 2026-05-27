"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import { LessonSummary } from "@/types";
import {
  BookOpen,
  Search,
  SlidersHorizontal,
  BookOpenText,
  Clock,
  Sparkles,
  ChevronRight,
  MessageSquare,
  Volume2
} from "lucide-react";

export default function LessonsPage() {
  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedSkill, setSelectedSkill] = useState<string>("All");

  const levels = ["All", ...Array.from(new Set(lessons.map((l) => l.level).filter(Boolean)))];
  const skills = [
    { id: "All", label: "Tất cả" },
    { id: "reading", label: "📖 Đọc (Reading)" },
    { id: "listening", label: "🎧 Nghe (Listening)" },
    { id: "grammar", label: "✍️ Ngữ pháp (Grammar)" },
    { id: "speaking", label: "🎤 Nói (Speaking)" },
    { id: "writing", label: "📝 Viết (Writing)" },
    { id: "vocabulary", label: "📖 Từ vựng (Vocabulary)" }
  ];

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await apiClient.getLessons();
        setLessons(data || []);
      } catch (error) {
        console.error("Failed to fetch lessons", error);
        // Fallback dummy data for UI if API fails, matching the new DTO structure!
        setLessons([
          { id: "1", title: "Chào hỏi và Giới thiệu", description: "Học cách chào hỏi cơ bản bằng tiếng Anh trong đời sống thường nhật.", level: "A1", skill: "reading", duration: 15, xp: 50 },
          { id: "2", title: "Thì Hiện Tại Đơn", description: "Luyện ngữ pháp cấu trúc thì Hiện Tại Đơn với các ví dụ thực tế.", level: "A1", skill: "grammar", duration: 20, xp: 60 },
          { id: "3", title: "Luyện Nghe Cuộc Họp Công Sở", description: "Nghe các cuộc đối thoại đàm thoại công sở chuyên nghiệp.", level: "B1", skill: "listening", duration: 15, xp: 50 },
          { id: "4", title: "Mẫu Viết Thư Xin Việc", description: "Học cách viết một email xin việc ấn tượng bằng tiếng Anh.", level: "B2", skill: "writing", duration: 25, xp: 80 },
          { id: "5", title: "Phát Âm Tiếng Anh TH", description: "Luyện phát âm các âm TH khó trong tiếng Anh chuẩn bản xứ.", level: "A2", skill: "speaking", duration: 10, xp: 40 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  // Filter logic
  const filteredLessons = lessons.filter((lesson) => {
    const matchSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lesson.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchLevel = selectedLevel === "All" || lesson.level === selectedLevel;
    const matchSkill = selectedSkill === "All" || lesson.skill.toLowerCase() === selectedSkill.toLowerCase();
    
    return matchSearch && matchLevel && matchSkill;
  });

  // Get skill icon & color config
  const getSkillConfig = (skill: string) => {
    const configs: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
      reading: { label: "Đọc", icon: BookOpenText, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
      listening: { label: "Nghe", icon: Volume2, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
      grammar: { label: "Ngữ pháp", icon: BookOpen, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
      speaking: { label: "Nói", icon: Volume2, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
      writing: { label: "Viết", icon: MessageSquare, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
      vocabulary: { label: "Từ vựng", icon: BookOpenText, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" }
    };
    const sLower = skill.toLowerCase();
    return configs[sLower] || { label: skill, icon: BookOpen, color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-white/5", border: "border-slate-200 dark:border-white/10" };
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 text-slate-800 dark:text-slate-100 min-h-screen">
      {/* Header Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-slate-500/5 dark:from-indigo-950/40 dark:via-purple-950/20 dark:to-gray-950 border border-slate-200/80 dark:border-white/5 shadow-xl shadow-indigo-500/5 dark:shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl bg-indigo-500/10 w-12 h-12 rounded-2xl flex items-center justify-center border border-indigo-500/10">📚</span>
          <div>
            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">Khóa học tiếng Anh</h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm mt-0.5">Khám phá và bắt đầu học các chủ đề nâng cao phản hồi động.</p>
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-3">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" /> Bộ lọc bài học
          </h3>
          <span className="text-xs text-slate-500">Tìm thấy {filteredLessons.length} bài học</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 1. Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 text-sm transition-all focus:bg-white dark:focus:bg-transparent"
            />
          </div>

          {/* 2. Level Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold shrink-0">Trình độ:</span>
            <div className="flex gap-1 overflow-x-auto scrollbar-none py-1 w-full">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                    selectedLevel === lvl
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/10"
                  }`}
                >
                  {lvl === "All" ? "Tất cả" : lvl}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Skill Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold shrink-0">Kỹ năng:</span>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-xs text-slate-700 dark:text-slate-300 px-3 py-2.5 focus:outline-none focus:border-indigo-500/40"
            >
              {skills.map((sk) => (
                <option key={sk.id} value={sk.id} className="bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300">
                  {sk.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Lessons List Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 rounded-3xl p-6 space-y-4 animate-pulse">
              <div className="flex justify-between items-start">
                <div className="h-6 w-28 bg-slate-200 dark:bg-white/5 rounded-lg"></div>
                <div className="h-5 w-14 bg-slate-200 dark:bg-white/5 rounded-lg"></div>
              </div>
              <div className="space-y-2">
                <div className="h-6 w-full bg-slate-200 dark:bg-white/5 rounded-lg"></div>
                <div className="h-4 w-5/6 bg-slate-200 dark:bg-white/5 rounded-lg"></div>
              </div>
              <div className="h-10 w-full bg-slate-200 dark:bg-white/5 rounded-xl pt-4"></div>
            </div>
          ))}
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="p-16 rounded-3xl bg-slate-50 dark:bg-white/[0.01] border border-slate-200 dark:border-white/5 text-center flex flex-col items-center justify-center">
          <span className="text-6xl mb-4">🔍</span>
          <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Không Tìm Thấy Bài Học Nào</h3>
          <p className="text-slate-500 text-sm max-w-sm">
            Vui lòng thử điều chỉnh lại bộ lọc hoặc nhập cụm từ tìm kiếm khác.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const skillConfig = getSkillConfig(lesson.skill);
            const SkillIcon = skillConfig.icon;
            
            return (
              <Link href={`/lessons/${lesson.id}`} key={lesson.id} className="block group">
                <div className="h-full bg-white dark:bg-white/[0.02] hover:bg-slate-50 dark:hover:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:border-indigo-500/20 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl shadow-sm">
                  <div>
                    {/* Level & Skill badges */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`p-1.5 rounded-lg ${skillConfig.bg} ${skillConfig.color} border ${skillConfig.border}`}>
                          <SkillIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{skillConfig.label}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 bg-indigo-500/25 text-indigo-600 dark:text-indigo-300 rounded-md border border-indigo-500/10">
                        {lesson.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition-colors leading-snug mb-2 line-clamp-1">
                      {lesson.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-6 line-clamp-2">
                      {lesson.description || "Không có mô tả chi tiết bài học."}
                    </p>
                  </div>

                  {/* Metadata Chips & Start button */}
                  <div className="border-t border-slate-100 dark:border-white/5 pt-4 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      {lesson.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-600" /> {lesson.duration} phút
                        </span>
                      )}
                      {lesson.xp && (
                        <span className="flex items-center gap-1 text-purple-400/90 font-semibold">
                          <Sparkles className="w-3.5 h-3.5" /> +{lesson.xp} XP
                        </span>
                      )}
                    </div>

                    <span className="flex items-center gap-1 text-indigo-400 font-bold group-hover:translate-x-0.5 transition-transform">
                      Bắt đầu <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
