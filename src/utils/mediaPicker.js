import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Alert, Platform } from 'react-native';

export const openMediaPicker = async (type = 'mixed', selectionMode = 'library') => {
  const options = {
    mediaType: type,
    quality: 0.8,
    includeBase64: false,
  };

  try {
    let result;
    if (selectionMode === 'camera') {
      result = await launchCamera(options);
    } else {
      result = await launchImageLibrary(options);
    }

    if (result.didCancel) {
      return null;
    }

    if (result.errorCode) {
      Alert.alert('Error', result.errorMessage || 'Something went wrong with media picker');
      return null;
    }

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      
      return {
        uri: Platform.OS === 'android' ? asset.uri : asset.uri.replace('file://', ''),
        type: asset.type || 'image/jpeg',
        name: asset.fileName || `media_${Date.now()}.${asset.type?.split('/')[1] || 'jpg'}`,
        fileSize: asset.fileSize,
        width: asset.width,
        height: asset.height,
      };
    }

    return null;
  } catch (error) {
    return null;
  }
};