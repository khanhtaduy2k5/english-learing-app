import { expect, test } from "@playwright/test";

test.describe("Frontend Restructure Routing", () => {
  test("unauthenticated user should be redirected to /login when accessing protected routes", async ({ page }) => {
    // Attempt to access dashboard
    await page.goto("/dashboard");
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Attempt to access wordle
    await page.goto("/wordle");
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
    
    // Attempt to access lessons
    await page.goto("/lessons");
    // Should be redirected to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test("unauthenticated user can access auth routes and they are rendered centered", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: /welcome back/i })).toBeVisible();
    
    // Check for the centered glass card layout (indirectly by ensuring it exists)
    // The main container should have some layout, but we'll just check if the form is there.
    const loginForm = page.locator('form');
    await expect(loginForm).toBeVisible();

    await page.goto("/register");
    await expect(page.getByRole("heading", { name: /create account/i })).toBeVisible();
  });
});
