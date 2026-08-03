import React from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';
import { FONTS } from '../../constants/fonts';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error = '',
  icon : IconComponent,
  style = {},
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, error ? styles.errorBorder : null]}>
        
        {IconComponent && (
          <View style={styles.iconContainer}>
            {IconComponent}
          </View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#A1A1A1"
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={styles.textInput}
          {...props}
        />
      </View>

    
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#0B5324', 
    marginBottom: 8,
    fontFamily: FONTS.REGULAR
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
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
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: '100%',
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