import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  TextInput, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import Button from '../../components/common/Button';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { authApi } from '../../services/authApi';
import { useAppDispatch } from '../../redux/hooks';
import { setCredentials } from '../../redux/slices/authSlice';

const VerifyOtpScreen = ({ navigation, route }) => {

  const email = route?.params?.email || 'User@gmail.com';
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);
  const dispatch = useAppDispatch()

  const [timeLeft, setTimeLeft] = useState(300); // 300 seconds = 5 minutes

   useEffect(() => {
     if (timeLeft <= 0) return;
   
     const timerId = setInterval(() => {
       setTimeLeft((prevTime) => prevTime - 1);
     }, 1000);
   
     return () => clearInterval(timerId);
   }, [timeLeft]);
   
   const formatTime = (seconds) => {
     const mins = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
   };


  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // const handleVerify = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //       setLoading(false)
  //       navigation.navigate('EmailSuccessScreen')
  //           }, 2000);
  // };

  const handleVerify = async () => {
  const otpCode = otp.join(''); 
  
  if (otpCode.length < 6) {
    Alert.alert('Validation Error', 'Please enter the complete 6-digit OTP.');
    return;
  }

  setLoading(true);
  try {
    // Passes both inputs together to map payload
    const responseData = await authApi.verifyOtp(email, otpCode);
    console.log("Email and otp ====> ",email,otpCode)
    
    if (responseData) {
      dispatch(setCredentials({
        token: responseData.token || null,
        userId: responseData.userId || responseData.id
      }));
      
      navigation.navigate('EmailSuccessScreen');
    }
  } catch (error) {
    console.error('OTP Verification Error:', error);
    console.log("Otp error Response",error?.response?.data?.message)
    Alert.alert(
      'Verification Failed',
      error?.response?.data?.message || 'Invalid OTP. Please try again.',
    );
    
  } finally {
    setLoading(false);
  }
};

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await authApi.resendOtp(email);
      if (response) {
        Alert.alert('Success', 'A fresh verification code has been dispatched to your inbox.');
        setOtp(['', '', '', '', '', '']);
        // 🟢 Resend success hone par timer 5 minutes (300 seconds) par reset hoga
        setTimeLeft(300);
        if (inputRefs.current[0]) inputRefs.current[0].focus();
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      Alert.alert(
        'Resend Failed',
        error?.response?.data?.message || 'Could not trigger a new code. Please retry.'
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <View style={styles.mailIconCircle}>
            <FontAwesomeFreeSolid name="envelope" size={42} color={COLORS.surfaceCard} />
          </View>
          <Text style={styles.title}>Verify Your Email</Text>
          <Text style={styles.subtitle}>
            We’ll sent a 6-digit verification code to{"\n"}
            <Text style={styles.emailHighlight}>{email}</Text>
          </Text>
        </View>

        <View style={styles.formSection}>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
              />
            ))}
          </View>

          {/* <View style={styles.timerBanner}>
            <FontAwesomeFreeSolid name="clock" size={16} color={COLORS.primary} style={styles.timerIcon} />
            <Text style={styles.timerText}>Code expires in 05:00</Text>
          </View> */}

          <View style={styles.timerBanner}>
         <FontAwesomeFreeSolid 
           name="clock" 
           size={16} 
           color={timeLeft > 0 ? COLORS.primary : '#D32F2F'} 
           style={styles.timerIcon} 
         />
         <Text style={[styles.timerText, timeLeft === 0 && styles.expiredText]}>
           {timeLeft > 0 
             ? `Code expires in ${formatTime(timeLeft)}` 
             : 'Code expired! Please request a new one.'}
         </Text>
       </View>

          <Button 
            title="Verify Email" 
            onPress={handleVerify} 
            loading={loading}
            style={styles.verifyButton}
          />

          <TouchableOpacity style={[styles.resendButton, resendLoading && styles.disabledButton]}
          activeOpacity={0.8}
            onPress={handleResendOtp}
            disabled={resendLoading}
          >
            <FontAwesomeFreeSolid name="rotate" size={14} color={COLORS.primary} style={styles.resendIcon} />
            <Text style={styles.resendButtonText}>
              {resendLoading ? 'Resending...' : 'Resend Code'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.changeEmailContainer} activeOpacity={0.7} onPress={()=> navigation.navigate('SignupScreen')}>
            <Text style={styles.changeEmailText}>Change Email Address</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    width: '100%',
  },
  mailIconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: '700',
  },
  formSection: {
    width: '100%',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  otpInput: {
    width: '14%',
    height: 54,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.primary,
  },
  timerBanner: {
    flexDirection: 'row',
    backgroundColor: '#E6F4EA',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 32,
  },
  timerIcon: {
    marginRight: 10,
  },
  timerText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  verifyButton: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    width: '100%',
    height: 48,
    marginTop: 14,
  },
  resendIcon: {
    marginRight: 8,
  },
  resendButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.primary,
  },
  changeEmailContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  changeEmailText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primary,
    textDecorationLine: 'underline',
  },

  expiredText: {
  color: '#D32F2F', 
  fontWeight: '600',
},
});