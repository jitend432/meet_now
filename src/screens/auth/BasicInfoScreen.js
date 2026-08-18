import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView,
  Image, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView, 
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/vynk_t.png';
import Dropdown from '../../components/common/Dropdown';
import DatePickerInput from '../../components/common/DatePickerInput';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { CustomModal } from '../../components/common/CustomModal';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateProfileDraft } from '../../redux/slices/authSlice';
import { FONTS } from '../../constants/fonts';
//import Geolocation from 'react-native-geolocation-service';
//import { requestLocationPermission } from '../../utils/locationPermission';

const BasicInformationScreen = ({ navigation }) => {

  //const userId = useAppSelector((state) => state.auth.userId)
  //const existingUser = useAppSelector((state) => state.auth.user);

  // Modal State
const [modalConfig, setModalConfig] = useState({
  visible: false,
  title: '',
  message: '',
  type: 'warning',
});

// Modal Close Handler
const closeModal = () => {
  setModalConfig((prev) => ({ ...prev, visible: false }));
};



  const dispatch = useAppDispatch()

  const [age, setAge] = useState(''); 
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [loading, setLoading] = useState(false);

  const genderOptions = ['MALE', 'FEMALE', 'OTHER'];

  // 1. Height array generate karein (4'0" se 7'0" tak)
const heightOptions = [
  "4'0\" (122 cm)",
  "4'1\" (124 cm)",
  "4'2\" (127 cm)",
  "4'3\" (130 cm)",
  "4'4\" (132 cm)",
  "4'5\" (135 cm)",
  "4'6\" (137 cm)",
  "4'7\" (140 cm)",
  "4'8\" (142 cm)",
  "4'9\" (145 cm)",
  "4'10\" (147 cm)",
  "4'11\" (150 cm)",
  "5'0\" (152 cm)",
  "5'1\" (155 cm)",
  "5'2\" (157 cm)",
  "5'3\" (160 cm)",
  "5'4\" (163 cm)",
  "5'5\" (165 cm)",
  "5'6\" (168 cm)",
  "5'7\" (170 cm)",
  "5'8\" (173 cm)",
  "5'9\" (175 cm)",
  "5'10\" (178 cm)",
  "5'11\" (180 cm)",
  "6'0\" (183 cm)",
  "6'1\" (185 cm)",
  "6'2\" (188 cm)",
  "6'3\" (191 cm)",
  "6'4\" (193 cm)",
  "6'5\" (196 cm)",
  "6'6\" (198 cm)",
  "6'7\" (201 cm)",
  "6'8\" (203 cm)",
  "6'9\" (206 cm)",
  "6'10\" (208 cm)",
  "6'11\" (211 cm)",
  "7'0\" (213 cm)",
];
const [height, setHeight] = useState('');

 
// const handleContinue = async () => {
//     if (!age || !gender) {
//       Alert.alert('Validation Error', 'Please fill all mandatory fields (Age, Gender).');
//       return;
//     }

//     setLoading(true);
//     try {
//       const submitPayload = {
//         age: parseInt(age, 10),
//         gender: gender, 
//         bio: aboutMe,
//         fullName: fullName
//       };

//       console.log("Sending Basic Info Payload:", submitPayload);

//       const res = await authApi.submitUserDetails(submitPayload); 

//       dispatch(setUserProfile(res));
//       navigation.navigate('ProfessionalDetailsScreen');

//     } catch (error) {
//       console.error('Profile Submit API Error:', error);
//       const backendMessage = error?.response?.data?.message 
//         || error?.response?.data 
//         || error?.message 
//         || 'Something went wrong while submitting details.';

//       Alert.alert(
//         'Error', 
//         typeof backendMessage === 'string' ? backendMessage : JSON.stringify(backendMessage)
//       );
//        console.log(backendMessage)
//     } finally {
//       setLoading(false);
//     }
//   };

// 1. Clean real-time word counter
const currentWordCount = aboutMe.trim().length > 0 
  ? aboutMe.trim().split(/\s+/).filter(Boolean).length 
  : 0;


const handleAboutMeChange = (text) => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  
  // Agar word count 100 ke andar hai ya user delete (backspace) kar raha hai
  if (words.length <= 100) {
    setAboutMe(text);
  } else {
    // Agar user bada text paste kar de toh sirf pehle 100 words hi allow karein
    const trimmedTo100Words = text.split(/\s+/).slice(0, 100).join(' ');
    setAboutMe(trimmedTo100Words);
  }
};

