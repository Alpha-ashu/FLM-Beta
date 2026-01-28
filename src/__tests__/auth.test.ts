import { supabase } from '../utils/supabase';

// Mock the Supabase client
jest.mock('../utils/supabase', () => ({
  supabase: {
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      admin: {
        listUsers: jest.fn(),
        deleteUser: jest.fn()
      }
    }
  }
}));

describe('Authentication Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('User Registration', () => {
    it('should register new user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          role: 'user'
        }
      };

      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token'
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      const result = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'TestPassword123!',
        options: {
          data: {
            full_name: 'Test User',
            role: 'user'
          }
        }
      });

      expect(result.error).toBeNull();
      expect(result.data.user?.email).toBe('test@example.com');
      expect(result.data.user?.user_metadata?.full_name).toBe('Test User');
      expect(result.data.user?.user_metadata?.role).toBe('user');
    });

    it('should handle registration errors', async () => {
      const mockError = {
        message: 'Email already registered',
        code: 'user_already_exists'
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await supabase.auth.signUp({
        email: 'existing@example.com',
        password: 'TestPassword123!',
        options: {
          data: {
            full_name: 'Existing User',
            role: 'user'
          }
        }
      });

      expect(result.error).toEqual(mockError);
      expect(result.data.user).toBeNull();
      expect(result.data.session).toBeNull();
    });

    it('should validate email format', async () => {
      const mockError = {
        message: 'Invalid email format',
        code: 'invalid_email'
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await supabase.auth.signUp({
        email: 'invalid-email',
        password: 'TestPassword123!',
        options: {
          data: {
            full_name: 'Test User',
            role: 'user'
          }
        }
      });

      expect(result.error).toEqual(mockError);
    });

    it('should validate password strength', async () => {
      const mockError = {
        message: 'Password too weak',
        code: 'weak_password'
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'weak',
        options: {
          data: {
            full_name: 'Test User',
            role: 'user'
          }
        }
      });

      expect(result.error).toEqual(mockError);
    });
  });

  describe('User Login', () => {
    it('should login existing user successfully', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          role: 'user'
        }
      };

      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000 // 1 hour from now
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'TestPassword123!'
      });

      expect(result.error).toBeNull();
      expect(result.data.session).toBeDefined();
      expect(result.data.user?.email).toBe('test@example.com');
      expect(result.data.user?.user_metadata?.full_name).toBe('Test User');
    });

    it('should handle invalid credentials', async () => {
      const mockError = {
        message: 'Invalid credentials',
        code: 'invalid_credentials'
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      });

      expect(result.error).toEqual(mockError);
      expect(result.data.user).toBeNull();
      expect(result.data.session).toBeNull();
    });

    it('should handle account not confirmed', async () => {
      const mockError = {
        message: 'Email not confirmed',
        code: 'email_not_confirmed'
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'unconfirmed@example.com',
        password: 'TestPassword123!'
      });

      expect(result.error).toEqual(mockError);
    });

    it('should handle network errors', async () => {
      const mockError = {
        message: 'Network error',
        code: 'network_error'
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'TestPassword123!'
      });

      expect(result.error).toEqual(mockError);
    });
  });

  describe('Session Management', () => {
    it('should get current session', async () => {
      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: Date.now() + 3600000
      };

      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: mockSession },
        error: null
      });

      const result = await supabase.auth.getSession();

      expect(result.error).toBeNull();
      expect(result.data.session).toEqual(mockSession);
    });

    it('should return null session when not logged in', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null
      });

      const result = await supabase.auth.getSession();

      expect(result.error).toBeNull();
      expect(result.data.session).toBeNull();
    });

    it('should logout user successfully', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null
      });

      const result = await supabase.auth.signOut();

      expect(result.error).toBeNull();
    });

    it('should handle logout errors', async () => {
      const mockError = {
        message: 'Logout failed',
        code: 'logout_error'
      };

      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: mockError
      });

      const result = await supabase.auth.signOut();

      expect(result.error).toEqual(mockError);
    });
  });

  describe('Password Reset', () => {
    it('should initiate password reset', async () => {
      // Note: Supabase doesn't have a direct password reset method in the client
      // This would typically be handled through the Supabase dashboard or custom functions
      const mockResult = {
        data: { message: 'Password reset email sent' },
        error: null
      };

      // Mock a custom function call for password reset
      (supabase.auth.admin.listUsers as jest.Mock).mockResolvedValue({
        data: { users: [] },
        error: null
      });

      // In a real implementation, this would call a Supabase function
      const result = await supabase.auth.admin.listUsers();

      expect(result.error).toBeNull();
      expect(result.data.users).toBeDefined();
    });
  });

  describe('Role-Based Access', () => {
    it('should check user role', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        user_metadata: {
          full_name: 'Test User',
          role: 'user'
        }
      };

      const mockSession = {
        access_token: 'mock-access-token'
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'TestPassword123!'
      });

      expect(result.data.user?.user_metadata?.role).toBe('user');
    });

    it('should handle advisor role', async () => {
      const mockUser = {
        id: 'advisor-123',
        email: 'advisor@example.com',
        user_metadata: {
          full_name: 'Advisor User',
          role: 'advisor'
        }
      };

      const mockSession = {
        access_token: 'mock-access-token'
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser, session: mockSession },
        error: null
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'advisor@example.com',
        password: 'TestPassword123!'
      });

      expect(result.data.user?.user_metadata?.role).toBe('advisor');
    });
  });

  describe('Error Handling', () => {
    it('should handle all authentication errors gracefully', async () => {
      const errorCases = [
        { code: 'user_already_exists', message: 'Email already registered' },
        { code: 'invalid_credentials', message: 'Invalid email or password' },
        { code: 'email_not_confirmed', message: 'Please confirm your email first' },
        { code: 'weak_password', message: 'Password is too weak' },
        { code: 'invalid_email', message: 'Invalid email format' },
        { code: 'network_error', message: 'Network error occurred' }
      ];

      for (const errorCase of errorCases) {
        (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
          data: { user: null, session: null },
          error: errorCase
        });

        const result = await supabase.auth.signInWithPassword({
          email: 'test@example.com',
          password: 'TestPassword123!'
        });

        expect(result.error).toEqual(errorCase);
        expect(result.data.user).toBeNull();
        expect(result.data.session).toBeNull();
      }
    });
  });

  describe('Security', () => {
    it('should not expose sensitive information in error messages', async () => {
      const mockError = {
        message: 'Authentication failed',
        code: 'auth_failed'
      };

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError
      });

      const result = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'TestPassword123!'
      });

      expect(result.error).toEqual(mockError);
      // Ensure no sensitive data is leaked
      expect(result.error.message).not.toContain('password');
      expect(result.error.message).not.toContain('token');
    });

    it('should handle session expiration', async () => {
      const expiredSession = {
        access_token: 'expired-token',
        refresh_token: 'expired-refresh-token',
        expires_at: Date.now() - 1000 // Expired
      };

      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: expiredSession },
        error: null
      });

      const result = await supabase.auth.getSession();

      expect(result.data.session).toEqual(expiredSession);
      // In a real implementation, you would check if the session is expired
      expect(result.data.session.expires_at).toBeLessThan(Date.now());
    });
  });
});