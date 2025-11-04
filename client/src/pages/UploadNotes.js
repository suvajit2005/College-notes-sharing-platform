// import React from 'react';

// const UploadNotes = () => {
//   return (
//     <div className="page-container">
//       <h1 className="page-title">Upload Notes</h1>
//       <p className="page-subtitle">Upload PDF notes for your students</p>
      
//       <div className="card">
//         <h2 className="card-title">Upload New Notes</h2>
//         <p>Teacher upload form will go here...</p>
//       </div>
//     </div>
//   );
// };

// export default UploadNotes;
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const UploadNotes = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    semester: '',
    subject: ''
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Departments array (same as backend)
  const departments = [
    'Arts and Humanities',
    'History',
    'Philosophy',
    'Sanskrit',
    'English', 
    'Bengali',
    'Journalism and Mass Communication',
    'Botany',
    'Zoology',
    'Chemistry',
    'Physics',
    'Mathematics',
    'Computer Science',
    'Geography',
    'Physiology',
    'Computer Application (BCA)',
    'Performing Arts',
    'Visual Arts',
    'Postgraduate Diploma in Yoga',
    'Travel & Tourism Management'
  ];

  const semesters = ['1', '2', '3', '4', '5', '6'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file only');
      setFile(null);
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!file) {
    setError('Please select a PDF file');
    return;
  }

  if (!formData.title || !formData.department || !formData.semester || !formData.subject) {
    setError('Please fill all required fields');
    return;
  }

  setLoading(true);
  setError('');
  setMessage('');

  try {
    const token = localStorage.getItem('token');
    const submitData = new FormData();
    
    // Append form data
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('department', formData.department);
    submitData.append('semester', formData.semester);
    submitData.append('subject', formData.subject);
    submitData.append('file', file);

    console.log('Sending upload request...');

    const response = await fetch('https://college-notes-sharing-platform-backend.onrender.com/api/notes/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: submitData
    });

    // First, check if response is JSON
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // If not JSON, get the text to see what the error is
      const text = await response.text();
      console.error('Non-JSON response:', text);
      throw new Error(`Server returned: ${response.status} ${response.statusText}`);
    }

    if (response.ok && data.success) {
      setMessage('Notes uploaded successfully!');
      // Reset form
      setFormData({
        title: '',
        description: '',
        department: '',
        semester: '',
        subject: ''
      });
      setFile(null);
      document.getElementById('file-input').value = '';
    } else {
      setError(data.message || `Upload failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Upload error:', error);
    setError(`Upload failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div className="upload-header">
          <h1 className="page-title">Upload Notes</h1>
          <p className="page-subtitle">
            Share study materials with your students
          </p>
        </div>

        {/* Upload Form */}
        <div className="upload-form-container">
          <form onSubmit={handleSubmit} className="upload-form">
            {/* Title Input */}
            <div className="form-group">
              <label className="form-label">
                Note Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter note title..."
                className="form-input"
                required
              />
            </div>

            {/* Description Input */}
            <div className="form-group">
              <label className="form-label">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter note description (optional)..."
                className="form-textarea"
                rows="3"
              />
            </div>

            {/* Department Selection */}
            <div className="form-group">
              <label className="form-label">
                Department *
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="form-select"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Semester and Subject Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Subject *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder="Enter subject name..."
                  className="form-input"
                  required
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="form-group">
              <label className="form-label">
                PDF File *
              </label>
              <div className="file-upload-container">
                <input
                  id="file-input"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="file-input" className="file-upload-label">
                  <span className="file-icon">📁</span>
                  <span className="file-text">
                    {file ? file.name : 'Choose PDF file'}
                  </span>
                </label>
              </div>
              <p className="file-hint">
                Only PDF files are allowed (Max: 10MB)
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            {message && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {message}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`submit-btn ${loading ? 'loading' : ''}`}
            >
              {loading ? (
                <>
                  <span className="btn-spinner"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <span className="btn-icon">📤</span>
                  Upload Notes
                </>
              )}
            </button>
          </form>

          {/* Upload Guidelines */}
          <div className="guidelines-card">
            <h3 className="guidelines-title">📋 Upload Guidelines</h3>
            <ul className="guidelines-list">
              <li>Only PDF files are accepted</li>
              <li>Maximum file size: 10MB</li>
              <li>Ensure the content is relevant and accurate</li>
              <li>Use clear and descriptive titles</li>
              <li>Select the correct department and semester</li>
              <li>Files will be available to all students immediately</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem 1rem;
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
        }

        .upload-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea, #764ba2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1.1rem;
          color: #6b7280;
        }

        .upload-form-container {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          align-items: start;
        }

        @media (max-width: 768px) {
          .upload-form-container {
            grid-template-columns: 1fr;
          }
        }

        .upload-form {
          background: white;
          padding: 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        @media (max-width: 480px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }

        .form-label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-input,
        .form-select,
        .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: white;
          box-sizing: border-box;
        }

        .form-input:focus,
        .form-select:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        /* Neon Blue Hover Effects */
        .form-input:hover,
        .form-select:hover,
        .form-textarea:hover {
          border-color: #3b82f6;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        .form-input:focus:hover,
        .form-select:focus:hover,
        .form-textarea:focus:hover {
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5), 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .file-upload-container {
          position: relative;
        }

        .file-input {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }

        .file-upload-label {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border: 2px dashed #d1d5db;
          border-radius: 8px;
          background: #f9fafb;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .file-upload-label:hover {
          border-color: #3b82f6;
          background: #f0f7ff;
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
        }

        .file-icon {
          font-size: 1.5rem;
        }

        .file-text {
          color: #6b7280;
          font-size: 0.9rem;
        }

        .file-hint {
          font-size: 0.8rem;
          color: #9ca3af;
          margin-top: 0.5rem;
        }

        .error-message {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .success-message {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #16a34a;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #3b82f6, #1d4ed8);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(59, 130, 246, 0.5);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn.loading {
          background: linear-gradient(135deg, #6b7280, #4b5563);
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .guidelines-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          height: fit-content;
        }

        .guidelines-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .guidelines-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .guidelines-list li {
          padding: 0.5rem 0;
          color: #6b7280;
          border-bottom: 1px solid #f3f4f6;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .guidelines-list li:before {
          content: '•';
          color: #3b82f6;
          font-weight: bold;
        }

        .guidelines-list li:last-child {
          border-bottom: none;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};


export default UploadNotes;
