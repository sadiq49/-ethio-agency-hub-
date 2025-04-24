describe('Document Processing Workflow', () => {
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
    
    // Mock document data
    cy.intercept('GET', '**/rest/v1/documents*', {
      statusCode: 200,
      body: [
        {
          id: 'DOC-2024-001',
          document_type: 'Passport Copy',
          status: 'pending_review',
          submitted_at: '2024-03-15',
          updated_at: '2024-03-15',
          processing_stage: 'Initial Verification',
          next_stage: 'Authentication',
          assigned_to: 'test-user-id',
          priority: 'high',
          expiry_date: '2029-03-14',
          remarks: 'Waiting for verification of personal details',
          worker_id: 'W1001',
          workers: { name: 'Amina Hassan' }
        }
      ]
    }).as('getDocuments');
    
    // Login and visit document processing page
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    
    cy.visit('/documents/processing');
    cy.wait('@getDocuments');
  });
  
  it('displays document list correctly', () => {
    cy.contains('Passport Copy').should('be.visible');
    cy.contains('Amina Hassan').should('be.visible');
    cy.contains('pending_review').should('be.visible');
  });
  
  it('filters documents by type', () => {
    cy.get('button').contains('Filter').click();
    cy.get('select[name="documentType"]').select('passport');
    cy.get('button').contains('Apply Filters').click();
    
    cy.contains('Passport Copy').should('be.visible');
  });
  
  it('opens document details when view button is clicked', () => {
    // Mock document detail data
    cy.intercept('GET', '**/rest/v1/documents?id=eq.DOC-2024-001*', {
      statusCode: 200,
      body: [{
        id: 'DOC-2024-001',
        document_type: 'Passport Copy',
        status: 'pending_review',
        // ... other document fields
      }]
    }).as('getDocumentDetail');
    
    cy.intercept('GET', '**/rest/v1/document_stages?document_id=eq.DOC-2024-001*', {
      statusCode: 200,
      body: [
        {
          id: 'stage-1',
          name: 'Document Upload',
          status: 'completed',
          // ... other stage fields
        },
        {
          id: 'stage-2',
          name: 'Initial Verification',
          status: 'in_progress',
          // ... other stage fields
        }
      ]
    }).as('getDocumentStages');
    
    // Click view button
    cy.get('button[aria-label="View details"]').first().click();
    
    // Check if details dialog is displayed
    cy.contains('Document Details').should('be.visible');
    cy.contains('Initial Verification').should('be.visible');
    cy.contains('in_progress').should('be.visible');
  });
  
  it('approves a document and shows notification', () => {
    // Mock document detail and action endpoints
    cy.intercept('GET', '**/rest/v1/documents?id=eq.DOC-2024-001*', {
      statusCode: 200,
      body: [{/* document data */}]
    }).as('getDocumentDetail');
    
    cy.intercept('PATCH', '**/rest/v1/documents?id=eq.DOC-2024-001', {
      statusCode: 200
    }).as('updateDocument');
    
    cy.intercept('POST', '**/rest/v1/document_history', {
      statusCode: 201
    }).as('createHistory');
    
    cy.intercept('POST', '**/rest/v1/notifications', {
      statusCode: 201
    }).as('createNotification');
    
    // Open document details
    cy.get('button[aria-label="View details"]').first().click();
    
    // Click approve button
    cy.contains('Approve').click();
    
    // Add remarks and submit
    cy.get('textarea[name="remarks"]').type('Document looks good');
    cy.contains('Submit').click();
    
    // Wait for API calls
    cy.wait('@updateDocument');
    cy.wait('@createHistory');
    cy.wait('@createNotification');
    
    // Check for success message
    cy.contains('Document approved successfully').should('be.visible');
  });
});