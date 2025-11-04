import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>
      <div className={`role-badge ${user.role}`}>
        Role: {user.role.toUpperCase()}
      </div>
      
      {user.role === 'teacher' ? (
        <TeacherDashboard user={user} />
      ) : (
        <StudentDashboard user={user} />
      )}
    </div>
  );
};

// Teacher Dashboard Component
const TeacherDashboard = ({ user }) => {
  return (
    <div className="teacher-dashboard">
      <h2>🎓 Teacher Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Upload Notes</h3>
          <p>Upload PDF notes for your department</p>
          <button className="btn-primary">Upload Notes</button>
        </div>
        
        <div className="card">
          <h3>Manage Notes</h3>
          <p>View and manage your uploaded notes</p>
          <button className="btn-secondary">My Uploads</button>
        </div>
        
        <div className="card">
          <h3>Analytics</h3>
          <p>Track downloads and student engagement</p>
          <button className="btn-secondary">View Analytics</button>
        </div>
      </div>
    </div>
  );
};

// Student Dashboard Component
const StudentDashboard = ({ user }) => {
  return (
    <div className="student-dashboard">
      <h2>📚 Student Dashboard</h2>
      <div className="dashboard-cards">
        <div className="card">
          <h3>Browse Notes</h3>
          <p>Find notes by department and semester</p>
          <button className="btn-primary">Browse All Notes</button>
        </div>
        
        <div className="card">
          <h3>My Downloads</h3>
          <p>Access your downloaded notes</p>
          <button className="btn-secondary">Download History</button>
        </div>
        
        <div className="card">
          <h3>Bookmarks</h3>
          <p>Your saved notes</p>
          <button className="btn-secondary">View Bookmarks</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;