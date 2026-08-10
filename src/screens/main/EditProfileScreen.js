import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { FontAwesomeFreeSolid } from '@react-native-vector-icons/fontawesome-free-solid/static';
import DatePickerInput from '../../components/common/DatePickerInput';

import { FONTS } from '../../constants/fonts';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
//import { COLORS } from '../../constants/theme';
import { COLORS } from '../../constants/theme';

// Import authApi (Path apne project structure ke hisab se verify kar lena)
import { authApi } from '../../services/authApi';
import { useAppSelector } from '../../redux/hooks';

const SCREEN_WIDTH = Dimensions.get('window').width;
const THEME_GREEN = '#0B5324';

// const [age, setAge] = useState(''); 

const EditProfileScreen = ({ navigation, route }) => {
  // Extract registrationId passed from route or default

  const registrationId = useAppSelector((state) => state.auth.userId )
  console.log("Edit profile regId ",registrationId)

  const [profileData, setProfileData] = useState({
    fullName: 'Jitendra Pratap',
    gender: 'MALE',
    //age: '2002-08-08',
    bio: 'Tech enthusiast who loves travelling and photography.',
    occupation: 'Software Engineer',
    //height: "5'10\"",
    education: 'UNDERGRADUATE',
    interests: ['TRAVEL', 'MUSIC', 'MOVIES', 'SPORTS'],
    drinkingHabit: 'YES',
    smokingHabit: 'I_SMOKE_SOMETIMES',
    hopingToFind: 'A_LONG_TERM_RELATIONSHIP',
    lookingFor: 'MEN',
    images: [
      { id: '1', uri: 'https://i.pravatar.cc/300?u=a042581f4e29026704d' },
      { id: '2', uri: 'https://i.pravatar.cc/300?u=a042581f4e29026704a' },
      { id: '3', uri: 'https://i.pravatar.cc/300?u=a042581f4e29026704e' },
      { id: '4', uri: 'https://i.pravatar.cc/300?u=a042581f4e29026704r' },
    ],
  });

  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState(''); 

  const handleUpdate = (key, value) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  // const onSave = async () => {
  //   try {
  //     setIsLoading(true);

  //     const payload = {
  //       fullName: profileData.fullName,
  //       gender: profileData.gender,
  //       dateOfBirth: age || '2002-08-08',
  //       bio: profileData.bio,
  //       occupation: profileData.occupation,
  //       //height: profileData.height,
  //       education: profileData.education,
  //       interests: profileData.interests,
  //       drinkingHabit: profileData.drinkingHabit,
  //       smokingHabit: profileData.smokingHabit,
  //       hopingToFind: profileData.hopingToFind,
  //       lookingFor: profileData.lookingFor,
  //     };

  //     // Direct call to authApi.updateProfile
  //     const response = await authApi.updateProfile(registrationId, payload);
      
  //     Alert.alert('Success', 'Profile updated successfully!', [
  //       { text: 'OK', onPress: () => navigation.navigate('ProfileScreen') }
  //     ]);
  //   } catch (error) {
  //     console.error('Update Profile Error:', error);
  //     Alert.alert(
  //       'Error',
  //       error?.response?.data?.message || error?.message || 'Failed to update profile.'
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


//     const onSave = async () => {
//   try {
//     setIsLoading(true);

//     const payload = {
//       fullName: profileData.fullName,
//       gender: profileData.gender,
//       dateOfBirth: age || '2002-08-08',
//       bio: profileData.bio,
//       occupation: profileData.occupation,
//       education: profileData.education,
//       interests: profileData.interests,
//       drinkingHabit: profileData.drinkingHabit,
//       smokingHabit: profileData.smokingHabit,
//       hopingToFind: profileData.hopingToFind,
//       lookingFor: profileData.lookingFor,
//     };

//     console.log("👉 PAYLOAD BEING SENT:", payload);

//     // API call ka response variable mein capture karein
//     const response = await authApi.updateProfile(registrationId, payload);
    
//     // Yahan terminal/console mein response dekhein
//     console.log("✅ API RESPONSE RECEIVED:", JSON.stringify(response, null, 2));

//     Alert.alert('Success', 'Profile updated successfully!', [
//       { text: 'OK', onPress: () => navigation.navigate('ProfileScreen') }
//     ]);
//   } catch (error) {
//     console.error('❌ Update Profile Error:', error);
//     // Error object ka detailed response print karein
//     console.log('❌ ERROR RESPONSE DATA:', error?.response?.data);
    
//     Alert.alert(
//       'Error',
//       error?.response?.data?.message || error?.message || 'Failed to update profile.'
//     );
//   } finally {
//     setIsLoading(false);
//   }
// };

const onSave = async () => {
  try {
    setIsLoading(true);

    const payload = {
      fullName: profileData.fullName,
      gender: profileData.gender,
      dateOfBirth: age || '2000-01-01',
      bio: profileData.bio,
      occupation: profileData.occupation,
      education: profileData.education,
      interests: profileData.interests,
      drinkingHabit: profileData.drinkingHabit,
      smokingHabit: profileData.smokingHabit,
      hopingToFind: profileData.hopingToFind,
      lookingFor: profileData.lookingFor,
    };

    console.log("👉 PAYLOAD BEING SENT:", payload);

    // Call update API
    const response = await authApi.updateProfile(registrationId, payload);
    
    console.log("✅ API RESPONSE RECEIVED:", response);

    Alert.alert('Success', 'Profile updated successfully!', [
      { text: 'OK', onPress: () => navigation.navigate('ProfileScreen') }
    ]);
  } catch (error) {
    console.error('❌ Update Profile Error:', error);
    console.log('❌ ERROR RESPONSE DATA:', error?.response?.data);

    Alert.alert(
      'Error',
      error?.response?.data?.message || error?.message || 'Failed to update profile.'
    );
  } finally {
    setIsLoading(false);
  }
};


  const removeInterest = (itemToRemove) => {
    setProfileData((prev) => ({
      ...prev,
      interests: prev.interests.filter((item) => item !== itemToRemove),
    }));
  };

  const PHOTO_SIZE = (SCREEN_WIDTH - 64) / 5;

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIconButton} onPress={() => navigation.navigate('ProfileScreen')}>
          <FontAwesomeFreeSolid name="arrow-left" size={18} color={THEME_GREEN} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={styles.headerIconButton} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: profileData.images[0]?.uri }} style={styles.mainAvatar} />
            <TouchableOpacity style={styles.editBadge}>
              <FontAwesomeFreeSolid name="pen" size={10} color="#FFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.changePhotoButton} onPress={()=>navigation.navigate('AddPhotosScreen')}>
            <FontAwesomeFreeSolid name="camera" size={14} color={THEME_GREEN} />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* 1. Full Name */}
        <Input
          label="Full Name"
          value={profileData.fullName}
          onChangeText={(text) => handleUpdate('fullName', text)}
          icon={<FontAwesomeFreeSolid name="user" size={18} color={THEME_GREEN} />}
        />

        {/* 2. Gender */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Gender</Text>
          <View style={styles.optionsRow}>
            {['MALE', 'FEMALE', 'OTHER'].map((g) => {
              const isSelected = profileData.gender === g;
              return (
                <TouchableOpacity
                  key={g}
                  onPress={() => handleUpdate('gender', g)}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                >
                  <FontAwesomeFreeSolid
                    name={g === 'MALE' ? 'mars' : g === 'FEMALE' ? 'venus' : 'genderless'}
                    size={14}
                    color={isSelected ? '#FFF' : THEME_GREEN}
                  />
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{g}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. Date of Birth */}
        {/* <Input
          label="Date of Birth"
          value={profileData.dateOfBirth}
          placeholder="YYYY-MM-DD"
          onChangeText={(text) => handleUpdate('dateOfBirth', text)}
          icon={<FontAwesomeFreeSolid name="calendar-days" size={18} color={THEME_GREEN} />}
        /> */}

        <DatePickerInput
           label="Date of Birth"
           placeholder="Select date of birth"
           value={age}
           onSelectDate={setAge}
           icon={<FontAwesomeFreeSolid name="calendar-alt" size={18} color={COLORS.logoBg} />}
           style={styles.formFieldShadow}
         />

        {/* 4. Bio */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Bio</Text>
          <View style={styles.aboutWrapper}>
            <TouchableOpacity style={styles.aboutEditIcon}>
              <FontAwesomeFreeSolid name="pen" size={14} color="#666" />
            </TouchableOpacity>
            <Input
              value={profileData.bio}
              onChangeText={(text) => handleUpdate('bio', text)}
              multiline
              numberOfLines={3}
              maxLength={250}
              style={styles.aboutInputStyle}
            />
            <Text style={styles.charCounter}>{profileData.bio.length}/250</Text>
          </View>
        </View>

        {/* 5. Occupation */}
        <Input
          label="Occupation"
          value={profileData.occupation}
          onChangeText={(text) => handleUpdate('occupation', text)}
          icon={<FontAwesomeFreeSolid name="briefcase" size={18} color={THEME_GREEN} />}
        />

        {/* 6. Height */}
        {/* <Input
          label="Height"
          value={profileData.height}
          placeholder="e.g. 5'10\"
          onChangeText={(text) => handleUpdate('height', text)}
          icon={<FontAwesomeFreeSolid name="ruler-vertical" size={18} color={THEME_GREEN} />}
        /> */}

        {/* 7. Education */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Education</Text>
          <View style={styles.optionsRow}>
            {['HIGH_SCHOOL', 'UNDERGRADUATE', 'POSTGRADUATE'].map((edu) => {
              const isSelected = profileData.education === edu;
              return (
                <TouchableOpacity
                  key={edu}
                  onPress={() => handleUpdate('education', edu)}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                >
                  <FontAwesomeFreeSolid name="graduation-cap" size={14} color={isSelected ? '#FFF' : THEME_GREEN} />
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {edu.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 8. Interests */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Interests</Text>
          <View style={styles.chipsContainer}>
            {profileData.interests.map((interest) => (
              <View key={interest} style={styles.interestChip}>
                <Text style={styles.interestText}>{interest}</Text>
                <TouchableOpacity onPress={() => removeInterest(interest)}>
                  <FontAwesomeFreeSolid name="xmark" size={12} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addMoreButton}>
              <Text style={styles.addMoreText}>+ Add More</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Photos List */}
        {/* <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Photos</Text>
          <View style={styles.photosGrid}>
            <TouchableOpacity style={[styles.addPhotoCard, { width: PHOTO_SIZE, height: PHOTO_SIZE }]}>
              <FontAwesomeFreeSolid name="plus" size={18} color="#666" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>

            {profileData.images.map((img) => (
              <View key={img.id} style={styles.photoWrapper}>
                <Image source={{ uri: img.uri }} style={[styles.gridPhoto, { width: PHOTO_SIZE, height: PHOTO_SIZE }]} />
                <TouchableOpacity style={styles.deletePhotoBadge}>
                  <FontAwesomeFreeSolid name="xmark" size={10} color="#FFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View> */}

        {/* 9. Drinking Habit */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Drinking Habit</Text>
          <View style={styles.optionsRow}>
            {['YES', 'NO', 'SOMETIMES'].map((habit) => {
              const isSelected = profileData.drinkingHabit === habit;
              return (
                <TouchableOpacity
                  key={habit}
                  onPress={() => handleUpdate('drinkingHabit', habit)}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                >
                  <FontAwesomeFreeSolid name="wine-glass" size={14} color={isSelected ? '#FFF' : THEME_GREEN} />
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{habit}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 10. Smoking Habit */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Smoking Habit</Text>
          <View style={styles.optionsRow}>
            {[
              { label: 'No', value: 'NO' },
              { label: 'Sometimes', value: 'I_SMOKE_SOMETIMES' },
              { label: 'Regularly', value: 'REGULARLY' },
            ].map((habit) => {
              const isSelected = profileData.smokingHabit === habit.value;
              return (
                <TouchableOpacity
                  key={habit.value}
                  onPress={() => handleUpdate('smokingHabit', habit.value)}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                >
                  <FontAwesomeFreeSolid name="smoking" size={14} color={isSelected ? '#FFF' : THEME_GREEN} />
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{habit.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 11. Hoping to Find */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Hoping to Find</Text>
          <View style={styles.optionsRow}>
            {[
              { label: 'Long Term Relationship', value: 'A_LONG_TERM_RELATIONSHIP' },
              { label: 'Casual Dating', value: 'CASUAL_DATING' },
              { label: 'Friendship', value: 'FRIENDSHIP' },
            ].map((item) => {
              const isSelected = profileData.hopingToFind === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleUpdate('hopingToFind', item.value)}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                >
                  <FontAwesomeFreeSolid name="heart" size={14} color={isSelected ? '#FFF' : THEME_GREEN} />
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 12. Looking For */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionLabel}>Looking For</Text>
          <View style={styles.optionsRow}>
            {[
              { label: 'Men', value: 'MEN' },
              { label: 'Women', value: 'WOMEN' },
              { label: 'Everyone', value: 'EVERYONE' },
            ].map((item) => {
              const isSelected = profileData.lookingFor === item.value;
              return (
                <TouchableOpacity
                  key={item.value}
                  onPress={() => handleUpdate('lookingFor', item.value)}
                  style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                >
                  <FontAwesomeFreeSolid name="users" size={14} color={isSelected ? '#FFF' : THEME_GREEN} />
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Buttons inside ScrollView at the end */}
        <View style={styles.inlineButtonContainer}>
          <View style={styles.buttonWrapper}>
            <Button title="Cancel" variant="cancel" onPress={() => navigation.navigate('ProfileScreen')} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Save Changes" variant="primary" loading={isLoading} onPress={onSave} />
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Pure White Background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerIconButton: {
    width: 32,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME_GREEN,
    fontFamily: FONTS.REGULAR,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32, // Extra padding for comfortable scroll at bottom
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginVertical: 8,
  },
  mainAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: THEME_GREEN,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME_GREEN,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 6,
    backgroundColor: '#FFF',
  },
  changePhotoText: {
    color: THEME_GREEN,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
    fontFamily: FONTS.REGULAR,
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: THEME_GREEN,
    marginBottom: 8,
    fontFamily: FONTS.REGULAR,
  },
  aboutWrapper: {
    position: 'relative',
  },
  aboutInputStyle: {
    marginBottom: 0,
  },
  aboutEditIcon: {
    position: 'absolute',
    top: 14,
    right: 14,
    zIndex: 2,
  },
  charCounter: {
    position: 'absolute',
    bottom: 10,
    right: 14,
    fontSize: 10,
    color: '#888',
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  optionChipSelected: {
    backgroundColor: THEME_GREEN,
    borderColor: THEME_GREEN,
  },
  optionText: {
    fontSize: 13,
    color: '#333',
    marginLeft: 6,
    fontFamily: FONTS.REGULAR,
  },
  optionTextSelected: {
    color: '#FFF',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME_GREEN,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  interestText: {
    color: '#FFF',
    fontSize: 13,
    fontFamily: FONTS.REGULAR,
  },
  addMoreButton: {
    borderWidth: 1,
    borderColor: THEME_GREEN,
    borderStyle: 'dashed',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#FFF',
  },
  addMoreText: {
    color: THEME_GREEN,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: FONTS.REGULAR,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  addPhotoCard: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  addPhotoText: {
    fontSize: 9,
    color: '#666',
    marginTop: 2,
  },
  photoWrapper: {
    position: 'relative',
  },
  gridPhoto: {
    borderRadius: 12,
  },
  deletePhotoBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#B71C1C',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFF',
  },
  // Non-fixed bottom buttons layout
  inlineButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  buttonWrapper: {
    flex: 1,
  },
});