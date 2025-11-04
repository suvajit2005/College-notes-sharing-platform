const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');  // Make sure this path is correct



const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (student)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, department } = req.body;

    // Validation
    if (!name || !email || !password || !department) {
      return res.status(400).json({ 
        message: 'Please enter all required fields' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ 
        message: 'Name must be at least 2 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user (default role: student)
    const user = new User({
      name: name.trim(),
      email,
      password: hashedPassword,
      department,
      role: 'student' // Default role - teachers are created by admin
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    // Return user data (excluding password)
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle specific errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: messages 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      message: 'Server error during registration' 
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please enter both email and password' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check if account is active
    if (user.status === 'inactive') {
      return res.status(400).json({ 
        message: 'Account is deactivated. Please contact administrator.' 
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return user data (excluding password)
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        lastLogin: user.lastLogin
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Server error during login' 
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        department: req.user.department,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching user data' 
    });
  }
});

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, department } = req.body;
    const updates = {};

    if (name && name.trim().length >= 2) {
      updates.name = name.trim();
    }

    if (department) {
      updates.department = department;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        message: 'No valid fields to update' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: messages 
      });
    }

    res.status(500).json({ 
      message: 'Server error while updating profile' 
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Please enter both current and new password' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found' 
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedNewPassword;
    await user.save();

    res.json({ 
      message: 'Password changed successfully' 
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ 
      message: 'Server error while changing password' 
    });
  }
});

// @route   POST /api/auth/verify-token
// @desc    Verify JWT token
// @access  Public
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ 
        valid: false, 
        message: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Invalid token' 
      });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });

  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ 
      valid: false, 
      message: 'Invalid token' 
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, async (req, res) => {
  try {
    // Note: JWT is stateless, so we can't invalidate it on server-side
    // Client should remove the token from storage
    res.json({ 
      message: 'Logout successful' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Server error during logout' 
    });
  }
});

// @route   GET /api/auth/stats
// @desc    Get auth statistics (for admin)
// @access  Private (Admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Access denied. Admin role required.' 
      });
    }

    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    res.json({
      totalUsers,
      totalStudents,
      totalTeachers,
      recentUsers
    });

  } catch (error) {
    console.error('Auth stats error:', error);
    res.status(500).json({ 
      message: 'Server error while fetching statistics' 
    });
  }
});

module.exports = router;