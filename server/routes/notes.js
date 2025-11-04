const express = require('express');
const Note = require('../models/Note');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const router = express.Router();

// Upload note (Teacher only)
router.post('/upload', auth, upload.single('file'), async (req, res) => {
  try {
    console.log('📥 Upload request received');
    console.log('📄 File:', req.file);
    console.log('📝 Body:', req.body);
    console.log('👤 User:', req.user);

    // Check if user is teacher
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        success: false,
        message: 'Only teachers can upload notes' 
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded. Please select a PDF file.'
      });
    }

    // Validate required fields
    const { title, department, semester, subject } = req.body;
    if (!title || !department || !semester || !subject) {
      return res.status(400).json({
        success: false,
        message: 'Please fill all required fields: title, department, semester, subject'
      });
    }

    // Create new note
    const note = new Note({
      title: title.trim(),
      description: req.body.description || '',
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: '/uploads/' + req.file.filename,
      fileSize: req.file.size,
      department: department,
      semester: semester,
      subject: subject.trim(),
      uploadedBy: req.user.id
    });

    await note.save();
    await note.populate('uploadedBy', 'name email');
    
    console.log('✅ Note uploaded successfully:', note.title);
    
    res.status(201).json({ 
      success: true,
      message: 'Note uploaded successfully', 
      note 
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during upload processing',
      error: error.message 
    });
  }
});

// Get all notes with filters (for students)
router.get('/', auth, async (req, res) => {
  try {
    const { department, semester, subject, search } = req.query;
    let filter = {};
    
    if (department) filter.department = department;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    
    // Search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      notes,
      total: notes.length
    });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching notes',
      error: error.message 
    });
  }
});

// Download note and increment count
// router.post('/:id/download', auth, async (req, res) => {
//   try {
//     const note = await Note.findById(req.params.id)
//       .populate('uploadedBy', 'name email');
    
//     if (!note) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'Note not found' 
//       });
//     }

//     // Increment download count
//     note.downloadCount += 1;
//     await note.save();

//     // Construct the file path
//     const filePath = path.join(__dirname, '..', 'uploads', note.filename);
    
//     // Check if file exists
//     if (!fs.existsSync(filePath)) {
//       return res.status(404).json({
//         success: false,
//         message: 'File not found on server'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Download prepared successfully',
//       note: {
//         _id: note._id,
//         title: note.title,
//         filePath: '/uploads/' + note.filename,
//         downloadCount: note.downloadCount
//       }
//     });

//   } catch (error) {
//     console.error('Download error:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error during download',
//       error: error.message 
//     });
//   }
// });
// Download note and record history
router.post('/:id/download', auth, async (req, res) => {
  try {
    console.log('Download request received for note:', req.params.id);
    console.log('User making download:', req.user.id, req.user.name);

    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!note) {
      console.log('Note not found:', req.params.id);
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }

    console.log('Note found:', note.title);

    // Increment download count
    note.downloadCount += 1;
    await note.save();
    console.log('Download count incremented to:', note.downloadCount);

    // Record download history (allow duplicates for same user/note)
    try {
      const downloadRecord = new DownloadHistory({
        student: req.user.id,
        note: note._id,
        ipAddress: req.ip || req.connection.remoteAddress || 'Unknown',
        userAgent: req.get('User-Agent') || 'Unknown'
      });
      
      await downloadRecord.save();
      console.log('Download history recorded successfully for user:', req.user.id);
      
    } catch (historyError) {
      console.log('Download history recording error:', historyError.message);
      // Continue even if history recording fails - don't block the download
    }

    // Construct the file path
    const filePath = path.join(__dirname, '..', 'uploads', note.filename);
    console.log('File path:', filePath);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.log('File not found at path:', filePath);
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    console.log('Download successful for note:', note.title);
    
    res.json({
      success: true,
      message: 'Download prepared successfully',
      note: {
        _id: note._id,
        title: note.title,
        filePath: '/uploads/' + note.filename,
        downloadCount: note.downloadCount
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during download',
      error: error.message 
    });
  }
});
// Get note by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }

    res.json({
      success: true,
      note
    });
  } catch (error) {
    console.error('Get note by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching note',
      error: error.message 
    });
  }
});

