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
import { COLORS } from '../../constants/theme';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LogoImage from '../../assets/images/vynk_t.png';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import Dropdown from '../../components/common/Dropdown';

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { authApi } from '../../services/authApi';
import { setUserProfile } from '../../redux/slices/authSlice';
import { updateProfileDraft } from '../../redux/slices/authSlice';

const ProfessionalDetailsScreen = ({ navigation }) => {
  
  const dispatch = useAppDispatch()
  const existingUser = useAppSelector((state) => state.auth.user  ||  state.auth.userProfile);

  const [occupation, setOccupation] = useState('');
  const [education, setEducation] = useState('');
  const [loading, setLoading] = useState(false);
 // const educationOptions = ['UNDERGRADUATE','GRADUATE','POSTGRADUATE','DOCTORATE','TRADE_SCHOOL','OTHER'];

 const educationOptions = [
  { label: 'Undergraduate', value: 'UNDERGRADUATE' },
  { label: 'Graduate', value: 'GRADUATE' },
  { label: 'Postgraduate', value: 'POSTGRADUATE' },
  { label: 'Doctorate', value: 'DOCTORATE' },
  { label: 'Trade School', value: 'TRADE_SCHOOL' },
  { label: 'Other', value: 'OTHER' },
];


//   const handleContinue = async () => {
//   if (!occupation.trim()) {
//     Alert.alert('Validation Error', 'Please enter your occupation.');
//     return;
//   }
//   if (!education) {
//     Alert.alert('Validation Error', 'Please select your educational level.');
//     return;
//   }

//   setLoading(true);
//   try {
//     const submitPayload = {
//       ...existingUser,               
//       occupation: occupation.trim(), 
//       education: education,          
//     };

//     console.log("Posting New Professional Details:", submitPayload);

//     const responseData = await authApi.submitUserDetails(submitPayload); 

//     dispatch(setUserProfile(responseData));
//     navigation.navigate('YourInterestScreen');

//   } catch (error) {
//     console.error('Professional Details Submit Error:', error);
//     Alert.alert(
//       'Submission Failed', 
//       error?.response?.data?.message || 'Something went wrong while saving professional details.'
//     );
//   } finally {
//     setLoading(false);
//   }
// };


const handleContinue = () => {
  if (!occupation.trim()) {
    Alert.alert('Validation Error', 'Please enter your occupation.');
    return;
  }
  if (!education) {
    Alert.alert('Validation Error', 'Please select your educational level.');
    return;
  }

  const professionalPayload = {
    occupation: occupation.trim(), 
    education: education
  };

  console.log("Saving Professional Details to Redux Profile Draft:", professionalPayload);

  dispatch(updateProfileDraft(professionalPayload));
  navigation.navigate('YourInterestScreen');
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* Floating Card Wrapper */}
        <View style={styles.cardWrapper}>

          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.logoRow}>
              <Image source={LogoImage} style={styles.logoStyle} resizeMode="contain" />
              <Text style={styles.brandName}>Complete Your Profile</Text>
            </View>
          </View>

          {/* Progress Bar (Step 4 of 5 - 75%) */}
          <View style={styles.progressWrapper}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressStepLabel}>Step 2 of 6</Text>
              <Text style={styles.progressPercentageMetric}>55%</Text>
            </View>
            <View style={styles.progressTrackBackground}>
              <View style={[styles.progressTrackFill, { width: '55%' }]} />
            </View>
          </View>

          {/* Title */}
          <Text style={styles.mainStepTitle}>Professional Details</Text>

          {/* Form Section */}
          <View style={styles.formSection}>
            
            {/* Occupation Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <FontAwesomeFreeSolid name="briefcase" size={16} color={COLORS.primary} />
                <Text style={styles.inputLabel}>Occupation</Text>
              </View>
              <Input
                placeholder="Enter your occupation"
                value={occupation}
                onChangeText={setOccupation}
                style={styles.formFieldShadow}
              />
            </View>

            {/* Education Selector */}
            {/* <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <FontAwesomeFreeSolid name="graduation-cap" size={16} color={COLORS.primary} />
                <Text style={styles.inputLabel}>Education</Text>
              </View>

               <Dropdown
              //label="Education"
              placeholder="Select education"
              data={educationOptions}
              value={education}
              onSelect={(selectedValue) => setEducation(selectedValue)}
              style={styles.formFieldShadow}
            />
            </View> */}

            {/* Education Selector */}
           <View style={styles.inputGroup}>
             <View style={styles.labelRow}>
               <FontAwesomeFreeSolid name="graduation-cap" size={16} color={COLORS.primary} />
               <Text style={styles.inputLabel}>Education</Text>
             </View>
           
             <Dropdown
               placeholder="Select education"
               data={educationOptions}
               value={education}
               onSelect={(selectedItem) => setEducation(selectedItem.value || selectedItem)}
               style={styles.formFieldShadow}
             />
           </View>

           

            {/* Navigation Buttons */}
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

export default ProfessionalDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 24,
    justifyContent: 'center',
  },
  cardWrapper: {
    backgroundColor: COLORS.background, // Cream background from your theme
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    minHeight: '80%',
    // Card Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  headerContainer: {
    marginBottom: 16,
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
    backgroundColor: '#cce3cc', // Lighter green track
    borderRadius: 3,
  },
  progressTrackFill: {
    height: '100%',
    backgroundColor: COLORS.primary, // Dark green fill
    borderRadius: 3,
  },
  mainStepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 20,
  },
  formSection: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 10,
  },
  formFieldShadow: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  navigationControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto', // Pushes buttons to bottom of the card
    paddingTop: 20,
  },
  backButtonTouchTarget: {
    paddingVertical: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.primary,
  },
  continueActionButton: {
    width: '48%',
    marginVertical: 0,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});