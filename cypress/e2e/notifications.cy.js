describe('Notification System', () => {
  beforeEach(() => {
    // Mock authentication
    cy.intercept('POST', '**/auth/v1/token?grant_type=password', {
      statusCode: 200,
      body: {
        access_token: 'test-token',
        token_type: 'bearer',
        expires_in: 3600,
        refresh_token: 'test-refresh-token',
        user: {
          id: 'test-user-id',
          email: 'test@example.com'
        }
      }
    }).as('loginRequest');
    
    // Mock notifications data
    cy.intercept('GET', '**/rest/v1/notifications*', {
      statusCode: 200,
      body: [
        {
          id: 'notif-1',
          user_id: 'test-user-id',
          title: 'Document Approved',
          message: 'Your Passport Copy has been approved.',
          type: 'success',
          related_to: 'document',
          related_id: 'DOC-2024-001',
          read: false,
          created_at: '2024-03-20T10:30:00Z'
        },
        {
          id: 'notif-2',
          user_id: 'test-user-id',
          title: 'Task Due Soon',
          message: 'Task "Complete documentation" is due in 2 days.',
          type: 'warning',
          related_to: 'task',
          related_id: 'task-1',
          read: true,
          created_at: '2024-03-19T14:15:00Z'
        }
      ]
    }).as('getNotifications');
    
    // Login
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    
    // Visit dashboard
    cy.visit('/dashboard');
  });
  
  it('displays notification count badge', () => {
    cy.get('[aria-label="Notifications"]').within(() => {
      cy.get('.badge').should('contain', '1');
    });
  });
  
  it('shows notification dropdown when clicked', () => {
    cy.get('[aria-label="Notifications"]').click();
    
    cy.contains('Document Approved').should('be.visible');
    cy.contains('Task Due Soon').should('be.visible');
    cy.contains('Your Passport Copy has been approved.').should('be.visible');
  });
  
  it('marks notification as read when clicked', () => {
    // Mock the update endpoint
    cy.intercept('PATCH', '**/rest/v1/notifications?id=eq.notif-1', {
      statusCode: 200
    }).as('markAsRead');
    
    cy.get('[aria-label="Notifications"]').click();
    cy.contains('Document Approved').click();
    
    cy.wait('@markAsRead').its('request.body').should('deep.equal', { read: true });
    
    // Badge count should decrease
    cy.get('[aria-label="Notifications"]').within(() => {
      cy.get('.badge').should('contain', '0');
    });
  });
  
  it('navigates to related content when notification is clicked', () => {
    cy.get('[aria-label="Notifications"]').click();
    cy.contains('Document Approved').click();
    
    // Should navigate to document details
    cy.url().should('include', '/documents/processing');
    cy.url().should('include', 'DOC-2024-001');
  });
});