@echo off
echo 🚀 Preparing Skin Care AI for deployment...

REM Check if we're in the right directory
if not exist "README.md" (
    echo ❌ Please run this script from the root directory of your project
    exit /b 1
)
if not exist "frontend" (
    echo ❌ Please run this script from the root directory of your project
    exit /b 1
)
if not exist "backend" (
    echo ❌ Please run this script from the root directory of your project
    exit /b 1
)

echo 📁 Project structure verified

REM Install dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
echo ✅ Backend dependencies installed

echo 📦 Installing frontend dependencies...
cd ..\frontend
call npm install
echo ✅ Frontend dependencies installed

REM Build frontend
echo 🔨 Building frontend for production...
call npm run build
echo ✅ Frontend built successfully

cd ..

echo 🎉 Deployment preparation complete!
echo.
echo Next steps:
echo 1. Follow the instructions in DEPLOYMENT.md
echo 2. Set up MongoDB Atlas database
echo 3. Deploy backend to Railway
echo 4. Deploy frontend to Vercel
echo 5. Update environment variables
echo.
echo 📖 Full deployment guide: ./DEPLOYMENT.md
pause
