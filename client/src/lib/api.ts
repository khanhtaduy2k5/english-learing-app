import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

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
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("token");
            document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
            window.location.href = "/login";
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
    const response = await this.client.post(`/api/wordle/${id}/guess`, null, { params: { guess } });
    return response.data;
  }

  // Levels & Units
  async getLevels() {
    const response = await this.client.get<any[]>("/api/levels");
    return response.data;
  }

  async getUnits(level?: string) {
    const response = await this.client.get<any[]>("/api/units", { params: { level } });
    return response.data;
  }

  async getUnitDetail(id: string) {
    const response = await this.client.get<any>(`/api/units/${id}`);
    return response.data;
  }

  // Lessons
  async getLessons(params?: { level?: string; unitId?: string; skill?: string }) {
    const response = await this.client.get<any[]>("/api/lessons", { params });
    return response.data;
  }

  async getLessonDetail(id: string) {
    const response = await this.client.get<any>(`/api/lessons/${id}`);
    return response.data;
  }

  async getLessonQuiz(id: string) {
    const response = await this.client.get<any>(`/api/lessons/${id}/quiz`);
    return response.data;
  }

  // Grammar
  async getGrammarRules(level?: string) {
    const response = await this.client.get<any[]>("/api/grammar", { params: { level } });
    return response.data;
  }

  async getGrammarRule(id: string) {
    const response = await this.client.get<any>(`/api/grammar/${id}`);
    return response.data;
  }

  // Reading
  async getReadingPassages(level?: string) {
    const response = await this.client.get<any[]>("/api/reading", { params: { level } });
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
    const response = await this.client.get<any[]>(`/api/progress/user/${userId}`);
    return response.data;
  }

  async getLessonProgress(userId: string, lessonId: string) {
    const response = await this.client.get<any>(`/api/progress/user/${userId}/lesson/${lessonId}`);
    return response.data;
  }

  async updateProgress(userId: string, lessonId: string, status: string, quizScore?: number) {
    const response = await this.client.post<any>("/api/progress", {
      userId,
      lessonId,
      status,
      quizScore
    });
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
}

export const apiClient = new ApiClient();
