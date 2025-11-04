// const express = require('express');
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');
// const Note = require('../models/Note');
// const auth = require('../middleware/auth');  // Make sure this path is correct

// const router = express.Router();

// // @route   GET /api/users
// // @desc    Get all users (Admin only)
// // @access  Private (Admin only)
// router.get('/', auth, async (req, res) => {
//   try {
//     // Check if user is admin
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: 'Access denied. Admin role required.' 
//       });
//     }

//     const { page = 1, limit = 10, role, department, search } = req.query;
    
//     // Build filter object
//     let filter = {};
//     if (role) filter.role = role;
//     if (department) filter.department = department;
//     if (search) {
//       filter.$or = [
//         { name: { $regex: search, $options: 'i' } },
//         { email: { $regex: search, $options: 'i' } }
//       ];
//     }

//     const users = await User.find(filter)
//       .select('-password')
//       .sort({ createdAt: -1 })
//       .limit(limit * 1)
//       .skip((page - 1) * limit);

//     const totalUsers = await User.countDocuments(filter);

//     res.json({
//       users,
//       totalPages: Math.ceil(totalUsers / limit),
//       currentPage: parseInt(page),
//       totalUsers
//     });

//   } catch (error) {
//     console.error('Get users error:', error);
//     res.status(500).json({ 
//       message: 'Server error while fetching users' 
//     });
//   }
// });

// // @route   GET /api/users/stats
// // @desc    Get users statistics
// // @access  Private (Admin only)
// router.get('/stats', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: 'Access denied. Admin role required.' 
//       });
//     }

//     const totalUsers = await User.countDocuments();
//     const totalStudents = await User.countDocuments({ role: 'student' });
//     const totalTeachers = await User.countDocuments({ role: 'teacher' });
//     const totalAdmins = await User.countDocuments({ role: 'admin' });
    
//     const recentUsers = await User.find()
//       .select('name email role department createdAt')
//       .sort({ createdAt: -1 })
//       .limit(5);

//     // Department-wise statistics
//     const departmentStats = await User.aggregate([
//       {
//         $group: {
//           _id: '$department',
//           count: { $sum: 1 },
//           students: {
//             $sum: { $cond: [{ $eq: ['$role', 'student'] }, 1, 0] }
//           },
//           teachers: {
//             $sum: { $cond: [{ $eq: ['$role', 'teacher'] }, 1, 0] }
//           }
//         }
//       },
//       { $sort: { count: -1 } }
//     ]);

//     // Registration trend (last 30 days)
//     const thirtyDaysAgo = new Date();
//     thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

//     const registrationTrend = await User.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: thirtyDaysAgo }
//         }
//       },
//       {
//         $group: {
//           _id: {
//             $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
//           },
//           count: { $sum: 1 }
//         }
//       },
//       { $sort: { _id: 1 } },
//       { $limit: 30 }
//     ]);

//     res.json({
//       totalUsers,
//       totalStudents,
//       totalTeachers,
//       totalAdmins,
//       recentUsers,
//       departmentStats,
//       registrationTrend
//     });

//   } catch (error) {
//     console.error('Users stats error:', error);
//     res.status(500).json({ 
//       message: 'Server error while fetching user statistics' 
//     });
//   }
// });

// // @route   GET /api/users/:id
// // @desc    Get user by ID (Admin or own profile)
// // @access  Private
// router.get('/:id', auth, async (req, res) => {
//   try {
//     // Users can view their own profile, admins can view any profile
//     if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
//       return res.status(403).json({ 
//         message: 'Access denied. You can only view your own profile.' 
//       });
//     }

//     const user = await User.findById(req.params.id).select('-password');
    
//     if (!user) {
//       return res.status(404).json({ 
//         message: 'User not found' 
//       });
//     }

//     res.json({ user });

//   } catch (error) {
//     console.error('Get user by ID error:', error);
    
//     if (error.name === 'CastError') {
//       return res.status(400).json({ 
//         message: 'Invalid user ID' 
//       });
//     }

