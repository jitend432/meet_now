import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

export const CustomModal = ({
  visible = false,
  onClose,
  type = 'info',
  title,
  message,
  buttons = [],
  children,
  dismissable = true,
}) => {
  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'check', color: '#4CAF50' };
      case 'error':
        return { name: 'exclamation', color: '#F44336' };
      case 'warning':
        return { name: 'exclamation-triangle', color: '#FF9800' };
      case 'info':
        return { name: 'info', color: '#2196F3' };
      default:
        return null;
    }
  };

  const iconConfig = getIconConfig();

  const defaultButtons = [
    {
      text: 'OK',
      onPress: onClose,
      style: 'primary',
    },
  ];

  const renderButtons = buttons.length > 0 ? buttons : defaultButtons;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={dismissable ? onClose : undefined}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              
              {type !== 'none' && iconConfig && (
                <View style={[styles.modalIconBg, { backgroundColor: iconConfig.color }]}>
                  <FontAwesomeFreeSolid 
                    name={iconConfig.name} 
                    size={22} 
                    color="#FFFFFF" 
                  />
                </View>
              )}

              {title ? <Text style={styles.modalTitle}>{title}</Text> : null}
              {message ? <Text style={styles.modalMessage}>{message}</Text> : null}

              {children}

              <View style={[
                styles.buttonContainer, 
                renderButtons.length > 1 && styles.multiButtonRow
              ]}>
                {renderButtons.map((btn, index) => {
                  const isSecondary = btn.style === 'secondary' || btn.style === 'cancel';
                  return (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.modalButton,
                        isSecondary ? styles.secondaryButton : styles.primaryButton,
                        renderButtons.length > 1 && styles.flexButton,
                        btn.buttonStyle,
                      ]}
                      activeOpacity={0.8}
                      onPress={() => {
                        if (btn.onPress) btn.onPress();
                        else if (onClose) onClose();
                      }}
                    >
                      <Text style={[
                        styles.modalButtonText,
                        isSecondary ? styles.secondaryButtonText : styles.primaryButtonText,
                        btn.textStyle
                      ]}>
                        {btn.text}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  modalIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  multiButtonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
  modalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  primaryButton: {
    backgroundColor: '#1b4d22',
  },
  secondaryButton: {
    backgroundColor: '#F0F0F0',
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#333333',
  },
});