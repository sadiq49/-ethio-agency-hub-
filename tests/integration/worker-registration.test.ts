import { test, expect } from '@playwright/test';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/db-setup';

test.describe('Worker Registration Workflow', () => {
  test.beforeEach(async () => {
    await setupTestDatabase();
  });

  test.afterEach(async () => {
    await cleanupTestDatabase();
  });

  test('should register a new worker and verify in database', async ({ page }) => {
    // Login as admin user
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to worker registration
    await page.goto('/workers/registration');
    
    // Fill personal information
    await page.fill('[data-testid="worker-name"]', 'Test Worker');
    await page.fill('[data-testid="passport-number"]', 'P12345678');
    await page.selectOption('[data-testid="gender"]', 'Female');
    await page.fill('[data-testid="date-of-birth"]', '1990-01-01');
    await page.click('[data-testid="next-button"]');
    
    // Fill contact information
    await page.fill('[data-testid="phone-number"]', '+251912345678');
    await page.fill('[data-testid="email"]', 'testworker@example.com');
    await page.click('[data-testid="next-button"]');
    
    // Upload documents
    await page.setInputFiles('[data-testid="passport-upload"]', 'test-files/sample-passport.pdf');
    await page.setInputFiles('[data-testid="photo-upload"]', 'test-files/sample-photo.jpg');
    await page.click('[data-testid="next-button"]');
    
    // Complete registration
    await page.click('[data-testid="submit-registration"]');
    
    // Verify success message
    await expect(page.locator('text=Worker registered successfully')).toBeVisible();
    
    // Verify worker appears in workers list
    await page.goto('/workers');
    await expect(page.locator('text=Test Worker')).toBeVisible();
    await expect(page.locator('text=P12345678')).toBeVisible();
  });
});