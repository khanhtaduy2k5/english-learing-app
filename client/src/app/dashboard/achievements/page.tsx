"use client";

import { useState } from "react";

const achievements = [
  { id: 1, title: "First Steps", description: "Complete your first lesson", icon: "👣", xp: 50, unlocked: true, date: "Jan 5, 2026", rarity: "Common" },
  { id: 2, title: "Word Collector", description: "Learn 10 new vocabulary words", icon: "📚", xp: 100, unlocked: true, date: "Jan 12, 2026", rarity: "Common" },
  { id: 3, title: "Grammar Guru", description: "Complete all beginner grammar topics", icon: "📐", xp: 200, unlocked: true, date: "Feb 8, 2026", rarity: "Uncommon" },
  { id: 4, title: "Streak Master", description: "Maintain a 7-day learning streak", icon: "🔥", xp: 150, unlocked: true, date: "Feb 15, 2026", rarity: "Uncommon" },
  { id: 5, title: "Quiz Champion", description: "Score 100% on any quiz", icon: "🏆", xp: 300, unlocked: true, date: "Mar 3, 2026", rarity: "Rare" },
  { id: 6, title: "Polyglot Potential", description: "Reach intermediate level (B1)", icon: "🌍", xp: 500, unlocked: false, date: null, rarity: "Rare" },
  { id: 7, title: "Bookworm", description: "Complete 50 reading exercises", icon: "📖", xp: 400, unlocked: false, date: null, rarity: "Rare" },
  { id: 8, title: "Silver Tongue", description: "Score 90%+ on 10 speaking exercises", icon: "🗣️", xp: 350, unlocked: false, date: null, rarity: "Uncommon" },
  { id: 9, title: "Night Owl", description: "Study after midnight 5 times", icon: "🦉", xp: 200, unlocked: true, date: "Mar 20, 2026", rarity: "Uncommon" },
  { id: 10, title: "Perfectionist", description: "Score 100% on 5 different quizzes", icon: "💎", xp: 750, unlocked: false, date: null, rarity: "Epic" },
  { id: 11, title: "Marathon Learner", description: "Study for 100 hours total", icon: "⏱️", xp: 1000, unlocked: false, date: null, rarity: "Epic" },
  { id: 12, title: "Lingua Master", description: "Complete all lessons and reach C1 level", icon: "👑", xp: 2000, unlocked: false, date: null, rarity: "Legendary" },
];

const rarityColors: Record<string, { text: string; bg: string; border: string; glow: string }> = {
  Common: { text: "text-slate-300", bg: "bg-slate-500/20", border: "border-slate-500/20", glow: "" },
  Uncommon: { text: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/20", glow: "shadow-emerald-500/10" },
  Rare: { text: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/20", glow: "shadow-blue-500/10" },
  Epic: { text: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/20", glow: "shadow-purple-500/20" },
  Legendary: { text: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/20", glow: "shadow-amber-500/20" },
};

export default function AchievementsPage() {
  const [filter, setFilter] = useState("All");
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalXP = achievements.filter((a) => a.unlocked).reduce((a, b) => a + b.xp, 0);
  const filters = ["All", "Unlocked", "Locked"];

  const filtered = achievements.filter((a) => {
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
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Achievements</h1>
            <p className="text-slate-400 text-sm">Celebrate your learning milestones</p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/10 border border-amber-500/20">
          <p className="text-slate-400 text-sm">Unlocked</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">{unlockedCount}/{achievements.length}</p>
          <div className="w-full h-1.5 rounded-full bg-white/5 mt-3">
            <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400" style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/20">
          <p className="text-slate-400 text-sm">Total XP Earned</p>
          <p className="text-2xl font-bold text-purple-400 mt-1">{totalXP.toLocaleString()}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-blue-500/10 border border-indigo-500/20">
          <p className="text-slate-400 text-sm">Rarest Achievement</p>
          <p className="text-2xl font-bold text-indigo-400 mt-1">
            {achievements.filter((a) => a.unlocked && a.rarity === "Rare").length > 0 ? "Rare" : "Uncommon"}
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
                : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
        {filtered.map((achievement) => {
          const rarity = rarityColors[achievement.rarity] || rarityColors.Common;
          return (
            <div
              key={achievement.id}
              className={`relative p-6 rounded-2xl border transition-all duration-300 overflow-hidden ${
                achievement.unlocked
                  ? `bg-white/[0.03] ${rarity.border} hover:bg-white/[0.06] hover:-translate-y-1 shadow-lg ${rarity.glow}`
                  : "bg-white/[0.01] border-white/5 opacity-50"
              }`}
            >
              {/* Rarity badge */}
              <div className="flex justify-between items-start mb-4">
                <span className={`text-4xl ${achievement.unlocked ? "" : "grayscale"}`}>
                  {achievement.icon}
                </span>
                <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${rarity.bg} ${rarity.text} border ${rarity.border}`}>
                  {achievement.rarity}
                </span>
              </div>

              <h3 className={`text-lg font-bold mb-1 ${achievement.unlocked ? "text-white" : "text-slate-600"}`}>
                {achievement.title}
              </h3>
              <p className={`text-sm mb-4 ${achievement.unlocked ? "text-slate-400" : "text-slate-600"}`}>
                {achievement.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-medium ${rarity.text}`}>+{achievement.xp} XP</span>
                {achievement.unlocked ? (
                  <span className="text-xs text-slate-500">{achievement.date}</span>
                ) : (
                  <span className="flex items-center gap-1 text-xs text-slate-600">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
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