//     res.status(500).json({ 
//       message: 'Server error while fetching user' 
//     });
//   }
// });

// // @route   POST /api/users/teachers
// // @desc    Create a new teacher account (Admin only)
// // @access  Private (Admin only)
// router.post('/teachers', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: 'Access denied. Admin role required to create teacher accounts.' 
//       });
//     }

//     const { name, email, password, department } = req.body;

//     // Validation
//     if (!name || !email || !password || !department) {
//       return res.status(400).json({ 
//         message: 'Please enter all required fields' 
//       });
//     }

//     if (password.length < 6) {
//       return res.status(400).json({ 
//         message: 'Password must be at least 6 characters long' 
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ 
//         message: 'User already exists with this email' 
//       });
//     }

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create teacher account
//     const teacher = new User({
//       name: name.trim(),
//       email,
//       password: hashedPassword,
//       department,
//       role: 'teacher'
//     });

//     await teacher.save();

//     res.status(201).json({
//       message: 'Teacher account created successfully',
//       user: {
//         id: teacher._id,
//         name: teacher.name,
//         email: teacher.email,
//         role: teacher.role,
//         department: teacher.department,
//         createdAt: teacher.createdAt
//       }
//     });

//   } catch (error) {
//     console.error('Create teacher error:', error);
    
//     if (error.name === 'ValidationError') {
//       const messages = Object.values(error.errors).map(err => err.message);
//       return res.status(400).json({ 
//         message: 'Validation error', 
//         errors: messages 
//       });
//     }
    
//     if (error.code === 11000) {
//       return res.status(400).json({ 
//         message: 'Email already exists' 
//       });
//     }

//     res.status(500).json({ 
//       message: 'Server error while creating teacher account' 
//     });
//   }
// });

// // @route   PUT /api/users/:id/role
// // @desc    Update user role (Admin only)
// // @access  Private (Admin only)
// router.put('/:id/role', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: 'Access denied. Admin role required.' 
//       });
//     }

//     const { role } = req.body;

//     if (!role || !['student', 'teacher', 'admin'].includes(role)) {
//       return res.status(400).json({ 
//         message: 'Valid role (student, teacher, admin) is required' 
//       });
//     }

//     // Prevent self-demotion if it's the only admin
//     if (req.params.id === req.user._id.toString() && role !== 'admin') {
//       const adminCount = await User.countDocuments({ role: 'admin' });
//       if (adminCount <= 1) {
//         return res.status(400).json({ 
//           message: 'Cannot remove admin role from the only admin account' 
//         });
//       }
//     }

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { role },
//       { new: true, runValidators: true }
//     ).select('-password');

//     if (!user) {
//       return res.status(404).json({ 
//         message: 'User not found' 
//       });
//     }

//     res.json({
//       message: 'User role updated successfully',
//       user
//     });

//   } catch (error) {
//     console.error('Update user role error:', error);
    
//     if (error.name === 'CastError') {
//       return res.status(400).json({ 
//         message: 'Invalid user ID' 
//       });
//     }

//     res.status(500).json({ 
//       message: 'Server error while updating user role' 
//     });
//   }
// });

// // @route   PUT /api/users/:id/status
// // @desc    Update user status (Admin only)
// // @access  Private (Admin only)
// router.put('/:id/status', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: 'Access denied. Admin role required.' 
//       });
//     }

//     const { status } = req.body;

//     if (!status || !['active', 'inactive'].includes(status)) {
//       return res.status(400).json({ 
//         message: 'Valid status (active, inactive) is required' 
//       });
//     }

//     // Prevent self-deactivation
//     if (req.params.id === req.user._id.toString() && status === 'inactive') {
//       return res.status(400).json({ 
//         message: 'Cannot deactivate your own account' 
//       });
//     }

//     const user = await User.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     ).select('-password');

//     if (!user) {
//       return res.status(404).json({ 
//         message: 'User not found' 
//       });
//     }

//     res.json({
//       message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
//       user
//     });

//   } catch (error) {
//     console.error('Update user status error:', error);
    
