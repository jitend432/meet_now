import { 
  getMessaging,
  getToken, 
  onMessage, 
  onTokenRefresh, 
  onNotificationOpenedApp, 
  getInitialNotification,
  setBackgroundMessageHandler
} from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { notificationPermission } from './notificationPermission';
import userApi from '../services/userApi';

const messagingInstance = getMessaging();

setBackgroundMessageHandler(messagingInstance, async (remoteMessage) => {
  console.log('Background message received in background handler:', remoteMessage);
});

export const getFCMToken = async (userId) => {
  try {
    if (!userId) {
      console.log("FCM Setup: userId missing.");
      return null;
    }

    const hasPermission = await notificationPermission();
    if (!hasPermission) {
      console.log("Notification permission denied");
      return null;
    }

    const fcmToken = await getToken(messagingInstance);
    if (fcmToken) {
      console.log("Your Device FCM Token:", fcmToken);
      
      const tokenPayload = {
        userId: userId,
        fcmToken: fcmToken,
        platform: Platform.OS
      };

      const result = await userApi.submitFCMToken(tokenPayload);
      console.log("FCM Token synced with backend:", result);
      
      return fcmToken;
    }
  } catch (error) {
    console.error("Error fetching or syncing FCM token:", error);
  }
};

export const initNotificationListeners = async (userId) => {
  if (!userId) return () => {};

  // Create Channel ONCE before listening
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });

  // 2. Foreground Message Listener
  const unsubscribeForeground = onMessage(messagingInstance, async (remoteMessage) => {
    console.log('Foreground message received:', remoteMessage);

    // Fallback: Agar notification object empty ho, to data object se title/body uthao
    const title = remoteMessage.notification?.title || remoteMessage.data?.title || 'Vynk Dating';
    const body = remoteMessage.notification?.body || remoteMessage.data?.body || remoteMessage.data?.message || '';

    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        smallIcon: 'ic_launcher', // CRITICAL: Small icon fix for Android
        pressAction: {
          id: 'default',
        },
      },
    });
  });

  const unsubscribeTokenRefresh = onTokenRefresh(messagingInstance, async (newToken) => {
    console.log("FCM Token refreshed:", newToken);
    try {
      await userApi.submitFCMToken({
        userId: userId,
        fcmToken: newToken,
        platform: Platform.OS
      });
    } catch (err) {
      console.error("Failed to update refreshed token:", err);
    }
  });

  onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
    console.log('Clicked from background state:', remoteMessage);
    // Navigation logic here if needed
  });

  getInitialNotification(messagingInstance)
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log('Clicked from quit state:', remoteMessage);
        // Navigation logic here if needed
      }
    })
    .catch((err) => console.error("Error reading initial notification:", err));

  return () => {
    unsubscribeForeground();
    unsubscribeTokenRefresh();
  };
};