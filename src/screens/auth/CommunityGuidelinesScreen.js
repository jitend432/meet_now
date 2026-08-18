import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS } from '../../constants/fonts';
import { COLORS } from '../../constants/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const CommunityGuidelinesScreen = ({ navigation }) => {
  const handleAccept = () => {
    // Navigate to the next screen (e.g. navigation.navigate('NextScreen'))
    console.log('Accepted Guidelines');
    if (navigation?.navigate) {
    navigation.navigate('BasicInfoScreen');
      //navigation.navigate('ReferralSourceScreen');
    }
  };

  const handleOpenGuidelines = () => {
    // Guidelines link or in-app modal
    console.log('Open Guidelines URL/Modal');
    // Linking.openURL('https://yourapp.com/guidelines');
  };

  return (
    <View style={styles.container}>
      {/* Top Banner Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
          }}
          style={styles.bannerImage}
          resizeMode="cover"
        />
      </View>

      {/* Content Area */}
      <SafeAreaView edges={['bottom']} style={styles.contentSafeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Title */}
          <Text style={styles.title}>It’s cool to be kind</Text>

          {/* Paragraph 1 */}
          <Text style={styles.paragraph}>
            We’re all about equality in relationships. Here, we hold people
            accountable for the way they treat each other.
          </Text>

          {/* Paragraph 2 */}
          <Text style={styles.paragraph}>
            We ask everyone on Vynk to be kind and respectful, so every person
            can have a great experience.
          </Text>

          {/* Paragraph 3 */}
          <Text style={styles.paragraph}>
            By using Vynk, you’re agreeing to adhere to our values as well as
            our{' '}
            <Text
              style={styles.underlinedLink}
              onPress={handleOpenGuidelines}
            >
              guidelines.
            </Text>
          </Text>
        </ScrollView>

        {/* Bottom Accept Action Button */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.acceptButton}
            activeOpacity={0.85}
            onPress={handleAccept}
          >
            <Text style={styles.acceptButtonText}>I accept</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CommunityGuidelinesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  imageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.38,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
  },
  contentSafeArea: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 28,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    //fontWeight: '800',
    color: COLORS.button2,
    marginBottom: 24,
    letterSpacing: -0.5,
    fontFamily: FONTS.REGULAR
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.button,
    fontWeight: '400',
    marginBottom: 22,
    fontFamily: FONTS.REGULAR
  },
  underlinedLink: {
    //fontWeight: '700',
    color: '#1A1A1A',
    textDecorationLine: 'underline',
    fontFamily: FONTS.REGULAR
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    backgroundColor: '#F9F9F9',
    bottom:30
  },
  acceptButton: {
    backgroundColor: COLORS.button,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});