import React from "react";

interface WritingRendererProps {
  q: any;
  currentIdx: number;
  answers: Record<number, string>;
  submitted: boolean;
  onSelectOption: (option: string) => void;
}

export const WritingRenderer: React.FC<WritingRendererProps> = ({
  q,
  currentIdx,
  answers,
  submitted,
  onSelectOption,
}) => {
  const textVal = answers[currentIdx] || "";
  const wordCount = textVal.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <textarea
        disabled={submitted}
        value={textVal}
        onChange={(e) => onSelectOption(e.target.value)}
        placeholder="Write your essay response here..."
        rows={8}
        className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 placeholder-slate-500 text-sm transition-all resize-y"
      />
      <div className="flex justify-between items-center text-xs font-bold text-slate-500">
        <span>Word count: {wordCount}</span>
        <span>Target: {q.minWords || 150} words</span>
      </div>
      {submitted && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm space-y-2 animate-fade-in">
          <div className="font-bold text-indigo-400 uppercase text-xs tracking-wider">
            Evaluation & General Feedback
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">
            Open-ended writing is graded based on Task Achievement, Coherence &
            Cohesion, Lexical Resource, and Grammatical Range & Accuracy. Ensure
            your essay has a clear introduction, body paragraphs, and a logical
            conclusion.
          </p>
        </div>
      )}
    </div>
  );
};
