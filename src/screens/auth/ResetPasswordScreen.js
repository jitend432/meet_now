import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTSIZE } from '../../constants/theme';
import { FONTS } from '../../constants/fonts';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { authApi } from '../../services/authApi';

const ResetPasswordScreen = ({ navigation, route }) => {
  
  const [email, setEmail] = useState(route?.params?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

 const handleResetPassword = async () => {
    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Password and Confirm Password do not match.');
      return;
    }

    if (trimmedOtp.length < 4) { 
      Alert.alert('Validation Error', 'Please enter a valid OTP.');
      return;
    }

    setLoading(true);

    try {
    
      const resData = await authApi.resetPassword(
        trimmedEmail, 
        trimmedOtp, 
        password, 
        confirmPassword
      );
      
      console.log('Reset Password API Response:', resData);

      if (resData && resData.status) {
        Alert.alert('Success', resData.msg || 'Your password has been reset successfully!', [
          {
            text: 'Login Now',
            onPress: () => navigation.navigate('LoginScreen')
          }
        ]);
      } else {
        Alert.alert('Reset Failed', resData.msg || 'Something went wrong. Please try again.');
      }

    } catch (error) {
      console.error('Reset Password Catch Error:', error);
      const errorMessage = error.response?.data?.msg || error.message || 'Failed to reset password. Please try again.';
      console.log("=== BACKEND ERROR DETAILS ===", error.response?.data);
      Alert.alert('Reset Failed', errorMessage);
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
          <View style={styles.iconCircle}>
            <FontAwesomeFreeSolid name="key" size={42} color={COLORS.surfaceCard} />
          </View>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your OTP and choose a secure new password</Text>
        </View>

        <View style={styles.formSection}>
          <Input
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon={<FontAwesomeFreeSolid name="envelope" size={18} color={COLORS.logoBg} />}
          />

          <Input
            label="Verification Code (OTP)"
            placeholder="Enter the code sent to your email"
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            icon={<FontAwesomeFreeSolid name="shield-halved" size={18} color={COLORS.logoBg} />}
          />

          <Input
            label="New Password"
            placeholder="Create a strong new password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            icon={<FontAwesomeFreeSolid name="lock" size={18} color={COLORS.logoBg} />}
          />

          <Input
            label="Confirm New Password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            icon={<FontAwesomeFreeSolid name="lock" size={18} color={COLORS.logoBg} />}
          />

          <Button 
            title="Update Password" 
            onPress={handleResetPassword} 
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

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
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: FONTSIZE.xxl || 28,
    color: COLORS.primary,
    fontFamily: FONTS.SEMIBOLD,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTSIZE.xs || 14,
    color: COLORS.success,
    marginTop: 8,
    fontFamily: FONTS.REGULAR,
    textAlign: 'center',
    lineHeight: 20,
  },
  formSection: {
    width: '100%',
  },
  submitButton: {
    marginTop: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
});