import { afterEach, describe, expect, it, vi } from "vitest";
import { calculatePercentage, capitalizeFirstLetter, delay } from "./utils";

describe("calculatePercentage", () => {
  it("returns zero when total is zero", () => {
    expect(calculatePercentage(5, 0)).toBe(0);
  });

  it("calculates rounded percentage", () => {
    expect(calculatePercentage(3, 4)).toBe(75);
    expect(calculatePercentage(1, 3)).toBe(33);
  });
});

describe("capitalizeFirstLetter", () => {
  it("capitalizes the first letter and lowercases the rest", () => {
    expect(capitalizeFirstLetter("hELLO")).toBe("Hello");
    expect(capitalizeFirstLetter("english learning")).toBe("English learning");
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
