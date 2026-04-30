"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/lib/api";

export default function LessonPage({ params }: { params: { id: string } }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const data = await apiClient.get(`/api/lessons/${params.id}`);
        setLesson(data);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading lesson...</p>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Lesson not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white p-8 rounded-lg shadow">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {lesson.level}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {lesson.title}
          </h2>

          <p className="text-gray-600 mb-8">{lesson.description}</p>

          <div className="prose max-w-none">
            <div className="bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
              {lesson.content}
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={() => router.push(`/lessons/${lesson.id}/quiz`)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Take Quiz
            </button>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
