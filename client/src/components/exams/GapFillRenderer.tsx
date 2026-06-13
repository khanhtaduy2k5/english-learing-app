import React from "react";

interface GapFillRendererProps {
  q: any;
  currentIdx: number;
  answers: Record<number, string>;
  submitted: boolean;
  onSelectOption: (option: string) => void;
  isCorrect: boolean;
  activeQuestions: any[];
}

export const GapFillRenderer: React.FC<GapFillRendererProps> = ({
  q,
  currentIdx,
  answers,
  submitted,
  onSelectOption,
  isCorrect,
  activeQuestions,
}) => {
  const renderSummary = (summaryText: string, currentGap: string) => {
    const parts = summaryText.split(/(\{\d+\})/g);
    return parts.map((part, i) => {
      const match = part.match(/^\{(\d+)\}$/);
      if (match) {
        const num = match[1];
        const isCurrent = num === currentGap;
        const qIndex = activeQuestions.findIndex(
          (item) => item.type === "gap-fill" && item.gapNumber === num
        );
        const val = qIndex !== -1 ? answers[qIndex] || "" : "";
        return (
          <span
            key={i}
            className={`inline-block mx-1 px-2.5 py-0.5 rounded text-sm font-semibold transition-all ${
              isCurrent
                ? "bg-indigo-500/30 text-indigo-300 border border-indigo-500/50 animate-pulse scale-105"
                : val
                ? "bg-white/10 text-white border border-white/10"
                : "bg-white/5 text-slate-500 border border-dashed border-white/10"
            }`}
          >
            {val || `(${num})`}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-6">
      {q.summary && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
            Summary Cloze
          </span>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {renderSummary(q.summary, q.gapNumber)}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <input
          type="text"
          disabled={submitted}
          value={answers[currentIdx] || ""}
          onChange={(e) => onSelectOption(e.target.value)}
          placeholder="Type your answer..."
          className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500 text-base transition-all"
        />
        {submitted && (
          <div
            className={`p-4 rounded-xl border text-sm ${
              isCorrect
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}
          >
            <div className="font-bold uppercase text-xs tracking-wider mb-1">
              {isCorrect ? "✓ Correct Answer" : "✗ Incorrect Answer"}
            </div>
            <div>
              <span className="text-slate-400">Correct:</span>{" "}
              <span className="font-semibold text-white">{q.answer}</span>
            </div>
            {!isCorrect && answers[currentIdx] && (
              <div className="mt-1">
                <span className="text-slate-400">Your answer:</span>{" "}
                <span className="font-semibold">{answers[currentIdx]}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
