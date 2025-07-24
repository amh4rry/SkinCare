const express = require('express');
const { auth } = require('../middleware/auth');
const { validateRoutineCreation } = require('../middleware/validation');
const Routine = require('../models/Routine');
const Product = require('../models/Product');

const router = express.Router();

/**
 * @route   GET /api/routines
 * @desc    Get user's routines
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.user._id })
      .populate('steps.product', 'name brand images price')
      .sort('-createdAt');

    res.json({
      success: true,
      data: routines
    });
  } catch (error) {
    console.error('Get routines error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routines'
    });
  }
});

/**
 * @route   GET /api/routines/:id
 * @desc    Get single routine
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const routine = await Routine.findOne({
      _id: req.params.id,
      user: req.user._id
    }).populate('steps.product', 'name brand images price instructions');

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    res.json({
      success: true,
      data: routine
    });
  } catch (error) {
    console.error('Get routine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routine'
    });
  }
});

/**
 * @route   POST /api/routines
 * @desc    Create new routine
 * @access  Private
 */
router.post('/', auth, validateRoutineCreation, async (req, res) => {
  try {
    const routineData = {
      ...req.body,
      user: req.user._id
    };

    // Validate product references
    if (routineData.steps && routineData.steps.length > 0) {
      const productIds = routineData.steps.map(step => step.product);
      const products = await Product.find({ _id: { $in: productIds } });
      
      if (products.length !== productIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more products not found'
        });
      }
    }

    const routine = new Routine(routineData);
    await routine.save();

    await routine.populate('steps.product', 'name brand images price');

    res.status(201).json({
      success: true,
      message: 'Routine created successfully',
      data: routine
    });
  } catch (error) {
    console.error('Create routine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create routine'
    });
  }
});

/**
 * @route   PUT /api/routines/:id
 * @desc    Update routine
 * @access  Private
 */
router.put('/:id', auth, async (req, res) => {
  try {
    // Validate product references if steps are being updated
    if (req.body.steps && req.body.steps.length > 0) {
      const productIds = req.body.steps.map(step => step.product);
      const products = await Product.find({ _id: { $in: productIds } });
      
      if (products.length !== productIds.length) {
        return res.status(400).json({
          success: false,
          message: 'One or more products not found'
        });
      }
    }

    const routine = await Routine.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    ).populate('steps.product', 'name brand images price');

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    res.json({
      success: true,
      message: 'Routine updated successfully',
      data: routine
    });
  } catch (error) {
    console.error('Update routine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update routine'
    });
  }
});

/**
 * @route   DELETE /api/routines/:id
 * @desc    Delete routine
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    res.json({
      success: true,
      message: 'Routine deleted successfully'
    });
  } catch (error) {
    console.error('Delete routine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete routine'
    });
  }
});

/**
 * @route   POST /api/routines/:id/track
 * @desc    Track routine completion
 * @access  Private
 */
router.post('/:id/track', auth, async (req, res) => {
  try {
    const { date, completed = true, notes } = req.body;

    const routine = await Routine.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    // Add or update tracking entry
    const trackingDate = date ? new Date(date) : new Date();
    const dateString = trackingDate.toISOString().split('T')[0];

    const existingEntry = routine.tracking.find(
      entry => entry.date.toISOString().split('T')[0] === dateString
    );

    if (existingEntry) {
      existingEntry.completed = completed;
      if (notes) existingEntry.notes = notes;
    } else {
      routine.tracking.push({
        date: trackingDate,
        completed,
        notes
      });
    }

    // Update statistics
    routine.updateStatistics();
    await routine.save();

    res.json({
      success: true,
      message: 'Routine tracking updated successfully',
      data: routine
    });
  } catch (error) {
    console.error('Track routine error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track routine'
    });
  }
});

/**
 * @route   GET /api/routines/:id/progress
 * @desc    Get routine progress and statistics
 * @access  Private
 */
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    
    const routine = await Routine.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!routine) {
      return res.status(404).json({
        success: false,
        message: 'Routine not found'
      });
    }

    // Get progress for specified number of days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const progress = routine.tracking.filter(
      entry => entry.date >= startDate
    ).sort((a, b) => a.date - b.date);

    // Calculate statistics
    const totalDays = Number(days);
    const completedDays = progress.filter(entry => entry.completed).length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
    const currentStreak = routine.calculateCurrentStreak();

    res.json({
      success: true,
      data: {
        progress,
        statistics: {
          totalDays,
          completedDays,
          completionRate: Math.round(completionRate),
          currentStreak,
          longestStreak: routine.statistics.longestStreak
        }
      }
    });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch routine progress'
    });
  }
});

module.exports = router;
