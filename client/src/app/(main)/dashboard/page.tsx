"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { Card, CardBody, CardFooter } from "@/components/Card";
import { Button } from "@/components/Button";
import {
  BookOpenText,
  Volume2,
  BookOpen,
  MessageSquare,
  Clock,
  Sparkles,
  ChevronRight
} from "lucide-react";

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
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-background border border-border shadow-2xl backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Welcome back, <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">{user?.name || "Learner"}</span>! 🚀
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg text-sm md:text-base leading-relaxed">
          Ready to level up your English skills? Track your progress, achieve goals, and continue your personalized learning journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "Total Lessons", value: lessons.length, icon: "📚", text: "text-blue-500 dark:text-blue-400", border: "hover:border-blue-500/20" },
          { label: "Completed", value: 0, icon: "✅", text: "text-emerald-500 dark:text-emerald-400", border: "hover:border-emerald-500/20" },
          { label: "Current Streak", value: "0 days", icon: "🔥", text: "text-orange-500 dark:text-orange-400", border: "hover:border-orange-500/20 animate-pulse" },
          { label: "XP Points", value: 0, icon: "⭐", text: "text-purple-500 dark:text-purple-400", border: "hover:border-purple-500/20" },
        ].map((stat) => (
          <Card
            key={stat.label}
            interactive={true}
            className={`p-1 transition-all duration-300 ${stat.border}`}
          >
            <CardBody className="p-1 mb-0">
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl bg-foreground/5 w-10 h-10 rounded-xl flex items-center justify-center shadow-inner">{stat.icon}</span>
              </div>
              <p className={`text-3xl font-extrabold tracking-tight ${stat.text}`}>{stat.value}</p>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mt-2">{stat.label}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Start Lesson", href: "/lessons", icon: "📖", desc: "Continue learning", glow: "hover:border-indigo-500/20" },
            { label: "Practice", href: "/practice", icon: "🎯", desc: "Test your skills", glow: "hover:border-purple-500/20" },
            { label: "Vocabulary", href: "/vocabulary", icon: "💬", desc: "Learn new words", glow: "hover:border-emerald-500/20" },
            { label: "Quiz", href: "/quizzes", icon: "📝", desc: "Take a quiz", glow: "hover:border-orange-500/20" },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="block group">
              <Card
                interactive={true}
                className={`p-1 transition-all duration-300 h-full ${action.glow}`}
              >
                <CardBody className="mb-0 p-1 flex flex-col h-full">
                  <span className="text-3xl mb-3 block group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300">{action.icon}</span>
                  <h3 className="text-foreground font-bold text-sm group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">{action.label}</h3>
                  <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">{action.desc}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Lessons Section */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Your Lessons</h2>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground text-sm">Loading lessons...</p>
            </div>
          </div>
        ) : lessons.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white/[0.01] border border-border text-center">
            <span className="text-5xl mb-4 block">📚</span>
            <p className="text-foreground font-bold mb-2">No lessons available yet</p>
            <p className="text-muted-foreground text-sm">
              Check back soon for new content! We&apos;re preparing amazing lessons for you.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {lessons.map((lesson: any) => {
              // Get skill config
              const getSkillConfig = (skill: string) => {
                const configs: Record<string, { label: string; icon: any; color: string; bg: string; border: string }> = {
                  reading: { label: "Đọc", icon: BookOpenText, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
                  listening: { label: "Nghe", icon: Volume2, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
                  grammar: { label: "Ngữ pháp", icon: BookOpen, color: "text-indigo-400", bg: "bg-indigo-500/10", border: "border-indigo-500/20" },
                  speaking: { label: "Nói", icon: Volume2, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
                  writing: { label: "Viết", icon: MessageSquare, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" }
                };
                const sLower = (skill || "").toLowerCase();
                return configs[sLower] || { label: skill, icon: BookOpen, color: "text-slate-300", bg: "bg-white/5", border: "border-white/10" };
              };

              const skillConfig = getSkillConfig(lesson.skill);
              const SkillIcon = skillConfig.icon;

              return (
                <Card
                  key={lesson.id}
                  interactive={true}
                  className="hover:border-indigo-500/20 shadow-md transition-all duration-300 group flex flex-col justify-between"
                >
                  <CardBody className="p-1 mb-0 flex-1">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`p-1 rounded ${skillConfig.bg} ${skillConfig.color} border ${skillConfig.border}`}>
                          <SkillIcon className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{skillConfig.label}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/10">
                        {lesson.level}
                      </span>
                    </div>

                    <h3 className="text-foreground font-extrabold text-base group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 leading-snug mb-2">
                      {lesson.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-xs md:text-sm line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>

                    {/* Metadata duration/xp */}
                    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500">
                      {lesson.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-600" /> {lesson.duration} phút
                        </span>
                      )}
                      {lesson.xp && (
                        <span className="flex items-center gap-1 text-purple-400/90 font-semibold">
                          <Sparkles className="w-3 h-3" /> +{lesson.xp} XP
                        </span>
                      )}
                    </div>
                  </CardBody>
                  
                  <CardFooter className="bg-transparent border-none p-1 pt-4 flex justify-start items-center">
                    <Link href={`/lessons/${lesson.id}`} className="block w-full">
                      <Button variant="primary" className="w-full flex items-center gap-2 justify-center">
                        Bắt đầu
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
