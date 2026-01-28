#!/bin/bash

# FinanceLife Production Deployment Script
echo "🚀 FinanceLife Production Deployment"
echo "===================================="
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
echo "🎉 Production deployment ready!"
echo ""
echo "📋 Deployment Options:"
echo "1. Vercel: vercel --prod"
echo "2. Netlify: netlify deploy --prod --dir=dist"
echo "3. GitHub Pages: npm run deploy"
echo "4. Static hosting: Upload dist/ folder to your server"
echo ""
echo "🌐 Your app is ready for production use!"