import React, { useState, useRef, useEffect } from 'react';
import '../styles/Login.css';

const Login = ({ onLogin, onAdminLogin, switchToSignUp, adminPhone }) => {
  const [credentials, setCredentials] = useState({
    phone: '',
    isAdmin: false
  });
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  // Add event listener for Enter key
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        handleSubmit(event);
      }
    };

    const form = formRef.current;
    if (form) {
      form.addEventListener('keypress', handleKeyPress);
    }

    return () => {
      if (form) {
        form.removeEventListener('keypress', handleKeyPress);
      }
    };
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!credentials.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(credentials.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (validateForm()) {
      if (credentials.isAdmin) {
        onAdminLogin(credentials);
      } else {
        onLogin(credentials);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers
    const numericValue = value.replace(/\D/g, '');

    setCredentials({
      ...credentials,
      [name]: numericValue.slice(0, 10) // Limit to 10 digits
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSignUpClick = () => {
    if (credentials.phone && /^\d{10}$/.test(credentials.phone)) {
      // Pre-fill the signup form with the phone number
      switchToSignUp();
    } else {
      switchToSignUp();
    }
  };

  const handleAdminToggle = () => {
    const newAdminState = !credentials.isAdmin;
    setCredentials({
      ...credentials,
      isAdmin: newAdminState
    });

    if (newAdminState) {
      alert(`Admin login enabled. Please use the admin phone number: ${adminPhone}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>LOGIN</h1>
          <p>Welcome to SmartVAS Portal</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="phone">Mobile Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={credentials.phone}
              onChange={handleChange}
              className={errors.phone ? 'error' : ''}
              placeholder="Enter your 10-digit mobile number"
              maxLength="10"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <button type="submit" className="login-btn">
            REQUEST OTP
          </button>
        </form>

        <div className="admin-login-section">
          <button
            onClick={handleAdminToggle}
            className={`admin-toggle ${credentials.isAdmin ? 'active' : ''}`}
            type="button"
          >
            {credentials.isAdmin ? 'ADMIN LOGIN ENABLED' : 'LOGIN AS ADMIN'}
          </button>
          {credentials.isAdmin && (
            <p className="admin-note">Use admin phone number: {adminPhone}</p>
          )}
        </div>

        <div className="signup-prompt">
          <span>Don't have an account? </span>
          <button onClick={handleSignUpClick} className="signup-link" type="button">
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;