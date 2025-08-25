import api from './api';

export const authService = {
  // Send OTP
  sendOtp: async (phoneNumber) => {
    try {
      console.log('Sending OTP to:', phoneNumber);
      const response = await api.post('/sendotp', {
        user_phone_number: phoneNumber
      });
      console.log('OTP Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('OTP Send Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Verify OTP
  verifyOtp: async (phoneNumber, otp) => {
    try {
      console.log('Verifying OTP:', phoneNumber, otp);
      const response = await api.post('/verifyotp', {
        user_phone_number: phoneNumber,
        otp: otp
      });
      console.log('OTP Verification Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('OTP Verify Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
  },

  // User login - check if user exists
  login: async (phoneNumber) => {
    try {
      console.log('Checking user exists:', phoneNumber);
      const phoneLong = parseInt(phoneNumber);
      const response = await api.get('/login', {
        params: { user_phone_number: phoneLong }
      });
      console.log('User check response:', response.data);
      return response.data;
    } catch (error) {
      console.error('User check error:', error.response?.data || error.message);
      if (error.response?.status === 404 || error.response?.data?.length === 0) {
        return [];
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // User registration
  register: async (userData) => {
    try {
      console.log('Registering user data:', userData);
      const registrationData = {
        user_name: userData.user_name,
        user_email: userData.user_email,
        user_phone_number: userData.user_phone_number,
        user_password: userData.user_password
      };
      console.log('Sending to backend:', registrationData);

      const response = await api.post('/register', registrationData);
      console.log('Registration response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },
};