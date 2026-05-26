"use client";

import React, { useState } from "react";
import { QuizQuestion } from "@/types";
import { apiClient } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  Trophy,
  RefreshCw,
  ChevronRight,
  Check,
  X
} from "lucide-react";

interface QuizTabProps {
  questions?: QuizQuestion[];
  lessonId: string;
  userId?: string;
  xp?: number;
}

export default function QuizTab({ questions = [], lessonId, userId }: QuizTabProps) {
  const router = useRouter();
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const handleSelectOption = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    
    const isCorrect = option === questions[currentQuestion]?.answer;
    if (isCorrect) {
      setCorrectAnswersCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const finalScore = Math.round((correctAnswersCount / questions.length) * 100);
      setQuizScore(finalScore);
      setQuizSubmitted(true);
      
      // Save progress to database!
      if (userId) {
        apiClient.updateProgress(userId, lessonId, "completed", finalScore)
          .catch((err) => console.error("Failed to save quiz progress:", err));
      }
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setQuizSubmitted(false);
    setCorrectAnswersCount(0);
    setQuizScore(0);
  };

  if (questions.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">📝</span>
        <h3 className="text-white font-semibold">Không có Quiz</h3>
        <p className="text-slate-500 text-sm max-w-sm mt-1 mb-6">
          Bài học này không có các câu hỏi luyện tập trực tiếp đi kèm.
        </p>
        <button
          onClick={() => {
            if (userId) {
              apiClient.updateProgress(userId, lessonId, "completed", 100)
                .then(() => router.push("/dashboard"))
                .catch(() => router.push("/dashboard"));
            } else {
              router.push("/dashboard");
            }
          }}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-600/10"
        >
          Đánh dấu hoàn thành bài học
        </button>
      </div>
    );
  }

  const activeQuestion = questions[currentQuestion];
  const hasSelectedAnswer = selectedAnswer !== null;

  return (
    <div className="flex flex-col flex-1">
      {quizSubmitted ? (
        /* Quiz Result UI */
        <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 mx-auto flex items-center justify-center mb-6 border border-emerald-500/30">
            <Trophy className="w-10 h-10 text-emerald-400 animate-bounce" />
          </div>
          
          <h2 className="text-2xl font-black text-white mb-2">Hoàn thành bài tập!</h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md">
            Hệ thống đã lưu lại tiến trình học tập của bạn vào cơ sở dữ liệu PostgreSQL cục bộ.
          </p>
          
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mb-6 tracking-tight">
            {quizScore}%
          </div>
          
          <p className="text-slate-300 text-sm mb-8">
            Bạn đã trả lời đúng <strong className="text-white">{correctAnswersCount}</strong> trên tổng số{" "}
            <strong className="text-white">{questions.length}</strong> câu hỏi.
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={resetQuiz}
              className="px-6 py-3.5 bg-white/5 border border-white/5 hover:bg-white/10 text-slate-300 rounded-xl text-sm font-semibold transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Làm lại Quiz
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              Quay lại Dashboard
            </button>
          </div>
        </div>
      ) : (
        /* Active Quiz Engine UI */
        <div className="flex-1 flex flex-col">
          <div className="mb-6 flex justify-between items-center border-b border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-bold text-white">Trắc nghiệm thực hành (Lesson Quiz)</h2>
              <p className="text-slate-400 text-xs mt-0.5">
                Câu {currentQuestion + 1} trên tổng số {questions.length} câu
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-400">
              {currentQuestion + 1} / {questions.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/5 rounded-full h-1.5 mb-8">
            <div
              className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Active Question Box */}
          <div className="flex-1 flex flex-col">
            <h3 className="text-base font-bold text-white leading-relaxed mb-6">
              {activeQuestion.question || activeQuestion.text}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {activeQuestion.options.map((option) => {
                const isSelected = selectedAnswer === option;
                const correctAns = activeQuestion.answer;
                const isCorrectOption = option === correctAns;

                let btnStyle = "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10";
                if (hasSelectedAnswer) {
                  if (isCorrectOption) {
                    btnStyle = "bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-md shadow-emerald-500/5";
                  } else if (isSelected) {
                    btnStyle = "bg-rose-500/15 border-rose-500/30 text-rose-400";
                  } else {
                    btnStyle = "bg-white/[0.02] border-white/5 text-slate-600 opacity-60 pointer-events-none";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-indigo-500/10 border-indigo-500/30 text-indigo-300";
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleSelectOption(option)}
                    disabled={hasSelectedAnswer}
                    className={`w-full p-4 border rounded-xl text-left text-sm font-medium transition-all flex items-center justify-between group ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {hasSelectedAnswer && isCorrectOption && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                    {hasSelectedAnswer && isSelected && !isCorrectOption && (
                      <X className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Feedback Panel */}
            {hasSelectedAnswer && (
              <div className="p-4 rounded-xl bg-indigo-500/[0.04] border border-indigo-500/15 text-slate-300 text-xs leading-relaxed mb-8 animate-fadeIn">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold mb-1.5 uppercase tracking-wider text-[10px]">
                  <HelpCircle className="w-3.5 h-3.5" /> Giải thích đáp án:
                </div>
                <p>{activeQuestion.explanation || "Không có giải thích chi tiết cho câu hỏi này."}</p>
              </div>
            )}

            {/* Navigation Quiz */}
            <div className="mt-auto pt-6 border-t border-white/5 flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={!hasSelectedAnswer}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:pointer-events-none text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/15 flex items-center gap-1.5"
              >
                {currentQuestion === questions.length - 1 ? "Nộp bài Quiz" : "Tiếp theo"}{" "}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
