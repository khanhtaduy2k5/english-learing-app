// @vitest-environment jsdom

import { describe, expect, it, beforeEach } from "vitest";
import { useAuthStore } from "@/store/authStore";

describe("authStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  });

  it("has correct initial state", () => {
    const state = useAuthStore.getState();

    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("setUser updates user and sets isAuthenticated to true", () => {
    const mockUser = { id: "1", name: "Test User", email: "test@example.com" };

    useAuthStore.getState().setUser(mockUser);

    const state = useAuthStore.getState();
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  it("setToken updates the token", () => {
    useAuthStore.getState().setToken("test-token-123");

    const state = useAuthStore.getState();
    expect(state.token).toBe("test-token-123");
  });

  it("logout clears all auth state", () => {
    const mockUser = { id: "1", name: "Test User", email: "test@example.com" };

    // Set up authenticated state
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().setToken("some-token");

    // Verify it's set
    expect(useAuthStore.getState().isAuthenticated).toBe(true);

    // Logout
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it("setUser does not affect token", () => {
    useAuthStore.getState().setToken("my-token");
    useAuthStore.getState().setUser({ id: "2", name: "Another", email: "a@b.com" });

    const state = useAuthStore.getState();
    expect(state.token).toBe("my-token");
    expect(state.user?.name).toBe("Another");
  });
});
