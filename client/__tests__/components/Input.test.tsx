// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "@/components/Input";

describe("Input", () => {
  it("renders a labeled input with an error message", () => {
    render(
      <Input
        label="Email"
        error="Email is required"
        placeholder="name@example.com"
      />,
    );

    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(screen.getByText("Email is required")).toBeTruthy();
  });

  it("renders without an error message when none provided", () => {
    render(<Input label="Username" placeholder="Enter username" />);

    expect(screen.getByLabelText("Username")).toBeTruthy();
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("renders the correct placeholder text", () => {
    render(<Input label="Search" placeholder="Type to search..." />);

    const input = screen.getByPlaceholderText("Type to search...");
    expect(input).toBeTruthy();
  });
});
