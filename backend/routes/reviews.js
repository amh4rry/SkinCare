const express = require('express');
const { auth } = require('../middleware/auth');
const { validateReviewCreation } = require('../middleware/validation');
const Review = require('../models/Review');
const Product = require('../models/Product');

const router = express.Router();

/**
 * @route   GET /api/reviews
 * @desc    Get reviews with filtering
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const {
      product,
      user,
      rating,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build filter object
    const filter = {};
    if (product) filter.product = product;
    if (user) filter.user = user;
    if (rating) filter.rating = Number(rating);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const reviews = await Review.find(filter)
      .populate('user', 'firstName lastName profilePicture')
      .populate('product', 'name brand images')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments(filter);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / limit),
          count: reviews.length,
          totalReviews: total
        }
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews'
    });
  }
});

/**
 * @route   GET /api/reviews/:id
 * @desc    Get single review
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'firstName lastName profilePicture')
      .populate('product', 'name brand images');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch review'
    });
  }
});

/**
 * @route   POST /api/reviews
 * @desc    Create new review
 * @access  Private
 */
router.post('/', auth, validateReviewCreation, async (req, res) => {
  try {
    // Check if product exists
    const product = await Product.findById(req.body.product);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: req.body.product
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    const reviewData = {
      ...req.body,
      user: req.user._id
    };

    const review = new Review(reviewData);
    await review.save();

    await review.populate('user', 'firstName lastName profilePicture');
    await review.populate('product', 'name brand images');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review'
    });
  }
});

/**
 * @route   PUT /api/reviews/:id
 * @desc    Update review
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['rating', 'title', 'comment', 'wouldRecommend', 'skinType'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        review[field] = req.body[field];
      }
    });

    await review.save();

    await review.populate('user', 'firstName lastName profilePicture');
    await review.populate('product', 'name brand images');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review'
    });
  }
});

/**
 * @route   DELETE /api/reviews/:id
 * @desc    Delete review
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found or unauthorized'
      });
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review'
    });
  }
});

/**
 * @route   POST /api/reviews/:id/helpful
 * @desc    Mark review as helpful/unhelpful
 * @access  Private
 */
router.post('/:id/helpful', auth, async (req, res) => {
  try {
    const { helpful = true } = req.body;
    
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked this review
    const existingVote = review.helpfulVotes.find(
      vote => vote.user.toString() === req.user._id.toString()
    );

    if (existingVote) {
      existingVote.helpful = helpful;
    } else {
      review.helpfulVotes.push({
        user: req.user._id,
        helpful
      });
    }

    await review.save();

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: {
        helpfulCount: review.helpfulVotes.filter(vote => vote.helpful).length,
        unhelpfulCount: review.helpfulVotes.filter(vote => !vote.helpful).length
      }
    });
  } catch (error) {
    console.error('Helpful vote error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote'
    });
  }
});

/**
 * @route   GET /api/reviews/user/me
 * @desc    Get current user's reviews
 * @access  Private
 */
router.get('/user/me', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ user: req.user._id })
      .populate('product', 'name brand images')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ user: req.user._id });

    res.json({
      success: true,
      data: {
        reviews,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / limit),
          count: reviews.length,
          totalReviews: total
        }
      }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your reviews'
    });
  }
});

module.exports = router;
