"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";

export default function DashboardPage() {
  const { isAuthenticated, user, isReady } = useAuth();
  const { logout } = useAuthStore();
  const router = useRouter();
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isReady, router]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        // Replace with actual API endpoint
        const data = await apiClient.get<any[]>("/api/lessons");
        setLessons(data || []);
      } catch (err) {
        console.error("Failed to fetch lessons:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchLessons();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
    router.push("/");
  };

  if (!isReady || !isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back, {user?.name}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 font-medium mb-2">Total Lessons</h3>
            <p className="text-3xl font-bold text-blue-600">{lessons.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 font-medium mb-2">
              Lessons Completed
            </h3>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 font-medium mb-2">Current Streak</h3>
            <p className="text-3xl font-bold text-orange-600">0 days</p>
          </div>
        </div>

        {/* Lessons */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Your Lessons
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading lessons...</p>
            </div>
          ) : lessons.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-gray-600 mb-4">No lessons available yet</p>
              <p className="text-sm text-gray-500">
                Check back soon for new content!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson: any) => (
                <div
                  key={lesson.id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {lesson.title}
                      </h3>
                      <p className="text-sm text-blue-600 mt-1">
                        {lesson.level}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">
                    {lesson.description}
                  </p>
                  <Link
                    href={`/lessons/${lesson.id}`}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    Start Lesson
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
