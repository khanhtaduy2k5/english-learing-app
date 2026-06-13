import React from "react";

interface ClozeRendererProps {
  q: any;
  currentIdx: number;
  answers: Record<number, string>;
  submitted: boolean;
  onSelectOption: (option: string) => void;
  activeQuestions: any[];
}

export const ClozeRenderer: React.FC<ClozeRendererProps> = ({
  q,
  currentIdx,
  answers,
  submitted,
  onSelectOption,
  activeQuestions,
}) => {
  const renderClozeText = (clozeText: string, currentGap: number) => {
    const parts = clozeText.split(/(\{\d+\})/g);
    return parts.map((part, i) => {
      const match = part.match(/^\{(\d+)\}$/);
      if (match) {
        const num = match[1];
        const isCurrent = parseInt(num) === currentGap;
        const qIndex = activeQuestions.findIndex(
          (item) => item.type === "mc-cloze" && item.gapNumber === parseInt(num)
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
      {q.text && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
            Cloze Paragraph
          </span>
          <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
            {renderClozeText(q.text, q.gapNumber)}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-2 pt-4">
        {((q.options || []) as string[]).map((option) => {
          const isSelected = answers[currentIdx] === option;
          const isOptCorrect = option === q.answer;

          let style =
            "bg-white/5 border-white/5 text-slate-300 hover:bg-white/10";
          if (submitted) {
            if (isOptCorrect) {
              style = "bg-emerald-500/20 border-emerald-500/40 text-emerald-300";
            } else if (isSelected) {
              style = "bg-rose-500/20 border-rose-500/40 text-rose-300";
            } else {
              style =
                "bg-white/2 border-white/2 text-slate-500 pointer-events-none";
            }
          } else if (isSelected) {
            style = "bg-indigo-500/10 border-indigo-500/30 text-indigo-300";
          }

          return (
            <button
              key={option}
              disabled={submitted}
              onClick={() => onSelectOption(option)}
              className={`w-full p-4 rounded-xl border text-left text-sm transition-all duration-200 ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};
