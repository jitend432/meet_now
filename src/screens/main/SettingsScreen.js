import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  StatusBar,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import CustomSlider from '../../components/common/CustomSlider';
import { logout, updateDiscoverySettings } from '../../redux/slices/authSlice';
import { FONTS } from '../../constants/fonts';
import { FONTSIZE, COLORS } from '../../constants/theme';
import Button from '../../components/common/Button';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { authApi } from '../../services/authApi';

const GENDER_PREFERENCES = [
  { label: 'Men', value: 'MEN' },
  { label: 'Women', value: 'WOMEN' },
  { label: 'Everyone', value: 'OTHER' },
];

const SettingsScreen = ({ navigation }) => {
  const dispatch = useAppDispatch();
  
  // Redux Settings
  const { 
    distance = 50, 
    maxAge = 40, 
    lookingFor = 'WOMEN', 
    isGlobal = false 
  } = useAppSelector((state) => state.auth.discoverySettings || {});

  const id = useAppSelector((state) => state.auth.userId);

  // Handlers for Discovery Settings
  const handleDistanceChange = (val) => {
    dispatch(updateDiscoverySettings({ distance: val }));
  };

  const handleAgeChange = (val) => {
    dispatch(updateDiscoverySettings({ maxAge: val }));
  };

  const handleLookingForChange = (val) => {
    dispatch(updateDiscoverySettings({ lookingFor: val }));
  };

  const handleGlobalToggle = (val) => {
    dispatch(updateDiscoverySettings({ isGlobal: val }));
  };

  // Modals & Actions
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

  const handleDeletePress = () => {
    navigation.navigate('DeleteAccountScreen');
  };

  const confirmDeleteAccount = async () => {
    if (!id) {
      setDeleteErrorMessage("User registration ID not found.");
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteErrorMessage('');
      
      const response = await authApi.deleteUser(id);

      if (response && response.status) {
        setDeleteModalVisible(false);
        dispatch(logout());
      } else {
        setDeleteErrorMessage(response?.msg || "Failed to delete account. Please try again.");
      }
    } catch (error) {
      console.error(error);
      setDeleteErrorMessage("An error occurred while deleting your account.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleLogoutPress = () => {
    setLogoutModalVisible(true);
  };

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    dispatch(logout());
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      
      {/* Logout Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalIconBg}>
              <FontAwesomeFreeSolid name="sign-out-alt" size={20} color="#ffffff" />
            </View>

            <Text style={styles.modalTitle}>Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to log out?</Text>

            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                activeOpacity={0.8}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmLogoutButton]} 
                activeOpacity={0.8}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      {/* Delete Account Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={() => !isDeleting && setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>

            <View style={[styles.modalIconBg, { backgroundColor: '#d32f2f' }]}>
              <FontAwesomeFreeSolid name="trash-alt" size={20} color="#ffffff" />
            </View>

            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to delete your account? This action is permanent and cannot be undone.
            </Text>

            {deleteErrorMessage ? (
              <Text style={styles.errorText}>{deleteErrorMessage}</Text>
            ) : null}

            <View style={styles.modalActionRow}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                activeOpacity={0.8}
                disabled={isDeleting}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmLogoutButton]} 
                activeOpacity={0.8}
                disabled={isDeleting}
                onPress={confirmDeleteAccount}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.confirmButtonText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.screenTitle}>Settings</Text>

        <View style={styles.settingsCard}>
          <View style={styles.cardSectionHeader}>
            <FontAwesomeFreeSolid name="eye" size={15} color="#265c32" style={styles.headerIconSpace} />
            <Text style={styles.cardMainHeading}>Discovery Settings</Text>
          </View>

          <View style={styles.sectionBlock}>
            <Text style={styles.settingLabelTitle}>Interested In</Text>
            <View style={styles.chipsRow}>
              {GENDER_PREFERENCES.map((pref) => {
                const isSelected = lookingFor === pref.value;
                return (
                  <TouchableOpacity
                    key={pref.value}
                    activeOpacity={0.7}
                    onPress={() => handleLookingForChange(pref.value)}
                    style={[
                      styles.choiceChip,
                      isSelected && styles.choiceChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.choiceChipText,
                        isSelected && styles.choiceChipTextSelected,
                      ]}
                    >
                      {pref.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 2. Global Search Toggle */}
          <View style={styles.controlSettingRow}>
            <View style={styles.labelTextColumn}>
              <Text style={styles.settingLabelTitle}>Global</Text>
              <Text style={styles.settingDescription}>
                Match with people nearby and from around the world.
              </Text>
            </View>
            <Switch
              value={isGlobal}
              onValueChange={handleGlobalToggle}
              trackColor={{ false: '#E0E0E0', true: '#a5d6a7' }}
              thumbColor={isGlobal ? '#265c32' : '#f4f3f4'}
            />
          </View>

          {/* 3. Distance Slider (Disabled if Global is enabled) */}
          <View style={[styles.sliderBlock, isGlobal && { opacity: 0.4 }]}>
            <CustomSlider
              label="Maximum Distance"
              value={distance}
              minimumValue={1}
              maximumValue={500}
              step={1}
              unit="km"
              disabled={isGlobal}
              onValueChange={handleDistanceChange}
            />
          </View>

          {/* 4. Age Slider */}
          <View style={styles.sliderBlock}>
            <CustomSlider
              label="Maximum Age"
              value={maxAge}
              minimumValue={18}
              maximumValue={60}
              step={1}
              unit="yrs"
              onValueChange={handleAgeChange}
            />
          </View>

        </View>

        <Button
          title="How did you find us?"
          onPress={() => navigation.navigate('ReferralSourceScreen')}
          style={styles.findUsButton}
        />

        <TouchableOpacity 
          style={styles.logoutActionButton} 
          activeOpacity={0.8} 
          onPress={handleLogoutPress}
        >
          <View style={styles.logoutIconBadgeCircle}>
            <FontAwesomeFreeSolid name="sign-out-alt" size={12} color="#ffffff" style={styles.rotatedLogoutIcon} />
          </View>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        <Button
          title="Delete Account"
          onPress={handleDeletePress}
          style={styles.deleteButton}
        />

      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingBottom: 50,
  },
  scrollView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: FONTSIZE.xl,
    color: '#265c32',
    marginBottom: 16,
    fontFamily: FONTS.MEDIUM,
  },
  settingsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e1d9b7',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
    paddingBottom: 8,
  },
  headerIconSpace: {
    marginRight: 10,
  },
  cardMainHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#37474f',
  },
  sectionBlock: {
    marginBottom: 18,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  choiceChip: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  choiceChipSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: '#265c32',
  },
  choiceChipText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '600',
  },
  choiceChipTextSelected: {
    color: '#265c32',
    fontWeight: '700',
  },
  controlSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingVertical: 4,
  },
  labelTextColumn: {
    flex: 1,
    marginRight: 12,
  },
  settingLabelTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#265c32',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#777777',
    fontWeight: '400',
    lineHeight: 16,
  },
  sliderBlock: {
    marginBottom: 12,
  },
  logoutActionButton: {
    backgroundColor: '#b9f6ca',
    height: 52,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  logoutIconBadgeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#265c32',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  rotatedLogoutIcon: {
    transform: [{ rotate: '180deg' }],
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#265c32',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d32f2f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.SEMIBOLD,
    color: '#37474f',
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: FONTS.REGULAR,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  confirmLogoutButton: {
    backgroundColor: '#d32f2f',
    marginLeft: 8,
  },
  cancelButtonText: {
    color: '#424242',
    fontSize: 14,
    fontFamily: FONTS.MEDIUM,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: FONTS.SEMIBOLD,
  },
  deleteButton: {
    marginTop: 21,
    borderRadius: 12,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.REGULAR,
    color: '#d32f2f',
    marginBottom: 16,
    textAlign: 'center',
  },
  findUsButton: {
    marginTop: 21,
    borderRadius: 12,
    marginBottom: 16,
  },
});