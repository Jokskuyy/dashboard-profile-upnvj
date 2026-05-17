import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display the login form', async ({ page }) => {
    // Logo
    const logo = page.locator('img[alt="Logo UPNVJ"]');
    await expect(logo).toBeVisible();

    // Title — "Masuk" (default Indonesian) or "Sign In" (English)
    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toHaveText(/Masuk|Sign In/);
  });

  test('should have username and password fields', async ({ page }) => {
    const usernameInput = page.locator('input[autocomplete="username"]');
    const passwordInput = page.locator('input[autocomplete="current-password"]');

    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
  });

  test('should have a submit button', async ({ page }) => {
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
  });

  test('should toggle password visibility', async ({ page }) => {
    const passwordInput = page.locator('input[autocomplete="current-password"]');

    // Initially password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click the toggle button (visibility icon)
    const toggleButton = page.locator('button:has(span.material-icons-round:text("visibility_off"))');
    await toggleButton.click();

    // Now password should be visible
    await expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    const usernameInput = page.locator('input[autocomplete="username"]');
    const passwordInput = page.locator('input[autocomplete="current-password"]');
    const submitButton = page.locator('button[type="submit"]');

    await usernameInput.fill('invalid@test.com');
    await passwordInput.fill('wrongpassword');
    await submitButton.click();

    // Wait for error message to appear
    const errorMessage = page.locator('.bg-red-50');
    await expect(errorMessage).toBeVisible({ timeout: 15_000 });
  });

  test('should have a back to home button', async ({ page }) => {
    const backButton = page.locator('button:has-text("Kembali ke Beranda"), button:has-text("Back to Home")');
    await expect(backButton).toBeVisible();

    // Click it and verify we navigate back
    await backButton.click();
    await expect(page).toHaveURL('/');
  });

  test('should be accessible via /admin/login path too', async ({ page }) => {
    await page.goto('/admin/login');

    const title = page.locator('h1');
    await expect(title).toBeVisible();
    await expect(title).toHaveText(/Masuk|Sign In/);
  });
});
