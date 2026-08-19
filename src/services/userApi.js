import apiService from './apiService';

export const userApi = {
  
  // getNearbyUsers: async (radiusInKm, minAge, maxAge) => {
  //   try {
  //     const response = await apiService.get('/users/nearby', {
  //       params: {
  //         radiusInKm: radiusInKm ? Number(radiusInKm) : undefined,
  //         minAge: minAge ? Number(minAge) : undefined,
  //         maxAge: maxAge ? Number(maxAge) : undefined,
  //       },
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Get Nearby Users API Error:', error);
  //     throw error;
  //   }
  // },

  getNearbyUsers: async (radiusInKm, minAge, maxAge, lookingFor, isGlobal) => {
  try {
    const response = await apiService.get('/users/nearby', {
      params: {
        radiusInKm: radiusInKm ? Number(radiusInKm) : undefined,
        minAge: minAge ? Number(minAge) : undefined,
        maxAge: maxAge ? Number(maxAge) : undefined,
        lookingFor: lookingFor || undefined,
        global: typeof isGlobal === 'boolean' ? isGlobal : undefined,
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


reportUser: async (userId, selectedReason) => {
  return await apiService.post('/userRegistration/report-user', null, {
    params: {
      registrationId: userId,   
      reason: selectedReason,    
    },
  });
},


blockUser: async (userId) => {
  return await apiService.post('/userRegistration/block-user', null, {
    params: {
      registrationId: userId, 
    },
  });
},

unmatchUser: async (userId) => {
  const response = await apiService.delete('/likeMatch/unmatch', {
    params: { userId }
  });
  return response.data;
},

  unblockUser: async (userId) => {
    return await apiService.delete('/userRegistration/unblock-user', {
      params: {
        registrationId: userId,
      },
    });
  },


addDiscoverySource: async (discoverySourceEnum, remark = '') => {
  try {
    const payload = {
      discoverySourceEnum: discoverySourceEnum,
      remark: remark || '',
    };

    console.log('Sending Payload:', payload);
    const response = await apiService.post('/source/add-source', payload);

    return response.data;
  } catch (error) {
    console.log('Add Discovery Source Error ====>', error?.response?.data || error.message);
    throw error;
  }
},

};

export default userApi;