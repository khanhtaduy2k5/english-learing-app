"use client";

const weeklyData = [
  { day: "Mon", minutes: 45, lessons: 3 },
  { day: "Tue", minutes: 30, lessons: 2 },
  { day: "Wed", minutes: 60, lessons: 4 },
  { day: "Thu", minutes: 20, lessons: 1 },
  { day: "Fri", minutes: 50, lessons: 3 },
  { day: "Sat", minutes: 75, lessons: 5 },
  { day: "Sun", minutes: 40, lessons: 2 },
];

const skillBreakdown = [
  { skill: "Speaking", level: 65, color: "from-rose-500 to-pink-500" },
  { skill: "Listening", level: 78, color: "from-blue-500 to-cyan-500" },
  { skill: "Reading", level: 85, color: "from-emerald-500 to-green-500" },
  { skill: "Writing", level: 58, color: "from-amber-500 to-yellow-500" },
  { skill: "Grammar", level: 72, color: "from-violet-500 to-purple-500" },
  { skill: "Vocabulary", level: 80, color: "from-indigo-500 to-blue-500" },
];

const milestones = [
  { id: 1, title: "First Lesson Completed", date: "Jan 5, 2026", done: true },
  { id: 2, title: "10 Words Mastered", date: "Jan 12, 2026", done: true },
  { id: 3, title: "Complete Beginner Level", date: "Feb 2, 2026", done: true },
  { id: 4, title: "50 Words Mastered", date: "Mar 15, 2026", done: true },
  { id: 5, title: "Reach Intermediate Level", date: "In progress", done: false },
  { id: 6, title: "100 Words Mastered", date: "Locked", done: false },
];

const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes));

export default function ProgressPage() {
  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Progress</h1>
            <p className="text-slate-400 text-sm">Track your learning journey</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Study Time", value: "32h 15m", icon: "⏱️", color: "from-blue-500/20 to-cyan-500/10", border: "border-blue-500/20", text: "text-blue-400" },
          { label: "Lessons Completed", value: "24", icon: "📚", color: "from-emerald-500/20 to-green-500/10", border: "border-emerald-500/20", text: "text-emerald-400" },
          { label: "Current Level", value: "B1", icon: "📊", color: "from-purple-500/20 to-pink-500/10", border: "border-purple-500/20", text: "text-purple-400" },
          { label: "Daily Streak", value: "12 days", icon: "🔥", color: "from-orange-500/20 to-amber-500/10", border: "border-orange-500/20", text: "text-orange-400" },
        ].map((stat) => (
          <div key={stat.label} className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} border ${stat.border}`}>
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <p className={`text-2xl font-bold ${stat.text}`}>{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Weekly Activity Chart */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Weekly Activity</h3>
          <div className="flex items-end gap-3 h-48">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">{d.minutes}m</span>
                <div className="w-full relative rounded-t-lg overflow-hidden bg-white/5" style={{ height: "100%" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-gradient-to-t from-indigo-600 to-purple-500 transition-all duration-700"
                    style={{ height: `${(d.minutes / maxMinutes) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-500">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6 text-xs text-slate-400">
            <span>Total: {weeklyData.reduce((a, d) => a + d.minutes, 0)} min</span>
            <span>•</span>
            <span>Avg: {Math.round(weeklyData.reduce((a, d) => a + d.minutes, 0) / 7)} min/day</span>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <h3 className="text-lg font-bold text-white mb-6">Skill Breakdown</h3>
          <div className="space-y-5">
            {skillBreakdown.map((skill) => (
              <div key={skill.skill}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-white font-medium">{skill.skill}</span>
                  <span className="text-sm text-slate-400">{skill.level}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Milestones */}
      <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
        <h3 className="text-lg font-bold text-white mb-6">Learning Milestones</h3>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/5"></div>

          <div className="space-y-6">
            {milestones.map((m, i) => (
              <div key={m.id} className="flex items-start gap-5 relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                  m.done
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/20"
                    : i === milestones.findIndex((x) => !x.done)
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 animate-pulse"
                    : "bg-white/5 border border-white/10"
                }`}>
                  {m.done ? (
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : i === milestones.findIndex((x) => !x.done) ? (
                    <span className="text-white text-xs font-bold">NOW</span>
                  ) : (
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>
                <div className="pt-2">
                  <h4 className={`font-semibold ${m.done ? "text-white" : "text-slate-500"}`}>{m.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{m.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
