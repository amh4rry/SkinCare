# 🚀 Deployment Guide - Skin Care AI

This guide will help you deploy your Skin Care AI application for free using Vercel (frontend) and Railway (backend).

## 📋 Prerequisites

1. **GitHub Account** - Your code is already pushed
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Railway Account** - Sign up at [railway.app](https://railway.app)
4. **MongoDB Atlas Account** - Sign up at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
5. **Google AI API Key** - Get from [Google AI Studio](https://makersuite.google.com/app/apikey)

## 🗄️ Step 1: Set Up MongoDB Atlas (Database)

1. **Create a Free Cluster**:
   - Go to [MongoDB Atlas](https://mongodb.com/cloud/atlas)
   - Sign up and create a new project
   - Create a free M0 cluster (512 MB, shared)
   - Choose a region close to your users

2. **Configure Database Access**:
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Create a user with username/password
   - Give "Read and write to any database" permissions

3. **Configure Network Access**:
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Choose "Allow access from anywhere" (0.0.0.0/0)
   - This is needed for Railway/Vercel to connect

4. **Get Connection String**:
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string (looks like: mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skincare)

## 🖥️ Step 2: Deploy Backend to Railway

1. **Sign Up & Connect GitHub**:
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub
   - Connect your GitHub account

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `SkinCare` repository
   - Select the `backend` folder as root

3. **Configure Environment Variables**:
   Click on your service → "Variables" tab and add:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skincare
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   GOOGLE_AI_API_KEY=your_google_ai_api_key_from_google_ai_studio
   CLIENT_URL=https://your-app-name.vercel.app
   NODE_ENV=production
   PORT=5001
   ```

4. **Set Root Directory**:
   - Go to "Settings" tab
   - Under "Source Repo", set "Root Directory" to `backend`

5. **Deploy**:
   - Railway will automatically deploy
   - Note your backend URL (like: https://your-app.railway.app)

## 🌐 Step 3: Deploy Frontend to Vercel

1. **Sign Up & Connect GitHub**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Connect your GitHub account

2. **Import Project**:
   - Click "New Project"
   - Import your `SkinCare` repository
   - Select the `frontend` folder as root

3. **Configure Build Settings**:
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Set Environment Variables**:
   In the deployment settings, add:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like: https://your-app.vercel.app

## 🔄 Step 4: Update CORS Configuration

1. **Update Backend CORS**:
   - Go back to your Railway deployment
   - Update the `CLIENT_URL` environment variable with your Vercel URL
   - Example: `CLIENT_URL=https://your-app.vercel.app`

2. **Redeploy Backend**:
   - Railway will automatically redeploy with new environment variables

## 🔧 Step 5: Update Frontend API URL

1. **Update Production Environment**:
   - In your local `frontend/.env.production` file, update:
   ```
   VITE_API_BASE_URL=https://your-backend-url.railway.app/api
   ```

2. **Commit and Push**:
   ```bash
   git add .
   git commit -m "Update production API URL"
   git push origin main
   ```

3. **Vercel Auto-Deploy**:
   - Vercel will automatically redeploy with the new API URL

## ✅ Step 6: Test Your Deployment

1. **Visit Your App**: Go to your Vercel URL
2. **Test Registration**: Create a new account
3. **Test Login**: Log in with your account
4. **Test Questionnaire**: Complete the AI questionnaire
5. **Test Dashboard**: Check if dashboard loads with AI insights

## 🔍 Troubleshooting

### Common Issues:

1. **"Network Error" when registering/logging in**:
   - Check that CORS is configured correctly
   - Verify backend URL is correct in frontend environment

2. **"Failed to generate skincare routine"**:
   - Verify Google AI API key is set correctly
   - Check Railway logs for any API errors

3. **Database connection errors**:
   - Verify MongoDB connection string is correct
   - Check that IP whitelist includes 0.0.0.0/0

4. **Build failures**:
   - Check that all dependencies are listed in package.json
   - Verify build commands are correct

### View Logs:
- **Railway**: Go to your project → "Deployments" → Click on deployment → "View logs"
- **Vercel**: Go to your project → "Functions" tab → Click on function → "View logs"

## 🎉 Success!

Your Skin Care AI application is now live! 

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-backend.railway.app

## 💡 Tips for Production

1. **Custom Domain**: Both Vercel and Railway support custom domains
2. **Monitoring**: Set up monitoring for uptime and performance
3. **Analytics**: Consider adding Google Analytics or similar
4. **SSL**: Both platforms provide HTTPS automatically
5. **Backups**: MongoDB Atlas provides automatic backups

## 📱 Sharing Your App

Your app is now publicly accessible! You can:
- Share the Vercel URL with anyone
- Add it to your portfolio
- Submit it to showcases
- Use it in your resume

## 🔄 Future Updates

To update your app:
1. Make changes locally
2. Commit and push to GitHub
3. Both Railway and Vercel will auto-deploy

---

**Need Help?** 
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
