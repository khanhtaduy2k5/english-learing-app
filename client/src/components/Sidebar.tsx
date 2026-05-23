"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: "Lessons",
    href: "/lessons",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    label: "Vocabulary",
    href: "/vocabulary",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  {
    label: "Grammar",
    href: "/grammar",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    label: "Practice",
    href: "/practice",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Writing",
    href: "/writing",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    label: "Quizzes",
    href: "/quizzes",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Wordle",
    href: "/wordle",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    label: "Progress",
    href: "/progress",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    label: "Achievements",
    href: "/achievements",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
  },
];



interface SidebarProps {
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ userName, userEmail, onLogout, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-sidebar/80 dark:bg-sidebar/90 backdrop-blur-xl border-r border-border flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          {!isCollapsed && (
            <span className="text-foreground font-bold text-lg tracking-tight">Lingua</span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors"
        >
          <svg className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto scrollbar-thin">
        {!isCollapsed && (
          <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/80 px-3 mb-3">
            Main Menu
          </p>
        )}
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500/15 to-purple-500/5 text-foreground border border-indigo-500/10 dark:border-indigo-500/20 shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={`flex-shrink-0 ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground/80"}`}>
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-sm shadow-indigo-400/50"></span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Area */}
      <div className="px-3 py-4 border-t border-border relative">
        {/* Transparent backdrop to click outside and close menu */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40 cursor-default" 
            onClick={(e) => {
              e.stopPropagation();
              setShowUserMenu(false);
            }} 
          />
        )}

        {/* Floating User Context Menu */}
        {showUserMenu && (
          <div
            className={`absolute bottom-20 p-2 rounded-2xl bg-white dark:bg-sidebar/95 backdrop-blur-xl border border-border shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              isCollapsed ? "left-4 w-44 shadow-indigo-500/5" : "left-3 right-3"
            }`}
          >
            <div className="space-y-1">
              <Link
                href="/settings"
                onClick={() => setShowUserMenu(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              >
                <span className="text-muted-foreground group-hover:text-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                <span>Settings</span>
              </Link>

              <Link
                href="/help"
                onClick={() => setShowUserMenu(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              >
                <span className="text-muted-foreground group-hover:text-foreground">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>Help</span>
              </Link>

              <hr className="border-border my-1.5" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="group flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 active:scale-[0.98] transition-all duration-200 text-left"
              >
                <span className="text-rose-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* User Card Trigger Button */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`flex w-full items-center gap-3 p-2 rounded-2xl hover:bg-foreground/5 active:scale-[0.98] transition-all duration-200 text-left z-40 relative ${
            isCollapsed ? "justify-center" : ""
          } ${showUserMenu ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-purple-500/20">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{userName || "User"}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail || ""}</p>
            </div>
          )}
          {!isCollapsed && (
            <span className={`text-muted-foreground/60 transition-transform duration-300 ml-auto ${showUserMenu ? "rotate-180" : ""}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
