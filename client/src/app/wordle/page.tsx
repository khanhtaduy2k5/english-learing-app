"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient } from "@/lib/api";
import { WordleGame, LetterFeedback } from "@/types/wordle";
import WordleBoard from "@/components/wordle/WordleBoard";
import WordleKeyboard from "@/components/wordle/WordleKeyboard";

export default function WordlePage() {
  const [game, setGame] = useState<WordleGame | null>(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const startGame = async () => {
    setLoading(true);
    setError("");
    try {
      const newGame = await apiClient.startWordleGame();
      setGame(newGame);
      setCurrentGuess("");
      localStorage.setItem("wordleGameId", newGame.id);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start game");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGame = async () => {
      const savedId = localStorage.getItem("wordleGameId");
      if (savedId) {
        try {
          const savedGame = await apiClient.getWordleGame(savedId);
          setGame(savedGame);
        } catch (err) {
          // If not found or error, start new
          await startGame();
        }
      } else {
        await startGame();
      }
      setLoading(false);
    };

    initGame();
  }, []);

  const handleKeyPress = useCallback(
    async (key: string) => {
      if (!game || game.status !== "IN_PROGRESS" || loading) return;

      if (key === "ENTER") {
        if (currentGuess.length !== 5) {
          // Could add a toast here
          return;
        }

        setLoading(true);
        try {
          const updatedGame = await apiClient.makeWordleGuess(game.id, currentGuess);
          setGame(updatedGame);
          setCurrentGuess("");
        } catch (err: any) {
          // API throws 400 if word not in dict (in a real app), or game over
          setError(err.response?.data?.message || "Invalid guess");
          setTimeout(() => setError(""), 3000);
        } finally {
          setLoading(false);
        }
      } else if (key === "BACKSPACE") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[A-Z]$/.test(key)) {
        if (currentGuess.length < 5) {
          setCurrentGuess((prev) => prev + key);
        }
      }
    },
    [game, currentGuess, loading]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE") {
        handleKeyPress(key);
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  if (!game && loading) {
    return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading Wordle...</div>;
  }

  const usedLetters: Record<string, LetterFeedback> = {};
  if (game) {
    // Prioritize CORRECT > PRESENT > ABSENT
    game.guesses.forEach((g) => {
      g.guess.split("").forEach((letter, i) => {
        const currentFeedback = usedLetters[letter];
        const newFeedback = g.feedback[i];
        if (newFeedback === "CORRECT") usedLetters[letter] = "CORRECT";
        else if (newFeedback === "PRESENT" && currentFeedback !== "CORRECT") usedLetters[letter] = "PRESENT";
        else if (newFeedback === "ABSENT" && !currentFeedback) usedLetters[letter] = "ABSENT";
      });
    });
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center pt-8 px-4">
      <header className="w-full max-w-lg flex justify-between items-center pb-4 border-b border-gray-700 mb-4">
        <h1 className="text-3xl font-bold tracking-widest uppercase">Wordle</h1>
        <button onClick={startGame} className="text-sm px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 transition">
          New Game
        </button>
      </header>

      <div className="flex-1 w-full max-w-lg flex flex-col items-center">
        {error && <div className="text-red-400 mb-2 font-semibold h-6">{error}</div>}
        {!error && <div className="h-6 mb-2"></div>}

        {game && (
          <WordleBoard guesses={game.guesses} currentGuess={currentGuess} maxGuesses={game.maxGuesses} />
        )}

        {game?.status === "WON" && (
          <div className="mt-4 p-4 bg-green-900/50 border border-green-500 rounded-lg text-center animate-bounce">
            <h2 className="text-2xl font-bold text-green-400">You Won!</h2>
            <p>Congratulations, you found the word!</p>
          </div>
        )}

        {game?.status === "LOST" && (
          <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-center">
            <h2 className="text-2xl font-bold text-red-400">Game Over</h2>
            <p>The word was: <span className="font-bold">{game.targetWord}</span></p>
          </div>
        )}

        <div className="mt-auto pb-8 w-full">
          <WordleKeyboard usedLetters={usedLetters} onKeyPress={handleKeyPress} />
        </div>
      </div>
    </div>
  );
}
