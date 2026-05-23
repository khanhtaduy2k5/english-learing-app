"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { ReadingPassage } from "@/types";

const difficultyConfig: Record<string, { color: string; bg: string; border: string }> = {
  A1: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  A2: { color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  B1: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  B2: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  C1: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  C2: { color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
};

export default function ReadingPage() {
  const { user } = useAuthStore();
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("All");
  
  // Reading mode state
  const [activePassageId, setActivePassageId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await apiClient.getReadingPassages();
        setPassages(data);
      } catch (err) {
        console.error("Failed to load reading passages", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const allLevels = ["All", ...Array.from(new Set(passages.map((p) => p.level).filter(Boolean)))];

  const filteredPassages = passages.filter(
    (p) => selectedLevel === "All" || p.level === selectedLevel
  );

  const activePassage = passages.find((p) => p.id === activePassageId);

  const handleSelectPassage = (id: string) => {
    setActivePassageId(id);
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  };

  const handleSelectOption = (qIdx: number, option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qIdx]: option }));
  };

  const handleSubmitQuiz = async () => {
    if (!activePassage || submitted) return;
    
    // Calculate score
    let correctCount = 0;
    activePassage.questions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.answer) {
        correctCount++;
      }
    });

    const totalQuestions = activePassage.questions.length;
    const finalScore = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    
    setScore(finalScore);
    setSubmitted(true);

    // Save progress to Supabase
    if (user?.id) {
      try {
        await apiClient.updateProgress(user.id, activePassage.id, "completed", finalScore);
        console.log("Reading progress saved successfully!");
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    }
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Reading Comprehension</h1>
              <p className="text-slate-400 text-sm">Enhance your reading skills and check comprehension</p>
            </div>
          </div>

          {activePassageId && (
            <button
              onClick={() => setActivePassageId(null)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold"
            >
              Back to Catalog
            </button>
          )}
        </div>
      </div>

      {!activePassageId ? (
        <>
          {/* Level Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {allLevels.map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedLevel === lvl
                    ? "bg-gradient-to-r from-emerald-500/30 to-teal-500/20 text-white border border-emerald-500/30 shadow-lg"
                    : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-t-emerald-500 border-white/10 animate-spin" />
              <p className="text-slate-400 text-sm">Loading reading database...</p>
            </div>
          ) : filteredPassages.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl p-8">
              <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-bold text-white mb-2">No Passages Found</h3>
              <p className="text-slate-400 text-sm">Try choosing another language level filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPassages.map((passage) => {
                const dc = difficultyConfig[passage.level] || { color: "text-slate-400", bg: "bg-white/10", border: "border-white/5" };

                return (
                  <div
                    key={passage.id}
                    className="rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300 p-6 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/5 group"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${dc.bg} ${dc.color} ${dc.border} border`}>
                          {passage.level}
                        </span>
                        <span className="text-xs text-slate-500">{passage.questions.length} questions</span>
                      </div>
                      <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 line-clamp-1">{passage.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                        {passage.passageText}
                      </p>
                    </div>

                    <button
                      onClick={() => handleSelectPassage(passage.id)}
                      className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all duration-300 text-sm"
                    >
                      Start Reading
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        activePassage && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left Column: Reading Text (7/12 width) */}
            <div className="lg:col-span-7 rounded-2xl bg-white/[0.02] border border-white/5 p-8 flex flex-col h-[70vh] overflow-y-auto custom-scrollbar shadow-inner">
              <div className="border-b border-white/5 pb-4 mb-6">
                <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">{activePassage.level} Reading</span>
                <h2 className="text-2xl font-bold text-white mt-1">{activePassage.title}</h2>
              </div>
              <div className="text-slate-300 leading-loose text-base font-medium space-y-4 whitespace-pre-wrap select-text selection:bg-emerald-500/30">
                {activePassage.passageText}
              </div>
            </div>

            {/* Right Column: Interactive Questions (5/12 width) */}
            <div className="lg:col-span-5 flex flex-col h-[70vh] overflow-y-auto space-y-4 pr-1">
              {activePassage.questions.map((q: any, qIdx: number) => {
                const selectedOpt = answers[qIdx];
                const showQFeedback = submitted;
                const isQCorrect = selectedOpt === q.answer;

                return (
                  <div
                    key={qIdx}
                    className={`p-6 rounded-2xl bg-white/[0.03] border transition-all duration-300 ${
                      showQFeedback
                        ? isQCorrect
                          ? "border-emerald-500/20 bg-emerald-500/[0.02]"
                          : "border-rose-500/20 bg-rose-500/[0.02]"
                        : selectedOpt
                        ? "border-indigo-500/20"
                        : "border-white/5"
                    }`}
                  >
                    <div className="flex gap-3 mb-4">
                      <span className="w-6 h-6 rounded-full bg-white/5 text-slate-400 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-white font-medium text-sm leading-relaxed">{q.question}</h4>
                    </div>

                    <div className="grid grid-cols-1 gap-2">
                      {(q.options as string[]).map((option) => {
                        const isOptionSelected = selectedOpt === option;
                        const isOptionCorrect = option === q.answer;

                        let style = "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10";
                        if (showQFeedback) {
                          if (isOptionCorrect) {
                            style = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                          } else if (isOptionSelected) {
                            style = "bg-rose-500/20 border-rose-500/40 text-rose-300";
                          } else {
                            style = "bg-white/2 border-white/2 text-slate-500 pointer-events-none";
                          }
                        } else if (isOptionSelected) {
                          style = "bg-emerald-500/10 border-emerald-500/30 text-emerald-300";
                        }

                        return (
                          <button
                            key={option}
                            disabled={submitted}
                            onClick={() => handleSelectOption(qIdx, option)}
                            className={`w-full p-4 rounded-xl border text-left text-xs transition-all duration-200 ${style}`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>

                    {showQFeedback && q.explanation && (
                      <div className="p-4 rounded-xl bg-white/5 border border-white/5 mt-3 text-xs text-slate-400 leading-relaxed">
                        <span className="font-bold text-slate-300 block mb-1">Explanation:</span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Submit Area */}
              <div className="pt-2">
                {!submitted ? (
                  <button
                    disabled={Object.keys(answers).length < activePassage.questions.length}
                    onClick={handleSubmitQuiz}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold transition-all duration-300 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:pointer-events-none active:scale-98 text-sm"
                  >
                    Submit Answers ({Object.keys(answers).length}/{activePassage.questions.length})
                  </button>
                ) : (
                  <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center">
                      <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">Comprehension Complete!</h4>
                      <p className="text-slate-400 text-xs mt-1">Your answers have been checked and saved to progress database.</p>
                      <p className="text-emerald-400 text-xl font-bold mt-2">{score}% Score</p>
                    </div>
                    <button
                      onClick={() => handleSelectPassage(activePassage.id)}
                      className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
