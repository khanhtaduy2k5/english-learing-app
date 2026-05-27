import { LetterFeedback } from "@/types/wordle";

interface WordleKeyboardProps {
  usedLetters: Record<string, LetterFeedback>;
  onKeyPress: (key: string) => void;
}

const KEYS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
];

export default function WordleKeyboard({ usedLetters, onKeyPress }: WordleKeyboardProps) {
  const getKeyColor = (key: string) => {
    const feedback = usedLetters[key];
    if (feedback === "CORRECT") return "bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-transparent shadow-emerald-500/20 shadow-lg animate-pulse";
    if (feedback === "PRESENT") return "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-transparent shadow-amber-500/20 shadow-lg";
    if (feedback === "ABSENT") return "bg-slate-300 dark:bg-white/5 text-slate-600 dark:text-slate-500 border-slate-400/20 dark:border-white/5 opacity-80";
    return "bg-slate-100 dark:bg-white/[0.05] text-slate-800 dark:text-white border-slate-200 dark:border-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/[0.1] hover:border-slate-300 dark:hover:border-white/20";
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-lg mx-auto mt-4 px-2">
      {KEYS.map((row, i) => (
        <div key={i} className="flex gap-1.5 w-full justify-center">
          {row.map((key) => {
            const isAction = key === "ENTER" || key === "BACKSPACE";
            const baseClass = "h-14 rounded-xl font-bold transition-all duration-300 border flex items-center justify-center backdrop-blur-md active:scale-90 active:brightness-90 shadow-sm";
            const colorClass = isAction 
              ? "bg-slate-200 dark:bg-white/[0.08] text-slate-800 dark:text-white border-slate-300 dark:border-white/10 hover:bg-slate-300 dark:hover:bg-white/[0.15] hover:border-slate-400 dark:hover:border-white/20 shadow-lg" 
              : getKeyColor(key);
            
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`${baseClass} ${colorClass} ${
                  isAction ? "px-4 text-xs sm:text-sm flex-grow-0" : "flex-1 text-sm sm:text-base max-w-[40px] shadow-md hover:-translate-y-0.5 hover:shadow-xl"
                }`}
              >
                {key === "BACKSPACE" ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
                  </svg>
                ) : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
