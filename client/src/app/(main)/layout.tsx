"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/store/authStore";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user, isReady } = useAuth();
  const { logout } = useAuthStore();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("token");
    document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
    router.push("/");
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-card border border-border backdrop-blur-md shadow-2xl">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 border-2 border-indigo-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-muted-foreground text-sm tracking-wide font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar
        userName={user?.name}
        userEmail={user?.email}
        onLogout={handleLogout}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main content area - shifts right based on sidebar width */}
      <main
        className={`transition-all duration-300 min-h-screen ${
          isCollapsed ? "ml-[72px]" : "ml-[260px]"
        }`}
      >
        {children}
      </main>
    </div>
  );
}
