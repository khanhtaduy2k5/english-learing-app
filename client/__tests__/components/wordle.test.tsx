// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import WordleBoard from "@/components/wordle/WordleBoard";
import WordleKeyboard from "@/components/wordle/WordleKeyboard";
import WordleRow from "@/components/wordle/WordleRow";

describe("Wordle components", () => {
  it("renders typed letters and submitted feedback styles", () => {
    const { container } = render(
      <WordleRow guess="crane" feedback={["CORRECT", "PRESENT", "ABSENT", "ABSENT", "CORRECT"]} />,
    );

    expect(container.textContent).toContain("c");
    expect(container.textContent).toContain("r");
    expect(container.querySelector(".from-emerald-400")).toBeTruthy();
    expect(container.querySelector(".from-amber-400")).toBeTruthy();
  });

  it("fills the board with submitted, current, and empty rows", () => {
    const { container } = render(
      <WordleBoard
        guesses={[{ guess: "crane", feedback: ["ABSENT", "ABSENT", "ABSENT", "ABSENT", "ABSENT"] }]}
        currentGuess="sl"
        maxGuesses={6}
      />,
    );

    expect(container.querySelectorAll(".mb-2")).toHaveLength(6);
    expect(container.textContent).toContain("crane");
    expect(container.textContent).toContain("sl");
  });

  it("sends key presses and marks used letters", () => {
    const onKeyPress = vi.fn();
    render(<WordleKeyboard usedLetters={{ A: "CORRECT", B: "PRESENT", C: "ABSENT" }} onKeyPress={onKeyPress} />);

    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "ENTER" }));

    expect(onKeyPress).toHaveBeenNthCalledWith(1, "A");
    expect(onKeyPress).toHaveBeenNthCalledWith(2, "ENTER");
    expect(screen.getByRole("button", { name: "A" }).className).toContain("from-emerald-400");
  });
});
