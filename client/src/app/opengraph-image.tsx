import { ImageResponse } from "next/og";

export const runtime = "edge";

// Image metadata
export const alt = "EngSphere - Next-Gen Language Learning Platform";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #0f172a, #1e1b4b)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "40px",
        }}
      >
        {/* Glow Effects */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "300px",
            height: "300px",
            background: "rgba(99, 102, 241, 0.15)",
            filter: "blur(80px)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "10%",
            width: "300px",
            height: "300px",
            background: "rgba(168, 85, 247, 0.15)",
            filter: "blur(80px)",
            borderRadius: "50%",
          }}
        />

        {/* Logo Icon */}
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "24px",
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
            boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)",
          }}
        >
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        {/* Text Group */}
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            margin: "0 0 20px 0",
            background: "linear-gradient(to right, #ffffff, #c084fc)",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            letterSpacing: "-0.02em",
          }}
        >
          EngSphere
        </h1>

        <p
          style={{
            fontSize: "24px",
            color: "#94a3b8",
            textAlign: "center",
            maxWidth: "700px",
            margin: "0",
            lineHeight: "1.5",
          }}
        >
          Master English with interactive lessons, immersive quizzes, and personalized learning pathways.
        </p>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            fontSize: "18px",
            color: "#64748b",
          }}
        >
          <span>learnenglish1.me</span>
          <span style={{ color: "#334155" }}>•</span>
          <span>Next-Gen Language Learning</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