//     if (error.name === 'CastError') {
//       return res.status(400).json({ 
//         message: 'Invalid user ID' 
//       });
//     }

//     res.status(500).json({ 
//       message: 'Server error while updating user status' 
//     });
//   }
// });

// // @route   DELETE /api/users/:id
// // @desc    Delete user account (Admin only)
// // @access  Private (Admin only)
// router.delete('/:id', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: 'Access denied. Admin role required.' 
//       });
//     }

//     // Prevent self-deletion
//     if (req.params.id === req.user._id.toString()) {
//       return res.status(400).json({ 
//         message: 'Cannot delete your own account' 
//       });
//     }

//     const user = await User.findById(req.params.id);

//     if (!user) {
//       return res.status(404).json({ 
//         message: 'User not found' 
//       });
//     }

//     // If deleting a teacher, also delete their notes
//     if (user.role === 'teacher') {
//       await Note.deleteMany({ uploadedBy: user._id });
//     }

//     await User.findByIdAndDelete(req.params.id);

//     res.json({ 
//       message: 'User account deleted successfully' 
//     });

//   } catch (error) {
//     console.error('Delete user error:', error);
    
//     if (error.name === 'CastError') {
//       return res.status(400).json({ 
//         message: 'Invalid user ID' 
//       });
//     }

//     res.status(500).json({ 
//       message: 'Server error while deleting user account' 
//     });
//   }
// });

// // @route   GET /api/users/:id/notes
// // @desc    Get notes uploaded by a specific user (Admin only)
// // @access  Private (Admin only)
// router.get('/:id/notes', auth, async (req, res) => {
//   try {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ 
//         message: 'Access denied. Admin role required.' 
//       });
//     }

//     const user = await User.findById(req.params.id);
    
//     if (!user) {
//       return res.status(404).json({ 
//         message: 'User not found' 
//       });
//     }

//     // Only teachers have uploaded notes
//     if (user.role !== 'teacher') {
//       return res.json({ 
//         notes: [], 
//         message: 'This user has not uploaded any notes' 
//       });
//     }

//     const notes = await Note.find({ uploadedBy: user._id })
//       .populate('uploadedBy', 'name email')
//       .sort({ createdAt: -1 });

//     const noteStats = await Note.aggregate([
//       { $match: { uploadedBy: user._id } },
//       {
//         $group: {
//           _id: null,
//           totalNotes: { $sum: 1 },
//           totalDownloads: { $sum: '$downloadCount' },
//           avgDownloads: { $avg: '$downloadCount' }
//         }
//       }
//     ]);

//     res.json({
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         department: user.department
//       },
//       notes,
//       stats: noteStats[0] || {
//         totalNotes: 0,
//         totalDownloads: 0,
//         avgDownloads: 0
//       }
//     });

//   } catch (error) {
//     console.error('Get user notes error:', error);
    
//     if (error.name === 'CastError') {
//       return res.status(400).json({ 
//         message: 'Invalid user ID' 
//       });
//     }

//     res.status(500).json({ 
//       message: 'Server error while fetching user notes' 
//     });
//   }
// });

// module.exports = router;
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Note = require('../models/Note');
const auth = require('../middleware/auth');  // Make sure this path is correct

const router = express.Router();

// @route   GET /api/users/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/profile/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
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
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (Admin only)
// @access  Private (Admin only)
router.get('/', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required.' 
      });
    }

    const { page = 1, limit = 10, role, department, search } = req.query;
    
    // Build filter object
    let filter = {};
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalUsers = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
      totalUsers
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching users' 
    });
  }
});

