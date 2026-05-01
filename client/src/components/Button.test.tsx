// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children and forwards click handling", () => {
    render(<Button onClick={() => undefined}>Save changes</Button>);

    expect(screen.getByRole("button", { name: "Save changes" })).toBeTruthy();
  });

  it("shows loading state and disables interaction", () => {
    render(<Button loading>Submit</Button>);

    const button = screen.getByRole("button", { name: "Loading..." });

    expect(button.disabled).toBe(true);
  });
});
