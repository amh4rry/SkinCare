const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Basic Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  
  // Review Content
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  content: {
    type: String,
    required: [true, 'Review content is required'],
    maxlength: [1000, 'Review cannot exceed 1000 characters']
  },
  
  // Usage Information
  usageDuration: {
    value: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      enum: ['days', 'weeks', 'months'],
      required: true
    }
  },
  skinTypeWhenUsed: {
    type: String,
    enum: ['oily', 'dry', 'combination', 'sensitive', 'normal'],
    required: true
  },
  
  // Detailed Ratings
  detailedRatings: {
    effectiveness: {
      type: Number,
      min: 1,
      max: 5
    },
    texture: {
      type: Number,
      min: 1,
      max: 5
    },
    scent: {
      type: Number,
      min: 1,
      max: 5
    },
    packaging: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  
  // Progress Photos
  beforeAfterPhotos: [{
    type: {
      type: String,
      enum: ['before', 'after', 'progress'],
      required: true
    },
    url: {
      type: String,
      required: true
    },
    caption: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Additional Information
  pros: [String],
  cons: [String],
  wouldRecommend: {
    type: Boolean,
    required: true
  },
  repurchase: {
    type: Boolean,
    required: true
  },
  
  // Verification
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  
  // Helpfulness
  helpfulVotes: {
    type: Number,
    default: 0
  },
  totalVotes: {
    type: Number,
    default: 0
  },
  
  // Status
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  
  // Moderation
  reportCount: {
    type: Number,
    default: 0
  },
  isHidden: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
reviewSchema.index({ productId: 1, rating: -1 });
reviewSchema.index({ userId: 1, createdAt: -1 });
reviewSchema.index({ isApproved: 1, isHidden: 1 });

// Virtual for formatted usage duration
reviewSchema.virtual('formattedUsageDuration').get(function() {
  const { value, unit } = this.usageDuration;
  return `${value} ${unit}${value > 1 ? '' : ''}`;
});

// Virtual for helpfulness percentage
reviewSchema.virtual('helpfulnessPercentage').get(function() {
  if (this.totalVotes === 0) return 0;
  return Math.round((this.helpfulVotes / this.totalVotes) * 100);
});

// Method to calculate overall satisfaction
reviewSchema.methods.calculateSatisfactionScore = function() {
  const ratings = this.detailedRatings;
  const keys = Object.keys(ratings).filter(key => ratings[key] > 0);
  
  if (keys.length === 0) return this.rating;
  
  const total = keys.reduce((sum, key) => sum + ratings[key], 0);
  return (total / keys.length).toFixed(1);
};

// Static method to get product review summary
reviewSchema.statics.getProductSummary = async function(productId) {
  const reviews = await this.find({ 
    productId, 
    isApproved: true, 
    isHidden: false 
  });
  
  if (reviews.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      recommendationRate: 0
    };
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = (totalRating / reviews.length).toFixed(1);
  
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach(review => {
    ratingDistribution[review.rating]++;
  });
  
  const recommendCount = reviews.filter(review => review.wouldRecommend).length;
  const recommendationRate = Math.round((recommendCount / reviews.length) * 100);
  
  return {
    averageRating: parseFloat(averageRating),
    totalReviews: reviews.length,
    ratingDistribution,
    recommendationRate
  };
};

module.exports = mongoose.model('Review', reviewSchema);
