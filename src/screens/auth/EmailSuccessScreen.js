import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Image, 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/hexadating.png';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

const EmailSuccessScreen = ({ navigation }) => {
  const handleContinue = () => {
    //navigation.replace('TabNavigator')
    navigation.navigate('AddPhotosScreen')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.logoRow}>
            <Image 
              source={LogoImage} 
              style={styles.logoStyle} 
              resizeMode="contain" 
            />
            <Text style={styles.brandName}>Complete Your Profile</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressStepText}>Step 1 of 5</Text>
            <Text style={styles.progressPercentageText}>15%</Text>
          </View>
          <View style={styles.progressBarTrack}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.circleBackground}>
            <View style={styles.shieldWrapper}>
              <FontAwesomeFreeSolid name="shield-halved" size={72} color="#4CD964" />
              <View style={styles.checkIconOverlay}>
                <FontAwesomeFreeSolid name="check" size={32} color={COLORS.white} />
              </View>
            </View>
          </View>
          
          <View style={[styles.confettiDot, { top: 20, left: 40, backgroundColor: '#4285F4', transform: [{ rotate: '15deg' }] }]} />
          <View style={[styles.confettiSquare, { top: 60, left: 20, backgroundColor: '#FFCC00', transform: [{ rotate: '45deg' }] }]} />
          <View style={[styles.confettiDot, { top: 30, right: 50, backgroundColor: '#FF3B30' }]} />
          <View style={[styles.confettiSquare, { top: 80, right: 25, backgroundColor: '#4285F4', transform: [{ rotate: '30deg' }] }]} />
          <View style={[styles.confettiDot, { bottom: 50, left: 30, backgroundColor: '#FF3B30' }]} />
          <View style={[styles.confettiSquare, { bottom: 20, right: 60, backgroundColor: '#4285F4', transform: [{ rotate: '15deg' }] }]} />
        </View>

        <View style={styles.contentSection}>
          <Text style={styles.title}>Email Verified!</Text>
          <Text style={styles.subtitle}>
            Your email has been successfully{"\n"}verified.
          </Text>

          <View style={styles.secureBanner}>
            <FontAwesomeFreeSolid name="shield-halved" size={18} color={COLORS.primary} style={styles.bannerIcon} />
            <Text style={styles.bannerText}>Your account is now more secure.</Text>
          </View>

          <Button 
            title="Continue to Profile Setup" 
            onPress={handleContinue} 
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmailSuccessScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 30,
  },
  headerContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 24,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoStyle: {
    width: 38,
    height: 38,
    marginRight: 10,
  },
  brandName: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.primary,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 40,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressStepText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressPercentageText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primary,
  },
  progressBarTrack: {
    height: 6,
    width: '100%',
    backgroundColor: '#E6F4EA',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    width: '15%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 200,
    marginBottom: 32,
    position: 'relative',
  },
  circleBackground: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  checkIconOverlay: {
    position: 'absolute',
    top: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confettiDot: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  confettiSquare: {
    position: 'absolute',
    width: 10,
    height: 10,
  },
  contentSection: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 14,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  secureBanner: {
    flexDirection: 'row',
    backgroundColor: '#E6F4EA',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginBottom: 36,
  },
  bannerIcon: {
    marginRight: 12,
  },
  bannerText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  continueButton: {
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
});