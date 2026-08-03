import apiService from './apiService';

export const paymentApi = {

  createOrder: async (userId, planType) => {
    try {
      if (!userId || !planType) {
        console.error('createOrder Error: userId or planType is missing.');
        return null;
      }
      const response = await apiService.post('/payments/create-order', {
        userId,
        planType,
      });
      return response.data;
    } catch (error) {
      console.error('Create Payment Order API Error:', error);
      throw error;
    }
  },

  verifyPayment: async (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
    try {
      if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        console.error('verifyPayment Error: Required verification fields are missing.');
        return null;
      }
      const response = await apiService.post('/payments/verify', {
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      });
      return response.data;
    } catch (error) {
      console.error('Verify Payment API Error:', error);
      throw error;
    }
  },

  getTransactionHistory: async (pageNo = 0, pageSize = 10) => {
    try {
      const response = await apiService.get('/payments/history', {
        params: {
          pageNo,
          pageSize,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Get Transaction History API Error:', error);
      throw error;
    }
  },
};

