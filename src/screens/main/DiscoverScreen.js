import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  useDerivedValue,
  withSpring, 
  withTiming, 
  runOnJS,
  interpolate
} from 'react-native-reanimated';

import CardContainer from '../../components/chat/CardContainer';
import userApi from '../../services/userApi';
import { matchApi } from '../../services/matchApi';
import { FONTS } from '../../constants/fonts';
import { photoApi } from '../../services/photoApi';
import { useAppSelector } from '../../redux/hooks';
import { COLORS } from '../../constants/theme';
import { CustomModal } from '../../components/common/CustomModal';
import LinearGradient from 'react-native-linear-gradient';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;

import { setUserProfile } from '../../redux/slices/authSlice';
import { authApi } from '../../services/authApi';
import { useAppDispatch } from '../../redux/hooks';

const DiscoverScreen = () => {

  const user = useAppSelector((state) => state.auth.user)
  const profileCompletion = user?.profileCompletion ?? 0;
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const checkProfileCompletion = () => {
  if (profileCompletion < 60) {
    setShowIncompleteModal(true);
    return false;
  }
  return true;
};


////user profile call
  const dispatch = useAppDispatch()
  const registrationId = useAppSelector((state) => state.auth.userId)


useEffect(() => {
  const fetchAndDispatchData = async () => {
    try {
      if (!registrationId) return;

      
      const dynamicData = await authApi.getMyProfile(registrationId);

      // 2. Dispatch directly to Redux
      if (dynamicData) {
        dispatch(setUserProfile(dynamicData));
        console.log('✅ Profile Data Successfully Saved to Redux:', dynamicData);
      }
    } catch (error) {
      console.error('Failed to fetch and dispatch profile:', error);
    }
  };

  fetchAndDispatchData();
}, [registrationId, dispatch]);


// end profile
 //console.log("NearByscreen userDetails current login user",user.profileCompletion)

  const { distance, minAge, maxAge } = useAppSelector((state) => state.auth.discoverySettings);
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  const [isExpanded, setIsExpanded] = useState(false);

  const isSwiping = useRef(false);
  
  const [userPhotos, setUserPhotos] = useState([]);
  const [isPhotosLoading, setIsPhotosLoading] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  const feedbackOpacity = useSharedValue(0);
  const feedbackScale = useSharedValue(0);
  const feedbackTranslateY = useSharedValue(0);
  const [feedbackType, setFeedbackType] = useState('LIKE');

  const rawProfile = profiles[currentIndex] || {};
  
  const currentProfile = {
    ...rawProfile,
    id: rawProfile.id || rawProfile._id ,
    name: rawProfile.fullName || 'User',
    age: rawProfile.age !== null && rawProfile.age !== undefined ? rawProfile.age : '',
    bio: rawProfile.bio || 'No bio provided.',
    profession: rawProfile.occupation || 'Professional',
    location: rawProfile.city || 'Nearby',
    interests: rawProfile.interests || [],
    profilePhoto: rawProfile.profilePhoto || null,
  };

  const expandProgress = useDerivedValue(() => {
    return withTiming(isExpanded ? 1 : 0, { duration: 350 });
  }, [isExpanded]);


  const animatedPhotoStyle = useAnimatedStyle(() => {
  const photoHeight = interpolate(
    expandProgress.value,
    [0, 1],
    [SCREEN_HEIGHT * 0.87, SCREEN_HEIGHT * 0.47] 
  );
  return {
    height: photoHeight,
  };
});
 

  // Smooth Content Fade-In & Slide-Up Animation
  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      opacity: expandProgress.value,
      transform: [
        {
          translateY: interpolate(expandProgress.value, [0, 1], [30, 0]),
        },
      ],
    };
  });

  useEffect(() => {
    fetchNearbyProfiles();
  }, [distance, minAge, maxAge]);

  useEffect(() => {
    if (profiles.length > 0 && currentIndex < profiles.length && currentProfile.id) {
      fetchCurrentProfilePhotos(currentProfile.id);
    }
  }, [currentIndex, profiles]);

  const fetchNearbyProfiles = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await userApi.getNearbyUsers(distance, minAge, maxAge);
      const profilesArray = response?.data || [];
      setProfiles(profilesArray);
      setCurrentIndex(0); 
    } catch (error) {
      console.error('Failed to fetch nearby users:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentProfilePhotos = async (userId) => {
    try {
      setIsPhotosLoading(true);
      const response = await photoApi.getUserPhotos(userId);
      setUserPhotos(response?.data || []);
      console.log("All images of nearby user",response?.data)
    } catch (error) {
      console.error(`Failed to fetch photos for user ${userId}:`, error);
      setUserPhotos([]); 
    } finally {
      setIsPhotosLoading(false);
    }
  };

  const triggerFloatingAnimation = (type) => {
    setFeedbackType(type);
    feedbackOpacity.value = 1;
    feedbackScale.value = 0.5;
    feedbackTranslateY.value = 0;

    feedbackScale.value = withSpring(1.5);
    feedbackTranslateY.value = withTiming(-200, { duration: 650 });
    feedbackOpacity.value = withTiming(0, { duration: 650 });
  };

  const executeUserAction = async (actionType) => {
    if (!currentProfile || isSwiping.current) return;

    isSwiping.current = true;
    const receiverId = Number(currentProfile.id);

    triggerFloatingAnimation(actionType);

    if (receiverId && !isNaN(receiverId)) {
      try {
        await matchApi.handleLikeDislike(receiverId, actionType);
      } catch (error) {
        console.error('Failed to sync action with backend:', error?.response?.data || error.message);
      }
    }

    translateX.value = 0;
    translateY.value = 0;
    contextX.value = 0;
    contextY.value = 0;

    setUserPhotos([]);
    setIsExpanded(false);

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(profiles.length);
    }

    setTimeout(() => {
      isSwiping.current = false;
    }, 300);
  };

  const handleSwipeAction = (direction) => {
    const actionType = direction === 'right' ? 'LIKE' : 'DISLIKE';
    executeUserAction(actionType);
  };

  const forceSwipe = (direction) => {
    if (isLoading || !currentProfile || isSwiping.current) return;
    if (!checkProfileCompletion()) return;
    const targetX = direction === 'right' ? SCREEN_WIDTH + 150 : -SCREEN_WIDTH - 150;
    translateX.value = withTiming(targetX, { duration: 250 }, (isFinished) => {
      if (isFinished) {
        runOnJS(handleSwipeAction)(direction);
      }
    });
  };

  const handleSuperLike = () => {
    if (isLoading || !currentProfile) return;
    if (!checkProfileCompletion()) return;
    translateY.value = withTiming(-SCREEN_HEIGHT / 2, { duration: 250 }, () => {
      runOnJS(executeUserAction)('SUPER_LIKE');
    });
  };

  const gesture = Gesture.Pan()
    .enabled(!isLoading && !!currentProfile && !isExpanded)
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;
    })
    .onEnd((event) => {
      if (isSwiping.current) return;

      const isFastRight = event.velocityX > 800;
      const isFastLeft = event.velocityX < -800;
      const isPastRightThreshold = translateX.value > SWIPE_THRESHOLD;
      const isPastLeftThreshold = translateX.value < -SWIPE_THRESHOLD;

      if (isFastRight || isPastRightThreshold) {
        translateX.value = withTiming(SCREEN_WIDTH + 150, { duration: 200 }, (isFinished) => {
          if (isFinished) runOnJS(handleSwipeAction)('right');
        });
      } else if (isFastLeft || isPastLeftThreshold) {
        translateX.value = withTiming(-SCREEN_WIDTH - 150, { duration: 200 }, (isFinished) => {
          if (isFinished) runOnJS(handleSwipeAction)('left');
        });
      } else {
        translateX.value = withSpring(0, { damping: 15 });
        translateY.value = withSpring(0, { damping: 15 });
      }
    });

  const cardAnimatedStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-15, 0, 15]
    );

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}deg` }
      ]
    };
  });

  const feedbackAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: feedbackOpacity.value,
      transform: [
        { scale: feedbackScale.value },
        { translateY: feedbackTranslateY.value }
      ]
    };
  });

  const getFeedbackIconDetails = () => {
    switch(feedbackType) {
      case 'LIKE':
        return { name: "heart", color: "#e91e63" };
      case 'DISLIKE':
        return { name: "times-circle", color: "#f44336" };
      case 'SUPER_LIKE':
        return { name: "star", color: "#ffb300" };
      default:
        return { name: "heart", color: "#e91e63" };
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* <CardContainer title="Hexa Dating"> */}
          <View style={styles.noMoreContainer}>
            <ActivityIndicator size="large" color="#6d0909" />
            <Text style={[styles.noMoreText, { marginTop: 12 }]}>Fetching profiles nearby...</Text>
          </View>
        {/* </CardContainer> */}
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* <CardContainer title="Hexa Dating"> */}
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreText}>Something went wrong</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchNearbyProfiles}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        {/* </CardContainer> */}
      </SafeAreaView>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {/* <CardContainer title="Vynk Dating"> */}
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreText}>No More Profiles Nearby</Text>
          </View>
        {/* </CardContainer> */}
      </SafeAreaView>
    );
  }

  const feedbackIcon = getFeedbackIconDetails();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />

        <View style={styles.mainLayoutContainer}>
          
          <Animated.View pointerEvents="none" style={[styles.floatingFeedbackContainer, feedbackAnimatedStyle]}>
            <FontAwesomeFreeSolid 
              name={feedbackIcon.name} 
              size={80} 
              color={feedbackIcon.color} 
            />
          </Animated.View>

          {/* CARD WRAPPER */}
          <View style={styles.cardWrapper}>
            <GestureDetector gesture={gesture}>
              <Animated.View style={[styles.animatedCardContainer, cardAnimatedStyle]}>

                <View style={[styles.cardContainerInner, isExpanded && styles.expandedCardStyle]}>
                  
                  <ScrollView 
                    scrollEnabled={isExpanded} 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                  >
                    {/* PHOTO BANNER (Smooth Animated Height) */}
                    <Animated.View style={[styles.photoContainerBase, animatedPhotoStyle]}>

                      <Image 
                        source={
                          currentProfile?.profilePhoto 
                            ? { uri: currentProfile.profilePhoto }
                            : require('../../assets/images/img.jpg') 
                        } 
                        style={styles.cardMainPhoto}
                        resizeMode="cover"
                      />

                      {/* ARROW BUTTON */}
                      <TouchableOpacity 
                        style={styles.infoArrowButton} 
                        onPress={() => setIsExpanded(!isExpanded)}
                        activeOpacity={0.8}
                      >
                        <FontAwesomeFreeSolid 
                          name={isExpanded ? "arrow-down" : "arrow-up"} 
                          size={32} 
                          color="#ffffff" 
                        />
                      </TouchableOpacity>

                      {/* UNEXPANDED OVERLAY */}
                      {!isExpanded && (
                        // <View style={styles.profileDetailsOverlay}>
                        //   <View style={styles.nameContainer}>
                        //     <Text style={styles.profileName}>{currentProfile.name}</Text>
                        //     <Text style={styles.profileAge}>, {currentProfile.age}</Text>
                        //   </View>
                        //   <View style={styles.metaRow}>
                        //     <FontAwesomeFreeSolid name="briefcase" size={13} color="#e0e0e0" style={styles.metaIcon} />
                        //     <Text style={styles.metaText}>{currentProfile.role || currentProfile.profession}</Text>
                        //   </View>
                        //   <View style={styles.metaRow}>
                        //     <FontAwesomeFreeSolid name="map-marker-alt" size={13} color="#e0e0e0" style={styles.metaIcon} />
                        //     <Text style={styles.metaText}>{currentProfile.location || currentProfile.city}</Text>
                        //   </View>
                        // </View>

                        <LinearGradient
                          colors={['transparent', 'rgba(0, 0, 0, 0.4)', 'rgba(0, 0, 0, 0.85)']}
                          locations={[0, 0.3, 1]}
                          style={styles.profileDetailsOverlay}
                        >
                          <View style={styles.nameContainer}>
                            <Text style={styles.profileName}>{currentProfile.name}</Text>
                            <Text style={styles.profileAge}>, {currentProfile.age}</Text>
                          </View>
                          <View style={styles.metaRow}>
                            <FontAwesomeFreeSolid name="briefcase" size={13} color="#ffffff" style={styles.metaIcon} />
                            <Text style={styles.metaText}>{currentProfile.role || currentProfile.profession}</Text>
                          </View>
                          <View style={styles.metaRow}>
                            <FontAwesomeFreeSolid name="map-marker-alt" size={13} color="#ffffff" style={styles.metaIcon} />
                            <Text style={styles.metaText}>{currentProfile.location || currentProfile.city}</Text>
                          </View>
                        </LinearGradient>
                      )}
                      
                    </Animated.View>

                    {/* EXPANDED CONTENT AREA (Smooth Fade & Slide) */}
                    {isExpanded && (
                      <Animated.View style={[styles.expandedDetailsBody, animatedContentStyle]}>
                        <View style={styles.nameContainerDark}>
                          <Text style={styles.profileNameDark}>{currentProfile.name}</Text>
                          <Text style={styles.profileAgeDark}>, {currentProfile.age}</Text>
                        </View>

                        <View style={styles.metaRowDark}>
                          <FontAwesomeFreeSolid name="briefcase" size={14} color="#555" style={{ marginRight: 6 }} />
                          <Text style={styles.metaTextDark}>{currentProfile.profession || currentProfile.role}</Text>
                        </View>

                        <View style={styles.metaRowDark}>
                          <FontAwesomeFreeSolid name="map-marker-alt" size={14} color="#555" style={{ marginRight: 6 }} />
                          <Text style={styles.metaTextDark}>{currentProfile.location || currentProfile.city}</Text>
                        </View>

                        <View style={styles.contentDivider} />

                        {/* BIO */}
                        <Text style={styles.sectionHeaderTitle}>About Me</Text>
                        <Text style={styles.bioParagraph}>{currentProfile.bio}</Text>

                        <View style={styles.contentDivider} />
                        
                      {/* PHOTOS GALLERY */}
                             <Text style={styles.sectionHeaderTitle}>Photos</Text>
                             {isPhotosLoading ? (
                               <ActivityIndicator size="small" color="#1b4d22" style={{ marginVertical: 10 }} />
                             ) : userPhotos.length > 0 ? (
                               <View style={styles.photoGridContainer}>
                                 {userPhotos.map((photo, index) => {
                                   // API response se direct photoUrl pick karein
                                   const imgUri = photo.photoUrl || photo.url || photo.imagePath;
                             
                                   if (!imgUri) return null;
                             
                                   return (
                                     <Image
                                       key={photo.id || photo._id || index}
                                       source={{ uri: imgUri }}
                                       style={styles.gridPhotoItem}
                                       resizeMode="cover"
                                     />
                                   );
                                 })}
                               </View>
                             ) : (
                               <Text style={styles.emptyGalleryText}>No extra photos uploaded.</Text>
                             )}
                             

                        {/* INTERESTS */}
                        {currentProfile.interests && currentProfile.interests.length > 0 && (
                          <>
                            <View style={styles.contentDivider} />
                            <Text style={styles.sectionHeaderTitle}>Interests</Text>
                            <View style={styles.interestsChipWrapper}>
                              {currentProfile.interests.map((interest, index) => (
                                <View key={index} style={styles.singleInterestChip}>
                                  <Text style={styles.chipLabelText}>{interest}</Text>
                                </View>
                              ))}
                            </View>
                          </>
                        )}

                        <View style={{ height: 90 }} />
                      </Animated.View>
                    )}

                  </ScrollView>

                  {/* FLOATING ACTION BUTTONS */}
                  {!isExpanded && (
                  <View style={styles.actionButtonsRow}>
                    <TouchableOpacity onPress={() => forceSwipe('left')} style={[styles.circleButton, styles.dislikeButton]} activeOpacity={0.8}>
                      <FontAwesomeFreeSolid name="times" size={24} color="#f44336" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={handleSuperLike} style={[styles.circleButton, styles.superLikeButton]} activeOpacity={0.8}>
                      <FontAwesomeFreeSolid name="star" size={22} color="#ffb300" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={() => forceSwipe('right')} style={[styles.circleButton, styles.likeButton]} activeOpacity={0.8}>
                      <FontAwesomeFreeSolid name="heart" size={24} color="#e91e63" />
                    </TouchableOpacity>
                  </View>
                  )}

                </View>

              </Animated.View>
            </GestureDetector>
          </View>

          {!isExpanded && (
            <Text style={styles.paginationText}>{currentIndex + 1} / {profiles.length} profile</Text>
          )}

        </View>
        <CustomModal
           visible={showIncompleteModal}
           onClose={() => setShowIncompleteModal(false)}
           type="warning"
           title="Incomplete Profile"
           message={`Your profile is currently at ${profileCompletion}%. Please complete your profile to 60% to interact and swipe.`}
           buttons={[
             {
               text: 'Complete Profile',
               style: 'primary',
               onPress: () => {
                 setShowIncompleteModal(false);
                 navigation?.navigate('EditProfileScreen');
               },
             },
             {
               text: 'Cancel',
               style: 'secondary',
               onPress: () => setShowIncompleteModal(false),
             },
           ]}
         />

      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainLayoutContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 8,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    backgroundColor: COLORS.background
  },
  floatingFeedbackContainer: {
    position: 'absolute',
    top: '35%',
    zIndex: 9999,
    alignSelf: 'center',
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background
  },
  noMoreText: {
    fontSize: 18,
    color: '#760909',
    fontFamily: FONTS.REGULAR
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#265c32',
    fontWeight: '700',
    fontSize: 16,
  },
  cardWrapper: {
    width: '100%',
    position: 'relative',
    borderRadius: 24,
    flex: 1
  },
  animatedCardContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  cardContainerInner: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  expandedCardStyle: {
    backgroundColor: '#ffffff',
  },
  photoContainerBase: {
    width: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
  },
  cardMainPhoto: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  infoArrowButton: {
    position: 'absolute',
    bottom:250,
   // top: 12,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },

  profileDetailsOverlay: {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  paddingLeft: 16,
  paddingRight: 16,
  paddingBottom: 85,
  paddingTop: 50, 
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  zIndex: 998,
},
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileAge: {
    fontSize: 24,
    fontWeight: '600',
    color: '#ffffff',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaIcon: {
    width: 16,
    marginRight: 6,
  },
  metaText: {
    fontSize: 13,
    color: '#e0e0e0',
  },
  expandedDetailsBody: {
    padding: 18,
    backgroundColor: '#ffffff',
  },
  nameContainerDark: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileNameDark: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111111',
  },
  profileAgeDark: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
  },
  metaRowDark: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaTextDark: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
  contentDivider: {
    height: 1,
    backgroundColor: '#eeeeee',
    marginVertical: 14,
  },
  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111111',
    marginBottom: 8,
  },
  bioParagraph: {
    fontSize: 14,
    color: '#444444',
    lineHeight: 20,
  },
  photoGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  gridPhotoItem: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  emptyGalleryText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: '#888',
  },
  interestsChipWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  singleInterestChip: {
    backgroundColor: '#1b4d22',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chipLabelText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonsRow: {
    position: 'relative',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
    borderWidth: 0.1,
  },
  dislikeButton: {
    borderColor: '#f44336',
  },
  superLikeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderColor: '#ffb300',
    marginHorizontal: 6,
  },
  likeButton: {
    borderColor: '#e91e63',
  },
  paginationText: {
    marginVertical: 8,
    fontSize: 15,
    color: '#4f7755',
    fontWeight: '600',
  },
});