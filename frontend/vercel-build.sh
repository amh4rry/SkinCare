#!/bin/bash
set -e

echo "🚀 Starting Vercel build for Skin Care Frontend..."

# Ensure we're in the right directory
cd /vercel/path0/frontend

# Set Node environment
export NODE_ENV=production

# Install dependencies with exact versions
echo "📦 Installing dependencies..."
npm ci --production=false

# Clear any existing build
rm -rf dist

# Build using npx to avoid permission issues
echo "🔨 Building with npx vite..."
npx vite build

# Verify build output
if [ -d "dist" ]; then
  echo "✅ Build successful!"
  echo "📂 Build contents:"
  ls -la dist/
else
  echo "❌ Build failed - no dist directory found"
  exit 1
fi
