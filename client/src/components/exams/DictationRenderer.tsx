import React from "react";

interface DictationRendererProps {
  q: any;
  currentIdx: number;
  answers: Record<number, string>;
  submitted: boolean;
  onSelectOption: (option: string) => void;
  playAudio: (text: string) => void;
  isCorrect: boolean;
}

export const DictationRenderer: React.FC<DictationRendererProps> = ({
  q,
  currentIdx,
  answers,
  submitted,
  onSelectOption,
  playAudio,
  isCorrect,
}) => {
  return (
    <div className="space-y-4">
      {q.audioText && (
        <div className="flex flex-col items-center justify-center p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3 shadow-inner">
          <button
            onClick={() => playAudio(q.audioText)}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 hover:from-indigo-400 hover:to-purple-500 active:scale-95 transition-all group"
          >
            <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          </button>
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Click to Play Audio Track</span>
        </div>
      )}

      <input
        type="text"
        disabled={submitted}
        value={answers[currentIdx] || ""}
        onChange={(e) => onSelectOption(e.target.value)}
        placeholder="Type the exact sentence you hear..."
        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500 text-base transition-all"
      />
      {submitted && (
        <div className={`p-4 rounded-xl border text-sm ${isCorrect ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-rose-500/10 border-rose-500/20 text-rose-300"}`}>
          <div className="font-bold uppercase text-xs tracking-wider mb-1">
            {isCorrect ? "✓ Correct Answer" : "✗ Incorrect Answer"}
          </div>
          <div>
            <span className="text-slate-400">Correct:</span> <span className="font-semibold text-white">{q.answer}</span>
          </div>
          {!isCorrect && answers[currentIdx] && (
            <div className="mt-1">
              <span className="text-slate-400">Your answer:</span> <span className="font-semibold">{answers[currentIdx]}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
