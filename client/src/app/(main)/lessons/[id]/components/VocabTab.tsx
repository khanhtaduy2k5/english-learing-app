"use client";

import React, { useState, useEffect, useRef } from "react";
import { VocabularyItem } from "@/types";
import { BookOpen, Volume2, ChevronLeft, ChevronRight } from "lucide-react";

interface VocabTabProps {
  vocabList: VocabularyItem[];
}

export default function VocabTab({ vocabList }: VocabTabProps) {
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);
  
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const speakText = (text: string) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    
    setSpeakingWord(text);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.onend = () => {
      setSpeakingWord(null);
    };
    synthRef.current.speak(utterance);
  };

  const toggleFlip = (word: string) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      return next;
    });
  };

  if (vocabList.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
        <span className="text-5xl mb-4">💬</span>
        <h3 className="text-white font-semibold">Không có từ vựng riêng biệt</h3>
        <p className="text-slate-500 text-sm max-w-sm mt-1">
          Bài học này tập trung trực tiếp vào nội dung lý thuyết ngữ pháp hoặc đọc hiểu.
        </p>
      </div>
    );
  }

  const currentVocab = vocabList[currentVocabIndex];

  return (
    <div className="flex flex-col flex-1">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-400" />
          Từ vựng cốt lõi của bài học
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Ghi nhớ từ vựng bằng thẻ thông minh (Flashcard) có phát âm chuẩn bản xứ. Nhấp để lật thẻ.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-8 py-6">
        {/* Active Flashcard */}
        <div
          onClick={() => toggleFlip(currentVocab.word)}
          className="w-full max-w-md h-72 cursor-pointer perspective-1000 group relative"
        >
          <div
            className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
              flippedCards.has(currentVocab.word) ? "rotate-y-180" : ""
            }`}
          >
            {/* Front of Card */}
            <div className="absolute inset-0 backface-hidden rounded-3xl bg-white/[0.03] border border-white/10 hover:border-indigo-500/30 p-8 flex flex-col justify-between transition-all shadow-xl backdrop-blur-sm">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/10 uppercase">
                  {currentVocab.partOfSpeech || "Vocabulary"}
                </span>
                <span className="text-xs text-slate-500">
                  Từ {currentVocabIndex + 1}/{vocabList.length}
                </span>
              </div>
              
              <div className="text-center my-auto flex flex-col items-center gap-2">
                <h3 className="text-4xl font-extrabold text-white tracking-tight leading-none">
                  {currentVocab.word}
                </h3>
                {currentVocab.ipa && (
                  <p className="text-indigo-400 font-mono text-base">{currentVocab.ipa}</p>
                )}
              </div>

              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>Nhấn để xem nghĩa 🔄</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakText(currentVocab.word);
                  }}
                  className={`p-2 rounded-full transition-all ${
                    speakingWord === currentVocab.word
                      ? "bg-indigo-500/20 text-indigo-400 scale-110"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                  }`}
                  title="Phát âm từ"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Back of Card */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-3xl bg-gradient-to-br from-indigo-950/40 to-purple-950/20 border border-indigo-500/20 p-8 flex flex-col justify-between shadow-xl backdrop-blur-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-3">
                <span className="text-xs font-bold text-indigo-300">Định nghĩa & Ví dụ</span>
                <span className="text-xs text-slate-500">Mặt sau 🔄</span>
              </div>
              
              <div className="my-auto flex flex-col gap-4">
                <div>
                  <p className="text-lg font-bold text-white">{currentVocab.meaning}</p>
                </div>
                
                {currentVocab.example && (
                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-slate-200 text-sm font-medium italic">
                      &ldquo;{currentVocab.example}&rdquo;
                    </p>
                    {currentVocab.exampleMeaning && (
                      <p className="text-slate-400 text-xs mt-1.5">
                        👉 {currentVocab.exampleMeaning}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-500 text-center">
                Nhấn để quay lại mặt trước 🔄
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setFlippedCards(new Set());
              setCurrentVocabIndex((prev) => Math.max(0, prev - 1));
            }}
            disabled={currentVocabIndex === 0}
            className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-300 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold text-slate-400">
            {currentVocabIndex + 1} / {vocabList.length}
          </span>
          <button
            onClick={() => {
              setFlippedCards(new Set());
              setCurrentVocabIndex((prev) => Math.min(vocabList.length - 1, prev + 1));
            }}
            disabled={currentVocabIndex === vocabList.length - 1}
            className="p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-slate-300 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
