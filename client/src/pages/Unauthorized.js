import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="page-container text-center">
      <h1 className="page-title">Access Denied</h1>
      <p className="page-subtitle">You don't have permission to access this page.</p>
      
      <div className="card" style={{ maxWidth: '500px', margin: '0 auto' }}>
        <h2 className="card-title">🚫 Unauthorized</h2>
        <p className="card-content">
          This page requires special permissions. Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex justify-between mt-4">
          <Link to="/" className="btn btn-secondary">Go Home</Link>
          <Link to="/notes" className="btn btn-primary">Browse Notes</Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;