import { PermissionsAndroid, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

export const notificationPermission = async () => {
  try {
    if (Platform.OS === 'ios') {
      // iOS permission
      const authStatus = await messaging().requestPermission();

      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      return enabled;
    } else {
      // Android 13+ ke liye runtime permission
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs access to send you notifications.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      return true;
    }
  } catch (err) {
    console.error('Error while requesting notification permission:', err);
    return false;
  }
};