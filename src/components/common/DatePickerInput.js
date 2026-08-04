import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { FONTS } from '../../constants/fonts';

const DatePickerInput = ({
  label,
  value, // "YYYY-MM-DD" string
  onSelectDate, // Parent function: (formattedDateString) => void
  placeholder = 'Select date',
  error = '',
  icon: IconComponent,
  style = {},
  maximumDate = new Date(),
  minimumDate,
  mode = 'date',
}) => {
  const [open, setOpen] = useState(false);

  // Default picker date format handling
  const initialDate = value ? new Date(value) : new Date(2000, 0, 1);

  const handleConfirm = (selectedDate) => {
    setOpen(false);
    
    // Format to YYYY-MM-DD string
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day}`;
    if (onSelectDate) {
      onSelectDate(formattedDate);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setOpen(true)}
        style={[styles.inputWrapper, error ? styles.errorBorder : null]}
      >
        {IconComponent && (
          <View style={styles.iconContainer}>
            {IconComponent}
          </View>
        )}

        <Text style={[styles.textInput, !value && styles.placeholderText]}>
          {value ? value : placeholder}
        </Text>
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <DatePicker
        modal
        mode={mode}
        open={open}
        date={isNaN(initialDate.getTime()) ? new Date(2000, 0, 1) : initialDate}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </View>
  );
};

export default DatePickerInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#0B5324',
    marginBottom: 8,
    fontFamily: FONTS.REGULAR,
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
    fontSize: 16,
    color: '#333333',
  },
  placeholderText: {
    color: '#A1A1A1',
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