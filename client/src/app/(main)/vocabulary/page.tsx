"use client";

import { useState } from "react";
import WordLookup from "@/components/WordLookup";
import { DictionaryEntry } from "@/types/dictionary";

const sampleWords = [
  { id: 1, word: "Eloquent", phonetic: "/ˈɛl.ə.kwənt/", meaning: "Fluent or persuasive in speaking or writing", example: "She gave an eloquent speech.", category: "Adjective", mastered: true },
  { id: 2, word: "Ephemeral", phonetic: "/ɪˈfɛm.ər.əl/", meaning: "Lasting for a very short time", example: "The ephemeral beauty of cherry blossoms.", category: "Adjective", mastered: false },
  { id: 3, word: "Ubiquitous", phonetic: "/juːˈbɪk.wɪ.təs/", meaning: "Present, appearing, or found everywhere", example: "Smartphones are ubiquitous in modern life.", category: "Adjective", mastered: false },
  { id: 4, word: "Serendipity", phonetic: "/ˌsɛr.ənˈdɪp.ɪ.ti/", meaning: "The occurrence of events by chance in a happy way", example: "Finding that book was pure serendipity.", category: "Noun", mastered: true },
  { id: 5, word: "Resilient", phonetic: "/rɪˈzɪl.i.ənt/", meaning: "Able to recover quickly from difficulties", example: "Children are remarkably resilient.", category: "Adjective", mastered: false },
  { id: 6, word: "Ambiguous", phonetic: "/æmˈbɪɡ.ju.əs/", meaning: "Open to more than one interpretation", example: "The ending of the movie was ambiguous.", category: "Adjective", mastered: false },
  { id: 7, word: "Pragmatic", phonetic: "/præɡˈmæt.ɪk/", meaning: "Dealing with things sensibly and realistically", example: "We need a pragmatic approach to solve this.", category: "Adjective", mastered: true },
  { id: 8, word: "Paradigm", phonetic: "/ˈpær.ə.daɪm/", meaning: "A typical example or pattern of something", example: "This discovery created a new scientific paradigm.", category: "Noun", mastered: false },
];

const categories = ["All", "Noun", "Verb", "Adjective", "Adverb"];

export default function VocabularyPage() {
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showLookup, setShowLookup] = useState(false);
  const [addedWords, setAddedWords] = useState<string[]>([]);

  const handleAddWord = (entry: DictionaryEntry) => {
    if (!addedWords.includes(entry.word)) {
      setAddedWords((prev) => [...prev, entry.word]);
    }
  };

  const filtered = sampleWords.filter((w) => {
    const matchCat = filter === "All" || w.category === filter;
    const matchSearch = w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const totalWords = sampleWords.length;
  const masteredWords = sampleWords.filter((w) => w.mastered).length;
  const masteredPercent = Math.round((masteredWords / totalWords) * 100);

  return (
    <div className="p-8 min-h-screen">
      {/* Word Lookup Panel */}
      <div className="mb-8">
        <button
          id="word-lookup-toggle"
          onClick={() => setShowLookup(!showLookup)}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
            showLookup
              ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 border-indigo-500/30 text-indigo-300"
              : "bg-white/[0.03] border-white/5 text-slate-400 hover:text-white hover:bg-white/[0.06]"
          }`}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Look Up a Word
          <svg
            className={`w-4 h-4 ml-1 transition-transform duration-200 ${showLookup ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showLookup && (
          <div className="mt-4 p-6 rounded-2xl bg-white/[0.02] border border-indigo-500/15 shadow-xl shadow-indigo-500/5">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-white font-semibold">Dictionary Lookup</h2>
                <p className="text-slate-500 text-xs">Powered by Free Dictionary API</p>
              </div>
              {addedWords.length > 0 && (
                <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  {addedWords.length} word{addedWords.length > 1 ? "s" : ""} added
                </span>
              )}
            </div>
            <WordLookup onAddWord={handleAddWord} />
          </div>
        )}
      </div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Vocabulary</h1>
            <p className="text-slate-400 text-sm">Build and review your word bank</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20">
          <p className="text-slate-400 text-sm">Total Words</p>
          <p className="text-2xl font-bold text-blue-400 mt-1">{totalWords}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/20">
          <p className="text-slate-400 text-sm">Mastered</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">{masteredWords}</p>
        </div>
        <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 border border-purple-500/20">
          <p className="text-slate-400 text-sm">Mastery Rate</p>
          <div className="flex items-center gap-3 mt-1">
            <p className="text-2xl font-bold text-purple-400">{masteredPercent}%</p>
            <div className="flex-1 h-2 rounded-full bg-white/5">
              <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all" style={{ width: `${masteredPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === c
                  ? "bg-gradient-to-r from-cyan-500/30 to-blue-500/20 text-white border border-cyan-500/30"
                  : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10 hover:text-white"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-2 rounded-lg transition-all ${viewMode === "cards" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-white/10 text-white" : "text-slate-500 hover:text-white"}`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filtered.map((word) => (
            <div
              key={word.id}
              onClick={() => toggleFlip(word.id)}
              className="group cursor-pointer perspective-1000"
            >
              <div className={`relative w-full min-h-[200px] transition-transform duration-500 transform-style-3d ${flippedCards.has(word.id) ? "rotate-y-180" : ""}`}>
                {/* Front */}
                <div className="absolute inset-0 backface-hidden p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-cyan-500/20 text-cyan-300 border border-cyan-500/20">
                      {word.category}
                    </span>
                    {word.mastered && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Mastered
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">{word.word}</h3>
                  <p className="text-indigo-300 text-sm font-mono mb-4">{word.phonetic}</p>
                  <p className="text-slate-500 text-xs mt-auto">Click to flip →</p>
                </div>

                {/* Back */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
                  <p className="text-white font-medium mb-3">{word.meaning}</p>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-slate-300 text-sm italic">&ldquo;{word.example}&rdquo;</p>
                  </div>
                  <p className="text-slate-500 text-xs mt-4">Click to flip back →</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Word</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Phonetic</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Meaning</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Category</th>
                <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((word) => (
                <tr key={word.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-white font-semibold">{word.word}</td>
                  <td className="px-6 py-4 text-indigo-300 text-sm font-mono">{word.phonetic}</td>
                  <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">{word.meaning}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs bg-white/5 text-slate-300 border border-white/10">{word.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    {word.mastered ? (
                      <span className="flex items-center gap-1 text-emerald-400 text-sm">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Mastered
                      </span>
                    ) : (
                      <span className="text-amber-400 text-sm">Learning</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
