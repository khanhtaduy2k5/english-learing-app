// @vitest-environment jsdom

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDictionary } from "@/hooks/useDictionary";

const dictionaryEntry = {
  word: "learn",
  phonetics: [],
  meanings: [
    {
      partOfSpeech: "verb",
      definitions: [{ definition: "Gain knowledge." }],
      synonyms: [],
      antonyms: [],
    },
  ],
  sourceUrls: [],
};

describe("useDictionary", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("looks up a word and stores the returned entry", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(dictionaryEntry),
    } as Response);

    const { result } = renderHook(() => useDictionary());

    await act(async () => {
      await result.current.lookup(" learn ");
    });

    expect(fetch).toHaveBeenCalledWith(
      "https://api.dictionaryapi.dev/api/v2/entries/en/learn",
    );
    expect(result.current.entry?.word).toBe("learn");
    expect(result.current.error).toBeNull();
    expect(result.current.isLoading).toBe(false);
  });

  it("stores API errors and clears stale entries", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "No definition found" }),
    } as Response);

    const { result } = renderHook(() => useDictionary());

    await act(async () => {
      await result.current.lookup("unknown");
    });

    expect(result.current.entry).toBeNull();
    expect(result.current.error).toBe("Word not found in dictionary.");
  });

  it("ignores blank lookups and clears result state", async () => {
    const { result } = renderHook(() => useDictionary());

    await act(async () => {
      await result.current.lookup("   ");
      result.current.clear();
    });

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
      expect(result.current.entry).toBeNull();
      expect(result.current.error).toBeNull();
    });
  });
});
