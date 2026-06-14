"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  PenTool,
  BookMarked,
  Compass,
  Headphones,
  Edit3,
  ClipboardList,
  Award,
  Newspaper,
  Gamepad2,
  TrendingUp,
  Trophy,
  Settings,
  HelpCircle,
  LogOut
} from "lucide-react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Vocabulary",
    href: "/vocabulary",
    icon: <BookMarked className="w-5 h-5" />,
  },
  {
    label: "Grammar",
    href: "/grammar",
    icon: <PenTool className="w-5 h-5" />,
  },
  {
    label: "Reading",
    href: "/reading",
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    label: "Practice",
    href: "/practice",
    icon: <Compass className="w-5 h-5" />,
  },
  {
    label: "Listening",
    href: "/listening",
    icon: <Headphones className="w-5 h-5" />,
  },
  {
    label: "Writing",
    href: "/writing",
    icon: <Edit3 className="w-5 h-5" />,
  },
  {
    label: "Quizzes",
    href: "/quizzes",
    icon: <ClipboardList className="w-5 h-5" />,
  },
  {
    label: "Exams",
    href: "/exams",
    icon: <Award className="w-5 h-5" />,
  },
  {
    label: "News",
    href: "/news",
    icon: <Newspaper className="w-5 h-5" />,
  },
  {
    label: "Wordle",
    href: "/wordle",
    icon: <Gamepad2 className="w-5 h-5" />,
  },
  {
    label: "Progress",
    href: "/progress",
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    label: "Achievements",
    href: "/achievements",
    icon: <Trophy className="w-5 h-5" />,
  },
];

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  onLogout: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  userName,
  userEmail,
  onLogout,
  isCollapsed,
  onToggle,
}: SidebarProps) {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-sidebar/75 dark:bg-sidebar/85 backdrop-blur-2xl border-r border-border/80 flex flex-col z-50 transition-all duration-300 ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo & Toggle */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0 btn-press">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-foreground font-bold text-lg tracking-tight">
              EngSphere
            </span>
          )}
        </Link>
        <button
          onClick={onToggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="p-1.5 rounded-lg hover:bg-foreground/5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer btn-press"
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
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
              className={`group flex items-center py-2.5 rounded-xl text-sm font-medium transition-all duration-200 btn-press cursor-pointer ${
                isCollapsed ? "justify-center px-2" : "gap-3 px-3"
              } ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/10 text-foreground border border-indigo-500/20 dark:border-indigo-500/30 shadow-md shadow-indigo-500/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <span
                className={`flex-shrink-0 ${isActive ? "text-indigo-500 dark:text-indigo-400" : "text-muted-foreground group-hover:text-foreground/80"}`}
              >
                {item.icon}
              </span>
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 shadow-sm shadow-indigo-400/50 animate-pulse"></span>
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
            className={`absolute bottom-20 p-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              isCollapsed ? "left-4 w-44 shadow-indigo-500/5" : "left-3 right-3"
            }`}
          >
            <div className="space-y-1">
              <Link
                href="/settings"
                onClick={() => setShowUserMenu(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 btn-press cursor-pointer"
              >
                <span className="text-muted-foreground group-hover:text-foreground">
                  <Settings className="w-4 h-4" />
                </span>
                <span>Settings</span>
              </Link>

              <Link
                href="/help"
                onClick={() => setShowUserMenu(false)}
                className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 btn-press cursor-pointer"
              >
                <span className="text-muted-foreground group-hover:text-foreground">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <span>Help</span>
              </Link>

              <hr className="border-border my-1.5" />

              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="group flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-500 hover:bg-rose-500/10 active:scale-[0.98] transition-all duration-200 text-left cursor-pointer"
              >
                <span className="text-rose-500">
                  <LogOut className="w-4 h-4" />
                </span>
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}

        {/* User Card Trigger Button */}
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className={`flex w-full items-center gap-3 p-2 rounded-2xl hover:bg-foreground/5 active:scale-[0.98] transition-all duration-200 text-left z-40 relative cursor-pointer ${
            isCollapsed ? "justify-center gap-0" : ""
          } ${showUserMenu ? "bg-foreground/5 text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg shadow-purple-500/20">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {userName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {userEmail || ""}
              </p>
            </div>
          )}
          {!isCollapsed && (
            <span
              className={`text-muted-foreground/60 transition-transform duration-300 ml-auto ${showUserMenu ? "rotate-180" : ""}`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
