import { expect, test } from "@playwright/test";

test("home page routes to register page", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /master english with/i }),
  ).toBeVisible();

  const startBtn = page.getByRole("button", { name: /get started for free/i });
  // Wait explicitly for the hero CTA to be visible and stable before clicking
  await startBtn.waitFor({ state: "visible", timeout: 10000 });
  await startBtn.click();

  // Wait for client navigation to the register page and assert the heading
  await page.waitForURL(/\/register/);
  await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
});

test("register page shows validation error for mismatched passwords", async ({
  page,
}) => {
  await page.goto("/register");

  await page.locator('input[name="name"]').fill("Nguyen Van A");
  await page.locator('input[name="email"]').fill("learner@example.com");
  await page.locator('input[name="password"]').fill("secret123");
  await page.locator('input[name="confirmPassword"]').fill("different123");

  await page.getByRole("button", { name: /sign up/i }).click();

  await expect(page.getByText(/passwords do not match/i)).toBeVisible();
});
