import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Image, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SIZES } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/vynk_logo.png';
import GoogleIcon from '../../assets/images/google.png';
import FacebookIcon from '../../assets/images/facebook.png';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { FONTS } from '../../constants/fonts';
import { authApi } from '../../services/authApi';

const EmailVerificationScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
  
    if (!email.trim()) {
      Alert.alert('Validation Error', 'Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const resData = await authApi.forgotPassword(email.trim());
      console.log('Forgot Password API Response:', resData);

      if (resData && resData.status) {
        Alert.alert('Success', resData.msg || 'Verification code sent successfully!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('ResetPasswordScreen', { email: email.trim() });
            }
          }
        ]);
      } else {
        Alert.alert('Failed', resData.msg || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Forgot Password Catch Error:', error);
      
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to send verification code.';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
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
            {/* <Text style={styles.brandName}>Vynk Dating</Text> */}
          </View>
          <Text style={styles.title}>Email Verification</Text>
          <Text style={styles.subtitle}>We’ll send a Verification code to your email address.</Text>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize='none'
            icon={<FontAwesomeFreeSolid name="envelope" size={18} color={COLORS.logoBg} />}
          />

          <View style={styles.infoBanner}>
            <FontAwesomeFreeSolid name="shield-halved" size={16} color={COLORS.primary} style={styles.infoIcon} />
            <Text style={styles.infoText}>We never share your email with anyone.</Text>
          </View>

          <Button 
            title="Send Verification Code" 
            onPress={handleSendCode} 
            loading={loading}
            style={styles.actionButton}
          />
        </View>

        {/* <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or continue with</Text>
          <View style={styles.dividerLine} />
        </View> */}

        {/* <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={GoogleIcon} 
              style={styles.socialIcon} 
              resizeMode="contain" 
            />
            <Text style={styles.socialButtonText}>Google</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.socialButton}>
            <Image 
              source={FacebookIcon} 
              style={styles.socialIcon} 
              resizeMode="contain" 
            />
            <Text style={styles.socialButtonText}>Facebook</Text>
          </TouchableOpacity>
        </View> */}

        <View style={styles.footerBanner}>
          <Text style={styles.redirectText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 40,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 28,
    marginTop: 10,
    width: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoStyle: {
    width: SIZES.avatarmini,
    height: SIZES.avatarmini,
  },
  brandName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.primary,
  },
  title: {
    fontSize: 22,
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: FONTS.SEMIBOLD
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formSection: {
    width: '100%',
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: '#E6F4EA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
    marginBottom: 24,
  },
  infoIcon: {
    marginRight: 10,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  actionButton: {
    marginTop: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 28,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.3,
  },
  dividerText: {
    fontSize: 12,
    color: COLORS.primary,
    paddingHorizontal: 10,
    fontWeight: '500',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    width: '48%',
    height: 50,
  },
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginLeft: 10,
  },
  footerBanner: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    marginHorizontal: -24,
    marginBottom: -40,
    paddingVertical: 24,
    marginTop: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  redirectText: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textDark,
  },
});