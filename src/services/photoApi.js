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

 
uploadMultiplePhotos: async (userId, imageFiles) => {
  if (!userId || !Array.isArray(imageFiles) || imageFiles.length === 0) return null;

  try {
    const formData = new FormData();

    imageFiles.forEach((file, index) => {
      formData.append('files', {
        uri: file.uri || file.path,
        type: file.type || file.mime || 'image/jpeg',
        name: file.name || file.filename || `photo_${Date.now()}_${index}.jpg`,
      });
    });

    const response = await apiService.post(
      `/api/photos/upload-multiple/${userId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log('Upload Multiple Error ====>', error?.response?.data || error.message);
    throw error;
  }
},

  getUserPhotos: async (userId) => {
  try {
    const response = await apiService.get(`/photos/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
},

};