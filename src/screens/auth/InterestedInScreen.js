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

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { updateProfileDraft } from '../../redux/slices/authSlice';
import { COLORS } from '../../constants/theme';

export default function InterestedInScreen({navigation}) {

  const dispatch = useAppDispatch();
  const existingUser = useAppSelector((state) => state.auth.user || state.auth.userProfile);
     
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [loading, setLoading] = useState(false);

  const interestOptions = [
    'Men',
    'Women',
    'Other'
  ];

  const handleComplete = () => {
  if (!selectedInterest) {
    Alert.alert('Validation Error', 'Please select who you are interested in.');
    return;
  }

  const formattedInterest = selectedInterest === 'Women' ? 'WOMEN' : selectedInterest.toUpperCase();

  const interestedInPayload = {
    lookingFor: formattedInterest
  };

  console.log("Saving Interested In Details to Redux Profile Draft:", interestedInPayload);

  dispatch(updateProfileDraft(interestedInPayload));
  navigation.navigate('LanguageSelectionScreen');
};

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.cardContainer}>
        
        {/* Header Section with Image Logo */}
        <View style={styles.headerRow}>
          <Image 
            source={require('../../assets/images/vynk_t.png')} 
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>Complete Your Profile</Text>
        </View>

        {/* Progress Bar Area */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressSub}>Step 5 of 6</Text>
            <Text style={styles.progressPercent}>75%</Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: '75%' }]} />
          </View>
        </View>

        {/* Titles for Target Profile Matching */}
        <Text style={styles.mainTitle}>Who Are You Interested In?</Text>
        <Text style={styles.subTitle}>Select your preferred match type.</Text>

        {/* --- Interest Options Stack --- */}
        <View style={styles.verticalChipStack}>
          {interestOptions.map((option) => {
            const isSelected = selectedInterest === option;
            return (
              <ChipButton
                key={option}
                label={option}
                onPress={() => setSelectedInterest(option)}
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
                labelStyle={styles.chipTextLeft}
              />
            );
          })}
        </View>

        <View style={styles.footerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.completeButton} 
            //style={[styles.completeButton, loading && { opacity: 0.7 }]}
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
    backgroundColor: COLORS.background,
    padding: 16,
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: COLORS.background, 
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    height: '80%',
    justifyContent: 'space-between', 
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
  verticalChipStack: {
    flexDirection: 'column',
    gap: 14, // Vertical gap spacing configuration
    marginBottom: 'auto', // Pushes layout flow tightly to top section
  },
  customChip: {
    backgroundColor: '#ffffff',
    borderColor: '#1b4d22',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '60%', // Gives the clean, restricted horizontal width width seen in your mockups
    flexDirection: 'row',
    justifyContent: 'space-between', // Ensures label is on left and plus/check stays fixed on right
    alignItems: 'center',
    
    // Shadow settings to match the unique drop-glow under your selections
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chipTextLeft: {
    marginRight: 0, 
    textAlign: 'left',
    flex: 1,
  },
  selectedChipBackground: {
    backgroundColor: '#e2f0d9', 
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
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