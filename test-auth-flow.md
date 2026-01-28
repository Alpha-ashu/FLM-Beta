# FinanceLife Authentication Test Cases

## Overview
This document contains comprehensive test cases for the FinanceLife authentication system, covering both new user registration and existing user login flows.

## Test Environment Setup

### Prerequisites
- Supabase project with authentication enabled
- Email delivery configured in Supabase
- Production build deployed
- Test email account for verification

### Test Data
- Test email: `test.user@example.com`
- Test password: `TestPassword123!`
- Test name: `Test User`

## Test Case 1: New User Registration Flow

### Test ID: TC001
**Title**: New User Registration and Email Verification
**Priority**: High

#### Steps:
1. Navigate to the FinanceLife application
2. Click on "Sign Up" button
3. Fill in registration form:
   - Email: `test.user@example.com`
   - Password: `TestPassword123!`
   - Confirm Password: `TestPassword123!`
   - Name: `Test User`
4. Click "Sign Up" button
5. Check email inbox for verification email
6. Click verification link in email
7. Verify successful login and dashboard access

#### Expected Results:
- ✅ Registration form validation works (email format, password strength)
- ✅ User receives confirmation email
- ✅ Email contains valid verification link
- ✅ Verification link redirects to dashboard
- ✅ User is automatically logged in after verification
- ✅ Dashboard displays user's name and welcome message
- ✅ User can access all application features

#### Test Data Verification:
```javascript
// Expected user data in Supabase
{
  "email": "test.user@example.com",
  "user_metadata": {
    "full_name": "Test User",
    "role": "user"
  },
  "confirmed_at": "timestamp",
  "email_confirmed_at": "timestamp"
}
```

## Test Case 2: Existing User Login Flow

### Test ID: TC002
**Title**: Existing User Login with Email/Password
**Priority**: High

#### Steps:
1. Navigate to the FinanceLife application
2. Click on "Sign In" button
3. Fill in login form:
   - Email: `test.user@example.com`
   - Password: `TestPassword123!`
4. Click "Sign In" button
5. Verify successful login and dashboard access

#### Expected Results:
- ✅ Login form validation works
- ✅ User is redirected to dashboard
- ✅ User session is maintained across browser sessions
- ✅ Dashboard displays user's name and welcome message
- ✅ User can access all application features
- ✅ User's previous data is preserved

## Test Case 3: Session Persistence

### Test ID: TC003
**Title**: Session Persistence Across Browser Sessions
**Priority**: Medium

#### Steps:
1. Complete login flow (TC002)
2. Verify dashboard is accessible
3. Close browser completely
4. Reopen browser and navigate to application
5. Verify user is still logged in

#### Expected Results:
- ✅ User remains logged in after browser restart
- ✅ No need to re-enter credentials
- ✅ Session persists for reasonable duration (24-48 hours)

## Test Case 4: Password Reset Flow

### Test ID: TC004
**Title**: Password Reset for Existing User
**Priority**: Medium

#### Steps:
1. Navigate to login page
2. Click "Forgot Password?"
3. Enter email: `test.user@example.com`
4. Click "Send Reset Email"
5. Check email for password reset link
6. Click reset link and set new password
7. Verify login with new password

#### Expected Results:
- ✅ Password reset email is sent
- ✅ Reset link is valid and secure
- ✅ User can set new password
- ✅ Old password no longer works
- ✅ New password works for login

## Test Case 5: Error Handling

### Test ID: TC005
**Title**: Error Handling for Invalid Credentials
**Priority**: Medium

#### Steps:
1. Navigate to login page
2. Enter invalid credentials:
   - Email: `invalid@example.com`
   - Password: `wrongpassword`
3. Click "Sign In"
4. Try with correct email but wrong password
5. Try with valid credentials after failed attempts

#### Expected Results:
- ✅ Clear error message for invalid credentials
- ✅ No sensitive information leaked in error messages
- ✅ Valid credentials work after failed attempts
- ✅ Account is not locked after multiple failed attempts

## Test Case 6: Role-Based Access

### Test ID: TC006
**Title**: Role-Based Access Control
**Priority**: High

#### Steps:
1. Create user with "user" role
2. Create user with "advisor" role
3. Log in as regular user
4. Verify access to user features only
5. Log in as advisor
6. Verify access to advisor features

#### Expected Results:
- ✅ Regular users see only user dashboard
- ✅ Advisors see advisor-specific features
- ✅ Role-based navigation works correctly
- ✅ No unauthorized access to restricted features

## Test Case 7: Logout Functionality

### Test ID: TC007
**Title**: Complete Logout and Session Cleanup
**Priority**: Medium

#### Steps:
1. Complete login flow
2. Navigate to user profile/settings
3. Click "Logout"
4. Verify redirection to login page
5. Try to access dashboard directly
6. Verify user must log in again

#### Expected Results:
- ✅ User is redirected to login page
- ✅ Session is completely cleared
- ✅ Direct access to dashboard requires re-authentication
- ✅ No cached user data remains

## Test Case 8: Mobile Responsiveness

### Test ID: TC008
**Title**: Authentication on Mobile Devices
**Priority**: Low

#### Steps:
1. Open application on mobile device
2. Complete registration flow on mobile
3. Complete login flow on mobile
4. Verify all authentication features work on mobile

#### Expected Results:
- ✅ All forms are mobile-responsive
- ✅ Touch interactions work correctly
- ✅ Mobile keyboard behavior is appropriate
- ✅ Authentication flows work seamlessly on mobile

## Automated Test Scripts

### Cypress Test Suite

