import { MetadataRoute } from "next";

const BASE_URL = "https://learnenglish1.me";
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "/login",
    "/register",
    "/dashboard",
    "/grammar",
    "/reading",
    "/exams",
    "/vocabulary",
    "/news",
    "/wordle",
    "/listening",
    "/achievements",
    "/writing",
    "/quizzes",
    "/practice",
    "/settings",
    "/help",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" || path === "/dashboard" ? "daily" : "weekly",
    priority: path === "" ? 1.0 : path === "/dashboard" ? 0.8 : 0.6,
  }));

  // Fetch dynamic paths from backend with Try/Catch & timeout to avoid blocking builds
  try {
    const fetchWithTimeout = async (url: string, timeout = 3000) => {
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), timeout);
      try {
        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(id);
        if (!response.ok) return [];
        return await response.json();
      } catch (err) {
        clearTimeout(id);
        return [];
      }
    };

    const [grammarRules, readingPassages, exams, units] = await Promise.all([
      fetchWithTimeout(`${API_URL}/api/grammar`),
      fetchWithTimeout(`${API_URL}/api/reading`),
      fetchWithTimeout(`${API_URL}/api/exams`),
      fetchWithTimeout(`${API_URL}/api/units`),
    ]);

    if (Array.isArray(grammarRules)) {
      grammarRules.forEach((rule: any) => {
        if (rule.id) {
          sitemapEntries.push({
            url: `${BASE_URL}/grammar/${rule.id}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
          });
        }
      });
    }

    if (Array.isArray(readingPassages)) {
      readingPassages.forEach((passage: any) => {
        if (passage.id) {
          sitemapEntries.push({
            url: `${BASE_URL}/reading/${passage.id}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
          });
        }
      });
    }

    if (Array.isArray(exams)) {
      exams.forEach((exam: any) => {
        if (exam.id) {
          sitemapEntries.push({
            url: `${BASE_URL}/exams/${exam.id}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
          });
        }
      });
    }

    if (Array.isArray(units)) {
      units.forEach((unit: any) => {
        if (unit.id) {
          sitemapEntries.push({
            url: `${BASE_URL}/units/${unit.id}`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.5,
          });
        }
      });
    }
  } catch (error) {
    console.warn("Failed to fetch dynamic paths for sitemap, generating static sitemap only:", error);
  }

  return sitemapEntries;
}
