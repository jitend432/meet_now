import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FONTS } from '../../constants/fonts';

const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  loading = false, 
  disabled = false,
  style = {}           
}) => {
  
  const buttonStyle = [
    styles.baseButton,
    styles[`${variant}Button`],
    disabled && styles.disabledButton,
    style
  ];

  const textStyle = [
    styles.baseText,
    styles[`${variant}Text`],
    disabled && styles.disabledText
  ];

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7} 
      disabled={disabled || loading}
      style={buttonStyle}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#FFF' : '#0B5324'} />
      ) : (
        <Text style={textStyle}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  baseButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  baseText: {
    fontSize: 16,
    fontFamily: FONTS.REGULAR
  },

  primaryButton: {
    backgroundColor: '#0B5324',
  },
  primaryText: {
    color: '#FFFFFF',
  },

  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 10,
  },
  secondaryText: {
    color: '#0B5324',
  },

  skipButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
    width: 'auto', 
  },
  skipText: {
    color: '#0B5324',
    fontSize: 14,
    fontWeight: '600',
  },

  dangerButton: {
    backgroundColor: '#b71c1c',
    borderRadius: 12,
  },
  dangerText: {
    color: '#FFFFFF',
  },

  cancelButton: {
    backgroundColor: '#e8ebe9',
    borderRadius: 12,
  },
  cancelText: {
    color: '#2e4a38',
  },

  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  disabledText: {
    color: '#A1A1A1',
  }
});