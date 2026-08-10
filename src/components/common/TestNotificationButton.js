import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import notifee, { AndroidImportance } from '@notifee/react-native';

export const TestNotificationButton = () => {
  const handleTestLocalNotification = async () => {
    try {
      await notifee.requestPermission();

      const channelId = await notifee.createChannel({
        id: 'default_channel',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: 'Test Local Push 🚀',
        body: 'Notification layout and FCM setup working fine!',
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('Local Notification Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        activeOpacity={0.8} 
        onPress={handleTestLocalNotification}
      >
        <Text style={styles.buttonText}>🔔 Send Test Notification</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  button: {
    backgroundColor: '#1b4d22',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});