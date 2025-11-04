const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
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
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);