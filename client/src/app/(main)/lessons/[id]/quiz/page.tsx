"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { apiClient } from "@/lib/api";

export default function QuizPage({ params }: { params: { id: string } }) {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const data = await apiClient.getLessonQuiz(params.id);
        if (data && data.questions) {
          setQuestions(data.questions);
        }
      } catch (err) {
        console.error("Failed to fetch quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchQuiz();
    }
  }, [isAuthenticated, params.id]);

  const handleAnswer = (option: string) => {
    if (answers[currentQuestion] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion]: option }));
  };

  const handleSubmit = async () => {
    if (questions.length === 0) return;
    
    let correctCount = 0;
    questions.forEach((q: any, index: number) => {
      const selected = answers[index];
      const correct = q.answer;
      if (selected === correct) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / questions.length) * 100);
    setScore(finalScore);
    setSubmitted(true);

    // Save Progress to database!
    if (user?.id) {
      try {
        await apiClient.updateProgress(user.id, params.id, "completed", finalScore);
        console.log("Lesson progress saved successfully!");
      } catch (err) {
        console.error("Failed to save progress", err);
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white p-6 text-center">
        <div>
          <h2 className="text-xl font-bold mb-2">No Quiz Available</h2>
          <p className="text-slate-400 text-sm mb-6">This lesson does not have practice questions yet.</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-sm font-semibold"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/5 p-8 rounded-2xl text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Quiz Complete!
          </h1>
          <p className="text-slate-400 text-sm mb-6">Your answers have been checked and recorded in your progress.</p>
          <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6">{score}%</div>
          <p className="text-slate-300 text-sm mb-8">
            You scored {Math.round((score / 100) * questions.length)} out of {questions.length} correct.
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-500/20"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const hasSelectedAnswer = answers[currentQuestion] !== undefined;

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col justify-between">
      <header className="border-b border-white/5 py-6">
        <div className="max-w-3xl mx-auto px-6 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-white">Lesson Practice</h1>
            <p className="text-slate-400 text-xs mt-1">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
          >
            Cancel
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 flex-1 w-full flex flex-col justify-center">
        <div className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl shadow-xl w-full">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="w-full bg-white/5 rounded-full h-1.5">
              <div
                className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question */}
          <h2 className="text-lg font-semibold text-white mb-8 leading-relaxed">
            {question.question || question.text}
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {(question.options as string[]).map((option: string) => {
              const isSelected = answers[currentQuestion] === option;
              const correctAns = question.answer;
              const isCorrectOption = option === correctAns;

              let buttonStyle = "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10";
              if (hasSelectedAnswer) {
                if (isCorrectOption) {
                  buttonStyle = "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/5";
                } else if (isSelected) {
                  buttonStyle = "bg-rose-500/15 border-rose-500/30 text-rose-400";
                } else {
                  buttonStyle = "bg-white/[0.02] border-white/5 text-slate-600 opacity-60 pointer-events-none";
                }
              } else if (isSelected) {
                buttonStyle = "bg-indigo-500/10 border-indigo-500/30 text-indigo-300";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={hasSelectedAnswer}
                  className={`w-full p-4 border rounded-xl text-left text-sm transition-all duration-200 flex items-center justify-between ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {hasSelectedAnswer && isCorrectOption && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  {hasSelectedAnswer && isSelected && !isCorrectOption && (
                    <div className="w-4 h-4 rounded-full bg-rose-500 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Panel */}
          {hasSelectedAnswer && (
            <div className="p-4 rounded-xl bg-indigo-500/[0.04] border border-indigo-500/15 text-slate-300 text-xs leading-relaxed mb-8 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Explanation:
              </div>
              <p>{question.explanation || "No detailed explanation available for this question."}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4 justify-between pt-4 border-t border-white/5">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-300 rounded-xl text-xs font-semibold border border-white/5 transition-all"
            >
              Previous
            </button>

            {currentQuestion === questions.length - 1 ? (
              <button
                disabled={!hasSelectedAnswer}
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold shadow-lg shadow-emerald-500/10 transition-all"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                disabled={!hasSelectedAnswer}
                onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:pointer-events-none text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-500/10 transition-all"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
