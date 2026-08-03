import Purchases from 'react-native-purchases';
import { Platform } from 'react-native';

export const initRevenueCat = async (userId) => {
  try {
    // 1. SDK Configure karein
    if (Platform.OS === 'ios') {
      Purchases.configure({ apiKey: "appl_YOUR_IOS_API_KEY" });
    } else if (Platform.OS === 'android') {
      Purchases.configure({ apiKey: "goog_EiJOlEfyALWIoeEzmHFVADrUKBU" });
    }

    if (userId) {
      await Purchases.logIn(String(userId));
    }
  } catch (error) {
    console.error("RevenueCat Init Error:", error);
  }
};