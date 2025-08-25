import React, { useState, useRef, useEffect } from 'react';
import '../styles/OTPVerification.css';
import { authService } from '../services/authService';

const OTPVerification = ({ phone, onVerified, isSignUp = false }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [activeInput, setActiveInput] = useState(0);
  const [countdown, setCountdown] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[activeInput]) {
      inputRefs.current[activeInput].focus();
    }
  }, [activeInput]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (/^[0-9]$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 3) {
        setActiveInput(index + 1);
      } else {
        handleVerify();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = '';
      } else if (index > 0) {
        newOtp[index - 1] = '';
        setActiveInput(index - 1);
      }

      setOtp(newOtp);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleVerify();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').slice(0, 6);

    if (/^[0-9]{4}$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      setActiveInput(Math.min(3, pastedData.length));
      setTimeout(() => handleVerify(), 100);
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join('');

    if (enteredOtp.length !== 4) {
      alert('Please enter a valid 4-digit OTP');
      return;
    }

    setIsVerifying(true);
    try {
      await onVerified(enteredOtp);
    } catch (error) {
      alert(error.message || 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown === 0) {
      try {
        const otpResponse = await authService.sendOtp(phone);
        if (otpResponse.status === 'success') {
          setCountdown(30);
          alert('OTP has been resent to your phone');
        } else {
          alert('Failed to resend OTP. Please try again.');
        }
      } catch (error) {
        alert(error.message || 'Failed to resend OTP');
      }
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-card">
        <div className="otp-header">
          <h2>Verify Your Account</h2>
          <p>We've sent a 4-digit verification code to</p>
          <p className="phone-number">+91 {phone}</p>
          <p className="otp-instruction">Enter the code below to continue</p>
        </div>

        <div className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                onFocus={() => setActiveInput(index)}
                className="otp-input"
                disabled={isVerifying}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="verify-btn"
            disabled={isVerifying}
          >
            {isVerifying ? 'Verifying...' : (isSignUp ? 'Complete Registration' : 'Access My Account')}
          </button>
        </div>

        <div className="resend-otp">
          <p>Didn't receive the code? </p>
          {countdown > 0 ? (
            <span className="countdown">Request new code in {countdown}s</span>
          ) : (
            <button className="resend-button" onClick={handleResendOTP} type="button" disabled={isVerifying}>
              Resend Verification Code
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;