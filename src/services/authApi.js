import apiService from '../services/apiService';

export const authApi = {
  login: async (email, password) => {
    const response = await apiService.post('/auth/login', {
       username: email,
      password 
    });
    return response.data;
  },

  register: async (userData) => {
    const response = await apiService.post('/userRegistration/register', userData);
    return response.data;
  },

  updateProfile: async (registrationId, profileData) => {
  const cleanId = Number(registrationId);

  const response = await apiService.put(
    `/users/update/${cleanId}?registrationId=${cleanId}`, 
    profileData
  );

  return response.data;
},

  getMyProfile: async (registrationId) => {
    const response = await apiService.get(`/users/${registrationId}`);
    return response.data;
  },

  submitUserDetails: async (completePayload) => {
  const response = await apiService.post('/users/details-submit', completePayload);
  return response.data;
},

  updateUserLocation: async (registrationId, locationPayload) => {
  const response = await apiService.put(`/users/location/${registrationId}`, locationPayload);
  return response.data;
},

viewUserProfile: async (id) => {
  if (!id) {
    console.error("viewUserProfile Error: User ID is missing.");
    return null;
  }
  const response = await apiService.get(`/users/view/${id}`);
  return response.data;
},

verifyOtp: async (email, otpCode) => {
  if (!email || !otpCode) {
    console.error("verifyOtp Error: Missing email or OTP code.");
    return null;
  }

  const payload = {
    email: email,
    otp: otpCode
  };

  const response = await apiService.post('/userRegistration/verify-otp', payload);
  return response.data;
},

resendOtp: async (email) => {
    if (!email) {
      console.error("resendOtp Error: Email is missing.");
      return null;
    }
    const response = await apiService.post('/userRegistration/resend-otp', {
      email: email,
    });
    return response.data;
  },
  
  forgotPassword: async (email) => {
  const response = await apiService.post('/userRegistration/forgot-password', { email });
  return response.data;
},

resetPassword: async (email, otp, password, confirmPassword) => {
  const response = await apiService.post('/userRegistration/reset-password', { 
    email, 
    otp, 
    password, 
    confirmPassword 
  });
  return response.data;
},

 

 deleteUser: async (id, remark) => {
  const response = await apiService.delete('/userRegistration/delete', {
    params: {
      id: Number(id),
      remark: remark || '',
    },
  });
  return response.data;
},

};
