import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    department: 'Arts and Humanities'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long!');
      setLoading(false);
      return;
    }

    if (!formData.name.trim()) {
      setError('Please enter your name');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
    
    try {
      const result = await register({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password,
        department: formData.department
      });

      if (result.success) {
        // Show celebration effect
        setShowCelebration(true);
        
        // Wait for celebration to show before navigating
        setTimeout(() => {
          alert(`Registration successful! Welcome ${result.user.name}`);
          navigate('/');
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
      console.error('Registration catch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Celebration Ribbons */}
      {showCelebration && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 10
        }}>
          {/* Ribbon 1 */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '10%',
            width: '8px',
            height: '100px',
            background: 'linear-gradient(45deg, #ff0080, #ff8c00)',
            animation: 'fall 1.5s ease-in-out forwards',
            transform: 'rotate(45deg)',
            boxShadow: '0 0 20px #ff0080'
          }}></div>
          
          {/* Ribbon 2 */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '30%',
            width: '8px',
            height: '120px',
            background: 'linear-gradient(45deg, #00ff88, #00ccff)',
            animation: 'fall 1.8s ease-in-out 0.2s forwards',
            transform: 'rotate(-30deg)',
            boxShadow: '0 0 20px #00ff88'
          }}></div>
          
          {/* Ribbon 3 */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            width: '8px',
            height: '90px',
            background: 'linear-gradient(45deg, #ff0080, #ffeb3b)',
            animation: 'fall 1.6s ease-in-out 0.4s forwards',
            transform: 'rotate(60deg)',
            boxShadow: '0 0 20px #ffeb3b'
          }}></div>
          
          {/* Ribbon 4 */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '70%',
            width: '8px',
            height: '110px',
            background: 'linear-gradient(45deg, #9c27b0, #3f51b5)',
            animation: 'fall 1.7s ease-in-out 0.1s forwards',
            transform: 'rotate(-15deg)',
            boxShadow: '0 0 20px #9c27b0'
          }}></div>
          
          {/* Ribbon 5 */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '90%',
            width: '8px',
            height: '100px',
            background: 'linear-gradient(45deg, #ff5722, #ff9800)',
            animation: 'fall 1.9s ease-in-out 0.3s forwards',
            transform: 'rotate(75deg)',
            boxShadow: '0 0 20px #ff5722'
          }}></div>
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: '450px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Sign Up Card */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '2.5rem 2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              background: 'linear-gradient(135deg, #4361ee, #7209b7)',
              width: '60px',
              height: '60px',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: '0 8px 16px rgba(67, 97, 238, 0.3)'
            }}>
              <span style={{ fontSize: '1.5rem' }}>🎓</span>
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '0.5rem'
            }}>
              Student Registration
            </h1>
            <p style={{
              color: '#718096',
              fontSize: '0.9rem',
              margin: 0
            }}>
              Create your student account to access study materials
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: 'linear-gradient(135deg, #fed7d7, #feb2b2)',
              color: '#9b2c2c',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              border: '1px solid #fc8181',
              textAlign: 'center',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              ⚠️ {error}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit}>
            {/* Name Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your full name"
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box'
                }}
                placeholder="Enter your college email"
              />
            </div>

            {/* Department Selection */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                Department *
              </label>
              <select
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  backgroundColor: '#fff',
                  boxSizing: 'border-box',
                  cursor: 'pointer'
                }}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '1.25rem', position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Create a strong password (min. 6 characters)"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#718096',
                    fontSize: '1.1rem',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f7fafc'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                Confirm Password *
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.875rem 3rem 0.875rem 1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '10px',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    backgroundColor: '#fff',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#718096',
                    fontSize: '1.1rem',
                    padding: '0.25rem',
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f7fafc'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                  {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? 
                  'linear-gradient(135deg, #a0aec0, #cbd5e0)' : 
                  'linear-gradient(135deg, #4361ee, #7209b7)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.5rem',
                borderRadius: '10px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(67, 97, 238, 0.4)',
                opacity: loading ? 0.7 : 1,
                marginBottom: '1.5rem'
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '0.5rem'
                  }}></div>
                  Creating Account...
                </span>
              ) : (
                'Create Student Account'
              )}
            </button>
          </form>

          {/* Footer */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              color: '#718096',
              fontSize: '0.8rem',
              margin: 0
            }}>
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{
                  color: '#4361ee',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes fall {
            0% {
              transform: translateY(-100px) rotate(45deg);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(45deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Register;