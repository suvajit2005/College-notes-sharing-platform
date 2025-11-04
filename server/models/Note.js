const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  filename: {
    type: String,
    required: true
  },
  originalName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileSize: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true,
    enum: [
      // Arts and Humanities
      'Arts and Humanities',
      'History',
      'Philosophy',
      'Sanskrit',
      'English',
      'Bengali',
      'Journalism and Mass Communication',
      
      // Sciences
      'Botany',
      'Zoology',
      'Chemistry',
      'Physics',
      'Mathematics',
      'Computer Science',
      'Geography',
      'Physiology',
      
      // Professional Courses
      'Computer Application (BCA)',
      'Performing Arts',
      'Visual Arts',
      
      // Postgraduate Diplomas
      'Postgraduate Diploma in Yoga',
      'Travel & Tourism Management'
    ]
  },
  semester: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6']
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Subject cannot exceed 50 characters']
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  downloadCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Populate uploadedBy field automatically
noteSchema.pre('find', function() {
  this.populate('uploadedBy', 'name email');
});

noteSchema.pre('findOne', function() {
  this.populate('uploadedBy', 'name email');
});

module.exports = mongoose.model('Note', noteSchema);