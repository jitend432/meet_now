import React from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';

const CustomToggle = ({ isOn, onToggle }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onToggle}
      style={[
        styles.switchTrack, 
        isOn ? styles.trackOn : styles.trackOff
      ]}
    >
      <View style={[
        styles.switchThumb, 
        isOn ? styles.thumbOn : styles.thumbOff
      ]} />
    </TouchableOpacity>
  );
};

export default CustomToggle;

const styles = StyleSheet.create({
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: '#265c32',
  },
  trackOff: {
    backgroundColor: '#b9f6ca',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  thumbOn: {
    alignSelf: 'flex-end',
  },
  thumbOff: {
    alignSelf: 'flex-start',
  },
});