// Get notes by teacher (for teacher dashboard)
router.get('/teacher/my-notes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        success: false,
        message: 'Only teachers can access this endpoint' 
      });
    }

    const notes = await Note.find({ uploadedBy: req.user.id })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      notes,
      total: notes.length
    });
  } catch (error) {
    console.error('Get teacher notes error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching teacher notes',
      error: error.message 
    });
  }
});

// Delete note (Teacher only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }

    // Check if user owns the note or is admin
    if (note.uploadedBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to delete this note' 
      });
    }

    // Delete the physical file
    const filePath = path.join(__dirname, '..', 'uploads', note.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    await Note.findByIdAndDelete(req.params.id);
    
    res.json({ 
      success: true,
      message: 'Note deleted successfully' 
    });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while deleting note',
      error: error.message 
    });
  }
});

// Test route to verify notes routes are working
router.get('/test/connection', (req, res) => {
  res.json({
    success: true,
    message: 'Notes routes are working correctly!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'POST /api/notes/upload',
      'GET /api/notes',
      'POST /api/notes/:id/download',
      'GET /api/notes/teacher/my-notes'
    ]
  });
});

// for analytics page 
// Get teacher analytics
// for analytics page 
// Get teacher analytics
// Simple and reliable analytics route
router.get('/teacher/analytics', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        success: false,
        message: 'Only teachers can access analytics' 
      });
    }

    const teacherId = req.user.id;

    console.log('📊 Analytics requested for teacher:', teacherId);

    // Get all teacher's notes using regular find (no aggregation)
    const teacherNotes = await Note.find({ uploadedBy: teacherId })
      .populate('uploadedBy', 'name email');

    console.log('📝 Teacher notes found:', teacherNotes.length);

    // If no notes, return empty analytics
    if (teacherNotes.length === 0) {
      return res.json({
        success: true,
        analytics: {
          overview: {
            totalNotes: 0,
            totalDownloads: 0,
            avgDownloads: 0,
            mostDownloaded: 0,
            totalFileSize: 0
          },
          departmentStats: [],
          semesterStats: [],
          subjectStats: [],
          popularNotes: [],
          recentActivity: [],
          engagementRate: 0
        }
      });
    }

    // Calculate overview stats manually
    const totalNotes = teacherNotes.length;
    const totalDownloads = teacherNotes.reduce((sum, note) => sum + (note.downloadCount || 0), 0);
    const avgDownloads = totalNotes > 0 ? totalDownloads / totalNotes : 0;
    const mostDownloaded = Math.max(...teacherNotes.map(note => note.downloadCount || 0), 0);
    const totalFileSize = teacherNotes.reduce((sum, note) => sum + (note.fileSize || 0), 0);

    // Calculate department stats manually
    const departmentMap = {};
    teacherNotes.forEach(note => {
      const dept = note.department || 'Unknown';
      if (!departmentMap[dept]) {
        departmentMap[dept] = {
          noteCount: 0,
          totalDownloads: 0,
          notes: []
        };
      }
      departmentMap[dept].noteCount++;
      departmentMap[dept].totalDownloads += note.downloadCount || 0;
    });

    const departmentStats = Object.keys(departmentMap).map(dept => ({
      _id: dept,
      noteCount: departmentMap[dept].noteCount,
      totalDownloads: departmentMap[dept].totalDownloads,
      avgDownloads: departmentMap[dept].totalDownloads / departmentMap[dept].noteCount
    })).sort((a, b) => b.totalDownloads - a.totalDownloads);

    // Calculate semester stats manually
    const semesterMap = {};
    teacherNotes.forEach(note => {
      const sem = note.semester || 'Unknown';
      if (!semesterMap[sem]) {
        semesterMap[sem] = {
          noteCount: 0,
          totalDownloads: 0,
        };
      }
      semesterMap[sem].noteCount++;
      semesterMap[sem].totalDownloads += note.downloadCount || 0;
    });

    const semesterStats = Object.keys(semesterMap).map(sem => ({
      _id: sem,
      noteCount: semesterMap[sem].noteCount,
      totalDownloads: semesterMap[sem].totalDownloads,
      avgDownloads: semesterMap[sem].totalDownloads / semesterMap[sem].noteCount
    })).sort((a, b) => a._id - b._id);

    // Calculate subject stats manually
    const subjectMap = {};
    teacherNotes.forEach(note => {
      const subject = note.subject || 'Unknown';
      if (!subjectMap[subject]) {
        subjectMap[subject] = {
          noteCount: 0,
          totalDownloads: 0,
        };
      }
      subjectMap[subject].noteCount++;
      subjectMap[subject].totalDownloads += note.downloadCount || 0;
    });

    const subjectStats = Object.keys(subjectMap).map(subject => ({
      _id: subject,
      noteCount: subjectMap[subject].noteCount,
      totalDownloads: subjectMap[subject].totalDownloads,
      avgDownloads: subjectMap[subject].totalDownloads / subjectMap[subject].noteCount
    })).sort((a, b) => b.totalDownloads - a.totalDownloads).slice(0, 15);

    // Get popular notes (already sorted by download count)
    const popularNotes = [...teacherNotes]
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, 10);

    // Calculate recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentNotes = teacherNotes.filter(note => 
      new Date(note.createdAt) >= thirtyDaysAgo
    );
    
    const recentActivityMap = {};
    recentNotes.forEach(note => {
      const date = new Date(note.createdAt).toISOString().split('T')[0];
      if (!recentActivityMap[date]) {
        recentActivityMap[date] = {
          notesUploaded: 0,
          downloads: 0
        };
      }
      recentActivityMap[date].notesUploaded++;
      recentActivityMap[date].downloads += note.downloadCount || 0;
    });

    const recentActivity = Object.keys(recentActivityMap).map(date => ({
      _id: date,
      notesUploaded: recentActivityMap[date].notesUploaded,
      downloads: recentActivityMap[date].downloads
    })).sort((a, b) => a._id.localeCompare(b._id));

    console.log('✅ Final analytics data calculated:', {
      totalNotes,
      totalDownloads,
      avgDownloads,
      mostDownloaded
    });

    res.json({
      success: true,
      analytics: {
        overview: {
          totalNotes,
          totalDownloads,
          avgDownloads: Math.round(avgDownloads * 100) / 100,
          mostDownloaded,
          totalFileSize
        },
        departmentStats,
        semesterStats,
        subjectStats,
        popularNotes,
        recentActivity,
        engagementRate: Math.round(avgDownloads * 100) / 100
      }
    });

  } catch (error) {
    console.error('❌ Analytics error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching analytics',
      error: error.message 
    });
  }
});
/// get teacher dashboard data 
// Get teacher dashboard data
router.get('/teacher/dashboard', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        success: false,
        message: 'Only teachers can access dashboard' 
      });
    }

    const teacherId = req.user.id;

    // Get teacher's uploaded notes
    const teacherNotes = await Note.find({ uploadedBy: teacherId })
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(5); // Only recent 5 notes for dashboard

    // Get teacher statistics
    const stats = await Note.aggregate([
      { $match: { uploadedBy: teacherId } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          totalDownloads: { $sum: '$downloadCount' },
          avgDownloads: { $avg: '$downloadCount' },
          mostDownloaded: { $max: '$downloadCount' }
        }
      }
    ]);

    // Get department distribution for teacher
    const departmentStats = await Note.aggregate([
      { $match: { uploadedBy: teacherId } },
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
          downloads: { $sum: '$downloadCount' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const dashboardStats = stats[0] || {
      totalNotes: 0,
      totalDownloads: 0,
      avgDownloads: 0,
      mostDownloaded: 0
    };

    res.json({
      success: true,
      dashboard: {
        stats: {
          totalNotes: dashboardStats.totalNotes,
          totalDownloads: dashboardStats.totalDownloads,
          avgDownloads: Math.round(dashboardStats.avgDownloads * 100) / 100,
          mostDownloaded: dashboardStats.mostDownloaded
        },
        recentNotes: teacherNotes,
        departmentStats: departmentStats,
        teacher: {
          name: req.user.name,
          email: req.user.email,
          department: req.user.department
        }
      }
    });

  } catch (error) {
    console.error('Teacher dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching dashboard data',
      error: error.message 
    });
  }
});
//download history of the student section
const DownloadHistory = require('../models/DownloadHistory');

