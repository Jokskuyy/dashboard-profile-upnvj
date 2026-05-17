import { test, expect } from '@playwright/test';

test.describe('Facility Submission Form — /input-data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/input-data');
    // Wait for the React app to render the form
    await page.waitForSelector('h1', { timeout: 15_000 });
  });

  test('should display the form page with correct heading', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText('Input Data Fasilitas');

    // Subtitle
    const subtitle = page.locator('text=Formulir Pendataan Fasilitas Kampus');
    await expect(subtitle).toBeVisible();
  });

  test('should display the building section', async ({ page }) => {
    // Building section heading
    const buildingHeading = page.locator('h2:has-text("Gedung")');
    await expect(buildingHeading).toBeVisible();

    // Building selector label
    const label = page.locator('text=Pilih Gedung');
    await expect(label).toBeVisible();
  });

  test('should have a building dropdown or loading state', async ({ page }) => {
    // Either shows the select dropdown or a loading indicator
    const dropdown = page.locator('select');
    const loadingText = page.locator('text=Memuat data gedung');

    // One of them should be visible
    const dropdownVisible = await dropdown.isVisible().catch(() => false);
    const loadingVisible = await loadingText.isVisible().catch(() => false);
    expect(dropdownVisible || loadingVisible).toBe(true);
  });

  test('should have "Tambah Gedung Baru" toggle button', async ({ page }) => {
    const toggleButton = page.locator('button:has-text("Tambah Gedung Baru")');
    await expect(toggleButton).toBeVisible();

    // Click to open the new building sub-form
    await toggleButton.click();

    // Sub-form should appear with "Gedung Baru" heading
    const subFormHeading = page.locator('h3:has-text("Gedung Baru")');
    await expect(subFormHeading).toBeVisible();

    // Should have "Nama Gedung" label
    const namaGedungLabel = page.locator('label:has-text("Nama Gedung")');
    await expect(namaGedungLabel).toBeVisible();
  });

  test('should collapse building sub-form when toggled again', async ({ page }) => {
    const toggleButton = page.locator('button:has-text("Tambah Gedung Baru")');
    await toggleButton.click();

    // Now click "Tutup form gedung baru"
    const closeButton = page.locator('button:has-text("Tutup form gedung baru")');
    await expect(closeButton).toBeVisible();
    await closeButton.click();

    // Sub-form should be hidden
    const subFormHeading = page.locator('h3:has-text("Gedung Baru")');
    await expect(subFormHeading).toBeHidden();
  });

  test('should show validation errors when required fields are empty', async ({ page }) => {
    // Wait for building data to load
    await page.waitForSelector('select', { timeout: 10_000 });

    // Try to submit without filling anything
    const submitButton = page.locator('button[type="submit"]');
    await submitButton.click();

    // Should show validation error for nama_fasilitas
    const nameError = page.locator('text=Nama fasilitas harus diisi');
    await expect(nameError).toBeVisible();
  });

  test('should have form sections for facility data', async ({ page }) => {
    // Check for facility-related text in the rendered page
    const facilityHeading = page.locator('h2:has-text("Gedung")');
    await expect(facilityHeading).toBeVisible();

    // The page should have a submit button
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });

  test('should have a queue section or submit functionality', async ({ page }) => {
    // The form supports batch queue — look for queue-related UI
    const pageContent = await page.textContent('body');
    // The form should contain submit-related content
    expect(pageContent).toBeTruthy();

    // Submit button should exist
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
  });
});
