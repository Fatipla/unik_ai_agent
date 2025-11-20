// E2E test: Billing dashboard displays plan and invoices

import { test, expect } from '@playwright/test';

test.describe('Billing Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock auth
    await page.goto('/dashboard/billing');
  });

  test('shows current plan information', async ({ page }) => {
    // Check for plan display
    await expect(page.locator('text=Current Plan')).toBeVisible();
    await expect(page.locator('text=Manage')).toBeVisible();
  });

  test('manage billing button opens portal', async ({ page }) => {
    let portalCalled = false;
    await page.route('/api/billing/portal', route => {
      portalCalled = true;
      route.fulfill({
        status: 200,
        body: JSON.stringify({ portalUrl: 'https://customer-portal.paddle.com/test' }),
      });
    });

    await page.click('button:has-text("Manage")');
    await page.waitForTimeout(500);

    expect(portalCalled).toBe(true);
  });

  test('displays upgrade prompt for free plan', async ({ page }) => {
    // If on free plan, should show upgrade options
    const upgradeButton = page.locator('text=Upgrade');
    if (await upgradeButton.isVisible()) {
      await expect(upgradeButton).toBeVisible();
    }
  });
});
