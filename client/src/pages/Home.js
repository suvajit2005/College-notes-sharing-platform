import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  const FeatureCard = ({ icon, title, description }) => (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h1>Welcome to <span style={{color: '#fbbf24'}}>EduNotes</span></h1>
          <p>
            The ultimate platform for seamless academic resource sharing between teachers and students
          </p>
          
          <div className="flex-center gap-3" style={{flexWrap: 'wrap'}}>
            {user ? (
              <>
                {user.role === 'teacher' && (
                  <Link to="/teacher" className="btn btn-primary">
                    🎯 Go to Dashboard
                  </Link>
                )}
                <Link to="/student" className="btn btn-secondary">
                  📖 Browse Notes
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary">
                  Get Started Free
                </Link>
                <Link to="/login" className="btn btn-secondary">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container">
        <div className="features-grid">
          <FeatureCard 
            icon="👨‍🏫" 
            title="For Teachers" 
            description="Upload and manage PDF notes with ease. Organize by department, semester, and subject."
          />
          <FeatureCard 
            icon="🎓" 
            title="For Students" 
            description="Access all your study materials in one place. Filter by course and download instantly."
          />
          <FeatureCard 
            icon="⚡" 
            title="Fast & Easy" 
            description="Modern interface designed for simplicity and efficiency. Works on all devices."
          />
        </div>
      </section>

      {/* Stats Section */}
      <section style={{background: 'rgba(67, 97, 238, 0.05)', padding: '3rem 0'}}>
        <div className="container">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">500+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">1K+</div>
              <div className="stat-label">Notes Shared</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">50+</div>
              <div className="stat-label">Teachers</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Available</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;