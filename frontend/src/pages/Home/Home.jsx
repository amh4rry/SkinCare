import React from 'react'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  AutoAwesome as AIIcon,
  PhotoCamera as CameraIcon,
  Schedule as RoutineIcon,
  TrendingUp as ProgressIcon,
  Star as StarIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import './Home.css'

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const navigate = useNavigate()
  const { user } = useAuth()

  const features = [
    {
      icon: <AIIcon />,
      title: 'AI-Powered Recommendations',
      description: 'Get personalized skincare recommendations based on your unique skin profile and concerns.',
      color: '#1976d2',
    },
    {
      icon: <CameraIcon />,
      title: 'Progress Photo Analysis',
      description: 'Track your skin improvement with AI-powered photo analysis and progress insights.',
      color: '#2e7d32',
    },
    {
      icon: <RoutineIcon />,
      title: 'Smart Routine Builder',
      description: 'Create and track personalized skincare routines tailored to your lifestyle and goals.',
      color: '#ed6c02',
    },
    {
      icon: <ProgressIcon />,
      title: 'Progress Tracking',
      description: 'Monitor your skincare journey with detailed analytics and improvement tracking.',
      color: '#9c27b0',
    },
  ]

  const testimonials = [
    {
      name: 'DemoUser',
      rating: 5,
      comment: 'Amazing app!',
    },
    {
      name: 'DemoUser1',
      rating: 4,
      comment: 'Good app',
    },
    {
      name: 'DemoUser2',
      rating: 3,
      comment: 'Finally good app ',
    },
  ]

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard')
    } else {
      navigate('/register')
    }
  }

  const handleLogin = () => {
    navigate('/login')
  }

  return (
    <Box className="home-page">
      {/* Hero Section */}
      <Box className="hero-section">
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography 
                  variant="h1" 
                  className="hero-title"
                  gutterBottom
                >
                  Your <span className="text-gradient">AI-Powered</span> Skincare Journey Starts Here
                </Typography>
                
                <Typography 
                  variant="h5" 
                  className="hero-subtitle"
                  gutterBottom
                >
                  Discover personalized skincare recommendations, track your progress, and achieve your skin goals with the power of artificial intelligence.
                </Typography>
                
                <Box className="hero-actions">
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleGetStarted}
                    className="btn-gradient hero-button"
                    endIcon={<ArrowIcon />}
                  >
                    {user ? 'Go to Dashboard' : 'Get Started Free'}
                  </Button>
                  
                  {!user && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleLogin}
                      className="hero-button"
                    >
                      Sign In
                    </Button>
                  )}
                </Box>
              </motion.div>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="hero-image"
              >
                <Box className="hero-illustration">
                  {/* Placeholder for hero illustration */}
                  <Box className="illustration-placeholder">
                    <AIIcon className="illustration-icon" />
                    <Typography variant="h6" className="illustration-text">
                      AI Skincare Analysis
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box className="features-section">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              className="section-title"
              align="center"
              gutterBottom
            >
              Powerful Features for Your Skin
            </Typography>
            
            <Typography 
              variant="h6" 
              className="section-subtitle"
              align="center"
              gutterBottom
            >
              Everything you need to understand, improve, and maintain healthy skin
            </Typography>
          </motion.div>

          <Grid container spacing={4} className="features-grid">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="feature-card card-hover">
                    <CardContent className="feature-content">
                      <Box 
                        className="feature-icon"
                        sx={{ color: feature.color }}
                      >
                        {feature.icon}
                      </Box>
                      
                      <Typography 
                        variant="h6" 
                        className="feature-title"
                        gutterBottom
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography 
                        variant="body2" 
                        className="feature-description"
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box className="testimonials-section">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Typography 
              variant="h2" 
              className="section-title"
              align="center"
              gutterBottom
            >
              What Our Users Say
            </Typography>
          </motion.div>

          <Grid container spacing={4} className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="testimonial-card card-hover">
                    <CardContent className="testimonial-content">
                      <Box className="testimonial-rating">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <StarIcon key={i} className="star-icon" />
                        ))}
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        className="testimonial-comment"
                        gutterBottom
                      >
                        "{testimonial.comment}"
                      </Typography>
                      
                      <Typography 
                        variant="subtitle2" 
                        className="testimonial-name"
                      >
                        - {testimonial.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box className="cta-section">
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="cta-content"
          >
            <Typography 
              variant="h3" 
              className="cta-title"
              align="center"
              gutterBottom
            >
              Ready to Transform Your Skin?
            </Typography>
            
            <Typography 
              variant="h6" 
              className="cta-subtitle"
              align="center"
              gutterBottom
            >
              Join thousands of users who have already discovered their perfect skincare routine
            </Typography>
            
            <Box className="cta-actions">
              <Button
                variant="contained"
                size="large"
                onClick={handleGetStarted}
                className="btn-gradient cta-button"
                endIcon={<ArrowIcon />}
              >
                {user ? 'Continue Your Journey' : 'Start Your Journey'}
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

export default Home
