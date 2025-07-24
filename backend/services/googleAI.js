const { GoogleGenerativeAI } = require('@google/generative-ai');

class GoogleAIService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  /**
   * Generate personalized skincare recommendations based on user profile
   */
  async generateSkincareRecommendations(userProfile, availableProducts = []) {
    try {
      const prompt = this.buildRecommendationPrompt(userProfile, availableProducts);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseRecommendationResponse(text);
    } catch (error) {
      console.error('Google AI recommendation error:', error);
      throw new Error('Failed to generate AI recommendations');
    }
  }

  /**
   * Analyze uploaded skin progress photos
   */
  async analyzeProgressPhotos(imageData, userProfile) {
    try {
      const prompt = this.buildPhotoAnalysisPrompt(userProfile);
      
      const imagePart = {
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      };
      
      const result = await this.model.generateContent([prompt, imagePart]);
      const response = await result.response;
      const text = response.text();
      
      return this.parsePhotoAnalysisResponse(text);
    } catch (error) {
      console.error('Google AI photo analysis error:', error);
      throw new Error('Failed to analyze progress photos');
    }
  }

  /**
   * Generate routine suggestions based on user preferences
   */
  async generateRoutineSuggestions(userProfile, selectedProducts = []) {
    try {
      const prompt = this.buildRoutinePrompt(userProfile, selectedProducts);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return this.parseRoutineResponse(text);
    } catch (error) {
      console.error('Google AI routine generation error:', error);
      throw new Error('Failed to generate routine suggestions');
    }
  }

  /**
   * Provide personalized skincare advice
   */
  async providSkincareAdvice(question, userProfile) {
    try {
      const prompt = this.buildAdvicePrompt(question, userProfile);
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      return {
        advice: text,
        confidence: this.calculateConfidenceScore(text),
        generatedAt: new Date()
      };
    } catch (error) {
      console.error('Google AI advice error:', error);
      throw new Error('Failed to provide skincare advice');
    }
  }

  /**
   * Build recommendation prompt for Google AI
   */
  buildRecommendationPrompt(userProfile, products) {
    const { skinProfile, preferences } = userProfile;
    
    return `
You are an expert dermatologist and skincare specialist. Analyze the following user profile and provide personalized skincare product recommendations.

User Profile:
- Skin Type: ${skinProfile?.skinType || 'Not specified'}
- Skin Concerns: ${skinProfile?.skinConcerns?.join(', ') || 'None specified'}
- Current Products: ${skinProfile?.currentProducts?.join(', ') || 'None'}
- Skin Goals: ${skinProfile?.skinGoals?.join(', ') || 'General improvement'}
- Allergies: ${skinProfile?.allergies?.join(', ') || 'None known'}
- Age: ${this.calculateAge(userProfile.dateOfBirth) || 'Not specified'}
- Lifestyle: Sleep ${skinProfile?.lifestyle?.sleepHours || 'N/A'} hours, Stress level ${skinProfile?.lifestyle?.stressLevel || 'N/A'}/10

Available Products: ${products.length > 0 ? JSON.stringify(products.map(p => ({
  name: p.name,
  brand: p.brand,
  category: p.category,
  keyIngredients: p.keyIngredients,
  skinTypes: p.skinTypes,
  skinConcerns: p.skinConcerns
}))) : 'Consider general skincare categories'}

Please provide recommendations in the following JSON format:
{
  "recommendations": [
    {
      "category": "cleanser|moisturizer|serum|sunscreen|toner|exfoliant|mask|treatment",
      "priority": "high|medium|low",
      "reasoning": "explanation for this recommendation",
      "suggestedProducts": ["product names if available"],
      "keyIngredients": ["ingredient names to look for"],
      "usageInstructions": "how and when to use",
      "expectedResults": "what to expect and timeline"
    }
  ],
  "routineOrder": ["morning routine order", "evening routine order"],
  "additionalTips": ["general tips for this skin profile"],
  "warningsAndPrecautions": ["any warnings or ingredients to avoid"],
  "confidenceScore": 85
}

Focus on addressing the user's specific skin concerns while considering their skin type and lifestyle factors.
`;
  }

  /**
   * Build photo analysis prompt
   */
  buildPhotoAnalysisPrompt(userProfile) {
    return `
You are a dermatologist analyzing a skincare progress photo. Please analyze the image and provide insights based on the user's profile.

User Profile:
- Skin Type: ${userProfile.skinProfile?.skinType || 'Not specified'}
- Main Concerns: ${userProfile.skinProfile?.skinConcerns?.join(', ') || 'General assessment'}
- Current Routine Duration: Based on user's routine history

Please analyze the image and provide response in JSON format:
{
  "analysis": {
    "overallCondition": "description of skin condition",
    "visibleImprovements": ["list of positive changes"],
    "areasOfConcern": ["areas needing attention"],
    "skinTexture": "smooth|rough|uneven|improving",
    "skinTone": "even|uneven|improving",
    "hydrationLevel": "well-hydrated|dry|oily|balanced"
  },
  "recommendations": {
    "continueCurrentRoutine": true/false,
    "adjustments": ["suggested changes to routine"],
    "additionalProducts": ["product categories to consider"],
    "lifestyle": ["lifestyle recommendations"]
  },
  "progressScore": 85,
  "nextPhotoRecommendation": "when to take next progress photo"
}

Be encouraging but honest in your assessment.
`;
  }

  /**
   * Build routine generation prompt
   */
  buildRoutinePrompt(userProfile, products) {
    return `
Create a personalized skincare routine for this user profile and selected products.

User Profile:
- Skin Type: ${userProfile.skinProfile?.skinType || 'Not specified'}
- Concerns: ${userProfile.skinProfile?.skinConcerns?.join(', ') || 'General care'}
- Lifestyle: ${userProfile.skinProfile?.lifestyle?.exerciseFrequency || 'Not specified'} exercise, ${userProfile.skinProfile?.lifestyle?.stressLevel || 'N/A'}/10 stress

Selected Products: ${JSON.stringify(products.map(p => ({
  name: p.name,
  category: p.category,
  howToUse: p.howToUse,
  frequency: p.frequency,
  timeOfUse: p.timeOfUse
})))}

Create morning and evening routines in JSON format:
{
  "morningRoutine": {
    "name": "Morning Skincare Routine",
    "estimatedTime": "10-15 minutes",
    "steps": [
      {
        "stepNumber": 1,
        "productCategory": "cleanser",
        "instructions": "detailed instructions",
        "waitTime": 0,
        "tips": "additional tips"
      }
    ]
  },
  "eveningRoutine": {
    "name": "Evening Skincare Routine",
    "estimatedTime": "15-20 minutes",
    "steps": [...]
  },
  "weeklyTreatments": [
    {
      "treatment": "exfoliation",
      "frequency": "2-3 times per week",
      "instructions": "how to incorporate"
    }
  ],
  "progressTracking": {
    "photoFrequency": "weekly|bi-weekly|monthly",
    "keyMetrics": ["improvements to track"],
    "timelineExpectations": "what to expect and when"
  },
  "customizationNotes": ["how to adjust based on skin response"]
}
`;
  }

  /**
   * Build advice prompt
   */
  buildAdvicePrompt(question, userProfile) {
    return `
You are a professional dermatologist providing personalized skincare advice.

User Profile:
- Skin Type: ${userProfile.skinProfile?.skinType || 'Not specified'}
- Concerns: ${userProfile.skinProfile?.skinConcerns?.join(', ') || 'General'}
- Age: ${this.calculateAge(userProfile.dateOfBirth) || 'Not specified'}

User Question: "${question}"

Please provide helpful, accurate, and personalized advice. Include:
1. Direct answer to their question
2. Explanation of the science behind your advice
3. Specific product recommendations if relevant
4. Timeline for expected results
5. When to consult a dermatologist if needed

Keep the tone professional but friendly and accessible.
`;
  }

  /**
   * Parse AI recommendation response
   */
  parseRecommendationResponse(text) {
    try {
      // Extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: return structured response
      return {
        recommendations: [],
        routineOrder: [],
        additionalTips: [text],
        confidenceScore: 70
      };
    } catch (error) {
      console.error('Failed to parse recommendation response:', error);
      return {
        recommendations: [],
        additionalTips: [text],
        confidenceScore: 50
      };
    }
  }

  /**
   * Parse photo analysis response
   */
  parsePhotoAnalysisResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        analysis: {
          overallCondition: text,
          visibleImprovements: [],
          areasOfConcern: []
        },
        progressScore: 70
      };
    } catch (error) {
      console.error('Failed to parse photo analysis response:', error);
      return {
        analysis: { overallCondition: text },
        progressScore: 50
      };
    }
  }

  /**
   * Parse routine response
   */
  parseRoutineResponse(text) {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        morningRoutine: { steps: [] },
        eveningRoutine: { steps: [] },
        weeklyTreatments: []
      };
    } catch (error) {
      console.error('Failed to parse routine response:', error);
      return {
        morningRoutine: { steps: [] },
        eveningRoutine: { steps: [] }
      };
    }
  }

  /**
   * Calculate confidence score based on response quality
   */
  calculateConfidenceScore(text) {
    let score = 70; // Base score
    
    // Increase score for detailed responses
    if (text.length > 200) score += 10;
    if (text.includes('recommend')) score += 5;
    if (text.includes('because') || text.includes('due to')) score += 5;
    if (text.includes('study') || text.includes('research')) score += 10;
    
    return Math.min(score, 95);
  }

  /**
   * Calculate age from date of birth
   */
  calculateAge(dateOfBirth) {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

module.exports = new GoogleAIService();
