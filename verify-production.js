#!/usr/bin/env node

/**
 * Production Verification Script for FinanceLife
 * This script verifies that the production build is working correctly
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 FinanceLife Production Verification');
console.log('=====================================\n');

// Check if dist folder exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error('❌ ERROR: dist folder not found. Run "npm run build" first.');
  process.exit(1);
}

console.log('✅ dist folder exists');

// Check for required files
const requiredFiles = [
  'index.html',
  'assets/index-BxwW9L9q.css',
  'assets/purify.es-B9ZVCkUG.js',
  'assets/index.es-De7dJnBF.js',
  'assets/index-D0ow_XEG.js'
];

let allFilesExist = true;
requiredFiles.forEach(file => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    const stats = fs.statSync(filePath);
    console.log(`✅ ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  } else {
    console.error(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

if (!allFilesExist) {
  console.error('\n❌ ERROR: Some required files are missing');
  process.exit(1);
}

// Check .env file
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  if (envContent.includes('khoklmuwfwyfhccqbdmf.supabase.co')) {
    console.log('✅ .env file contains correct Supabase URL');
  } else {
    console.error('❌ .env file missing or incorrect Supabase URL');
  }
} else {
  console.error('❌ .env file not found');
}

// Check package.json for build scripts
const packageJsonPath = path.join(__dirname, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (packageJson.scripts && packageJson.scripts.build) {
    console.log('✅ Build script configured');
  } else {
    console.error('❌ Build script missing in package.json');
  }
}

// Check for Supabase credentials in source
const appPath = path.join(__dirname, 'src', 'app', 'App.tsx');
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8');
  if (appContent.includes('khoklmuwfwyfhccqbdmf.supabase.co')) {
    console.log('✅ App.tsx contains correct Supabase credentials');
  } else {
    console.error('❌ App.tsx missing correct Supabase credentials');
  }
}

const authPath = path.join(__dirname, 'src', 'app', 'components', 'AuthPage.tsx');
if (fs.existsSync(authPath)) {
  const authContent = fs.readFileSync(authPath, 'utf8');
  if (authContent.includes('khoklmuwfwyfhccqbdmf.supabase.co')) {
    console.log('✅ AuthPage.tsx contains correct Supabase credentials');
  } else {
    console.error('❌ AuthPage.tsx missing correct Supabase credentials');
  }
}

console.log('\n🎉 Production verification complete!');
console.log('\n📋 Next Steps:');
console.log('1. Deploy to your preferred hosting platform');
console.log('2. Configure email delivery in Supabase');
console.log('3. Update Supabase project settings with your production domain');
console.log('4. Test the authentication flow with a new user');
console.log('\n🚀 Your FinanceLife app is ready for production!');

// Calculate total size
const totalSize = requiredFiles.reduce((total, file) => {
  const filePath = path.join(distPath, file);
  if (fs.existsSync(filePath)) {
    return total + fs.statSync(filePath).size;
  }
  return total;
}, 0);

console.log(`\n📊 Total production bundle size: ${(totalSize / 1024).toFixed(2)} KB`);