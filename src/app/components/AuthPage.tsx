import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Tabs,
  Tab,
  Alert,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Checkbox,
} from '@mui/material';
import { AccountBalance, Explore } from '@mui/icons-material';
// Supabase configuration with your credentials
const SUPABASE_URL = 'https://khoklmuwfwyfhccqbdmf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2tsbXV3Znd5ZmhjY3FiZG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTMwMzcsImV4cCI6MjA4NTE2OTAzN30.f3gv_g8N4ZUd5d-Zxuef9aEqmnsR70hIbu4RCbQkMTc';

// Initialize Supabase client
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface AuthPageProps {
  onGuestMode?: () => void;
}

export function AuthPage({ onGuestMode }: AuthPageProps) {
  const [tab, setTab] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'user' | 'advisor'>('user');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) throw signUpError;

      // Check if email confirmation is required
      if (data.user && !data.session) {
        setSuccess('Account created! Please check your email to confirm your account, then use the Sign In tab.');
        setLoading(false);
        setTab(0); // Switch to sign in tab
        return;
      }

      console.log('Signup successful and logged in!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 0 },
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ textAlign: 'center', mb: { xs: 3, sm: 4 } }}>
          <AccountBalance sx={{ fontSize: { xs: 48, sm: 60 }, color: 'white', mb: 2 }} />
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1, fontSize: { xs: '2rem', sm: '3rem' } }}>
            FinanceLife
          </Typography>
          <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.9)', fontSize: { xs: '1rem', sm: '1.25rem' } }}>
            Your Complete Financial Management Platform
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={tab === 0 ? handleSignIn : handleSignUp}>
              {tab === 1 && (
                <TextField
                  fullWidth
                  label="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  margin="normal"
                  required
                />
              )}
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
              />

              {tab === 1 && (
                <FormControl component="fieldset" sx={{ mt: 2, mb: 1 }}>
                  <FormLabel component="legend">I am a:</FormLabel>
                  <RadioGroup
                    row
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'user' | 'advisor')}
                  >
                    <FormControlLabel 
                      value="user" 
                      control={<Radio />} 
                      label="Regular User" 
                    />
                    <FormControlLabel 
                      value="advisor" 
                      control={<Radio />} 
                      label="Financial Advisor" 
                    />
                  </RadioGroup>
                </FormControl>
              )}

              {tab === 1 && (
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  margin="normal"
                />
              )}

              {tab === 1 && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="I accept the Terms of Service and Privacy Policy"
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || (tab === 1 && !acceptTerms)}
              >
                {loading ? 'Loading...' : tab === 0 ? 'Sign In' : 'Sign Up'}
              </Button>
            </form>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>


            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              {tab === 0 
                ? "Don't have an account? Click Sign Up above" 
                : 'Already have an account? Click Sign In above'}
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ color: 'white', textAlign: 'center', mt: 3 }}>
          Free forever • No bank integration required • Privacy-first
        </Typography>
      </Container>
    </Box>
  );
}