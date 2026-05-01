// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Input } from "./Input";

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
});
