// Simple Node.js test for Supabase authentication
import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const SUPABASE_URL = 'https://khoklmuwfwyfhccqbdmf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtob2tsbXV3Znd5ZmhjY3FiZG1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1OTMwMzcsImV4cCI6MjA4NTE2OTAzN30.f3gv_g8N4ZUd5d-Zxuef9aEqmnsR70hIbu4RCbQkMTc';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Test user data
const testUser = {
  email: 'test.user@gmail.com',
  password: 'TestPassword123!',
  name: 'Test User',
  role: 'user'
};

async function testAuthentication() {
  console.log('🧪 Testing Supabase Authentication...');
  console.log('=====================================');
  
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
        // Remove emailRedirectTo for Node.js environment
      },
    });

    if (error) {
      console.error('❌ Sign up failed:', error.message);
      return;
    }

    console.log('✅ Sign up successful!');
    console.log('   User ID:', data.user?.id);
    console.log('   Email:', data.user?.email);
    console.log('   Email Confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
    
    if (data.user && !data.session) {
      console.log('📧 Account created! Email confirmation required.');
      console.log('   Please check your email and confirm the account.');
    } else if (data.session) {
      console.log('🔐 Account created and logged in automatically!');
      console.log('   Session Token:', data.session?.access_token?.substring(0, 20) + '...');
    }

    // Test sign in (if account is confirmed)
    console.log('\n2. Testing Sign In...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password,
    });

    if (signInError) {
      console.log('⚠️  Sign in failed (expected if email not confirmed):', signInError.message);
    } else {
      console.log('✅ Sign in successful!');
      console.log('   Session ID:', signInData.session?.access_token?.substring(0, 20) + '...');
      console.log('   User ID:', signInData.user?.id);
      console.log('   Email:', signInData.user?.email);
    }

    console.log('\n🎉 Authentication test completed successfully!');
    console.log('=====================================');

  } catch (err) {
    console.error('❌ Authentication test failed:', err.message);
    console.error('Error details:', err);
  }
}

// Run the test
testAuthentication();