// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProgressPage from "@/app/(main)/progress/page";
import AchievementsPage from "@/app/(main)/achievements/page";
import { apiClient } from "@/lib/api";

// Mock the authStore so useAuth works perfectly both as a hook and as an object with getState
vi.mock("@/store/authStore", () => {
  const mockState = {
    user: { id: "user-123", name: "Nguyen Van A" },
    token: "demo-token",
    isAuthenticated: true,
    isRefreshing: false,
    authenticate: vi.fn(),
    setUser: vi.fn(),
    setToken: vi.fn(),
    logout: vi.fn(),
    refreshOnStartup: vi.fn().mockResolvedValue(undefined),
  };
  const storeHook = vi.fn(() => mockState);
  (storeHook as any).getState = () => mockState;
  (storeHook as any).subscribe = () => () => {};
  return {
    useAuthStore: storeHook,
  };
});

const mockProgressData = [
  { id: 1, userId: "user-123", lessonId: "lesson-1", status: "completed", quizScore: 100, completedAt: "2026-05-28T00:00:00.000Z" },
  { id: 2, userId: "user-123", lessonId: "lesson-2", status: "completed", quizScore: 90, completedAt: "2026-05-28T01:00:00.000Z" },
  { id: 3, userId: "user-123", lessonId: "lesson-3", status: "completed", quizScore: 80, completedAt: "2026-05-28T02:00:00.000Z" },
  { id: 4, userId: "user-123", lessonId: "lesson-4", status: "in_progress", quizScore: 0, completedAt: "" },
];

describe("Progress and Achievements interaction tests", () => {
  let getSpy: any;

  beforeEach(() => {
    // Setup global spy on apiClient.get
    getSpy = vi.spyOn(apiClient, "get").mockImplementation(async (url: string) => {
      console.log("MOCK API GET CALLED:", url);
      return mockProgressData;
    });
  });

  afterEach(() => {
    cleanup();
    getSpy.mockRestore();
    vi.clearAllMocks();
  });

  it("renders progress page with dynamic calculations from API", async () => {
    render(<ProgressPage />);

    // Wait for the loader to clear by checking when loader text is gone
    await waitFor(() => {
      const isGone = screen.queryByText(/Calculating/i) === null;
      expect(isGone).toBe(true);
    });

    // Check completed count calculation (3 completed)
    expect(screen.getByText("3")).toBeTruthy();

    // Check estimated study time: 3 completed * 15m + 1 in_progress * 5m = 50m
    expect(screen.getByText("50m")).toBeTruthy();

    // Check milestones
    expect(screen.getByText("First Lesson Completed")).toBeTruthy();
    expect(screen.getByText("Aiming High")).toBeTruthy();
    expect(screen.getByText("Quiz Champion")).toBeTruthy();
  });

  it("renders achievements page with dynamically unlocked medals", async () => {
    render(<AchievementsPage />);

    // Wait for the loader to clear by checking when loader text is gone
    await waitFor(() => {
      const isGone = screen.queryByText(/Scanning/i) === null;
      expect(isGone).toBe(true);
    });

    // Check dynamic totals (Unlocked count should be 4 out of 11 total achievements)
    expect(screen.getByText("4/11")).toBeTruthy();

    // Verify unlocked medals are displayed
    expect(screen.getByText("First Steps")).toBeTruthy();
    expect(screen.getByText("Word Collector")).toBeTruthy();
    expect(screen.getByText("Quiz Champion")).toBeTruthy();
    expect(screen.getByText("Silver Tongue")).toBeTruthy();
  });
});
