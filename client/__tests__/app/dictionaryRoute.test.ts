import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/api/dictionary/[word]/route";

describe("dictionary route", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the first dictionary entry", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ word: "learn" }, { word: "learnt" }]),
    } as Response);

    const response = await GET({} as never, { params: { word: " Learn " } });
    const body = await response.json();

    expect(fetch).toHaveBeenCalledWith(
      "https://api.dictionaryapi.dev/api/v2/entries/en/learn",
      { next: { revalidate: 3600 } },
    );
    expect(response.status).toBe(200);
    expect(body.word).toBe("learn");
  });

  it("returns 404 when the dictionary service has no definition", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    const response = await GET({} as never, { params: { word: "missing" } });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toContain("missing");
  });

  it("returns 400 for a blank word", async () => {
    const response = await GET({} as never, { params: { word: " " } });

    expect(response.status).toBe(400);
    expect(fetch).not.toHaveBeenCalled();
  });
});
