import apiService from '../services/apiService';

export const matchApi = {

handleLikeDislike: async (receiverId, action) => {
    if (!receiverId || !action) {
      console.error("handleLikeDislike Error: Missing receiverId or action.");
      return null;
    }

    const payload = {
      receiverId: Number(receiverId), 
      action: action.toUpperCase()   
    };

    console.log("🚀 SENDING PAYLOAD TO BACKEND /likeMatch/like-dislike ====>", JSON.stringify(payload));

    const response = await apiService.post('/likeMatch/like-dislike', payload);
    
    console.log("✅ BACKEND RESPONSE ====>", response.data);
    return response.data;
  },

getWhoLikedMe: async (pageNumber = 0, pageSize = 10, sortBy = 'createdAt', sortDir = 'desc') => {
  const response = await apiService.get('/likeMatch/who-liked-me', {
    params: {
      pageNumber,
      pageSize,
      sortBy,
      sortDir,
    },
  });
  return response.data;
},

getMyMatches: async () => {
  const response = await apiService.get(
    '/likeMatch/my-matches'
  );
  return response.data;
},

  rewindLastSwipe: async () => {
    try {
      const response = await apiService.get('/likeMatch/rewind');
      console.log("✅ REWIND API RESPONSE ====>", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Rewind API Error:", error?.response?.data || error.message);
      throw error;
    }
  },

getMySendingLikes: async () => {
  const response = await apiService.get('/likeMatch/my-sending-likes');
  return response.data;
},

}