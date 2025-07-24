const express = require('express');
const googleAI = require('../services/googleAI');
const { auth } = require('../middleware/auth');
const Product = require('../models/Product');
const User = require('../models/User');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

// Helper function to retry AI requests with exponential backoff
const retryAIRequest = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Check if it's a rate limit error
      if (error.message && (error.message.includes('429') || error.message.includes('quota'))) {
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`AI request failed (attempt ${attempt}), retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error; // Don't retry non-rate-limit errors
      }
    }
  }
};

/**
 * @route   POST /api/ai/recommendations
 * @desc    Get AI-powered skincare recommendations
 * @access  Private
 */
router.post('/recommendations', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { includeProducts = true, maxProducts = 10 } = req.body;

    // Get user's complete profile
    const user = await User.findById(userId);
    if (!user.skinProfile || !user.skinProfile.skinType) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your skin profile first to get personalized recommendations.'
      });
    }

    let availableProducts = [];
    if (includeProducts) {
      // Get products that match user's skin type and concerns
      const productQuery = {
        isAvailable: true,
        $or: [
          { skinTypes: { $in: [user.skinProfile.skinType, 'all'] } },
          { skinConcerns: { $in: user.skinProfile.skinConcerns || [] } }
        ]
      };

      availableProducts = await Product.find(productQuery)
        .limit(maxProducts)
        .sort({ 'ratings.average': -1 });
    }

    // Get AI recommendations
    const recommendations = await googleAI.generateSkincareRecommendations(
      user.toObject(),
      availableProducts
    );

    // Calculate compatibility scores for recommended products
    if (availableProducts.length > 0) {
      recommendations.productMatches = availableProducts.map(product => ({
        product: product.toObject(),
        compatibilityScore: product.calculateCompatibilityScore(user.skinProfile),
        aiRecommended: recommendations.recommendations.some(rec => 
          rec.suggestedProducts && rec.suggestedProducts.includes(product.name)
        )
      })).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    }

    res.json({
      success: true,
      message: 'AI recommendations generated successfully',
      data: {
        recommendations,
        userProfile: {
          skinType: user.skinProfile.skinType,
          skinConcerns: user.skinProfile.skinConcerns,
          skinGoals: user.skinProfile.skinGoals
        },
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('AI recommendations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI recommendations'
    });
  }
});

/**
 * @route   POST /api/ai/analyze-photo
 * @desc    Analyze progress photos with AI
 * @access  Private
 */
router.post('/analyze-photo', auth, async (req, res) => {
  try {
    const { imageData, notes } = req.body;

    if (!imageData) {
      return res.status(400).json({
        success: false,
        message: 'Image data is required for analysis'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Analyze photo with AI
    const analysis = await googleAI.analyzeProgressPhotos(imageData, user.toObject());

    // Save progress photo to user profile
    user.progressPhotos.push({
      url: `data:image/jpeg;base64,${imageData}`, // In production, save to cloud storage
      notes: notes || '',
      uploadDate: new Date()
    });
    await user.save();

    res.json({
      success: true,
      message: 'Photo analyzed successfully',
      data: {
        analysis,
        photoCount: user.progressPhotos.length,
        analyzedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Photo analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze photo'
    });
  }
});

/**
 * @route   POST /api/ai/generate-routine
 * @desc    Generate AI-powered skincare routine
 * @access  Private
 */
router.post('/generate-routine', auth, async (req, res) => {
  try {
    const { selectedProductIds = [], preferences = {} } = req.body;

    const user = await User.findById(req.user._id);
    if (!user.skinProfile?.skinType) {
      return res.status(400).json({
        success: false,
        message: 'Please complete your skin profile first'
      });
    }

    let selectedProducts = [];
    if (selectedProductIds.length > 0) {
      selectedProducts = await Product.find({
        _id: { $in: selectedProductIds },
        isAvailable: true
      });
    }

    // Generate routine with AI
    const routineSuggestions = await googleAI.generateRoutineSuggestions(
      user.toObject(),
      selectedProducts
    );

    res.json({
      success: true,
      message: 'Routine generated successfully',
      data: {
        routines: routineSuggestions,
        selectedProducts: selectedProducts.map(p => ({
          id: p._id,
          name: p.name,
          brand: p.brand,
          category: p.category
        })),
        userPreferences: preferences,
        generatedAt: new Date()
      }
    });

  } catch (error) {
    console.error('Routine generation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate routine'
    });
  }
});

/**
 * @route   POST /api/ai/skincare-advice
 * @desc    Get personalized skincare advice
 * @access  Private
 */
router.post('/skincare-advice', auth, async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || question.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question for skincare advice'
      });
    }

    if (question.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Question is too long. Please keep it under 500 characters.'
      });
    }

    const user = await User.findById(req.user._id);
    
    const advice = await googleAI.providSkincareAdvice(question, user.toObject());

    res.json({
      success: true,
      message: 'Skincare advice generated successfully',
      data: {
        question,
        advice: advice.advice,
        confidence: advice.confidence,
        userProfile: {
          skinType: user.skinProfile?.skinType,
          mainConcerns: user.skinProfile?.skinConcerns?.slice(0, 3)
        },
        generatedAt: advice.generatedAt,
        disclaimer: 'This advice is AI-generated and should not replace professional dermatological consultation for serious skin conditions.'
      }
    });

  } catch (error) {
    console.error('Skincare advice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate skincare advice'
    });
  }
});

/**
 * @route   POST /api/ai/ingredient-analysis
 * @desc    Analyze skincare ingredients compatibility
 * @access  Private
 */
router.post('/ingredient-analysis', auth, async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a list of ingredients to analyze'
      });
    }

    const user = await User.findById(req.user._id);
    
    const analysisPrompt = `
    Analyze the following skincare ingredients for compatibility and effectiveness for a user with:
    - Skin Type: ${user.skinProfile?.skinType || 'Not specified'}
    - Skin Concerns: ${user.skinProfile?.skinConcerns?.join(', ') || 'General care'}
    - Known Allergies: ${user.skinProfile?.allergies?.join(', ') || 'None'}
    
    Ingredients to analyze: ${ingredients.join(', ')}
    
    Provide analysis covering:
    1. Ingredient compatibility with user's skin type
    2. Potential interactions between ingredients
    3. Benefits for user's specific concerns
    4. Any warnings or precautions
    5. Recommended usage order and timing
    `;

    const advice = await googleAI.providSkincareAdvice(analysisPrompt, user.toObject());

    res.json({
      success: true,
      message: 'Ingredient analysis completed',
      data: {
        ingredients,
        analysis: advice.advice,
        confidence: advice.confidence,
        analyzedAt: new Date(),
        disclaimer: 'Always patch test new ingredients and consult a dermatologist for severe reactions.'
      }
    });

  } catch (error) {
    console.error('Ingredient analysis error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze ingredients'
    });
  }
});

/**
 * @route   POST /api/ai/routine
 * @desc    Generate skincare routine based on questionnaire
 * @access  Private
 */
router.post('/routine', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const questionnaireData = req.body;

    // Create detailed prompt for Google AI
    const prompt = `
As a professional dermatologist and skincare expert, analyze the following user profile and provide a comprehensive skincare routine and analysis:

USER PROFILE:
- Age: ${questionnaireData.age}
- Gender: ${questionnaireData.gender}
- Skin Type: ${questionnaireData.skinType}
- Primary Concerns: ${questionnaireData.skinConcerns.join(', ')}
- Concern Severity: ${questionnaireData.severityLevel}/5
- Skin Sensitivity: ${questionnaireData.skinSensitivity}
- Allergies: ${questionnaireData.allergies || 'None specified'}
- Current Products: ${questionnaireData.currentProducts.join(', ')}
- Routine Frequency: ${questionnaireData.routineFrequency}
- Current Satisfaction: ${questionnaireData.productSatisfaction}/5
- Budget: ${questionnaireData.budget}
- Primary Goal: ${questionnaireData.primaryGoal}
- Timeline Expectation: ${questionnaireData.timelineExpectation}
- Previous Treatments: ${questionnaireData.previousTreatments || 'None'}
- Sleep Hours: ${questionnaireData.sleepHours}
- Stress Level: ${questionnaireData.stressLevel}/5
- Exercise: ${questionnaireData.exercise}
- Diet: ${questionnaireData.diet}
- Water Intake: ${questionnaireData.waterIntake} glasses/day
- Climate: ${questionnaireData.climate}
- Indoor/Outdoor: ${questionnaireData.indoorOutdoor}

Please provide a JSON response with the following structure:
{
  "skinAnalysis": {
    "summary": "Brief analysis of user's skin condition and needs",
    "strengths": ["positive aspects of current routine"],
    "concerns": ["areas that need attention"],
    "recommendations": ["key recommendations"]
  },
  "morningRoutine": [
    {
      "step": 1,
      "product": "Product name",
      "category": "cleanser/toner/serum/moisturizer/sunscreen",
      "instructions": "How to use",
      "importance": "Why this step is important",
      "ingredients": ["key ingredients to look for"]
    }
  ],
  "eveningRoutine": [
    {
      "step": 1,
      "product": "Product name", 
      "category": "cleanser/toner/serum/moisturizer",
      "instructions": "How to use",
      "importance": "Why this step is important",
      "ingredients": ["key ingredients to look for"]
    }
  ],
  "weeklyTreatments": [
    {
      "treatment": "Treatment name",
      "frequency": "How often",
      "instructions": "How to use",
      "benefits": "What it does"
    }
  ],
  "timeline": {
    "2weeks": "What to expect in 2 weeks",
    "1month": "What to expect in 1 month", 
    "3months": "What to expect in 3 months"
  }
}

Make recommendations realistic, evidence-based, and consider the user's budget, sensitivity, and lifestyle.
`;

    // Use retry function for AI request
    const generateAIResponse = async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    };

    const text = await retryAIRequest(generateAIResponse, 3, 2000);

    // Try to parse the JSON response
    let analysisData;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/```\n([\s\S]*?)\n```/) || [null, text];
      analysisData = JSON.parse(jsonMatch[1] || text);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      // Fallback if JSON parsing fails
      analysisData = {
        skinAnalysis: {
          summary: "Based on your profile, we've created a personalized routine for your skin needs.",
          strengths: ["Following some skincare routine", "Awareness of skin concerns"],
          concerns: questionnaireData.skinConcerns,
          recommendations: ["Consistent daily routine", "Appropriate product selection", "Lifestyle considerations"]
        },
        morningRoutine: [
          {
            step: 1,
            product: "Gentle Cleanser",
            category: "cleanser",
            instructions: "Use lukewarm water, massage gently for 30 seconds",
            importance: "Removes overnight buildup without stripping skin",
            ingredients: ["Ceramides", "Hyaluronic Acid"]
          }
        ],
        eveningRoutine: [
          {
            step: 1,
            product: "Double Cleanse",
            category: "cleanser", 
            instructions: "Oil cleanser first, then water-based cleanser",
            importance: "Thoroughly removes makeup, sunscreen, and daily buildup",
            ingredients: ["Gentle surfactants", "Nourishing oils"]
          }
        ],
        rawResponse: text
      };
    }

    res.json({
      success: true,
      message: 'Skin analysis completed successfully',
      data: analysisData
    });

  } catch (error) {
    console.error('AI routine generation error:', error);
    
    // Handle specific Google AI API errors and provide fallback
    let errorMessage = 'Failed to generate skincare routine';
    let shouldProvideFallback = false;
    
    if (error.message && (error.message.includes('quota') || error.message.includes('429'))) {
      errorMessage = 'AI service is temporarily busy. Here\'s a basic routine based on your profile.';
      shouldProvideFallback = true;
    }
    
    if (shouldProvideFallback) {
      // Provide a basic fallback routine based on questionnaire data
      const questionnaireData = req.body;
      const fallbackRoutine = {
        skinAnalysis: {
          summary: `Based on your ${questionnaireData.skinType} skin type and concerns about ${questionnaireData.skinConcerns.join(', ')}, here's a basic routine to get you started.`,
          strengths: ["Taking initiative with skincare", "Identifying your skin concerns"],
          concerns: questionnaireData.skinConcerns,
          recommendations: ["Consistent daily routine", "Gentle products suitable for your skin type", "Regular sunscreen use"]
        },
        morningRoutine: [
          {
            step: 1,
            product: "Gentle Cleanser",
            category: "cleanser",
            instructions: "Use lukewarm water, massage gently for 30 seconds",
            importance: "Removes overnight buildup without stripping skin",
            ingredients: ["Ceramides", "Hyaluronic Acid"]
          },
          {
            step: 2,
            product: "Lightweight Moisturizer", 
            category: "moisturizer",
            instructions: "Apply to damp skin, massage gently",
            importance: "Hydrates and protects skin barrier",
            ingredients: ["Niacinamide", "Glycerin"]
          },
          {
            step: 3,
            product: "Broad Spectrum SPF 30+",
            category: "sunscreen", 
            instructions: "Apply 15 minutes before sun exposure",
            importance: "Prevents UV damage and premature aging",
            ingredients: ["Zinc Oxide", "Titanium Dioxide"]
          }
        ],
        eveningRoutine: [
          {
            step: 1,
            product: "Same Gentle Cleanser",
            category: "cleanser",
            instructions: "Double cleanse if wearing makeup/sunscreen",
            importance: "Removes daily buildup and prepares skin for treatments",
            ingredients: ["Gentle surfactants"]
          },
          {
            step: 2,
            product: "Treatment Product",
            category: "serum",
            instructions: `For ${questionnaireData.skinType} skin, use appropriate active ingredients`,
            importance: "Addresses specific skin concerns",
            ingredients: questionnaireData.skinConcerns.includes('Acne') ? ["Salicylic Acid", "Niacinamide"] : ["Retinol", "Vitamin C"]
          },
          {
            step: 3,
            product: "Night Moisturizer",
            category: "moisturizer",
            instructions: "Apply generously, massage upward",
            importance: "Repairs and regenerates skin overnight",
            ingredients: ["Peptides", "Ceramides"]
          }
        ],
        weeklyTreatments: [
          {
            treatment: "Gentle Exfoliation",
            frequency: "1-2 times per week",
            instructions: "Use BHA or AHA based on skin tolerance",
            benefits: "Removes dead skin cells and unclogs pores"
          }
        ],
        timeline: {
          "2weeks": "Skin may adjust to new routine, some purging possible",
          "1month": "Improved skin texture and hydration",
          "3months": "Noticeable improvement in primary concerns"
        }
      };
      
      return res.json({
        success: true,
        message: 'Basic routine provided (AI service temporarily unavailable)',
        data: fallbackRoutine
      });
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/ai/dashboard-insights  
 * @desc    Get AI-powered dashboard insights for user
 * @access  Private
 */
