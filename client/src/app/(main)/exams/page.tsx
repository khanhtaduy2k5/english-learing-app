"use client";

import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/lib/api";
import { Exam } from "@/types";

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Active test state
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [examMode, setExamMode] = useState<"quick" | "full" | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadExams() {
      try {
        setLoading(true);
        const data = await apiClient.getExams();
        setExams(data);
      } catch (err) {
        console.error("Failed to load exams", err);
      } finally {
        setLoading(false);
      }
    }
    loadExams();
  }, []);

  const getQuestionCount = (examData: any): number => {
    if (!examData) return 0;
    if (Array.isArray(examData)) return examData.length;
    if (examData.sections && Array.isArray(examData.sections)) {
      return examData.sections.reduce((acc: number, sec: any) => {
        return acc + (Array.isArray(sec.questions) ? sec.questions.length : 0);
      }, 0);
    }
    return 0;
  };

  const activeExam = exams.find((e) => e.id === activeExamId);
  const activeQuestions = activeExam
    ? (() => {
        const examData = examMode === "quick" ? activeExam.quickExam : activeExam.fullExam;
        if (!examData) return [];
        
        // Support direct array format (backward compatibility)
        if (Array.isArray(examData)) {
          return examData.map((q: any) => ({
            question: q.question || q.prompt || "",
            options: Array.isArray(q.options) ? q.options : [q.answer || q.correctText || ""],
            answer: q.answer || q.correctText || "",
            explanation: q.explanation || ""
          }));
        }

        // Support structured object format with sections (Postgres production)
        if (examData.sections && Array.isArray(examData.sections)) {
          const allQuestions: any[] = [];
          examData.sections.forEach((sec: any) => {
            if (sec.questions && Array.isArray(sec.questions)) {
              sec.questions.forEach((q: any) => {
                const ans = q.correctText || q.answer || "";
                let opts = q.options;
                if (!Array.isArray(opts) || opts.length === 0) {
                  opts = [ans];
                }
                allQuestions.push({
                  question: q.prompt || q.question || "",
                  options: opts,
                  answer: ans,
                  explanation: q.explanation || ""
                });
              });
            }
          });
          return allQuestions;
        }

        return [];
      })()
    : [];

  const startExam = (examId: string, mode: "quick" | "full") => {
    const exam = exams.find((e) => e.id === examId);
    if (!exam) return;

    setActiveExamId(examId);
    setExamMode(mode);
    setCurrentIdx(0);
    setAnswers({});
    setSubmitted(false);
    setScore(0);

    // Setup timer: e.g. Quick Exam 15 mins (900s), Full Exam 60 mins (3600s)
    const duration = mode === "quick" ? 15 * 60 : 60 * 60;
    setTimeLeft(duration);

    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelectOption = (option: string) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [currentIdx]: option }));
  };

  const handleSubmitExam = () => {
    if (submitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    let correctCount = 0;
    activeQuestions.forEach((q: any, idx: number) => {
      if (answers[idx] === q.answer) {
        correctCount++;
      }
    });

    const finalScore = activeQuestions.length > 0 ? Math.round((correctCount / activeQuestions.length) * 100) : 0;
    setScore(finalScore);
    setSubmitted(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const selectExamCard = (id: string) => {
    setActiveExamId(id);
    setExamMode(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Standardized Exams</h1>
              <p className="text-slate-400 text-sm">Challenge yourself with dynamic standardized tests</p>
            </div>
          </div>

          {activeExamId && (
            <button
              onClick={() => {
                setActiveExamId(null);
                setExamMode(null);
                if (timerRef.current) clearInterval(timerRef.current);
              }}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all text-xs font-semibold"
            >
              Exit Exam
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-t-indigo-500 border-white/10 animate-spin" />
          <p className="text-slate-400 text-sm">Loading exam catalog...</p>
        </div>
      ) : !activeExamId ? (
        /* Exams Catalog Grid */
        exams.length === 0 ? (
          <div className="text-center py-16 bg-white/[0.02] border border-white/5 rounded-2xl p-8">
            <h3 className="text-lg font-bold text-white mb-2">No Exams Found</h3>
            <p className="text-slate-400 text-sm">Seeding the `exams` table on Supabase is required.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <div
                key={exam.id}
                className="rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  <div className="text-3xl mb-4">{exam.emoji || "📝"}</div>
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors mb-2">{exam.fullName}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">{exam.description || "Take a mock test modeled on dynamic question variants."}</p>
                </div>
                <button
                  onClick={() => selectExamCard(exam.id)}
                  className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-indigo-500 hover:border-indigo-500 hover:text-white transition-all duration-300 text-sm"
                >
                  Configure Test
                </button>
              </div>
            ))}
          </div>
        )
      ) : activeExam && !examMode ? (
        /* Variant Mode Selection View */
        <div className="max-w-xl mx-auto rounded-2xl bg-white/[0.03] border border-white/5 p-8 text-center space-y-6">
          <div className="text-5xl">{activeExam.emoji || "📝"}</div>
          <div>
            <h2 className="text-2xl font-bold text-white">{activeExam.fullName}</h2>
            <p className="text-slate-400 text-sm mt-2">Choose your preferred variant to begin the exam.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <button
              onClick={() => startExam(activeExam.id, "quick")}
              className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-indigo-500/40 hover:bg-indigo-500/[0.02] transition-all duration-300 text-left group"
            >
              <h4 className="text-white font-bold text-base group-hover:text-indigo-400 transition-colors">Quick Exam</h4>
              <p className="text-slate-400 text-xs mt-2">Focused test with shorter questions. Perfect for quick mock checks.</p>
              <div className="flex gap-4 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <span>⏱ 15 Minutes</span>
                <span>•</span>
                <span>📋 {getQuestionCount(activeExam.quickExam)} Questions</span>
              </div>
            </button>

            <button
              onClick={() => startExam(activeExam.id, "full")}
              className="p-6 rounded-xl border border-white/5 bg-white/[0.02] hover:border-purple-500/40 hover:bg-purple-500/[0.02] transition-all duration-300 text-left group"
            >
              <h4 className="text-white font-bold text-base group-hover:text-purple-400 transition-colors">Full Exam</h4>
              <p className="text-slate-400 text-xs mt-2">Comprehensive standardized test. Closely mimics full exam structures.</p>
              <div className="flex gap-4 mt-4 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                <span>⏱ 60 Minutes</span>
                <span>•</span>
                <span>📋 {getQuestionCount(activeExam.fullExam)} Questions</span>
              </div>
            </button>
          </div>
        </div>
      ) : (
        /* Active Running Test View */
        activeExam && examMode && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
            {/* Left: Questions Navigator List (4/12) */}
            <div className="lg:col-span-4 rounded-2xl bg-white/[0.02] border border-white/5 p-6 flex flex-col justify-between h-[65vh]">
              <div>
                {/* Timer details */}
                <div className="flex justify-between items-center border-b border-white/5 pb-4 mb-6">
                  <div>
                    <h3 className="text-white font-bold text-base uppercase tracking-wider">{examMode} Test</h3>
                    <span className="text-xs text-slate-500 mt-1">{activeQuestions.length} Questions</span>
                  </div>
                  <div className={`px-4 py-2 rounded-xl text-sm font-mono font-bold border ${timeLeft < 120 ? "text-rose-400 border-rose-500/20 bg-rose-500/5 animate-pulse" : "text-indigo-400 border-indigo-500/20 bg-indigo-500/5"}`}>
                    ⏱ {formatTime(timeLeft)}
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="grid grid-cols-5 gap-2 max-h-[35vh] overflow-y-auto pr-1">
                  {activeQuestions.map((_, idx) => {
                    const isAnswered = answers[idx] !== undefined;
                    const isActive = currentIdx === idx;
                    
                    let bg = "bg-white/5 text-slate-400 border-white/5";
                    if (submitted) {
                      const isCorrect = answers[idx] === activeQuestions[idx].answer;
                      bg = isCorrect ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" : "bg-rose-500/20 text-rose-300 border-rose-500/30";
                    } else if (isActive) {
                      bg = "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
                    } else if (isAnswered) {
                      bg = "bg-white/10 text-white border-white/10";
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentIdx(idx)}
                        className={`w-full py-3 rounded-lg border text-xs font-bold transition-all duration-200 ${bg}`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {!submitted ? (
                <button
                  onClick={handleSubmitExam}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold transition-all text-sm shadow-lg shadow-indigo-500/20"
                >
                  Submit Exam
                </button>
              ) : (
                <div className="text-center p-4 bg-white/5 border border-white/5 rounded-xl">
                  <span className="text-xs text-slate-500 block">Exam Grade</span>
                  <span className="text-2xl font-bold text-indigo-400 mt-1 block">{score}% Score</span>
                </div>
              )}
            </div>

            {/* Right: Active Question Frame (8/12) */}
            <div className="lg:col-span-8 rounded-2xl bg-white/[0.02] border border-white/5 p-8 flex flex-col justify-between h-[65vh]">
              {activeQuestions[currentIdx] ? (
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <span className="w-8 h-8 rounded-full bg-white/5 text-slate-400 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {currentIdx + 1}
                    </span>
                    <h3 className="text-white font-semibold text-lg leading-relaxed mt-0.5">
                      {activeQuestions[currentIdx].question}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-2 pt-4">
                    {(activeQuestions[currentIdx].options as string[]).map((option) => {
                      const isSelected = answers[currentIdx] === option;
                      const isCorrect = option === activeQuestions[currentIdx].answer;
                      
                      let style = "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10";
                      if (submitted) {
                        if (isCorrect) {
                          style = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
                        } else if (isSelected) {
                          style = "bg-rose-500/20 border-rose-500/40 text-rose-300";
                        } else {
                          style = "bg-white/2 border-white/2 text-slate-500 pointer-events-none";
                        }
                      } else if (isSelected) {
                        style = "bg-indigo-500/10 border-indigo-500/30 text-indigo-300";
                      }

                      return (
                        <button
                          key={option}
                          disabled={submitted}
                          onClick={() => handleSelectOption(option)}
                          className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-200 ${style}`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {submitted && activeQuestions[currentIdx].explanation && (
                    <div className="p-4 rounded-xl bg-white/5 border border-white/5 mt-4 text-xs text-slate-400 leading-relaxed">
                      <span className="font-bold text-slate-300 block mb-1">Explanation:</span>
                      {activeQuestions[currentIdx].explanation}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 text-slate-500 text-sm">Question frame empty.</div>
              )}

              {/* Navigation buttons */}
              <div className="flex justify-between items-center border-t border-white/5 pt-6 mt-4">
                <button
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((p) => p - 1)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  ← Previous
                </button>
                <button
                  disabled={currentIdx + 1 === activeQuestions.length}
                  onClick={() => setCurrentIdx((p) => p + 1)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white border border-white/5 text-xs font-semibold transition-all disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
