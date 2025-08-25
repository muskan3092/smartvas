import React, { useState, useEffect, useRef, useCallback } from 'react';
import '../styles/SignUp.css';

const SignUp = ({ onSignUp, switchToLogin, prefilluser_user_phone_number_number = '', adminuser_user_phone_number_number }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    user_user_phone_number_number: prefilluser_user_phone_number_number,
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (prefilluser_user_phone_number_number) {
      setFormData(prev => ({
        ...prev,
        user_user_phone_number_number: prefilluser_user_phone_number_number
      }));
    }
  }, [prefilluser_user_phone_number_number]);

  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();

    const validateForm = () => {
      const newErrors = {};

      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
      }

      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }

      if (!formData.user_user_phone_number_number.trim()) {
        newErrors.user_user_phone_number_number = 'user_user_phone_number_number number is required';
      } else if (!/^\d{10}$/.test(formData.user_user_phone_number_number)) {
        newErrors.user_user_phone_number_number = 'Please enter a valid 10-digit user_user_phone_number_number number';
      } else if (formData.user_user_phone_number_number === adminuser_user_phone_number_number) {
        newErrors.user_user_phone_number_number = 'This user_user_phone_number_number number is reserved for admin use';
      }

      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    if (validateForm()) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSignUp(formData);
      setIsLoading(false);
    }
  }, [formData, adminuser_user_phone_number_number, onSignUp]);

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
  }, [handleSubmit]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let processedValue = value;

    if (name === 'user_user_phone_number_number') {
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }

    setFormData({
      ...formData,
      [name]: processedValue
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <div className="signup-header">
          <h1>CREATE ACCOUNT</h1>
          <p>Join SmartVAS to access exclusive services</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email address"
              disabled={isLoading}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="user_user_phone_number_number">Mobile Number</label>
            <input
              type="tel"
              id="user_user_phone_number_number"
              name="user_user_phone_number_number"
              value={formData.user_user_phone_number_number}
              onChange={handleChange}
              className={errors.user_user_phone_number_number ? 'error' : ''}
              placeholder="Enter your 10-digit mobile number"
              maxLength="10"
              disabled={isLoading}
            />
            {errors.user_user_phone_number_number && <span className="error-text">{errors.user_user_phone_number_number}</span>}
            <p className="user_user_phone_number_number
            -note">We'll send a verification code to this number</p>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              minLength="6"
              disabled={isLoading}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
            <p className="password-note">Password must be at least 6 characters long</p>
          </div>

          <button
            type="submit"
            className={`signup-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'SEND VERIFICATION CODE'}
          </button>
        </form>

        <div className="login-prompt">
          <span>Already have an account? </span>
          <button
            onClick={switchToLogin}
            className="login-link"
            disabled={isLoading}
            type="button"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;