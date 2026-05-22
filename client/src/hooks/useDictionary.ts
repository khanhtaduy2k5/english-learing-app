"use client";

import { useState, useCallback } from "react";
import { DictionaryEntry } from "@/types/dictionary";

interface UseDictionaryReturn {
  entry: DictionaryEntry | null;
  isLoading: boolean;
  error: string | null;
  lookup: (word: string) => Promise<void>;
  clear: () => void;
}

export function useDictionary(): UseDictionaryReturn {
  const [entry, setEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (word: string) => {
    const trimmed = word.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setError(null);
    setEntry(null);

    try {
      const res = await fetch(
        `/api/dictionary/${encodeURIComponent(trimmed)}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Word not found.");
      } else {
        setEntry(data as DictionaryEntry);
      }
    } catch {
      setError("Failed to fetch. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    setEntry(null);
    setError(null);
  }, []);

  return { entry, isLoading, error, lookup, clear };
}
