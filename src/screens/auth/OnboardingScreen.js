import React, { useState, useRef } from 'react';
import { StyleSheet, View, FlatList, useWindowDimensions, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OnboardingSlide from '../../components/auth/OnboardingSlide';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/theme';


const onboardingData = [
  {
    id: '1',
    title: 'Find your\nperfect match',
    description: "We'll help you connect with people who truly match your vibe.",
    image: require('../../assets/images/onboarding.png'), 
  },
  {
    id: '2',
    title: 'Create meaningful\nconnections',
    description: 'Our smart matching helps you find people who share your interests and values.',
    image: require('../../assets/images/onboarding.png'),
  },
  {
    id: '3',
    title: 'Build real relationships\nthat last',
    description: 'Chat, connect and build genuine relationships that go beyond matches.',
    image: require('../../assets/images/onboarding.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = useWindowDimensions();
  const flatListRef = useRef(null);

  
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      handleFinishOnboarding();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current.scrollToIndex({ index: currentIndex - 1 });
    }
  };

  const handleSkip = () => {
    handleFinishOnboarding();
  };

  const handleFinishOnboarding = () => {
    navigation.replace('LoginScreen'); 
  };


  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0] != null) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
         <StatusBar backgroundColor={COLORS.white} barStyle="dark-content" />
        <Button 
          title="Skip" 
          variant="skip" 
          onPress={handleSkip} 
        />
      </View>

      <FlatList
        data={onboardingData}
        renderItem={({ item }) => <OnboardingSlide item={item} width={width} />}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfigRef}
        ref={flatListRef}
        extraData={width}
      />

      
      <View style={styles.footer}>
        
        {/* Carousel Progress Indicators (Capsule Pill Style) */}
        <View style={styles.indicatorContainer}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>

        {/* Primary Action Interaction (Dynamic text evaluation) */}
        <Button
          title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          variant="primary"
          onPress={handleNext}
        />

        {/* Back Link Component Control conditional evaluation */}
        {currentIndex > 0 ? (
          <Button
            title="Back"
            variant="secondary"
            style={styles.backButtonGap}
            onPress={handleBack}
          />
        ) : (
          // Keeps structural layout height locked to prevent layouts jumping around on screen 1
          <View style={styles.backButtonPlaceholder} />
        )}
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: '#EAEAEA',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0B5324', 
    width: 18, 
  },
  backButtonGap: {
    marginTop: 12,
  },
  backButtonPlaceholder: {
    height: 44,
    marginTop: 12,
  },
});