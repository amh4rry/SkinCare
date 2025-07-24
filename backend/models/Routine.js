const mongoose = require('mongoose');

const routineSchema = new mongoose.Schema({
  // Basic Information
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Routine name is required'],
    trim: true,
    maxlength: [100, 'Routine name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  
  // Routine Type
  type: {
    type: String,
    enum: ['morning', 'evening', 'weekly', 'custom'],
    required: true
  },
  
  // Routine Steps
  steps: [{
    stepNumber: {
      type: Number,
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    instructions: {
      type: String,
      required: true
    },
    waitTime: {
      type: Number, // in minutes
      default: 0
    },
    isOptional: {
      type: Boolean,
      default: false
    }
  }],
  
  // Schedule
  schedule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'bi-weekly', 'monthly', 'custom'],
      required: true
    },
    daysOfWeek: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }],
    timeOfDay: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night']
    }
  },
  
  // Status and Tracking
  isActive: {
    type: Boolean,
    default: true
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  completionRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  
  // AI Recommendations
  aiRecommendations: {
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    reasoning: String,
    adjustments: [String]
  },
  
  // User Feedback
  userRating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  
  // Progress Tracking
  startDate: {
    type: Date,
    default: Date.now
  },
  lastUsed: Date,
  totalUses: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for efficient querying
routineSchema.index({ userId: 1, type: 1 });
routineSchema.index({ isActive: 1, 'schedule.frequency': 1 });

// Virtual for routine duration (sum of all wait times)
routineSchema.virtual('totalDuration').get(function() {
  return this.steps.reduce((total, step) => total + step.waitTime, 0);
});

// Method to get next scheduled date
routineSchema.methods.getNextScheduledDate = function() {
  const now = new Date();
  const schedule = this.schedule;
  
  if (schedule.frequency === 'daily') {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  }
  
  if (schedule.frequency === 'weekly' && schedule.daysOfWeek.length > 0) {
    const today = now.getDay();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayName = dayNames[today];
    
    // Find next scheduled day
    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7;
      const nextDayName = dayNames[nextDay];
      
      if (schedule.daysOfWeek.includes(nextDayName)) {
        const nextDate = new Date(now);
        nextDate.setDate(nextDate.getDate() + i);
        return nextDate;
      }
    }
  }
  
  return null;
};

// Method to mark routine as used
routineSchema.methods.markAsUsed = async function() {
  this.lastUsed = new Date();
  this.totalUses += 1;
  return await this.save();
};

// Static method to get user's active routines
routineSchema.statics.getActiveRoutines = function(userId) {
  return this.find({ userId, isActive: true })
    .populate('steps.product')
    .sort({ type: 1, createdAt: -1 });
};

module.exports = mongoose.model('Routine', routineSchema);
