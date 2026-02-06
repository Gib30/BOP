import { test, expect } from '@playwright/test';

test.describe('BOP smoke tests', () => {
  test('home page loads and shows directory', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Verified XRPL Tokens/i })).toBeVisible({ timeout: 10000 });
  });

  test('can navigate to submit page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Submit Project/i }).click();
    await expect(page).toHaveURL(/\/submit/);
  });

  test('admin page shows login form when unauthenticated', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.getByPlaceholder('Password')).toBeVisible({ timeout: 5000 });
  });
});
