import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

const ChatActionButtons = ({ onCall, onVideo, onMenu }) => {
  return (
    <View style={styles.container}>
      {/* <TouchableOpacity style={styles.btn} onPress={onCall} activeOpacity={0.7}>
        <FontAwesomeFreeSolid name="phone" size={18} color="#265c32" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.btn} onPress={onVideo} activeOpacity={0.7}>
        <FontAwesomeFreeSolid name="video" size={18} color="#265c32" />
      </TouchableOpacity> */}
      
      <TouchableOpacity style={styles.btn} onPress={onMenu} activeOpacity={0.7}>
        <FontAwesomeFreeSolid name="ellipsis-v" size={20} color="#265c32" />
      </TouchableOpacity>
    </View>
  );
};

export default ChatActionButtons;

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  btn: { 
    paddingHorizontal: 10, 
    paddingVertical: 6, 
    marginLeft: 4 
  },
});