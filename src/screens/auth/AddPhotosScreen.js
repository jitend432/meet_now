import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Image, 
  TouchableOpacity,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTSIZE, SIZES } from '../../constants/theme';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/vynk_t.png';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { launchImageLibrary } from 'react-native-image-picker';
import { photoApi } from '../../services/photoApi';
import { useAppSelector } from '../../redux/hooks';
import { FONTS } from '../../constants/fonts';
import { CustomModal } from '../../components/common/CustomModal';

const AddPhotosScreen = ({ navigation }) => {

  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const userId = useAppSelector((state) => state.auth.userId);
  console.log("reg Id",userId)

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

  const handleUploadPress = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

  //   launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.errorMessage) {
  //       console.log('ImagePicker Error: ', response.errorMessage);
  //       showAlertModal('Error', 'Failed to pick an image. Please try again.', 'error');
  //     } else if (response.assets && response.assets.length > 0) {
  //       const pickedFile = response.assets[0];
        
  //       const fileData = {
  //         uri: pickedFile.uri,
  //         type: pickedFile.type || 'image/jpeg',
  //         name: pickedFile.fileName || `photo_${Date.now()}.jpg`,
  //         size: pickedFile.fileSize || null,
  //       };

  //       setPhoto(fileData);
  //     }
  //   });
  // };

   launchImageLibrary(options, (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorMessage) {
      console.log('ImagePicker Error: ', response.errorMessage);
      showAlertModal('Error', 'Failed to pick an image. Please try again.', 'error');
    } else if (response.assets && response.assets.length > 0) {
      const pickedFile = response.assets[0];
      
      // Dynamic Extension Extractor
      const fileUri = pickedFile.uri;
      const uriType = pickedFile.type || 'image/jpeg';
      
      // Extension Detect Karein (e.g., png, jpg, webp)
      const detectedExt = uriType.split('/')[1] || 'jpeg';
      
      // Dynamic Filename
      const fileName = pickedFile.fileName 
        ? pickedFile.fileName 
        : `photo_${Date.now()}.${detectedExt}`;

      const fileData = {
        uri: fileUri,
        type: uriType,
        name: fileName,
        size: pickedFile.fileSize || null,
      };

      console.log('Processed Photo Payload:', fileData);
      setPhoto(fileData);
    }
  });
};


     const formatFileSize = (bytes) => {
       if (!bytes) return '';
       if (bytes < 1024 * 1024) {
         return `${(bytes / 1024).toFixed(2)} KB`;
       }
       return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
     };

//   const handleContinue = async () => {
//     if (!photo) {
//     showAlertModal('Photo Required', 'Please upload a photo to continue.', 'warning');
//       return;
//     }

// try {
//   setLoading(true);
//   console.log('Triggering direct Postman-matching multipart payload for user:', userId);

//   const result = await photoApi.uploadSinglePhoto(userId, photo);
//   console.log('API Single Upload Success Response ====>', result);

//   // Exact boolean check karein (result.status === true ya result.success === true)
//   if (result && (result.status === true || result.status === 200)) {
    
//     // Extra safety: Check karein ki response me uploaded photo ka URL aaya hai ya nahi
//     if (result.data || result.photoUrl || result.user) {
//       showAlertModal(
//         'Success', 
//         'Profile photo uploaded successfully!', 
//         'success',
//         [
//           {
//             text: 'OK',
//             onPress: () => {
//               setModalVisible(false);
//               navigation.navigate('BasicInfoScreen');
//             }
//           }
//         ]
//       );
//     } else {
//       // API 200/true bhej rahi hai par photo upload nahi hui
//       showAlertModal('Upload Failed', 'Photo upload nahi ho saki. Please try again.', 'error');
//     }

//   } else {
//     // Backend ne error response bheja (e.g., status: false)
//     showAlertModal('Upload Failed', result?.message || 'Something went wrong!', 'error');
//   }

// } catch (error) {
//   console.log('Upload Catch Error ====>', error);
//   showAlertModal('Error', 'Network error or upload failed', 'error');
// } finally {
//   setLoading(false);
// }


