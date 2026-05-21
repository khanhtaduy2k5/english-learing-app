import { LetterFeedback } from "@/types/wordle";

interface WordleRowProps {
  guess: string;
  feedback?: LetterFeedback[];
  isCurrent?: boolean;
}

export default function WordleRow({ guess, feedback, isCurrent }: WordleRowProps) {
  const letters = guess.padEnd(5, " ").split("");

  return (
    <div className="flex gap-2 justify-center mb-2">
      {letters.map((letter, i) => {
        const isSpace = letter === " ";
        let bgColor = "bg-transparent";
        let borderColor = "border-gray-600";
        let textColor = "text-white";

        if (!isSpace && !feedback) {
          // Typed but not submitted
          borderColor = "border-gray-400";
          bgColor = "bg-gray-800";
        } else if (feedback && feedback[i]) {
          // Submitted
          borderColor = "border-transparent";
          if (feedback[i] === "CORRECT") {
            bgColor = "bg-green-600";
          } else if (feedback[i] === "PRESENT") {
            bgColor = "bg-yellow-600";
          } else {
            bgColor = "bg-gray-600";
          }
        }

        return (
          <div
            key={i}
            className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold uppercase transition-colors duration-500 ${bgColor} ${borderColor} ${textColor}`}
          >
            {letter !== " " ? letter : ""}
          </div>
        );
      })}
    </div>
  );
}
