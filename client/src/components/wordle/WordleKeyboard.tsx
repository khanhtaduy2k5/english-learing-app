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
    if (feedback === "CORRECT") return "bg-green-600 text-white";
    if (feedback === "PRESENT") return "bg-yellow-600 text-white";
    if (feedback === "ABSENT") return "bg-gray-700 text-white opacity-50";
    return "bg-gray-400 text-black";
  };

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-lg mx-auto mt-4 px-2">
      {KEYS.map((row, i) => (
        <div key={i} className="flex gap-1.5 w-full justify-center">
          {row.map((key) => {
            const isAction = key === "ENTER" || key === "BACKSPACE";
            const bgColor = isAction ? "bg-gray-300 text-black" : getKeyColor(key);
            
            return (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className={`h-14 rounded font-bold transition-colors ${bgColor} ${
                  isAction ? "px-3 text-xs sm:text-sm flex-grow-0" : "flex-1 text-sm sm:text-base max-w-[40px]"
                } active:scale-95`}
              >
                {key === "BACKSPACE" ? "⌫" : key}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
