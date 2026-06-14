import { describe, test, expect, vi, beforeEach } from "vitest";
import { getQuestionCount, isAnswerCorrect, playAudio } from "../../src/lib/examsHelper";

describe("examsHelper", () => {
  describe("getQuestionCount", () => {
    test("should return 0 for null/undefined/empty data", () => {
      expect(getQuestionCount(null)).toBe(0);
      expect(getQuestionCount(undefined)).toBe(0);
      expect(getQuestionCount({})).toBe(0);
    });

    test("should return array length for flat array of questions", () => {
      expect(getQuestionCount([1, 2, 3])).toBe(3);
    });

    test("should accumulate counts correctly for complex section questions", () => {
      const mockExamData = {
        sections: [
          {
            questions: [
              { type: "multiple-choice" }, // default count = 1
              { type: "tfng", statements: ["S1", "S2"] }, // count = 2
              { type: "matching-headings", paragraphs: ["P1", "P2", "P3"] }, // count = 3
              { type: "gap-fill", answers: { 1: "A", 2: "B" } }, // count = 2
              { type: "mc-cloze", gaps: ["G1", "G2"] } // count = 2
            ]
          }
        ]
      };
      // Total = 1 + 2 + 3 + 2 + 2 = 10
      expect(getQuestionCount(mockExamData)).toBe(10);
    });
  });

  describe("isAnswerCorrect", () => {
    test("should return false for undefined/null/empty user input", () => {
      expect(isAnswerCorrect(undefined, "correct", "dictation")).toBe(false);
      expect(isAnswerCorrect("", "correct", "dictation")).toBe(false);
    });

    test("should strip punctuation and spaces for dictation and gap-fill", () => {
      expect(isAnswerCorrect("  Hello, World!  ", "hello world", "dictation")).toBe(true);
      expect(isAnswerCorrect("  gap fill answer!  ", "gap fill answer", "gap-fill")).toBe(true);
    });

    test("should check strict trimmed value for default types", () => {
      expect(isAnswerCorrect("  ExactMatch  ", "ExactMatch", "multiple-choice")).toBe(true);
      expect(isAnswerCorrect("exactmatch", "ExactMatch", "multiple-choice")).toBe(false);
    });
  });

  describe("playAudio", () => {
    beforeEach(() => {
      vi.stubGlobal("window", {
        speechSynthesis: {
          cancel: vi.fn(),
          speak: vi.fn()
        }
      });
      vi.stubGlobal("SpeechSynthesisUtterance", vi.fn().mockImplementation((text) => ({
        text,
        lang: "",
        rate: 1.0
      })));
    });

    test("should trigger SpeechSynthesisUtterance", () => {
      playAudio("Test sentence");
      expect(window.speechSynthesis.cancel).toHaveBeenCalled();
      expect(window.speechSynthesis.speak).toHaveBeenCalled();
    });
  });
});
