import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView,
  LayoutAnimation, 
  Platform,
  UIManager
} from 'react-native';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const Dropdown = ({ label, placeholder, data, value, onSelect, error, style }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext({
      duration: 250,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      }
    });
    setIsOpen(!isOpen);
  };

  const handleSelect = (item) => {
    onSelect(item);
    toggleDropdown(); // Select karte hi smoothly close hoga
  };

  return (

    <View style={[styles.container, style, { zIndex: isOpen ? 5000 : 1 }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity 
        style={[
          styles.inputWrapper, 
          error ? styles.errorBorder : null,
          isOpen ? styles.activeBorder : null
        ]} 
        activeOpacity={0.8} 
        onPress={toggleDropdown}
      >
        <Text style={[styles.valueText, !value && styles.placeholderText]}>
          {value ? value : placeholder}
        </Text>
        
        <FontAwesomeFreeSolid 
          name={isOpen ? "chevron-up" : "chevron-down"} 
          size={14} 
          color="#0B5324" 
        />
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.dropdownListContainer}>
          <ScrollView 
            nestedScrollEnabled={true}
            style={styles.scrollViewStyle}
          >
            {data.map((item, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.optionItem, 
                  value === item && styles.selectedOptionItem
                ]}
                onPress={() => handleSelect(item)}
              >
                <Text style={[
                  styles.optionText, 
                  value === item && styles.selectedOptionText
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
    position: 'relative', 
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B5324', 
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  activeBorder: {
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
    borderWidth: 1.5,
  },
  valueText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    color: '#aaa',
  },
  
  dropdownListContainer: {
    position: 'absolute',
    top: 86, 
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderTopWidth: 0, 
    borderColor: '#0B5324',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: 160, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 9999,
  },
  scrollViewStyle: {
    width: '100%',
  },
  optionItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#F0F0F0',
  },
  selectedOptionItem: {
    backgroundColor: '#E8F5E9', 
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
  },
  selectedOptionText: {
    fontWeight: 'bold',
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