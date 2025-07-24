const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Basic Product Information
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  brand: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['cleanser', 'moisturizer', 'serum', 'sunscreen', 'toner', 'exfoliant', 'mask', 'treatment', 'other']
  },
  
  // Product Details
  ingredients: [{
    name: {
      type: String,
      required: true
    },
    concentration: String,
    purpose: String
  }],
  keyIngredients: [String],
  skinTypes: [{
    type: String,
    enum: ['oily', 'dry', 'combination', 'sensitive', 'normal', 'all']
  }],
  skinConcerns: [{
    type: String,
    enum: ['acne', 'wrinkles', 'dark-spots', 'redness', 'dryness', 'oiliness', 'sensitivity', 'pores', 'dullness']
  }],
  
  // Usage Information
  howToUse: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['once-daily', 'twice-daily', '2-3-times-week', 'as-needed', 'weekly'],
    required: true
  },
  timeOfUse: [{
    type: String,
    enum: ['morning', 'evening', 'anytime']
  }],
  
  // Product Media
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  
  // Pricing and Availability
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  size: {
    amount: Number,
    unit: {
      type: String,
      enum: ['ml', 'oz', 'g', 'count']
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  
  // Reviews and Ratings
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Additional Information
  tags: [String],
  isRecommended: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // AI Matching Score (calculated dynamically)
  aiCompatibilityScore: {
    type: Number,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Index for search optimization
productSchema.index({ name: 'text', brand: 'text', description: 'text' });
productSchema.index({ category: 1, skinTypes: 1 });
productSchema.index({ 'ratings.average': -1 });

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
  return `$${this.price.amount.toFixed(2)}`;
});

// Method to calculate AI compatibility score for a user
productSchema.methods.calculateCompatibilityScore = function(userProfile) {
  let score = 0;
  const maxScore = 100;
  
  // Skin type match (30 points)
  if (this.skinTypes.includes(userProfile.skinType) || this.skinTypes.includes('all')) {
    score += 30;
  }
  
  // Skin concerns match (40 points)
  const concernMatches = this.skinConcerns.filter(concern => 
    userProfile.skinConcerns.includes(concern)
  );
  score += (concernMatches.length / Math.max(userProfile.skinConcerns.length, 1)) * 40;
  
  // Rating factor (20 points)
  score += (this.ratings.average / 5) * 20;
  
  // Availability factor (10 points)
  if (this.isAvailable) {
    score += 10;
  }
  
  return Math.min(Math.round(score), maxScore);
};

module.exports = mongoose.model('Product', productSchema);
