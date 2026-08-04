import apiService from '../services/apiService';

export const matchApi = {

handleLikeDislike: async (receiverId, action) => {
    if (!receiverId || !action) {
      console.error("handleLikeDislike Error: Missing receiverId or action.");
      return null;
    }

    const payload = {
      receiverId: Number(receiverId), // Ensured Number type for Java backend
      action: action.toUpperCase()   // "LIKE", "DISLIKE", "SUPER_LIKE"
    };

    console.log("🚀 SENDING PAYLOAD TO BACKEND /likeMatch/like-dislike ====>", JSON.stringify(payload));

    const response = await apiService.post('/likeMatch/like-dislike', payload);
    
    console.log("✅ BACKEND RESPONSE ====>", response.data);
    return response.data;
  },

getWhoLikedMe: async (pageNumber = 0, pageSize = 10) => {
  const response = await apiService.get(
    `/likeMatch/who-liked-me?pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=createdAt&sortDir=desc`
  );
  return response.data;
},

getMyMatches: async () => {
  const response = await apiService.get(
    '/likeMatch/my-matches'
  );
  return response.data;
},


}