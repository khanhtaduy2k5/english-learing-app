import React from "react";

interface SpeakingRendererProps {
  q: any;
  currentIdx: number;
  answers: Record<number, string>;
  submitted: boolean;
  onSelectOption: (option: string) => void;
}

export const SpeakingRenderer: React.FC<SpeakingRendererProps> = ({
  q,
  currentIdx,
  answers,
  submitted,
  onSelectOption,
}) => {
  return (
    <div className="space-y-4">
      <textarea
        disabled={submitted}
        value={answers[currentIdx] || ""}
        onChange={(e) => onSelectOption(e.target.value)}
        placeholder="Type your spoken answer or preparation notes here..."
        rows={5}
        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500 text-sm transition-all resize-y"
      />
      {submitted && q.sample && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm space-y-2 animate-fade-in">
          <div className="font-bold text-indigo-400 uppercase text-xs tracking-wider">
            Sample spoken answer
          </div>
          <p className="text-slate-300 italic leading-relaxed text-xs">
            &ldquo;{q.sample}&rdquo;
          </p>
        </div>
      )}
    </div>
  );
};
