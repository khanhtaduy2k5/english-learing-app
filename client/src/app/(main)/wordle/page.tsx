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
          const guessResult = await apiClient.makeWordleGuess(game.id, currentGuess);
          
          const isFinished = guessResult.status !== "IN_PROGRESS";
          if (isFinished) {
            // Fetch final game representation to retrieve targetWord (secured anti-cheat)
            const finalGame = await apiClient.getWordleGame(game.id);
            setGame(finalGame);
          } else {
            setGame((prevGame) => {
              if (!prevGame) return null;
              return {
                ...prevGame,
                guesses: [...prevGame.guesses, guessResult],
                status: guessResult.status,
              };
            });
          }
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
    <div className="min-h-[calc(100vh-4rem)] text-white flex flex-col items-center pt-8 px-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

      <header className="w-full max-w-lg flex justify-between items-center pb-4 border-b border-white/10 mb-8 z-10">
        <h1 className="text-3xl font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Wordle</h1>
        <button onClick={startGame} className="text-sm px-4 py-2 bg-white/[0.05] border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-xl transition-all duration-300 font-medium active:scale-95 shadow-lg">
          New Game
        </button>
      </header>

      <div className="flex-1 w-full max-w-lg flex flex-col items-center z-10">
        <div className="h-12 w-full flex justify-center items-center mb-4">
          {error && (
            <div className="w-full max-w-sm px-4 py-2 bg-rose-500/20 border border-rose-500/30 rounded-xl text-center backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-rose-200 font-medium text-sm">{error}</span>
            </div>
          )}
        </div>

        {game && (
          <WordleBoard guesses={game.guesses} currentGuess={currentGuess} maxGuesses={game.maxGuesses} />
        )}

        <div className="h-24 w-full flex items-center justify-center mt-6">
          {game?.status === "WON" && (
            <div className="w-full px-6 py-4 bg-gradient-to-r from-emerald-400/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl text-center backdrop-blur-xl shadow-2xl shadow-emerald-500/10 animate-bounce">
              <h2 className="text-2xl font-bold text-emerald-300 mb-1">You Won!</h2>
              <p className="text-emerald-100/70 text-sm">Congratulations, you found the word!</p>
            </div>
          )}

          {game?.status === "LOST" && (
            <div className="w-full px-6 py-4 bg-gradient-to-r from-rose-400/20 to-pink-500/20 border border-rose-500/30 rounded-2xl text-center backdrop-blur-xl shadow-2xl shadow-rose-500/10">
              <h2 className="text-2xl font-bold text-rose-300 mb-1">Game Over</h2>
              <p className="text-rose-100/70 text-sm">The word was: <span className="font-bold tracking-widest">{game.targetWord}</span></p>
            </div>
          )}
        </div>

        <div className="mt-auto pb-8 w-full z-20">
          <WordleKeyboard usedLetters={usedLetters} onKeyPress={handleKeyPress} />
        </div>
      </div>
    </div>
  );
}
