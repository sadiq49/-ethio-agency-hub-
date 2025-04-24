import { test, expect } from '@playwright/test';

test.describe('Authentication Security Tests', () => {
  test('should prevent brute force login attempts', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Attempt multiple failed logins
    for (let i = 0; i < 5; i++) {
      await page.fill('[data-testid="email-input"]', 'admin@example.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword' + i);
      await page.click('[data-testid="login-button"]');
      
      // Wait for error message
      await expect(page.locator('text=Invalid credentials')).toBeVisible();
    }
    
    // Verify account lockout or CAPTCHA after multiple attempts
    await page.fill('[data-testid="email-input"]', 'admin@example.com');
    await page.fill('[data-testid="password-input"]', 'wrongpassword');
    await page.click('[data-testid="login-button"]');
    
    // Should see lockout message or CAPTCHA
    await expect(page.locator('text=/Too many failed attempts|CAPTCHA verification required/')).toBeVisible();
  });
  
  test('should enforce password complexity requirements', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Try weak password
    await page.fill('[data-testid="email-input"]', 'newuser@example.com');
    await page.fill('[data-testid="password-input"]', 'password');
    await page.fill('[data-testid="confirm-password-input"]', 'password');
    await page.click('[data-testid="register-button"]');
    
    // Should see password complexity error
    await expect(page.locator('text=/Password must contain|Password is too weak/')).toBeVisible();
    
    // Try strong password
    await page.fill('[data-testid="password-input"]', 'StrongP@ssw0rd123');
    await page.fill('[data-testid="confirm-password-input"]', 'StrongP@ssw0rd123');
    await page.click('[data-testid="register-button"]');
    
    // Should not see password complexity error
    await expect(page.locator('text=/Password must contain|Password is too weak/')).not.toBeVisible();
  });
});