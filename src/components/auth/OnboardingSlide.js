import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const OnboardingSlide = ({ item, width }) => {
  return (
    <View style={[styles.slideContainer, { width }]}>
      <Text style={styles.title}>{item.title}</Text>

      <Text style={styles.description}>{item.description}</Text>
      
      <View style={styles.imageWrapper}>
        <Image 
          source={item.image} 
          style={styles.image} 
          resizeMode="contain" 
        />
      </View>
    </View>
  );
};

export default OnboardingSlide;

const styles = StyleSheet.create({
  slideContainer: {
    alignItems: 'center',
    paddingHorizontal: 32,
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111111',
    marginBottom: 16,
    lineHeight: 34,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666666',
    lineHeight: 22,
    marginBottom: 40,
  },
  imageWrapper: {
    width: '100%',
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});