#!/bin/bash
# Vercel build script for frontend

echo "🚀 Starting Vercel build process..."

# Set Node environment
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production=false

# Build the project
echo "🔨 Building React app..."
npm run build

echo "✅ Build completed successfully!"

# List build output for debugging
echo "📁 Build output:"
ls -la dist/
