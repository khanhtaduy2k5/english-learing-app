import { describe, expect, it, vi, beforeEach } from "vitest";
import axios from "axios";

// Mock axios
vi.mock("axios", () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  };
  return { default: mockAxios };
});

describe("ApiClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates axios instance with correct default config", async () => {
    vi.resetModules();
    await import("@/lib/api");

    expect(axios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: expect.any(String),
        timeout: 30000,
        headers: {
          "Content-Type": "application/json",
        },
      }),
    );
  });

  it("sets up request and response interceptors", async () => {
    vi.resetModules();
    await import("@/lib/api");

    expect(axios.create).toHaveBeenCalled();
    const instance = (axios.create as any).mock.results[0]?.value;
    if (instance) {
      expect(instance.interceptors.request.use).toHaveBeenCalled();
      expect(instance.interceptors.response.use).toHaveBeenCalled();
    }
  });

  it("login posts correct data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.post.mockResolvedValueOnce({ data: { user: "test" } });

    const res = await apiClient.login("test@test.com", "pass");
    expect(mockInstance.post).toHaveBeenCalledWith("/api/auth/login", {
      email: "test@test.com",
      password: "pass",
    });
    expect(res.data).toEqual({ user: "test" });
  });

  it("register posts correct data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.post.mockResolvedValueOnce({ data: { success: true } });

    const data = { email: "test@test.com", name: "Test" };
    const res = await apiClient.register(data);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/auth/register", data);
    expect(res.data).toEqual({ success: true });
  });

  it("logout posts to correct endpoint", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.post.mockResolvedValueOnce({ data: { success: true } });

    const res = await apiClient.logout();
    expect(mockInstance.post).toHaveBeenCalledWith("/api/auth/logout");
    expect(res.data).toEqual({ success: true });
  });

  it("startWordleGame posts to correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.post.mockResolvedValueOnce({ data: { id: "game-1" } });

    const res = await apiClient.startWordleGame();
    expect(mockInstance.post).toHaveBeenCalledWith("/api/wordle/start");
    expect(res).toEqual({ id: "game-1" });
  });

  it("getWordleGame calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: { id: "game-1" } });

    const res = await apiClient.getWordleGame("game-1");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/wordle/game-1");
    expect(res).toEqual({ id: "game-1" });
  });

  it("makeWordleGuess posts to correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.post.mockResolvedValueOnce({ data: { correct: true } });

    const res = await apiClient.makeWordleGuess("game-1", "GUESS");
    expect(mockInstance.post).toHaveBeenCalledWith("/api/wordle/game-1/guess", { guess: "GUESS" });
    expect(res).toEqual({ correct: true });
  });

  it("getLevels calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: ["A1", "A2"] });

    const res = await apiClient.getLevels();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/levels");
    expect(res).toEqual(["A1", "A2"]);
  });

  it("getUnits calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: [{ id: "unit-1" }] });

    const res = await apiClient.getUnits("A1");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/units", { params: { level: "A1" } });
    expect(res).toEqual([{ id: "unit-1" }]);
  });

  it("getUnitDetail calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: { id: "unit-1" } });

    const res = await apiClient.getUnitDetail("unit-1");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/units/unit-1");
    expect(res).toEqual({ id: "unit-1" });
  });

  it("getGrammarRules calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: [{ id: "rule-1" }] });

    const res = await apiClient.getGrammarRules("A1");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/grammar", { params: { level: "A1" } });
    expect(res).toEqual([{ id: "rule-1" }]);
  });

  it("getGrammarRule calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: { id: "rule-1" } });

    const res = await apiClient.getGrammarRule("rule-1");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/grammar/rule-1");
    expect(res).toEqual({ id: "rule-1" });
  });

  it("getReadingPassages calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: [{ id: "passage-1" }] });

    const res = await apiClient.getReadingPassages("B2");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/reading", { params: { level: "B2" } });
    expect(res).toEqual([{ id: "passage-1" }]);
  });

  it("getReadingPassage calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: { id: "passage-1" } });

    const res = await apiClient.getReadingPassage("passage-1");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/reading/passage-1");
    expect(res).toEqual({ id: "passage-1" });
  });

  it("getExams calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: [{ id: "exam-1" }] });

    const res = await apiClient.getExams();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/exams");
    expect(res).toEqual([{ id: "exam-1" }]);
  });

  it("getExam calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: { id: "exam-1" } });

    const res = await apiClient.getExam("exam-1");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/exams/exam-1");
    expect(res).toEqual({ id: "exam-1" });
  });

  it("getUserProgress calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: [{ id: "progress-1" }] });

    const res = await apiClient.getUserProgress();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/progress/me");
    expect(res).toEqual([{ id: "progress-1" }]);
  });

  it("getLessonProgress calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: { id: "progress-1" } });

    const res = await apiClient.getLessonProgress("lesson-1");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/progress/me/lesson/lesson-1");
    expect(res).toEqual({ id: "progress-1" });
  });

  it("updateProgress posts correct data and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.post.mockResolvedValueOnce({ data: { id: "progress-1" } });

    const res = await apiClient.updateProgress("lesson-1", "completed", 90);
    expect(mockInstance.post).toHaveBeenCalledWith("/api/progress", {
      lessonId: "lesson-1",
      status: "completed",
      quizScore: 90,
    });
    expect(res).toEqual({ id: "progress-1" });
  });

  it("getDailyQuote calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: { content: "Quote" } });

    const res = await apiClient.getDailyQuote();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/public/quote");
    expect(res).toEqual({ content: "Quote" });
  });

  it("getDailyJoke calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: { setup: "Joke" } });

    const res = await apiClient.getDailyJoke();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/public/joke");
    expect(res).toEqual({ setup: "Joke" });
  });

  it("getTriviaQuestions calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: [{ question: "Trivia" }] });

    const res = await apiClient.getTriviaQuestions("easy");
    expect(mockInstance.get).toHaveBeenCalledWith("/api/public/trivia", { params: { difficulty: "easy" } });
    expect(res).toEqual([{ question: "Trivia" }]);
  });

  it("getNewsArticles calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: [{ title: "News" }] });

    const res = await apiClient.getNewsArticles();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/public/news");
    expect(res).toEqual([{ title: "News" }]);
  });

  it("getEnglishRadioStations calls correct endpoint and returns data", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: [{ name: "Radio" }] });

    const res = await apiClient.getEnglishRadioStations();
    expect(mockInstance.get).toHaveBeenCalledWith("/api/public/radio");
    expect(res).toEqual([{ name: "Radio" }]);
  });

  it("uploadAvatar uploads form data correctly", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.put.mockResolvedValueOnce({ data: { id: "user-1", avatarUrl: "url" } });

    const file = new File([""], "avatar.png", { type: "image/png" });
    const res = await apiClient.uploadAvatar(file);

    expect(mockInstance.put).toHaveBeenCalledWith(
      "/api/users/me/avatar",
      expect.any(FormData),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    expect(res).toEqual({ id: "user-1", avatarUrl: "url" });
  });

  it("generic get wrapper works", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.get.mockResolvedValueOnce({ data: "data" });

    const res = await apiClient.get("/test");
    expect(mockInstance.get).toHaveBeenCalledWith("/test");
    expect(res).toBe("data");
  });

  it("generic post wrapper works", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.post.mockResolvedValueOnce({ data: "data" });

    const res = await apiClient.post("/test", { body: "payload" });
    expect(mockInstance.post).toHaveBeenCalledWith("/test", { body: "payload" });
    expect(res).toBe("data");
  });

  it("generic put wrapper works", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.put.mockResolvedValueOnce({ data: "data" });

    const res = await apiClient.put("/test", { body: "payload" });
    expect(mockInstance.put).toHaveBeenCalledWith("/test", { body: "payload" });
    expect(res).toBe("data");
  });

  it("generic delete wrapper works", async () => {
    vi.resetModules();
    const { apiClient } = await import("@/lib/api");
    const mockInstance = (axios.create as any).mock.results[0]?.value;
    mockInstance.delete.mockResolvedValueOnce({ data: "data" });

    const res = await apiClient.delete("/test");
    expect(mockInstance.delete).toHaveBeenCalledWith("/test");
    expect(res).toBe("data");
  });
});
