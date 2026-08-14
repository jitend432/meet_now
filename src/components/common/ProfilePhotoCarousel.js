import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Image, 
  ScrollView, 
  Dimensions,
  Pressable
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 24; // Layout padding subtracted

const ProfilePhotoCarousel = ({ photos, defaultImage }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const photoList = Array.isArray(photos) && photos.length > 0 ? photos : [];

  const handleScroll = (event) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / CARD_WIDTH);
    setActiveIndex(index);
  };

  // 👈 Tap par photo switch karne ke liye functions
  const scrollToNext = () => {
    if (activeIndex < photoList.length - 1) {
      const nextIndex = activeIndex + 1;
      scrollViewRef.current?.scrollTo({ x: nextIndex * CARD_WIDTH, animated: true });
      setActiveIndex(nextIndex);
    }
  };

  const scrollToPrev = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      scrollViewRef.current?.scrollTo({ x: prevIndex * CARD_WIDTH, animated: true });
      setActiveIndex(prevIndex);
    }
  };

  if (photoList.length === 0) {
    return (
      <Image
        source={defaultImage || require('../../assets/images/u.png')}
        style={styles.singleImage}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* 1. HORIZONTAL SCROLLVIEW */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
      >
        {photoList.map((photoUrl, index) => (
          <Image
            key={index}
            source={{ uri: photoUrl }}
            style={styles.carouselImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      {/* 2. TOP INDICATOR BARS */}
      {photoList.length > 1 && (
        <View style={styles.indicatorRow} pointerEvents="none">
          {photoList.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorBar,
                index === activeIndex && styles.activeIndicatorBar,
              ]}
            />
          ))}
        </View>
      )}

      {/* 3. TAP AREAS FOR LEFT / RIGHT CLICK 👈 */}
      {photoList.length > 1 && (
        <View style={styles.touchOverlayRow}>
          <Pressable style={styles.touchArea} onPress={scrollToPrev} />
          <Pressable style={styles.touchArea} onPress={scrollToNext} />
        </View>
      )}
    </View>
  );
};

export default ProfilePhotoCarousel;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  singleImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  carouselImage: {
    width: CARD_WIDTH,
    height: '100%',
    borderRadius: 24,
  },
  indicatorRow: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    gap: 4,
    zIndex: 20,
  },
  indicatorBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 2,
  },
  activeIndicatorBar: {
    backgroundColor: '#FFFFFF',
  },
  touchOverlayRow: {
    position: 'absolute',
    top: 30,
    bottom: 80, // Details overlay aur arrow button ke upar tak
    left: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 15,
  },
  touchArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});