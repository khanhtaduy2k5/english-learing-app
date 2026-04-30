"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">
            📚 English Learning
          </h1>
          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-gray-700">Welcome, {user?.name}</span>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Learn English Fluently
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Master English through interactive lessons, quizzes, and
            personalized learning paths.
          </p>
          {!isAuthenticated && (
            <button
              onClick={() => router.push("/register")}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700"
            >
              Get Started Now
            </button>
          )}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">🎓</div>
            <h3 className="text-xl font-bold mb-4">Structured Lessons</h3>
            <p className="text-gray-600">
              Learn from beginner to advanced levels with carefully curated
              lessons.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold mb-4">Interactive Quizzes</h3>
            <p className="text-gray-600">
              Test your knowledge with engaging quizzes and track your progress.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-4">Progress Tracking</h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed analytics and
              statistics.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
