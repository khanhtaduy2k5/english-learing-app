import { afterEach, describe, expect, it, vi } from "vitest";
import { calculatePercentage, capitalizeFirstLetter, delay, formatDate } from "@/lib/utils";

describe("calculatePercentage", () => {
  it("returns zero when total is zero", () => {
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  it("calculates rounded percentage", () => {
    expect(calculatePercentage(3, 4)).toBe(75);
    expect(calculatePercentage(1, 3)).toBe(33);
  });

  it("returns 100 when current equals total", () => {
    expect(calculatePercentage(10, 10)).toBe(100);
  });

  it("handles large numbers", () => {
    expect(calculatePercentage(500, 1000)).toBe(50);
  });
});

describe("capitalizeFirstLetter", () => {
  it("capitalizes the first letter and lowercases the rest", () => {
    expect(capitalizeFirstLetter("hELLO")).toBe("Hello");
    expect(capitalizeFirstLetter("english learning")).toBe("English learning");
  });

  it("handles single character strings", () => {
    expect(capitalizeFirstLetter("a")).toBe("A");
  });

  it("handles already capitalized strings", () => {
    expect(capitalizeFirstLetter("Hello")).toBe("Hello");
  });
});

describe("formatDate", () => {
  it("formats a date string to a readable format", () => {
    const result = formatDate("2026-01-15T00:00:00Z");
    expect(result).toContain("January");
    expect(result).toContain("15");
    expect(result).toContain("2026");
  });
});

describe("delay", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves after the requested time", async () => {
    vi.useFakeTimers();

    const promise = delay(1000);
    await vi.advanceTimersByTimeAsync(1000);

    await expect(promise).resolves.toBeUndefined();
  });
});
