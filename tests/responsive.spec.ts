import { test, expect } from '@playwright/test';

test.describe('Responsive Design', () => {
  test('should show mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 }); // iPhone size
    await page.goto('/');

    // Desktop nav should be hidden
    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeHidden();

    // Mobile menu toggle should be visible
    const menuToggle = page.locator('[aria-label="Toggle menu"]');
    await expect(menuToggle).toBeVisible();

    // Open mobile menu
    await menuToggle.click();

    // Mobile drawer should appear — wait for the Admin Panel link inside the drawer
    const adminPanelLink = page.locator('nav a:has-text("Admin Panel")');
    await expect(adminPanelLink).toBeVisible();

    // Close menu by tapping the backdrop overlay instead of the close button
    // (the close button can be intercepted by the fixed header)
    const backdrop = page.locator('.bg-black\\/50.backdrop-blur-sm');
    await backdrop.click({ position: { x: 50, y: 400 }, force: true });
  });

  test('should show desktop navigation on large screens', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    // Desktop nav should be visible
    const nav = page.locator('header nav');
    await expect(nav).toBeVisible();

    // Mobile menu toggle should be hidden
    const menuToggle = page.locator('[aria-label="Toggle menu"]');
    await expect(menuToggle).toBeHidden();
  });

  test('should display properly on tablet screens', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/');

    // Page should not have horizontal overflow
    const body = page.locator('body');
    const bodyBox = await body.boundingBox();
    expect(bodyBox).not.toBeNull();
    if (bodyBox) {
      expect(bodyBox.width).toBeLessThanOrEqual(768 + 1); // Allow 1px tolerance
    }
  });
});
