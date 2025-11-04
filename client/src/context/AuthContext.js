import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Set auth token for axios
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setAuthToken(token);
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      console.log('Attempting login...');
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth header and user state
      setAuthToken(token);
      setUser(user);
      
      console.log('Login successful:', user.name);
      return { success: true, user };
    } catch (error) {
      console.error('Login error details:', error);
      const message = error.response?.data?.message || 
                     error.message || 
                     'Login failed. Please try again.';
      return { success: false, message };
    }
  };

  // Register function with better error handling
  const register = async (userData) => {
    try {
      console.log('Attempting registration...', userData);
      
      const response = await axios.post('/api/auth/register', userData);
      
      const { token, user } = response.data;
      
      // Save to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Set auth header and user state
      setAuthToken(token);
      setUser(user);
      
      console.log('Registration successful:', user.name);
      return { success: true, user };
    } catch (error) {
      console.error('Registration error details:', error);
      
      // Detailed error handling
      let message = 'Registration failed. Please try again.';
      
      if (error.response) {
        // Server responded with error status
        message = error.response.data?.message || 
                 `Server error: ${error.response.status}`;
        
        // Handle specific error cases
        if (error.response.status === 400) {
          message = error.response.data?.message || 'Invalid registration data';
        } else if (error.response.status === 500) {
          message = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Request was made but no response received
        message = 'No response from server. Check your connection.';
      } else {
        // Something else happened
        message = error.message || 'Registration failed';
      }
      
      return { success: false, message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setAuthToken(null);
    console.log('User logged out');
  };

  // Get current user (verify token is still valid)
  const getCurrentUser = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      logout(); // Token is invalid, logout user
      return null;
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    getCurrentUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}