import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[500px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Logo Link */}
      <Link 
        href="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
      >
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
          E
        </div>
        <span className="font-bold tracking-tight text-xl">English App</span>
      </Link>

      {/* Centered Content Wrapper (Glassmorphism) */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] rounded-2xl p-8 shadow-2xl hover:border-white/10 transition-colors duration-300">
          {children}
        </div>
      </div>
    </div>
  );
}
