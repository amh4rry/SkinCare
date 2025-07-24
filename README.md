# 🌟 Skin Care AI - Personalized Skincare Journey

A comprehensive full-stack application that provides AI-powered skincare recommendations, routine tracking, and progress analysis to help users achieve their skin goals.

![Skin Care AI](https://img.shields.io/badge/Skin%20Care%20AI-v1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-blue.svg)

## ✨ Features

### 🤖 AI-Powered Recommendations
- **Google AI Integration**: Advanced AI analysis using Google Generative AI
- **Personalized Suggestions**: Tailored product recommendations based on skin profile
- **Smart Routine Generation**: AI-created morning and evening routines
- **Ingredient Analysis**: Compatibility checks for skincare ingredients

### 📸 Progress Tracking
- **Photo Analysis**: AI-powered skin condition assessment
- **Progress Photos**: Upload and track skin improvements over time
- **Visual Analytics**: Charts and graphs showing skin progress
- **Before/After Comparisons**: Side-by-side progress visualization

### 🧴 Product Management
- **Comprehensive Database**: Extensive skincare product catalog
- **Reviews & Ratings**: User-generated product reviews
- **Smart Filtering**: Find products by skin type, concerns, and ingredients
- **Price Comparison**: Compare products and find the best deals

### 📅 Routine Management
- **Custom Routines**: Build personalized skincare routines
- **Smart Reminders**: Never miss your skincare routine
- **Progress Tracking**: Monitor routine consistency and effectiveness
- **Flexible Scheduling**: Adapt routines to your lifestyle

### 👤 User Experience
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Profile Management**: Comprehensive skin profile questionnaire
- **Dashboard Analytics**: Personal skincare insights and statistics
- **Mobile Optimized**: Perfect experience on all devices

### 🛡️ Admin Features
- **Admin Dashboard**: Comprehensive management interface
- **User Management**: Monitor and manage user accounts
- **Product Management**: Add, edit, and manage product catalog
- **Review Moderation**: Approve and moderate user reviews
- **Analytics**: Platform usage and performance metrics

## 🚀 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **Google Generative AI** - AI-powered recommendations
- **JWT** - Authentication and authorization
- **Cloudinary** - Image storage and processing
- **Multer** - File upload handling

### Frontend
- **React 18** - Modern React with hooks and context
- **Material-UI** - Beautiful, accessible component library
- **Vite** - Lightning-fast build tool
- **React Router** - Client-side routing
- **React Query** - Server state management
- **Framer Motion** - Smooth animations and transitions
- **Chart.js** - Data visualization and analytics

### Development Tools
- **ESLint** - Code linting and formatting
- **Nodemon** - Development server auto-restart
- **React Hot Toast** - Elegant notifications
- **Axios** - HTTP client for API calls

## 🏗️ Project Structure

```
skin_care/
├── backend/                 # Node.js/Express backend
│   ├── middleware/         # Authentication, validation, error handling
│   ├── models/            # MongoDB models (User, Product, Review, Routine)
│   ├── routes/            # API route handlers
│   ├── services/          # Google AI service and utilities
│   ├── server.js          # Express server entry point
│   └── package.json       # Backend dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React context providers
│   │   ├── pages/         # Application pages
│   │   ├── theme/         # Material-UI theme configuration
│   │   ├── App.jsx        # Main application component
│   │   └── main.jsx       # Application entry point
│   ├── public/            # Static assets
│   ├── index.html         # HTML template
│   ├── vite.config.js     # Vite configuration
│   └── package.json       # Frontend dependencies
├── .github/               # GitHub configuration
│   └── copilot-instructions.md  # AI coding assistance
└── README.md              # Project documentation
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **Google AI API Key** (from Google AI Studio)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd skin_care
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with your configuration
cp .env.example .env
# Edit .env with your actual values
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Variables

Create `.env` file in the `backend` directory:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skincare_app

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Image Storage (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
CLIENT_URL=http://localhost:5173
```

## 🚀 Running the Application

### Development Mode

1. **Start the Backend Server**:
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:5000`

2. **Start the Frontend Development Server**:
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5173`

### Production Mode

1. **Build the Frontend**:
```bash
cd frontend
npm run build
```

2. **Start the Backend**:
```bash
cd backend
npm start
```

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-token` - Token verification
- `POST /api/auth/refresh-token` - Token refresh

### AI Services
- `POST /api/ai/recommendations` - Get AI skincare recommendations
- `POST /api/ai/analyze-photo` - Analyze progress photos
- `POST /api/ai/generate-routine` - Generate AI routines
- `POST /api/ai/skincare-advice` - Get personalized advice

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/skin-profile` - Update skin profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)

### Reviews
- `GET /api/reviews` - Get reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🎨 Design System

### Color Palette
- **Primary**: `#1976d2` (Blue)
- **Secondary**: `#dc004e` (Pink)
- **Success**: `#2e7d32` (Green)
- **Warning**: `#ed6c02` (Orange)
- **Error**: `#d32f2f` (Red)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **UI Elements**: System fonts fallback

### Theme Support
- ✅ Light Mode
- ✅ Dark Mode
- ✅ System Preference Detection
- ✅ Responsive Design
- ✅ Accessibility (WCAG 2.1)

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📱 Deployment

### Vercel (Frontend)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Deploy automatically on push

### Backend Deployment Options
- **Heroku**: Easy deployment with MongoDB Atlas
- **Railway**: Modern deployment platform
- **AWS/DigitalOcean**: VPS deployment
- **Vercel Functions**: Serverless deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google AI** for powerful AI capabilities
- **Material-UI** for beautiful components
- **MongoDB** for flexible data storage
- **React** community for excellent tooling
- **Open Source** contributors

## 📞 Support

If you have any questions or need help:

- 📧 Email: support@skincareai.com
- 💬 Discord: [Join our community](https://discord.gg/skincareai)
- 📚 Documentation: [docs.skincareai.com](https://docs.skincareai.com)
- 🐛 Issues: [GitHub Issues](https://github.com/username/skin_care/issues)

---

<div align="center">
  <p>Made with ❤️ for skincare enthusiasts everywhere</p>
  <p>
    <a href="#top">⬆️ Back to top</a>
  </p>
</div>