//   };


    const handleContinue = async () => {
  if (!photo) {
    showAlertModal('Photo Required', 'Please upload a photo to continue.', 'warning');
    return;
  }

  try {
    setLoading(true);
    console.log('Uploading photo for user:', userId);
    console.log('Photo Payload:', photo);

    const result = await photoApi.uploadSinglePhoto(userId, photo);
    console.log('API Single Upload Response ====>', result);

    // Dynamic Check: Status boolean true, number 200, ya string "success" ho
    const isSuccess = 
      result?.status === true || 
      result?.status === 200 || 
      result?.success === true ||
      result?.status === 'success';

    if (isSuccess) {
      showAlertModal(
        'Success', 
        'Profile photo uploaded successfully!', 
        'success',
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              navigation.navigate('EditProfileScreen');
            }
          }
        ]
      );
    } else {
      // Backend message print karein
      showAlertModal('Upload Failed', result?.message || result?.msg || 'Upload failed from server.', 'error');
    }

  } catch (error) {
    console.log('Upload Catch Error ====>', error?.response?.data || error?.message || error);
    showAlertModal(
      'Upload Failed', 
      error?.response?.data?.message || 'Network error or upload failed. Please try again.', 
      'error'
    );
  } finally {
    setLoading(false);
  }
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardWrapper}>

          {/* Step Header Area */}
          {/* <View style={styles.headerContainer}>
            <View style={styles.logoRow}>
              <Image source={LogoImage} style={styles.logoStyle} resizeMode="contain" />
              <Text style={styles.brandName}>Complete Your Profile</Text>
            </View>
          </View> */}

          {/* Progress Bar */}
          {/* <View style={styles.progressWrapper}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressStepLabel}>Step 2 of 8</Text>
              <Text style={styles.progressPercentageMetric}>25%</Text>
            </View>
            <View style={styles.progressTrackBackground}>
              <View style={[styles.progressTrackFill, { width: '25%' }]} />
            </View>
          </View> */}

          {/* Headings */}
          <Text style={styles.mainStepTitle}>Add Your Photo</Text>
          <Text style={styles.subStepTitle}>Upload a profile photo to get started. Photo size must be under 1 MB.</Text>

          {/* Center Aligned Single Image Upload Slot */}
          <View style={styles.singleUploadContainer}>
            <TouchableOpacity 
              style={[styles.uploadBox, styles.primaryBoxBorder]} 
              activeOpacity={0.8}
              onPress={handleUploadPress}
            >
              {photo?.uri ? (
                <Image source={{ uri: photo.uri }} style={styles.previewImage} />
              ) : (
                <View style={styles.uploadContent}>
                  <FontAwesomeFreeSolid name="camera" size={32} color={COLORS.primary} />
                  <Text style={styles.uploadBoxText}>upload profile photo</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Image Slot ke theek niche paste karein */}
           {photo && (
             <View style={{ marginTop: 10, alignItems: 'center' }}>
               <Text style={{ fontSize: 14, color: '#333', fontWeight: '500' }} numberOfLines={1}>
                 📄 {photo.name}
               </Text>
               {photo.size && (
                 <Text style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
                   💾 {formatFileSize(photo.size)}
                 </Text>
               )}
             </View>
           )}
          </View>

          <Text style={styles.helperTipText}>
            Click the slot above to upload your photo. This will be visible as your main profile picture.
          </Text>

          {/* Action Controls Footer */}
          <View style={styles.navigationControlRow}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => navigation.navigate('EditProfileScreen')}
              style={styles.backButtonTouchTarget}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Button 
              title="Continue" 
              onPress={handleContinue} 
              loading={loading}
              style={styles.continueActionButton}
            />
          </View>

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
    backgroundColor: COLORS.background, 
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  cardWrapper: {
    backgroundColor: COLORS.background, 
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: '88%',
    
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  headerContainer: {
    marginBottom: 16,
    width: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoStyle: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  progressWrapper: {
    marginBottom: 24,
    width: '100%',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressStepLabel: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  progressPercentageMetric: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  progressTrackBackground: {
    height: 6,
    backgroundColor: '#cce3cc',
    borderRadius: 3,
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  mainStepTitle: {
    fontSize: 24,
    //fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 4,
    fontFamily: FONTS.MEDIUM,
    alignItems: 'center'
  },
  subStepTitle: {
    fontSize: 15,
    color: COLORS.primary,
    opacity: 0.7,
    marginBottom: 28,
    fontFamily: FONTS.REGULAR
  },
  uploadRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  uploadBox: {
    width: '48%',
    height: 170,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  primaryBoxBorder: {
    borderColor: COLORS.primary,
  },
  secondaryBoxBorder: {
    borderColor: '#76c065',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadBoxText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 8,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  helperTipText: {
    fontSize: 13,
    color: COLORS.primary,
    opacity: 0.8,
    lineHeight: 18,
    marginBottom: 24,
  },
  navigationControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 16,
    width: '100%',
  },
  backButtonTouchTarget: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  continueActionButton: {
    width: '45%',
    marginVertical: 0,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  helperTipText: {
    fontFamily: FONTS.REGULAR,
    fontSize: FONTSIZE.xs,
    padding:15

  },
  uploadBoxText: {
    fontFamily: FONTS.REGULAR,
    //fontSize: FONTSIZE.xl
  },

  singleUploadContainer: {
    alignItems: 'center'
  }
});