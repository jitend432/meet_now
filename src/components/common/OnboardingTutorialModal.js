import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';

const OnboardingTutorialModal = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
    >
      <View style={styles.overlayContainer}>
        <View style={styles.contentWrapper}>
          
          {/* Hand Icon */}
          <Text style={styles.waveEmoji}>👋</Text>

          {/* Heading */}
          <Text style={styles.title}>Let's get you ready!</Text>

          {/* Subheading */}
          <Text style={styles.subtitle}>
            Here's everything you need to know
          </Text>

          {/* Start Tutorial Pill Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onClose}
            style={styles.startButton}
          >
            <Text style={styles.startButtonText}>Start Swiping</Text>
          </TouchableOpacity>

          {/* Skip Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onClose}
            style={styles.skipButton}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default OnboardingTutorialModal;

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  contentWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 20,
  },
  waveEmoji: {
    fontSize: 44,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  startButtonText: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '700',
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});