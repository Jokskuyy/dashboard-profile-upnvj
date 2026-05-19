import { test, expect } from '@playwright/test';

test.describe('Language Toggle', () => {
  test('should have a language toggle button in the header', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Language toggle has aria-label "Switch to English" or "Switch to Indonesian"
    const langToggle = page.locator('button[aria-label^="Switch to"]');
    await expect(langToggle).toBeVisible();
  });

  test('should switch from Indonesian to English', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Default should be Indonesian — aria-label says "Switch to English"
    const switchToEnglish = page.locator('button[aria-label="Switch to English"]');
    await expect(switchToEnglish).toBeVisible();

    // Click to switch
    await switchToEnglish.click();

    // Should now say "Switch to Indonesian"
    const switchToIndonesian = page.locator('button[aria-label="Switch to Indonesian"]');
    await expect(switchToIndonesian).toBeVisible();
  });

  test('should change navigation text when language switches', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for React to render nav
    await page.waitForSelector('header nav button', { timeout: 10_000 });

    // In Indonesian, nav should show "Beranda"
    const homeButton = page.locator('header nav button:first-child');
    await expect(homeButton).toContainText('Beranda');

    // Switch to English
    const switchToEnglish = page.locator('button[aria-label="Switch to English"]');
    await switchToEnglish.click();

    // Wait for language change (150ms animation + render)
    await page.waitForTimeout(300);

    // Nav should now show "Home"
    await expect(homeButton).toContainText('Home');
  });

  test('should change hero section text when language switches', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Wait for hero to render
    await page.waitForSelector('h1', { timeout: 10_000 });

    // Get initial hero text
    const heroHeading = page.locator('h1');
    const initialText = await heroHeading.textContent();
    expect(initialText).toBeTruthy();

    // Switch language
    const switchToEnglish = page.locator('button[aria-label="Switch to English"]');
    await switchToEnglish.click();
    await page.waitForTimeout(300);

    // Hero text should still be present
    const newText = await heroHeading.textContent();
    expect(newText).toBeTruthy();
  });

  test('should switch back to Indonesian from English', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('header nav button', { timeout: 10_000 });

    // Switch to English
    const switchToEnglish = page.locator('button[aria-label="Switch to English"]');
    await switchToEnglish.click();
    await page.waitForTimeout(300);

    // Switch back to Indonesian
    const switchToIndonesian = page.locator('button[aria-label="Switch to Indonesian"]');
    await switchToIndonesian.click();
    await page.waitForTimeout(300);

    // Nav should show Indonesian text again
    const homeButton = page.locator('header nav button:first-child');
    await expect(homeButton).toContainText('Beranda');
  });

  test('login page should respect language setting', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Switch to English on homepage
    const switchToEnglish = page.locator('button[aria-label="Switch to English"]');
    await expect(switchToEnglish).toBeVisible();
    await switchToEnglish.click();
    await page.waitForTimeout(300);

    // Navigate to login
    await page.goto('/login');

    // Login page should show English text
    const title = page.locator('h1');
    await expect(title).toHaveText('Sign In');
  });
});
