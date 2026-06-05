// @vitest-environment jsdom

import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/store/authStore", () => {
  const mockState = {
    user: { id: "user-1", name: "Nguyen Van A", email: "student@example.com" },
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

  it("returns user email from the store", async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isReady).toBe(true);
    });

    expect(result.current.user?.email).toBe("student@example.com");
  });
});
