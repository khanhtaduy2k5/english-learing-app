"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardBody } from "@/components/Card";

export default function DashboardPage() {
  const { user } = useAuth();

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
          { label: "Available Exams", value: 5, icon: "📚", text: "text-blue-500 dark:text-blue-400", border: "hover:border-blue-500/20" },
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
            { label: "Start Reading", href: "/reading", icon: "📖", desc: "Read stories & articles", glow: "hover:border-indigo-500/20" },
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
    </div>
  );
}
