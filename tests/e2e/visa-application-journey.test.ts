import { test, expect } from '@playwright/test';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/db-setup';
import { createTestWorker } from '../helpers/create-test-data';

test.describe('Visa Application User Journey', () => {
  let workerId: string;

  test.beforeAll(async () => {
    await setupTestDatabase();
    workerId = await createTestWorker({
      name: 'Visa Test Worker',
      passport_number: 'P87654321',
      nationality: 'Ethiopian',
      status: 'active'
    });
  });

  test.afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('complete visa application journey from start to approval', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Step 1: Upload required documents
    await page.goto('/documents/upload');
    await page.setInputFiles('[data-testid="document-upload"]', 'test-files/sample-passport.pdf');
    await page.fill('[data-testid="document-name"]', 'Passport');
    await page.selectOption('[data-testid="document-type"]', 'passport');
    await page.fill('[data-testid="worker-id"]', workerId);
    await page.click('[data-testid="upload-button"]');
    
    // Upload medical certificate
    await page.setInputFiles('[data-testid="document-upload"]', 'test-files/sample-medical.pdf');
    await page.fill('[data-testid="document-name"]', 'Medical Certificate');
    await page.selectOption('[data-testid="document-type"]', 'medical_certificate');
    await page.fill('[data-testid="worker-id"]', workerId);
    await page.click('[data-testid="upload-button"]');
    
    // Step 2: Start visa application
    await page.goto('/documents/visa');
    await page.click('[data-testid="new-visa-application"]');
    await page.fill('[data-testid="worker-id"]', workerId);
    await page.selectOption('[data-testid="destination-country"]', 'Saudi Arabia');
    await page.selectOption('[data-testid="visa-type"]', 'Work');
    await page.click('[data-testid="submit-application"]');
    
    // Step 3: Process visa application
    await page.goto('/documents/visa');
    await page.click(`[data-testid="process-visa-${workerId}"]`);
    await page.click('[data-testid="mark-documents-verified"]');
    await page.click('[data-testid="mark-embassy-submitted"]');
    
    // Step 4: Approve visa
    await page.click('[data-testid="approve-visa"]');
    await page.fill('[data-testid="visa-number"]', 'V12345678');
    await page.fill('[data-testid="issue-date"]', '2024-04-01');
    await page.fill('[data-testid="expiry-date"]', '2025-04-01');
    await page.click('[data-testid="confirm-approval"]');
    
    // Verify visa status is approved
    await page.goto('/documents/visa');
    await expect(page.locator(`text=Visa Test Worker`)).toBeVisible();
    await expect(page.locator(`text=Approved`)).toBeVisible();
    
    // Verify worker status is updated
    await page.goto(`/workers/${workerId}`);
    await expect(page.locator(`text=Visa Approved`)).toBeVisible();
  });
});