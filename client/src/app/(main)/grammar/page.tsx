"use client";

import { useState } from "react";

const grammarTopics = [
  {
    id: 1,
    title: "Present Simple vs Present Continuous",
    category: "Tenses",
    difficulty: "Beginner",
    description: "Learn when to use present simple and present continuous tenses with clear examples and exercises.",
    progress: 75,
    lessons: 5,
    completed: 3,
  },
  {
    id: 2,
    title: "Past Perfect & Past Perfect Continuous",
    category: "Tenses",
    difficulty: "Intermediate",
    description: "Master the past perfect tenses to describe actions completed before other past actions.",
    progress: 40,
    lessons: 4,
    completed: 2,
  },
  {
    id: 3,
    title: "Conditional Sentences (Type 0-3)",
    category: "Conditionals",
    difficulty: "Intermediate",
    description: "Understand and practice all four types of conditional sentences in English.",
    progress: 0,
    lessons: 6,
    completed: 0,
  },
  {
    id: 4,
    title: "Passive Voice",
    category: "Voice",
    difficulty: "Beginner",
    description: "Transform active sentences into passive voice and understand when to use each form.",
    progress: 100,
    lessons: 3,
    completed: 3,
  },
  {
    id: 5,
    title: "Relative Clauses",
    category: "Clauses",
    difficulty: "Intermediate",
    description: "Use defining and non-defining relative clauses to add detail to your sentences.",
    progress: 20,
    lessons: 4,
    completed: 1,
  },
  {
    id: 6,
    title: "Reported Speech",
    category: "Speech",
    difficulty: "Advanced",
    description: "Learn to convert direct speech into reported speech with proper tense and pronoun changes.",
    progress: 0,
    lessons: 5,
    completed: 0,
  },
  {
    id: 7,
    title: "Articles (a, an, the)",
    category: "Determiners",
    difficulty: "Beginner",
    description: "Master the rules for using definite and indefinite articles in English sentences.",
    progress: 60,
    lessons: 3,
    completed: 2,
  },
  {
    id: 8,
    title: "Subjunctive Mood",
    category: "Mood",
    difficulty: "Advanced",
    description: "Explore the subjunctive mood for expressing wishes, suggestions, and hypothetical situations.",
    progress: 0,
    lessons: 4,
    completed: 0,
  },
];

const difficultyConfig: Record<string, { color: string; bg: string; border: string }> = {
  Beginner: { color: "text-emerald-400", bg: "bg-emerald-500/20", border: "border-emerald-500/20" },
  Intermediate: { color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/20" },
  Advanced: { color: "text-rose-400", bg: "bg-rose-500/20", border: "border-rose-500/20" },
};

export default function GrammarPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const allCategories = ["All", ...Array.from(new Set(grammarTopics.map((t) => t.category)))];

  const filtered = grammarTopics.filter(
    (t) => selectedCategory === "All" || t.category === selectedCategory
  );

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Grammar</h1>
            <p className="text-slate-400 text-sm">Master English grammar rules and structures</p>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allCategories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              selectedCategory === c
                ? "bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-white border border-amber-500/30"
                : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grammar Topics */}
      <div className="space-y-4">
        {filtered.map((topic) => {
          const dc = difficultyConfig[topic.difficulty] || difficultyConfig.Beginner;
          const isExpanded = expandedId === topic.id;

          return (
            <div
              key={topic.id}
              className={`rounded-2xl bg-white/[0.03] border transition-all duration-300 overflow-hidden ${
                isExpanded ? "border-indigo-500/20 bg-white/[0.05]" : "border-white/5 hover:border-white/10"
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : topic.id)}
                className="w-full p-6 text-left flex items-center gap-6"
              >
                {/* Progress Circle */}
                <div className="relative w-14 h-14 flex-shrink-0">
                  <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                    <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                    <circle
                      cx="28" cy="28" r="24" fill="none"
                      stroke="url(#grad)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeDasharray={`${(topic.progress / 100) * 150.796} 150.796`}
                    />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                    {topic.progress}%
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-white truncate">{topic.title}</h3>
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${dc.bg} ${dc.color} ${dc.border} border flex-shrink-0`}>
                      {topic.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm truncate">{topic.description}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-xs text-slate-500">{topic.completed}/{topic.lessons} lessons</span>
                    <span className="text-xs text-slate-600">•</span>
                    <span className="text-xs text-slate-500">{topic.category}</span>
                  </div>
                </div>

                {/* Arrow */}
                <svg
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-6 pb-6 pt-0 border-t border-white/5">
                  <div className="pt-5">
                    <p className="text-slate-300 mb-6">{topic.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Array.from({ length: topic.lessons }, (_, i) => (
                        <div
                          key={i}
                          className={`p-4 rounded-xl border transition-all ${
                            i < topic.completed
                              ? "bg-emerald-500/10 border-emerald-500/20"
                              : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {i < topic.completed ? (
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                <span className="text-xs font-bold text-slate-500">{i + 1}</span>
                              </div>
                            )}
                            <div>
                              <p className={`text-sm font-medium ${i < topic.completed ? "text-emerald-300" : "text-white"}`}>
                                Lesson {i + 1}
                              </p>
                              <p className="text-xs text-slate-500">
                                {i < topic.completed ? "Completed" : "Not started"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="mt-5 w-full px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-indigo-500/20">
                      {topic.progress === 100 ? "Review Again" : topic.progress > 0 ? "Continue Learning" : "Start Topic"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
