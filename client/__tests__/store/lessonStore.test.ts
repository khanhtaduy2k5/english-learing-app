import { beforeEach, describe, expect, it } from "vitest";
import { useLessonStore } from "@/store/lessonStore";
import { Lesson } from "@/types";

const lesson: Lesson = {
  id: "lesson-1",
  unitId: "unit-1",
  level: "A1",
  skill: "reading",
  title: "Greetings",
};

describe("lessonStore", () => {
  beforeEach(() => {
    useLessonStore.setState({
      lessons: [],
      selectedLesson: null,
      loading: false,
      error: null,
    });
  });

  it("stores lessons and selected lesson", () => {
    useLessonStore.getState().setLessons([lesson]);
    useLessonStore.getState().selectLesson(lesson);

    expect(useLessonStore.getState().lessons).toEqual([lesson]);
    expect(useLessonStore.getState().selectedLesson?.id).toBe("lesson-1");
  });

  it("tracks loading and error state", () => {
    useLessonStore.getState().setLoading(true);
    useLessonStore.getState().setError("Failed to load lessons");

    expect(useLessonStore.getState().loading).toBe(true);
    expect(useLessonStore.getState().error).toBe("Failed to load lessons");
  });
});
