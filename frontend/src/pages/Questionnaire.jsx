import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  TextField,
  Button,
  Box,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Slider,
  Chip,
  Alert,
  CircularProgress
} from '@mui/material';
import { NavigateNext, NavigateBefore, Save } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { aiAPI } from '../services/api';
import './Questionnaire.css';

const QUESTIONNAIRE_STEPS = [
  'Basic Information',
  'Skin Analysis',
  'Current Routine',
  'Goals & Concerns',
  'Lifestyle Factors'
];

const SKIN_TYPES = [
  { value: 'normal', label: 'Normal' },
  { value: 'dry', label: 'Dry' },
  { value: 'oily', label: 'Oily' },
  { value: 'combination', label: 'Combination' },
  { value: 'sensitive', label: 'Sensitive' }
];

const SKIN_CONCERNS = [
  { value: 'acne', label: 'Acne & Breakouts' },
  { value: 'aging', label: 'Anti-aging & Fine Lines' },
  { value: 'dark_spots', label: 'Dark Spots & Hyperpigmentation' },
  { value: 'dryness', label: 'Dryness & Dehydration' },
  { value: 'sensitivity', label: 'Sensitivity & Redness' },
  { value: 'pores', label: 'Large Pores' },
  { value: 'dullness', label: 'Dullness & Uneven Texture' },
  { value: 'dark_circles', label: 'Dark Circles' },
  { value: 'sun_damage', label: 'Sun Damage' },
  { value: 'rosacea', label: 'Rosacea' }
];

const PRODUCTS_USED = [
  { value: 'cleanser', label: 'Cleanser' },
  { value: 'toner', label: 'Toner/Essence' },
  { value: 'serum', label: 'Serum/Treatment' },
  { value: 'moisturizer', label: 'Moisturizer' },
  { value: 'sunscreen', label: 'Sunscreen' },
  { value: 'exfoliant', label: 'Exfoliant (BHA/AHA)' },
  { value: 'retinoid', label: 'Retinoid/Retinol' },
  { value: 'mask', label: 'Face Mask' },
  { value: 'eye_cream', label: 'Eye Cream' },
  { value: 'oil', label: 'Face Oil' }
];

