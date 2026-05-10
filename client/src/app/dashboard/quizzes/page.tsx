"use client";

import { useState } from "react";

const quizzes = [
  { id: 1, title: "Vocabulary: Daily Life", category: "Vocabulary", questions: 20, timeMin: 10, difficulty: "Beginner", bestScore: 95, attempts: 3, icon: "📝" },
  { id: 2, title: "Grammar: Tenses Master", category: "Grammar", questions: 15, timeMin: 12, difficulty: "Intermediate", bestScore: 80, attempts: 2, icon: "📐" },
  { id: 3, title: "Listening: Native Conversations", category: "Listening", questions: 10, timeMin: 15, difficulty: "Advanced", bestScore: null, attempts: 0, icon: "🎧" },
  { id: 4, title: "Reading Comprehension: News", category: "Reading", questions: 12, timeMin: 20, difficulty: "Intermediate", bestScore: 70, attempts: 1, icon: "📰" },
  { id: 5, title: "Idioms & Expressions", category: "Vocabulary", questions: 25, timeMin: 15, difficulty: "Advanced", bestScore: null, attempts: 0, icon: "💡" },
  { id: 6, title: "Spelling Bee Challenge", category: "Vocabulary", questions: 30, timeMin: 10, difficulty: "Beginner", bestScore: 88, attempts: 5, icon: "🐝" },
  { id: 7, title: "Prepositions Master", category: "Grammar", questions: 20, timeMin: 8, difficulty: "Beginner", bestScore: 100, attempts: 4, icon: "🔗" },
  { id: 8, title: "Business English", category: "Vocabulary", questions: 15, timeMin: 12, difficulty: "Advanced", bestScore: null, attempts: 0, icon: "💼" },
];

// Demo quiz state
const demoQuestions = [
  {
    question: "Choose the correct word: She ___ to the store yesterday.",
    options: ["go", "goes", "went", "going"],
    correct: 2,
  },
  {
    question: "Which sentence is correct?",
    options: [
      "I have went to Paris.",
      "I have gone to Paris.",
      "I have go to Paris.",
      "I have going to Paris.",
    ],
    correct: 1,
  },
  {
    question: "Fill in the blank: If I ___ rich, I would travel the world.",
    options: ["am", "was", "were", "be"],
    correct: 2,
  },
];

export default function QuizzesPage() {
  const [filter, setFilter] = useState("All");
  const [activeQuiz, setActiveQuiz] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);

  const categories = ["All", "Vocabulary", "Grammar", "Listening", "Reading"];

  const filtered = quizzes.filter((q) => filter === "All" || q.category === filter);

  const startQuiz = (id: number) => {
    setActiveQuiz(id);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(index);
    const isCorrect = index === demoQuestions[currentQuestion].correct;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, index]);

    setTimeout(() => {
      if (currentQuestion < demoQuestions.length - 1) {
        setCurrentQuestion((c) => c + 1);
        setSelectedAnswer(null);
      } else {
        setShowResult(true);
      }
    }, 1200);
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  // Quiz overlay
  if (activeQuiz !== null) {
    if (showResult) {
      const percent = Math.round((score / demoQuestions.length) * 100);
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
              You answered {score} out of {demoQuestions.length} questions correctly.
            </p>

            <div className="space-y-3 mb-8">
              {demoQuestions.map((q, i) => (
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
                onClick={closeQuiz}
                className="flex-1 px-5 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-sm font-medium hover:bg-white/10 transition-all"
              >
                Back to Quizzes
              </button>
              <button
                onClick={() => startQuiz(activeQuiz)}
                className="flex-1 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    const q = demoQuestions[currentQuestion];
    return (
      <div className="p-8 min-h-screen">
        {/* Quiz Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={closeQuiz} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Exit Quiz
          </button>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm">Question {currentQuestion + 1}/{demoQuestions.length}</span>
            <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-sm font-medium border border-indigo-500/20">
              Score: {score}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/5 mb-12">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / demoQuestions.length) * 100}%` }}
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

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Quizzes</h1>
            <p className="text-slate-400 text-sm">Test your knowledge and track your scores</p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              filter === c
                ? "bg-gradient-to-r from-violet-500/30 to-purple-500/20 text-white border border-violet-500/30"
                : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Quizzes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((quiz) => (
          <div
            key={quiz.id}
            className="group p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-violet-500/20 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-3xl">{quiz.icon}</span>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${
                quiz.difficulty === "Beginner" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/20" :
                quiz.difficulty === "Intermediate" ? "bg-amber-500/20 text-amber-400 border-amber-500/20" :
                "bg-rose-500/20 text-rose-400 border-rose-500/20"
              }`}>
                {quiz.difficulty}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-violet-300 transition-colors">
              {quiz.title}
            </h3>
            <p className="text-slate-500 text-sm mb-4">{quiz.category}</p>

            <div className="flex items-center gap-4 mb-5 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {quiz.questions} questions
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {quiz.timeMin} min
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {quiz.attempts} attempts
              </span>
            </div>

            {quiz.bestScore !== null && (
              <div className="mb-5">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500">Best Score</span>
                  <span className={`font-medium ${
                    quiz.bestScore >= 90 ? "text-emerald-400" :
                    quiz.bestScore >= 70 ? "text-amber-400" : "text-rose-400"
                  }`}>{quiz.bestScore}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all ${
                      quiz.bestScore >= 90 ? "bg-gradient-to-r from-emerald-500 to-green-400" :
                      quiz.bestScore >= 70 ? "bg-gradient-to-r from-amber-500 to-yellow-400" :
                      "bg-gradient-to-r from-rose-500 to-pink-400"
                    }`}
                    style={{ width: `${quiz.bestScore}%` }}
                  ></div>
                </div>
              </div>
            )}

            <button
              onClick={() => startQuiz(quiz.id)}
              className="w-full px-5 py-2.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-violet-500 hover:to-purple-500 transition-all duration-200 shadow-lg shadow-violet-500/20"
            >
              {quiz.bestScore !== null ? "Retake Quiz" : "Start Quiz"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
