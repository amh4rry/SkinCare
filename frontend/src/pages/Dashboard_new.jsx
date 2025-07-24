import React, { useState, useContext } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Avatar,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  Schedule,
  Star,
  PhotoCamera,
  CheckCircle,
  Assignment,
  Insights,
  LocalHospital
} from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const quickActions = [
    {
      title: 'Take Questionnaire',
      description: 'Get personalized skincare recommendations',
      icon: <Assignment />,
      color: '#4CAF50',
      action: () => navigate('/questionnaire')
    },
    {
      title: 'View Recommendations',
      description: 'See your AI-generated skincare routine',
      icon: <Insights />,
      color: '#2196F3',
      action: () => navigate('/recommendations')
    },
    {
      title: 'Track Progress',
      description: 'Monitor your skincare journey',
      icon: <TrendingUp />,
      color: '#FF9800',
      action: () => console.log('Progress tracking - Coming soon!')
    },
    {
      title: 'Upload Photo',
      description: 'Document your skin progress',
      icon: <PhotoCamera />,
      color: '#9C27B0',
      action: () => console.log('Photo upload - Coming soon!')
    }
  ];

  const recentActivities = [
    {
      title: 'Welcome to SkinCare AI!',
      description: 'Start your personalized skincare journey today',
      time: 'Just now',
      icon: <LocalHospital />,
      color: '#4CAF50'
    }
  ];

  return (
    <Container maxWidth="xl" className="dashboard-container">
      <Box sx={{ py: 3 }}>
        {/* Welcome Section */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar 
                  sx={{ width: 60, height: 60, bgcolor: 'rgba(255,255,255,0.2)' }}
                >
                  {user?.firstName?.charAt(0) || 'U'}
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {getGreeting()}, {user?.firstName || 'User'}!
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    Ready to enhance your skincare routine?
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Quick Actions */}
          <Grid item xs={12}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 3
                      }
                    }}
                    onClick={action.action}
                  >
                    <CardContent sx={{ textAlign: 'center', p: 3 }}>
                      <Box
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: '50%',
                          bgcolor: action.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 2,
                          color: 'white'
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {action.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Stats Overview */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Your Skincare Journey
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="primary" fontWeight="bold">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Days Active
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Routines Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="warning.main" fontWeight="bold">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Photos Uploaded
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={3}>
                  <Box textAlign="center">
                    <Typography variant="h3" color="info.main" fontWeight="bold">
                      0
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Goals Achieved
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              
              <Box mt={3} p={2} bgcolor="grey.50" borderRadius={2}>
                <Typography variant="body2" color="text.secondary" textAlign="center">
                  Start your skincare journey by taking our personalized questionnaire!
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activity */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, height: 'fit-content' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Recent Activity
              </Typography>
              {recentActivities.map((activity, index) => (
                <Box key={index} display="flex" alignItems="center" gap={2} py={1}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: activity.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}
                  >
                    {activity.icon}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {activity.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {activity.description}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      {activity.time}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Getting Started */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3, bgcolor: 'primary.50' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Getting Started
              </Typography>
              <Typography variant="body1" paragraph>
                Welcome to your personalized skincare dashboard! Here's how to make the most of our AI-powered platform:
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CheckCircle color="success" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      1. Take the Questionnaire
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Answer questions about your skin type, concerns, and lifestyle for personalized recommendations.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Schedule color="primary" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      2. Get Your Routine
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Receive AI-generated morning and evening skincare routines tailored just for you.
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Star color="warning" />
                    <Typography variant="subtitle2" fontWeight="bold">
                      3. Track Progress
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Monitor your skin's improvement and adjust your routine as needed.
                  </Typography>
                </Grid>
              </Grid>
              <Box mt={3}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={() => navigate('/questionnaire')}
                  sx={{ mr: 2 }}
                >
                  Start Questionnaire
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  onClick={() => navigate('/recommendations')}
                >
                  View Sample Routine
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
