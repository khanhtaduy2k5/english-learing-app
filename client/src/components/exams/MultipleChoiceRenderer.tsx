import React from "react";

interface MultipleChoiceRendererProps {
  q: any;
  currentIdx: number;
  answers: Record<number, string>;
  submitted: boolean;
  onSelectOption: (option: string) => void;
  playAudio?: (text: string) => void;
}

export const MultipleChoiceRenderer: React.FC<
  MultipleChoiceRendererProps
> = ({ q, currentIdx, answers, submitted, onSelectOption, playAudio }) => {
  return (
    <div className="space-y-4">
      {q.audioText && playAudio && (
        <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-inner">
          <button
            onClick={() => playAudio(q.audioText)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-purple-500 active:scale-95 transition-all group"
          >
            <svg
              className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
              />
            </svg>
          </button>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Click to Play Audio Track
          </span>
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
