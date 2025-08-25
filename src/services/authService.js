import api from './api';

export const authService = {
  // Send OTP
  sendOtp: async (phoneNumber) => {
    try {
      const response = await api.post('/sendotp', {
        user_phone_number: phoneNumber
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send OTP');
    }
  },

  // Verify OTP
  verifyOtp: async (phoneNumber, otp) => {
    try {
      const response = await api.post('/verifyotp', {
        user_phone_number: phoneNumber,
        otp: otp
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
  },

  // User login - check if user exists (original login function)
  login: async (phoneNumber) => {
    try {
      // Convert phone number to Long for backend
      const phoneLong = parseInt(phoneNumber);
      const response = await api.get('/login', {
        params: { user_phone_number: phoneLong }
      });
      return response.data;
    } catch (error) {
      // If user doesn't exist, return empty array
      if (error.response?.status === 404 || error.response?.data?.length === 0) {
        return [];
      }
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  // User registration
  register: async (userData) => {
    try {
      const response = await api.post('/register', {
        user_name: userData.user_name,
        user_email: userData.user_email,
        user_phone_number: userData.user_phone_number,
        user_password: userData.user_password
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  }
};