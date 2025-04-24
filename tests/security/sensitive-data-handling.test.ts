import { test, expect } from '@playwright/test';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/db-setup';
import { createTestWorker } from '../helpers/create-test-data';

test.describe('Sensitive Data Handling Tests', () => {
  let workerId: string;
  
  test.beforeAll(async () => {
    await setupTestDatabase();
    workerId = await createTestWorker({
      name: 'Privacy Test Worker',
      passport_number: 'P88888888',
      nationality: 'Ethiopian',
      status: 'active'
    });
  });

  test.afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('should mask sensitive data in UI', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to worker details
    await page.goto(`/workers/${workerId}`);
    
    // Check if passport number is masked
    const passportText = await page.locator('[data-testid="passport-number"]').textContent();
    expect(passportText).toMatch(/^P\d{2}\*\*\*\*\*\d{2}$/); // Should be masked like P12****78
    
    // Check if other sensitive data is masked or protected
    const contactText = await page.locator('[data-testid="contact-number"]').textContent();
    expect(contactText).toMatch(/^\+\d{3}\*\*\*\*\*\d{4}$/); // Should be masked like +251*****1234
  });
  
  test('should properly encrypt sensitive data in transit', async ({ page, request }) => {
    // This test requires checking network requests
    await page.goto('/auth/login');
    
    // Enable request interception
    const [response] = await Promise.all([
      page.waitForResponse(response => response.url().includes('/api/auth/login')),
      page.fill('[data-testid="email-input"]', 'admin@example.com'),
      page.fill('[data-testid="password-input"]', 'password123'),
      page.click('[data-testid="login-button"]')
    ]);
    
    // Verify HTTPS is used
    expect(response.url()).toMatch(/^https:\/\//);
    
    // Verify secure headers are present
    const headers = response.headers();
    expect(headers['strict-transport-security']).toBeDefined();
    expect(headers['content-security-policy']).toBeDefined();
  });
});