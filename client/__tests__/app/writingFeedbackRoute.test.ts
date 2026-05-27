import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/writing-feedback/route";

function request(body: unknown) {
  return {
    json: () => Promise.resolve(body),
  } as Request;
}

describe("writing feedback route", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("rejects text that is too short", async () => {
    const response = await POST(request({ text: "short" }) as never);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain("at least 10 characters");
    expect(fetch).not.toHaveBeenCalled();
  });

  it("returns parsed AI feedback on success", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          choices: [
            {
              message: {
                content: JSON.stringify({
                  overallScore: 82,
                  band: "B2",
                  summary: "Clear and organized.",
                  grammarErrors: [],
                  vocabularySuggestions: [],
                  coherencePoints: [],
                  strengths: ["Good structure"],
                  improvements: ["Use richer vocabulary"],
                  correctedText: "I have learned English for two years.",
                }),
              },
            },
          ],
        }),
    } as Response);

    const response = await POST(
      request({
        text: "I have learned English for two years.",
        taskType: "essay",
        targetLevel: "B2",
      }) as never,
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.overallScore).toBe(82);
    expect(fetch).toHaveBeenCalledWith(
      "https://api.groq.com/openai/v1/chat/completions",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns 502 when the AI service fails", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 503,
      text: () => Promise.resolve("unavailable"),
    } as Response);

    const response = await POST(request({ text: "This text is long enough." }) as never);

    expect(response.status).toBe(502);
  });
});