// Update the existing download route
router.post('/:id/download', auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id)
      .populate('uploadedBy', 'name email');
    
    if (!note) {
      return res.status(404).json({ 
        success: false,
        message: 'Note not found' 
      });
    }

    // Increment download count
    note.downloadCount += 1;
    await note.save();

    // Record download history
    try {
      const downloadRecord = new DownloadHistory({
        student: req.user.id,
        note: note._id,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent') || 'Unknown'
      });
      await downloadRecord.save();
    } catch (historyError) {
      console.log('Download history recording skipped (possible duplicate):', historyError.message);
    }

    // Construct the file path
    const filePath = path.join(__dirname, '..', 'uploads', note.filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on server'
      });
    }

    res.json({
      success: true,
      message: 'Download prepared successfully',
      note: {
        _id: note._id,
        title: note.title,
        filePath: '/uploads/' + note.filename,
        downloadCount: note.downloadCount
      }
    });

  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during download',
      error: error.message 
    });
  }
});
//notes fetching 
// Get student's download history
router.get('/student/downloads', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, sortBy = 'downloadedAt', sortOrder = 'desc' } = req.query;
    
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const downloadHistory = await DownloadHistory.find({ student: req.user.id })
      .populate({
        path: 'note',
        populate: {
          path: 'uploadedBy',
          select: 'name email'
        }
      })
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalDownloads = await DownloadHistory.countDocuments({ student: req.user.id });

    // Get download statistics
    const stats = await DownloadHistory.aggregate([
      { $match: { student: req.user._id } },
      {
        $lookup: {
          from: 'notes',
          localField: 'note',
          foreignField: '_id',
          as: 'noteData'
        }
      },
      { $unwind: '$noteData' },
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: 1 },
          uniqueNotes: { $addToSet: '$note' },
          departments: { $addToSet: '$noteData.department' },
          lastDownload: { $max: '$downloadedAt' }
        }
      }
    ]);

    const statistics = stats[0] || {
      totalDownloads: 0,
      uniqueNotes: [],
      departments: [],
      lastDownload: null
    };

    res.json({
      success: true,
      downloadHistory,
      statistics: {
        totalDownloads: statistics.totalDownloads,
        uniqueNotes: statistics.uniqueNotes.length,
        departments: statistics.departments,
        lastDownload: statistics.lastDownload
      },
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalDownloads / limit),
        totalDownloads,
        hasNext: page < Math.ceil(totalDownloads / limit),
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get download history error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching download history',
      error: error.message 
    });
  }
});
// Get teacher's uploaded notes
router.get('/teacher/uploads', auth, async (req, res) => {
  try {
    if (req.user.role !== 'teacher') {
      return res.status(403).json({ 
        success: false,
        message: 'Only teachers can access this endpoint' 
      });
    }

    const { page = 1, limit = 10, search = '' } = req.query;
    
    let filter = { uploadedBy: req.user.id };
    
    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }

    const notes = await Note.find(filter)
      .populate('uploadedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalNotes = await Note.countDocuments(filter);

    // Calculate statistics
    const stats = await Note.aggregate([
      { $match: { uploadedBy: req.user._id } },
      {
        $group: {
          _id: null,
          totalNotes: { $sum: 1 },
          totalDownloads: { $sum: '$downloadCount' },
          avgDownloads: { $avg: '$downloadCount' },
          mostDownloaded: { $max: '$downloadCount' }
        }
      }
    ]);

    res.json({
      success: true,
      notes,
      totalNotes,
      totalPages: Math.ceil(totalNotes / limit),
      currentPage: parseInt(page),
      stats: stats[0] || {
        totalNotes: 0,
        totalDownloads: 0,
        avgDownloads: 0,
        mostDownloaded: 0
      }
    });

  } catch (error) {
    console.error('Get teacher uploads error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error while fetching uploads',
      error: error.message 
    });
  }
});

//check
// Test download history
router.get('/test/download-history', auth, async (req, res) => {
  try {
    const testRecord = new DownloadHistory({
      student: req.user.id,
      note: '65a1b2c3d4e5f6a7b8c9d0e1', // Use a real note ID from your database
      ipAddress: '127.0.0.1',
      userAgent: 'Test Agent'
    });
    
    await testRecord.save();
    
    const historyCount = await DownloadHistory.countDocuments({ student: req.user.id });
    
    res.json({
      success: true,
      message: 'Test download history recorded',
      historyCount,
      testRecord
    });
    
  } catch (error) {
    console.error('Test download history error:', error);
    res.status(500).json({
      success: false,
      message: 'Test failed',
      error: error.message
    });
  }
});


module.exports = router;