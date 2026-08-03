import React, { useRef, useState } from 'react';
import { StyleSheet, View, PanResponder } from 'react-native';

const CustomRangeSlider = ({ initialPercentage = 50, onValueChange }) => {
  const [sliderWidth, setSliderWidth] = useState(0);
  const [percentage, setPercentage] = useState(initialPercentage);
  
  const handleScaleUpdate = (gestureState, layoutWidth) => {
    if (!layoutWidth) return;
    
    let newPercent = Math.round((gestureState.moveX - 16) / layoutWidth * 100); 
    newPercent = Math.max(0, Math.min(100, newPercent));
    
    setPercentage(newPercent);
    if (onValueChange) {
      onValueChange(newPercent);
    }
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        handleScaleUpdate(gestureState, sliderWidth);
      },
      onPanResponderRelease: (evt, gestureState) => {
        handleScaleUpdate(gestureState, sliderWidth);
      },
    })
  ).current;

  return (
    <View 
      style={styles.sliderContainer}
      onLayout={(event) => setSliderWidth(event.nativeEvent.layout.width)}
    >
      <View style={styles.inactiveTrack}>
        {/* Active colored line track */}
        <View style={[styles.activeTrack, { width: `${percentage}%` }]} />
        
        <View 
          {...panResponder.panHandlers}
          style={[styles.thumbPointer, { left: `${percentage}%` }]} 
        />
      </View>
    </View>
  );
};

export default CustomRangeSlider;

const styles = StyleSheet.create({
  sliderContainer: {
    height: 30,
    justifyContent: 'center',
    width: '100%',
    marginVertical: 4,
  },
  inactiveTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#a5d6a7',
    position: 'relative',
    justifyContent: 'center',
  },
  activeTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#265c32',
    position: 'absolute',
  },
  thumbPointer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#265c32',
    position: 'absolute',
    transform: [{ translateX: -10 }],
  },
});