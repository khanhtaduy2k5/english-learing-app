"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme, ThemeMode } from "@/context/ThemeContext";

type SettingsTab = "profile" | "notifications" | "appearance" | "account";

/* ── Icons ── */
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
  </svg>
);

const MonitorIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const themeOptions: { id: ThemeMode; label: string; desc: string; icon: JSX.Element; preview: JSX.Element }[] = [
  {
    id: "light",
    label: "Light",
    desc: "Bright & clean interface",
    icon: <SunIcon />,
    preview: (
      <div className="w-full h-16 rounded-lg overflow-hidden border border-black/10 flex flex-col gap-1 p-2 bg-slate-100">
        <div className="flex gap-1">
          <div className="w-6 h-1.5 rounded-full bg-slate-300" />
          <div className="w-10 h-1.5 rounded-full bg-indigo-300" />
        </div>
        <div className="flex gap-1 mt-auto">
          <div className="w-4 h-4 rounded bg-white border border-slate-200" />
          <div className="flex-1 h-4 rounded bg-white border border-slate-200" />
        </div>
      </div>
    ),
  },
  {
    id: "dark",
    label: "Dark",
    desc: "Easy on the eyes at night",
    icon: <MoonIcon />,
    preview: (
      <div className="w-full h-16 rounded-lg overflow-hidden border border-white/10 flex flex-col gap-1 p-2 bg-[#030712]">
        <div className="flex gap-1">
          <div className="w-6 h-1.5 rounded-full bg-slate-700" />
          <div className="w-10 h-1.5 rounded-full bg-indigo-700" />
        </div>
        <div className="flex gap-1 mt-auto">
          <div className="w-4 h-4 rounded bg-white/5 border border-white/10" />
          <div className="flex-1 h-4 rounded bg-white/5 border border-white/10" />
        </div>
      </div>
    ),
  },
  {
    id: "system",
    label: "System",
    desc: "Follows OS preference",
    icon: <MonitorIcon />,
    preview: (
      <div className="w-full h-16 rounded-lg overflow-hidden border border-white/10 flex">
        <div className="flex-1 bg-slate-100 flex flex-col gap-1 p-2">
          <div className="w-6 h-1.5 rounded-full bg-slate-300" />
          <div className="w-4 h-1.5 rounded-full bg-indigo-300" />
        </div>
        <div className="flex-1 bg-[#030712] flex flex-col gap-1 p-2">
          <div className="w-6 h-1.5 rounded-full bg-slate-700" />
          <div className="w-4 h-1.5 rounded-full bg-indigo-700" />
        </div>
      </div>
    ),
  },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [dailyGoal, setDailyGoal] = useState(30);
  const [notifications, setNotifications] = useState({
    dailyReminder: true,
    streakAlert: true,
    weeklyReport: false,
    newContent: true,
    achievements: true,
  });
  const [language, setLanguage] = useState("en");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs: { id: SettingsTab; label: string; icon: JSX.Element }[] = [
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
    },
    {
      id: "account",
      label: "Account",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-500 to-zinc-600 flex items-center justify-center shadow-lg shadow-slate-500/20">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-slate-400 text-sm">Manage your preferences</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="p-2 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-white border border-indigo-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className={activeTab === tab.id ? "text-indigo-400" : "text-slate-500"}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 max-w-2xl">

          {/* ── Profile Tab ── */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Profile Information</h3>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-purple-500/20">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white hover:bg-white/10 transition-all">
                      Change Avatar
                    </button>
                  </div>
                </div>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Display Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || ""}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ""}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Daily Learning Goal</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range" min={5} max={120} step={5}
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(Number(e.target.value))}
                        className="flex-1 accent-indigo-500"
                      />
                      <span className="text-white font-bold text-lg w-20 text-right">{dailyGoal} min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === "notifications" && (
            <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { key: "dailyReminder" as const, label: "Daily Reminder", desc: "Get a notification to practice every day" },
                  { key: "streakAlert" as const, label: "Streak Alert", desc: "Warning when your streak is about to end" },
                  { key: "weeklyReport" as const, label: "Weekly Progress Report", desc: "Summary of your weekly learning activity" },
                  { key: "newContent" as const, label: "New Content", desc: "Notifications when new lessons are available" },
                  { key: "achievements" as const, label: "Achievement Unlocked", desc: "Celebrate when you earn new achievements" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="text-white font-medium text-sm">{item.label}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications((n) => ({ ...n, [item.key]: !n[item.key] }))}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${notifications[item.key] ? "bg-indigo-500" : "bg-white/10"}`}
                    >
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${notifications[item.key] ? "left-6" : "left-0.5"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Appearance Tab ── */}
          {activeTab === "appearance" && (
            <div className="space-y-6">

              {/* Theme Selector */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Interface Theme</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Choose how the app looks for you</p>
                  </div>
                  {/* Live badge */}
                  <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                    resolvedTheme === "dark"
                      ? "bg-slate-800/60 border-slate-700 text-slate-300"
                      : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${resolvedTheme === "dark" ? "bg-slate-400" : "bg-amber-400"}`} />
                    {resolvedTheme === "dark" ? "Dark mode active" : "Light mode active"}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {themeOptions.map((opt) => {
                    const isActive = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        id={`theme-option-${opt.id}`}
                        onClick={() => setTheme(opt.id)}
                        className={`group relative flex flex-col p-4 rounded-2xl border transition-all duration-300 text-left ${
                          isActive
                            ? "border-indigo-500/50 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                            : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                        }`}
                      >
                        {/* Active checkmark */}
                        {isActive && (
                          <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/30">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                        )}

                        {/* Preview */}
                        <div className="mb-3">{opt.preview}</div>

                        {/* Icon + label */}
                        <div className={`flex items-center gap-2 mb-0.5 ${isActive ? "text-indigo-300" : "text-slate-400 group-hover:text-slate-300"}`}>
                          {opt.icon}
                          <span className="text-sm font-semibold">{opt.label}</span>
                        </div>
                        <p className="text-xs text-slate-600">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* System hint */}
                {theme === "system" && (
                  <div className="mt-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-xs text-blue-400">
                      Currently using <strong>{resolvedTheme}</strong> mode based on your OS setting.
                      Change your system appearance to switch automatically.
                    </p>
                  </div>
                )}
              </div>

              {/* Interface Language */}
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Interface Language</h3>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none"
                >
                  <option value="en" className="bg-[#0a0f1e]">English</option>
                  <option value="vi" className="bg-[#0a0f1e]">Tiếng Việt</option>
                  <option value="ja" className="bg-[#0a0f1e]">日本語</option>
                  <option value="ko" className="bg-[#0a0f1e]">한국어</option>
                </select>
              </div>
            </div>
          )}

          {/* ── Account Tab ── */}
          {activeTab === "account" && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h3 className="text-lg font-bold text-white mb-6">Change Password</h3>
                <div className="space-y-4">
                  {[
                    { label: "Current Password", placeholder: "••••••••" },
                    { label: "New Password", placeholder: "••••••••" },
                    { label: "Confirm New Password", placeholder: "••••••••" },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{f.label}</label>
                      <input
                        type="password"
                        placeholder={f.placeholder}
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                <h3 className="text-lg font-bold text-rose-400 mb-2">Danger Zone</h3>
                <p className="text-slate-400 text-sm mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-sm font-medium hover:bg-rose-500/20 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className={`px-8 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                saved
                  ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-500/20"
              }`}
            >
              {saved ? "✓ Saved Successfully" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
