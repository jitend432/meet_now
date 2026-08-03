import { PermissionsAndroid, Platform } from 'react-native';

export const requestLocationPermission = async () => {
  if (Platform.OS === 'ios') {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'This app needs access to your location to complete your profile.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.error('Error while requesting location permission:', err);
    return false;
  }
};