"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { DictionaryEntry } from "@/types/dictionary";
import { useDictionary } from "@/hooks/useDictionary";

interface WordLookupProps {
  /** Initial word to look up when component mounts */
  initialWord?: string;
  /** Called when user clicks "Add to My Vocabulary" */
  onAddWord?: (entry: DictionaryEntry) => void;
}

export default function WordLookup({ initialWord, onAddWord }: WordLookupProps) {
  const { entry, isLoading, error, lookup, clear } = useDictionary();
  const [query, setQuery] = useState(initialWord ?? "");
  const [activeTab, setActiveTab] = useState(0);
  const [showCorrected, setShowCorrected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (query.trim()) {
      setActiveTab(0);
      lookup(query.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
    if (e.key === "Escape") {
      setQuery("");
      clear();
      inputRef.current?.focus();
    }
  };

  const playAudio = () => {
    const audioUrl = entry?.phonetics?.find((p) => p.audio)?.audio;
    if (audioUrl) new Audio(audioUrl).play().catch(console.error);
  };

  const hasAudio = entry?.phonetics?.some((p) => !!p.audio);

  const partOfSpeechColors: Record<string, string> = {
    noun: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    verb: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    adjective: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    adverb: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    exclamation: "text-rose-400 bg-rose-500/10 border-rose-500/20",
    preposition: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    conjunction: "text-orange-400 bg-orange-500/10 border-orange-500/20",
  };

  const getPosColor = (pos: string) =>
    partOfSpeechColors[pos.toLowerCase()] ??
    "text-slate-300 bg-white/5 border-white/10";

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            ref={inputRef}
            id="word-lookup-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search a word... (Enter to look up)"
            className="w-full pl-12 pr-10 py-3.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); clear(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          id="word-lookup-btn"
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
          <span className="hidden sm:inline">{isLoading ? "Looking up..." : "Look Up"}</span>
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-4">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-4 w-32 bg-white/5 rounded-lg" />
          <div className="h-20 bg-white/5 rounded-xl" />
        </div>
      )}

      {/* Result */}
      {entry && !isLoading && (
        <div className="space-y-5">
          {/* Word Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-white capitalize">{entry.word}</h2>
                {(entry.phonetic || entry.phonetics?.[0]?.text) && (
                  <p className="text-indigo-300 font-mono text-sm mt-0.5">
                    {entry.phonetic ?? entry.phonetics[0]?.text}
                  </p>
                )}
              </div>
              {hasAudio && (
                <button
                  id="word-audio-btn"
                  onClick={playAudio}
                  title="Listen to pronunciation"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/30 hover:scale-110 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                </button>
              )}
            </div>
            {onAddWord && (
              <button
                id="word-add-btn"
                onClick={() => onAddWord(entry)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/25 transition-all text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add to My Vocabulary
              </button>
            )}
          </div>

          {/* Part-of-Speech Tabs */}
          {entry.meanings.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {entry.meanings.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    activeTab === i
                      ? getPosColor(m.partOfSpeech) + " shadow-sm"
                      : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  {m.partOfSpeech}
                </button>
              ))}
            </div>
          )}

          {/* Active Meaning */}
          {entry.meanings[activeTab] && (
            <div className="space-y-4">
              {/* Part of speech badge */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border uppercase tracking-wider ${getPosColor(entry.meanings[activeTab].partOfSpeech)}`}>
                  {entry.meanings[activeTab].partOfSpeech}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Definitions */}
              <ol className="space-y-4">
                {entry.meanings[activeTab].definitions.slice(0, 5).map((def, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                      {idx + 1}
                    </span>
                    <div className="flex-1">
                      <p className="text-white text-sm leading-relaxed">{def.definition}</p>
                      {def.example && (
                        <p className="mt-1.5 text-slate-400 text-xs italic border-l-2 border-indigo-500/30 pl-3">
                          &ldquo;{def.example}&rdquo;
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {/* Synonyms */}
              {entry.meanings[activeTab].synonyms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Synonyms</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.meanings[activeTab].synonyms.slice(0, 10).map((syn) => (
                      <button
                        key={syn}
                        onClick={() => { setQuery(syn); lookup(syn); setActiveTab(0); }}
                        className="px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 hover:bg-indigo-500/15 hover:border-indigo-500/25 hover:text-indigo-300 transition-all"
                      >
                        {syn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms */}
              {entry.meanings[activeTab].antonyms.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Antonyms</p>
                  <div className="flex flex-wrap gap-2">
                    {entry.meanings[activeTab].antonyms.slice(0, 10).map((ant) => (
                      <button
                        key={ant}
                        onClick={() => { setQuery(ant); lookup(ant); setActiveTab(0); }}
                        className="px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 hover:bg-rose-500/15 hover:border-rose-500/25 hover:text-rose-300 transition-all"
                      >
                        {ant}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Source */}
          {entry.sourceUrls?.[0] && (
            <p className="text-xs text-slate-600">
              Source:{" "}
              <a
                href={entry.sourceUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-300 underline transition-colors"
              >
                {entry.sourceUrls[0]}
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
