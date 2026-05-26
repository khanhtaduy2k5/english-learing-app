"use client";

import React, { useState, useEffect, useRef } from "react";
import { Lesson } from "@/types";
import {
  BookOpenText,
  Volume2,
  Play,
  Pause,
  GraduationCap,
  FileText,
  RefreshCw,
  Sparkles
} from "lucide-react";

interface ContentTabProps {
  lesson: Lesson;
}

export default function ContentTab({ lesson }: ContentTabProps) {
  // Listening Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState(1);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Writing Workspace State
  const [writingInput, setWritingInput] = useState("");
  const [writingFeedback, setWritingFeedback] = useState<string | null>(null);
  const [isAnalyzingWriting, setIsAnalyzingWriting] = useState(false);

  // Speaking Workspace State
  const [isRecording, setIsRecording] = useState(false);
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const speakText = (text: string, rate: number = 1) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    synthRef.current.speak(utterance);
  };

  const handleToggleScriptAudio = (text: string) => {
    if (!synthRef.current) return;
    if (isPlayingAudio) {
      synthRef.current.cancel();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(text, audioSpeed);
    }
  };

  const handleAnalyzeWriting = () => {
    if (!writingInput.trim()) return;
    setIsAnalyzingWriting(true);
    setWritingFeedback(null);
    
    setTimeout(() => {
      setIsAnalyzingWriting(false);
      const corrections = [
        "🌟 Tuyệt vời! Câu của bạn viết đúng ngữ pháp và rất tự nhiên.",
        "✨ Khá tốt! Một gợi ý nhỏ: Bạn có thể sử dụng các từ nối như 'moreover', 'however' để đoạn văn mượt mà hơn.",
        "👍 Cố gắng lên! Có một lỗi chính tả nhỏ trong bài viết, hãy rà soát lại thì của động từ."
      ];
      setWritingFeedback(corrections[Math.floor(Math.random() * corrections.length)]);
    }, 1500);
  };

  const handleToggleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      setSimulatedScore(Math.floor(Math.random() * 21) + 80); // 80 - 100
    } else {
      setIsRecording(true);
      setSimulatedScore(null);
    }
  };

  const skillLower = lesson.skill.toLowerCase();

  return (
    <div className="flex flex-col flex-1">
      {/* 1. Skill Reading */}
      {skillLower === "reading" && (
        <div className="flex-1 flex flex-col">
          <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <BookOpenText className="w-5 h-5 text-emerald-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Đoạn văn đọc hiểu (Reading Passage)</h2>
              <p className="text-slate-400 text-xs mt-0.5">Đọc kỹ văn bản dưới đây để chuẩn bị cho phần thực hành Quiz.</p>
            </div>
          </div>
          
          <div className="flex-1 p-6 md:p-8 rounded-2xl bg-white/[0.01] border border-white/5 shadow-inner">
            <article className="prose prose-invert max-w-none text-slate-200 leading-relaxed text-base space-y-6 whitespace-pre-wrap font-serif">
              {lesson.passage || "Đang chuẩn bị nội dung đọc hiểu..."}
            </article>
          </div>
        </div>
      )}

      {/* 2. Skill Listening */}
      {skillLower === "listening" && (
        <div className="flex-1 flex flex-col">
          <div className="mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <Volume2 className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Kịch bản đàm thoại (Audio Transcript)</h2>
              <p className="text-slate-400 text-xs mt-0.5">Luyện tai bằng cách nhấn nút phát âm để nghe đọc transcript.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900/10 to-indigo-900/10 border border-blue-500/20 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Volume2 className="w-6 h-6 text-blue-400 animate-pulse" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Bộ phát âm AI thông minh</p>
                <p className="text-slate-400 text-xs">Mô phỏng đàm thoại nghe nói tự nhiên</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={audioSpeed}
                onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
                className="bg-white/5 border border-white/10 rounded-lg text-xs text-slate-300 px-2 py-1.5 focus:outline-none"
              >
                <option value="0.75">Chậm (0.75x)</option>
                <option value="1">Bình thường (1.0x)</option>
                <option value="1.25">Nhanh (1.25x)</option>
              </select>
              <button
                onClick={() => handleToggleScriptAudio(lesson.script || "")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-white" /> Dừng nghe
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-white" /> Phát âm thanh
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 md:p-8 rounded-2xl bg-white/[0.01] border border-white/5">
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono text-sm">
              {lesson.script || "Đang chuẩn bị nội dung nghe hiểu..."}
            </div>
          </div>
        </div>
      )}

      {/* 3. Skill Grammar */}
      {skillLower === "grammar" && (
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <GraduationCap className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Quy tắc ngữ pháp cốt lõi</h2>
              <p className="text-slate-400 text-xs mt-0.5">Học cấu trúc và quan sát các ví dụ thực hành bên dưới.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-indigo-500/[0.03] border border-indigo-500/20 shadow-inner">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Cấu trúc ngữ pháp:</h3>
            <div className="text-white text-base leading-relaxed whitespace-pre-wrap">
              {lesson.grammarRule || "Không có định nghĩa ngữ pháp cụ thể."}
            </div>
          </div>

          {lesson.grammarExamples && lesson.grammarExamples.length > 0 && (
            <div>
              <h4 className="text-white font-bold text-sm mb-4">Các ví dụ minh họa:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lesson.grammarExamples.map((ex, i) => (
                  <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all flex flex-col justify-between">
                    <p className="text-indigo-300 font-semibold text-sm leading-relaxed">&ldquo;{ex.english}&rdquo;</p>
                    <p className="text-slate-400 text-xs mt-2 border-t border-white/5 pt-2">👉 {ex.vietnamese}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Skill Writing */}
      {skillLower === "writing" && (
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Không gian luyện viết (Writing Prompt)</h2>
              <p className="text-slate-400 text-xs mt-0.5">Viết bài luận ngắn theo gợi ý bên dưới để nhận phản hồi từ AI.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/[0.03] border border-amber-500/20">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1.5">Gợi ý chủ đề:</h3>
            <p className="text-white text-sm font-medium leading-relaxed italic">&ldquo;{lesson.prompt || "Hãy viết một bài luận ngắn giới thiệu bản thân."}&rdquo;</p>
          </div>

          <div className="flex-1 flex flex-col gap-3">
            <textarea
              value={writingInput}
              onChange={(e) => setWritingInput(e.target.value)}
              placeholder="Nhập bài viết của bạn tại đây (Bằng tiếng Anh)..."
              className="w-full flex-1 min-h-[180px] p-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Số ký tự: {writingInput.length}</span>
              <button
                onClick={handleAnalyzeWriting}
                disabled={isAnalyzingWriting || !writingInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:pointer-events-none text-white font-bold transition-all shadow-md shadow-amber-500/10 flex items-center gap-2"
              >
                {isAnalyzingWriting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Đang kiểm tra...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" /> Gửi kiểm tra AI
                  </>
                )}
              </button>
            </div>
          </div>

          {writingFeedback && (
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium leading-relaxed animate-fadeIn">
              {writingFeedback}
            </div>
          )}
        </div>
      )}

      {/* 5. Skill Speaking */}
      {skillLower === "speaking" && (
        <div className="flex-1 flex flex-col gap-6">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <Volume2 className="w-5 h-5 text-rose-400" />
            <div>
              <h2 className="text-lg font-bold text-white">Không gian luyện nói (Speaking Prompt)</h2>
              <p className="text-slate-400 text-xs mt-0.5">Nhấp nút micro để giả lập thu âm nói và kiểm tra phát âm.</p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-rose-500/[0.03] border border-rose-500/20 flex justify-between items-center gap-4">
            <div>
              <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">Mẫu nói cần thực hành:</h3>
              <p className="text-white text-base font-bold leading-relaxed italic">&ldquo;{lesson.prompt || "Hello! Nice to meet you."}&rdquo;</p>
            </div>
            <button
              onClick={() => speakText(lesson.prompt || "")}
              className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300"
              title="Nghe mẫu phát âm"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-8">
            <button
              onClick={handleToggleRecord}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? "bg-rose-600 animate-pulse text-white shadow-lg shadow-rose-600/30 scale-105"
                  : "bg-white/5 border border-white/10 hover:bg-white/10 text-rose-500"
              }`}
            >
              <Volume2 className="w-8 h-8" />
            </button>
            
            <div className="text-center">
              <p className="text-sm font-semibold text-white">
                {isRecording ? "🔴 Đang thu âm giọng nói của bạn..." : "Nhấn để bắt đầu thu âm mẫu nói"}
              </p>
              <p className="text-xs text-slate-500 mt-1">Nói chậm rãi, phát âm to rõ từng từ.</p>
            </div>

            {simulatedScore !== null && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center max-w-sm w-full animate-fadeIn">
                <p className="text-xs text-slate-400">Kết quả phát âm giả lập</p>
                <p className="text-4xl font-extrabold text-emerald-400 mt-1">{simulatedScore}%</p>
                <p className="text-xs text-emerald-300/80 mt-1.5">🌟 Phát âm xuất sắc! Từ nối rất mượt mà.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
