import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const Analytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('all'); // all, month, week

  // Fetch analytics data
  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://college-notes-sharing-platform-backend.onrender.com/api/notes/teacher/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setAnalytics(data.analytics);
      } else {
        setError(data.message || 'Failed to fetch analytics');
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 MB';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#10b981';
    if (percentage >= 50) return '#f59e0b';
    return '#ef4444';
  };

  const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <h3 className="loading-title">Loading Analytics...</h3>
            <p className="loading-subtitle">Crunching the numbers for you</p>
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
            <h3 className="error-title">Analytics Unavailable</h3>
            <p className="error-subtitle">{error}</p>
            <button onClick={fetchAnalytics} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3 className="empty-title">No Analytics Data</h3>
            <p className="empty-subtitle">
              Start uploading notes to see your performance analytics
            </p>
            <a href="/upload" className="btn btn-primary">
              Upload Your First Notes
            </a>
          </div>
        </div>
      </div>
    );
  }

  const { overview, departmentStats, semesterStats, subjectStats, popularNotes, recentActivity, engagementRate } = analytics;

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div className="analytics-header">
          <div className="header-content">
            <div>
              <h1 className="page-title">Teaching Analytics</h1>
              <p className="page-subtitle">
                Track your impact and student engagement
              </p>
            </div>
            <div className="header-stats">
              <div className="header-stat" style={{ background: 'rgba(59, 130, 246, 0.9)' }}>
                <div className="stat-number" style={{ color: '#ffffff' }}>{formatNumber(overview.totalNotes)}</div>
                <div className="stat-label" style={{ color: '#e0f2fe' }}>Total Notes</div>
              </div>
              <div className="header-stat" style={{ background: 'rgba(16, 185, 129, 0.9)' }}>
                <div className="stat-number" style={{ color: '#ffffff' }}>{formatNumber(overview.totalDownloads)}</div>
                <div className="stat-label" style={{ color: '#d1fae5' }}>Total Downloads</div>
              </div>
              <div className="header-stat" style={{ background: 'rgba(245, 158, 11, 0.9)' }}>
                <div className="stat-number" style={{ color: '#ffffff' }}>{overview.avgDownloads}</div>
                <div className="stat-label" style={{ color: '#fef3c7' }}>Avg. per Note</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="overview-grid">
          <div className="overview-card primary">
            <div className="card-icon">📚</div>
            <div className="card-content">
              <div className="card-number">{formatNumber(overview.totalNotes)}</div>
              <div className="card-label">Notes Uploaded</div>
            </div>
          </div>
          
          <div className="overview-card success">
            <div className="card-icon">📥</div>
            <div className="card-content">
              <div className="card-number">{formatNumber(overview.totalDownloads)}</div>
              <div className="card-label">Total Downloads</div>
            </div>
          </div>
          
          <div className="overview-card warning">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <div className="card-number">{overview.avgDownloads}</div>
              <div className="card-label">Avg. Downloads</div>
            </div>
          </div>
          
          <div className="overview-card info">
            <div className="card-icon">🔥</div>
            <div className="card-content">
              <div className="card-number">{formatNumber(overview.mostDownloaded)}</div>
              <div className="card-label">Most Popular</div>
            </div>
          </div>
        </div>

        {/* Rest of your analytics content remains the same */}
        <div className="analytics-grid">
          {/* Department Performance */}
          <div className="analytics-card">
            <h3 className="card-title">📊 Department Performance</h3>
            <div className="performance-list">
              {departmentStats.map((dept, index) => (
                <div key={dept._id} className="performance-item">
                  <div className="performance-header">
                    <span className="performance-name">{dept._id}</span>
                    <span className="performance-count">{dept.totalDownloads} downloads</span>
                  </div>
                  <div className="performance-bar">
                    <div 
                      className="performance-fill"
                      style={{ 
                        width: `${calculatePercentage(dept.totalDownloads, overview.totalDownloads)}%`,
                        background: getProgressColor(calculatePercentage(dept.totalDownloads, overview.totalDownloads))
                      }}
                    ></div>
                  </div>
                  <div className="performance-meta">
                    {dept.noteCount} notes • Avg: {Math.round(dept.avgDownloads)} downloads
                  </div>
                </div>
              ))}
              {departmentStats.length === 0 && (
                <div className="empty-data">No department data available</div>
              )}
            </div>
          </div>

          {/* Most Popular Notes */}
          <div className="analytics-card">
            <h3 className="card-title">🔥 Most Popular Notes</h3>
            <div className="popular-notes-list">
              {popularNotes.map((note, index) => (
                <div key={note._id} className="popular-note-item">
                  <div className="note-rank">#{index + 1}</div>
                  <div className="note-info">
                    <div className="note-title">{note.title}</div>
                    <div className="note-meta">
                      {note.department} • Sem {note.semester}
                    </div>
                  </div>
                  <div className="note-stats">
                    <div className="download-count">{note.downloadCount} downloads</div>
                    <div className="engagement-badge" style={{
                      background: getProgressColor(calculatePercentage(note.downloadCount, overview.mostDownloaded))
                    }}>
                      {calculatePercentage(note.downloadCount, overview.mostDownloaded)}%
                    </div>
                  </div>
                </div>
              ))}
              {popularNotes.length === 0 && (
                <div className="empty-data">No popular notes yet</div>
              )}
            </div>
          </div>

          {/* Semester Distribution */}
          <div className="analytics-card">
            <h3 className="card-title">🎓 Semester Distribution</h3>
            <div className="semester-grid">
              {semesterStats.map(sem => (
                <div key={sem._id} className="semester-item">
                  <div className="semester-header">
                    <span className="semester-name">Semester {sem._id}</span>
                    <span className="semester-count">{sem.noteCount} notes</span>
                  </div>
                  <div className="semester-stats">
                    <div className="stat">
                      <span className="stat-value">{sem.totalDownloads}</span>
                      <span className="stat-label">Downloads</span>
                    </div>
                    <div className="stat">
                      <span className="stat-value">{Math.round(sem.avgDownloads)}</span>
                      <span className="stat-label">Avg/Note</span>
                    </div>
                  </div>
                </div>
              ))}
              {semesterStats.length === 0 && (
                <div className="empty-data">No semester data available</div>
              )}
            </div>
          </div>

          {/* Subject Performance */}
          <div className="analytics-card">
            <h3 className="card-title">📖 Subject Performance</h3>
            <div className="subject-list">
              {subjectStats.map(subject => (
                <div key={subject._id} className="subject-item">
                  <div className="subject-name">{subject._id}</div>
                  <div className="subject-stats">
                    <div className="stat-pair">
                      <span className="stat-number">{subject.noteCount}</span>
                      <span className="stat-label">notes</span>
                    </div>
                    <div className="stat-pair">
                      <span className="stat-number">{subject.totalDownloads}</span>
                      <span className="stat-label">downloads</span>
                    </div>
                    <div className="stat-pair">
                      <span className="stat-number">{Math.round(subject.avgDownloads)}</span>
                      <span className="stat-label">avg</span>
                    </div>
                  </div>
                </div>
              ))}
              {subjectStats.length === 0 && (
                <div className="empty-data">No subject data available</div>
              )}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="analytics-card">
            <h3 className="card-title">📈 Engagement Metrics</h3>
            <div className="engagement-metrics">
              <div className="metric-item">
                <div className="metric-value">{engagementRate}</div>
                <div className="metric-label">Downloads per Note</div>
                <div className="metric-description">Average engagement rate</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">{formatFileSize(overview.totalFileSize)}</div>
                <div className="metric-label">Total Content</div>
                <div className="metric-description">All uploaded materials</div>
              </div>
              <div className="metric-item">
                <div className="metric-value">
                  {overview.totalNotes > 0 ? Math.round(overview.totalDownloads / overview.totalNotes) : 0}
                </div>
                <div className="metric-label">Engagement Score</div>
                <div className="metric-description">Overall performance</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="analytics-card">
            <h3 className="card-title">🕒 Recent Activity (30 days)</h3>
            <div className="activity-list">
              {recentActivity.map(activity => (
                <div key={activity._id} className="activity-item">
                  <div className="activity-date">{activity._id}</div>
                  <div className="activity-stats">
                    <span className="activity-count">{activity.notesUploaded} notes uploaded</span>
                    <span className="activity-downloads">{activity.downloads} downloads</span>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="empty-data">No recent activity</div>
              )}
            </div>
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
          max-width: 1400px;
          margin: 0 auto;
        }

        .analytics-header {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          color: white;
          padding: 2rem;
          border-radius: 20px;
          margin-bottom: 2rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0 0 0.5rem 0;
          background: linear-gradient(135deg, #ffffff, #e2e8f0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-subtitle {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
          color: #cbd5e1;
        }

        .header-stats {
          display: flex;
          gap: 1.5rem;
        }

        .header-stat {
          padding: 1.5rem;
          border-radius: 15px;
          text-align: center;
          min-width: 140px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .header-stat:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3);
        }

        .stat-number {
          font-size: 2.2rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .stat-label {
          font-size: 0.9rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .overview-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.3s ease;
        }

        .overview-card:hover {
          transform: translateY(-5px);
        }

        .overview-card.primary {
          border-left: 4px solid #3b82f6;
        }

        .overview-card.success {
          border-left: 4px solid #10b981;
        }

        .overview-card.warning {
          border-left: 4px solid #f59e0b;
        }

        .overview-card.info {
          border-left: 4px solid #ef4444;
        }

        .card-icon {
          font-size: 2.5rem;
          opacity: 0.8;
        }

        .card-number {
          font-size: 2rem;
          font-weight: 700;
          color: #1f2937;
        }

        .card-label {
          font-size: 0.9rem;
          color: #6b7280;
          font-weight: 500;
        }

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .analytics-card {
          background: white;
          padding: 1.5rem;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        .card-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 1.5rem 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .performance-list {
          space-y: 1rem;
        }

        .performance-item {
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f3f4f6;
        }

        .performance-item:last-child {
          margin-bottom: 0;
          border-bottom: none;
        }

        .performance-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .performance-name {
          font-weight: 600;
          color: #374151;
        }

        .performance-count {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .performance-bar {
          width: 100%;
          height: 6px;
          background: #f3f4f6;
          border-radius: 3px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .performance-fill {
          height: 100%;
          transition: width 0.3s ease;
        }

        .performance-meta {
          font-size: 0.8rem;
          color: #9ca3af;
        }

        .popular-notes-list {
          space-y: 1rem;
        }

        .popular-note-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
          margin-bottom: 0.75rem;
          transition: transform 0.2s ease;
        }

        .popular-note-item:hover {
          transform: translateX(5px);
        }

        .note-rank {
          background: #06b6d4;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .note-info {
          flex: 1;
        }

        .note-title {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .note-meta {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .note-stats {
          text-align: right;
        }

        .download-count {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .engagement-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          color: white;
          font-weight: 600;
        }

        .semester-grid {
          display: grid;
          gap: 1rem;
        }

        .semester-item {
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
        }

        .semester-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .semester-name {
          font-weight: 600;
          color: #374151;
        }

        .semester-count {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .semester-stats {
          display: flex;
          gap: 1rem;
        }

        .stat {
          text-align: center;
        }

        .stat-value {
          font-weight: 700;
          color: #06b6d4;
          display: block;
        }

        .stat-label {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .subject-list {
          space-y: 0.75rem;
        }

        .subject-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .subject-name {
          font-weight: 600;
          color: #374151;
        }

        .subject-stats {
          display: flex;
          gap: 1rem;
        }

        .stat-pair {
          text-align: center;
        }

        .stat-number {
          font-weight: 700;
          color: #06b6d4;
          display: block;
          font-size: 0.9rem;
        }

        .stat-label {
          font-size: 0.7rem;
          color: #6b7280;
        }

        .engagement-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }

        .metric-item {
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 10px;
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #06b6d4;
          margin-bottom: 0.25rem;
        }

        .metric-label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .metric-description {
          font-size: 0.8rem;
          color: #6b7280;
        }

        .activity-list {
          space-y: 0.75rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .activity-date {
          font-weight: 600;
          color: #374151;
        }

        .activity-stats {
          display: flex;
          gap: 1rem;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .empty-data {
          text-align: center;
          color: #9ca3af;
          font-style: italic;
          padding: 2rem;
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
          border-top: 3px solid #06b6d4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1.5rem;
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
          background: #06b6d4;
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
            flex-wrap: wrap;
          }
          
          .header-stat {
            min-width: 120px;
          }
          
          .analytics-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};


export default Analytics;
