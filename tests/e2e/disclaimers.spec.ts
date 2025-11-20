// E2E test: Pricing disclaimers are visible

import { test, expect } from '@playwright/test';

test.describe('Pricing Disclaimers', () => {
  test('displays all three required disclaimers', async ({ page }) => {
    await page.goto('/pricing');

    // Wait for page to load
    await page.waitForSelector('text=Simple, predictable pricing');

    // Check for all three disclaimer strings
    const disclaimer1 = page.locator('text=/Provë falas 7 ditë/');
    await expect(disclaimer1).toBeVisible();

    const disclaimer2 = page.locator('text=/Anulo kur të duash/');
    await expect(disclaimer2).toBeVisible();

    const disclaimer3 = page.locator('text=/Çmimet janë pa TVSH/');
    await expect(disclaimer3).toBeVisible();
  });

  test('disclaimers are within a visible container', async ({ page }) => {
    await page.goto('/pricing');

    // Find disclaimer container
    const container = page.locator('text=Provë falas 7 ditë').locator('..');
    await expect(container).toBeVisible();

    // Check it's styled (has background)
    const hasBackground = await container.evaluate((el) => {
      const bg = window.getComputedStyle(el).backgroundColor;
      return bg && bg !== 'rgba(0, 0, 0, 0)';
    });

    expect(hasBackground).toBe(true);
  });
});
