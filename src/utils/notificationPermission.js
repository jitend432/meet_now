import { PermissionsAndroid, Platform } from 'react-native';
import { getMessaging, requestPermission, AuthorizationStatus } from '@react-native-firebase/messaging';

export const notificationPermission = async () => {
  try {
    const messagingInstance = getMessaging();

    if (Platform.OS === 'ios') {
      // iOS permission check via modular API
      const authStatus = await requestPermission(messagingInstance);

      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      return enabled;
    } else {
      // Android 13+ (API 33+) Runtime Permission Check
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
          {
            title: 'Notification Permission',
            message: 'This app needs access to send you notifications for new matches and messages.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      // Android 12 and below default to true
      return true;
    }
  } catch (err) {
    console.error('Error while requesting notification permission:', err);
    return false;
  }
};