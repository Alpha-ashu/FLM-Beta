import { useState, useEffect, useRef } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { Dashboard } from './components/Dashboard';
import { AuthPage } from './components/AuthPage';
import { ComprehensiveOnboarding } from './components/ComprehensiveOnboarding';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { LanguageProvider } from './contexts/LanguageContext';
import { GuestModeProvider } from './contexts/GuestModeContext';
import { OnboardingProvider } from './contexts/OnboardingContext';
import { CurrencyProvider } from './contexts/CurrencyContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';
import { registerServiceWorker } from './utils/serviceWorkerRegistration';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Comprehensive console warning suppression for Figma tracking attributes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Helper to check if message is a Figma-related warning
const isFigmaWarning = (args: any[]): boolean => {
  // Convert all arguments to string for checking
  const fullMessage = args.map(arg => {
    if (typeof arg === 'string') return arg;
    if (arg && typeof arg === 'object') return JSON.stringify(arg);
    return String(arg);
  }).join(' ');

  return (
    fullMessage.includes('data-fg-') || 
    fullMessage.includes('data-onlook-') ||
    fullMessage.includes('The following props are not supported') ||
    (fullMessage.includes('Failed') && fullMessage.includes('type') && fullMessage.includes('prop')) ||
    (fullMessage.includes('prop') && fullMessage.includes('not supported')) ||
    (fullMessage.includes('validateDOMNesting') && fullMessage.includes('cannot appear as a descendant'))
  );
};

console.error = (...args: any[]) => {
  if (isFigmaWarning(args)) {
    return;
  }
  originalConsoleError.apply(console, args);
};

console.warn = (...args: any[]) => {
  if (isFigmaWarning(args)) {
    return;
  }
  originalConsoleWarn.apply(console, args);
};

// Extend Window interface to store Supabase client
declare global {
  interface Window {
    __supabaseClient?: SupabaseClient;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Wrapper component to filter out Figma props from ThemeProvider
function CleanThemeProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3B82F6',
      light: '#60A5FA',
      dark: '#2563EB',
    },
    secondary: {
      main: '#10B981',
      light: '#34D399',
      dark: '#059669',
    },
    background: {
      default: '#F8FAFC',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
    },
    error: {
      main: '#EF4444',
    },
    success: {
      main: '#10B981',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h4: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
    subtitle1: {
      fontWeight: 500,
    },
    body2: {
      fontSize: '0.875rem',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#F8FAFC',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
          padding: '8px 16px',
          boxShadow: 'none',
          border: '1px solid transparent',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          background: '#3B82F6',
          color: '#FFFFFF',
          border: '1px solid #3B82F6',
          '&:hover': {
            background: '#2563EB',
            border: '1px solid #2563EB',
          },
        },
        outlined: {
          background: '#FFFFFF',
          color: '#1E293B',
          border: '1px solid #E2E8F0',
          '&:hover': {
            border: '1px solid #CBD5E1',
            background: '#F8FAFC',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            background: '#FFFFFF',
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#CBD5E1',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#3B82F6',
              borderWidth: '1px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          border: '1px solid #E2E8F0',
        },
      },
    },
  },
});

// Internal component that receives no props from Figma
function AppContent({ supabase, session, loading }: { supabase: any; session: any; loading: boolean }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user needs to see onboarding (first time login)
    if (session && session.user) {
      const hasSeenOnboarding = localStorage.getItem(`onboarding_completed_${session.user.id}`);
      if (!hasSeenOnboarding) {
        setShowOnboarding(true);
      }
    }
  }, [session]);

  const handleOnboardingComplete = () => {
    if (session && session.user) {
      localStorage.setItem(`onboarding_completed_${session.user.id}`, 'true');
    }
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    if (session && session.user) {
      localStorage.setItem(`onboarding_completed_${session.user.id}`, 'true');
    }
    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}
        >
          Loading...
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showOnboarding && (
        <ComprehensiveOnboarding
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      {!session ? (
        <AuthPage supabase={supabase} />
      ) : (
        <Dashboard supabase={supabase} session={session} />
      )}
    </ThemeProvider>
  );
}

export default function App(props: any) {
  // Filter out ALL props including Figma-specific attributes to prevent them from leaking to child components
  // We don't use any props from Figma, so we ignore them entirely

  // Initialize Supabase client only once using window object
  const supabaseRef = useRef<SupabaseClient | null>(null);
  
  if (!supabaseRef.current) {
    if (typeof window !== 'undefined' && !window.__supabaseClient) {
      window.__supabaseClient = createClient(
        `https://${projectId}.supabase.co`,
        publicAnonKey,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
            storageKey: 'financial-life-app-auth',
          },
        }
      );
    }
    supabaseRef.current = window.__supabaseClient!;
  }
  
  const supabase = supabaseRef.current;
  
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Register service worker
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Return internal component to isolate from Figma props - explicitly pass no props
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider key="lang-provider">
          <GuestModeProvider key="guest-mode-provider">
            <OnboardingProvider key="onboarding-provider">
              <CurrencyProvider>
                <OfflineIndicator />
                <AppContent supabase={supabase} session={session} loading={loading} />
              </CurrencyProvider>
            </OnboardingProvider>
          </GuestModeProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}