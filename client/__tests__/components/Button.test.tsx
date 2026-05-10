// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "@/components/Button";

describe("Button", () => {
  it("renders children and forwards click handling", () => {
    render(<Button onClick={() => undefined}>Save changes</Button>);

    expect(screen.getByRole("button", { name: "Save changes" })).toBeTruthy();
  });

  it("shows loading state and disables interaction", () => {
    render(<Button loading>Submit</Button>);

    const button = screen.getByRole("button", {
      name: "Loading...",
    }) as HTMLButtonElement;

    expect(button.disabled).toBe(true);
  });

  it("renders as enabled by default", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: "Click me" }) as HTMLButtonElement;
    expect(button.disabled).toBe(false);
  });
});
