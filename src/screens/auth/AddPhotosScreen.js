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

// Image Picker & API Imports
import { launchImageLibrary } from 'react-native-image-picker';
import { photoApi } from '../../services/photoApi';
import { useAppSelector } from '../../redux/hooks';
import { FONTS } from '../../constants/fonts';

const AddPhotosScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  
  // State to hold only one single image file object
  const [photo, setPhoto] = useState(null);

  // Redux connected logged-in user's ID
  const userId = useAppSelector((state) => state.auth.userId);

  const handleUploadPress = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8, // Postman tested high quality metadata processing
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Failed to pick an image. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        const pickedFile = response.assets[0];
        
        // Form-data compliant target dynamic dictionary mapping
        const fileData = {
          uri: pickedFile.uri,
          type: pickedFile.type || 'image/jpeg',
          name: pickedFile.fileName || `photo_${Date.now()}.jpg`
        };

        setPhoto(fileData);
      }
    });
  };

  const handleContinue = async () => {
    // Validation check: Mandate single main profile photo
    if (!photo) {
      Alert.alert('Photo Required', 'Please upload a photo to continue.');
      return;
    }

    try {
      setLoading(true);
      console.log('Triggering direct Postman-matching multipart payload for user:', userId);

      // Triggering your single photo upload service layer structure
      const result = await photoApi.uploadSinglePhoto(userId, photo);
      console.log('API Single Upload Success Response ====>', result);

      if (result && result.status) {
        Alert.alert('Success', 'Profile photo uploaded successfully!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('BasicInfoScreen')
          }
        ]);
      } else {
        // Fallback for edge cases if status returns false
        Alert.alert('Upload Status', result?.msg || 'Could not verify upload status.');
      }

    } catch (error) {
      console.error('Failed to upload user photo via API:', error);
      
      if (error.response) {
        console.log('Active Server Error Debug Log:', error.response.data);
      }
      
      Alert.alert(
        'Upload Failed', 
        'Something went wrong while uploading your profile photo. Please try again.'
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
          <View style={styles.headerContainer}>
            <View style={styles.logoRow}>
              <Image source={LogoImage} style={styles.logoStyle} resizeMode="contain" />
              <Text style={styles.brandName}>Complete Your Profile</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressWrapper}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressStepLabel}>Step 2 of 5</Text>
              <Text style={styles.progressPercentageMetric}>25%</Text>
            </View>
            <View style={styles.progressTrackBackground}>
              <View style={[styles.progressTrackFill, { width: '25%' }]} />
            </View>
          </View>

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
          </View>

          <Text style={styles.helperTipText}>
            Click the slot above to upload your photo. This will be visible as your main profile picture.
          </Text>

          {/* Action Controls Footer */}
          <View style={styles.navigationControlRow}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => navigation.goBack()}
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
    backgroundColor: COLORS.background, // Card color matches your current layout tint
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: '88%',
    
    // Drop shadow values to clearly separate the card surface layer from white canvas background
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
    fontFamily: FONTS.MEDIUM
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