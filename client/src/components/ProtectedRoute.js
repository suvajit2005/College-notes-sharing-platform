import React, { useState, useEffect, useCallback } from 'react';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users/profile/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
        
        // Check if user has required role
        if (requiredRole && data.user.role !== requiredRole) {
          window.location.href = '/unauthorized';
          return;
        }
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  }, [requiredRole]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }

  return user ? children : null;
};

export default ProtectedRoute;