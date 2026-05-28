"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

import { BookOpen, Award, CheckCircle } from "lucide-react";

interface ReadingPassage {
  id: string;
  level: string;
  title: string;
  passageText: string;
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation?: string;
  }>;
  createdAt: string;
}

const difficultyConfig: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  A1: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  A2: {
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/20",
  },
  B1: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  B2: {
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  C1: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  C2: {
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
};

export default function ReadingPage() {
  const [passages, setPassages] = useState<ReadingPassage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [activePassage, setActivePassage] = useState<ReadingPassage | null>(
    null,
  );



  // Quiz states
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const readingData = await apiClient.getReadingPassages();
        setPassages(readingData);
      } catch (err) {
        console.error("Failed to load reading passages:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);



  const handleStartQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
  };

  const handleSelectQuizAnswer = (qIdx: number, aIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: aIdx }));
  };

  const handleSubmitQuiz = () => {
    if (!activePassage) return;
    let finalScore = 0;
    activePassage.questions.forEach((q, i) => {
      if (quizAnswers[i] === q.correct) finalScore++;
    });
    setQuizScore(finalScore);
    setQuizSubmitted(true);
  };

  const allLevels = [
    "All",
    ...Array.from(new Set(passages.map((p) => p.level).filter(Boolean))),
  ];

  const filteredPassages = passages.filter(
    (p) => selectedLevel === "All" || p.level === selectedLevel,
  );

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-t-indigo-500 border-white/10 rounded-full animate-spin"></div>
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Loading academic reading worksheets...
        </p>
      </div>
    );
  }

  // Reading Passage detail view
  if (activePassage) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 relative">
        <button
          onClick={() => setActivePassage(null)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          ← Back to Passages
        </button>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${difficultyConfig[activePassage.level]?.bg || "bg-white/10"} ${difficultyConfig[activePassage.level]?.color || "text-slate-400"} border ${difficultyConfig[activePassage.level]?.border || "border-white/5"}`}
            >
              {activePassage.level}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Academic Article
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {activePassage.title}
          </h1>
        </div>



        {/* Main Passage Text */}
        <div
          className="text-base md:text-lg font-serif text-foreground leading-relaxed space-y-6 pt-6 border-t border-border whitespace-pre-wrap"
        >
          {activePassage.passageText}
        </div>



        {/* Comprehension Quiz section */}
        {activePassage.questions && activePassage.questions.length > 0 && (
          <div className="pt-8 border-t border-border space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <Award className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold text-foreground">
                Comprehension Assessment
              </h2>
            </div>

            <div className="space-y-6">
              {activePassage.questions.map((q, qIdx) => (
                <div
                  key={qIdx}
                  className="p-6 rounded-2xl bg-card/80 dark:bg-white/[0.02] border border-border space-y-4"
                >
                  <h4 className="text-foreground font-medium text-sm md:text-base flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {qIdx + 1}
                    </span>
                    {q.question}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = quizAnswers[qIdx] === oIdx;
                      const isCorrect = oIdx === q.correct;
                      const isWrongChoice = isSelected && !isCorrect;

                      let btnStyle =
                        "bg-card dark:bg-white/5 border-border text-foreground hover:bg-card/90 dark:hover:bg-white/10";
                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle =
                            "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 pointer-events-none";
                        } else if (isWrongChoice) {
                          btnStyle =
                            "bg-rose-500/20 border-rose-500/40 text-rose-300 pointer-events-none";
                        } else {
                          btnStyle =
                            "bg-card dark:bg-white/[0.01] border-border text-muted-foreground pointer-events-none";
                        }
                      } else if (isSelected) {
                        btnStyle =
                          "bg-indigo-500/20 border-indigo-500/40 text-indigo-300";
                      }

                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleSelectQuizAnswer(qIdx, oIdx)}
                          className={`p-3.5 rounded-xl border text-left text-xs transition-all duration-300 flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && q.explanation && (
                    <div className="p-3.5 rounded-xl bg-card dark:bg-white/5 border border-border text-xs text-muted-foreground leading-relaxed italic">
                      <strong>Giải thích:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between gap-4 pt-4">
              {!quizSubmitted ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={
                    Object.keys(quizAnswers).length <
                    activePassage.questions.length
                  }
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold text-sm transition-all duration-300 active:scale-98 disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  Nộp bài & Xem điểm
                </button>
              ) : (
                <div className="w-full p-6 rounded-2xl bg-indigo-100/70 dark:bg-indigo-950/20 border border-indigo-500/25 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-foreground font-bold text-lg">
                      Hoàn thành bài đọc!
                    </h4>
                    <p className="text-muted-foreground text-xs mt-1">
                      Bạn trả lời đúng {quizScore}/
                      {activePassage.questions.length} câu hỏi (
                      {Math.round(
                        (quizScore / activePassage.questions.length) * 100,
                      )}
                      %)
                    </p>
                  </div>
                  <button
                    onClick={handleStartQuiz}
                    className="px-6 py-2.5 rounded-xl bg-card/80 dark:bg-white/5 border border-border hover:bg-card text-foreground text-xs font-semibold transition-all duration-200"
                  >
                    Làm lại bài kiểm tra
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Academic Reading Worksheets
            </h1>
            <p className="text-muted-foreground text-sm">
              Học đọc hiểu tiếng Anh học thuật nâng cao trực tiếp từ database
            </p>
          </div>
        </div>
      </div>

      {/* Level filter tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allLevels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => setSelectedLevel(lvl)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedLevel === lvl
                ? "bg-gradient-to-r from-indigo-500/30 to-purple-500/20 text-foreground dark:text-white border border-indigo-500/30 shadow-lg shadow-indigo-500/5"
                : "bg-card/80 dark:bg-white/5 text-muted-foreground border border-border hover:bg-card hover:text-foreground"
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Passages List */}
      {filteredPassages.length === 0 ? (
        <div className="text-center py-16 bg-card/80 dark:bg-white/[0.02] border border-border rounded-2xl p-8">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            No Reading Passages Found
          </h3>
          <p className="text-muted-foreground text-sm">
            Chưa có bài đọc nào ở cấp độ này trong cơ sở dữ liệu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPassages.map((passage) => {
            const dc = difficultyConfig[passage.level] || {
              color: "text-slate-400",
              bg: "bg-white/10",
              border: "border-white/5",
            };
            return (
              <div
                key={passage.id}
                onClick={() => {
                  setActivePassage(passage);
                  handleStartQuiz();
                }}
                className="group rounded-2xl bg-card/80 dark:bg-white/[0.03] border border-border p-6 hover:border-indigo-500/30 hover:bg-card transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-4 hover:shadow-xl hover:shadow-indigo-950/10"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold uppercase tracking-wider ${dc.bg} ${dc.color} ${dc.border} border`}
                    >
                      {passage.level}
                    </span>
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-foreground group-hover:text-indigo-300 transition-colors leading-snug">
                    {passage.title}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
