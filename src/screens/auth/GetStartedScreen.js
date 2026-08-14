import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image,
  TouchableOpacity,
  StatusBar,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FONTS } from '../../constants/fonts';
import { COLORS, FONTSIZE, SIZES, SPACING } from '../../constants/theme';
import LinearGradient from 'react-native-linear-gradient';

const GetStartedScreen = ({ navigation }) => {
  return (
    // <LinearGradient
    //  colors={['#69f8a7', '#166c24']} // 
    // start={{ x: 0, y: 0 }}
    // end={{ x: 0, y: 1 }}
    // style={{ flex: 1 }}
    // >
    <SafeAreaView style={styles.container}>
       <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <View style={styles.contentContainer}>
        
        <View style={styles.logoGroupContainer}>
          <Image 
            source={require('../../assets/images/vynk_t.png')} 
            style={styles.appLogoImage}
            resizeMode="contain"
          />
          {/* <Text style={styles.brandNameText}>Vynk Dating</Text> */}
        </View>

        <View style={styles.textHeadingGroup}>
          {/* <Text style={styles.mainCatchphraseText}>Find meaningful</Text>
          <Text style={styles.mainCatchphraseText}>connections</Text> */}
          
          {/* <Text style={styles.subtextParagraph}>
             By tapping ‘Create account’ or ‘Sign in’, you agree to
             {'\n'}
             our <Text style={styles.linkText} onPress={() => Linking.openURL('https://vynkdating.com/terms-of-service')}>Terms</Text>. Learn how we process your data in our
             {'\n'}
             <Text style={styles.linkText} onPress={() => Linking.openURL('https://vynkdating.com/privacy-policy')}>Privacy Policy</Text> and <Text style={styles.linkText} onPress={() => Linking.openURL('https://vynkdating.com/privacy-policy')}>Cookies Policy</Text>.
           </Text> */}

           <Text style={styles.subtextParagraph}>
            By tapping ‘Create account’ or ‘Sign in’, you agree to our{' '}
            <Text style={styles.linkText} onPress={() => Linking.openURL('https://vynkdating.com/terms-of-service')}>
              Terms
            </Text>
            . Learn how we process your data in our{' '}
            <Text style={styles.linkText} onPress={() => Linking.openURL('https://vynkdating.com/privacy-policy')}>
              Privacy Policy
            </Text>{' '}
            and{' '}
            <Text style={styles.linkText} onPress={() => Linking.openURL('https://vynkdating.com/privacy-policy')}>
              Cookies Policy
            </Text>
            .
          </Text>

        </View>

        <View style={styles.actionFooterArea}>

          <TouchableOpacity 
            style={styles.getStartedButton} 
            activeOpacity={0.85}
            onPress={() => navigation?.navigate('SignupScreen')}
          >
            <Text style={styles.getStartedButtonText}>Create account</Text>
          </TouchableOpacity>

           <TouchableOpacity 
            style={styles.getStartedButton} 
            activeOpacity={0.85}
            onPress={() => navigation?.navigate('OnboardingScreen')}
          >
            <Text style={styles.getStartedButtonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.loginRedirectTrigger}
            // onPress={() => alert('Navigate to Login Screen')}
            // onPress={() => navigation?.navigate('LoginScreen')}
          >
            <Text style={styles.accountCheckLabel}>
              Trouble signing in? 
              {/* <Text style={styles.loginBoldHighlight}>Login</Text> */}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
    // </LinearGradient>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '20%',
    paddingBottom: '8%',
  },
  logoGroupContainer: {
    alignItems: 'center',
    width: '100%',
    position:'relative',
    top:120
  },
  appLogoImage: {
    width: SIZES.avatarlg,
    height: SIZES.avatarlg,
    //marginBottom: SPACING.md,
    //borderRadius: 60
  },
  brandNameText: {
    fontSize: FONTSIZE.h3,
    color: COLORS.white,
    letterSpacing: 0.2,
    fontFamily: FONTS.SEMIBOLD
  },
  textHeadingGroup: {
    alignItems: 'center',
    width: '100%',
    top: 100
   // marginVertical: 20,
    //overflow:'visible'
  },
  mainCatchphraseText: {
    fontSize: FONTSIZE.lg,
    color: COLORS.button2,
    textAlign: 'center',
    fontFamily: FONTS.MEDIUM,
    //includeFontPadding: false,
    lineHeight: 40,
    //paddingVertical:4
  },
  subtextParagraph: {
    fontSize: FONTSIZE.xs,
    color: COLORS.button2,
    textAlign: 'center',
    lineHeight: 25,
    marginTop: 28,
    paddingHorizontal: 16,
    fontFamily: FONTS.REGULAR
  },
  actionFooterArea: {
    width: '100%',
    alignItems: 'center',
  },
  getStartedButton: {
    backgroundColor: COLORS.button2,
    width: '100%',
    height: 52,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  getStartedButtonText: {
    color: COLORS.white, 
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.BOLD,
  },
  loginRedirectTrigger: {
    paddingVertical: 10,
  },
  accountCheckLabel: {
    color: '#2f5f33',
    fontSize: FONTSIZE.xs,
    fontFamily: FONTS.REGULAR
  },
  loginBoldHighlight: {
    color: COLORS.button2,
    fontFamily: FONTS.MEDIUM
  },
  linkText: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});