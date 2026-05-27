"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import { GrammarRule } from "@/types";

const difficultyConfig: Record<string, { color: string; bg: string; border: string }> = {
  A1: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  A2: { color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
  B1: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  B2: { color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
  C1: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  C2: { color: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/20" },
};

export default function GrammarPage() {
  const [rules, setRules] = useState<GrammarRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedLevel]);
  
  // Quiz state
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await apiClient.getGrammarRules();
        setRules(data);
      } catch (err) {
        console.error("Failed to load grammar rules", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const allLevels = ["All", ...Array.from(new Set(rules.map((r) => r.level).filter(Boolean)))];

  const filteredRules = rules.filter(
    (r) => selectedLevel === "All" || r.level === selectedLevel
  );

  const totalPages = Math.max(1, Math.ceil(filteredRules.length / itemsPerPage));
  const paginatedRules = filteredRules.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const startQuiz = (ruleId: string) => {
    setActiveQuizId(ruleId);
    setCurrentQuestionIdx(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setScore(0);
    setQuizFinished(false);
  };

  const handleAnswerSubmit = (option: string, correctAnswer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
    if (option === correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = (totalQuestions: number) => {
    setSelectedAnswer(null);
    setShowFeedback(false);
    if (currentQuestionIdx + 1 < totalQuestions) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const normalizeQuestion = (question: any) => {
    if (typeof question === "string") {
      return { question, options: [], answer: "" };
    }
    return question;
  };

  const activeRule = rules.find((r) => r.id === activeQuizId);
  const activeQuestions = (activeRule?.questions || []).map(normalizeQuestion);
  const currentQuestion = activeQuestions[currentQuestionIdx];

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
            <h1 className="text-3xl font-bold text-white">Grammar Rules</h1>
            <p className="text-slate-400 text-sm">Dynamic English structures direct from database</p>
          </div>
        </div>
      </div>

      {/* Level Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allLevels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => {
              setSelectedLevel(lvl);
              setExpandedId(null);
            }}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedLevel === lvl
                ? "bg-gradient-to-r from-amber-500/30 to-orange-500/20 text-white border border-amber-500/30 shadow-lg shadow-amber-500/5"
                : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-white/10 animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading grammar database...</p>
        </div>
      ) : filteredRules.length === 0 ? (
        <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl p-8">
          <svg className="w-12 h-12 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="text-lg font-bold text-white mb-2">No Grammar Rules Found</h3>
          <p className="text-slate-400 text-sm">Please change the filter level or check back later.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
          {paginatedRules.map((rule) => {
            const dc = difficultyConfig[rule.level] || { color: "text-slate-400", bg: "bg-white/10", border: "border-white/5" };
            const isExpanded = expandedId === rule.id;

            return (
              <div
                key={rule.id}
                className={`rounded-2xl bg-white/[0.03] border transition-all duration-300 overflow-hidden ${
                  isExpanded ? "border-indigo-500/30 bg-white/[0.05] shadow-xl shadow-indigo-950/10" : "border-white/5 hover:border-white/10"
                }`}
              >
                <button
                  onClick={() => {
                    setExpandedId(isExpanded ? null : rule.id);
                    setActiveQuizId(null);
                  }}
                  className="w-full p-6 text-left flex items-center justify-between gap-6"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${dc.bg} ${dc.color} ${dc.border} border`}>
                        {rule.level}
                      </span>
                      <h3 className="text-lg font-bold text-white truncate">{rule.title}</h3>
                    </div>
                    <p className="text-slate-400 text-sm truncate">{rule.rule}</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-slate-500 transition-transform duration-300 flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 pt-0 border-t border-white/5">
                    <div className="pt-6 space-y-6">
                      {/* Rule block */}
                      <div className="p-5 rounded-2xl bg-slate-950/40 border border-white/5">
                        <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Formula / Explanation</h4>
                        <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">{rule.rule}</p>
                      </div>

                      {/* Examples Block */}
                      {rule.examples && rule.examples.length > 0 && (
                        <div>
                          <h4 className="text-xs uppercase tracking-widest text-slate-500 font-bold mb-3">Sentence Examples</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rule.examples.map((ex: any, idx: number) => {
                              const example =
                                typeof ex === "string"
                                  ? { english: ex, vietnamese: "", note: "" }
                                  : ex;

                              return (
                                <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                                  <p className="text-indigo-300 font-medium text-sm">&ldquo;{example.english || example.text || example.example}&rdquo;</p>
                                  {(example.vietnamese || example.meaning) && (
                                    <p className="text-slate-400 text-xs mt-1">{example.vietnamese || example.meaning}</p>
                                  )}
                                  {example.note && (
                                    <p className="text-slate-500 text-[10px] italic mt-1">Note: {example.note}</p>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Interactive Quiz Area */}
                      {rule.questions && rule.questions.length > 0 && (
                        <div className="pt-4 border-t border-white/5">
                          {activeQuizId !== rule.id ? (
                            <button
                              onClick={() => startQuiz(rule.id)}
                              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Start Practice Quiz ({rule.questions.length} Questions)
                            </button>
                          ) : (
                            <div className="p-6 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 animate-fade-in">
                              {/* Header Progress */}
                              <div className="flex justify-between items-center mb-4">
                                <span className="text-xs text-indigo-400 font-semibold uppercase">Question {currentQuestionIdx + 1} of {activeQuestions.length}</span>
                                <span className="text-xs text-slate-400 font-medium">Score: {score}/{activeQuestions.length}</span>
                              </div>

                              {!quizFinished && currentQuestion ? (
                                <div className="space-y-4">
                                  <h4 className="text-white font-medium text-base">{currentQuestion.question}</h4>
                                  
                                  {/* Options List */}
                                  <div className="grid grid-cols-1 gap-2">
                                    {((currentQuestion.options || []) as string[]).map((option) => {
                                      const isSelected = selectedAnswer === option;
                                      const isCorrect = option === currentQuestion.answer;
                                      
                                      let optStyle = "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:text-white";
                                      if (showFeedback) {
                                        if (isCorrect) {
                                          optStyle = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                                        } else if (isSelected) {
                                          optStyle = "bg-rose-500/20 border-rose-500/40 text-rose-300";
                                        } else {
                                          optStyle = "bg-white/2 border-white/2 text-slate-500 pointer-events-none";
                                        }
                                      } else if (isSelected) {
                                        optStyle = "bg-indigo-500/20 border-indigo-500/40 text-indigo-200";
                                      }

                                      return (
                                        <button
                                          key={option}
                                          disabled={showFeedback}
                                          onClick={() => handleAnswerSubmit(option, currentQuestion.answer)}
                                          className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-300 ${optStyle}`}
                                        >
                                          {option}
                                        </button>
                                      );
                                    })}
                                  </div>

                                  {/* Feedback / Explanation */}
                                  {showFeedback && (
                                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 animate-slide-up space-y-2">
                                      <p className={`text-xs font-bold ${selectedAnswer === currentQuestion.answer ? "text-emerald-400" : "text-rose-400"}`}>
                                        {selectedAnswer === currentQuestion.answer ? "✓ Correct!" : "✗ Incorrect"}
                                      </p>
                                      {currentQuestion.explanation && (
                                        <p className="text-slate-400 text-xs leading-relaxed">{currentQuestion.explanation}</p>
                                      )}
                                      
                                      <button
                                        onClick={() => nextQuestion(activeQuestions.length)}
                                        className="w-full mt-2 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all duration-200"
                                      >
                                        {currentQuestionIdx + 1 === activeQuestions.length ? "Finish Quiz" : "Next Question"}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center py-6 space-y-4">
                                  <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                                    <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <h5 className="text-white font-bold text-lg">Quiz Complete!</h5>
                                    <p className="text-slate-400 text-sm mt-1">You scored {score} out of {activeQuestions.length} ({Math.round((score / activeQuestions.length) * 100)}%)</p>
                                  </div>
                                  <button
                                    onClick={() => startQuiz(rule.id)}
                                    className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-semibold hover:bg-white/10 transition-all duration-200"
                                  >
                                    Retry Practice
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1 mt-6">
            <p className="text-xs text-slate-400">
              Trang {currentPage} / {totalPages}
            </p>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.max(1, prev - 1))
                }
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg text-xs font-semibold border border-white/10 bg-white/5 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Trước
              </button>

              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1,
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-9 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md shadow-amber-600/20"
                        : "bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg text-xs font-semibold border border-white/10 bg-white/5 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/10 transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
        </>
      )}
    </div>
  );
}
