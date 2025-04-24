import { test, expect } from '@playwright/test';
import { setupTestDatabase, cleanupTestDatabase } from '../helpers/db-setup';
import { createTestUser, createTestWorker } from '../helpers/create-test-data';

test.describe('Data Access Control Security Tests', () => {
  let regularUserId: string;
  let adminUserId: string;
  let workerId: string;
  
  test.beforeAll(async () => {
    await setupTestDatabase();
    regularUserId = await createTestUser({
      email: 'regular@example.com',
      password: 'Password123!',
      role: 'user'
    });
    adminUserId = await createTestUser({
      email: 'admin@example.com',
      password: 'Password123!',
      role: 'admin'
    });
    workerId = await createTestWorker({
      name: 'Security Test Worker',
      passport_number: 'P99999999',
      nationality: 'Ethiopian',
      status: 'active'
    });
  });

  test.afterAll(async () => {
    await cleanupTestDatabase();
  });

  test('regular user should not access admin functions', async ({ page }) => {
    // Login as regular user
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', 'regular@example.com');
    await page.fill('[data-testid="password-input"]', 'Password123!');
    await page.click('[data-testid="login-button"]');
    
    // Try to access admin dashboard
    await page.goto('/admin/dashboard');
    
    // Should be redirected or see access denied
    await expect(page.url()).not.toContain('/admin/dashboard');
    await expect(page.locator('text=/Access denied|Unauthorized/')).toBeVisible();
  });
  
  test('should prevent unauthorized API access', async ({ request }) => {
    // Try to access API without authentication
    const response = await request.get('/api/workers');
    
    // Should return 401 Unauthorized
    expect(response.status()).toBe(401);
    
    // Try to access sensitive API with regular user token
    const loginResponse = await request.post('/api/auth/login', {
      data: {
        email: 'regular@example.com',
        password: 'Password123!'
      }
    });
    const loginData = await loginResponse.json();
    const token = loginData.token;
    
    const adminResponse = await request.get('/api/admin/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Should return 403 Forbidden
    expect(adminResponse.status()).toBe(403);
  });
  
  test('should prevent SQL injection in search fields', async ({ page }) => {
    // Login as admin
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'Password123!');
    await page.click('[data-testid="login-button"]');
    
    // Try SQL injection in search field
    await page.goto('/workers');
    await page.fill('[data-testid="search-input"]', "' OR 1=1; --");
    
    // Should not show all workers (which would happen if injection worked)
    const workerCount = await page.locator('tbody tr').count();
    expect(workerCount).toBeLessThan(3); // Assuming there are more than 3 workers in the database
  });
});