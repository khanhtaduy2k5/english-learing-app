import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/types";

const API_BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = typeof window !== "undefined" ? useAuthStore.getState().token : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Add Accept-Language header for i18n
        const language =
          typeof window !== "undefined"
            ? localStorage.getItem("language") || "vi"
            : "vi";
        config.headers["Accept-Language"] = language;

        return config;
      },
      (error) => Promise.reject(error),
    );
    // Response interceptor
    let isRefreshing = false;
    let failedQueue: any[] = [];

    const processQueue = (err: any, token: string | null = null) => {
      failedQueue.forEach((prom) => {
        if (err) {
          prom.reject(err);
        } else {
          prom.resolve(token);
        }
      });
      failedQueue = [];
    };

    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;
        if (!originalRequest) {
          return Promise.reject(error);
        }

        const requestPath = originalRequest.url || "";
        const isAuthEndpoint =
          requestPath.includes("/api/auth/login") ||
          requestPath.includes("/api/auth/register") ||
          requestPath.includes("/api/auth/refresh");

        if (error.response?.status === 401 && !isAuthEndpoint) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            })
              .then((token) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return this.client(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          isRefreshing = true;

          try {
            const refreshResponse = await this.client.post("/api/auth/refresh");
            const newAccessToken = refreshResponse.data?.token;

            if (newAccessToken) {
              if (typeof window !== "undefined") {
                useAuthStore.getState().setToken(newAccessToken);
              }

              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              processQueue(null, newAccessToken);
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            processQueue(refreshError, null);
            if (typeof window !== "undefined") {
              useAuthStore.getState().logout();
              window.location.href = "/login";
            }
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.client.post("/api/auth/login", { email, password });
  }

  async register(data: any) {
    return this.client.post("/api/auth/register", data);
  }

  async logout() {
    return this.client.post("/api/auth/logout");
  }

  // Wordle endpoints
  async startWordleGame() {
    const response = await this.client.post("/api/wordle/start");
    return response.data;
  }

  async getWordleGame(id: string) {
    const response = await this.client.get(`/api/wordle/${id}`);
    return response.data;
  }

  async makeWordleGuess(id: string, guess: string) {
    const response = await this.client.post(`/api/wordle/${id}/guess`, {
      guess,
    });
    return response.data;
  }

  // Levels & Units
  async getLevels() {
    const response = await this.client.get<any[]>("/api/levels");
    return response.data;
  }

  async getUnits(level?: string) {
    const response = await this.client.get<any[]>("/api/units", {
      params: { level },
    });
    return response.data;
  }

  async getUnitDetail(id: string) {
    const response = await this.client.get<any>(`/api/units/${id}`);
    return response.data;
  }

  // Grammar
  async getGrammarRules(level?: string) {
    const response = await this.client.get<any[]>("/api/grammar", {
      params: { level },
    });
    return response.data;
  }

  async getGrammarRule(id: string) {
    const response = await this.client.get<any>(`/api/grammar/${id}`);
    return response.data;
  }

  // Reading
  async getReadingPassages(level?: string) {
    const response = await this.client.get<any[]>("/api/reading", {
      params: { level },
    });
    return response.data;
  }

  async getReadingPassage(id: string) {
    const response = await this.client.get<any>(`/api/reading/${id}`);
    return response.data;
  }

  // Exams
  async getExams() {
    const response = await this.client.get<any[]>("/api/exams");
    return response.data;
  }

  async getExam(id: string) {
    const response = await this.client.get<any>(`/api/exams/${id}`);
    return response.data;
  }

  // User Progress
  async getUserProgress(userId: string) {
    const response = await this.client.get<any[]>(
      `/api/progress/user/${userId}`,
    );
    return response.data;
  }

  async getLessonProgress(userId: string, lessonId: string) {
    const response = await this.client.get<any>(
      `/api/progress/user/${userId}/lesson/${lessonId}`,
    );
    return response.data;
  }

  async updateProgress(
    userId: string,
    lessonId: string,
    status: string,
    quizScore?: number,
  ) {
    const response = await this.client.post<any>("/api/progress", {
      userId,
      lessonId,
      status,
      quizScore,
    });
    return response.data;
  }

  // Public APIs proxy
  async getDailyQuote() {
    const response = await this.client.get<{ content: string; author: string }>("/api/public/quote");
    return response.data;
  }

  async getDailyJoke() {
    const response = await this.client.get<{ setup: string; punchline: string }>("/api/public/joke");
    return response.data;
  }

  async getTriviaQuestions(difficulty?: string) {
    const response = await this.client.get<any[]>("/api/public/trivia", {
      params: { difficulty },
    });
    return response.data;
  }

  async getNewsArticles() {
    const response = await this.client.get<any[]>("/api/public/news");
    return response.data;
  }

  async getEnglishRadioStations() {
    const response = await this.client.get<any[]>("/api/public/radio");
    return response.data;
  }

  // Generic GET
  async get<T>(url: string) {
    const response = await this.client.get<T>(url);
    return response.data;
  }

  // Generic POST
  async post<T>(url: string, data?: any) {
    const response = await this.client.post<T>(url, data);
    return response.data;
  }

  // Generic PUT
  async put<T>(url: string, data?: any) {
    const response = await this.client.put<T>(url, data);
    return response.data;
  }

  // Generic DELETE
  async delete<T>(url: string) {
    const response = await this.client.delete<T>(url);
    return response.data;
  }

  // Upload Avatar
  async uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const response = await this.client.put<User>("/api/users/me/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export const apiClient = new ApiClient();
