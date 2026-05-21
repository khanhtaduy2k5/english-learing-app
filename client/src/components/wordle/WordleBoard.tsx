import { GuessResult } from "@/types/wordle";
import WordleRow from "./WordleRow";

interface WordleBoardProps {
  guesses: GuessResult[];
  currentGuess: string;
  maxGuesses: number;
}

export default function WordleBoard({ guesses, currentGuess, maxGuesses }: WordleBoardProps) {
  const empties = Math.max(0, maxGuesses - guesses.length - 1);
  const showCurrentRow = guesses.length < maxGuesses;

  return (
    <div className="flex flex-col items-center justify-center my-6">
      {guesses.map((g, i) => (
        <WordleRow key={`guess-${i}`} guess={g.guess} feedback={g.feedback} />
      ))}
      
      {showCurrentRow && <WordleRow guess={currentGuess} isCurrent={true} />}
      
      {Array.from({ length: empties }).map((_, i) => (
        <WordleRow key={`empty-${i}`} guess="" />
      ))}
    </div>
  );
}
