import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await login(formData.email, formData.password);
    if (result.success) {
      // Show celebration effect
      setShowCelebration(true);
      
      // Wait for celebration to show before navigating
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
      {/* Celebration Burst Effect */}
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
          {/* Burst Center */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '4rem',
            animation: 'burst 1s ease-out forwards',
            zIndex: 11
          }}>
            🎉
          </div>

          {/* Confetti Particles */}
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '8px',
                height: '8px',
                background: [
                  '#ff0080', '#00ff88', '#ffeb3b', '#9c27b0', '#ff5722',
                  '#4361ee', '#7209b7', '#4cc9f0', '#f72585', '#3a0ca3'
                ][i % 10],
                borderRadius: '50%',
                animation: `confetti 2s ease-out ${i * 0.05}s forwards`,
                boxShadow: '0 0 8px currentColor'
              }}
            />
          ))}

          {/* Floating Text */}
          <div style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '0 0 20px rgba(255,255,255,0.8)',
            animation: 'floatUp 2s ease-out 0.5s forwards',
            opacity: 0,
            zIndex: 12
          }}>
            HURRAY! 🎊
          </div>

          {/* Sparkle Effects */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              style={{
                position: 'absolute',
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: '4px',
                height: '4px',
                background: 'white',
                borderRadius: '50%',
                animation: `sparkle 1.5s ease-in-out ${i * 0.1}s infinite`,
                boxShadow: '0 0 6px white'
              }}
            />
          ))}
        </div>
      )}

      <div style={{
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Login Card */}
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
              <span style={{ fontSize: '1.5rem' }}>📚</span>
            </div>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '0.5rem'
            }}>
              Welcome Back
            </h1>
            <p style={{
              color: '#718096',
              fontSize: '0.9rem',
              margin: 0
            }}>
              Sign in to your EduNotes account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '1.5rem' }}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                Email Address
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
                onFocus={(e) => {
                  e.target.style.borderColor = '#4361ee';
                  e.target.style.boxShadow = '0 0 0 3px rgba(67, 97, 238, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e2e8f0';
                  e.target.style.boxShadow = 'none';
                }}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={{ marginBottom: '2rem', position: 'relative' }}>
              <label style={{
                display: 'block',
                fontSize: '0.85rem',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '0.5rem',
                textAlign: 'left'
              }}>
                Password
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
                  onFocus={(e) => {
                    e.target.style.borderColor = '#4361ee';
                    e.target.style.boxShadow = '0 0 0 3px rgba(67, 97, 238, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                  }}
                  placeholder="Enter your password"
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
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 6px 20px rgba(67, 97, 238, 0.5)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(67, 97, 238, 0.4)';
                }
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
                  Signing in...
                </span>
              ) : (
                'Sign In'
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
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{
                  color: '#4361ee',
                  fontWeight: '600',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseOver={(e) => e.target.style.color = '#3a0ca3'}
                onMouseOut={(e) => e.target.style.color = '#4361ee'}
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.75rem'
        }}>
          <p>Secure login • Encrypted data • 24/7 support</p>
        </div>
      </div>

      {/* Add CSS animations */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          @keyframes burst {
            0% {
              transform: translate(-50%, -50%) scale(0);
              opacity: 0;
            }
            50% {
              transform: translate(-50%, -50%) scale(1.2);
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50%) scale(1);
              opacity: 1;
            }
          }
          
          @keyframes confetti {
            0% {
              transform: translate(0, 0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translate(
                ${() => (Math.random() - 0.5) * 500}px,
                ${() => (Math.random() - 0.5) * 500}px
              ) rotate(360deg);
              opacity: 0;
            }
          }
          
          @keyframes floatUp {
            0% {
              transform: translate(-50%, 20px);
              opacity: 0;
            }
            50% {
              opacity: 1;
            }
            100% {
              transform: translate(-50%, -50px);
              opacity: 0;
            }
          }
          
          @keyframes sparkle {
            0%, 100% {
              opacity: 0;
              transform: scale(0);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Login;