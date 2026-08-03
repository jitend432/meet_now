import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MessageBubble = ({ text, time, isMe }) => {
  return (
    <View style={[styles.messageWrapper, isMe ? styles.myMessageWrapper : styles.theirMessageWrapper]}>
      {/* Message Bubble Box */}
      <View style={[
        styles.bubbleContainer, 
        isMe ? styles.myBubble : styles.theirBubble
      ]}>
        <Text style={styles.messageText}>{text}</Text>
      </View>

      {/* Timestamp beneath the message box */}
      <Text style={[styles.timeText, isMe ? styles.myTime : styles.theirTime]}>
        {time || '10:00 AM'}
      </Text>
    </View>
  );
};

export default MessageBubble;

const styles = StyleSheet.create({
  messageWrapper: {
    marginBottom: 12,
    maxWidth: '75%',
  },
  myMessageWrapper: {
    alignSelf: 'flex-end',
    alignItems: 'flex-end',
  },
  theirMessageWrapper: {
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
  },
  bubbleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    // Creating the distinct leaf/bubble cuts seen in your image
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 2,
  },
  myBubble: {
    backgroundColor: '#1E5E2E', // Darker Green (Right)
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 4, // WhatsApp styled corner cut
  },
  theirBubble: {
    backgroundColor: '#15B819', // Bright Light Green (Left)
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 20,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  timeText: {
    fontSize: 11,
    color: '#4E6146',
    marginTop: 4,
    fontWeight: '500',
  },
  myTime: {
    marginRight: 6,
  },
  theirTime: {
    marginLeft: 6,
  },
});