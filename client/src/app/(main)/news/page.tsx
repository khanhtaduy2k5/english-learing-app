"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";

interface Article {
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  readability: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // Instant Dictionary states
  const [selectedWord, setSelectedWord] = useState("");
  const [definition, setDefinition] = useState<any | null>(null);
  const [loadingDef, setLoadingDef] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);

  // Fetch articles on mount
  useEffect(() => {
    async function loadNews() {
      try {
        const data = await apiClient.getNewsArticles();
        setArticles(data);
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // Handle double click or selection to look up dictionary
  const handleMouseUp = async (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const word = selection ? selection.toString().trim() : "";

    // Clear dictionary popup if empty selection
    if (!word || word.includes(" ") || word.length < 2) {
      setSelectedWord("");
      setPopupPosition(null);
      setDefinition(null);
      return;
    }

    // Clean word from punctuation
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
    if (!cleanWord || cleanWord.length < 2) return;

    setSelectedWord(cleanWord);
    setLoadingDef(true);
    
    // Place popup near the cursor/selection
    setPopupPosition({
      x: Math.min(window.innerWidth - 320, Math.max(16, e.clientX - 140)),
      y: e.clientY + window.scrollY - 150,
    });

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord.toLowerCase()}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setDefinition(data[0]);
        } else {
          setDefinition(null);
        }
      } else {
        setDefinition(null);
      }
    } catch (err) {
      console.error("Failed to look up definition:", err);
      setDefinition(null);
    } finally {
      setLoadingDef(false);
    }
  };

  // Close dictionary popup on click outside
  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedWord("");
      setPopupPosition(null);
      setDefinition(null);
    };

    if (selectedWord) {
      window.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [selectedWord]);

  // Format date
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm font-medium animate-pulse">Fetching global news papers...</p>
      </div>
    );
  }

  // Article details view
  if (activeArticle) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 relative selection:bg-indigo-500/30 selection:text-white">
        
        {/* Back Button */}
        <button
          onClick={() => setActiveArticle(null)}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to News
        </button>

        {/* Article Metadata */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
              activeArticle.readability === "Easy" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
              activeArticle.readability === "Medium" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}>
              {activeArticle.readability} Level
            </span>
            <span className="text-slate-500 text-xs">{formatDate(activeArticle.publishedAt)}</span>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {activeArticle.title}
          </h1>
        </div>

        {/* Tip Banner */}
        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2">
          <span className="animate-bounce">💡</span>
          <span><strong>Superpower:</strong> Double click or highlight any English word in the text below to translate and see its pronunciation instantly!</span>
        </div>

        {/* Article Image */}
        {activeArticle.urlToImage && (
          <div className="w-full h-[250px] md:h-[400px] rounded-2xl overflow-hidden border border-border shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={activeArticle.urlToImage} 
              alt={activeArticle.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800";
              }}
            />
          </div>
        )}

        {/* Article Content with Text selection support */}
        <div 
          className="text-base md:text-xl font-serif text-slate-300 leading-relaxed space-y-6 pt-4 border-t border-border/40"
          onMouseUp={handleMouseUp}
        >
          <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-indigo-400 first-letter:mr-3 first-letter:float-left">
            {activeArticle.content}
          </p>
          <p className="text-sm font-sans text-slate-500 italic pt-6">
            Source article:{" "}
            <a 
              href={activeArticle.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              Read full original story
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </p>
        </div>

        {/* Floating Dictionary Popup */}
        {selectedWord && popupPosition && (
          <div 
            className="absolute z-50 w-72 p-4 rounded-xl bg-background/95 border border-indigo-500/25 shadow-2xl backdrop-blur-md animate-fade-in text-left space-y-2 pointer-events-auto"
            style={{ 
              top: `${popupPosition.y}px`, 
              left: `${popupPosition.x}px` 
            }}
            onMouseDown={(e) => e.stopPropagation()} // Stop propagation to prevent closing
          >
            <div className="flex items-center justify-between border-b border-border/40 pb-1.5">
              <span className="font-extrabold text-indigo-400 text-base">{selectedWord}</span>
              {definition?.phonetic && (
                <span className="text-slate-400 text-xs font-mono">{definition.phonetic}</span>
              )}
            </div>

            {loadingDef ? (
              <div className="space-y-2 py-2">
                <div className="h-3 bg-muted rounded w-2/3 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-5/6 animate-pulse"></div>
              </div>
            ) : definition ? (
              <div className="space-y-2 max-h-[150px] overflow-y-auto scrollbar-thin pr-1 text-xs">
                {definition.meanings.slice(0, 2).map((meaning: any, mi: number) => (
                  <div key={mi} className="space-y-1">
                    <span className="italic text-indigo-300 font-semibold uppercase text-[10px] tracking-wider">
                      {meaning.partOfSpeech}
                    </span>
                    <p className="text-foreground leading-relaxed">
                      {meaning.definitions[0].definition}
                    </p>
                    {meaning.definitions[0].example && (
                      <p className="text-slate-400 italic bg-white/5 p-1 rounded">
                        &quot;Ex: {meaning.definitions[0].example}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-xs py-2">No English definition found for &quot;{selectedWord}&quot;.</p>
            )}
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">English News Portal</h1>
          <p className="text-slate-400 text-sm">Read top English articles and tap words to learn vocabulary instantly</p>
        </div>
      </div>

      {/* Grid of news */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <div
            key={idx}
            onClick={() => {
              setActiveArticle(article);
              window.scrollTo(0, 0);
            }}
            className="group flex flex-col justify-between rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden hover:border-indigo-500/20 hover:bg-white/[0.05] transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
          >
            {/* Header Image with Readability Tag */}
            <div className="w-full h-48 overflow-hidden relative border-b border-border/40">
              <div className="absolute top-3 left-3 z-10">
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase shadow-md ${
                  article.readability === "Easy" ? "bg-emerald-500/90 text-white" :
                  article.readability === "Medium" ? "bg-amber-500/90 text-white" :
                  "bg-rose-500/90 text-white"
                }`}>
                  {article.readability}
                </span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={article.urlToImage || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800"} 
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800";
                }}
              />
            </div>

            {/* Content info */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[10px] text-slate-500 font-semibold">{formatDate(article.publishedAt)}</span>
                <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-400 text-xs line-clamp-3 leading-relaxed">
                  {article.description || "No description provided. Click to open and read full coverage."}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-indigo-400 font-bold border-t border-border/40 pt-3.5">
                <span>Start Learning</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
