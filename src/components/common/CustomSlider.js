import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';

const CustomSlider = ({
  label,
  value = 0,
  onValueChange,
  onSlidingComplete,
  minimumValue = 1,
  maximumValue = 100,
  step = 1,
  unit = '',
  error,
  style,
  minimumTrackTintColor = '#0B5324',
  maximumTrackTintColor = '#E0E0E0',
  thumbTintColor = '#0B5324',
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Header Label and Current Value */}
      <View style={styles.headerRow}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <Text style={styles.valueText}>
          {Math.round(value)} {unit}
        </Text>
      </View>

      {/* Slider Component */}
      <Slider
        style={styles.slider}
        value={value}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
        minimumTrackTintColor={minimumTrackTintColor}
        maximumTrackTintColor={maximumTrackTintColor}
        thumbTintColor={thumbTintColor}
      />

      {/* Range Min & Max Text */}
      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>
          {minimumValue} {unit}
        </Text>
        <Text style={styles.rangeText}>
          {maximumValue} {unit}
        </Text>
      </View>

      {/* Error Message */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default CustomSlider;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B5324',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B5324',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  rangeText: {
    fontSize: 12,
    color: '#888888',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3333',
    marginTop: 4,
    marginLeft: 4,
  },
});