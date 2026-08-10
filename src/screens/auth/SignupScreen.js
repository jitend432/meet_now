import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Image, 
  TouchableOpacity,
  Alert,
  Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTSIZE } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/vynk_t.png';
import GoogleIcon from '../../assets/images/google.png';
import FacebookIcon from '../../assets/images/facebook.png';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { useAppDispatch } from '../../redux/hooks';
import { FONTS } from '../../constants/fonts';
import { authApi } from '../../services/authApi';
import { CustomModal } from '../../components/common/CustomModal';

const SignupScreen = ({ navigation }) => {
  
  const dispatch = useAppDispatch()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    buttons: []
  });

  const showAlertModal = (title, message, type = 'info', buttons = []) => {
    setModalConfig({ title, message, type, buttons });
    setModalVisible(true);
  };



const handleRegister = async () => {
  if ( !email.trim() || !password.trim() || !confirmPassword.trim()) {
    showAlertModal('Validation Error', 'All fields are required.', 'warning');
      return;
  }

  if (password !== confirmPassword) {
    showAlertModal('Validation Error', 'Password and Confirm Password do not match.', 'warning');
    return;
  }

  if (!agreeTerms) {
    showAlertModal('Terms Error', 'Please agree to the Terms and Conditions to proceed.', 'warning');    return;
  }

  setLoading(true);

  const payload = {
    //fullName: fullName.trim(),
    email: email.trim(),
    password: password,
    confirmPassword: confirmPassword,
    // profilePhoto: "",
    // gender: "MALE",
    // dateOfBirth: "2026-01-01",
    // locations: {
    //   city: "",
    //   state: "",
    //   country: "",
    //   latitude: 0.0,
    //   longitude: 0.0
    // },
    // bio: "",
    // occupation: "",
    // education: "UNDERGRADUATE",
    // emailVerified: true,
    // active: true,
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
    // interests: ["TRAVEL"],
    // drinkingHabit: "YES",
    // smokingHabit: "I_SMOKE_SOMETIMES",
    // hopingToFind: "A_LONG_TERM_RELATIONSHIP",
    // lookingFor: "MEN",
    // profileCompletion: 0,
    // role: "USER"
  };

  try {
    const resData = await authApi.register(payload);
    
    console.log('Register API Response:', resData);

    if (resData && resData.data && resData.data.token) {
      showAlertModal(
          'Success', 
          'Account created successfully!', 
          'success',
          [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                dispatch(setCredentials({
                  token: resData.data.token,
                  refreshToken: null,
                }));
              }
            }
          ]
        );
    } else {
     showAlertModal(
          'Success', 
          'Registration successful! Please log in.', 
          'success',
          [
            { 
              text: 'Go to Verify Otp', 
              onPress: () => {
                setModalVisible(false);
                navigation.navigate('VerifyOtpScreen', { email: payload.email });
              }
            }
          ]
        );
      }

  } catch (error) {
    console.error('Register Handler Catch Error:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Registration failed. Please try again.';
    console.log("=== BACKEND ERROR DETAILS ===", error.response?.data);
    showAlertModal('Registration Failed', errorMessage, 'error');
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
    
        <View style={styles.headerSection}>
          <View style={styles.topHeader}>
            
            <Image source={LogoImage} style={styles.logoStyle} resizeMode="contain" />
          {/* <Text style={styles.brandName}>Vynk Dating</Text> */}
          </View>
          
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Start your journey to find love</Text>
        </View>

        <View style={styles.formSection}>
          {/* <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            icon={<FontAwesomeFreeSolid name="user" size={18} color={COLORS.logoBg} />}
          /> */}

          <Input
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon={<FontAwesomeFreeSolid name="envelope" size={18} color={COLORS.logoBg} />} // Note: fontawesome me envelope hota hai mail ke liye
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            icon={<FontAwesomeFreeSolid name="lock" size={18} color={COLORS.logoBg} />}
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            icon={<FontAwesomeFreeSolid name="lock" size={18} color={COLORS.logoBg} />}
          />

          
          {/* <TouchableOpacity 
            style={styles.checkboxContainer} 
            activeOpacity={0.8}
            onPress={() => setAgreeTerms(!agreeTerms)}
          >
            <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
              {agreeTerms && <FontAwesomeFreeSolid name="check" size={12} color={COLORS.white} />}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the <Text style={styles.linkText}>Terms of Service</Text> and <Text style={styles.linkText}>Privacy Policy</Text>
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity 
  style={styles.checkboxContainer} 
  activeOpacity={0.8}
  onPress={() => setAgreeTerms(!agreeTerms)}
>
  <View style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}>
    {agreeTerms && <FontAwesomeFreeSolid name="check" size={12} color={COLORS.white} />}
  </View>
  <Text style={styles.checkboxLabel}>
    I agree to the{' '}
    <Text 
      style={styles.linkText} 
      onPress={(e) => {
        e.stopPropagation(); // Isse checkbox toggle nahi hoga
        Linking.openURL('https://vynkdating.com/terms-of-service');
      }}
    >
      Terms of Service
    </Text>
    {' '}and{' '}
    <Text 
      style={styles.linkText} 
      onPress={(e) => {
        e.stopPropagation(); // Isse checkbox toggle nahi hoga
        Linking.openURL('https://vynkdating.com/privacy-policy');
      }}
    >
      Privacy Policy
    </Text>
  </Text>
</TouchableOpacity>

          
          <Button 
            title="Create Account" 
            onPress={handleRegister} 
            loading={loading}
            style={styles.signupButton}
          />

          
          <View style={styles.loginRedirectContainer}>
            <Text style={styles.redirectText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.loginLink}>Login</Text>
            </TouchableOpacity>
          </View>
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

      </ScrollView>
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  topHeader: {
    flexDirection: 'row', 
  alignItems: 'center',     
  justifyContent: 'center', 
  //marginBottom: 15,
  //marginTop: 10,
  //marginRight:20
  },

  logoContainer: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom: 12,
  },
  brandName: {
    fontSize: FONTSIZE.xxl,
    color: COLORS.primary,
    fontFamily: FONTS.SEMIBOLD
  },
  title: {
    fontSize: FONTSIZE.xxl,
    color: COLORS.primary,
    fontFamily: FONTS.SEMIBOLD
  },
  subtitle: {
    fontSize: FONTSIZE.xs,
    color: COLORS.success,
    marginTop: 4,
    fontFamily: FONTS.REGULAR
  },
  formSection: {
    width: '100%',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    paddingRight: 20,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 13,
    color: COLORS.primary,
    //fontWeight: '500',
    lineHeight: 18,
    fontFamily: FONTS.REGULAR
  },
  linkText: {
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  signupButton: {
    marginTop: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  loginRedirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  redirectText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontFamily: FONTS.REGULAR
  },
  loginLink: {
    fontSize: 14,
    //fontWeight: '700',
    color: COLORS.textDark,
    fontFamily: FONTS.REGULAR
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
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
    //fontWeight: '500',
    fontFamily: FONTS.REGULAR
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
    marginLeft: 10,
  },
  logoStyle: {
  width: 120,
  height: 120,
  //marginBottom: 10,
  //borderRadius:40
},
socialIcon: {
    width: 20,
    height: 20,
  },
});