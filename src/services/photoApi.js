import { Platform } from 'react-native';
import apiService from '../services/apiService';

export const photoApi = {

  uploadPhoto: async (userId, imageFile) => {
    if (!userId || !imageFile?.uri) return null;

    const formData = new FormData();
    formData.append('file', {
      uri: Platform.OS === 'ios' ? imageFile.uri.replace('file://', '') : imageFile.uri,
      type: imageFile.type || 'image/jpeg',
      name: imageFile.name || `photo_${Date.now()}.jpg`,
    });

    const response = await apiService.post(`/photos/upload/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
  
 uploadSinglePhoto: async (userId, fileObject) => {
  if (!userId || !fileObject) return null;

  const formData = new FormData();
  formData.append('file', { // Exact Postman field key mapping 'file'
    uri: Platform.OS === 'ios' ? fileObject.uri.replace('file://', '') : fileObject.uri,
    type: fileObject.type || 'image/jpeg',
    name: fileObject.name || `photo_${Date.now()}.jpg`,
  });

  const response = await apiService.post(`/photos/upload/${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
},

  // uploadMultiplePhotos: async (userId, imageFiles) => {
  //   if (!userId || !Array.isArray(imageFiles) || imageFiles.length === 0) return null;

  //   const formData = new FormData();
  //   imageFiles.forEach((file) => {
  //     formData.append('files', {
  //       uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
  //       type: file.type || 'image/jpeg',
  //       name: file.name || `photo_${Date.now()}_${Math.random().toString(36).substr(2, 5)}.jpg`,
  //     });
  //   });

  //   const response = await apiService.post(`/photos/upload-multiple/${userId}`, formData, {
  //     headers: {
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });

  //   return response.data;
  // },

  uploadMultiplePhotos: async (userId, imageFiles) => {
  if (!userId || !Array.isArray(imageFiles) || imageFiles.length === 0) return null;

  try {
    // Kyunki Swagger 'array<string> (query)' maang raha hai, hume uris/strings ki ek simple array banani hogi
    // Agar aapka backend base64 string maangta hai toh imageFiles me base64 strings bhejein, agar raw uri toh uri bhejein.
    const filesArray = imageFiles.map(file => file.uri || file);

    // Axios configuration me params dalne se woh automatic use URL query parameter (?files=abc&files=xyz) bana deta hai
    const response = await apiService.post(`/photos/upload-multiple/${userId}`, null, {
      params: {
        files: filesArray 
      }
    });

    return response.data;
  } catch (error) {
    throw error;
  }
},

  getUserPhotos: async (userId) => {
    try {
      const response = await apiService.get(`/photos/user/${userId}`);
      return response.data; // Yeh { msg, status, data } return karega
    } catch (error) {
      throw error;
    }
  },

};