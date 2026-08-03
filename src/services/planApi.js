import apiService from './apiService';

const planApi = {
  getPlans: async (pageNo = 0, pageSize = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await apiService.get('/plans', {
        params: {
          pageNo,
          pageSize,
          sortBy,
          sortDir,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get Plans API Error:', error);
      throw error;
    }
  },

  createPlan: async (planData) => {
    try {
      if (!planData) {
        console.error('createPlan Error: Plan data is missing.');
        return null;
      }
      const response = await apiService.post('/plans', planData);
      return response.data;
    } catch (error) {
      console.error('Create Plan API Error:', error);
      throw error;
    }
  },

  getActivePlans: async (pageNo = 0, pageSize = 10, sortBy = 'id', sortDir = 'asc') => {
    try {
      const response = await apiService.get('/plans/active-plan', {
        params: {
          pageNo,
          pageSize,
          sortBy,
          sortDir,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get Active Plans API Error:', error);
      throw error;
    }
  },

  createOrder: async (userId, planType) => {
  const response = await apiService.post('/payments/create-order', { userId, planType });
  return response.data;
},

verifyPayment: async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const response = await apiService.post('/payments/verify', { 
    razorpayOrderId,  
    razorpayPaymentId, 
    razorpaySignature   
  });
  return response.data;
}

};

export default planApi;