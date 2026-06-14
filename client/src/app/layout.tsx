import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://learnenglish1.me"),
  title: {
    default: "EngSphere - Next-Gen Language Learning Platform",
    template: "%s | EngSphere",
  },
  description: "Master English with interactive lessons, immersive quizzes, and personalized learning pathways.",
  keywords: ["English learning", "learn English", "grammar lessons", "vocabulary", "quizzes", "EngSphere"],
  authors: [{ name: "EngSphere Team" }],
  creator: "EngSphere",
  openGraph: {
    title: "EngSphere - Next-Gen Language Learning Platform",
    description: "Master English with interactive lessons, immersive quizzes, and personalized learning pathways.",
    url: "https://learnenglish1.me",
    siteName: "EngSphere",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EngSphere - Next-Gen Language Learning Platform",
    description: "Master English with interactive lessons, immersive quizzes, and personalized learning pathways.",
  },
};

export const viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", plusJakartaSans.variable)}>
      <head>
        {/* Anti-FOUC: apply theme class before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  var resolved = theme;
                  if (theme === 'system') {
                    resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(resolved);
                } catch(e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body className={plusJakartaSans.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
