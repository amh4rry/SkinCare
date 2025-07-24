#!/bin/bash
# Quick deployment update script

echo "🔧 Updating frontend configuration..."

# You need to replace these URLs with your actual deployed URLs
RAILWAY_URL="https://your-railway-url.railway.app"
VERCEL_URL="https://your-vercel-url.vercel.app"

echo "📝 Update these URLs with your actual deployment URLs:"
echo "Backend (Railway): $RAILWAY_URL"
echo "Frontend (Vercel): $VERCEL_URL"

echo ""
echo "📋 Next steps:"
echo "1. Deploy backend to Railway with environment variables"
echo "2. Copy your actual Railway URL"
echo "3. Update frontend/.env.production with real Railway URL"
echo "4. Add VITE_API_BASE_URL to Vercel environment variables"
echo "5. Redeploy frontend on Vercel"

echo ""
echo "🔗 Required environment variables:"
echo "Railway (Backend):"
echo "  - MONGODB_URI"
echo "  - JWT_SECRET"
echo "  - GOOGLE_AI_API_KEY"
echo "  - CLIENT_URL (your Vercel URL)"
echo "  - NODE_ENV=production"
echo ""
echo "Vercel (Frontend):"
echo "  - VITE_API_BASE_URL (your Railway URL + /api)"
