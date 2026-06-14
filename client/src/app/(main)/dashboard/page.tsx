"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardBody } from "@/components/Card";
import { apiClient } from "@/lib/api";
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Award,
  Sparkles,
  Newspaper,
  Target,
  BookMarked,
  ClipboardList
} from "lucide-react";

interface Quote {
  content: string;
  author: string;
}

export default function DashboardPage() {
  const { user } = useAuth();

  // State for Daily Quote
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    let isMounted = true;

    async function loadDashboardData() {
      try {
        const quoteData = await apiClient.getDailyQuote();
        if (isMounted) {
          setQuote(quoteData);
          setLoadingQuote(false);
        }
      } catch (err) {
        console.error("Failed to load daily quote:", err);
        if (isMounted) setLoadingQuote(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Welcome Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-100 via-violet-100 to-background dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-background border border-border shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-3xl -z-10"></div>
        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
            {user?.name || "Learner"}
          </span>
          <Sparkles className="w-7 h-7 text-indigo-500 dark:text-indigo-400 animate-pulse" />
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg text-sm md:text-base leading-relaxed">
          Ready to level up your English skills? Track your progress, achieve
          goals, and continue your personalized learning journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          {
            label: "Available Exams",
            value: 5,
            icon: <BookOpen className="w-5 h-5" />,
            text: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
            border: "hover:border-blue-500/20 dark:hover:border-blue-400/20",
          },
          {
            label: "Completed",
            value: 0,
            icon: <GraduationCap className="w-5 h-5" />,
            text: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            border: "hover:border-emerald-500/20 dark:hover:border-emerald-400/20",
          },
          {
            label: "Current Streak",
            value: "0 days",
            icon: <TrendingUp className="w-5 h-5 animate-pulse" />,
            text: "text-orange-600 dark:text-orange-400",
            bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
            border: "hover:border-orange-500/20 dark:hover:border-orange-400/20",
          },
          {
            label: "XP Points",
            value: 0,
            icon: <Award className="w-5 h-5" />,
            text: "text-purple-600 dark:text-purple-400",
            bg: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
            border: "hover:border-purple-500/20 dark:hover:border-purple-400/20",
          },
        ].map((stat) => (
          <Card
            key={stat.label}
            interactive={true}
            className={`p-1 glass-panel glass-panel-hover transition-all duration-300 hover:scale-[1.02] cursor-pointer ${stat.border}`}
          >
            <CardBody className="p-5 mb-0">
              <div className="flex items-center justify-between mb-3">
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner ${stat.bg}`}>
                  {stat.icon}
                </span>
              </div>
              <p
                className={`text-3xl font-extrabold tracking-tight ${stat.text}`}
              >
                {stat.value}
              </p>
              <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mt-2">
                {stat.label}
              </p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Dynamic Interactive Widgets */}
      <div>
        {/* Quote of the Day - Premium Glassmorphism UI */}
        <div className="relative p-6 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-background border border-border shadow-xl backdrop-blur-md flex flex-col justify-between min-h-[180px] group transition-all duration-300 hover:shadow-indigo-500/5 hover:border-indigo-500/20 w-full glass-panel">
          <div className="absolute -top-10 -left-6 text-9xl text-indigo-500/10 dark:text-indigo-400/5 font-serif select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
            “
          </div>

          <div className="relative z-10 space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" /> Quote of the Day
            </span>
            {loadingQuote ? (
              <div className="space-y-2 animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
              </div>
            ) : (
              <p className="text-base md:text-lg font-medium text-foreground leading-relaxed italic pr-4 font-serif">
                {quote?.content || "No quote loaded"}
              </p>
            )}
          </div>

          <div className="relative z-10 mt-4 flex items-center justify-between border-t border-border/40 pt-4">
            <span className="text-xs text-muted-foreground">
              Expand your perspective
            </span>
            {!loadingQuote && (
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/5 px-2.5 py-1 rounded-lg border border-indigo-500/10">
                — {quote?.author || "Unknown"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "English News",
              href: "/news",
              icon: <Newspaper className="w-6 h-6" />,
              desc: "Read daily news articles",
              accent: "text-indigo-500 dark:text-indigo-400 bg-indigo-500/10",
              glow: "hover:border-indigo-500/30 dark:hover:border-indigo-400/30",
            },
            {
              label: "Practice",
              href: "/practice",
              icon: <Target className="w-6 h-6" />,
              desc: "Test your skills",
              accent: "text-purple-500 dark:text-purple-400 bg-purple-500/10",
              glow: "hover:border-purple-500/30 dark:hover:border-purple-400/30",
            },
            {
              label: "Vocabulary",
              href: "/vocabulary",
              icon: <BookMarked className="w-6 h-6" />,
              desc: "Learn new words",
              accent: "text-emerald-500 dark:text-emerald-400 bg-emerald-500/10",
              glow: "hover:border-emerald-500/30 dark:hover:border-emerald-400/30",
            },
            {
              label: "Quiz",
              href: "/quizzes",
              icon: <ClipboardList className="w-6 h-6" />,
              desc: "Take a quiz",
              accent: "text-orange-500 dark:text-orange-400 bg-orange-500/10",
              glow: "hover:border-orange-500/30 dark:hover:border-orange-400/30",
            },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="block group cursor-pointer btn-press">
              <Card
                interactive={true}
                className={`p-1 glass-panel glass-panel-hover transition-all duration-300 h-full hover:scale-[1.02] ${action.glow}`}
              >
                <CardBody className="mb-0 p-5 flex flex-col h-full">
                  <span className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 shadow-sm ${action.accent}`}>
                    {action.icon}
                  </span>
                  <h3 className="text-foreground font-bold text-sm group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {action.label}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1.5 leading-relaxed">
                    {action.desc}
                  </p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
