const mongoose = require('mongoose');

const downloadHistorySchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Note',
    required: true
  },
  downloadedAt: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    default: 'Unknown'
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  }
}, {
  timestamps: true
});

// Remove the unique index to allow multiple downloads of same note by same user
// downloadHistorySchema.index({ student: 1, note: 1 }, { unique: true });

// Populate note and student automatically
downloadHistorySchema.pre('find', function() {
  this.populate('note', 'title department semester subject downloadCount fileSize uploadedBy')
     .populate('student', 'name email');
});

downloadHistorySchema.pre('findOne', function() {
  this.populate('note', 'title department semester subject downloadCount fileSize uploadedBy')
     .populate('student', 'name email');
});

module.exports = mongoose.model('DownloadHistory', downloadHistorySchema);