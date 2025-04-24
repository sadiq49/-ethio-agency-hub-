import { test, expect } from '@playwright/test';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/db-setup';
import { createTestWorker, createTestVisa } from '../helpers/create-test-data';

test.describe('Worker Deployment Journey', () => {
  let workerId: string;

  test.beforeAll(async () => {
    await setupTestDatabase();
    workerId = await createTestWorker({
      name: 'Deployment Test Worker',
      passport_number: 'P12345678',
      nationality: 'Ethiopian',
      status: 'active'
    });
    await createTestVisa(workerId, {
      status: 'approved',
      destination: 'Saudi Arabia'
    });
  });

  test.afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('complete worker deployment journey from visa to travel', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'password123');
    await page.click('[data-testid="login-button"]');
    
    // Step 1: Book flight ticket
    await page.goto('/travel/tickets');
    await page.click('[data-testid="book-new-ticket"]');
    await page.fill('[data-testid="worker-id"]', workerId);
    await page.fill('[data-testid="airline"]', 'Ethiopian Airlines');
    await page.fill('[data-testid="flight-number"]', 'ET445');
    await page.fill('[data-testid="departure-date"]', '2024-05-01');
    await page.fill('[data-testid="departure-time"]', '23:45');
    await page.fill('[data-testid="arrival-date"]', '2024-05-02');
    await page.fill('[data-testid="arrival-time"]', '03:30');
    await page.fill('[data-testid="pnr"]', 'ABC123');
    await page.click('[data-testid="confirm-booking"]');
    
    // Step 2: Prepare for departure
    await page.goto('/travel/departure');
    await page.click(`[data-testid="prepare-departure-${workerId}"]`);
    await page.click('[data-testid="mark-documents-checked"]');
    await page.click('[data-testid="mark-training-completed"]');
    await page.click('[data-testid="mark-logistics-arranged"]');
    await page.click('[data-testid="notify-receiving-party"]');
    await page.click('[data-testid="mark-ready"]');
    
    // Step 3: Mark as departed
    await page.goto('/travel/departure');
    await page.click(`[data-testid="mark-departed-${workerId}"]`);
    await page.click('[data-testid="confirm-departure"]');
    
    // Verify worker status is updated to Abroad
    await page.goto('/workers/status');
    await expect(page.locator(`text=Deployment Test Worker`)).toBeVisible();
    await expect(page.locator(`text=Abroad`)).toBeVisible();
    
    // Verify in worker details
    await page.goto(`/workers/${workerId}`);
    await expect(page.locator(`text=Status: Abroad`)).toBeVisible();
    await expect(page.locator(`text=Destination: Saudi Arabia`)).toBeVisible();
  });
});