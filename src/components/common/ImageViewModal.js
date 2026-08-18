import React from 'react';
import { 
  Modal, 
  View, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions, 
  StatusBar 
} from 'react-native';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

const { width, height } = Dimensions.get('window');

const ImageViewModal = ({ visible, imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
      <View style={styles.overlay}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose} activeOpacity={0.8}>
          <FontAwesomeFreeSolid name="times" size={20} color="#ffffff" />
        </TouchableOpacity>

        {/* Full Image */}
        <Image
          source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
          style={styles.fullImage}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

export default ImageViewModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: width * 0.95,
    height: height * 0.75,
  },
});