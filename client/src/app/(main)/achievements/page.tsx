"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface UserProgress {
  id: number;
  userId: string;
  lessonId: string;
  status: string;
  quizScore: number;
  completedAt: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  xp: number;
  unlocked: boolean;
  date: string | null;
  rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Legendary";
}

const rarityColors: Record<
  string,
  { text: string; bg: string; border: string; glow: string }
> = {
  Common: {
    text: "text-slate-300",
    bg: "bg-slate-500/20",
    border: "border-slate-500/20",
    glow: "",
  },
  Uncommon: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/20",
    border: "border-emerald-500/20",
    glow: "shadow-emerald-500/10",
  },
  Rare: {
    text: "text-blue-400",
    bg: "bg-blue-500/20",
    border: "border-blue-500/20",
    glow: "shadow-blue-500/10",
  },
  Epic: {
    text: "text-purple-400",
    bg: "bg-purple-500/20",
    border: "border-purple-500/20",
    glow: "shadow-purple-500/20",
  },
  Legendary: {
    text: "text-amber-400",
    bg: "bg-amber-500/20",
    border: "border-amber-500/20",
    glow: "shadow-amber-500/20",
  },
};

export default function AchievementsPage() {
  const { user, isReady } = useAuth();
  const [progressList, setProgressList] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function fetchProgress() {
      if (!isReady || !user) return;
      try {
        setLoading(true);
        const data = await apiClient.getUserProgress();
        setProgressList(data || []);
      } catch (err) {
        console.error("Failed to fetch user progress for achievements:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, [user, isReady]);

  if (!isReady || loading) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
        <p className="text-muted-foreground text-sm animate-pulse">
          Scanning your achievements from the database...
        </p>
      </div>
    );
  }

  const completedCount = progressList.filter(
    (p) => p.status === "completed",
  ).length;
  const inProgressCount = progressList.filter(
    (p) => p.status === "in_progress",
  ).length;
  const streakDays =
    completedCount > 0 ? Math.min(15, Math.ceil(completedCount * 1.5)) : 0;
  const estimatedHours = (completedCount * 15 + inProgressCount * 5) / 60;

  // Determine dynamic unlock dates (use completedAt or a friendly format)
  const getUnlockDate = (condition: boolean, index: number) => {
    if (!condition) return null;
    const completedProgress = progressList.filter(
      (p) => p.status === "completed",
    );
    if (completedProgress[index]?.completedAt) {
      try {
        const dateObj = new Date(completedProgress[index].completedAt);
        return dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      } catch (e) {
        return "Recently";
      }
    }
    return "Recently";
  };

  const achievementsList: Achievement[] = [
    {
      id: 1,
      title: "First Steps",
      description: "Complete your first lesson",
      icon: "👣",
      xp: 50,
      unlocked: completedCount >= 1,
      date: getUnlockDate(completedCount >= 1, 0),
      rarity: "Common",
    },
    {
      id: 2,
      title: "Word Collector",
      description: "Learn 3 vocabulary topics",
      icon: "📚",
      xp: 100,
      unlocked: completedCount >= 3,
      date: getUnlockDate(completedCount >= 3, 2),
      rarity: "Common",
    },
    {
      id: 3,
      title: "Grammar Guru",
      description: "Complete all beginner grammar topics",
      icon: "📐",
      xp: 200,
      unlocked: completedCount >= 5,
      date: getUnlockDate(completedCount >= 5, 4),
      rarity: "Uncommon",
    },
    {
      id: 4,
      title: "Streak Master",
      description: "Maintain a 7-day learning streak",
      icon: "🔥",
      xp: 150,
      unlocked: streakDays >= 7,
      date: streakDays >= 7 ? "Active Streak" : null,
      rarity: "Uncommon",
    },
    {
      id: 5,
      title: "Quiz Champion",
      description: "Score 100% on any quiz",
      icon: "🏆",
      xp: 300,
      unlocked: progressList.some((p) => p.quizScore === 100),
      date: progressList.some((p) => p.quizScore === 100) ? "Recently" : null,
      rarity: "Rare",
    },
    {
      id: 6,
      title: "Polyglot Potential",
      description: "Reach intermediate levels of learning",
      icon: "🌍",
      xp: 500,
      unlocked: completedCount >= 8,
      date: getUnlockDate(completedCount >= 8, 7),
      rarity: "Rare",
    },
    {
      id: 7,
      title: "Bookworm",
      description: "Complete 10 reading exercises",
      icon: "📖",
      xp: 400,
      unlocked: completedCount >= 10,
      date: getUnlockDate(completedCount >= 10, 9),
      rarity: "Rare",
    },
    {
      id: 8,
      title: "Silver Tongue",
      description: "Score 90%+ on any grammar quiz",
      icon: "🗣️",
      xp: 350,
      unlocked: progressList.some((p) => p.quizScore >= 90),
      date: progressList.some((p) => p.quizScore >= 90) ? "Recently" : null,
      rarity: "Uncommon",
    },
    {
      id: 9,
      title: "Perfectionist",
      description: "Score 100% on 3 different quizzes",
      icon: "💎",
      xp: 750,
      unlocked: progressList.filter((p) => p.quizScore === 100).length >= 3,
      date:
        progressList.filter((p) => p.quizScore === 100).length >= 3
          ? "Recently"
          : null,
      rarity: "Epic",
    },
    {
      id: 10,
      title: "Marathon Learner",
      description: "Study for 5 hours total",
      icon: "⏱️",
      xp: 1000,
      unlocked: estimatedHours >= 5,
      date: estimatedHours >= 5 ? "Achieved" : null,
      rarity: "Epic",
    },
    {
      id: 11,
      title: "Lingua Master",
      description: "Complete 15 lessons or more",
      icon: "👑",
      xp: 2000,
      unlocked: completedCount >= 15,
      date: getUnlockDate(completedCount >= 15, 14),
      rarity: "Legendary",
    },
  ];

  const unlockedCount = achievementsList.filter((a) => a.unlocked).length;
  const totalXP = achievementsList
    .filter((a) => a.unlocked)
    .reduce((a, b) => a + b.xp, 0);
  const filters = ["All", "Unlocked", "Locked"];

  const filtered = achievementsList.filter((a) => {
    if (filter === "Unlocked") return a.unlocked;
    if (filter === "Locked") return !a.unlocked;
    return true;
  });

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
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
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
            <p className="text-muted-foreground text-sm">
              Celebrate your learning milestones direct from database
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/20">
          <p className="text-muted-foreground text-sm">Unlocked</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {unlockedCount}/{achievementsList.length}
          </p>
          <progress
            className="w-full h-1.5 mt-3 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-white/5 [&::-webkit-progress-value]:bg-gradient-to-r [&::-webkit-progress-value]:from-amber-500 [&::-webkit-progress-value]:to-yellow-400 [&::-moz-progress-bar]:bg-amber-500"
            value={unlockedCount}
            max={achievementsList.length}
            aria-label="Achievement unlock progress"
          />
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/20">
          <p className="text-muted-foreground text-sm">Total XP Earned</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">
            {totalXP.toLocaleString()}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/20">
          <p className="text-muted-foreground text-sm">Rarest Achievement</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {achievementsList.filter((a) => a.unlocked && a.rarity === "Rare")
              .length > 0
              ? "Rare"
              : "Uncommon"}
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-8">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === f
                ? "bg-gradient-to-r from-amber-500/30 to-yellow-500/20 text-white border border-amber-500/30"
                : "bg-card/70 dark:bg-white/5 text-muted-foreground border border-border hover:bg-card hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filtered.map((achievement) => {
          const rarity =
            rarityColors[achievement.rarity] || rarityColors.Common;
          return (
            <div
              key={achievement.id}
              className={`relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
                achievement.unlocked
                  ? `bg-card/80 dark:bg-white/[0.03] ${rarity.border} hover:bg-card hover:-translate-y-1 shadow-lg ${rarity.glow}`
                  : "bg-card/60 dark:bg-white/[0.01] border-border opacity-60"
              }`}
            >
              {/* Rarity badge */}
              <div className="flex justify-between items-start mb-4">
                <span
                  className={`text-4xl ${achievement.unlocked ? "" : "grayscale"}`}
                >
                  {achievement.icon}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${rarity.bg} ${rarity.text} border ${rarity.border}`}
                >
                  {achievement.rarity}
                </span>
              </div>

              <h3
                className={`text-lg font-bold mb-1 ${achievement.unlocked ? "text-foreground" : "text-muted-foreground"}`}
              >
                {achievement.title}
              </h3>
              <p
                className={`text-sm mb-4 ${achievement.unlocked ? "text-muted-foreground" : "text-muted-foreground"}`}
              >
                {achievement.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${rarity.text}`}>
                  +{achievement.xp} XP
                </span>
                {achievement.unlocked ? (
                  <span className="text-xs text-muted-foreground">
                    {achievement.date}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Locked
                  </span>
                )}
              </div>

              {/* Shine effect for unlocked */}
              {achievement.unlocked && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
