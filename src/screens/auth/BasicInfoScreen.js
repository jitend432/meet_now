import React, { useState, useEffect } from 'react';
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
import { COLORS } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/vynk_t.png';
import Dropdown from '../../components/common/Dropdown';
import DatePickerInput from '../../components/common/DatePickerInput';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateProfileDraft } from '../../redux/slices/authSlice';
//import Geolocation from 'react-native-geolocation-service';
//import { requestLocationPermission } from '../../utils/locationPermission';

const BasicInformationScreen = ({ navigation }) => {

  //const userId = useAppSelector((state) => state.auth.userId)
  //const existingUser = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch()

  const [age, setAge] = useState(''); 
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [loading, setLoading] = useState(false);

  const genderOptions = ['MALE', 'FEMALE', 'OTHERS'];

 
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

const handleContinue = () => {
  if (!age || !gender || !aboutMe || !fullName ) {
    Alert.alert('Validation Error', 'Please fill all mandatory fields.');
    return;
  }

  const basicInfoPayload = {
    dateOfBirth: age,
    gender: gender, 
    bio: aboutMe,     
    fullName: fullName
  };

  console.log("Saving Basic Info to Redux Profile Draft:", basicInfoPayload);

  dispatch(updateProfileDraft(basicInfoPayload));
  navigation.navigate('ProfessionalDetailsScreen');
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
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
              <Text style={styles.progressStepLabel}>Step 3 of 8</Text>
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

            {/* <Input
              label="Age"
              placeholder="Enter your age"
              value={age}
              onChangeText={setAge}
              keyboardType="number-pad"
              style={styles.formFieldShadow}
            /> */}

            <DatePickerInput
             label="Date of Birth"
             placeholder="Select date of birth"
             value={age}
             onSelectDate={setAge}
             icon={<FontAwesomeFreeSolid name="calendar-alt" size={18} color={COLORS.logoBg} />}
             style={styles.formFieldShadow}
           />

            {/* Gender Selector - Dropdown UI Action Wrap */}
            {/* <TouchableOpacity 
              activeOpacity={0.9} 
              onPress={() => console.log('Open Gender Dropdown / Picker Sheet')}
            >
              <View pointerEvents="none">
                <Input
                  label="Gender"
                  placeholder="Select gender"
                  value={gender}
                  editable={true}
                  style={styles.formFieldShadow}
                  icon={<FontAwesomeFreeSolid name="chevron-down" size={14} color={COLORS.logoBg} />}
                />
              </View>
            </TouchableOpacity> */}

            {/* Reusable Dropdown for Gender */}
            <Dropdown
              label="Gender"
              placeholder="Select gender"
              data={genderOptions}
              value={gender}
              onSelect={(selectedValue) => setGender(selectedValue)}
              style={styles.formFieldShadow}
            />

            <Input
              label="About me"
              placeholder="Tell us about yourself..."
              value={aboutMe}
              onChangeText={setAboutMe}
              multiline={true}
              numberOfLines={4}
              inputStyle={styles.textAreaHeight}
              style={styles.formFieldShadow}
            />

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
    justifyContent: 'center',
  },
  cardWrapper: {
    backgroundColor: COLORS.background, 
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 24,
    height:'auto',
    
    // Drop shadow configuration separating the container view layer
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
    height: 100,
    textAlignVertical: 'top', 
    paddingTop: 12,
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
});