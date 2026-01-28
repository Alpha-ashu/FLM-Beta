// FinanceLife Authentication End-to-End Tests
describe('FinanceLife Authentication Flow', () => {
  const testEmail = 'test.user@example.com';
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  beforeEach(() => {
    // Visit the application
    cy.visit('/');
  });

  it('should display the login page by default', () => {
    // Check if we're on the auth page
    cy.url().should('not.include', '/dashboard');
    cy.get('form').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
  });

  it('should show registration form when clicking sign up', () => {
    // Click sign up link
    cy.contains('Sign Up').click();
    
    // Verify registration form appears
    cy.get('[data-testid="name-input"]').should('be.visible');
    cy.get('[data-testid="confirm-password-input"]').should('be.visible');
    cy.get('[data-testid="name-input"]').should('be.visible');
  });

  it('should validate email format on registration', () => {
    cy.contains('Sign Up').click();
    
    // Try with invalid email
    cy.get('[data-testid="email-input"]').type('invalid-email');
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="confirm-password-input"]').type(testPassword);
    cy.get('[data-testid="name-input"]').type(testName);
    
    // Submit should show validation error
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="error-message"]').should('contain', 'Invalid email');
  });

  it('should validate password strength on registration', () => {
    cy.contains('Sign Up').click();
    
    // Try with weak password
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type('weak');
    cy.get('[data-testid="confirm-password-input"]').type('weak');
    cy.get('[data-testid="name-input"]').type(testName);
    
    // Submit should show validation error
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="error-message"]').should('contain', 'Password');
  });

  it('should validate password confirmation match', () => {
    cy.contains('Sign Up').click();
    
    // Try with mismatched passwords
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="confirm-password-input"]').type('DifferentPassword123!');
    cy.get('[data-testid="name-input"]').type(testName);
    
    // Submit should show validation error
    cy.get('[data-testid="submit-button"]').click();
    cy.get('[data-testid="error-message"]').should('contain', 'Passwords do not match');
  });

  it('should handle login with invalid credentials', () => {
    // Try with invalid credentials
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    
    // Submit form
    cy.get('[data-testid="submit-button"]').click();
    
    // Should show error message
    cy.get('[data-testid="error-message"]').should('be.visible');
    cy.url().should('not.include', '/dashboard');
  });

  it('should handle login with valid credentials', () => {
    // Use valid credentials (assuming user exists)
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    
    // Submit form
    cy.get('[data-testid="submit-button"]').click();
    
    // Should redirect to dashboard or show success
    cy.url().should('include', '/dashboard');
  });

  it('should handle session persistence', () => {
    // Login first
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify we're logged in
    cy.url().should('include', '/dashboard');
    
    // Visit again - should still be logged in
    cy.visit('/');
    cy.url().should('include', '/dashboard');
  });

  it('should handle logout functionality', () => {
    // Login first
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify we're logged in
    cy.url().should('include', '/dashboard');
    
    // Find and click logout button
    cy.get('[data-testid="logout-button"]').click();
    
    // Should redirect to login page
    cy.url().should('not.include', '/dashboard');
  });

  it('should handle password reset flow', () => {
    // Click forgot password link
    cy.contains('Forgot Password?').click();
    
    // Should show password reset form
    cy.get('[data-testid="reset-email-input"]').should('be.visible');
    
    // Enter email
    cy.get('[data-testid="reset-email-input"]').type(testEmail);
    cy.get('[data-testid="reset-submit-button"]').click();
    
    // Should show success message
    cy.get('[data-testid="reset-success-message"]').should('be.visible');
  });

  it('should handle role-based access', () => {
    // Login as regular user
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify dashboard access
    cy.url().should('include', '/dashboard');
    
    // Check if user-specific features are visible
    cy.get('[data-testid="user-dashboard"]').should('be.visible');
    
    // Check that admin features are not visible (if any)
    cy.get('[data-testid="admin-panel"]').should('not.exist');
  });

  it('should handle mobile responsive authentication', () => {
    // Set viewport to mobile
    cy.viewport('iphone-6');
    
    // Verify form is still accessible
    cy.get('[data-testid="email-input"]').should('be.visible');
    cy.get('[data-testid="password-input"]').should('be.visible');
    
    // Test form submission on mobile
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="submit-button"]').click();
    
    // Should work the same as desktop
    cy.url().should('include', '/dashboard');
  });
});