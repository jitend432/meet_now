import * as Keychain from 'react-native-keychain';

const keychainStorage = {
  setItem: async (key, value) => {
    try {
      
      await Keychain.setGenericPassword(key, value, { service: key });
      return true;
    } catch (error) {
      console.error('Keychain setItem error:', error);
      return false;
    }
  },
  getItem: async (key) => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: key });
      if (credentials) {
        return credentials.password; 
      }
      return null;
    } catch (error) {
      console.error('Keychain getItem error:', error);
      return null;
    }
  },
  removeItem: async (key) => {
    try {
      await Keychain.resetGenericPassword({ service: key });
      return true;
    } catch (error) {
      console.error('Keychain removeItem error:', error);
      return false;
    }
  },
};

export default keychainStorage;