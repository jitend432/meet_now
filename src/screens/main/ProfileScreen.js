import React, {useState, useEffect} from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import CardContainer from '../../components/chat/CardContainer';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { authApi } from '../../services/authApi';
import { setUserProfile } from '../../redux/slices/authSlice';


import RohanAvatar from '../../assets/images/img.jpg';
import { COLORS, FONTSIZE, SIZES } from '../../constants/theme';
import { FONTS } from '../../constants/fonts';

const ProfileScreen = ({ navigation }) => {

  const registrationId = useAppSelector((state) => state.auth.userId);
  const dispatch = useAppDispatch()
  console.log("Profile Reg ID ==> ",registrationId)
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!registrationId) {
        setLoading(false);
        return;
      }
      try {
        const res = await authApi.getMyProfile(registrationId);
        const dynamicData = res.data || res;
        setUserData(dynamicData);
        dispatch(setUserProfile(dynamicData));
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        Alert.alert("Error", "Failed to load profile details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [registrationId]);

  // Loading state skeleton replacement
  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.button2} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
       <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      {/* <CardContainer title="Vynk Dating"> */}
        <ScrollView 
          style={styles.scrollView} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row: Title & Edit Button */}
          <View style={styles.headerRow}>
            <Text style={styles.screenHeading}>My Profile</Text>

            <TouchableOpacity style={styles.editButton} activeOpacity={0.7}
            onPress={() => navigation.navigate('EditProfileScreen')}
            >
              <FontAwesomeFreeSolid name="edit" size={12} color="#ffffff" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>

          </View>

          {/* User Mini Profile Card */}
          <View style={styles.profileSummaryCard}>
            <View style={styles.avatarWrapper}>
              {/* <Image source={RohanAvatar} style={styles.profileAvatar} /> */}
              <Image source={ userData?.profilePhoto ? { uri: userData.profilePhoto } : RohanAvatar } style={styles.profileAvatar} />
              <View style={styles.cameraBadgeCircle}>
                <FontAwesomeFreeSolid name="camera" size={10} color="#ffffff" />
              </View>
            </View>

            <View style={styles.summaryDetails}>
              <View style={styles.nameVerifiedRow}>
                <Text style={styles.userNameText}>
                  {userData?.fullName || 'User'}, {userData?.age}
                </Text>
                <FontAwesomeFreeSolid name="check-circle" size={15} color="#4caf50" style={styles.verifiedCheckIcon} />
              </View>
              <View style={styles.locationMiniRow}>
                <FontAwesomeFreeSolid name="map-marker-alt" size={11} color="#757575" />
                <Text style={styles.locationMiniText}>
                  {userData?.locations?.city || 'Add Location'}
                </Text>
              </View>
              <View style={styles.activeTagBadge}>
                <Text style={styles.activeTagText}>● 
                  {userData?.active ? 'Active Status' : 'Offline'}
                </Text>
              </View>
            </View>
          </View>

         

          {/* Section Section Divider Heading label */}
          <Text style={styles.sectionDividerLabel}>Manage</Text>

          {/* Photos Management Subsection Card */}
          <View style={styles.infoCardBlock}>
            <Text style={styles.cardSectionTitle}>Photos</Text>
            <View style={styles.photoGalleryGrid}>
              <Image source={ userData?.profilePhoto ? { uri: userData.profilePhoto } : RohanAvatar } style={styles.galleryThumbnail} />
              {/* <Image source={Photo1} style={styles.galleryThumbnail} />
              <Image source={Photo2} style={styles.galleryThumbnail} />
              <Image source={Photo3} style={styles.galleryThumbnail} /> */}
              {/* <Image source={Photo4} style={styles.galleryThumbnail} /> */}
            </View>
          </View>

          {/* Detailed Info Card Section */}
          <View style={styles.infoCardBlock}>
            <Text style={styles.cardSectionTitle}>Basic Information</Text>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>
                Name
              </Text>
              <Text style={styles.fieldValue}>{userData?.fullName || 'N/A'}</Text>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Age</Text>
              <Text style={styles.fieldValue}>
                {userData?.age}
              </Text>
            </View>

            <View style={styles.iconFieldRow}>
              <FontAwesomeFreeSolid name="map-marker-alt" size={14} color="#265c32" style={styles.fieldIconWidth} />
              <View>
                <Text style={styles.fieldLabel}>Location</Text>
                <Text style={styles.fieldValue}>
                  {userData?.locations?.city ? `${userData.locations.city}, ${userData.locations.state || 'India'}` : 'Not Specified'}
                </Text>
              </View>
            </View>

            <View style={styles.iconFieldRow}>
              <FontAwesomeFreeSolid name="briefcase" size={13} color="#265c32" style={styles.fieldIconWidth} />
              <View>
                <Text style={styles.fieldLabel}>Occupation</Text>
                <Text style={styles.fieldValue}>
                  {userData?.occupation || 'Add Occupation'}
                </Text>
              </View>
            </View>

            <View style={styles.iconFieldRow}>
              <FontAwesomeFreeSolid name="graduation-cap" size={13} color="#265c32" style={styles.fieldIconWidth} />
              <View>
                <Text style={styles.fieldLabel}>Education</Text>
                <Text style={styles.fieldValue}>
                  {userData?.education || 'Add Education Details'}
                </Text>
              </View>
            </View>

            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>About Me</Text>
              <Text style={styles.aboutParagraphText}>
                {userData?.bio || 'Write something interesting about yourself...'}
              </Text>
            </View>

             <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>Profile Completion</Text>
              <Text style={styles.aboutParagraphText}>
                {userData?.profileCompletion ? `${userData.profileCompletion}%` : '0%'}
              </Text>
            </View>

          </View>

          {/* Interests Card Section */}
          <View style={styles.infoCardBlock}>
            <Text style={styles.cardSectionTitle}>Interests</Text>
            <View style={styles.interestsGrid}>


              {/* 🔴 Dynamic Interests Chip Render mapping */}
              {userData?.interests && userData.interests.length > 0 ? (
                userData.interests.map((interest, index) => (
                  <View key={index} style={[styles.interestChip, styles.filledChip]}>
                    <Text style={[styles.interestChipText, styles.filledChipText]}>
                      {interest.charAt(0) + interest.slice(1).toLowerCase()}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.fieldValue}>No interests added yet.</Text>
              )}
            </View>
          </View>

        </ScrollView>
      {/* </CardContainer> */}
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', 
    paddingBottom:30
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  screenHeading: {
    fontSize: 24,
    //fontWeight: '800',
    color: '#265c32',
    fontFamily: FONTS.SEMIBOLD
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#265c32',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: FONTSIZE.xs,
    marginLeft: 6,
    fontFamily: FONTS.REGULAR
  },
  profileSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.button2,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 16,
  },
  profileAvatar: {
    width: SIZES.avatarmini,
    height: SIZES.avatarmini,
    borderRadius: 50,
    backgroundColor: '#e1d9b7',
  },
  cameraBadgeCircle: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#265c32',
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ffffff',
  },
  summaryDetails: {
    flex: 1,
  },
  nameVerifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  userNameText: {
    fontSize: FONTSIZE.lg,
    color: '#265c32',
    fontFamily: FONTS.MEDIUM
  },
  verifiedCheckIcon: {
    marginLeft: 6,
  },
  locationMiniRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationMiniText: {
    fontSize: 11,
    color: '#616161',
    marginLeft: 4,
    fontFamily: FONTS.REGULAR
  },
  activeTagBadge: {
    backgroundColor: '#f1f8e9',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#dcedc8',
  },
  activeTagText: {
    fontSize: 10,
    color: '#4caf50',
    //fontWeight: '700',
    fontFamily: FONTS.REGULAR
  },
  subscriptionBanner: {
    backgroundColor: '#1b4322', // Darker evergreen luxury hue from image_a3c52d.png
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  bannerTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  planTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  diamondIcon: {
    marginRight: 12,
  },
  planNameText: {
    fontSize: FONTSIZE.xs,
    color: '#ffffff',
    fontFamily: FONTS.REGULAR
  },
  planPriceText: {
    fontSize: FONTSIZE.xxs,
    color: '#a5d6a7',
    marginTop: 2,
    fontFamily: FONTS.REGULAR
  },
  slashMonthText: {
    fontSize: 11,
    color: '#c8e6c9',
    fontWeight: '400',
  },
  activePillBadge: {
    backgroundColor: '#81c784',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  activePillText: {
    fontSize: FONTSIZE.xxs,
    color: COLORS.white,
    fontFamily: FONTS.REGULAR
  },
  planMetaGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: '#2e6b39',
    paddingTop: 12,
    marginBottom: 16,
  },
  metaGridItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  metaGridTextColumn: {
    marginLeft: 8,
  },
  metaLabel: {
    fontSize: FONTSIZE.xxs,
    color: '#81c784',
    fontFamily: FONTS.REGULAR
  },
  metaValue: {
    fontSize: FONTSIZE.xxs,
    color: '#ffffff',
    marginTop: 1,
    fontFamily: FONTS.THIN
  },
  managePlanButton: {
    backgroundColor: '#265c32',
    borderRadius: 10,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  managePlanButtonText: {
    color: '#ffffff',
    fontSize: FONTSIZE.xs,
    marginRight: 6,
    fontFamily: FONTS.REGULAR
  },
  sectionDividerLabel: {
    alignSelf: 'flex-end',
    fontSize: FONTSIZE.sm,
    color: '#265c32',
    marginBottom: 8,
    paddingRight: 4,
    fontFamily: FONTS.SEMIBOLD
  },
  infoCardBlock: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.button2,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: FONTSIZE.md,
    color: '#265c32',
    marginBottom: 14,
    fontFamily: FONTS.MEDIUM
  },
  photoGalleryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  galleryThumbnail: {
    width: '23%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  fieldBlock: {
    marginBottom: 14,
  },
  iconFieldRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  fieldIconWidth: {
    width: 22,
    marginTop: 3,
  },
  fieldLabel: {
    fontSize: FONTSIZE.xs,
    color: '#424242',
    marginBottom: 4,
    fontFamily: FONTS.MEDIUM
  },
  fieldValue: {
    fontSize: FONTSIZE.xs,
    color: '#757575',
    fontFamily: FONTS.REGULAR
  },
  aboutParagraphText: {
    fontSize: FONTSIZE.xxs,
    color: '#616161',
    lineHeight: 16,
    //fontWeight: '500',
    fontFamily: FONTS.REGULAR
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    paddingHorizontal: 22,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
    minWidth: '45%',
    alignItems: 'center',
  },
  filledChip: {
    backgroundColor: '#265c32',
    borderWidth: 1,
    borderColor: '#265c32',
  },
  outlinedChip: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#265c32',
  },
  interestChipText: {
    fontSize: FONTSIZE.xxs,
   // fontWeight: '600',
   fontFamily: FONTS.MEDIUM
  },
  filledChipText: {
    color: '#ffffff',
  },
  outlinedChipText: {
    color: '#265c32',
  },
});