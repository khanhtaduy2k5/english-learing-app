"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

interface TriviaQuestion {
  question: string;
  correctAnswer: string;
  answers: string[];
  difficulty: string;
  category: string;
}

interface TriviaArenaProps {
  difficulty: string;
  onClose: () => void;
}

export default function TriviaArena({ difficulty, onClose }: TriviaArenaProps) {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    async function loadTrivia() {
      setLoading(true);
      try {
        const data = await apiClient.getTriviaQuestions(difficulty);
        setQuestions(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to load trivia questions:", err);
        setLoading(false);
      }
    }
    loadTrivia();
  }, [difficulty]);

  const handleAnswer = (answer: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answer);
    
    const isCorrect = answer === questions[currentIndex].correctAnswer;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, answer]);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((c) => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Entering the Arena... Loading Trivia Questions</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-red-400 text-sm">Failed to connect to the Trivia Server. Please try again later.</p>
        <button onClick={onClose} className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-xl text-sm">
          Go Back
        </button>
      </div>
    );
  }

  if (showResult) {
    const percent = Math.round((score / questions.length) * 100);
    const earnedXP = score * 10;

    return (
      <div className="p-8 min-h-screen flex items-center justify-center max-w-2xl mx-auto">
        <div className="w-full text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 flex items-center justify-center mb-6 shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]">
            <span className="text-4xl font-extrabold text-white">{percent}%</span>
          </div>
          
          <h2 className="text-3xl font-extrabold text-white mb-2">
            {percent >= 80 ? "🏆 Grandmaster of Trivia!" : percent >= 60 ? "🌟 English Scholar!" : "📚 Keeper of Knowledge!"}
          </h2>
          <p className="text-slate-400 mb-2">
            You answered {score} out of {questions.length} questions correctly.
          </p>
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-sm font-semibold mb-8 animate-bounce">
            ⭐ Double XP Earned: +{earnedXP} XP!
          </div>

          <div className="space-y-4 mb-8 text-left max-h-[350px] overflow-y-auto scrollbar-thin pr-1">
            {questions.map((q, i) => (
              <div key={i} className={`p-4 rounded-xl border ${
                answers[i] === q.correctAnswer
                  ? "bg-emerald-500/10 border-emerald-500/20"
                  : "bg-rose-500/10 border-rose-500/20"
              }`}>
                <p className="text-sm font-bold text-white mb-2">{q.question}</p>
                <p className={`text-xs ${answers[i] === q.correctAnswer ? "text-emerald-400" : "text-rose-400"}`}>
                  {answers[i] === q.correctAnswer 
                    ? "✓ Correct" 
                    : `✗ Your answer: ${answers[i]} → Correct: ${q.correctAnswer}`}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all duration-300"
            >
              Exit Arena
            </button>
            <button
              onClick={() => {
                setCurrentIndex(0);
                setSelectedAnswer(null);
                setScore(0);
                setAnswers([]);
                setShowResult(false);
                setQuestions([]);
                setLoading(true);
              }}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl text-sm font-bold hover:from-violet-500 hover:to-indigo-500 transition-all duration-300 shadow-lg shadow-violet-500/20"
            >
              Challenge Again ⚔️
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  return (
    <div className="p-4 md:p-8 min-h-screen max-w-3xl mx-auto">
      {/* Trivia Header */}
      <div className="flex items-center justify-between mb-8">
        <button onClick={onClose} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Leave Arena
        </button>
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Question {currentIndex + 1}/{questions.length}</span>
          <span className="px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-sm font-medium border border-violet-500/20 capitalize">
            {difficulty} Mode
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-white/5 mb-12 overflow-hidden border border-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Trivia Question Box */}
      <div className="w-full space-y-8">
        <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-violet-500/5 to-indigo-500/5 border border-border shadow-xl text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 bg-violet-500/10 text-violet-400 text-[10px] font-bold uppercase rounded-bl-xl border-l border-b border-violet-500/25 tracking-wider select-none">
            {currentQ.category}
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-foreground leading-relaxed">
            {currentQ.question}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentQ.answers.map((answer, i) => {
            let borderColor = "border-border hover:border-violet-500/30";
            let bgColor = "bg-white/[0.02] hover:bg-white/[0.05]";
            let textStyle = "text-foreground";

            if (selectedAnswer !== null) {
              if (answer === currentQ.correctAnswer) {
                borderColor = "border-emerald-500/40";
                bgColor = "bg-emerald-500/15";
                textStyle = "text-emerald-400 font-bold";
              } else if (answer === selectedAnswer) {
                borderColor = "border-rose-500/40";
                bgColor = "bg-rose-500/15";
                textStyle = "text-rose-400 font-bold";
              }
            }

            return (
              <button
                key={i}
                onClick={() => handleAnswer(answer)}
                disabled={selectedAnswer !== null}
                className={`w-full p-5 rounded-xl border text-left transition-all duration-300 flex items-center gap-4 ${bgColor} ${borderColor} ${
                  selectedAnswer === null ? "cursor-pointer hover:-translate-y-0.5" : "cursor-default"
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                  selectedAnswer !== null && answer === currentQ.correctAnswer
                    ? "bg-emerald-500/25 border-emerald-500/30 text-emerald-400"
                    : selectedAnswer === answer
                    ? "bg-rose-500/25 border-rose-500/30 text-rose-400"
                    : "bg-white/5 border-white/10 text-slate-400"
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={`text-sm md:text-base ${textStyle}`}>{answer}</span>
                
                {selectedAnswer !== null && answer === currentQ.correctAnswer && (
                  <svg className="w-5 h-5 text-emerald-400 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {selectedAnswer === answer && answer !== currentQ.correctAnswer && (
                  <svg className="w-5 h-5 text-rose-400 ml-auto flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
