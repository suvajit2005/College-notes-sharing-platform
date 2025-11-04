import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on component mount and when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch('http://localhost:5000/api/users/profile/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          
          if (data.success) {
            setCurrentUser(data.user);
          }
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]); // Re-fetch when user context changes

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    navigate('/');
  };

  // Use currentUser from profile endpoint or fallback to context user
  const displayUser = currentUser || user;

  if (loading && !displayUser) {
    return (
      <nav className="navbar">
        <div className="nav-container">
          <div className="loading-nav">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span>📚</span> College Notes
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            Home
          </Link>
          
          {displayUser ? (
            <>
              {/* Teacher-specific links */}
              {displayUser.role === 'teacher' && (
                <>
                  <Link 
                    to="/upload" 
                    className={`nav-link ${location.pathname === '/upload' ? 'active' : ''}`}
                  >
                    📤 Upload Notes
                  </Link>
                  <Link 
                    to="/my-uploads" 
                    className={`nav-link ${location.pathname === '/my-uploads' ? 'active' : ''}`}
                  >
                    📂 My Uploads
                  </Link>
                  <Link 
                    to="/analytics" 
                    className={`nav-link ${location.pathname === '/analytics' ? 'active' : ''}`}
                  >
                    📊 Analytics
                  </Link>
                </>
              )}

              {/* Student-specific links */}
              {displayUser.role === 'student' && (
                <Link 
                  to="/my-downloads" 
                  className={`nav-link ${location.pathname === '/my-downloads' ? 'active' : ''}`}
                >
                  📥 My Downloads
                </Link>
              )}

              {/* Common links for all authenticated users */}
              <Link 
                to="/notes" 
                className={`nav-link ${location.pathname === '/notes' ? 'active' : ''}`}
              >
                🔍 Browse Notes
              </Link>

              {/* User info placed between Browse Notes and Logout */}
              <div className="user-info">
                <span className="user-welcome">
                  👋 {displayUser.name}
                </span>
              </div>

              {/* Logout button on the rightmost */}
              <button 
                onClick={handleLogout}
                className="btn btn-secondary logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            /* Show when user is not logged in */
            <>
              <Link 
                to="/notes" 
                className={`nav-link ${location.pathname === '/notes' ? 'active' : ''}`}
              >
                Browse Notes
              </Link>
              
              {/* Login and Sign Up buttons on the rightmost */}
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        .navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 0.8rem 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          position: sticky;
          top: 0;
          z-index: 1000;
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 2rem;
        }

        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-shrink: 0;
        }

        .nav-logo span {
          font-size: 1.8rem;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: flex-end;
          flex: 1;
        }

        .nav-link {
          color: white;
          text-decoration: none;
          padding: 0.5rem 0.8rem;
          border-radius: 5px;
          transition: all 0.3s ease;
          font-weight: 500;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .nav-link:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: translateY(-2px);
        }

        .nav-link.active {
          background: rgba(255, 255, 255, 0.2);
          font-weight: 600;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-left: 0.5rem;
          padding-left: 0.8rem;
          border-left: 1px solid rgba(255, 255, 255, 0.3);
          flex-shrink: 0;
        }

        .user-welcome {
          color: white;
          font-size: 0.85rem;
          white-space: nowrap;
        }

        .user-role-badge {
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
          white-space: nowrap;
        }

        .user-role-badge.teacher {
          background: linear-gradient(135deg, #ff6b6b, #ee5a24);
          color: white;
        }

        .user-role-badge.student {
          background: linear-gradient(135deg, #4ecdc4, #44a08d);
          color: white;
        }

        .auth-buttons {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-left: auto;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          text-decoration: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          white-space: nowrap;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-primary {
          background: #ff6b6b;
          color: white;
        }

        .btn-primary:hover {
          background: #ff5252;
          transform: translateY(-2px);
        }

        .btn-secondary {
          background: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-secondary:hover {
          background: white;
          color: #667eea;
        }

        .logout-btn {
          padding: 0.4rem 0.8rem;
          font-size: 0.8rem;
          margin-left: auto;
        }

        .loading-nav {
          color: white;
          font-style: italic;
        }

        /* Medium screens (tablets) */
        @media (max-width: 1024px) {
          .nav-container {
            padding: 0 1.5rem;
          }
          
          .nav-links {
            gap: 0.8rem;
          }
          
          .nav-link {
            padding: 0.4rem 0.6rem;
            font-size: 0.85rem;
          }
          
          .user-info {
            gap: 0.6rem;
          }
          
          .user-welcome {
            font-size: 0.8rem;
          }
        }

        /* Mobile responsiveness */
        @media (max-width: 768px) {
          .nav-container {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .nav-links {
            flex-direction: column;
            width: 100%;
            gap: 0.8rem;
            align-items: center;
          }

          .nav-link {
            width: 100%;
            text-align: center;
            padding: 0.8rem;
            font-size: 1rem;
          }

          .user-info {
            border-left: none;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            padding-top: 1rem;
            padding-left: 0;
            margin-left: 0;
            flex-direction: column;
            gap: 0.8rem;
            width: 100%;
            text-align: center;
          }

          .auth-buttons {
            flex-direction: column;
            width: 100%;
            gap: 0.8rem;
            margin-left: 0;
          }

          .logout-btn {
            width: 100%;
            padding: 0.6rem 1rem;
            font-size: 0.9rem;
            margin-left: 0;
          }

          .btn {
            width: 100%;
            text-align: center;
          }
        }

        /* Small mobile devices */
        @media (max-width: 480px) {
          .nav-container {
            padding: 0.8rem;
          }
          
          .nav-logo {
            font-size: 1.3rem;
          }
          
          .nav-logo span {
            font-size: 1.5rem;
          }
          
          .nav-link {
            font-size: 0.9rem;
            padding: 0.7rem;
          }
          
          .user-info {
            gap: 0.8rem;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;