const handleContinue = () => {
  if (!age || !gender || !height || !aboutMe.trim() || !fullName.trim() ) {
    
    setModalConfig({
      visible: true,
      type: 'warning',
      title: 'Validation Error',
      message: 'Please fill all mandatory fields.',
    });
    return;
  }

 // 2. Character Length Validation Check (Safety guard)
  if (aboutMe.length > 100) {
    setModalConfig({
      visible: true,
      type: 'warning',
      title: 'Validation Error',
      message: 'About me cannot exceed 100 characters.',
    });
    return;
  }

  const basicInfoPayload = {
    dateOfBirth: age,
    gender: gender, 
    height: height,
    bio: aboutMe.trim(),     
    fullName: fullName.trim()
  };

  console.log("Saving Basic Info to Redux Profile Draft:", basicInfoPayload);

  dispatch(updateProfileDraft(basicInfoPayload));
  navigation.navigate('ProfessionalDetailsScreen');
};


  return (
    <SafeAreaView style={styles.safeArea}>

      <KeyboardAvoidingView 
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
  >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled" 
        automaticallyAdjustKeyboardInsets={true}
        nestedScrollEnabled={true}
      >
               
        <View style={styles.cardWrapper}>

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

          {/* Linear Progress Metric Indicator */}
          <View style={styles.progressWrapper}>

            <View style={styles.progressTextRow}>
              <Text style={styles.progressStepLabel}>Step 1 of 6</Text>
              <Text style={styles.progressPercentageMetric}>35%</Text>
            </View>
            
            <View style={styles.progressTrackBackground}>
              <View style={[styles.progressTrackFill, { width: '35%' }]} />
            </View>

          </View>

          {/* Step Typography Callouts */}
          <Text style={styles.mainStepTitle}>Basic Information</Text>

          {/* Input Fields Area */}
          <View style={styles.formSection}>
            

             <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              style={styles.formFieldShadow}
            />

            <DatePickerInput
             label="Date of Birth"
             placeholder="Select date of birth"
             value={age}
             onSelectDate={setAge}
             icon={<FontAwesomeFreeSolid name="calendar-alt" size={18} color={COLORS.logoBg} />}
             style={styles.formFieldShadow}
           />

             <Dropdown
              label="Height"
              placeholder="Select your height"
              data={heightOptions}
              value={height}
              onSelect={(selectedHeight) => setHeight(selectedHeight)}
              // style={styles.formFieldShadow}
              style={[styles.formFieldShadow, { zIndex: 1000 }]}
            />

            {/* Reusable Dropdown for Gender */}
            <Dropdown
              label="Gender"
              placeholder="Select gender"
              data={genderOptions}
              value={gender}
              onSelect={(selectedValue) => setGender(selectedValue)}
              // style={styles.formFieldShadow}
              style={[styles.formFieldShadow, { zIndex: 1000 }]}
            />

            {/* <Input
              label="About me"
              placeholder="Tell us about yourself..."
              value={aboutMe}
              onChangeText={setAboutMe}
              multiline={true}
              numberOfLines={4}
              inputStyle={styles.textAreaHeight}
              style={styles.formFieldShadow}
            /> */}

           <View style={{ width: '100%' }}>
             <Input
               label="About me"
               placeholder="Tell us about yourself..."
               value={aboutMe}
               onChangeText={setAboutMe}
               maxLength={100}
               multiline={true}
               numberOfLines={3}
               inputStyle={styles.textAreaHeight}
               style={styles.formFieldShadow}
             />
             <Text style={[styles.counterText, aboutMe.length >= 100 && { color: '#FF3333' }]}>
               {aboutMe.length}/100
             </Text>
           </View>

            <View style={styles.navigationControlRow}>
              <TouchableOpacity 
                activeOpacity={0.7} 
                onPress={() => navigation.goBack()}
                style={styles.backButtonTouchTarget}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              <Button 
                title="Continue" 
                onPress={handleContinue} 
                loading={loading}
                style={styles.continueActionButton}
              />
            </View>

          </View>
        </View>

      </ScrollView>
      </KeyboardAvoidingView>
      <CustomModal
        visible={modalConfig.visible}
        onClose={closeModal}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        dismissable={true}
      />
    </SafeAreaView>
  );
};

export default BasicInformationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background, 
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    //justifyContent: 'center',
  },
  cardWrapper: {
    backgroundColor: COLORS.background, 
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    height:'auto',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  headerContainer: {
    marginBottom: 16,
    width: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoStyle: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primary,
  },
  progressWrapper: {
    marginBottom: 24,
    width: '100%',
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressStepLabel: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  progressPercentageMetric: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  progressTrackBackground: {
    height: 6,
    backgroundColor: '#cce3cc', 
    borderRadius: 3,
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  mainStepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 20,
  },
  formSection: {
    width: '100%',
  },
  formFieldShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  textAreaHeight: {
    //height: 100,
    textAlignVertical: 'top', 
    paddingTop: 12,
    minHeight: 120
  },
  navigationControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', 
    paddingTop: 20,
    width: '100%',
  },
  backButtonTouchTarget: {
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  continueActionButton: {
    width: '45%', 
    marginVertical: 0,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  counterText: {
  fontSize: 12,
  color: '#666666',
  textAlign: 'right',
  marginTop: -10,
  marginBottom: 16,
  marginRight: 4,
  fontFamily: FONTS.REGULAR
},
});