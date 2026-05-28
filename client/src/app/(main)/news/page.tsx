"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api";
import FloatingDictionary from "@/components/FloatingDictionary";
import { Globe, BookOpen } from "lucide-react";

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

  // Floating Dictionary states
  const [selectedWord, setSelectedWord] = useState("");
  const [definition, setDefinition] = useState<any | null>(null);
  const [loadingDef, setLoadingDef] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const newsData = await apiClient.getNewsArticles();
        setArticles(newsData);
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleMouseUp = async (e: React.MouseEvent) => {
    const selection = window.getSelection();
    const word = selection ? selection.toString().trim() : "";
    if (!word || word.includes(" ") || word.length < 2) {
      setSelectedWord("");
      setPopupPosition(null);
      return;
    }
    const cleanWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, "");
    if (!cleanWord || cleanWord.length < 2) return;

    setSelectedWord(cleanWord);
    setLoadingDef(true);
    setPopupPosition({
      x: Math.min(window.innerWidth - 340, Math.max(16, e.clientX - 140)),
      y: e.clientY + window.scrollY - 185,
    });

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${cleanWord.toLowerCase()}`,
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) setDefinition(data[0]);
      }
    } catch {
      setDefinition(null);
    } finally {
      setLoadingDef(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setSelectedWord("");
      setPopupPosition(null);
    };
    if (selectedWord) window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [selectedWord]);

  if (loading) {
    return (
      <div className="p-8 min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground text-sm font-medium animate-pulse">
          Fetching global english press articles...
        </p>
      </div>
    );
  }

  // Article detail view
  if (activeArticle) {
    return (
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 relative selection:bg-indigo-500/30 selection:text-white">
        <button
          onClick={() => setActiveArticle(null)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium"
        >
          ← Back to News
        </button>

        <div className="space-y-3">
          <span className="px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {activeArticle.readability} Level
          </span>
          <h1 className="text-2xl md:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
            {activeArticle.title}
          </h1>
        </div>

        {activeArticle.urlToImage && (
          <div className="w-full h-[250px] md:h-[350px] rounded-2xl overflow-hidden border border-border shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activeArticle.urlToImage}
              alt={activeArticle.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800";
              }}
            />
          </div>
        )}

        {/* Highlight translation notice */}
        <div className="p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center gap-3 text-xs text-indigo-300">
          <BookOpen className="w-4 h-4 flex-shrink-0 animate-pulse" />
          <p>
            Bôi đen một từ bất kỳ trong bài báo để mở Từ điển học thuật, tra cứu
            giải nghĩa Anh-Anh & nghe phát âm chuẩn.
          </p>
        </div>

        <div
          className="text-base md:text-lg font-serif text-foreground leading-relaxed space-y-6 pt-4 border-t border-border/40 whitespace-pre-wrap"
          onMouseUp={handleMouseUp}
        >
          {activeArticle.content}
        </div>

        {/* External Article Link Button */}
        {activeArticle.url && (
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-card/80 dark:bg-white/[0.02] border border-border space-y-4 mt-8">
            <p className="text-xs md:text-sm text-slate-400 text-center">
              This article is an educational excerpt. You can read the complete
              full-text coverage on the original publisher&apos;s website.
            </p>
            <a
              href={activeArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-98"
            >
              Read Full Article on original site 🌐
            </a>
          </div>
        )}

        <FloatingDictionary
          selectedWord={selectedWord}
          popupPosition={popupPosition}
          definition={definition}
          loadingDef={loadingDef}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Global News
            </h1>
            <p className="text-muted-foreground text-sm">
              Đọc báo tiếng Anh thực tế từ các hãng thông tấn lớn kèm tra từ bôi
              đen thông minh
            </p>
          </div>
        </div>
      </div>

      {/* Global News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {articles.map((article, idx) => (
          <div
            key={idx}
            onClick={() => {
              setActiveArticle(article);
              window.scrollTo(0, 0);
            }}
            className="group flex flex-col justify-between rounded-2xl bg-card/80 dark:bg-white/[0.02] border border-border overflow-hidden hover:border-indigo-500/20 hover:bg-card transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1"
          >
            <div className="w-full h-48 overflow-hidden relative border-b border-border/40">
              <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider uppercase bg-indigo-500/90 text-white">
                {article.readability}
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  article.urlToImage ||
                  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800"
                }
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=800";
                }}
              />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-foreground line-clamp-2 group-hover:text-indigo-400 transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-xs line-clamp-3 leading-relaxed">
                  {article.description ||
                    "Click to open and read full coverage."}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs text-indigo-400 font-bold border-t border-border/40 pt-3.5">
                <span>Đọc bài viết</span>
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
