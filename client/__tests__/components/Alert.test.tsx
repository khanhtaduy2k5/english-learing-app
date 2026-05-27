// @vitest-environment jsdom

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Alert } from "@/components/Alert";

describe("Alert", () => {
  it("renders message with the matching variant classes", () => {
    const { container } = render(<Alert type="error" message="Something failed" />);

    expect(screen.getByText("Something failed")).toBeTruthy();
    expect(container.firstElementChild?.className).toContain("bg-red-50");
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(<Alert type="success" message="Saved" onClose={onClose} />);

    fireEvent.click(screen.getByRole("button"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
