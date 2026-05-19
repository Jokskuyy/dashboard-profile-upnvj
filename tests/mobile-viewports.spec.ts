import { test, expect, devices } from '@playwright/test';

// iPhone 12 viewport dimensions
const iPhone12 = devices['iPhone 12'];

test.describe('Mobile Viewport — iPhone 12', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({
      width: iPhone12.viewport.width,
      height: iPhone12.viewport.height,
    });
  });

  test('should load homepage correctly on iPhone 12', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Dashboard Profile UPNVJ/);

    // Header should be visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Hero heading should be visible
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
  });

  test('should show mobile menu toggle on iPhone 12', async ({ page }) => {
    await page.goto('/');

    // Mobile menu toggle
    const menuToggle = page.locator('[aria-label="Toggle menu"]');
    await expect(menuToggle).toBeVisible();

    // Desktop nav should be hidden
    const desktopNav = page.locator('header nav');
    await expect(desktopNav).toBeHidden();
  });

  test('carousel should work on mobile', async ({ page }) => {
    await page.goto('/');

    const prevButton = page.locator('[aria-label="Previous slide"]');
    const nextButton = page.locator('[aria-label="Next slide"]');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Navigate carousel
    await nextButton.click();

    // Slide indicators should be present
    const indicators = page.locator('[aria-label^="Slide"]');
    await expect(indicators).toHaveCount(3);
  });

  test('login page should work on mobile', async ({ page }) => {
    await page.goto('/login');

    const title = page.locator('h1');
    await expect(title).toHaveText(/Masuk|Sign In/);

    // Form fields should be usable
    const usernameInput = page.locator('input[autocomplete="username"]');
    const passwordInput = page.locator('input[autocomplete="current-password"]');
    await expect(usernameInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    // Submit button should be visible
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});

// Pixel 5 viewport dimensions
const pixel5 = devices['Pixel 5'];

test.describe('Mobile Viewport — Pixel 5', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({
      width: pixel5.viewport.width,
      height: pixel5.viewport.height,
    });
  });

  test('should load homepage correctly on Pixel 5', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/Dashboard Profile UPNVJ/);

    // Header should be visible
    const header = page.locator('header');
    await expect(header).toBeVisible();

    // Hero heading should be visible
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
  });

  test('footer should render correctly on mobile', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Contact info should be visible
    const emailLink = footer.locator('a[href="mailto:fik@upnvj.ac.id"]');
    await expect(emailLink).toBeVisible();

    // Copyright
    const copyright = footer.locator('text=Fakultas Ilmu Komputer');
    await expect(copyright).toBeVisible();
  });

  test('facility form should be accessible on mobile', async ({ page }) => {
    await page.goto('/input-data');

    const heading = page.locator('h1');
    await expect(heading).toHaveText('Input Data Fasilitas');

    // Form should be scrollable and usable
    const buildingSection = page.locator('text=Pilih Gedung');
    await expect(buildingSection).toBeVisible();
  });
});
