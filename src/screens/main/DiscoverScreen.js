import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ImageBackground, 
  TouchableOpacity,
  Modal,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from '@react-native-community/blur';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  withTiming, 
  runOnJS,
  interpolate
} from 'react-native-reanimated';
import CardContainer from '../../components/chat/CardContainer';
import userApi from '../../services/userApi';
import { matchApi } from '../../services/matchApi';
import { FONTS } from '../../constants/fonts';
import { photoApi } from '../../services/photoApi'; // Import already present

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.4;

const DiscoverScreen = () => {
  
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  
  // New States for User Photos
  const [userPhotos, setUserPhotos] = useState([]);
  const [isPhotosLoading, setIsPhotosLoading] = useState(false);

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const contextX = useSharedValue(0);
  const contextY = useSharedValue(0);

  const rawProfile = profiles[currentIndex] || {};
  
  const currentProfile = {
    ...rawProfile,
    id: rawProfile.id,
    name: rawProfile.fullName || 'User',
    age: rawProfile.age !== null && rawProfile.age !== undefined ? rawProfile.age : '',
    bio: rawProfile.bio || 'No bio provided.',
    profession: rawProfile.occupation || 'Professional',
    location: rawProfile.city || 'Nearby',
    interests: rawProfile.interests || [],
    image: rawProfile.profilePhoto 
      ? `https://your-backend-api-domain.com${rawProfile.profilePhoto}` 
      : null
  };

  useEffect(() => {
    fetchNearbyProfiles();
  }, []);

  // Effect: Jab bhi currentIndex ya profiles badlenge, automatic current user ki photos fetch hongi
  useEffect(() => {
    if (profiles.length > 0 && currentIndex < profiles.length && currentProfile.id) {
      fetchCurrentProfilePhotos(currentProfile.id);
    }
  }, [currentIndex, profiles]);

  const fetchNearbyProfiles = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await userApi.getNearbyUsers(10);
      console.log("Nearby User Data ====> ", response);
      
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

  // API handler to fetch photos for the active user card
  const fetchCurrentProfilePhotos = async (userId) => {
    try {
      setIsPhotosLoading(true);
      const response = await photoApi.getUserPhotos(userId);
      console.log(`Photos for User ${userId} ====> `, response);
      
      
      setUserPhotos(response?.data || []);
      //console.log("show this image=======> ",userPhotos)
    } catch (error) {
      console.error(`Failed to fetch photos for user ${userId}:`, error);
      setUserPhotos([]); 
    } finally {
      setIsPhotosLoading(false);
    }
  };
  console.log("show this image=======> ",userPhotos[0]?.photoUrl)

  const handleSwipeAction = async (direction) => {
    if (!currentProfile) return;

    const targetUserId = currentProfile.id;
    const actionType = direction === 'right' ? 'LIKE' : 'DISLIKE';

    console.log(`Swiped ${direction} on user: ${currentProfile.name}`);

    try {
      await matchApi.handleLikeDislike(targetUserId, actionType);
    } catch (error) {
      console.error('Failed to sync swipe with backend:', error);
    }

    translateX.value = 0;
    translateY.value = 0;
    contextX.value = 0;
    contextY.value = 0;

    setUserPhotos([]);

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(profiles.length);
    }
  };

  const forceSwipe = (direction) => {
    if (isLoading || !currentProfile) return;
    const targetX = direction === 'right' ? SCREEN_WIDTH + 150 : -SCREEN_WIDTH - 150;
    translateX.value = withTiming(targetX, { duration: 250 }, () => {
      runOnJS(handleSwipeAction)(direction);
    });
  };

  const gesture = Gesture.Pan()
    .enabled(!isLoading && !!currentProfile)
    .onStart(() => {
      contextX.value = translateX.value;
      contextY.value = translateY.value;
    })
    .onUpdate((event) => {
      translateX.value = contextX.value + event.translationX;
      translateY.value = contextY.value + event.translationY;
    })
    .onEnd((event) => {
      if (event.velocityX > 500 || translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withTiming(SCREEN_WIDTH + 150, { duration: 200 }, () => {
          runOnJS(handleSwipeAction)('right');
        });
      } else if (event.velocityX < -500 || translateX.value < -SWIPE_THRESHOLD) {
        translateX.value = withTiming(-SCREEN_WIDTH - 150, { duration: 200 }, () => {
          runOnJS(handleSwipeAction)('left');
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

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CardContainer title="Hexa Dating">
          <View style={styles.noMoreContainer}>
            <ActivityIndicator size="large" color="#6d0909" />
            <Text style={[styles.noMoreText, { marginTop: 12 }]}>Fetching profiles nearby...</Text>
          </View>
        </CardContainer>
      </SafeAreaView>
    );
  }

  if (hasError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CardContainer title="Hexa Dating">
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreText}>Something went wrong</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchNearbyProfiles}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </CardContainer>
      </SafeAreaView>
    );
  }

  if (profiles.length === 0 || currentIndex >= profiles.length) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <CardContainer title="Vynk Dating">
          <View style={styles.noMoreContainer}>
            <Text style={styles.noMoreText}>No More Profiles Nearby</Text>
          </View>
        </CardContainer>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.safeArea}>
        <CardContainer title="Vynk Dating">
          <View style={styles.mainLayoutContainer}>
            
            <View style={styles.cardWrapper}>
              <GestureDetector gesture={gesture}>
                <Animated.View style={[styles.animatedCardContainer, cardAnimatedStyle]}>

                 <ImageBackground 
                  source={
                    currentProfile?.profilePhoto 
                      ? 
                      { uri:  currentProfile.profilePhoto  }
                      :  require('../../assets/images/img.jpg') 
                  } 
                  style={styles.backgroundImage}
                  imageStyle={styles.cardImageRadius}
                  resizeMode="cover"
                >

                    <TouchableOpacity 
                      style={styles.infoButton} 
                      onPress={() => setIsAboutVisible(true)}
                      activeOpacity={0.7}
                    >
                      <FontAwesomeFreeSolid name="info-circle" size={26} color="#ffffff" />
                    </TouchableOpacity>

                    <View style={styles.profileDetailsOverlay}>
                      <View style={styles.nameContainer}>
                        <Text style={styles.profileName}>{currentProfile.name}</Text>
                        <Text style={styles.profileAge}>{currentProfile.age}</Text>
                        <FontAwesomeFreeSolid name="star" size={16} color="#ffb300" style={styles.starIcon} />
                      </View>
                      <View style={styles.metaRow}>
                        <FontAwesomeFreeSolid name="briefcase" size={13} color="#e0e0e0" style={styles.metaIcon} />
                        <Text style={styles.metaText}>{currentProfile.role || currentProfile.profession}</Text>
                      </View>
                      <View style={styles.metaRow}>
                        <FontAwesomeFreeSolid name="map-marker-alt" size={13} color="#e0e0e0" style={styles.metaIcon} />
                        <Text style={styles.metaText}>{currentProfile.location || currentProfile.city}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </Animated.View>
              </GestureDetector>
            </View>

            <View style={styles.actionButtonsRow}>
              <TouchableOpacity onPress={() => forceSwipe('left')} style={[styles.circleButton, styles.dislikeButton]} activeOpacity={0.8}>
                <FontAwesomeFreeSolid name="times" size={24} color="#4caf50" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.circleButton, styles.superLikeButton]} activeOpacity={0.8}>
                <FontAwesomeFreeSolid name="star" size={22} color="#81c784" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => forceSwipe('right')} style={[styles.circleButton, styles.likeButton]} activeOpacity={0.8}>
                <FontAwesomeFreeSolid name="heart" size={24} color="#265c32" />
              </TouchableOpacity>
            </View>

            <Text style={styles.paginationText}>{currentIndex + 1} / {profiles.length} profile</Text>

            <Modal
              animationType="fade"
              transparent={true}
              visible={isAboutVisible}
              onRequestClose={() => setIsAboutVisible(false)}
            >
              <View style={styles.modalViewContainer}>
                <BlurView
                  style={StyleSheet.absoluteFillObject}
                  blurType="light"
                  blurAmount={10}
                  reducedTransparencyFallbackColor="white"
                />

                <TouchableOpacity 
                  style={styles.dismissOverlay} 
                  activeOpacity={1} 
                  onPress={() => setIsAboutVisible(false)} 
                />
                
                <View style={styles.aboutCard}>
                  <Text style={styles.aboutTitle}>About {currentProfile.name}</Text>
                  
                  <Text style={styles.aboutDescription}>{currentProfile.bio}</Text>

                  <View style={styles.detailsDivider} />

                  <View style={styles.modalInfoRow}>
                    <FontAwesomeFreeSolid name="map-marker-alt" size={16} color="#265c32" style={styles.modalIconSpace} />
                    <Text style={styles.modalInfoText}>{currentProfile.city || currentProfile.location}</Text>
                  </View>

                  <View style={styles.modalInfoRow}>
                    <FontAwesomeFreeSolid name="laptop-code" size={14} color="#265c32" style={styles.modalIconSpace} />
                    <Text style={styles.modalInfoText}>{currentProfile.profession || currentProfile.role}</Text>
                  </View>

                  {/* --- INTEGRATED PHOTOS INTERFACE INSIDE THE MODAL --- */}
                  <Text style={styles.interestsSubheading}>Photos</Text>
                  {isPhotosLoading ? (
                    <ActivityIndicator size="small" color="#265c32" style={{ marginVertical: 10 }} />
                  ) : userPhotos.length > 0 ? (
                    <View style={styles.chipsContainer}>
                      {userPhotos.map((photo, index) => {
                        const photoUrl = `https://your-backend-api-domain.com${photo.url || photo.imagePath}`;
                        return (
                          <View key={photo.id || index} style={{ marginRight: 8, marginBottom: 8 }}>
                            <Animated.Image 
                              source={{ uri: photoUrl }} 
                              style={{ width: 70, height: 70, borderRadius: 8, backgroundColor: '#eee' }} 
                            />
                          </View>
                        );
                      })}
                    </View>
                  ) : (
                    <Text style={[styles.modalInfoText, { fontStyle: 'italic', color: '#888' }]}>No extra photos uploaded.</Text>
                  )}
                  {/* -------------------------------------------------- */}

                  {currentProfile.interests && currentProfile.interests.length > 0 && (
                    <>
                      <Text style={styles.interestsSubheading}>Interests</Text>
                      <View style={styles.chipsContainer}>
                        {currentProfile.interests.map((interest, index) => (
                          <View key={index} style={styles.interestChip}>
                            <Text style={styles.chipText}>{interest}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              </View>
            </Modal>

          </View>
        </CardContainer>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default DiscoverScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    //backgroundColor: '#9c6644', 
  },
  mainLayoutContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMoreText: {
    fontSize: 18,
    //fontWeight: '700',
    color: '#760909',
    fontFamily:  FONTS.REGULAR
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
    height: '68%',
    position: 'relative',
    borderRadius: 24,
  },
  animatedCardContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 16,
  },
  cardImageRadius: {
    borderRadius: 24,
  },
  infoButton: {
    alignSelf: 'flex-end',
    marginTop: 4,
    marginRight: 4,
    zIndex: 999,
  },
  profileDetailsOverlay: {
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.45)', 
    borderRadius: 16,
    padding: 16,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#ffffff',
  },
  profileAge: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 8,
    marginRight: 6,
  },
  starIcon: {
    marginLeft: 2,
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
    fontSize: 12,
    color: '#e0e0e0',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
  circleButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 14,
  },
  dislikeButton: {
    borderWidth: 1.5,
    borderColor: '#a5d6a7',
  },
  superLikeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    marginHorizontal: 6,
  },
  likeButton: {
    borderWidth: 1.5,
    borderColor: '#265c32',
  },
  paginationText: {
    marginVertical: 12,
    fontSize: 15,
    color: '#4f7755',
    fontWeight: '600',
  },
  modalViewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  aboutCard: {
    backgroundColor: '#fbf5db', 
    borderWidth: 1.5,
    borderColor: '#c5e1a5',
    borderRadius: 24,
    width: '92%',
    padding: 20,
    marginBottom: 30,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#265c32',
    marginBottom: 12,
  },
  aboutDescription: {
    fontSize: 14,
    color: '#33691e',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 16,
  },
  detailsDivider: {
    height: 1,
    backgroundColor: '#dcedc8',
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalIconSpace: {
    width: 24,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#33691e',
    fontWeight: '600',
  },
  interestsSubheading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#265c32',
    marginTop: 8,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestChip: {
    backgroundColor: '#265c32',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    marginBottom: 8,
  },
  chipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});