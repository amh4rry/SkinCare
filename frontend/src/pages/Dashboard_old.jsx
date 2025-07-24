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
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { isDark } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [aiInsights, setAiInsights] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRoutine, setSelectedRoutine] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch AI-powered insights
      const [insightsResponse] = await Promise.all([
        aiAPI.getDashboardStats(),
        // You can add more API calls here for user stats, routines, etc.
      ]);
      
      if (insightsResponse.data.success) {
        setAiInsights(insightsResponse.data.data);
      }
      
      // Set basic dashboard data (you can replace this with real user data)
      setDashboardData({
        skinScore: 78,
        routineStreak: 12,
        totalProducts: 8,
        completedRoutines: 24,
        recentActivities: [
          { id: 1, type: 'routine', message: 'Completed morning routine', time: '2 hours ago' },
          { id: 2, type: 'product', message: 'Added new moisturizer to routine', time: '1 day ago' },
          { id: 3, type: 'ai', message: 'Received AI skin analysis', time: '2 days ago' },
          { id: 4, type: 'review', message: 'Reviewed Vitamin C serum', time: '3 days ago' }
        ],
        upcomingTasks: [
          { id: 1, task: 'Apply sunscreen', time: '10:00 AM', priority: 'high' },
          { id: 2, task: 'Evening skincare routine', time: '9:00 PM', priority: 'medium' },
          { id: 3, task: 'Weekly face mask', time: 'Tomorrow', priority: 'low' }
        ],
        progressData: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
          datasets: [
            {
              label: 'Skin Health Score',
              data: [65, 68, 72, 75, 76, 78],
              borderColor: '#667eea',
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              tension: 0.4,
              fill: true
            }
          ]
        },
        currentRoutines: [
          {
            id: 1,
            name: 'Morning Routine',
            completion: 85,
            nextStep: 'Apply moisturizer',
            products: 5
          },
          {
            id: 2,
            name: 'Evening Routine',
            completion: 60,
            nextStep: 'Remove makeup',
            products: 7
          }
        ]
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (event, routine) => {
    setAnchorEl(event.currentTarget);
    setSelectedRoutine(routine);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRoutine(null);
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'routine':
        return <CheckCircle color="success" />;
      case 'product':
        return <Add color="primary" />;
      case 'ai':
        return <TrendingUp color="info" />;
      case 'review':
        return <Star color="warning" />;
      default:
        return <Info color="action" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'info';
      default:
        return 'default';
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        min: 60,
        max: 100,
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      },
      x: {
        grid: {
          color: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'
        }
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="dashboard-container">
      <Container maxWidth="xl">
        {/* Welcome Section */}
        <Box className="dashboard-header">
          <Box className="welcome-section">
            <Avatar
              src={user?.profilePicture}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="user-avatar"
            >
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h4" className="welcome-title">
                Welcome back, {user?.firstName}!
              </Typography>
              <Typography variant="body1" className="welcome-subtitle">
                Ready to continue your skincare journey?
              </Typography>
            </Box>
          </Box>
          <Box className="quick-actions">
            <Button
              variant="contained"
              startIcon={<PhotoCamera />}
              className="action-button"
            >
              Analyze Skin
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              className="action-button"
            >
              Add Product
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} className="stats-section">
          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Box className="stat-content">
                  <Box>
                    <Typography variant="h4" className="stat-number">
                      {dashboardData.skinScore}
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      Skin Health Score
                    </Typography>
                  </Box>
                  <TrendingUp className="stat-icon trending" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Box className="stat-content">
                  <Box>
                    <Typography variant="h4" className="stat-number">
                      {dashboardData.routineStreak}
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      Day Streak
                    </Typography>
                  </Box>
                  <Schedule className="stat-icon schedule" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Box className="stat-content">
                  <Box>
                    <Typography variant="h4" className="stat-number">
                      {dashboardData.totalProducts}
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      Products in Use
                    </Typography>
                  </Box>
                  <Star className="stat-icon products" />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card className="stat-card">
              <CardContent>
                <Box className="stat-content">
                  <Box>
                    <Typography variant="h4" className="stat-number">
                      {dashboardData.completedRoutines}
                    </Typography>
                    <Typography variant="body2" className="stat-label">
                      Routines Completed
                    </Typography>
                  </Box>
                  <CheckCircle className="stat-icon completed" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* AI Insights Section */}
        {aiInsights && (
          <Grid container spacing={3} className="content-section">
            <Grid item xs={12}>
              <Paper className="dashboard-card">
                <Box className="card-header">
                  <Typography variant="h6" className="card-title">
                    AI-Powered Insights
                  </Typography>
                  <Typography variant="body2" className="card-subtitle">
                    Personalized recommendations just for you
                  </Typography>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          💡 Today's Tip
                        </Typography>
                        <Typography variant="body1">
                          {aiInsights.tipOfTheDay}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)', color: 'white' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🌱 Weekly Goal
                        </Typography>
                        <Typography variant="body1">
                          {aiInsights.weeklyGoal}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🧴 Ingredient Spotlight: {aiInsights.ingredientSpotlight?.ingredient}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {aiInsights.ingredientSpotlight?.benefits}
                        </Typography>
                        <Typography variant="caption">
                          Usage: {aiInsights.ingredientSpotlight?.usage}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #e91e63 0%, #c2185b 100%)', color: 'white' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🎯 Motivation
                        </Typography>
                        <Typography variant="body1">
                          {aiInsights.progressMotivation}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Main Content */}
        <Grid container spacing={3} className="content-section">
          {/* Progress Chart */}
          <Grid item xs={12} md={8}>
            <Paper className="dashboard-card">
              <Box className="card-header">
                <Typography variant="h6" className="card-title">
                  Skin Health Progress
                </Typography>
                <Typography variant="body2" className="card-subtitle">
                  Your progress over the last 6 weeks
                </Typography>
              </Box>
              <Box className="chart-container">
                <Line data={dashboardData.progressData} options={chartOptions} />
              </Box>
            </Paper>
          </Grid>

          {/* Current Routines */}
          <Grid item xs={12} md={4}>
            <Paper className="dashboard-card">
              <Box className="card-header">
                <Typography variant="h6" className="card-title">
                  Active Routines
                </Typography>
              </Box>
              <Box className="routines-list">
                {dashboardData.currentRoutines.map((routine) => (
                  <Box key={routine.id} className="routine-item">
                    <Box className="routine-info">
                      <Typography variant="subtitle2" className="routine-name">
                        {routine.name}
                      </Typography>
                      <Typography variant="caption" className="routine-next">
                        Next: {routine.nextStep}
                      </Typography>
                      <Box className="routine-progress">
                        <LinearProgress
                          variant="determinate"
                          value={routine.completion}
                          className="progress-bar"
                        />
                        <Typography variant="caption" className="progress-text">
                          {routine.completion}%
                        </Typography>
                      </Box>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, routine)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Recent Activities */}
          <Grid item xs={12} md={6}>
            <Paper className="dashboard-card">
              <Box className="card-header">
                <Typography variant="h6" className="card-title">
                  Recent Activities
                </Typography>
              </Box>
              <Box className="activities-list">
                {dashboardData.recentActivities.map((activity) => (
                  <Box key={activity.id} className="activity-item">
                    <Box className="activity-icon">
                      {getActivityIcon(activity.type)}
                    </Box>
                    <Box className="activity-content">
                      <Typography variant="body2" className="activity-message">
                        {activity.message}
                      </Typography>
                      <Typography variant="caption" className="activity-time">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>

          {/* Upcoming Tasks */}
          <Grid item xs={12} md={6}>
            <Paper className="dashboard-card">
              <Box className="card-header">
                <Typography variant="h6" className="card-title">
                  Upcoming Tasks
                </Typography>
              </Box>
              <Box className="tasks-list">
                {dashboardData.upcomingTasks.map((task) => (
                  <Box key={task.id} className="task-item">
                    <Box className="task-info">
                      <Typography variant="body2" className="task-name">
                        {task.task}
                      </Typography>
                      <Typography variant="caption" className="task-time">
                        {task.time}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      className="priority-chip"
                    />
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Menu for routine actions */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>View Details</MenuItem>
          <MenuItem onClick={handleMenuClose}>Edit Routine</MenuItem>
          <MenuItem onClick={handleMenuClose}>Mark as Complete</MenuItem>
        </Menu>
      </Container>
    </div>
  );
};

export default Dashboard;
