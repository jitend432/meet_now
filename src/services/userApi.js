import apiService from './apiService';

export const userApi = {
  getNearbyUsers: async (radiusInKm) => {
    try {
      const response = await apiService.get('/users/nearby', {
        params: {
          radiusInKm: radiusInKm,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get Nearby Users API Error:', error);
      throw error;
    }
  },

   submitFCMToken: async (tokenPayload) => {
  const response = await apiService.post('/user-device/submit-token', tokenPayload);
  return response.data;
},

getUserProfileById: async (userId) => {
  const response = await apiService.get(`/users/view/${userId}`);
  return response.data;
},

};

export default userApi;