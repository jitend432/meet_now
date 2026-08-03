// screens/chat/UserProfileScreen.js
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

// Reusable custom parts
import Button from '../../components/common/Button'; 
import { userApi } from '../../services/userApi';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';

const ViewProfileScreen = ({ route, navigation }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const targetUser = route?.params?.user || {};
  const userId = targetUser.userId;
  console.log("View Profile UserId ====> ",userId)

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
          console.log("View other User Profile ===> ",res.data)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userId]);

  // Data mapping from backend with fallbacks to initial passed user or defaults
  const userName = profileData?.fullName || targetUser?.fullName || targetUser?.name || "User";
  const userAge = profileData?.age || targetUser?.age || "";
  const profilePhoto = profileData?.profilePhoto || targetUser?.profileImage || targetUser?.avatar;

  const city = profileData?.locations?.city;
  const state = profileData?.locations?.state;
  const userLocation = city && state 
    ? `${city}, ${state}` 
    : (city || state || targetUser?.location || "Location not specified");

  const bio = profileData?.bio || "Coffee lover ☕ | Traveller ✈️ |\nLove exploring new places and meeting new people.";
  const interestTags = profileData?.interests && profileData.interests.length > 0 
    ? profileData.interests 
    : ["Travel", "Music", "Movies", "Reading", "Photography"];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContentLayout}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Integrated Container Box */}
        <View style={styles.integratedMainCard}>
          
          {/* 1. Header is inside the same view now */}
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

          {/* 2. Full Image Frame Section */}
          <View style={styles.imageContainerFrame}>
            {loading ? (
              <View style={[styles.bannerImageFrame, styles.loaderContainer]}>
                <ActivityIndicator size="large" color="#0B5324" />
              </View>
            ) : (
              <Image 
                source={
                  typeof profilePhoto === 'string' 
                    ? { uri: profilePhoto } 
                    : (profilePhoto || { uri: DEFAULT_AVATAR })
                } 
                style={styles.bannerImageFrame}
                resizeMode="cover"
              />
            )}
          </View>

          {/* 3. Name Block Wrapper with Border Radius Curves */}
          <View style={styles.radiusNameBlockOverlay}>
            
            {/* Identity Row inside Custom Radius Block */}
            <View style={styles.identityRowBlock}>
              <Text style={styles.userNameAgeText}>
                {userName}{userAge ? `, ${userAge}` : ''}
              </Text>
              <View style={styles.verifiedBadgeWrapper}>
                <FontAwesomeFreeSolid name="check-circle" size={16} color="#00e676" />
              </View>
            </View>

            {/* Location & Online Status elements */}
            <View style={styles.locationPillRowBlock}>
              <Text style={styles.locationLabelText}>{userLocation}</Text>
              <View style={styles.onlineStatusIndicatorPill}>
                <Text style={styles.onlinePillTextText}>Online</Text>
              </View>
            </View>

            <View style={styles.detailsContentDividerLine} />

            {/* Description Segment Content */}
            <Text style={styles.sectionHeadingTitle}>About</Text>
            <Text style={styles.aboutDescriptionParagraphText}>
              {bio}
            </Text>

            {/* Interest Tags Flex Structure Layout */}
            <Text style={styles.sectionHeadingTitle}>Interests</Text>
            <View style={styles.interestsWrappedFlexBoxContainer}>
              {interestTags.map((tag, index) => (
                <View key={index} style={styles.interestBadgeItemPill}>
                  <Text style={styles.interestItemLabelText}>{tag}</Text>
                </View>
              ))}
            </View>

            {/* Bottom Primary/Secondary Actions Deck Bar */}
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

              <TouchableOpacity 
                activeOpacity={0.8}
                style={styles.circleInteractiveActionBox}
              >
                <FontAwesomeFreeSolid name="ellipsis-v" size={16} color="#757575" />
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
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
    height: 250,
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -4,
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
    marginBottom: 12,
  },
  locationLabelText: {
    fontSize: 14,
    color: '#616161',
    fontWeight: '500',
  },
  onlineStatusIndicatorPill: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  onlinePillTextText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  detailsContentDividerLine: {
    height: 1,
    backgroundColor: '#f5f5f5',
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
    marginBottom: 16,
  },
  interestsWrappedFlexBoxContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  interestBadgeItemPill: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  interestItemLabelText: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '500',
  },
  bottomStickyControlDockRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
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