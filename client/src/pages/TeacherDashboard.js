import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch teacher dashboard data
  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://college-notes-sharing-platform-backend.onrender.com/api/notes/teacher/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setDashboardData(data.dashboard);
      } else {
        setError(data.message || 'Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
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

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3 className="loading-title">Loading Your Dashboard...</h3>
            <p className="loading-subtitle">Preparing your teaching insights</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="error-state">
            <div className="error-icon">📊</div>
            <h3 className="error-title">Dashboard Unavailable</h3>
            <p className="error-subtitle">{error}</p>
            <button onClick={fetchDashboardData} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">👨‍🏫</div>
            <h3 className="empty-title">Welcome to Your Teacher Dashboard</h3>
            <p className="empty-subtitle">
              Start your teaching journey by uploading study materials for your students
            </p>
            <Link to="/upload" className="btn btn-primary">
              Upload Your First Notes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { stats, recentNotes, departmentStats, teacher } = dashboardData;

  return (
    <div className="page-container">
      <div className="container">
        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Teacher Dashboard</h1>
              <p className="page-subtitle">
                Welcome back, {teacher.name}! Here's your teaching overview.
              </p>
            </div>
            <div className="teacher-info">
              <div className="teacher-badge">
                <span className="teacher-icon">👨‍🏫</span>
                <div>
                  <div className="teacher-name">{teacher.name}</div>
                  <div className="teacher-department">{teacher.department}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <div className="stat-number">{formatNumber(stats.totalNotes)}</div>
              <div className="stat-label">Total Notes</div>
            </div>
          </div>
          
          <div className="stat-card success">
            <div className="stat-icon">📥</div>
            <div className="stat-content">
              <div className="stat-number">{formatNumber(stats.totalDownloads)}</div>
              <div className="stat-label">Total Downloads</div>
            </div>
          </div>
          
          <div className="stat-card warning">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-number">{stats.avgDownloads}</div>
              <div className="stat-label">Avg. Downloads</div>
            </div>
          </div>
          
          <div className="stat-card info">
            <div className="stat-icon">🔥</div>
            <div className="stat-content">
              <div className="stat-number">{formatNumber(stats.mostDownloaded)}</div>
              <div className="stat-label">Most Popular</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/upload" className="action-card primary">
              <div className="action-icon">📤</div>
              <div className="action-content">
                <h3 className="action-title">Upload Notes</h3>
                <p className="action-description">Share new study materials with students</p>
              </div>
            </Link>
            
            <Link to="/my-uploads" className="action-card success">
              <div className="action-icon">📂</div>
              <div className="action-content">
                <h3 className="action-title">My Uploads</h3>
                <p className="action-description">Manage your uploaded notes</p>
              </div>
            </Link>
            
            <Link to="/analytics" className="action-card warning">
              <div className="action-icon">📈</div>
              <div className="action-content">
                <h3 className="action-title">View Analytics</h3>
                <p className="action-description">Track student engagement</p>
              </div>
            </Link>
            
            <Link to="/notes" className="action-card info">
              <div className="action-icon">🔍</div>
              <div className="action-content">
                <h3 className="action-title">Browse All</h3>
                <p className="action-description">Explore notes from all teachers</p>
              </div>
            </Link>
          </div>
        </div>

        <div className="dashboard-content">
          {/* Recent Uploads */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Recent Uploads</h2>
              <Link to="/my-uploads" className="view-all-link">
                View All →
              </Link>
            </div>
            
            {recentNotes.length === 0 ? (
              <div className="empty-section">
                <div className="empty-icon">📚</div>
                <h3 className="empty-title">No Notes Uploaded Yet</h3>
                <p className="empty-subtitle">
                  Start sharing knowledge with your students
                </p>
                <Link to="/upload" className="btn btn-primary">
                  Upload Your First Notes
                </Link>
              </div>
            ) : (
              <div className="notes-list">
                {recentNotes.map(note => (
                  <div key={note._id} className="note-item">
                    <div className="note-info">
                      <h4 className="note-title">{note.title}</h4>
                      <div className="note-meta">
                        <span className="meta-item">{note.department}</span>
                        <span className="meta-item">Sem {note.semester}</span>
                        <span className="meta-item">{note.subject}</span>
                        <span className="meta-item">{formatDate(note.createdAt)}</span>
                      </div>
                    </div>
                    <div className="note-stats">
                      <div className="download-count">
                        {note.downloadCount || 0} downloads
                      </div>
                      <div className="file-size">
                        {formatFileSize(note.fileSize)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Department Distribution */}
          <div className="content-section">
            <div className="section-header">
              <h2 className="section-title">Department Distribution</h2>
            </div>
            
            {departmentStats.length === 0 ? (
              <div className="empty-section">
                <div className="empty-icon">🏫</div>
                <h3 className="empty-title">No Department Data</h3>
                <p className="empty-subtitle">
                  Upload notes to see department distribution
                </p>
              </div>
            ) : (
              <div className="department-list">
                {departmentStats.map(dept => (
                  <div key={dept._id} className="department-item">
                    <div className="department-header">
                      <span className="department-name">{dept._id}</span>
                      <span className="department-count">{dept.count} notes</span>
                    </div>
                    <div className="department-stats">
                      <span className="stat">{dept.downloads} downloads</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          max-width: 1200px;
          margin: 0 auto;
        }

        /* Header Styles */
        .dashboard-header {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.3);
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

        .teacher-badge {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .teacher-icon {
          font-size: 2rem;
        }

        .teacher-name {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .teacher-department {
          font-size: 0.9rem;
          opacity: 0.9;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

        .stat-card.primary {
          border-left: 4px solid #6366f1;
        }

        .stat-card.success {
          border-left: 4px solid #10b981;
        }

        .stat-card.warning {
          border-left: 4px solid #f59e0b;
        }

        .stat-card.info {
          border-left: 4px solid #ef4444;
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

        /* Quick Actions */
        .actions-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 1rem;
        }

        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .action-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .action-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .action-card.primary {
          border-left: 4px solid #6366f1;
        }

        .action-card.success {
          border-left: 4px solid #10b981;
        }

        .action-card.warning {
          border-left: 4px solid #f59e0b;
        }

        .action-card.info {
          border-left: 4px solid #ef4444;
        }

        .action-icon {
          font-size: 2rem;
        }

        .action-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 0.25rem 0;
        }

        .action-description {
          font-size: 0.9rem;
          color: #6b7280;
          margin: 0;
        }

        /* Dashboard Content */
        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .dashboard-content {
            grid-template-columns: 1fr;
          }
        }

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
        }

        .view-all-link {
          color: #6366f1;
          text-decoration: none;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        /* Notes List */
        .notes-list {
          space-y: 1rem;
        }

        .note-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
          transition: transform 0.2s ease;
        }

        .note-item:hover {
          transform: translateX(5px);
        }

        .note-title {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        .note-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .meta-item {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }

        .note-stats {
          text-align: right;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .download-count {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        /* Department List */
        .department-list {
          space-y: 1rem;
        }

        .department-item {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
        }

        .department-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .department-name {
          font-weight: 600;
          color: #374151;
        }

        .department-count {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .department-stats {
          font-size: 0.8rem;
          color: #6b7280;
        }

        /* Empty States */
        .empty-section {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          opacity: 0.5;
        }

        .empty-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #4b5563;
        }

        .empty-subtitle {
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
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
          background: #6366f1;
          color: white;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .loading-state, .error-state, .empty-state {
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
          border-top: 3px solid #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
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
          
          .teacher-badge {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};


export default TeacherDashboard;
