"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import TriviaArena from "@/components/TriviaArena";

interface Joke {
  setup: string;
  punchline: string;
}

export default function QuizzesPage() {
  // Trivia Arena states
  const [inTriviaMode, setInTriviaMode] = useState(false);
  const [triviaDifficulty, setTriviaDifficulty] = useState("easy");

  // Relocated Daily Joke states
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loadingJoke, setLoadingJoke] = useState(true);
  const [jokeFlipped, setJokeFlipped] = useState(false);

  // Load Daily Joke on mount
  useEffect(() => {
    async function loadJoke() {
      try {
        const jokeData = await apiClient.getDailyJoke();
        setJoke(jokeData);
        setLoadingJoke(false);
      } catch (err) {
        console.error("Failed to load daily joke:", err);
        setLoadingJoke(false);
      }
    }
    loadJoke();
  }, []);

  const handleGetAnotherJoke = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoadingJoke(true);
    setJokeFlipped(false);
    try {
      const jokeData = await apiClient.getDailyJoke();
      setJoke(jokeData);
      setLoadingJoke(false);
    } catch (err) {
      console.error("Failed to load new joke:", err);
      setLoadingJoke(false);
    }
  };

  const startTriviaArena = (difficultyLevel: string) => {
    setInTriviaMode(true);
    setTriviaDifficulty(difficultyLevel);
  };

  // Play Active Trivia Game Mode
  if (inTriviaMode) {
    return (
      <TriviaArena
        difficulty={triviaDifficulty}
        onClose={() => setInTriviaMode(false)}
      />
    );
  }

  return (
    <div className="p-4 md:p-8 min-h-screen max-w-7xl mx-auto space-y-8">
      {/* Dynamic Trivia Arena Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl overflow-hidden bg-gradient-to-r from-violet-100 via-fuchsia-100 to-background dark:from-violet-950/40 dark:via-purple-900/20 dark:to-background border border-violet-500/20 shadow-2xl backdrop-blur-md">
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/15 dark:bg-violet-500/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-20 w-60 h-60 bg-indigo-500/15 dark:bg-indigo-500/10 rounded-full blur-3xl -z-10"></div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-4 animate-bounce">
          ⚔️ Live Interactive Arena
        </span>

        <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight">
          Welcome to the{" "}
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent">
            Trivia Game Arena
          </span>
          ! ⚔️
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base leading-relaxed">
          Challenge your intellect in real-time with random English questions
          across science, history, pop culture, and more. Select your difficulty
          and climb the leaderboard!
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => startTriviaArena("easy")}
            className="px-5 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/30 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
          >
            Play Easy Arena 🛡️
          </button>
          <button
            onClick={() => startTriviaArena("medium")}
            className="px-5 py-2.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 hover:border-amber-500/30 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm"
          >
            Play Medium Arena ⚔️
          </button>
          <button
            onClick={() => startTriviaArena("hard")}
            className="px-5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 hover:border-rose-500/30 rounded-xl text-xs font-bold transition-all duration-300 shadow-sm animate-pulse"
          >
            Play Hard Arena 🔥
          </button>
        </div>
      </div>

      {/* Relocated Premium 3D Flip Daily Joke Widget */}
      <div
        className="perspective-1000 w-full h-[200px]"
        onClick={() => setJokeFlipped(!jokeFlipped)}
      >
        <div
          className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${jokeFlipped ? "rotate-y-180" : ""}`}
        >
          {/* Front Card (Setup) */}
          <div className="absolute w-full h-full backface-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-background border border-border/40 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-purple-500/20 transition-all duration-300">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
                🎭 Daily Riddle & Fun Break
              </span>
              {loadingJoke ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-4 bg-muted rounded w-4/5"></div>
                  <div className="h-4 bg-muted rounded w-2/3"></div>
                </div>
              ) : (
                <p className="text-base md:text-lg font-bold text-foreground leading-relaxed pr-2">
                  {joke?.setup || "Loading funny content..."}
                </p>
              )}
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs text-muted-foreground">
              <span>Hover or click to reveal the punchline...</span>
              <span className="text-purple-400 text-sm font-semibold animate-bounce">
                🤫
              </span>
            </div>
          </div>

          {/* Back Card (Punchline) */}
          <div className="absolute w-full h-full backface-hidden rotate-y-180 p-6 rounded-2xl bg-gradient-to-br from-violet-100 via-purple-100 to-background dark:from-violet-950/20 dark:via-purple-900/10 dark:to-background border border-border shadow-xl backdrop-blur-md flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                😆 Aha! The Answer
              </span>
              <p className="text-base md:text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-indigo-400 leading-relaxed">
                {joke?.punchline || "Loading response..."}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-border/40 pt-3">
              <span className="text-xs text-muted-foreground">
                Laughter is the best tutor!
              </span>
              <button
                onClick={handleGetAnotherJoke}
                disabled={loadingJoke}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md hover:shadow-indigo-500/20 transition-all duration-300 disabled:opacity-50"
              >
                {loadingJoke ? "Loading..." : "Get Another Joke 🔄"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
