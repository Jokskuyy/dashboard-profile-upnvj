import { test, expect } from '@playwright/test';

test.describe('Homepage — Public Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard Profile UPNVJ/);
  });

  test('should display the header with UPNVJ logo', async ({ page }) => {
    const header = page.locator('header');
    await expect(header).toBeVisible();

    const logo = header.locator('img[alt="UPN Veteran Jakarta"]');
    await expect(logo).toBeVisible();
  });

  test('should display hero section with university name', async ({ page }) => {
    const heroHeading = page.locator('h1');
    await expect(heroHeading).toBeVisible();
    await expect(heroHeading).not.toBeEmpty();
  });

  test('should have two CTA buttons in hero section', async ({ page }) => {
    // "Explore Programs" and "Virtual Tour" buttons
    const heroButtons = page.locator('.hero-fade-up button');
    await expect(heroButtons).toHaveCount(2);
  });

  test('should have working carousel navigation', async ({ page }) => {
    const prevButton = page.locator('button[aria-label="Previous slide"]');
    const nextButton = page.locator('button[aria-label="Next slide"]');

    await expect(prevButton).toBeVisible();
    await expect(nextButton).toBeVisible();

    // Click next slide
    await nextButton.click();

    // Verify slide indicators exist
    const indicators = page.locator('button[aria-label^="Slide"]');
    await expect(indicators).toHaveCount(3);
  });

  test('should display footer with contact information', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check email link
    const emailLink = footer.locator('a[href="mailto:fik@upnvj.ac.id"]');
    await expect(emailLink).toBeVisible();

    // Check copyright text
    const copyright = footer.locator('text=Fakultas Ilmu Komputer');
    await expect(copyright).toBeVisible();
  });

  test('should have navigation items in header', async ({ page }) => {
    // Desktop nav (hidden on mobile, visible on lg+)
    const nav = page.locator('header nav');
    const navButtons = nav.locator('button');
    // Expect 3 nav items: Home, Assets, Campus Map
    await expect(navButtons).toHaveCount(3);
  });

  test('should have Admin link in header', async ({ page }) => {
    const adminLink = page.locator('header a[href="/login"]');
    await expect(adminLink).toBeVisible();
  });
});
