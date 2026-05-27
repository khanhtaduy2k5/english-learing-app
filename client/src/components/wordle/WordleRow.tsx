import { LetterFeedback } from "@/types/wordle";

interface WordleRowProps {
  guess: string;
  feedback?: LetterFeedback[];
  isCurrent?: boolean;
}

export default function WordleRow({ guess, feedback }: WordleRowProps) {
  const letters = guess.padEnd(5, " ").split("");

  return (
    <div className="flex gap-2 justify-center mb-2">
      {letters.map((letter, i) => {
        const isSpace = letter === " ";
        let bgClass = "bg-slate-100 dark:bg-white/[0.02] backdrop-blur-md";
        let borderClass = "border-slate-200 dark:border-white/[0.06]";
        let textClass = "text-slate-800 dark:text-white";
        let shadowClass = "shadow-md";

        if (!isSpace && !feedback) {
          // Typed but not submitted
          borderClass = "border-slate-400 dark:border-white/30";
          bgClass = "bg-slate-200/50 dark:bg-white/[0.05] backdrop-blur-xl";
        } else if (feedback && feedback[i]) {
          // Submitted
          borderClass = "border-transparent";
          shadowClass = "shadow-xl shadow-black/20 dark:shadow-black/50";
          
          // Using Tailwind arbitrary values to simulate a flip animation
          // In a real app we'd use a custom class in globals.css, but transition-all works for basic needs
          if (feedback[i] === "CORRECT") {
            bgClass = "bg-gradient-to-br from-emerald-400 to-teal-500";
            textClass = "text-white drop-shadow-md";
          } else if (feedback[i] === "PRESENT") {
            bgClass = "bg-gradient-to-br from-amber-400 to-orange-500";
            textClass = "text-white drop-shadow-md";
          } else {
            bgClass = "bg-slate-300 dark:bg-white/10 backdrop-blur-md";
            textClass = "text-slate-600 dark:text-slate-400";
          }
        }

        return (
          <div
            key={i}
            className={`w-14 h-14 border rounded-xl flex items-center justify-center text-2xl font-bold uppercase transition-all duration-700 ease-out transform ${
              feedback && feedback[i] ? "rotate-x-360 scale-100" : "scale-95"
            } ${!isSpace && !feedback ? "scale-105 shadow-indigo-500/20 shadow-lg" : ""} ${bgClass} ${borderClass} ${textClass} ${shadowClass}`}
            style={{ 
              transitionDelay: feedback ? `${i * 100}ms` : "0ms",
              transformStyle: "preserve-3d"
            }}
          >
            {letter !== " " ? letter : ""}
          </div>
        );
      })}
    </div>
  );
}
