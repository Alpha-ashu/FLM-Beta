// Test script to verify Supabase authentication
// Run this in your browser console or as a standalone script

// Import Supabase client
import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const SUPABASE_URL = 'https://khoklmuwfwyfhccqbdmf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2tsbXV3Znd5ZmhjY3FiZG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTMwMzcsImV4cCI6MjA4NTE2OTAzN30.f3gv_g8N4ZUd5d-Zxuef9aEqmnsR70hIbu4RCbQkMTc';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test user data
const testUser = {
  email: 'test.user@example.com',
  password: 'TestPassword123!',
  name: 'Test User',
  role: 'user'
};

async function testAuthentication() {
  console.log('Testing Supabase Authentication...');
  
  try {
    // Test sign up
    console.log('1. Testing Sign Up...');
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          name: testUser.name,
          role: testUser.role,
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      console.error('Sign up failed:', error.message);
      return;
    }

    console.log('Sign up successful:', data);
    
    if (data.user && !data.session) {
      console.log('✅ Account created! Email confirmation required.');
      console.log('Please check your email and confirm the account.');
    } else if (data.session) {
      console.log('✅ Account created and logged in automatically!');
      console.log('User ID:', data.user?.id);
      console.log('Email:', data.user?.email);
    }

    // Test sign in (if account is confirmed)
    console.log('\n2. Testing Sign In...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    });

    if (signInError) {
      console.log('Sign in failed (expected if email not confirmed):', signInError.message);
    } else {
      console.log('✅ Sign in successful!');
      console.log('Session:', signInData.session);
      console.log('User:', signInData.user);
    }

  } catch (err) {
    console.error('Authentication test failed:', err);
  }
}

// Run the test
testAuthentication();