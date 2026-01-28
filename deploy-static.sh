#!/bin/bash

# FinanceLife Static Deployment Script
echo "🚀 FinanceLife Static Deployment"
echo "=================================="
echo ""

# Check if build exists
if [ ! -d "dist" ]; then
    echo "📦 Building production version..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
fi

echo "✅ Build completed successfully"

# Verify production files
echo "🔍 Verifying production files..."
node verify-production.js
if [ $? -ne 0 ]; then
    echo "❌ Verification failed!"
    exit 1
fi

echo ""
echo "🎉 Static deployment ready!"
echo ""
echo "📋 Upload the 'dist' folder to your preferred hosting:"
echo "1. GitHub Pages: Upload to gh-pages branch"
echo "2. AWS S3: Upload to bucket and enable static website hosting"
echo "3. Google Cloud Storage: Upload to bucket and enable static website hosting"
echo "4. Azure Blob Storage: Upload and enable static website hosting"
echo "5. Any static hosting provider: Upload dist/ folder"
echo ""
echo "🌐 Your app is ready for production use!"
echo ""
echo "📁 Files to upload:"
ls -la dist/