```javascript
// cypress/e2e/auth.cy.js
describe('FinanceLife Authentication Flow', () => {
  const testEmail = 'test.user@example.com';
  const testPassword = 'TestPassword123!';
  const testName = 'Test User';

  beforeEach(() => {
    cy.visit('/');
  });

  it('should allow new user registration', () => {
    // Navigate to sign up
    cy.get('[data-testid="sign-up-button"]').click();
    
    // Fill registration form
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    cy.get('[data-testid="confirm-password-input"]').type(testPassword);
    cy.get('[data-testid="name-input"]').type(testName);
    
    // Submit form
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify success message
    cy.get('[data-testid="success-message"]').should('be.visible');
  });

  it('should allow existing user login', () => {
    // Navigate to sign in
    cy.get('[data-testid="sign-in-button"]').click();
    
    // Fill login form
    cy.get('[data-testid="email-input"]').type(testEmail);
    cy.get('[data-testid="password-input"]').type(testPassword);
    
    // Submit form
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify dashboard access
    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="welcome-message"]').should('contain', testName);
  });

  it('should handle invalid credentials', () => {
    // Navigate to sign in
    cy.get('[data-testid="sign-in-button"]').click();
    
    // Fill with invalid credentials
    cy.get('[data-testid="email-input"]').type('invalid@example.com');
    cy.get('[data-testid="password-input"]').type('wrongpassword');
    
    // Submit form
    cy.get('[data-testid="submit-button"]').click();
    
    // Verify error message
    cy.get('[data-testid="error-message"]').should('be.visible');
  });

  it('should maintain session across browser restart', () => {
    // Login first
    cy.login(testEmail, testPassword);
    
    // Verify dashboard access
    cy.url().should('include', '/dashboard');
    
    // Simulate browser restart
    cy.clearCookies();
    cy.clearLocalStorage();
    
    // Should still be logged in due to persistent session
    cy.visit('/');
    cy.url().should('include', '/dashboard');
  });
});
```

### Jest Unit Tests

```javascript
// src/__tests__/auth.test.ts
import { supabase } from '../utils/supabase';

describe('Authentication Service', () => {
  test('should register new user successfully', async () => {
    const email = 'test@example.com';
    const password = 'TestPassword123!';
    const name = 'Test User';

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: 'user'
        }
      }
    });

    expect(error).toBeNull();
    expect(data.user?.email).toBe(email);
    expect(data.user?.user_metadata?.full_name).toBe(name);
  });

  test('should login existing user successfully', async () => {
    const email = 'test@example.com';
    const password = 'TestPassword123!';

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    expect(error).toBeNull();
    expect(data.session).toBeDefined();
    expect(data.user?.email).toBe(email);
  });

  test('should handle login errors gracefully', async () => {
    const email = 'nonexistent@example.com';
    const password = 'wrongpassword';

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    expect(error).toBeDefined();
    expect(data.user).toBeNull();
    expect(data.session).toBeNull();
  });

  test('should logout user successfully', async () => {
    // First login
    await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'TestPassword123!'
    });

    // Then logout
    const { error } = await supabase.auth.signOut();

    expect(error).toBeNull();
    
    // Verify session is cleared
    const { data } = await supabase.auth.getSession();
    expect(data.session).toBeNull();
  });
});
```

## Performance Test Cases

### Test ID: TC009
**Title**: Authentication Performance
**Priority**: Low

#### Requirements:
- Registration should complete in under 3 seconds
- Login should complete in under 2 seconds
- Password reset email should arrive within 30 seconds
- Session validation should be instantaneous

## Security Test Cases

### Test ID: TC010
**Title**: Security Validation
**Priority**: High

#### Requirements:
- Passwords are never logged or stored in plain text
- Email verification links expire after 24 hours
- Session tokens are secure and httpOnly
- CSRF protection is implemented
- Rate limiting prevents brute force attacks

## Test Execution Checklist

- [ ] TC001: New User Registration Flow
- [ ] TC002: Existing User Login Flow
- [ ] TC003: Session Persistence
- [ ] TC004: Password Reset Flow
- [ ] TC005: Error Handling
- [ ] TC006: Role-Based Access
- [ ] TC007: Logout Functionality
- [ ] TC008: Mobile Responsiveness
- [ ] TC009: Performance Validation
- [ ] TC010: Security Validation

## Test Environment Configuration

### Supabase Setup for Testing
```javascript
// .env.test
VITE_SUPABASE_URL="https://your-test-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-test-anon-key"
TEST_EMAIL="test.user@example.com"
TEST_PASSWORD="TestPassword123!"
```

### Test Database Cleanup
```javascript
// Clean up test users after tests
const cleanupTestUsers = async () => {
  const { data } = await supabase.auth.admin.listUsers();
  const testUsers = data.users.filter(user => 
    user.email.includes('test.user@example.com')
  );
  
  for (const user of testUsers) {
    await supabase.auth.admin.deleteUser(user.id);
  }
};
```

## Success Criteria

All test cases must pass for the authentication system to be considered production-ready:

1. ✅ New users can register and verify their email
2. ✅ Existing users can login successfully
3. ✅ Sessions persist across browser sessions
4. ✅ Password reset functionality works
5. ✅ Error handling is user-friendly
6. ✅ Role-based access control works
7. ✅ Logout completely clears session
8. ✅ Mobile authentication works
9. ✅ Performance meets requirements
10. ✅ Security standards are met

## Notes

- Test email service must be configured in Supabase
- Test users should be cleaned up after testing
- Consider using test isolation for concurrent test runs
- Monitor authentication metrics in production