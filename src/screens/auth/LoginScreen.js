import React, { useState } from 'react';
import { 
 StyleSheet, 
 Text, 
 View, 
 ScrollView,
 Image, 
 TouchableOpacity,
 Alert,
 StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTSIZE } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/vynk_t.png';
import GoogleIcon from '../../assets/images/google.png';
import FacebookIcon from '../../assets/images/facebook.png';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
// Redux & API
import { useAppDispatch } from '../../redux/hooks';
import { setCredentials } from '../../redux/slices/authSlice';
import { authApi } from '../../services/authApi';
import { FONTS } from '../../constants/fonts';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const handleLogin = async () => {
  if (!email.trim() || !password.trim()) {
    Alert.alert('Validation Error', 'Please enter both email and password.');
    return;
  }
  setLoading(true);

  try {
    const resData = await authApi.login(email.trim(), password);
    
    console.log('Login Screen Resolved Data:', resData);
   
    if (resData && resData.data && resData.data.token) {
      
      dispatch(setCredentials({
        token: resData.data.token,
        refreshToken: null,
      }));       
      
    } else {
      const backendMessage = resData?.msg || 'Invalid response format from server.';
      Alert.alert('Login Error', backendMessage);
    }

  } catch (error) {
    console.error('Actual Login Catch Error:', error);
    
    const errorMessage = error.response?.data?.msg || error.message || 'Something went wrong. Please try again.';
    Alert.alert('Login Failed', errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
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
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to continue your journey</Text>
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

          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            autoCapitalize='none'
            icon={<FontAwesomeFreeSolid name="lock" size={18} color={COLORS.logoBg} />}
          />

          <View style={styles.optionsRow}>
            <TouchableOpacity 
              style={styles.checkboxContainer} 
              activeOpacity={0.8}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <FontAwesomeFreeSolid name="check" size={12} color={COLORS.white} />}
              </View>
              <Text style={styles.checkboxLabel}>Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate('VerifyEmailScreen')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <Button 
            title="Login" 
            onPress={handleLogin} 
            loading={loading}
            style={styles.loginButton}
          />

          <View style={styles.redirectContainer}>
            <Text style={styles.redirectText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignupScreen')}>
              <Text style={styles.signupLink}>Sign Up</Text>
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
    </SafeAreaView>
  );
};

export default LoginScreen;

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
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    //marginBottom: 16,
  },
  logoStyle: {
    width: 120,
    height: 120,
    alignItems:'center'
    //marginRight: 2,
    //marginBottom: 5
  },
  brandName: {
    fontSize: FONTSIZE.xxl,
    color: COLORS.primary,
    fontFamily: FONTS.SEMIBOLD,
    textAlign:'center'
  },
  title: {
    fontSize: FONTSIZE.xxl,
    color: COLORS.primary,
    textAlign: 'center',
    fontFamily: FONTS.SEMIBOLD
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: FONTS.REGULAR
  },
  formSection: {
    width: '100%',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 14,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    backgroundColor: COLORS.white,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.primary,
    //fontWeight: '500',
    fontFamily: FONTS.REGULAR
  },
  forgotPasswordText: {
    fontSize: 14,
    color: COLORS.primary,
    //fontWeight: '600',
    fontFamily: FONTS.REGULAR
  },
  loginButton: {
    marginTop: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  redirectContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  redirectText: {
    fontSize: 14,
    color: COLORS.textLight,
    fontFamily: FONTS.REGULAR
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
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
  socialIcon: {
    width: 20,
    height: 20,
  },
  socialButtonText: {
    fontSize: 14,
    //fontWeight: '600',
    color: '#555555',
    marginLeft: 10,
    fontFamily: FONTS.REGULAR
  },
});