import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import SignUp from './components/SignUp';
import OTPVerification from './components/OTPVerification';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import { authService } from './services/authService';

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginData, setLoginData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const ADMIN_PHONE = '8125498251';

  const handleSplashFinish = () => {
    navigate('/login');
  };

  const handleLogin = async (credentials) => {
      try {
        console.log('Login attempt:', credentials);
        const userData = await authService.login(credentials.phone);
        console.log('User data from login:', userData);

        if (userData && userData.length > 0) {
          console.log('User exists, sending OTP');
          const otpResponse = await authService.sendOtp(credentials.phone);
          console.log('OTP send response:', otpResponse);

          if (otpResponse.status === 'success') {
            setLoginData(credentials);
            if (credentials.phone === ADMIN_PHONE) {
              setIsAdmin(true);
            }
            navigate('/otp');
          } else {
            alert('Failed to send OTP. Please try again.');
          }
        } else {
          console.log('New user, redirecting to signup');
          alert('This phone number is not registered. Please sign up first.');
          setLoginData({ phone: credentials.phone });
          navigate('/signup');
        }
      } catch (error) {
        console.error('Login error details:', error);
        alert(error.message || 'Login failed. Please try again.');
      }
    };

  const handleAdminLogin = async (credentials) => {
    if (credentials.phone !== ADMIN_PHONE) {
      alert('Only specific admin numbers can access the admin panel.');
      return;
    }

    try {
      // Check if admin user exists
      const userData = await authService.login(credentials.phone);

      if (userData && userData.length > 0) {
        const otpResponse = await authService.sendOtp(credentials.phone);

        if (otpResponse.status === 'success') {
          setLoginData(credentials);
          setIsAdmin(true);
          navigate('/otp');
        } else {
          alert('Failed to send OTP. Please try again.');
        }
      } else {
        alert('Admin user not found. Please contact administrator.');
      }
    } catch (error) {
      console.error('Admin login error:', error);
      alert(error.message || 'Admin login failed. Please try again.');
    }
  };

  const handleOTPVerified = async (enteredOtp) => {
    try {
      console.log('OTP verification started:', loginData.phone, enteredOtp);
      const verifyResponse = await authService.verifyOtp(loginData.phone, enteredOtp);
      console.log('OTP verification result:', verifyResponse);

      if (verifyResponse.status === 'success') {
        console.log('OTP verified successfully');

        // TEMPORARY: Bypass user data fetch for testing
        if (isAdmin) {
          console.log('Navigating to admin dashboard');
          setUser({ user_name: 'Admin User', user_phone_number: ADMIN_PHONE });
          navigate('/admin-dashboard');
        } else {
          console.log('Navigating to user dashboard with temporary data');
          setUser({
            user_name: loginData.name || 'Test User',
            user_phone_number: loginData.phone
          });
          navigate('/user-dashboard');
        }

      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error details:', error);
      alert(error.message || 'OTP verification failed. Please try again.');
    }
  };

  const handleSignUp = async (userData) => {
    try {
      if (userData.phone === ADMIN_PHONE) {
        alert('This phone number is reserved for admin use. Please use a different number.');
        return;
      }

      // Check if user already exists
      const existingUser = await authService.login(userData.phone);
      if (existingUser && existingUser.length > 0) {
        alert('This phone number is already registered. Please login instead.');
        navigate('/login');
        return;
      }

      const otpResponse = await authService.sendOtp(userData.phone);

      if (otpResponse.status === 'success') {
        setLoginData(userData);
        navigate('/otp');
      } else {
        alert('Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.message || 'Signup failed. Please try again.');
    }
  };

  const handleSignUpComplete = async (enteredOtp) => {
      try {
        console.log('Signup completion started:', loginData, enteredOtp);
        const verifyResponse = await authService.verifyOtp(loginData.phone, enteredOtp);
        console.log('Signup OTP verification:', verifyResponse);

        if (verifyResponse.status === 'success') {
          console.log('Creating user data for registration:', loginData);
          const userData = {
            user_name: loginData.name,
            user_email: loginData.email,
            user_phone_number: parseInt(loginData.phone),
            user_password: loginData.password
          };

          console.log('Sending registration data:', userData);
          const registerResponse = await authService.register(userData);
          console.log('Registration response:', registerResponse);

          if (registerResponse === 'User registered successfully !!!') {
            const newUser = {
              user_name: loginData.name,
              user_email: loginData.email,
              user_phone_number: loginData.phone
            };

            setUser(newUser);
            navigate('/user-dashboard');
          } else {
            alert('Registration failed. Please try again.');
          }
        } else {
          alert('Invalid OTP. Please try again.');
        }
      } catch (error) {
        console.error('Registration error details:', error);
        alert(error.message || 'Registration failed. Please try again.');
      }
    };

  const handleLogout = () => {
    setUser(null);
    setIsAdmin(false);
    setLoginData(null);
    navigate('/login');
  };

  const switchToSignUp = () => {
    navigate('/signup');
  };

  const switchToLogin = () => {
    navigate('/login');
    setIsAdmin(false);
  };

  // Route protection
  if (location.pathname === '/admin-dashboard' && (!user || !isAdmin)) {
    return <Navigate to="/login" replace />;
  }

  if (location.pathname === '/user-dashboard' && !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/splash" replace />} />
        <Route path="/splash" element={<SplashScreen onFinish={handleSplashFinish} />} />
        <Route path="/login" element={
          <Login
            onLogin={handleLogin}
            onAdminLogin={handleAdminLogin}
            switchToSignUp={switchToSignUp}
            adminPhone={ADMIN_PHONE}
          />
        } />
        <Route path="/signup" element={
          <SignUp
            onSignUp={handleSignUp}
            switchToLogin={switchToLogin}
            prefillPhone={loginData?.phone}
            adminPhone={ADMIN_PHONE}
          />
        } />
        <Route path="/otp" element={
          <OTPVerification
            phone={loginData?.phone}
            onVerified={isAdmin ? handleOTPVerified : handleSignUpComplete}
            isSignUp={!isAdmin}
          />
        } />
        <Route path="/admin-dashboard" element={
          <AdminDashboard user={user} onLogout={handleLogout} />
        } />
        <Route path="/user-dashboard" element={
          <UserDashboard user={user} onLogout={handleLogout} />
        } />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;