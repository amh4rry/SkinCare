const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  
  // Profile Information
  dateOfBirth: {
    type: Date
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  profilePicture: {
    type: String,
    default: null
  },
  
  // Skin Profile
  skinProfile: {
    skinType: {
      type: String,
      enum: ['oily', 'dry', 'combination', 'sensitive', 'normal'],
      required: false
    },
    skinConcerns: [{
      type: String,
      enum: ['acne', 'wrinkles', 'dark-spots', 'redness', 'dryness', 'oiliness', 'sensitivity', 'pores', 'dullness']
    }],
    allergies: [String],
    currentProducts: [String],
    skinGoals: [String],
    lifestyle: {
      sleepHours: Number,
      stressLevel: {
        type: Number,
        min: 1,
        max: 10
      },
      exerciseFrequency: {
        type: String,
        enum: ['never', 'rarely', 'sometimes', 'often', 'daily']
      },
      dietType: {
        type: String,
        enum: ['balanced', 'vegetarian', 'vegan', 'keto', 'other']
      }
    }
  },
  
  // Progress Photos
  progressPhotos: [{
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  
  // User Preferences
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      routine: {
        type: Boolean,
        default: true
      }
    }
  },
  
  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  
  // Timestamps
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get user profile without sensitive data
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);
