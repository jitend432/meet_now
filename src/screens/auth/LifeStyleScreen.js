import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert 
} from 'react-native';
import { ChipButton } from '../../components/common/ChipButton';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { authApi } from '../../services/authApi';
import { setUserProfile } from '../../redux/slices/authSlice';
import { updateProfileDraft } from '../../redux/slices/authSlice';

export default function LifestyleScreen({navigation}) {

  const dispatch = useAppDispatch();
  const existingUser = useAppSelector((state) => state.auth.user || state.auth.userProfile);
  
  const [selectedDrinking, setSelectedDrinking] = useState(null);
  const [selectedSmoking, setSelectedSmoking] = useState(null);
  const [loading, setLoading] = useState(false);

  // const handleComplete = async () => {
  //   if (!selectedDrinking) {
  //     Alert.alert('Validation Error', 'Please select your drinking habit.');
  //     return;
  //   }
  //   if (!selectedSmoking) {
  //     Alert.alert('Validation Error', 'Please select your smoking habit.');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const submitPayload = {
  //       ...existingUser,
  //       drinking: selectedDrinking,
  //       smoking: selectedSmoking
  //     };

  //     console.log("Posting Lifestyle Details:", submitPayload);

  //     const responseData = await authApi.submitUserDetails(submitPayload); 

  //     dispatch(setUserProfile(responseData));
  //     navigation.navigate('InterestedInScreen');

  //   } catch (error) {
  //     console.error('Lifestyle Details Submit Error:', error);
      
  //     const backendMessage = error?.response?.data?.message 
  //       || error?.response?.data 
  //       || error?.message 
  //       || 'Something went wrong while saving lifestyle data.';

  //     Alert.alert(
  //       'Submission Failed', 
  //       typeof backendMessage === 'string' ? backendMessage : JSON.stringify(backendMessage)
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  
  
  const drinkingOptions = [
   'YES',
  'I_DRINK_SOMETIMES',
  'I_RARELY_DRINK',
  'NO',
  'I_AM_SOBER'
  ];

  const smokingOptions = [
  'YES',
  'NO',
  'I_SMOKE',
  'I_SMOKE_SOMETIMES',
  'I_DONT_SMOKE',
  'I_AM_TRYING_TO_QUIT'
  ];

  const handleComplete = () => {
  if (!selectedDrinking) {
    Alert.alert('Validation Error', 'Please select your drinking habit.');
    return;
  }
  if (!selectedSmoking) {
    Alert.alert('Validation Error', 'Please select your smoking habit.');
    return;
  }

  const lifestylePayload = {
    drinkingHabit:  selectedDrinking,
    smokingHabit: selectedSmoking
  };

  console.log("Saving Lifestyle Details to Redux Profile Draft:", lifestylePayload);

  dispatch(updateProfileDraft(lifestylePayload));
  navigation.navigate('InterestedInScreen');
};
  
  

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.cardContainer}>
        
        {/* Header Section with Image Logo */}
        <View style={styles.headerRow}>
          <Image 
            source={require('../../assets/images/hexadating.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
        </View>

        {/* Progress Bar Area */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressSub}>Step 4 of 5</Text>
            <Text style={styles.progressPercent}>75%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>

        {/* Titles */}
        <Text style={styles.mainTitle}>Lifestyle and habits</Text>
        <Text style={styles.subTitle}>Share your habits</Text>

        {/* --- Drinking Section --- */}
        <Text style={styles.sectionHeading}>Drinking</Text>
        <View style={styles.chipGrid}>
          {drinkingOptions.map((option) => {
            const isSelected = selectedDrinking === option;
            return (
              <ChipButton
                key={option}
                label={option}
                onPress={() => setSelectedDrinking(option)}
                icon={
                  <FontAwesomeFreeSolid 
                    name={isSelected ? "check" : "plus"} 
                    size={16} 
                    color="#1b4d22" 
                  />
                }
                containerStyle={[
                  styles.customChip,
                  isSelected && styles.selectedChipBackground
                ]}
              />
            );
          })}
        </View>

        {/* --- Smoking Section --- */}
        <Text style={styles.sectionHeading}>Smoking</Text>
        <View style={styles.chipGrid}>
          {smokingOptions.map((option) => {
            const isSelected = selectedSmoking === option;
            return (
              <ChipButton
                key={option}
                label={option}
                onPress={() => setSelectedSmoking(option)}
                icon={
                  <FontAwesomeFreeSolid 
                    name={isSelected ? "check" : "plus"} 
                    size={16} 
                    color="#1b4d22" 
                  />
                }
                containerStyle={[
                  styles.customChip,
                  isSelected && styles.selectedChipBackground
                ]}
              />
            );
          })}
        </View>

        {/* --- Bottom Navigation Footer --- */}
        <View style={styles.footerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.completeButton} 
            onPress={handleComplete}
            disabled={loading}
          >
            <Text style={styles.completeButtonText}>
              {loading ? "Saving..." : "Complete"}
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: '#fef6d1', 
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    height: '80%'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 40,  
    height: 40,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1b4d22',
    marginLeft: 8,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressSub: {
    fontSize: 14,
    color: '#1b4d22',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    color: '#1b4d22',
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#cce3cc',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1b4d22',
    borderRadius: 3,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1b4d22',
    marginBottom: 4,
  },
  subTitle: {
    fontSize: 16,
    color: '#1b4d22',
    opacity: 0.8,
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1b4d22',
    marginBottom: 12,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    gap: 10,          
    marginBottom: 28,
  },
  customChip: {
    backgroundColor: '#ffffff',
    borderColor: '#1b4d22',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  selectedChipBackground: {
    backgroundColor: '#e2f0d9', 
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1b4d22',
    padding: 8,
  },
  completeButton: {
    backgroundColor: '#1b4d22',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});