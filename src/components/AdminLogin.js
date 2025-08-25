// src/components/AdminLogin.js
import React, { useState } from 'react';
import '../styles/AdminLogin.css';

const AdminLogin = ({ switchToUserLogin }) => {
  const [adminData, setAdminData] = useState({
    username: 'admin',
    password: 'admin123'
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!adminData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!adminData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (adminData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData({
      ...adminData,
      [name]: value
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // In a real app, you would authenticate with your backend
      alert('Admin login successful!');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-header">
          <h2>Admin Login</h2>
          <p>Access the SmartVAS admin dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={adminData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Enter your admin username"
            />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={adminData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary">
            Sign In as Admin
          </button>
        </form>

        <div className="user-login-prompt">
          <span>Not an admin?</span>
          <button className="link-button" onClick={switchToUserLogin}>
            User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;