const Questionnaire = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Basic Information
    age: 25,
    gender: '',
    skinType: '',
    
    // Skin Analysis
    skinConcerns: [],
    severityLevel: 3,
    skinSensitivity: '',
    allergies: '',
    
    // Current Routine
    currentProducts: [],
    routineFrequency: '',
    productSatisfaction: 3,
    budget: '',
    
    // Goals & Concerns
    primaryGoal: '',
    timelineExpectation: '',
    previousTreatments: '',
    
    // Lifestyle Factors
    sleepHours: 7,
    stressLevel: 3,
    exercise: '',
    diet: '',
    waterIntake: 6,
    climate: '',
    indoorOutdoor: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const handleNext = () => {
    setActiveStep(prev => Math.min(prev + 1, QUESTIONNAIRE_STEPS.length - 1));
  };

  const handleBack = () => {
    setActiveStep(prev => Math.max(prev - 1, 0));
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.age && formData.gender && formData.skinType;
      case 1:
        return formData.skinConcerns.length > 0 && formData.skinSensitivity;
      case 2:
        return formData.currentProducts.length > 0 && formData.routineFrequency && formData.budget;
      case 3:
        return formData.primaryGoal && formData.timelineExpectation;
      case 4:
        return formData.exercise && formData.diet && formData.climate;
      default:
        return true;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Send questionnaire data to AI for analysis
      const response = await aiAPI.generateRoutine(formData);
      
      if (response.data.success) {
        // Store the analysis and recommendations
        localStorage.setItem('skinAnalysis', JSON.stringify(response.data.data));
        navigate('/recommendations');
      } else {
        throw new Error(response.data.message || 'Failed to analyze your skin profile');
      }
    } catch (error) {
      setError(error.response?.data?.message || error.message || 'Failed to process questionnaire');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>Tell us about yourself</Typography>
            
            <Box className="form-group">
              <Typography gutterBottom>Age: {formData.age}</Typography>
              <Slider
                value={formData.age}
                onChange={(e, value) => handleInputChange('age', value)}
                min={13}
                max={80}
                marks={[
                  { value: 13, label: '13' },
                  { value: 25, label: '25' },
                  { value: 40, label: '40' },
                  { value: 60, label: '60' },
                  { value: 80, label: '80+' }
                ]}
                className="age-slider"
              />
            </Box>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                row
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
                <FormControlLabel value="prefer_not_to_say" control={<Radio />} label="Prefer not to say" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">What's your skin type?</FormLabel>
              <RadioGroup
                value={formData.skinType}
                onChange={(e) => handleInputChange('skinType', e.target.value)}
              >
                {SKIN_TYPES.map((type) => (
                  <FormControlLabel
                    key={type.value}
                    value={type.value}
                    control={<Radio />}
                    label={type.label}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 1:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>Skin Analysis</Typography>
            
            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">What are your main skin concerns? (Select all that apply)</FormLabel>
              <FormGroup>
                {SKIN_CONCERNS.map((concern) => (
                  <FormControlLabel
                    key={concern.value}
                    control={
                      <Checkbox
                        checked={formData.skinConcerns.includes(concern.value)}
                        onChange={(e) => handleArrayChange('skinConcerns', concern.value, e.target.checked)}
                      />
                    }
                    label={concern.label}
                  />
                ))}
              </FormGroup>
            </FormControl>

            <Box className="form-group">
              <Typography gutterBottom>How severe would you rate your main concern? (1-5)</Typography>
              <Slider
                value={formData.severityLevel}
                onChange={(e, value) => handleInputChange('severityLevel', value)}
                min={1}
                max={5}
                marks={[
                  { value: 1, label: 'Mild' },
                  { value: 3, label: 'Moderate' },
                  { value: 5, label: 'Severe' }
                ]}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">How sensitive is your skin?</FormLabel>
              <RadioGroup
                value={formData.skinSensitivity}
                onChange={(e) => handleInputChange('skinSensitivity', e.target.value)}
              >
                <FormControlLabel value="not_sensitive" control={<Radio />} label="Not sensitive" />
                <FormControlLabel value="slightly" control={<Radio />} label="Slightly sensitive" />
                <FormControlLabel value="moderately" control={<Radio />} label="Moderately sensitive" />
                <FormControlLabel value="very" control={<Radio />} label="Very sensitive" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Known allergies or ingredients to avoid"
              multiline
              rows={3}
              value={formData.allergies}
              onChange={(e) => handleInputChange('allergies', e.target.value)}
              placeholder="e.g., fragrances, sulfates, parabens..."
              className="form-group"
            />
          </Box>
        );

      case 2:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>Current Skincare Routine</Typography>
            
            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">What products do you currently use? (Select all that apply)</FormLabel>
              <FormGroup>
                {PRODUCTS_USED.map((product) => (
                  <FormControlLabel
                    key={product.value}
                    control={
                      <Checkbox
                        checked={formData.currentProducts.includes(product.value)}
                        onChange={(e) => handleArrayChange('currentProducts', product.value, e.target.checked)}
                      />
                    }
                    label={product.label}
                  />
                ))}
              </FormGroup>
            </FormControl>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">How often do you follow a skincare routine?</FormLabel>
              <RadioGroup
                value={formData.routineFrequency}
                onChange={(e) => handleInputChange('routineFrequency', e.target.value)}
              >
                <FormControlLabel value="twice_daily" control={<Radio />} label="Twice daily (morning & evening)" />
                <FormControlLabel value="daily" control={<Radio />} label="Once daily" />
                <FormControlLabel value="few_times_week" control={<Radio />} label="A few times a week" />
                <FormControlLabel value="rarely" control={<Radio />} label="Rarely" />
                <FormControlLabel value="never" control={<Radio />} label="Never" />
              </RadioGroup>
            </FormControl>

            <Box className="form-group">
              <Typography gutterBottom>How satisfied are you with your current routine? (1-5)</Typography>
              <Slider
                value={formData.productSatisfaction}
                onChange={(e, value) => handleInputChange('productSatisfaction', value)}
                min={1}
                max={5}
                marks={[
                  { value: 1, label: 'Not satisfied' },
                  { value: 3, label: 'Neutral' },
                  { value: 5, label: 'Very satisfied' }
                ]}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">What's your monthly skincare budget?</FormLabel>
              <RadioGroup
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
              >
                <FormControlLabel value="under_50" control={<Radio />} label="Under $50" />
                <FormControlLabel value="50_100" control={<Radio />} label="$50 - $100" />
                <FormControlLabel value="100_200" control={<Radio />} label="$100 - $200" />
                <FormControlLabel value="200_plus" control={<Radio />} label="$200+" />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      case 3:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>Goals & Expectations</Typography>
            
            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">What's your primary skincare goal?</FormLabel>
              <RadioGroup
                value={formData.primaryGoal}
                onChange={(e) => handleInputChange('primaryGoal', e.target.value)}
              >
                <FormControlLabel value="prevent_aging" control={<Radio />} label="Prevent signs of aging" />
                <FormControlLabel value="treat_acne" control={<Radio />} label="Treat acne and breakouts" />
                <FormControlLabel value="even_skin_tone" control={<Radio />} label="Even skin tone and reduce dark spots" />
                <FormControlLabel value="hydrate_skin" control={<Radio />} label="Hydrate and moisturize skin" />
                <FormControlLabel value="reduce_sensitivity" control={<Radio />} label="Reduce skin sensitivity" />
                <FormControlLabel value="general_health" control={<Radio />} label="General skin health maintenance" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">When do you expect to see results?</FormLabel>
              <RadioGroup
                value={formData.timelineExpectation}
                onChange={(e) => handleInputChange('timelineExpectation', e.target.value)}
              >
                <FormControlLabel value="2_weeks" control={<Radio />} label="Within 2 weeks" />
                <FormControlLabel value="1_month" control={<Radio />} label="Within 1 month" />
                <FormControlLabel value="3_months" control={<Radio />} label="Within 3 months" />
                <FormControlLabel value="6_months" control={<Radio />} label="Within 6 months" />
                <FormControlLabel value="no_rush" control={<Radio />} label="I'm not in a rush" />
              </RadioGroup>
            </FormControl>

            <TextField
              fullWidth
              label="Have you tried any professional treatments or procedures?"
              multiline
              rows={3}
              value={formData.previousTreatments}
              onChange={(e) => handleInputChange('previousTreatments', e.target.value)}
              placeholder="e.g., chemical peels, microdermabrasion, laser treatments..."
              className="form-group"
            />
          </Box>
        );

      case 4:
        return (
          <Box className="step-content">
            <Typography variant="h6" gutterBottom>Lifestyle Factors</Typography>
            
            <Box className="form-group">
              <Typography gutterBottom>How many hours do you sleep per night? {formData.sleepHours} hours</Typography>
              <Slider
                value={formData.sleepHours}
                onChange={(e, value) => handleInputChange('sleepHours', value)}
                min={4}
                max={12}
                marks={[
                  { value: 4, label: '4h' },
                  { value: 6, label: '6h' },
                  { value: 8, label: '8h' },
                  { value: 10, label: '10h' },
                  { value: 12, label: '12h' }
                ]}
                step={0.5}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box className="form-group">
              <Typography gutterBottom>Stress level (1-5)</Typography>
              <Slider
                value={formData.stressLevel}
                onChange={(e, value) => handleInputChange('stressLevel', value)}
                min={1}
                max={5}
                marks={[
                  { value: 1, label: 'Low' },
                  { value: 3, label: 'Moderate' },
                  { value: 5, label: 'High' }
                ]}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">How often do you exercise?</FormLabel>
              <RadioGroup
                value={formData.exercise}
                onChange={(e) => handleInputChange('exercise', e.target.value)}
              >
                <FormControlLabel value="daily" control={<Radio />} label="Daily" />
                <FormControlLabel value="few_times_week" control={<Radio />} label="3-4 times a week" />
                <FormControlLabel value="weekly" control={<Radio />} label="1-2 times a week" />
                <FormControlLabel value="rarely" control={<Radio />} label="Rarely" />
                <FormControlLabel value="never" control={<Radio />} label="Never" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">How would you describe your diet?</FormLabel>
              <RadioGroup
                value={formData.diet}
                onChange={(e) => handleInputChange('diet', e.target.value)}
              >
                <FormControlLabel value="very_healthy" control={<Radio />} label="Very healthy (lots of fruits, vegetables, minimal processed food)" />
                <FormControlLabel value="moderately_healthy" control={<Radio />} label="Moderately healthy" />
                <FormControlLabel value="average" control={<Radio />} label="Average" />
                <FormControlLabel value="poor" control={<Radio />} label="Could be better (lots of processed food, sugar)" />
              </RadioGroup>
            </FormControl>

            <Box className="form-group">
              <Typography gutterBottom>How many glasses of water do you drink daily? {formData.waterIntake} glasses</Typography>
              <Slider
                value={formData.waterIntake}
                onChange={(e, value) => handleInputChange('waterIntake', value)}
                min={1}
                max={15}
                marks={[
                  { value: 2, label: '2' },
                  { value: 6, label: '6' },
                  { value: 8, label: '8' },
                  { value: 12, label: '12+' }
                ]}
                step={1}
                valueLabelDisplay="auto"
              />
            </Box>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">What's your climate like?</FormLabel>
              <RadioGroup
                value={formData.climate}
                onChange={(e) => handleInputChange('climate', e.target.value)}
              >
                <FormControlLabel value="humid" control={<Radio />} label="Humid" />
                <FormControlLabel value="dry" control={<Radio />} label="Dry" />
                <FormControlLabel value="temperate" control={<Radio />} label="Temperate" />
                <FormControlLabel value="cold" control={<Radio />} label="Cold" />
                <FormControlLabel value="tropical" control={<Radio />} label="Tropical" />
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" className="form-group">
              <FormLabel component="legend">Do you spend more time indoors or outdoors?</FormLabel>
              <RadioGroup
                value={formData.indoorOutdoor}
                onChange={(e) => handleInputChange('indoorOutdoor', e.target.value)}
              >
                <FormControlLabel value="mostly_indoor" control={<Radio />} label="Mostly indoors" />
                <FormControlLabel value="balanced" control={<Radio />} label="Balanced" />
                <FormControlLabel value="mostly_outdoor" control={<Radio />} label="Mostly outdoors" />
              </RadioGroup>
            </FormControl>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <div className="questionnaire-container">
      <Container maxWidth="md">
        <Paper elevation={3} className="questionnaire-paper">
          <Box className="questionnaire-header">
            <Typography variant="h4" component="h1" className="questionnaire-title">
              Skin Analysis Questionnaire
            </Typography>
            <Typography variant="body1" className="questionnaire-subtitle">
              Help us understand your skin better to provide personalized recommendations
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} alternativeLabel className="questionnaire-stepper">
            {QUESTIONNAIRE_STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" className="questionnaire-error">
              {error}
            </Alert>
          )}

          <Card className="step-card">
            <CardContent>
              {renderStepContent(activeStep)}
            </CardContent>
          </Card>

          <Box className="questionnaire-actions">
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<NavigateBefore />}
            >
              Back
            </Button>

            <Box className="step-info">
              Step {activeStep + 1} of {QUESTIONNAIRE_STEPS.length}
            </Box>

            {activeStep === QUESTIONNAIRE_STEPS.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={!validateStep(activeStep) || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Save />}
              >
                {loading ? 'Analyzing...' : 'Get My Recommendations'}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!validateStep(activeStep)}
                endIcon={<NavigateNext />}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default Questionnaire;
