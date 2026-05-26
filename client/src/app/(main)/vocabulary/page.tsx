"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useDictionary } from "@/hooks/useDictionary";
import {
  Search,
  Volume2,
  BookOpen,
  Sparkles,
  Hash,
  AlertCircle,
  X,
  RefreshCw
} from "lucide-react";

export default function VocabularyPage() {
  const { entry, isLoading, error, lookup, clear } = useDictionary();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);



  const handleSearch = () => {
    if (query.trim()) {
      setActiveTab(0);
      lookup(query.trim());
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleSuggestionClick = (word: string) => {
    setQuery(word);
    setActiveTab(0);
    lookup(word);
  };

  const playAudio = () => {
    const audioUrl = entry?.phonetics?.find((p) => p.audio)?.audio;
    if (audioUrl) {
      new Audio(audioUrl).play().catch(console.error);
    }
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
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8 bg-gray-950 text-slate-100 min-h-screen animate-fadeIn">
      {/* Header Banner */}
      <div className="text-center space-y-3 py-6">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Từ Điển Tra Cứu Anh - Anh
        </h1>
        <p className="text-slate-400 text-sm max-w-lg mx-auto">
          Tra cứu từ vựng tức thì bằng tiếng Anh học thuật bản xứ, hỗ trợ phát âm chuẩn và từ đồng nghĩa/trái nghĩa.
        </p>
      </div>

      {/* Exquisite Search Bar */}
      <div className="flex gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập từ tiếng Anh cần tra cứu... (Ví dụ: hello, serendipity)"
            className="w-full pl-12 pr-10 py-3.5 bg-white/[0.03] border border-white/5 group-hover:border-white/10 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 rounded-2xl text-white placeholder-slate-500 focus:outline-none transition-all text-sm shadow-xl"
          />
          {query && (
            <button
              onClick={() => { setQuery(""); clear(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          disabled={isLoading || !query.trim()}
          className="px-6 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-200 hover:shadow-lg hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Search className="w-5 h-5" />
          )}
          <span className="hidden sm:inline">{isLoading ? "Đang tra cứu..." : "Tra cứu"}</span>
        </button>
      </div>

      {/* Error Alert State */}
      {error && (
        <div className="flex items-start gap-3 p-5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 animate-fadeIn">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Không tìm thấy từ vựng</h4>
            <p className="text-xs text-rose-400/80 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 space-y-6 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-8 w-48 bg-white/5 rounded-lg" />
              <div className="h-4 w-32 bg-white/5 rounded-lg" />
            </div>
            <div className="h-10 w-10 bg-white/5 rounded-full" />
          </div>
          <div className="h-px bg-white/5" />
          <div className="space-y-4">
            <div className="h-5 w-24 bg-white/5 rounded-md" />
            <div className="h-16 bg-white/5 rounded-2xl" />
          </div>
        </div>
      )}

      {/* Result View */}
      {entry && !isLoading ? (
        <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/5 shadow-2xl space-y-6 animate-fadeIn">
          {/* Word Header */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tight capitalize leading-none">
                {entry.word}
              </h2>
              {(entry.phonetic || entry.phonetics?.[0]?.text) && (
                <p className="text-indigo-400 font-mono text-base mt-2">
                  {entry.phonetic ?? entry.phonetics[0]?.text}
                </p>
              )}
            </div>
            {hasAudio && (
              <button
                onClick={playAudio}
                title="Nghe phát âm chuẩn"
                className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/35 hover:scale-110 active:scale-95 transition-all duration-200 shadow-lg shadow-indigo-500/10"
              >
                <Volume2 className="w-6 h-6 fill-indigo-400" />
              </button>
            )}
          </div>

          {/* Part of Speech Selection Tabs */}
          {entry.meanings.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {entry.meanings.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                    activeTab === i
                      ? getPosColor(m.partOfSpeech) + " shadow-md"
                      : "bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {m.partOfSpeech.toUpperCase()}
                </button>
              ))}
            </div>
          )}

          {/* Meaning / Definition Block */}
          {entry.meanings[activeTab] && (
            <div className="space-y-6">
              {/* Part of Speech header */}
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-black border uppercase tracking-wider ${getPosColor(entry.meanings[activeTab].partOfSpeech)}`}>
                  {entry.meanings[activeTab].partOfSpeech}
                </span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              {/* Definitions Comparative List */}
              <ol className="space-y-4">
                {entry.meanings[activeTab].definitions.slice(0, 5).map((def, idx) => (
                  <li key={idx} className="flex gap-4 p-4 rounded-2xl bg-white/[0.01] border border-white/5 hover:border-indigo-500/15 transition-all">
                    <span className="shrink-0 w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-400">
                      {idx + 1}
                    </span>
                    <div className="space-y-2">
                      <p className="text-white text-sm leading-relaxed">{def.definition}</p>
                      {def.example && (
                        <div className="text-slate-400 text-xs italic border-l-2 border-indigo-500/30 pl-3 leading-relaxed">
                          &ldquo;{def.example}&rdquo;
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {/* Synonyms list */}
              {entry.meanings[activeTab].synonyms.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Từ đồng nghĩa (Synonyms):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.meanings[activeTab].synonyms.slice(0, 8).map((syn) => (
                      <button
                        key={syn}
                        onClick={() => handleSuggestionClick(syn)}
                        className="px-3 py-1.5 rounded-xl text-xs bg-white/5 border border-white/5 text-slate-300 hover:bg-indigo-500/10 hover:border-indigo-500/20 hover:text-indigo-400 transition-all font-semibold"
                      >
                        {syn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Antonyms list */}
              {entry.meanings[activeTab].antonyms.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5" /> Từ trái nghĩa (Antonyms):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {entry.meanings[activeTab].antonyms.slice(0, 8).map((ant) => (
                      <button
                        key={ant}
                        onClick={() => handleSuggestionClick(ant)}
                        className="px-3 py-1.5 rounded-xl text-xs bg-white/5 border border-white/5 text-slate-300 hover:bg-rose-500/10 hover:border-rose-500/20 hover:text-rose-400 transition-all font-semibold"
                      >
                        {ant}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sources URL */}
          {entry.sourceUrls?.[0] && (
            <div className="text-[10px] text-slate-600 flex items-center gap-1 pt-4 border-t border-white/5">
              <span>Nguồn tài liệu học thuật:</span>
              <a
                href={entry.sourceUrls[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-indigo-400 underline transition-colors"
              >
                {entry.sourceUrls[0]}
              </a>
            </div>
          )}
        </div>
      ) : !isLoading ? (
        /* Dynamic Welcome/Landing Interface (NO SEARCH YET) */
        <div className="p-8 rounded-3xl bg-white/[0.01] border border-white/5 text-center py-16 space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto animate-bounce">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">Bắt đầu tra cứu từ vựng của bạn</h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1 leading-relaxed">
              Nhập bất kỳ từ vựng nào bằng tiếng Anh vào thanh tìm kiếm phía trên để nhận giải nghĩa đầy đủ nhất.
            </p>
          </div>


        </div>
      ) : null}
    </div>
  );
}
