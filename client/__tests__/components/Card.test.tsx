// @vitest-environment jsdom

import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "../../src/components/Card";

// Mock the ui/card imports
vi.mock("@/components/ui/card", () => {
  return {
    Card: ({ children, interactive }: any) => (
      <div data-testid="card-wrapper" data-interactive={interactive}>
        {children}
      </div>
    ),
    CardHeader: ({ children }: any) => <div data-testid="card-header">{children}</div>,
    CardContent: ({ children }: any) => <div data-testid="card-body">{children}</div>,
    CardFooter: ({ children }: any) => <div data-testid="card-footer">{children}</div>
  };
});

describe("Card component", () => {
  test("should render Card subcomponents with child content", () => {
    render(
      <Card interactive={true}>
        <CardHeader>Header Title</CardHeader>
        <CardBody>Body Content</CardBody>
        <CardFooter>Footer Info</CardFooter>
      </Card>
    );

    expect(screen.getByTestId("card-wrapper")).toBeDefined();
    expect(screen.getByTestId("card-header").textContent).toBe("Header Title");
    expect(screen.getByTestId("card-body").textContent).toBe("Body Content");
    expect(screen.getByTestId("card-footer").textContent).toBe("Footer Info");
    expect(screen.getByTestId("card-wrapper").getAttribute("data-interactive")).toBe("true");
  });
});
