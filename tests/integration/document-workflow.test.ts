import { test, expect } from '@playwright/test';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/db-setup';

test.describe('Document Processing Workflow', () => {
  test.beforeEach(async () => {
    await setupTestDatabase();
  });

  test.afterEach(async () => {
    await cleanupTestDatabase();
  });

  test('should process document from upload to approval', async ({ page }) => {
    // Login as admin user
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Navigate to document upload
    await page.goto('/documents/upload');
    
    // Upload a test document
    await page.setInputFiles('[data-testid="document-upload"]', 'test-files/sample-passport.pdf');
    await page.fill('[data-testid="document-name"]', 'Test Passport');
    await page.selectOption('[data-testid="document-type"]', 'passport');
    await page.fill('[data-testid="worker-id"]', 'W1001');
    await page.click('[data-testid="upload-button"]');
    
    // Verify document appears in pending list
    await page.goto('/documents');
    await expect(page.locator('text=Test Passport')).toBeVisible();
    
    // Process the document
    await page.click('[data-testid="review-document-W1001"]');
    await page.click('[data-testid="approve-document"]');
    await page.fill('[data-testid="approval-notes"]', 'Document verified and approved');
    await page.click('[data-testid="confirm-approval"]');
    
    // Verify document status changed to approved
    await page.goto('/documents');
    await expect(page.locator('text=Test Passport')).toBeVisible();
    await expect(page.locator('text=Approved')).toBeVisible();
  });
});