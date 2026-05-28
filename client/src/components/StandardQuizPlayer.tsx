"use client";

import { useState } from "react";
import { QuizQuestion } from "@/app/(main)/quizzes/quizzesData";

interface StandardQuizPlayerProps {
  activeQuiz: number;
  questions: QuizQuestion[];
  onClose: () => void;
  onRetake: (id: number) => void;
}

export default function StandardQuizPlayer({ activeQuiz, questions, onClose, onRetake }: StandardQuizPlayerProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === questions[currentQuestion]?.correct;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, index]);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion((c) => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    onRetake(activeQuiz);
  };

  if (showResult) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <div className="p-8 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)]">
            <span className="text-4xl font-bold text-white">{percent}%</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {percent >= 80 ? "Excellent!" : percent >= 60 ? "Good Job!" : "Keep Practicing!"}
          </h2>
          <p className="text-slate-400 mb-6">
            You answered {score} out of {questions.length} questions correctly.
          </p>

          <div className="space-y-3 mb-8">
            {questions.map((q, i) => (
              <div key={i} className={`p-4 rounded-xl border text-left ${
                answers[i] === q.correct
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-rose-500/10 border-rose-500/20"
              }`}>
                <p className="text-sm text-white mb-1">{q.question}</p>
                <p className={`text-xs ${answers[i] === q.correct ? "text-emerald-400" : "text-rose-400"}`}>
                  {answers[i] === q.correct ? "✓ Correct" : `✗ Your answer: ${q.options[answers[i]!]} → Correct: ${q.options[q.correct]}`}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
            >
              Back to Quizzes
            </button>
            <button
              onClick={restartQuiz}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[currentQuestion];
  if (!q) return null;

  return (
    <div className="p-8 min-h-screen">
      {/* Quiz Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Exit Quiz
        </button>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Question {currentQuestion + 1}/{questions.length}</span>
          <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/20">
            Score: {score}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 rounded-full bg-white/5 mb-12">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
          style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question */}
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-8 text-center">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((option, i) => {
            let borderColor = "border-white/5 hover:border-indigo-500/30";
            let bgColor = "bg-white/[0.03] hover:bg-white/[0.06]";

            if (selectedAnswer !== null) {
              if (i === q.correct) {
                borderColor = "border-emerald-500/40";
                bgColor = "bg-emerald-500/10";
              } else if (i === selectedAnswer) {
                borderColor = "border-rose-500/40";
                bgColor = "bg-rose-500/10";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={selectedAnswer !== null}
                className={`w-full p-5 rounded-xl border text-left transition-all duration-300 ${bgColor} ${borderColor} ${
                  selectedAnswer === null ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                    selectedAnswer !== null && i === q.correct
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : selectedAnswer === i
                      ? "bg-rose-500/20 border-rose-500/30 text-rose-400"
                      : "bg-white/5 border-white/10 text-slate-400"
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-white">{option}</span>
                  {selectedAnswer !== null && i === q.correct && (
                    <svg className="w-5 h-5 text-emerald-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {selectedAnswer === i && i !== q.correct && (
                    <svg className="w-5 h-5 text-rose-400 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
