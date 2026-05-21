"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const data = await apiClient.get<Lesson[]>("/api/lessons");
        setLessons(data);
      } catch (error) {
        console.error("Failed to fetch lessons", error);
        // Fallback dummy data for UI if API fails
        setLessons([
          { id: "1", title: "Basic Greetings", description: "Learn how to say hello.", level: "BEGINNER" },
          { id: "2", title: "Common Verbs", description: "Action words for daily use.", level: "BEGINNER" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Lessons</h1>
        <p className="text-slate-400">Explore and start learning new topics.</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <Link href={`/lessons/${lesson.id}`} key={lesson.id} className="block group">
              <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:border-white/10 hover:shadow-xl hover:scale-[1.02]">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{lesson.title}</h2>
                  <span className="text-xs font-semibold px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg">{lesson.level}</span>
                </div>
                <p className="text-slate-400 text-sm mb-6">{lesson.description}</p>
                <div className="flex items-center text-indigo-400 text-sm font-medium">
                  Start Lesson
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
