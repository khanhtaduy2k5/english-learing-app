export type GameStatus = "IN_PROGRESS" | "WON" | "LOST";
export type LetterFeedback = "CORRECT" | "PRESENT" | "ABSENT";

export interface GuessResult {
  guess: string;
  feedback: LetterFeedback[];
}

export interface WordleGame {
  id: string;
  userId: string;
  targetWord?: string; // Optional, usually not sent to client unless WON/LOST
  status: GameStatus;
  guesses: GuessResult[];
  maxGuesses: number;
}
