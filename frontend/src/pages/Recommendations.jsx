import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert
} from '@mui/material';
import {
  Star,
  Schedule,
  LocalHospital,
  TrendingUp,
  CheckCircle,
  Warning,
  Info,
  Lightbulb
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './Recommendations.css';

const Recommendations = () => {
  const navigate = useNavigate();
  const [analysisData, setAnalysisData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    // Get analysis data from localStorage
    const storedAnalysis = localStorage.getItem('skinAnalysis');
    if (storedAnalysis) {
      try {
        setAnalysisData(JSON.parse(storedAnalysis));
      } catch (error) {
        console.error('Error parsing analysis data:', error);
      }
    } else {
      // Redirect to questionnaire if no data
      navigate('/questionnaire');
    }
  }, [navigate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSaveRoutine = () => {
    // Save routine to user profile and navigate to dashboard
    navigate('/dashboard');
  };

  if (!analysisData) {
    return (
      <Container maxWidth="md" className="recommendations-container">
        <Alert severity="info">
          Loading your personalized recommendations...
        </Alert>
      </Container>
    );
  }

  const steps = [
    {
      label: 'Skin Analysis',
      content: analysisData.skinAnalysis
    },
    {
      label: 'Morning Routine',
      content: analysisData.morningRoutine
    },
    {
      label: 'Evening Routine',
      content: analysisData.eveningRoutine
    },
    {
      label: 'Timeline & Tips',
      content: analysisData.timeline
    }
  ];

  return (
    <div className="recommendations-container">
      <Container maxWidth="lg">
        <Paper elevation={3} className="recommendations-paper">
          <Box className="recommendations-header">
            <Typography variant="h4" component="h1" className="recommendations-title">
              Your Personalized Skincare Plan
            </Typography>
            <Typography variant="body1" className="recommendations-subtitle">
              AI-powered recommendations based on your skin analysis
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Skin Analysis Summary */}
            <Grid item xs={12}>
              <Card className="analysis-summary">
                <CardContent>
                  <Typography variant="h6" gutterBottom className="summary-title">
                    <Lightbulb className="summary-icon" />
                    Skin Analysis Summary
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {analysisData.skinAnalysis?.summary}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Box className="summary-section">
                        <Typography variant="subtitle2" className="section-title">
                          <CheckCircle color="success" /> Strengths
                        </Typography>
                        <List dense>
                          {analysisData.skinAnalysis?.strengths?.map((strength, index) => (
                            <ListItem key={index} className="summary-item">
                              <ListItemText primary={strength} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box className="summary-section">
                        <Typography variant="subtitle2" className="section-title">
                          <Warning color="warning" /> Areas to Address
                        </Typography>
                        <List dense>
                          {analysisData.skinAnalysis?.concerns?.map((concern, index) => (
                            <ListItem key={index} className="summary-item">
                              <ListItemText primary={concern} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box className="summary-section">
                        <Typography variant="subtitle2" className="section-title">
                          <TrendingUp color="primary" /> Key Recommendations
                        </Typography>
                        <List dense>
                          {analysisData.skinAnalysis?.recommendations?.map((rec, index) => (
                            <ListItem key={index} className="summary-item">
                              <ListItemText primary={rec} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Morning Routine */}
            <Grid item xs={12} md={6}>
              <Card className="routine-card morning-routine">
                <CardContent>
                  <Typography variant="h6" gutterBottom className="routine-title">
                    ☀️ Morning Routine
                  </Typography>
                  <List>
                    {analysisData.morningRoutine?.map((step, index) => (
                      <React.Fragment key={index}>
                        <ListItem className="routine-step">
                          <ListItemIcon>
                            <Chip 
                              label={step.step} 
                              size="small" 
                              className="step-number"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={step.product}
                            secondary={
                              <Box>
                                <Typography variant="body2" className="step-instructions">
                                  {step.instructions}
                                </Typography>
                                <Typography variant="caption" className="step-importance">
                                  Why: {step.importance}
                                </Typography>
                                {step.ingredients && (
                                  <Box className="ingredients">
                                    {step.ingredients.map((ingredient, idx) => (
                                      <Chip 
                                        key={idx} 
                                        label={ingredient} 
                                        size="small" 
                                        variant="outlined"
                                        className="ingredient-chip"
                                      />
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < analysisData.morningRoutine.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Evening Routine */}
            <Grid item xs={12} md={6}>
              <Card className="routine-card evening-routine">
                <CardContent>
                  <Typography variant="h6" gutterBottom className="routine-title">
                    🌙 Evening Routine
                  </Typography>
                  <List>
                    {analysisData.eveningRoutine?.map((step, index) => (
                      <React.Fragment key={index}>
                        <ListItem className="routine-step">
                          <ListItemIcon>
                            <Chip 
                              label={step.step} 
                              size="small" 
                              className="step-number"
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={step.product}
                            secondary={
                              <Box>
                                <Typography variant="body2" className="step-instructions">
                                  {step.instructions}
                                </Typography>
                                <Typography variant="caption" className="step-importance">
                                  Why: {step.importance}
                                </Typography>
                                {step.ingredients && (
                                  <Box className="ingredients">
                                    {step.ingredients.map((ingredient, idx) => (
                                      <Chip 
                                        key={idx} 
                                        label={ingredient} 
                                        size="small" 
                                        variant="outlined"
                                        className="ingredient-chip"
                                      />
                                    ))}
                                  </Box>
                                )}
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < analysisData.eveningRoutine.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            {/* Weekly Treatments */}
            {analysisData.weeklyTreatments && analysisData.weeklyTreatments.length > 0 && (
              <Grid item xs={12}>
                <Card className="treatments-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="treatments-title">
                      🧴 Weekly Treatments
                    </Typography>
                    <Grid container spacing={2}>
                      {analysisData.weeklyTreatments.map((treatment, index) => (
                        <Grid item xs={12} md={4} key={index}>
                          <Card className="treatment-item">
                            <CardContent>
                              <Typography variant="subtitle1" className="treatment-name">
                                {treatment.treatment}
                              </Typography>
                              <Typography variant="body2" className="treatment-frequency">
                                Frequency: {treatment.frequency}
                              </Typography>
                              <Typography variant="body2" className="treatment-instructions">
                                {treatment.instructions}
                              </Typography>
                              <Typography variant="caption" className="treatment-benefits">
                                Benefits: {treatment.benefits}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {/* Timeline */}
            {analysisData.timeline && (
              <Grid item xs={12}>
                <Card className="timeline-card">
                  <CardContent>
                    <Typography variant="h6" gutterBottom className="timeline-title">
                      📅 What to Expect
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Box className="timeline-item">
                          <Typography variant="subtitle2" className="timeline-period">
                            2 Weeks
                          </Typography>
                          <Typography variant="body2">
                            {analysisData.timeline['2weeks']}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box className="timeline-item">
                          <Typography variant="subtitle2" className="timeline-period">
                            1 Month
                          </Typography>
                          <Typography variant="body2">
                            {analysisData.timeline['1month']}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Box className="timeline-item">
                          <Typography variant="subtitle2" className="timeline-period">
                            3 Months
                          </Typography>
                          <Typography variant="body2">
                            {analysisData.timeline['3months']}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}
          </Grid>

          <Box className="recommendations-actions">
            <Button
              variant="outlined"
              onClick={() => navigate('/questionnaire')}
            >
              Retake Questionnaire
            </Button>
            <Button
              variant="contained"
              onClick={handleSaveRoutine}
              className="save-button"
            >
              Save My Routine
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Recommendations;
