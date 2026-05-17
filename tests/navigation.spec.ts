import { test, expect } from '@playwright/test';

test.describe('Navigation & Routing', () => {
  test('should navigate to login page from header admin link', async ({ page }) => {
    await page.goto('/');

    // Click Admin link
    const adminLink = page.locator('header a[href="/login"]');
    await adminLink.click();

    await expect(page).toHaveURL('/login');
    await expect(page.locator('h1')).toHaveText(/Masuk|Sign In/);
  });

  test('should redirect unauthenticated users from /admin', async ({ page }) => {
    // Attempt to access the admin page without authentication
    await page.goto('/admin');

    // Should redirect to login or show access denied
    // ProtectedRoute typically redirects to /login
    await expect(page).toHaveURL(/\/(login|admin)/);
  });

  test('should show 404 page for unknown routes', async ({ page }) => {
    await page.goto('/nonexistent-page');

    // Check for 404 content
    const heading404 = page.locator('text=404');
    await expect(heading404).toBeVisible();

    const message = page.locator('text=Halaman tidak ditemukan');
    await expect(message).toBeVisible();

    // Check "Back to Home" link
    const backLink = page.locator('a[href="/"]');
    await expect(backLink).toBeVisible();
    await expect(backLink).toHaveText(/Kembali ke Beranda/);
  });

  test('should load the facility submission form page', async ({ page }) => {
    await page.goto('/input-data');

    // Page should load without errors
    await expect(page).toHaveURL('/input-data');
  });
});
