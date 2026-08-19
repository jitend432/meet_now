import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

import Button from '../../components/common/Button'; 
import { userApi } from '../../services/userApi';
import ImageViewModal from '../../components/common/ImageViewModal';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';

const formatEnumValue = (val) => {
  if (!val) return '';
  return val.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};

const ViewProfileScreen = ({ route, navigation }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Full Screen Image Modal State
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const targetUser = route?.params?.user || {};
  const userId = route?.params?.userId || targetUser?.userId || targetUser?.id;

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await userApi.getUserProfileById(userId);
        if (res && res.data) {
          setProfileData(res.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Data mapping from backend
  const userName = profileData?.fullName || targetUser?.fullName || targetUser?.name || "User";
  const userAge = profileData?.age || targetUser?.age || "";
  const profilePhoto = profileData?.profilePhoto || targetUser?.profileImage || targetUser?.avatar;

  const city = profileData?.locations?.city;
  const state = profileData?.locations?.state;
  const country = profileData?.locations?.country;
  const userLocation = city && state 
    ? `${city}, ${state}` 
    : (city || state || country || targetUser?.location || "Location not specified");

  const bio = profileData?.bio || "No bio provided.";
  const occupation = profileData?.occupation;
  const education = profileData?.education;
  const gender = profileData?.gender;
  const hopingToFind = profileData?.hopingToFind;
  const lookingFor = profileData?.lookingFor;
  const otherImages = profileData?.otherImages || [];
  const interestTags = profileData?.interests && profileData.interests.length > 0 
    ? profileData.interests 
    : [];

  const handleOpenImage = (img) => {
    setSelectedImage(img);
    setIsModalVisible(true);
  };

  const handleCloseImage = () => {
    setIsModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContentLayout}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.integratedMainCard}>
          
          {/* 1. Header Navbar */}
          <View style={styles.profileNavbarRow}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => navigation?.goBack()} 
              style={styles.backButtonTouchable}
            >
              <FontAwesomeFreeSolid name="arrow-left" size={16} color="#0B5324" />
            </TouchableOpacity>
            <Text style={styles.navbarTitleText}>View Profile</Text>
            <View style={styles.placeholderBox} />
          </View>

          {/* 2. Main Profile Image */}
          <View style={styles.imageContainerFrame}>
            {loading ? (
              <View style={[styles.bannerImageFrame, styles.loaderContainer]}>
                <ActivityIndicator size="large" color="#0B5324" />
              </View>
            ) : (
              <TouchableOpacity 
                activeOpacity={0.9} 
                onPress={() => handleOpenImage(profilePhoto || DEFAULT_AVATAR)}
              >
                <Image 
                  source={
                    typeof profilePhoto === 'string' 
                      ? { uri: profilePhoto } 
                      : (profilePhoto || { uri: DEFAULT_AVATAR })
                  } 
                  style={styles.bannerImageFrame}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          </View>

          {/* 3. Name & Location Section */}
          <View style={styles.radiusNameBlockOverlay}>
            
            <View style={styles.identityRowBlock}>
              <Text style={styles.userNameAgeText}>
                {userName}{userAge ? `, ${userAge}` : ''}
              </Text>
              <View style={styles.verifiedBadgeWrapper}>
                <FontAwesomeFreeSolid name="check-circle" size={16} color="#00e676" />
              </View>
            </View>

            <View style={styles.locationPillRowBlock}>
              <View style={styles.locationIconRow}>
                <FontAwesomeFreeSolid name="map-marker-alt" size={13} color="#616161" style={{ marginRight: 6 }} />
                <Text style={styles.locationLabelText}>{userLocation}</Text>
              </View>
              <View style={styles.onlineStatusIndicatorPill}>
                <Text style={styles.onlinePillTextText}>Active</Text>
              </View>
            </View>

            <View style={styles.detailsContentDividerLine} />

            <Text style={styles.sectionHeadingTitle}>About</Text>
            <Text style={styles.aboutDescriptionParagraphText}>
              {bio}
            </Text>

            <View style={styles.detailsContentDividerLine} />
            <Text style={styles.sectionHeadingTitle}>Basic Details</Text>
            
            <View style={styles.metaInfoGrid}>
              {occupation ? (
                <View style={styles.metaInfoRow}>
                  <FontAwesomeFreeSolid name="briefcase" size={14} color="#0B5324" style={styles.metaIcon} />
                  <Text style={styles.metaInfoText}>{occupation}</Text>
                </View>
              ) : null}

              {education ? (
                <View style={styles.metaInfoRow}>
                  <FontAwesomeFreeSolid name="graduation-cap" size={14} color="#0B5324" style={styles.metaIcon} />
                  <Text style={styles.metaInfoText}>{formatEnumValue(education)}</Text>
                </View>
              ) : null}

              {gender ? (
                <View style={styles.metaInfoRow}>
                  <FontAwesomeFreeSolid name="user" size={14} color="#0B5324" style={styles.metaIcon} />
                  <Text style={styles.metaInfoText}>{formatEnumValue(gender)}</Text>
                </View>
              ) : null}

              {lookingFor ? (
                <View style={styles.metaInfoRow}>
                  <FontAwesomeFreeSolid name="search" size={14} color="#0B5324" style={styles.metaIcon} />
                  <Text style={styles.metaInfoText}>Looking for: {formatEnumValue(lookingFor)}</Text>
                </View>
              ) : null}

              {hopingToFind ? (
                <View style={styles.metaInfoRow}>
                  <FontAwesomeFreeSolid name="heart" size={14} color="#0B5324" style={styles.metaIcon} />
                  <Text style={styles.metaInfoText}>{formatEnumValue(hopingToFind)}</Text>
                </View>
              ) : null}
            </View>

            {otherImages.length > 0 && (
              <>
                <View style={styles.detailsContentDividerLine} />
                <Text style={styles.sectionHeadingTitle}>Photos</Text>
                <View style={styles.photoGalleryGrid}>
                  {otherImages.map((imgUrl, index) => (
                    <TouchableOpacity 
                      key={index} 
                      activeOpacity={0.8}
                      onPress={() => handleOpenImage(imgUrl)}
                    >
                      <Image 
                        source={{ uri: imgUrl }} 
                        style={styles.galleryThumbnail} 
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {interestTags.length > 0 && (
              <>
                <View style={styles.detailsContentDividerLine} />
                <Text style={styles.sectionHeadingTitle}>Interests</Text>
                <View style={styles.interestsWrappedFlexBoxContainer}>
                  {interestTags.map((tag, index) => (
                    <View key={index} style={styles.interestBadgeItemPill}>
                      <Text style={styles.interestItemLabelText}>{formatEnumValue(tag)}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            <View style={styles.bottomStickyControlDockRowContainer}>
              <View style={styles.primaryButtonFlexWrapper}>
                <Button 
                  title="Message" 
                  variant="primary" 
                  onPress={() => navigation?.goBack()} 
                  style={styles.customMessageBtnHeight}
                />
              </View>

              <TouchableOpacity 
                activeOpacity={0.8} 
                style={[styles.circleInteractiveActionBox, isLiked && styles.circleBoxLikedActiveHighlight]}
                onPress={() => setIsLiked(!isLiked)}
              >
                <FontAwesomeFreeSolid 
                  name="heart" 
                  size={16} 
                  color={isLiked ? "#ffffff" : "#d32f2f"} 
                />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>

      {/* Image Preview Modal */}
      <ImageViewModal
        visible={isModalVisible}
        imageUrl={selectedImage}
        onClose={handleCloseImage}
      />
    </SafeAreaView>
  );
};

export default ViewProfileScreen;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
  },
  scrollContentLayout: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  integratedMainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 20,
  },
  profileNavbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
  },
  backButtonTouchable: {
    padding: 4,
  },
  navbarTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B5324',
    textAlign: 'center',
  },
  placeholderBox: { 
    width: 24 
  },
  imageContainerFrame: {
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  bannerImageFrame: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  radiusNameBlockOverlay: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#ffffff',
  },
  identityRowBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userNameAgeText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#212121',
  },
  verifiedBadgeWrapper: {
    marginLeft: 6,
    justifyContent: 'center',
  },
  locationPillRowBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  locationIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationLabelText: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '500',
  },
  onlineStatusIndicatorPill: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  onlinePillTextText: {
    fontSize: 11,
    color: '#2e7d32',
    fontWeight: '600',
  },
  detailsContentDividerLine: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 12,
  },
  sectionHeadingTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 8,
  },
  aboutDescriptionParagraphText: {
    fontSize: 14,
    color: '#424242',
    lineHeight: 20,
    fontWeight: '400',
  },
  metaInfoGrid: {
    gap: 8,
  },
  metaInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    width: 20,
    marginRight: 8,
  },
  metaInfoText: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
  photoGalleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  galleryThumbnail: {
    width: 95,
    height: 95,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
  },
  interestsWrappedFlexBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestBadgeItemPill: {
    backgroundColor: '#f1f8e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  interestItemLabelText: {
    fontSize: 12,
    color: '#0B5324',
    fontWeight: '600',
  },
  bottomStickyControlDockRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  primaryButtonFlexWrapper: {
    flex: 1,
    marginRight: 10,
  },
  customMessageBtnHeight: {
    height: 46,
    borderRadius: 23,
    paddingVertical: 0, 
    justifyContent: 'center',
    backgroundColor: '#0B5324',
  },
  circleInteractiveActionBox: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  circleBoxLikedActiveHighlight: {
    backgroundColor: '#d32f2f',
    borderColor: '#d32f2f',
  }
});