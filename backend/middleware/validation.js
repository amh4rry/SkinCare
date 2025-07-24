const { body, query, param, validationResult } = require('express-validator');

/**
 * Validation middleware to handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  
  next();
};

/**
 * User registration validation rules
 */
const validateUserRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

/**
 * User login validation rules
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Product creation validation rules
 */
const validateProductCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Product name must be between 1 and 100 characters'),
  
  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand name is required'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('category')
    .isIn(['cleanser', 'moisturizer', 'serum', 'sunscreen', 'toner', 'exfoliant', 'mask', 'treatment', 'other'])
    .withMessage('Invalid product category'),
  
  body('price.amount')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('howToUse')
    .trim()
    .notEmpty()
    .withMessage('Usage instructions are required'),
  
  handleValidationErrors
];

/**
 * Review creation validation rules
 */
const validateReviewCreation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Review title must be between 5 and 100 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review content must be between 10 and 1000 characters'),
  
  body('usageDuration.value')
    .isInt({ min: 1 })
    .withMessage('Usage duration must be at least 1'),
  
  body('usageDuration.unit')
    .isIn(['days', 'weeks', 'months'])
    .withMessage('Usage duration unit must be days, weeks, or months'),
  
  body('skinTypeWhenUsed')
    .isIn(['oily', 'dry', 'combination', 'sensitive', 'normal'])
    .withMessage('Invalid skin type'),
  
  body('wouldRecommend')
    .isBoolean()
    .withMessage('Would recommend must be true or false'),
  
  body('repurchase')
    .isBoolean()
    .withMessage('Repurchase must be true or false'),
  
  handleValidationErrors
];

/**
 * Routine creation validation rules
 */
const validateRoutineCreation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Routine name must be between 1 and 100 characters'),
  
  body('type')
    .isIn(['morning', 'evening', 'weekly', 'custom'])
    .withMessage('Invalid routine type'),
  
  body('steps')
    .isArray({ min: 1 })
    .withMessage('Routine must have at least one step'),
  
  body('steps.*.stepNumber')
    .isInt({ min: 1 })
    .withMessage('Step number must be a positive integer'),
  
  body('steps.*.product')
    .isMongoId()
    .withMessage('Invalid product ID'),
  
  body('steps.*.instructions')
    .trim()
    .notEmpty()
    .withMessage('Step instructions are required'),
  
  body('schedule.frequency')
    .isIn(['daily', 'weekly', 'bi-weekly', 'monthly', 'custom'])
    .withMessage('Invalid schedule frequency'),
  
  handleValidationErrors
];

/**
 * Skin profile update validation rules
 */
const validateSkinProfileUpdate = [
  body('skinType')
    .optional()
    .isIn(['oily', 'dry', 'combination', 'sensitive', 'normal'])
    .withMessage('Invalid skin type'),
  
  body('skinConcerns')
    .optional()
    .isArray()
    .withMessage('Skin concerns must be an array'),
  
  body('skinConcerns.*')
    .optional()
    .isIn(['acne', 'wrinkles', 'dark-spots', 'redness', 'dryness', 'oiliness', 'sensitivity', 'pores', 'dullness'])
    .withMessage('Invalid skin concern'),
  
  body('lifestyle.stressLevel')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Stress level must be between 1 and 10'),
  
  body('lifestyle.sleepHours')
    .optional()
    .isFloat({ min: 0, max: 24 })
    .withMessage('Sleep hours must be between 0 and 24'),
  
  handleValidationErrors
];

/**
 * Query parameter validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

/**
 * MongoDB ObjectId parameter validation
 */
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateProductCreation,
  validateReviewCreation,
  validateRoutineCreation,
  validateSkinProfileUpdate,
  validatePagination,
  validateObjectId,
  handleValidationErrors
};
