// @vitest-environment jsdom

import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "./useAuth";

vi.mock("../store/authStore", () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: "user-1", name: "Nguyen Van A", email: "student@example.com" },
    token: "demo-token",
    isAuthenticated: true,
    setUser: vi.fn(),
    setToken: vi.fn(),
    logout: vi.fn(),
  })),
}));

describe("useAuth", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("exposes auth store state and becomes ready after mount", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe("Nguyen Van A");
    expect(result.current.token).toBe("demo-token");
  });
});
