import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

const Dropdown = ({ label, placeholder, data, value, onSelect, error, style }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const inputRef = useRef(null);

  const expandAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const formattedData = Array.isArray(data)
    ? data.map((item) => (typeof item === 'object' ? item : { label: item, value: item }))
    : [];

  const selectedLabel = formattedData.find((item) => item.value === value)?.label;

  const openDropdown = () => {
    inputRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownLayout({ x, y, width, height });
      setIsOpen(true);

      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: 1,
          duration: 220,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const closeDropdown = (callback) => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsOpen(false);
      if (callback) callback();
    });
  };

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const animatedHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(formattedData.length * 52, 220)],
  });

  const animatedOpacity = expandAnim.interpolate({
    inputRange: [0, 0.3, 1],
    outputRange: [0, 0.4, 1],
  });

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input Target */}
      <TouchableOpacity
        ref={inputRef}
        style={[styles.inputWrapper, error && styles.errorBorder]}
        activeOpacity={0.7}
        onPress={openDropdown}
      >
        <Text style={selectedLabel ? styles.valueText : styles.placeholderText}>
          {selectedLabel || placeholder || 'Select item'}
        </Text>
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <FontAwesomeFreeSolid name="chevron-down" size={14} color="#0B5324" />
        </Animated.View>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Smooth Modal Overlay List */}
      <Modal visible={isOpen} transparent animationType="none" onRequestClose={() => closeDropdown()}>
        <TouchableWithoutFeedback onPress={() => closeDropdown()}>
          <View style={styles.modalOverlay}>
            <Animated.View
              style={[
                styles.dropdownListContainer,
                {
                  top: dropdownLayout.y + dropdownLayout.height + 6,
                  left: dropdownLayout.x,
                  width: dropdownLayout.width,
                  height: animatedHeight,
                  opacity: animatedOpacity,
                },
              ]}
            >
              <ScrollView
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                nestedScrollEnabled={true}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                {formattedData.map((item, index) => {
                  const isSelected = item.value === value;
                  return (
                    <TouchableOpacity
                      key={index.toString()}
                      style={[
                        styles.optionItemContainer,
                        isSelected && styles.selectedOptionBackground,
                        index === formattedData.length - 1 && { borderBottomWidth: 0 },
                      ]}
                      activeOpacity={0.6}
                      onPress={() => {
                        closeDropdown(() => onSelect(item.value));
                      }}
                    >
                      <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                        {item.label}
                      </Text>
                      {isSelected && (
                        <FontAwesomeFreeSolid name="check" size={12} color="#0B5324" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  valueText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#aaa',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  dropdownListContainer: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0B5324',
    borderRadius: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  optionItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  selectedOptionBackground: {
    backgroundColor: '#F3F9F4',
  },
  optionText: {
    fontSize: 15,
    color: '#333333',
  },
  selectedOptionText: {
    fontWeight: '700',
    color: '#0B5324',
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