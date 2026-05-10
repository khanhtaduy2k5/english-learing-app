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
    // Re-import to trigger constructor
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
    // Interceptors are set up in constructor
    const instance = (axios.create as any).mock.results[0]?.value;
    if (instance) {
      expect(instance.interceptors.request.use).toHaveBeenCalled();
      expect(instance.interceptors.response.use).toHaveBeenCalled();
    }
  });
});
