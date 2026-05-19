import { test, expect } from '@playwright/test';

test.describe('Accessibility & SEO', () => {
  test('should have proper meta tags for SEO', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toMatch(/Veteran Jakarta/);

    // Check Open Graph tags
    const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
    expect(ogTitle).toMatch(/Dashboard Profile UPNVJ/);

    // Check theme color
    const themeColor = await page.locator('meta[name="theme-color"]').getAttribute('content');
    expect(themeColor).toBe('#2C5F2D');
  });

  test('should have only one h1 element on the homepage', async ({ page }) => {
    await page.goto('/');

    const h1Elements = page.locator('h1');
    // The page should have exactly one h1 (university name in hero)
    await expect(h1Elements).toHaveCount(1);
  });

  test('should have a proper lang attribute', async ({ page }) => {
    await page.goto('/');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', 'id');
  });

  test('should show noscript message when JS is disabled', async ({ browser }) => {
    // Create a context with JavaScript disabled
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/');

    const noscriptMessage = page.locator('noscript div');
    await expect(noscriptMessage).toBeVisible();
    await expect(noscriptMessage).toContainText('JavaScript');

    await context.close();
  });

  test('carousel controls should have aria labels', async ({ page }) => {
    // Use domcontentloaded to avoid waiting for all resources (hero images, etc.)
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for the React app to mount
    await page.waitForSelector('[aria-label="Previous slide"]', { timeout: 15_000 });

    const prevButton = page.locator('[aria-label="Previous slide"]');
    const nextButton = page.locator('[aria-label="Next slide"]');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Slide indicators
    const slideIndicators = page.locator('[aria-label^="Slide"]');
    const count = await slideIndicators.count();
    expect(count).toBeGreaterThan(0);
  });

  test('mobile menu toggle should have aria label', async ({ page }) => {
    // Set viewport to mobile size to see the menu toggle
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    const menuToggle = page.locator('[aria-label="Toggle menu"]');
    await expect(menuToggle).toBeVisible();
  });
});
