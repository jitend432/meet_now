import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const PaymentMethodItem = ({ title, subtitle, icon, isSelected, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconWrapper}>
          {icon}
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.subtitleText}>{subtitle}</Text>
        </View>
      </View>

      {/* Custom Dynamic Radio Indicator */}
      <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
        {isSelected && (
          <View style={styles.radioInnerCheck}>
            <Text style={styles.checkMark}>✓</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default PaymentMethodItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  selectedContainer: {
    borderColor: '#1B4D22',
    borderWidth: 1.5,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  textWrapper: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1B4D22',
    marginBottom: 2,
  },
  subtitleText: {
    fontSize: 12,
    color: '#666666',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#94A3B8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#1B4D22',
    backgroundColor: '#1B4D22',
  },
  radioInnerCheck: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    marginTop: -1,
  },
});