import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const MyDownloads = () => {
  const { user } = useAuth();
  const [downloadHistory, setDownloadHistory] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [sortBy, setSortBy] = useState('downloadedAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Fetch download history
  const fetchDownloadHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams({
        sortBy,
        sortOrder
      });

      const response = await fetch(`http://localhost:5000/api/notes/student/downloads?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDownloadHistory(data.downloadHistory || []);
        setStatistics(data.statistics || {});
        setPagination(data.pagination || {});
      } else {
        setError(data.message || 'Failed to fetch download history');
      }
    } catch (error) {
      console.error('Error fetching download history:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder]);

  // Add this useEffect to listen for download events - MOVED AFTER fetchDownloadHistory definition
  useEffect(() => {
    const handleStorageChange = () => {
      // Refresh download history when a new download happens
      fetchDownloadHistory();
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom events (from same tab)
    window.addEventListener('downloadCompleted', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('downloadCompleted', handleStorageChange);
    };
  }, [fetchDownloadHistory]);

  useEffect(() => {
    fetchDownloadHistory();
  }, [fetchDownloadHistory]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleDownloadAgain = async (note) => {
    try {
      const token = localStorage.getItem('token');
      
      // Call download endpoint
      await fetch(`http://localhost:5000/api/notes/${note._id}/download`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Download the file
      const downloadUrl = `http://localhost:5000${note.filePath}`;
      window.open(downloadUrl, '_blank');
      
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file. Please try again.');
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

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)} days ago`;
    } else {
      return formatDate(dateString);
    }
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

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3 className="loading-title">Loading Your Download History...</h3>
            <p className="loading-subtitle">Fetching your downloaded notes</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        {/* Header Section */}
        <div className="downloads-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">My Downloads</h1>
              <p className="page-subtitle">
                Track your downloaded study materials
              </p>
            </div>
            {statistics && (
              <div className="header-stats">
                <div className="stat-badge">
                  <div className="stat-number">{statistics.totalDownloads || 0}</div>
                  <div className="stat-label">Total Downloads</div>
                </div>
                <div className="stat-badge">
                  <div className="stat-number">{statistics.uniqueNotes || 0}</div>
                  <div className="stat-label">Unique Notes</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        {statistics && statistics.totalDownloads > 0 && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📥</div>
              <div className="stat-content">
                <div className="stat-number">{statistics.totalDownloads}</div>
                <div className="stat-label">Total Downloads</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <div className="stat-number">{statistics.uniqueNotes}</div>
                <div className="stat-label">Unique Notes</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🏫</div>
              <div className="stat-content">
                <div className="stat-number">{statistics.departments?.length || 0}</div>
                <div className="stat-label">Departments</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">🕒</div>
              <div className="stat-content">
                <div className="stat-value">
                  {statistics.lastDownload ? getTimeAgo(statistics.lastDownload) : 'Never'}
                </div>
                <div className="stat-label">Last Download</div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
            <button 
              onClick={fetchDownloadHistory}
              className="retry-btn"
            >
              Retry
            </button>
          </div>
        )}

        {/* Download History */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">
              Download History
              {downloadHistory.length > 0 && (
                <span className="results-count">
                  ({downloadHistory.length} items)
                </span>
              )}
            </h2>
            
            {downloadHistory.length > 0 && (
              <div className="sort-options">
                <span className="sort-label">Sort by:</span>
                <button 
                  onClick={() => handleSort('downloadedAt')}
                  className={`sort-btn ${sortBy === 'downloadedAt' ? 'active' : ''}`}
                >
                  Date {sortBy === 'downloadedAt' && (sortOrder === 'desc' ? '↓' : '↑')}
                </button>
              </div>
            )}
          </div>

          {downloadHistory.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📥</div>
              <h3 className="empty-title">No Downloads Yet</h3>
              <p className="empty-subtitle">
                {error ? 'Could not load download history' : 'Start downloading notes to see your history here'}
              </p>
              {!error && (
                <a href="/notes" className="btn btn-primary">
                  Browse Notes
                </a>
              )}
            </div>
          ) : (
            <div className="downloads-list">
              {downloadHistory.map((record) => (
                <div key={record._id} className="download-item">
                  <div className="download-main">
                    <div className="note-info">
                      <h3 className="note-title">
                        {record.note?.title || 'Unknown Note'}
                      </h3>
                      
                      <div className="note-meta">
                        <span 
                          className="meta-tag department"
                          style={{ background: getDepartmentColor(record.note?.department) }}
                        >
                          {record.note?.department || 'Unknown Department'}
                        </span>
                        <span className="meta-tag semester">
                          Sem {record.note?.semester || 'N/A'}
                        </span>
                        <span className="meta-tag subject">
                          {record.note?.subject || 'Unknown Subject'}
                        </span>
                      </div>

                      <div className="note-details">
                        <div className="detail">
                          <span className="detail-label">Teacher:</span>
                          <span className="detail-value">{record.note?.uploadedBy?.name || 'Unknown'}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">File Size:</span>
                          <span className="detail-value">{formatFileSize(record.note?.fileSize)}</span>
                        </div>
                        <div className="detail">
                          <span className="detail-label">Total Downloads:</span>
                          <span className="detail-value">{record.note?.downloadCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="download-info">
                      <div className="download-time">
                        <div className="time-ago">{getTimeAgo(record.downloadedAt)}</div>
                        <div className="exact-time">{formatDate(record.downloadedAt)}</div>
                      </div>
                      
                      <button
                        onClick={() => handleDownloadAgain(record.note)}
                        className="download-again-btn"
                      >
                        <span>📥</span>
                        Download Again
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="pagination">
            <button 
              disabled={!pagination.hasPrev}
              onClick={() => fetchDownloadHistory(pagination.currentPage - 1)}
              className="pagination-btn"
            >
              Previous
            </button>
            
            <span className="pagination-info">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            
            <button 
              disabled={!pagination.hasNext}
              onClick={() => fetchDownloadHistory(pagination.currentPage + 1)}
              className="pagination-btn"
            >
              Next
            </button>
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
          max-width: 1000px;
          margin: 0 auto;
        }

        /* Header Styles */
        .downloads-header {
          background: linear-gradient(135deg, #059669, #047857);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(5, 150, 105, 0.3);
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
          gap: 1.5rem;
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

        /* Stats Grid */
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

        .stat-number, .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
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
        }

        /* Content Section */
        .content-section {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .results-count {
          font-size: 1rem;
          color: #6b7280;
          font-weight: normal;
        }

        .sort-options {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .sort-label {
          font-size: 0.9rem;
          color: #6b7280;
        }

        .sort-btn {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sort-btn.active {
          background: #059669;
          color: white;
          border-color: #059669;
        }

        .sort-btn:hover {
          background: #e5e7eb;
        }

        .sort-btn.active:hover {
          background: #047857;
        }

        /* Downloads List */
        .downloads-list {
          space-y: 1rem;
        }

        .download-item {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.2s ease;
        }

        .download-item:hover {
          transform: translateX(5px);
        }

        .download-main {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .note-info {
          flex: 1;
        }

        .note-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1rem 0;
          line-height: 1.4;
        }

        .note-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .meta-tag {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          color: white;
        }

        .meta-tag.department {
          /* Color applied via style */
        }

        .meta-tag.semester {
          background: #059669;
        }

        .meta-tag.subject {
          background: #d97706;
        }

        .note-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          font-size: 0.9rem;
        }

        .detail {
          display: flex;
          flex-direction: column;
        }

        .detail-label {
          font-weight: 600;
          color: #6b7280;
          font-size: 0.8rem;
          margin-bottom: 0.25rem;
        }

        .detail-value {
          color: #374151;
          font-weight: 500;
        }

        .download-info {
          text-align: right;
          min-width: 150px;
        }

        .download-time {
          margin-bottom: 1rem;
        }

        .time-ago {
          font-weight: 600;
          color: #059669;
          margin-bottom: 0.25rem;
        }

        .exact-time {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .download-again-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .download-again-btn:hover {
          background: #047857;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }

        .empty-subtitle {
          font-size: 1rem;
          margin-bottom: 1.5rem;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
          padding: 1rem;
        }

        .pagination-btn {
          background: #059669;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .pagination-btn:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }

        .pagination-btn:not(:disabled):hover {
          background: #047857;
          transform: translateY(-2px);
        }

        .pagination-info {
          color: #6b7280;
          font-weight: 500;
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
          border-top: 3px solid #059669;
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

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }

        .btn-primary {
          background: #059669;
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

          .header-stats {
            justify-content: center;
          }

          .download-main {
            flex-direction: column;
          }

          .download-info {
            text-align: left;
            width: 100%;
          }

          .section-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .sort-options {
            width: 100%;
            justify-content: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default MyDownloads;