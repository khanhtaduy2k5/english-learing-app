"use client";

import React from "react";
import { Sparkles } from "lucide-react";

interface TipsTabProps {
  tips?: string[];
}

export default function TipsTab({ tips = [] }: TipsTabProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="mb-6 border-b border-white/5 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          Mẹo học tập hữu ích (Lesson Tips)
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          Tổng hợp các lưu ý, thành ngữ hoặc mẹo vặt ghi nhớ từ giảng viên.
        </p>
      </div>

      {tips.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-4">💡</span>
          <h3 className="text-white font-semibold">Tự học tự luyện</h3>
          <p className="text-slate-500 text-sm max-w-sm mt-1">
            Bài viết ngắn gọn, hãy tập trung vào từ vựng và câu hỏi chính.
          </p>
        </div>
      ) : (
        <div className="flex-1 space-y-4">
          {tips.map((tip, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/[0.06] to-orange-500/[0.02] border border-amber-500/15 flex items-start gap-4 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span className="text-lg bg-amber-500/20 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-amber-400 font-bold">
                {i + 1}
              </span>
              <div>
                <h4 className="text-white font-bold text-sm mb-1">Mẹo học tập #{i + 1}</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{tip}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
