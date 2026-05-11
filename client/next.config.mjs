/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produces a standalone server bundle — essential for small Docker images
  output: "standalone",
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080",
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: "/api/:path*",
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/api/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;