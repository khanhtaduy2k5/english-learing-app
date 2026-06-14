// @vitest-environment jsdom

import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import ThemeToggle from "../../src/components/ThemeToggle";

const mockSetTheme = vi.fn();
let mockResolvedTheme = "light";

vi.mock("@/context/ThemeContext", () => {
  return {
    useTheme: () => ({
      resolvedTheme: mockResolvedTheme,
      setTheme: mockSetTheme
    })
  };
});

describe("ThemeToggle component", () => {
  test("should render moon icon in light mode and call setTheme dark when clicked", () => {
    mockResolvedTheme = "light";
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button", { name: /Switch to dark mode/i });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("dark");
  });

  test("should render sun icon in dark mode and call setTheme light when clicked", () => {
    mockResolvedTheme = "dark";
    render(<ThemeToggle />);
    
    const button = screen.getByRole("button", { name: /Switch to light mode/i });
    expect(button).toBeDefined();

    fireEvent.click(button);
    expect(mockSetTheme).toHaveBeenCalledWith("light");
  });
});
