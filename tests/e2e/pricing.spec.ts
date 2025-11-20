// E2E test: Pricing page product/period switcher

import { test, expect } from '@playwright/test';

test.describe('Pricing Page', () => {
  test('switches between products and updates prices', async ({ page }) => {
    await page.goto('/pricing');

    // Check default state (Both selected)
    await expect(page.locator('text=Both').first()).toBeVisible();

    // Switch to Chatbot
    await page.click('button:has-text("Chatbot")');
    await expect(page.locator('text=€19.99').first()).toBeVisible(); // Standard price

    // Switch to Voice
    await page.click('button:has-text("Voice Agent")');
    await expect(page.locator('text=€24.99').first()).toBeVisible(); // Voice Standard price

    // Switch back to Both
    await page.click('button:has-text("Both")');
    await expect(page.locator('text=€39.99').first()).toBeVisible(); // Bundle Standard price
  });

  test('toggles billing period and shows discount', async ({ page }) => {
    await page.goto('/pricing');

    // Default: Monthly
    await expect(page.locator('text=Billed monthly')).toBeVisible();

    // Toggle to Yearly
    await page.click('button:has-text("Yearly")');
    
    // Check for yearly prices (20% discount)
    await expect(page.locator('text=Save 20%')).toBeVisible();
    await expect(page.locator('text=€31.99').first()).toBeVisible(); // Bundle Standard yearly

    // Toggle back to Monthly
    await page.click('button:has-text("Monthly")');
    await expect(page.locator('text=Billed monthly')).toBeVisible();
  });

  test('checkout button calls API with correct planKey and period', async ({ page }) => {
    await page.goto('/pricing');

    // Intercept API calls
    let checkoutRequest: any = null;
    await page.route('/api/billing/checkout', route => {
      checkoutRequest = route.request().postDataJSON();
      route.fulfill({
        status: 200,
        body: JSON.stringify({ checkoutUrl: 'https://checkout.paddle.com/test', stubbed: true }),
      });
    });

    // Select Chatbot + Monthly, click Pro
    await page.click('button:has-text("Chatbot")');
    const proButton = page.locator('text=Start Free Trial').nth(1); // Pro plan
    await proButton.click();

    // Wait for API call
    await page.waitForTimeout(500);

    // Verify request payload
    expect(checkoutRequest).toBeTruthy();
    expect(checkoutRequest.planKey).toBe('CHATBOT_PRO');
    expect(checkoutRequest.period).toBe('M');
  });
});
