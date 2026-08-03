import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/common/Button';
import { COLORS } from '../../constants/theme';
import { FONTS } from '../../constants/fonts';

import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { authApi } from '../../services/authApi';
import { setUserProfile, updateProfileDraft } from '../../redux/slices/authSlice';


const YourInterestScreen = ({ navigation }) => {

  const dispatch = useAppDispatch();
  const existingUser = useAppSelector((state) => state.auth.user || state.auth.userProfile);
  
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [loading, setLoading] = useState(false);

  const INTERESTS_DATA = [
  { id: '1', name: 'Travel' },
  { id: '2', name: 'Music' },
  { id: '3', name: 'Movies' },
  { id: '4', name: 'Fitness' },
  { id: '5', name: 'Sports' },
  { id: '6', name: 'Cricket' },
  { id: '7', name: 'Football' },
  { id: '8', name: 'Basketball' },
  { id: '9', name: 'Reading' },
  { id: '10', name: 'Gaming' },
  { id: '11', name: 'Cooking' },
  { id: '12', name: 'Photography' },
  { id: '13', name: 'Dancing' },
  { id: '14', name: 'Hiking' },
  { id: '15', name: 'Camping' },
  { id: '16', name: 'Swimming' },
  { id: '17', name: 'Cycling' },
  { id: '18', name: 'Yoga' },
  { id: '19', name: 'Art' },
  { id: '20', name: 'Fashion' },
  { id: '21', name: 'Technology' },
  { id: '22', name: 'Pets' },
  { id: '23', name: 'Food' },
  { id: '24', name: 'Writing' },
  { id: '25', name: 'Volunteering' },
  { id: '26', name: 'Entrepreneurship' },
  { id: '27', name: 'Investing' },
  { id: '28', name: 'Anime' },
  { id: '29', name: 'Concerts' },
  { id: '30', name: 'Nightlife' },
];

  const toggleInterest = (id) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter(interestId => interestId !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  // const handleComplete = async () => {
  //   if (selectedInterests.length < 5) {
  //     Alert.alert('Validation Error', 'Please select at least 5 interests.');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const selectedNames = INTERESTS_DATA
  //       .filter(item => selectedInterests.includes(item.id))
  //       .map(item => item.name.toUpperCase());

  //     const submitPayload = {
  //       ...existingUser,
  //       interests: selectedNames
  //     };

  //     console.log("Posting Interests Payload:", submitPayload);

  //     const responseData = await authApi.submitUserDetails(submitPayload);

  //     dispatch(setUserProfile(responseData));
  //     navigation.navigate('LifeStyleScreen');

  //   } catch (error) {
  //     console.error('Interests Submission Error:', error);
  //     console.log(error?.response?.data?.message)
  //     Alert.alert(
  //       'Submission Failed',
  //       error?.response?.data?.message || 'Something went wrong while saving your interests.'
        
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleComplete = () => {
  if (selectedInterests.length < 5) {
    Alert.alert('Validation Error', 'Please select at least 5 interests.');
    return;
  }

  const selectedNames = INTERESTS_DATA
    .filter(item => selectedInterests.includes(item.id))
    .map(item => item.name.toUpperCase());

  const interestsPayload = {
    interests: selectedNames
  };

  console.log("Saving Interests to Redux Profile Draft:", interestsPayload);

  dispatch(updateProfileDraft(interestsPayload));
  navigation.navigate('LifeStyleScreen');
};

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardContainer}>
          {/* Header Row */}
          <View style={styles.headerRow}>
            {/* Custom Icon Placeholder matching the image icon */}
            <View style={styles.iconContainer}>
              <View style={styles.heartIconShape} />
            </View>
            <Text style={styles.cardTitle}>Complete Your Profile</Text>
          </View>

          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressStep}>Step 5 of 5</Text>
              <Text style={styles.progressPercentage}>75%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View style={styles.progressBarFill} />
            </View>
          </View>

          {/* Section Heading */}
          <Text style={styles.sectionTitle}>Your Interests</Text>
          <Text style={styles.sectionSubtitle}>Select at least 5 interests</Text>

          {/* Interests Grid Layout */}
          <View style={styles.gridContainer}>
            {INTERESTS_DATA.map((item) => {
              const isSelected = selectedInterests.includes(item.id);
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.8}
                  style={[
                    styles.interestChip,
                    isSelected ? styles.chipSelected : styles.chipUnselected
                  ]}
                  onPress={() => toggleInterest(item.id)}
                >
                  <Text 
                    style={[
                      styles.chipText, 
                      isSelected ? styles.textSelected : styles.textUnselected
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom Action Bar */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => navigation?.goBack()}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Button 
              title="Complete" 
              onPress={handleComplete} 
              loading={loading}
              style={styles.completeButton}
              
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default YourInterestScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white, 
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  cardContainer: {
    backgroundColor: '#fbf5db', // Off-yellow card tint from image
    borderRadius: 24,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
    height:'auto'
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#265c32', // Dark green matching the theme
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  heartIconShape: {
    width: 14,
    height: 14,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    marginTop: 2,
  },
  cardTitle: {
    fontSize: 22,
    color: '#265c32',
    fontFamily: FONTS.SEMIBOLD
  },
  progressContainer: {
    marginBottom: 28,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressStep: {
    fontSize: 12,
    fontWeight: '600',
    color: '#265c32',
  },
  progressPercentage: {
    fontSize: 12,
    fontWeight: '600',
    color: '#265c32',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#e1d9b7',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: '100%', 
    height: '100%',
    backgroundColor: '#265c32',
  },
  sectionTitle: {
    fontSize: 24,
    color: '#265c32',
    marginBottom: 4,
    fontFamily: FONTS.MEDIUM
  },
  sectionSubtitle: {
    fontSize: 15,
    color: '#4f7755',
    fontWeight: '500',
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  interestChip: {
    width: '47%',
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  chipSelected: {
    backgroundColor: '#265c32',
    borderColor: '#265c32',
  },
  chipUnselected: {
    backgroundColor: '#ffffff',
    borderColor: '#265c32',
  },
  chipText: {
    fontSize: 16,
    fontWeight: '600',
  },
  textSelected: {
    color: '#ffffff',
  },
  textUnselected: {
    color: '#265c32',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#265c32',
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  completeButton: {
    width: '48%',
    backgroundColor: '#265c32',
    marginTop: 0, // Reset default spacing from login layout if needed
  },
  footerHintText: {
    marginTop: 20,
    color: '#cccccc',
    fontSize: 16,
    letterSpacing: 2,
    fontWeight: '600',
  },
});