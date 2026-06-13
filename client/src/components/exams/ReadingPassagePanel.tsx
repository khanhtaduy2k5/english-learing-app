import React from "react";

interface ReadingPassagePanelProps {
  passage: string;
  passageTitle?: string;
}

export const ReadingPassagePanel: React.FC<ReadingPassagePanelProps> = ({
  passage,
  passageTitle,
}) => {
  return (
    <div className="space-y-4 pr-4 border-r border-white/5 max-h-[50vh] overflow-y-auto scrollbar-thin">
      <h4 className="text-white font-extrabold text-lg uppercase tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        {passageTitle || "Reading Passage"}
      </h4>
      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line font-medium">
        {passage}
      </p>
    </div>
  );
};
