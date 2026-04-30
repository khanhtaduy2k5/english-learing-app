export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  createdAt: string;
}

export interface Quiz {
  id: string;
  title: string;
  lessonId: string;
  questions: Question[];
  createdAt: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface UserProgress {
  userId: string;
  lessonId: string;
  completedAt?: string;
  score?: number;
}
