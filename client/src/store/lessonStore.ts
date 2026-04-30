import { create } from "zustand";
import { Lesson } from "@/types";

interface LessonState {
  lessons: Lesson[];
  selectedLesson: Lesson | null;
  loading: boolean;
  error: string | null;
  setLessons: (lessons: Lesson[]) => void;
  selectLesson: (lesson: Lesson) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useLessonStore = create<LessonState>((set) => ({
  lessons: [],
  selectedLesson: null,
  loading: false,
  error: null,

  setLessons: (lessons: Lesson[]) => set({ lessons }),
  selectLesson: (lesson: Lesson) => set({ selectedLesson: lesson }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
}));
