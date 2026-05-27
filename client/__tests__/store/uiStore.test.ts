import { beforeEach, describe, expect, it } from "vitest";
import { useUiStore } from "@/store/uiStore";

describe("uiStore", () => {
  beforeEach(() => {
    useUiStore.setState({ sidebarOpen: true, theme: "light" });
  });

  it("toggles sidebar visibility", () => {
    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(false);

    useUiStore.getState().toggleSidebar();
    expect(useUiStore.getState().sidebarOpen).toBe(true);
  });

  it("sets the selected theme", () => {
    useUiStore.getState().setTheme("dark");

    expect(useUiStore.getState().theme).toBe("dark");
  });
});
