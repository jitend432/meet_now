import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import { COLORS, FONTSIZE } from '../../constants/theme';
import { FONTS } from '../../constants/fonts';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { photoApi } from '../../services/photoApi';
import { useAppSelector } from '../../redux/hooks';
import { CustomModal } from '../../components/common/CustomModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MAIN_BOX_SIZE = SCREEN_WIDTH - 40; 

const AddPhotosScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [photos, setPhotos] = useState([]); 
  const [selectedIndex, setSelectedIndex] = useState(0);

  const userId = useAppSelector((state) => state.auth.userId);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    buttons: []
  });

  const showAlertModal = (title, message, type = 'info', buttons = []) => {
    setModalConfig({ title, message, type, buttons });
    setModalVisible(true);
  };

  // Image Picker with Native Zoom & Crop
  const openCropPicker = (replaceIdx = null) => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1400,
      cropping: true,
      cropperCircleOverlay: false,
      freeStyleCropEnabled: false, // 1:1 Aspect ratio fix
      showCropGuidelines: true,    // Grid lines dikhane ke liye
      mediaType: 'photo',
      compressImageQuality: 0.8,
    })
      .then((image) => {
        const fileData = {
          uri: image.path,
          type: image.mime,
          name: image.filename || `photo_${Date.now()}.${image.mime.split('/')[1] || 'jpg'}`,
          size: image.size,
        };

        if (replaceIdx !== null) {
          // Replace selected image
          const updated = [...photos];
          updated[replaceIdx] = fileData;
          setPhotos(updated);
        } else {
          // Add new image
          setPhotos((prev) => [...prev, fileData]);
          setSelectedIndex(photos.length);
        }
      })
      .catch((error) => {
        if (error?.code !== 'E_PICKER_CANCELLED') {
          showAlertModal('Error', error?.message || 'Failed to pick image', 'error');
        }
      });
  };

  // Save / Upload handler
  const handleUpload = async () => {
    const activePhoto = photos[selectedIndex];
    if (!activePhoto) {
      showAlertModal('Photo Required', 'Please add a photo first.', 'warning');
      return;
    }

    try {
      setLoading(true);
      const result = await photoApi.uploadSinglePhoto(userId, activePhoto);

      const isSuccess =
        result?.status === true ||
        result?.status === 200 ||
        result?.success === true ||
        result?.status === 'success';

      if (isSuccess) {
        showAlertModal('Success', 'Profile photo uploaded successfully!', 'success', [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              navigation.goBack();
            },
          },
        ]);
      } else {
        showAlertModal('Upload Failed', result?.message || 'Upload failed.', 'error');
      }
    } catch (error) {
      showAlertModal(
        'Upload Failed',
        error?.response?.data?.message || 'Network error occurred.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const currentPhoto = photos[selectedIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerIconBtn}>
          <FontAwesomeFreeSolid name="xmark" size={20} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit photos</Text>
        <TouchableOpacity 
          onPress={handleUpload} 
          disabled={loading || photos.length === 0} 
          style={[styles.headerIconBtn, styles.checkBtn, photos.length === 0 && { opacity: 0.5 }]}
        >
          <FontAwesomeFreeSolid name="check" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Main Crop/Preview Box */}
        <View style={styles.mainCanvasCard}>
          {currentPhoto ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: currentPhoto.uri }} style={styles.mainImage} resizeMode="cover" />
              
              {/* Grid Lines Overlay */}
              <View style={styles.gridOverlay} pointerEvents="none">
                <View style={styles.gridRow}>
                  <View style={[styles.gridCell, styles.borderRight, styles.borderBottom]} />
                  <View style={[styles.gridCell, styles.borderRight, styles.borderBottom]} />
                  <View style={[styles.gridCell, styles.borderBottom]} />
                </View>
                <View style={styles.gridRow}>
                  <View style={[styles.gridCell, styles.borderRight, styles.borderBottom]} />
                  <View style={[styles.gridCell, styles.borderRight, styles.borderBottom]} />
                  <View style={[styles.gridCell, styles.borderBottom]} />
                </View>
                <View style={styles.gridRow}>
                  <View style={[styles.gridCell, styles.borderRight]} />
                  <View style={[styles.gridCell, styles.borderRight]} />
                  <View style={styles.gridCell} />
                </View>
              </View>

              {/* Replace Button */}
              <TouchableOpacity 
                style={styles.replaceBtn} 
                activeOpacity={0.8}
                onPress={() => openCropPicker(selectedIndex)}
              >
                <FontAwesomeFreeSolid name="image" size={14} color="#FFF" style={{ marginRight: 6 }} />
                <Text style={styles.replaceBtnText}>Replace</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.emptyUploadPlaceholder} 
              onPress={() => openCropPicker()}
            >
              <FontAwesomeFreeSolid name="camera" size={36} color="#777" />
              <Text style={styles.emptyUploadText}>Tap to add photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Thumbnail Selector Row */}
        
        <View style={styles.thumbnailRow}>
          {photos.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSelectedIndex(idx)}
              style={[
                styles.thumbnailBox,
                selectedIndex === idx && styles.activeThumbnailBox,
              ]}
            >
              <Image source={{ uri: item.uri }} style={styles.thumbImage} />
            </TouchableOpacity>
          ))}

          {/* Add More Slot */}
          {/* {photos.length < 6 && (
            <TouchableOpacity 
              style={styles.addSlotBtn} 
              onPress={() => openCropPicker()}
            >
              <FontAwesomeFreeSolid name="plus" size={18} color="#777" />
            </TouchableOpacity>
          )} */}
        </View>

      </ScrollView>

      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
    </SafeAreaView>
  );
};

export default AddPhotosScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
   // fontWeight: '700',
    color: '#1A1A1A',
    fontFamily: FONTS.MEDIUM,
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBtn: {
    backgroundColor: '#1E1E1E',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 30,
  },
  mainCanvasCard: {
    width: MAIN_BOX_SIZE,
    height: MAIN_BOX_SIZE * 1.50,
    backgroundColor: '#F2F2F2',
    borderRadius: 24,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    overflow: 'hidden',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
  },
  gridCell: {
    flex: 1,
  },
  borderRight: {
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  replaceBtn: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    backgroundColor: '#1E1E1E',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  replaceBtnText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyUploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyUploadText: {
    marginTop: 10,
    fontSize: 15,
    color: '#777',
    fontWeight: '500',
  },
  thumbnailRow: {
    flexDirection: 'row',
    marginTop: 20,
    width: MAIN_BOX_SIZE,
    gap: 12,
  },
  thumbnailBox: {
    width: 65,
    height: 65,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  activeThumbnailBox: {
    borderColor: '#FF7B7B', // Focus color
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  addSlotBtn: {
    width: 65,
    height: 65,
    borderRadius: 14,
    backgroundColor: '#EAEAEA',
    justifyContent: 'center',
    alignItems: 'center',
  },
});