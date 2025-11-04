import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const MyUploads = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    totalNotes: 0,
    totalDownloads: 0,
    avgDownloads: 0,
    mostDownloaded: 0
  });

  // Fetch teacher's uploaded notes
  const fetchMyUploads = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);

      const response = await fetch(`https://college-notes-sharing-platform-backend.onrender.com/api/notes/teacher/uploads?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setNotes(data.notes || []);
        setStats(data.stats || {});
      } else {
        setError(data.message || 'Failed to fetch your uploads');
      }
    } catch (error) {
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyUploads();
  }, [searchTerm]);

  const clearSearch = () => {
    console.log('Clear search clicked'); // Debug log
    setSearchTerm('');
  };

  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (response.ok && data.success) {
        // Remove the note from the list
        setNotes(prevNotes => prevNotes.filter(note => note._id !== noteId));
        // Refresh stats
        fetchMyUploads();
      } else {
        alert(data.message || 'Failed to delete note');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Error deleting note. Please try again.');
    }
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPopularityColor = (downloadCount) => {
    if (downloadCount > 100) return '#ef4444';
    if (downloadCount > 50) return '#f59e0b';
    if (downloadCount > 10) return '#10b981';
    return '#6b7280';
  };

  return (
    <div className="page-container">
      <div className="container">
        {/* Header Section */}
        <div className="upload-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">My Uploads</h1>
              <p className="page-subtitle">
                Manage your uploaded study materials
              </p>
            </div>
            <a href="/upload" className="btn btn-primary">
              <span>📤</span>
              Upload New Notes
            </a>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalNotes}</div>
              <div className="stat-label">Total Notes</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.totalDownloads}</div>
              <div className="stat-label">Total Downloads</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{Math.round(stats.avgDownloads)}</div>
              <div className="stat-label">Avg. Downloads</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.mostDownloaded}</div>
              <div className="stat-label">Most Downloaded</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search your uploads by title, subject, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          <button
            onClick={clearSearch}
            className="clear-search-btn"
            disabled={!searchTerm}
          >
            Clear Search
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button 
              onClick={fetchMyUploads}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        {/* Notes List */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3 className="loading-title">Loading Your Uploads...</h3>
            <p className="loading-subtitle">
              Fetching your uploaded notes from the server
            </p>
          </div>
        ) : notes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3 className="empty-title">
              {searchTerm ? 'No matching uploads found' : 'No Uploads Yet'}
            </h3>
            <p className="empty-subtitle">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start sharing knowledge with your students by uploading study materials'
              }
            </p>
            {!searchTerm && (
              <a href="/upload" className="btn btn-primary">
                Upload Your First Notes
              </a>
            )}
          </div>
        ) : (
          <div className="uploads-grid">
            {notes.map(note => (
              <div key={note._id} className="upload-card">
                {/* Popularity Indicator */}
                <div 
                  className="popularity-indicator"
                  style={{ background: getPopularityColor(note.downloadCount || 0) }}
                ></div>

                {/* Note Header */}
                <div className="note-header">
                  <h3 className="note-title">{note.title}</h3>
                  {note.description && (
                    <p className="note-description">{note.description}</p>
                  )}
                </div>

                {/* Note Meta Info */}
                <div className="note-tags">
                  <span className="tag department-tag">{note.department}</span>
                  <span className="tag semester-tag">Sem {note.semester}</span>
                  <span className="tag subject-tag">{note.subject}</span>
                </div>

                {/* Note Details */}
                <div className="note-details">
                  <div className="detail-item">
                    <div className="detail-label">📥 Downloads</div>
                    <div className="detail-value">{note.downloadCount || 0}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">💾 Size</div>
                    <div className="detail-value">{formatFileSize(note.fileSize)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">📅 Uploaded</div>
                    <div className="detail-value">{formatDate(note.createdAt)}</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">👤 Students</div>
                    <div className="detail-value">
                      {note.downloadCount > 0 ? 'Helping students' : 'Waiting for downloads'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="action-buttons">
                  <button
                    onClick={() => window.open(`http://localhost:5000${note.filePath}`, '_blank')}
                    className="btn btn-secondary"
                  >
                    <span>👁️</span>
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(note._id)}
                    className="btn btn-danger"
                  >
                    <span>🗑️</span>
                    Delete
                  </button>
                </div>
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
          position: relative;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
        }

        .upload-header {
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

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .search-section {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
          position: relative;
          z-index: 10;
        }

        .search-container {
          flex: 1;
          min-width: 250px;
          position: relative;
          z-index: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.9rem;
          transition: all 0.3s ease;
          background: white;
          box-sizing: border-box;
          position: relative;
          z-index: 1;
        }

        .search-input:focus {
          outline: none;
          border-color: #8b5cf6;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }

        .clear-search-btn {
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
          position: relative;
          z-index: 10;
        }

        .clear-search-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(107, 114, 128, 0.4);
        }

        .clear-search-btn:disabled {
          background: #d1d5db;
          color: #9ca3af;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
          pointer-events: none;
        }

        .clear-search-btn:not(:disabled) {
          pointer-events: auto;
        }

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
          position: relative;
          z-index: 5;
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

        .loading-state, .empty-state {
          background: white;
          padding: 4rem 2rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-align: center;
          position: relative;
          z-index: 5;
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

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .uploads-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
          position: relative;
          z-index: 5;
        }

        .upload-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          border: 2px solid transparent;
          position: relative;
        }

        .upload-card:hover {
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
          background: #8b5cf6;
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
          word-break: break-word;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          flex: 1;
          justify-content: center;
          position: relative;
          z-index: 1;
        }

        .btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #7c3aed);
          color: white;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-danger {
          background: #dc2626;
          color: white;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            text-align: center;
          }
          
          .uploads-grid {
            grid-template-columns: 1fr;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .search-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-container {
            min-width: auto;
          }

          .clear-search-btn {
            width: 100%;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .note-details {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};


export default MyUploads;