router.get('/dashboard-insights', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const prompt = `
Generate personalized skincare insights for a dashboard. Provide a JSON response with:
{
  "tipOfTheDay": "practical daily skincare tip",
  "seasonalAdvice": "advice for current season", 
  "ingredientSpotlight": {
    "ingredient": "ingredient name",
    "benefits": "what it does",
    "usage": "how to use it"
  },
  "progressMotivation": "encouraging message about skincare journey",
  "weeklyGoal": "achievable weekly skincare goal"
}
`;

    // Use retry function for AI request
    const generateInsights = async () => {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    };

    const text = await retryAIRequest(generateInsights, 2, 1000);

    let insights;
    try {
      const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || [null, text];
      insights = JSON.parse(jsonMatch[1] || text);
    } catch (parseError) {
      insights = {
        tipOfTheDay: "Always apply sunscreen 15-20 minutes before going outside for maximum protection.",
        seasonalAdvice: "During winter months, use a heavier moisturizer to combat dry air from indoor heating.",
        ingredientSpotlight: {
          ingredient: "Niacinamide",
          benefits: "Reduces pore appearance, controls oil production, and evens skin tone",
          usage: "Apply after cleansing, before moisturizer, both morning and evening"
        },
        progressMotivation: "Consistency is key in skincare - small daily steps lead to big improvements over time!",
        weeklyGoal: "This week, focus on drinking more water and getting adequate sleep for healthier skin"
      };
    }

    res.json({
      success: true,
      data: insights
    });

  } catch (error) {
    console.error('Dashboard insights error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate dashboard insights'
    });
  }
});

module.exports = router;
