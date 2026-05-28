"use client";

import { Volume2 } from "lucide-react";

interface FloatingDictionaryProps {
  selectedWord: string;
  popupPosition: { x: number; y: number } | null;
  definition: any | null;
  loadingDef: boolean;
}

export default function FloatingDictionary({
  selectedWord,
  popupPosition,
  definition,
  loadingDef
}: FloatingDictionaryProps) {
  if (!selectedWord || !popupPosition) return null;

  const playWordAudio = (audioUrl: string) => {
    if (audioUrl) {
      new Audio(audioUrl).play().catch(console.error);
    }
  };

  const firstAudioUrl = definition?.phonetics?.find((p: any) => !!p.audio)?.audio;

  return (
    <div 
      className="absolute z-50 w-80 p-4.5 rounded-2xl bg-slate-900/90 dark:bg-slate-950/95 border border-indigo-500/35 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 text-left space-y-3 pointer-events-auto shadow-indigo-500/10"
      style={{ 
        top: `${popupPosition.y}px`, 
        left: `${popupPosition.x}px` 
      }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header info */}
      <div className="flex items-center justify-between border-b border-white/5 pb-2">
        <div className="flex items-center gap-2">
          <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 text-lg capitalize">{selectedWord}</span>
          {definition?.phonetic && (
            <span className="text-slate-400 text-xs font-mono">{definition.phonetic}</span>
          )}
        </div>
        
        {/* Speaker Audio Play Button */}
        {firstAudioUrl && (
          <button
            onClick={() => playWordAudio(firstAudioUrl)}
            title="Listen pronunciation"
            className="w-7 h-7 flex items-center justify-center rounded-full bg-indigo-500/20 hover:bg-indigo-500/35 text-indigo-300 transition-all border border-indigo-500/20 active:scale-90"
          >
            <Volume2 className="w-4 h-4 fill-indigo-400/20" />
          </button>
        )}
      </div>

      {/* Academic English Definitions */}
      <div className="space-y-2.5 max-h-[160px] overflow-y-auto scrollbar-thin pr-1 text-xs">
        <span className="text-[10px] font-black text-indigo-400 tracking-wider uppercase block">Academic English Definition</span>
        {loadingDef ? (
          <div className="space-y-1.5">
            <div className="h-3 bg-muted rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-muted rounded w-5/6 animate-pulse"></div>
          </div>
        ) : definition ? (
          definition.meanings.slice(0, 2).map((meaning: any, mi: number) => (
            <div key={mi} className="space-y-1 bg-white/[0.02] border border-white/5 p-2 rounded-xl">
              <span className="italic text-indigo-300 font-extrabold uppercase text-[9px] tracking-widest bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
                {meaning.partOfSpeech}
              </span>
              <p className="text-slate-200 leading-relaxed font-medium mt-1">
                {meaning.definitions[0].definition}
              </p>
              {meaning.definitions[0].example && (
                <p className="text-slate-400 italic bg-white/5 p-1 rounded-lg mt-1 text-[11px]">
                  &quot;{meaning.definitions[0].example}&quot;
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-xs italic">Academic definition not found</p>
        )}
      </div>
    </div>
  );
}
