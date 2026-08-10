import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
import { COLORS, FONTSIZE, LETTER_SPACING, SIZES, SPACING } from '../../constants/theme';
import { FONTS } from '../../constants/fonts';
import { useAppSelector } from '../../redux/hooks';

const SplashScreen = ({ navigation }) => {
  //const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const { isLoggedIn, isProfileCompleted } = useAppSelector((state) => state.auth);

useEffect(() => {
    const timer = setTimeout(() => {
      if (!isLoggedIn) {
        navigation.replace('GetStartedScreen');
      } else if (!isProfileCompleted) {
        navigation.replace('EmailSuccessScreen');
      } else {
        navigation.replace('TabNavigator');
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isLoggedIn, isProfileCompleted, navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/vynk_t.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* <Text style={styles.title}>Vynk Dating</Text> */}
      </View>

    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoContainer: {
    alignItems: 'center',
  },

  logo: {
    width: SIZES.avatarlg,
    height: SIZES.avatarlg,
    marginBottom: SPACING.md,
  },

  title: {
    fontSize: FONTSIZE.h3,
    color: COLORS.button2,
    letterSpacing: LETTER_SPACING.medium,
    fontFamily: FONTS.SEMIBOLD
  },
});