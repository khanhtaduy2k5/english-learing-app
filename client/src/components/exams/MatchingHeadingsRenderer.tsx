import React from "react";

interface MatchingHeadingsRendererProps {
  q: any;
  currentIdx: number;
  answers: Record<number, string>;
  submitted: boolean;
  onSelectOption: (option: string) => void;
}

export const MatchingHeadingsRenderer: React.FC<
  MatchingHeadingsRendererProps
> = ({ q, currentIdx, answers, submitted, onSelectOption }) => {
  return (
    <div className="space-y-6">
      {q.paragraphText && (
        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
            Paragraph {q.paragraphLabel}
          </span>
          <p className="text-slate-300 text-sm leading-relaxed">
            {q.paragraphText}
          </p>
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
