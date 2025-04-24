describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear cookies and localStorage before each test
    cy.clearCookies();
    cy.clearLocalStorage();
  });

  it('should navigate to login page', () => {
    cy.visit('/');
    cy.get('a[href="/auth/login"]').click();
    cy.url().should('include', '/auth/login');
  });

  it('should show validation errors on empty form submission', () => {
    cy.visit('/auth/login');
    cy.get('button[type="submit"]').click();
    cy.contains('required').should('be.visible');
  });

  it('should allow user to login with valid credentials', () => {
    // This test would require mocking Supabase or using a test account
    cy.visit('/auth/login');
    
    // Fill in login form
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    
    // Intercept the auth request to mock a successful response
    cy.intercept('POST', '**/auth/v1/token*', {
      statusCode: 200,
      body: {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        user: {
          id: '123',
          email: 'test@example.com',
        },
      },
    }).as('loginRequest');
    
    // Submit form
    cy.get('button[type="submit"]').click();
    
    // Wait for the intercepted request
    cy.wait('@loginRequest');
    
    // Verify redirect to dashboard after successful login
    cy.url().should('include', '/dashboard');
  });
});