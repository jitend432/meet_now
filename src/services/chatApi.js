import apiService from '../services/apiService';

export const chatApi = {
  
  getAllChats: async () => {
    const response = await apiService.get('/chats');
    return response.data;
  },

  
  getChatHistory: async (receiverId) => {
    const response = await apiService.get(`/chats/history/${receiverId}`);
    return response.data;
  },

  
  sendMessage: async (receiverId, messageText) => {
    const response = await apiService.post('/chats/send', { receiverId, messageText });
    return response.data;
  },

  getChatMessages: async (userId) => {
    try {
      const response = await apiService.get(`/chat/messages/${userId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getChatList: async () => {
  const response = await apiService.get('/chat/list');
  return response.data;
},

};