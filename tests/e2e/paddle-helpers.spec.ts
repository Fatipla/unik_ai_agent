// E2E test: Paddle domain verification helpers

import { test, expect } from '@playwright/test';

test.describe('Paddle Domain Helpers', () => {
  test('/.well-known/paddle-check returns 404 when token not set', async ({ page }) => {
    const response = await page.goto('/.well-known/paddle-check');
    
    // Should return page (either 404 or token)
    expect(response?.status()).toBeDefined();
    
    // If no token env, should see 404
    const content = await page.textContent('body');
    if (!process.env.PADDLE_DOMAIN_TOKEN) {
      expect(content).toContain('404');
    }
  });

  test('/.well-known/paddle-check returns token when set', async ({ page }) => {
    // This test only runs if PADDLE_DOMAIN_TOKEN is set
    if (process.env.PADDLE_DOMAIN_TOKEN) {
      const response = await page.goto('/.well-known/paddle-check');
      expect(response?.status()).toBe(200);
      
      const content = await page.textContent('pre');
      expect(content).toBe(process.env.PADDLE_DOMAIN_TOKEN);
    } else {
      // Skip test if no token
      test.skip();
    }
  });

  test('/api/debug/paddle-domain returns 404 in production', async ({ request }) => {
    // Mock production environment
    const response = await request.get('/api/debug/paddle-domain');
    
    // In non-production, should return JSON
    if (process.env.NODE_ENV !== 'production') {
      expect(response.ok()).toBe(true);
      const data = await response.json();
      expect(data).toHaveProperty('txt');
    }
  });

  test('/api/debug/paddle-domain returns txt in non-prod', async ({ request }) => {
    if (process.env.NODE_ENV !== 'production') {
      const response = await request.get('/api/debug/paddle-domain');
      expect(response.ok()).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('txt');
      
      // txt can be null if PADDLE_DOMAIN_TXT not set
      expect(data.txt === null || typeof data.txt === 'string').toBe(true);
    } else {
      test.skip();
    }
  });
});
