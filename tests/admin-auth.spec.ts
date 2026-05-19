import { test, expect } from '@playwright/test';

test.describe('Admin Authentication Flow', () => {
  test('unauthenticated user accessing /admin should redirect to login', async ({ page }) => {
    await page.goto('/admin');

    // ProtectedRoute redirects to /admin/login
    await expect(page).toHaveURL(/\/admin\/login/);

    // Login form should be visible
    const loginTitle = page.locator('h1');
    await expect(loginTitle).toHaveText(/Masuk|Sign In/);
  });

  test('login page should show both /login and /admin/login routes', async ({ page }) => {
    // Test /login route
    await page.goto('/login');
    let title = page.locator('h1');
    await expect(title).toHaveText(/Masuk|Sign In/);

    // Test /admin/login route — same component
    await page.goto('/admin/login');
    title = page.locator('h1');
    await expect(title).toHaveText(/Masuk|Sign In/);
  });

  test('login form should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[autocomplete="username"]').fill('fakeuser');
    await page.locator('input[autocomplete="current-password"]').fill('fakepassword123');
    await page.locator('button[type="submit"]').click();

    // Wait for error message
    const errorContainer = page.locator('.bg-red-50');
    await expect(errorContainer).toBeVisible({ timeout: 15_000 });
  });

  test('login form should show loading state during submission', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[autocomplete="username"]').fill('testuser');
    await page.locator('input[autocomplete="current-password"]').fill('testpassword');
    await page.locator('button[type="submit"]').click();

    // Button should show loading text briefly
    const loadingText = page.locator('text=Memproses');
    // It may be very brief, so we just check it appears
    await expect(loadingText).toBeVisible({ timeout: 5_000 });
  });

  test('admin login form should have proper input attributes', async ({ page }) => {
    await page.goto('/login');

    // Username field
    const usernameInput = page.locator('input[autocomplete="username"]');
    await expect(usernameInput).toHaveAttribute('type', 'text');
    await expect(usernameInput).toHaveAttribute('required', '');

    // Password field
    const passwordInput = page.locator('input[autocomplete="current-password"]');
    await expect(passwordInput).toHaveAttribute('required', '');
  });
});
