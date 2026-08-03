import apiService from '../services/apiService';

export const matchApi = {

handleLikeDislike: async (targetUserId, actionType) => {
  if (!targetUserId || !actionType) {
    console.error("handleLikeDislike Error: Missing targetUserId or actionType.");
    return null;
  }
  
  const payload = {
    targetUserId: targetUserId,
    action: actionType.toUpperCase() // Handles 'LIKE', 'DISLIKE', 'SUPERLIKE' safely
  };

  const response = await apiService.post('/likeMatch/like-dislike', payload);
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