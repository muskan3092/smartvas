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
      // Check if user exists using the login function
      const userData = await authService.login(credentials.phone);

      if (userData && userData.length > 0) {
        // User exists, send OTP
        const otpResponse = await authService.sendOtp(credentials.phone);

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
        // New user - redirect to signup
        alert('This phone number is not registered. Please sign up first.');
        setLoginData({ phone: credentials.phone });
        navigate('/signup');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.message.includes('Network Error') || error.message.includes('CORS')) {
        alert('Connection error. Please check your network and try again.');
      } else {
        alert(error.message || 'Login failed. Please try again.');
      }
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
      const verifyResponse = await authService.verifyOtp(loginData.phone, enteredOtp);

      if (verifyResponse.status === 'success') {
        if (isAdmin) {
          // For admin, navigate directly to dashboard
          navigate('/admin-dashboard');
        } else {
          // For regular users, get user data after OTP verification
          const userData = await authService.login(loginData.phone);
          if (userData && userData.length > 0) {
            setUser(userData[0]);
            navigate('/user-dashboard');
          } else {
            alert('User data not found after OTP verification.');
          }
        }
      } else {
        alert('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
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
      const verifyResponse = await authService.verifyOtp(loginData.phone, enteredOtp);

      if (verifyResponse.status === 'success') {
        // OTP verified, now register the user with proper data structure
        const userData = {
          user_name: loginData.name,
          user_email: loginData.email,
          user_phone_number: parseInt(loginData.phone),
          user_password: loginData.password
        };

        const registerResponse = await authService.register(userData);

        if (registerResponse === 'User registered successfully !!!') {
          // Registration successful - create user object for frontend
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
      console.error('Registration error:', error);
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