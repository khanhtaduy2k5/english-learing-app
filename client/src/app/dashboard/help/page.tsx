"use client";

import { useState } from "react";

const faqs = [
  {
    q: "How do I get started with Lingua?",
    a: "Simply create an account, take the placement test to determine your level, and start learning! Our AI will create a personalized learning path just for you.",
  },
  {
    q: "Can I reset my progress?",
    a: "Yes! Go to Settings → Account and you'll find the option to reset your learning progress. Note that this action cannot be undone.",
  },
  {
    q: "How does the streak system work?",
    a: "Complete at least one lesson per day to maintain your streak. If you miss a day, your streak resets to zero. Longer streaks earn you bonus XP and special achievements!",
  },
  {
    q: "Are the lessons available offline?",
    a: "Currently, lessons require an internet connection. We're working on offline mode for a future update — stay tuned!",
  },
  {
    q: "How is my level determined?",
    a: "We follow the CEFR framework (A1-C2). Your level is determined by the initial placement test and updated as you progress through lessons and quizzes.",
  },
  {
    q: "Can I switch between topics freely?",
    a: "Absolutely! While we recommend following the structured path, you can access any topic at your level or below from the sidebar navigation.",
  },
];

const guides = [
  { title: "Getting Started Guide", desc: "Learn the basics of using Lingua", icon: "🚀", tag: "Beginner" },
  { title: "Maximizing Your Learning", desc: "Tips for effective study sessions", icon: "💡", tag: "Tips" },
  { title: "Understanding Your Progress", desc: "How to read your analytics dashboard", icon: "📊", tag: "Analytics" },
  { title: "Practice Mode Explained", desc: "Make the most of practice exercises", icon: "🎯", tag: "Practice" },
  { title: "Achievement System", desc: "How to unlock all achievements", icon: "🏆", tag: "Achievements" },
  { title: "Keyboard Shortcuts", desc: "Speed up your learning workflow", icon: "⌨️", tag: "Advanced" },
];

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [contactForm, setContactForm] = useState({ subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSend = () => {
    if (!contactForm.subject || !contactForm.message) return;
    setSent(true);
    setContactForm({ subject: "", message: "" });
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Help Center</h1>
            <p className="text-slate-400 text-sm">Find answers and get support</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-10 max-w-2xl">
        <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search for help articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all text-lg"
        />
      </div>

      {/* Quick Guides */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5">Quick Guides</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {guides.map((guide, i) => (
            <button
              key={i}
              className="group text-left p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-sky-500/20 hover:bg-white/[0.06] transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">{guide.icon}</span>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm group-hover:text-sky-300 transition-colors">{guide.title}</h3>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-sky-500/20 text-sky-300 border border-sky-500/20">{guide.tag}</span>
                  </div>
                  <p className="text-slate-500 text-xs">{guide.desc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-white mb-5">Frequently Asked Questions</h2>
        <div className="space-y-3 max-w-3xl">
          {filteredFaqs.map((faq, i) => (
            <div
              key={i}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                expandedFaq === i ? "border-sky-500/20 bg-white/[0.05]" : "border-white/5 bg-white/[0.03]"
              }`}
            >
              <button
                onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                className="w-full p-5 text-left flex items-center justify-between"
              >
                <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                <svg
                  className={`w-5 h-5 text-slate-500 flex-shrink-0 transition-transform duration-300 ${expandedFaq === i ? "rotate-180" : ""}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {expandedFaq === i && (
                <div className="px-5 pb-5 pt-0 border-t border-white/5">
                  <p className="text-slate-400 text-sm leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-white mb-5">Still Need Help?</h2>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
          <p className="text-slate-400 text-sm mb-6">
            Can&apos;t find what you&apos;re looking for? Send us a message and we&apos;ll get back to you within 24 hours.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
              <input
                type="text"
                value={contactForm.subject}
                onChange={(e) => setContactForm((f) => ({ ...f, subject: e.target.value }))}
                placeholder="Brief description of your issue..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm((f) => ({ ...f, message: e.target.value }))}
                rows={5}
                placeholder="Describe your issue in detail..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition-all resize-none"
              />
            </div>
            <button
              onClick={handleSend}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                sent
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                  : "bg-gradient-to-r from-sky-600 to-blue-600 text-white hover:from-sky-500 hover:to-blue-500 shadow-lg shadow-sky-500/20"
              }`}
            >
              {sent ? "✓ Message Sent!" : "Send Message"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
