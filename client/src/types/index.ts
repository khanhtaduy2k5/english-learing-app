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

export interface VocabularyItem {
  word: string;
  meaning: string;
  ipa?: string;
  partOfSpeech?: string;
  example?: string;
  exampleMeaning?: string;
}

export interface Lesson {
  id: string;
  unitId?: string;
  level: string;
  skill: string;
  title: string;
  description?: string;
  duration?: number;
  xp?: number;
  vocab: VocabularyItem[];
  grammarRule?: string;
  grammarExamples?: Array<Record<string, any>>;
  passage?: string;
  script?: string;
  prompt?: string;
  tips?: string[];
  questions?: Array<Record<string, any>>;
  createdAt: string;
}

export interface Level {
  level: string;
  name: string;
  description?: string;
  createdAt: string;
}

export interface Unit {
  id: string;
  level: string;
  number: number;
  title: string;
  theme?: string;
  emoji?: string;
  checkpoint: Record<string, any>;
  createdAt: string;
}

export interface GrammarRule {
  id: string;
  level: string;
  title: string;
  rule: string;
  examples: Array<Record<string, any>>;
  questions: Array<Record<string, any>>;
  createdAt: string;
}

export interface ReadingPassage {
  id: string;
  level: string;
  title: string;
  passageText: string;
  questions: Array<Record<string, any>>;
  createdAt: string;
}

export interface Exam {
  id: string;
  name: string;
  fullName: string;
  emoji?: string;
  description?: string;
  variants: Record<string, any>;
  fullExam: Array<Record<string, any>>;
  quickExam: Array<Record<string, any>>;
  createdAt: string;
}

export interface UserProgress {
  id?: number;
  userId: string;
  lessonId: string;
  status: "not_started" | "in_progress" | "completed";
  quizScore?: number;
  completedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
