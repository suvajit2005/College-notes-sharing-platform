import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const BrowseNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    semester: '',
    subject: ''
  });

  // Departments array (same as your backend)
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

  // Fetch all notes
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      
      // Build query parameters
      const queryParams = new URLSearchParams();
      if (filters.department) queryParams.append('department', filters.department);
      if (filters.semester) queryParams.append('semester', filters.semester);
      if (filters.subject) queryParams.append('subject', filters.subject);
      if (searchTerm) queryParams.append('search', searchTerm);

      const response = await fetch(`http://localhost:5000/api/notes?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setNotes(data.notes || []);
        setFilteredNotes(data.notes || []);
      } else {
        setError(data.message || 'Failed to fetch notes');
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Handle download
  const handleDownload = async (note) => {
    try {
      const token = localStorage.getItem('token');
      
      // Increment download count
      await fetch(`http://localhost:5000/api/notes/${note._id}/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Download the file
      const downloadUrl = `http://localhost:5000${note.filePath}`;
      window.open(downloadUrl, '_blank');
      
      // Refresh notes to update download count
      fetchNotes();
      
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
    }
  };

  const clearFilters = () => {
    setFilters({
      department: '',
      semester: '',
      subject: ''
    });
    setSearchTerm('');
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDepartmentColor = (department) => {
    const colors = {
      'Computer Science': '#4361ee',
      'Mathematics': '#3a0ca3',
      'Physics': '#7209b7',
      'Chemistry': '#f72585',
      'English': '#4895ef',
      'History': '#4cc9f0',
      'Botany': '#2ec4b6',
      'Zoology': '#e71d36',
      'Arts and Humanities': '#ff9e00',
      'Philosophy': '#8338ec',
      'default': '#6b7280'
    };
    return colors[department] || colors.default;
  };

  const getPopularityColor = (downloadCount) => {
    if (downloadCount > 200) return '#ef4444';
    if (downloadCount > 100) return '#f59e0b';
    if (downloadCount > 50) return '#10b981';
    return '#6b7280';
  };

  return (
    <div className="page-container">
      <div className="container">
        {/* Header Section */}
        <div className="browse-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Browse Study Materials</h1>
              <p className="page-subtitle">
                Discover notes from all teachers and departments
              </p>
            </div>
            <div className="header-stats">
              <div className="stat-badge">
                <div className="stat-number">{notes.length}</div>
                <div className="stat-label">Available Notes</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters Section */}
        <div className="search-filters-section">
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search notes by title, description, subject, or teacher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button
              onClick={clearFilters}
              className="clear-filters-btn"
            >
              Clear All Filters
            </button>
          </div>

          {/* Filters Section */}
          <div className="filters-section">
            <h3 className="filters-title">
              🔍 Filter Notes
            </h3>
            
            <div className="filters-grid">
              {/* Department Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => setFilters({...filters, department: e.target.value})}
                  className="filter-select"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  Semester
                </label>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters({...filters, semester: e.target.value})}
                  className="filter-select"
                >
                  <option value="">All Semesters</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              {/* Subject Filter */}
              <div className="filter-group">
                <label className="filter-label">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="Enter subject name..."
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  className="filter-input"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button 
              onClick={fetchNotes}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        {/* Results Count */}
        <div className="results-header">
          <h2 className="results-title">
            Available Study Materials
            {filteredNotes.length > 0 && (
              <span className="results-count">
                ({filteredNotes.length} notes found)
              </span>
            )}
          </h2>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3 className="loading-title">Loading Study Materials...</h3>
            <p className="loading-subtitle">
              Fetching notes from all departments
            </p>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3 className="empty-title">
              {notes.length === 0 ? 'No Notes Available' : 'No Notes Found'}
            </h3>
            <p className="empty-subtitle">
              {notes.length === 0 
                ? 'Teachers haven\'t uploaded any notes yet. Check back later!' 
                : 'Try adjusting your filters or search term.'
              }
            </p>
            {notes.length === 0 ? (
              <button
                onClick={fetchNotes}
                className="refresh-btn"
              >
                Refresh
              </button>
            ) : (
              <button
                onClick={clearFilters}
                className="refresh-btn"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="notes-grid">
            {filteredNotes.map(note => (
              <div
                key={note._id}
                className="note-card"
              >
                {/* Popularity Indicator */}
                <div 
                  className="popularity-indicator"
                  style={{ background: getPopularityColor(note.downloadCount || 0) }}
                ></div>

                {/* Note Header */}
                <div className="note-header">
                  <h3 className="note-title">
                    {note.title}
                  </h3>
                  {note.description && (
                    <p className="note-description">
                      {note.description}
                    </p>
                  )}
                </div>

                {/* Note Meta Info */}
                <div className="note-tags">
                  <span 
                    className="tag department-tag"
                    style={{ background: getDepartmentColor(note.department) }}
                  >
                    {note.department}
                  </span>
                  <span className="tag semester-tag">
                    Sem {note.semester}
                  </span>
                  <span className="tag subject-tag">
                    {note.subject}
                  </span>
                </div>

                {/* Note Details */}
                <div className="note-details">
                  <div className="detail-item">
                    <div className="detail-label">👨‍🏫 Teacher</div>
                    <div className="detail-value">{note.uploadedBy?.name || 'Unknown'}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">📊 Downloads</div>
                    <div className="detail-value">{(note.downloadCount || 0).toLocaleString()}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">📅 Uploaded</div>
                    <div className="detail-value">{formatDate(note.createdAt)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">💾 Size</div>
                    <div className="detail-value">{formatFileSize(note.fileSize)}</div>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(note)}
                  className="download-btn"
                >
                  <span>📥</span>
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .page-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 2rem 1rem;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header Styles */
        .browse-header {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(139, 92, 246, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
        }

        .page-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
        }

        .header-stats {
          display: flex;
          gap: 1rem;
        }

        .stat-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Search and Filters */
        .search-filters-section {
          background: white;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .search-section {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-container {
          flex: 1;
          min-width: 250px;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: #fff;
          box-sizing: border-box;
        }

        .search-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .clear-filters-btn {
          background: linear-gradient(135deg, #6b7280, #4b5563);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .clear-filters-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
        }

        .filters-section {
          padding: 1.5rem;
        }

        .filters-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 1rem;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
        }

        .filter-label {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .filter-select,
        .filter-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.9rem;
          background: #fff;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }

        .filter-select:focus,
        .filter-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        /* Error Message */
        .error-message {
          background: #fee2e2;
          border: 1px solid #fecaca;
          color: #dc2626;
          padding: 1rem;
          border-radius: 10px;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .retry-btn {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 5px;
          font-size: 0.8rem;
          cursor: pointer;
          margin-left: auto;
          white-space: nowrap;
        }

        /* Results Header */
        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .results-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .results-count {
          font-size: 1rem;
          color: #6b7280;
          font-weight: normal;
        }

        /* Loading State */
        .loading-state {
          background: white;
          padding: 4rem 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 3px solid #f3f4f6;
          border-top: 3px solid #8b5cf6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
        }

        .loading-title {
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .loading-subtitle {
          color: #6b7280;
          font-size: 0.9rem;
        }

        /* Empty State */
        .empty-state {
          background: white;
          padding: 4rem 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          color: #4b5563;
          margin-bottom: 0.5rem;
        }

        .empty-subtitle {
          color: #6b7280;
          margin-bottom: 1.5rem;
        }

        .refresh-btn {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
        }

        /* Notes Grid */
        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .note-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
          display: flex;
          flex-direction: column;
        }

        .note-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          border-color: #8b5cf6;
        }

        .popularity-indicator {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .note-header {
          margin-bottom: 1rem;
          flex: 1;
        }

        .note-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0 0 0.5rem 0;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .note-description {
          color: #6b7280;
          font-size: 0.9rem;
          margin: 0 0 1rem 0;
          line-height: 1.5;
          word-wrap: break-word;
        }

        .note-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          color: white;
          white-space: nowrap;
        }

        .department-tag {
          /* Color applied via style */
        }

        .semester-tag {
          background: #10b981;
        }

        .subject-tag {
          background: #f59e0b;
        }

        .note-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          font-weight: 500;
          word-break: break-word;
        }

        .download-btn {
          width: 100%;
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
          border: none;
          padding: 0.875rem 1.5rem;
          border-radius: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: auto;
        }

        .download-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }

          .notes-grid {
            grid-template-columns: 1fr;
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            min-width: auto;
            width: 100%;
          }

          .clear-filters-btn {
            width: 100%;
            text-align: center;
          }

          .filters-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .results-title {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.25rem;
          }
        }

        @media (max-width: 480px) {
          .container {
            padding: 0 0.5rem;
          }

          .browse-header {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .search-filters-section {
            margin: 0 -0.5rem 2rem;
            border-radius: 0;
          }

          .notes-grid {
            grid-template-columns: 1fr;
          }

          .note-card {
            padding: 1rem;
          }

          .note-details {
            grid-template-columns: 1fr;
            gap: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default BrowseNotes;