// @route   GET /api/users/stats
// @desc    Get users statistics
// @access  Private (Admin only)
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required.' 
      });
    }

    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalTeachers = await User.countDocuments({ role: 'teacher' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    
    const recentUsers = await User.find()
      .select('name email role department createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    // Department-wise statistics
    const departmentStats = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          students: {
            $sum: { $cond: [{ $eq: ['$role', 'student'] }, 1, 0] }
          },
          teachers: {
            $sum: { $cond: [{ $eq: ['$role', 'teacher'] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Registration trend (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const registrationTrend = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 30 }
    ]);

    res.json({
      success: true,
      totalUsers,
      totalStudents,
      totalTeachers,
      totalAdmins,
      recentUsers,
      departmentStats,
      registrationTrend
    });

  } catch (error) {
    console.error('Users stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching user statistics' 
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (Admin or own profile)
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    // Users can view their own profile, admins can view any profile
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. You can only view your own profile.' 
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      user 
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching user' 
    });
  }
});

// @route   POST /api/users/teachers
// @desc    Create a new teacher account (Admin only)
// @access  Private (Admin only)
router.post('/teachers', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required to create teacher accounts.' 
      });
    }

    const { name, email, password, department } = req.body;

    // Validation
    if (!name || !email || !password || !department) {
      return res.status(400).json({ 
        success: false,
        message: 'Please enter all required fields' 
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        success: false,
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User already exists with this email' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create teacher account
    const teacher = new User({
      name: name.trim(),
      email,
      password: hashedPassword,
      department,
      role: 'teacher'
    });

    await teacher.save();

    res.status(201).json({
      success: true,
      message: 'Teacher account created successfully',
      user: {
        id: teacher._id,
        name: teacher.name,
        email: teacher.email,
        role: teacher.role,
        department: teacher.department,
        createdAt: teacher.createdAt
      }
    });

  } catch (error) {
    console.error('Create teacher error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        message: 'Validation error', 
        errors: messages 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already exists' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error while creating teacher account' 
    });
  }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (Admin only)
// @access  Private (Admin only)
router.put('/:id/role', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required.' 
      });
    }

    const { role } = req.body;

    if (!role || !['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid role (student, teacher, admin) is required' 
      });
    }

    // Prevent self-demotion if it's the only admin
    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount <= 1) {
        return res.status(400).json({ 
          success: false,
          message: 'Cannot remove admin role from the only admin account' 
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'User role updated successfully',
      user
    });

  } catch (error) {
    console.error('Update user role error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error while updating user role' 
    });
  }
});

// @route   PUT /api/users/:id/status
// @desc    Update user status (Admin only)
// @access  Private (Admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required.' 
      });
    }

    const { status } = req.body;

    if (!status || !['active', 'inactive'].includes(status)) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid status (active, inactive) is required' 
      });
    }

    // Prevent self-deactivation
    if (req.params.id === req.user._id.toString() && status === 'inactive') {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot deactivate your own account' 
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: `User ${status === 'active' ? 'activated' : 'deactivated'} successfully`,
      user
    });

  } catch (error) {
    console.error('Update user status error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error while updating user status' 
    });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete user account (Admin only)
// @access  Private (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required.' 
      });
    }

    // Prevent self-deletion
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete your own account' 
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // If deleting a teacher, also delete their notes
    if (user.role === 'teacher') {
      await Note.deleteMany({ uploadedBy: user._id });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ 
      success: true,
      message: 'User account deleted successfully' 
    });

  } catch (error) {
    console.error('Delete user error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting user account' 
    });
  }
});

// @route   GET /api/users/:id/notes
// @desc    Get notes uploaded by a specific user (Admin only)
// @access  Private (Admin only)
router.get('/:id/notes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied. Admin role required.' 
      });
    }

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Only teachers have uploaded notes
    if (user.role !== 'teacher') {
      return res.json({ 
        success: true,
        notes: [], 
        message: 'This user has not uploaded any notes' 
      });
    }

    const notes = await Note.find({ uploadedBy: user._id })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    const noteStats = await Note.aggregate([
      { $match: { uploadedBy: user._id } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          totalDownloads: { $sum: '$downloadCount' },
          avgDownloads: { $avg: '$downloadCount' }
        }
      }
    ]);

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      },
      notes,
      stats: noteStats[0] || {
        totalNotes: 0,
        totalDownloads: 0,
        avgDownloads: 0
      }
    });

  } catch (error) {
    console.error('Get user notes error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID' 
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching user notes' 
    });
  }
});

module.exports = router;