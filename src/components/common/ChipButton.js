import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet 
} from 'react-native';

export const ChipButton = ({
  label,
  onPress,
  icon,
  containerStyle,
  labelStyle,
}) => {
  return (
    <TouchableOpacity 
      style={[styles.chipContainer, containerStyle]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.chipText, labelStyle]}>{label}</Text>
      {icon && icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#2e5e3b',
    borderRadius: 12,       
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  chipText: {
    fontSize: 16,
    color: '#2e5e3b',       
    marginRight: 10,        
    fontWeight: '500',
  },
});