import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown as ElementDropdown } from 'react-native-element-dropdown';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

const Dropdown = ({ label, placeholder, data, value, onSelect, error, style }) => {

  // Convert array of strings ["A", "B"] to array of objects [{ label: "A", value: "A" }]
  const formattedData = Array.isArray(data) 
    ? data.map((item) => (typeof item === 'object' ? item : { label: item, value: item }))
    : [];

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <ElementDropdown
        style={[
          styles.inputWrapper,
          error ? styles.errorBorder : null,
        ]}
        containerStyle={styles.dropdownListContainer}
        itemContainerStyle={styles.optionItemContainer}
        itemTextStyle={styles.optionText}
        dropdownPosition="bottom"
        selectedTextStyle={styles.valueText}
        placeholderStyle={styles.placeholderText}
        data={formattedData}
        labelField="label"
        valueField="value"
        placeholder={placeholder || 'Select item'}
        value={value}
        mode="auto"
        animation={true}
        onChange={(item) => {
          onSelect(item.value);
        }}
        renderRightIcon={(visible) => (
          <FontAwesomeFreeSolid 
            name={visible ? "chevron-up" : "chevron-down"} 
            size={14} 
            color="#0B5324" 
          />
        )}
      />

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B5324',
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0B5324',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 54,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  valueText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  dropdownListContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0B5324',
    borderRadius: 12,
    marginTop: 0,
    maxHeight: 250,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  optionItemContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 4,
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  errorBorder: {
    borderColor: '#FF3333',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3333',
    marginTop: 4,
    marginLeft: 4,
  },
});