#!/bin/bash
# Deployment preparation script

echo "🚀 Preparing Skin Care AI for deployment..."

# Check if we're in the right directory
if [ ! -f "README.md" ] || [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo "❌ Please run this script from the root directory of your project"
    exit 1
fi

echo "📁 Project structure verified"

# Install dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install
echo "✅ Backend dependencies installed"

echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install
echo "✅ Frontend dependencies installed"

# Build frontend
echo "🔨 Building frontend for production..."
npm run build
echo "✅ Frontend built successfully"

cd ..

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Follow the instructions in DEPLOYMENT.md"
echo "2. Set up MongoDB Atlas database"
echo "3. Deploy backend to Railway"
echo "4. Deploy frontend to Vercel"
echo "5. Update environment variables"
echo ""
echo "📖 Full deployment guide: ./DEPLOYMENT.md"
