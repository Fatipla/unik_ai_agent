// E2E test: Navigation links in header and footer

import { test, expect } from '@playwright/test';

test.describe('Navigation Links', () => {
  test('header contains required links', async ({ page }) => {
    await page.goto('/');

    const header = page.locator('header');

    // Check for pricing link
    const pricingLink = header.locator('a[href="/pricing"]');
    await expect(pricingLink).toBeVisible();

    // Check for contact link
    const contactLink = header.locator('a[href="/contact"]');
    await expect(contactLink).toBeVisible();
  });

  test('footer contains all legal links', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');

    // Required legal links
    const requiredLinks = [
      '/pricing',
      '/contact',
      '/terms',
      '/privacy',
      '/refunds',
    ];

    for (const href of requiredLinks) {
      const link = footer.locator(`a[href="${href}"]`);
      await expect(link).toBeVisible();
    }
  });

  test('footer displays company identity', async ({ page }) => {
    await page.goto('/');

    const footer = page.locator('footer');

    // Check for company name
    await expect(footer.locator('text=Unik Trading LLC')).toBeVisible();

    // Check for address
    await expect(footer.locator('text=/Prishtina/i')).toBeVisible();

    // Check for support email
    const emailLink = footer.locator('a[href="mailto:support@unik-ks.com"]');
    await expect(emailLink).toBeVisible();
  });
});
