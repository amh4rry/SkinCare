const express = require('express');
const { auth } = require('../middleware/auth');
const { validateSkinProfileUpdate } = require('../middleware/validation');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', auth, async (req, res) => {
  try {
    const allowedUpdates = ['firstName', 'lastName', 'dateOfBirth', 'gender', 'profilePicture'];
    const updates = {};
    
    // Filter allowed updates
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

/**
 * @route   PUT /api/users/skin-profile
 * @desc    Update user skin profile
 * @access  Private
 */
router.put('/skin-profile', auth, validateSkinProfileUpdate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Update skin profile
    if (req.body.skinType) user.skinProfile.skinType = req.body.skinType;
    if (req.body.skinConcerns) user.skinProfile.skinConcerns = req.body.skinConcerns;
    if (req.body.allergies) user.skinProfile.allergies = req.body.allergies;
    if (req.body.currentProducts) user.skinProfile.currentProducts = req.body.currentProducts;
    if (req.body.skinGoals) user.skinProfile.skinGoals = req.body.skinGoals;
    if (req.body.lifestyle) {
      user.skinProfile.lifestyle = {
        ...user.skinProfile.lifestyle,
        ...req.body.lifestyle
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Skin profile updated successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Update skin profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skin profile'
    });
  }
});

module.exports = router;
