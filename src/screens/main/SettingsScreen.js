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
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { useAppDispatch } from '../../redux/hooks';
import CardContainer from '../../components/chat/CardContainer';
import CustomToggle from '../../components/common/CustomToggle';
import CustomRangeSlider from '../../components/common/CustomRangeSlider';
import { logout } from '../../redux/slices/authSlice';

const SettingsScreen = () => {
  const dispatch = useAppDispatch()
  const [newMatchesNotif, setNewMatchesNotif] = useState(true);
  const [messageNotif, setMessageNotif] = useState(true);
  const [likesNotif, setLikesNotif] = useState(false);

  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [showDistance, setShowDistance] = useState(true);
  const [incognitoMode, setIncognitoMode] = useState(false);

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            dispatch(logout());
            // Note: navigation.navigate('LoginScreen')
            //  no need to write it will automatically navigate to Login
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CardContainer title="Vynk Dating">
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>Settings</Text>

          {/* --- NOTIFICATION PREFERENCES SECTION CARD --- */}
          <View style={styles.settingsCard}>
            <View style={styles.cardSectionHeader}>
              <FontAwesomeFreeSolid name="bell" size={16} color="#265c32" style={styles.headerIconSpace} />
              <Text style={styles.cardMainHeading}>Notification</Text>
            </View>

            <View style={styles.controlSettingRow}>
              <View style={styles.labelTextColumn}>
                <Text style={styles.settingLabelTitle}>New Matches</Text>
                <Text style={styles.settingDescription}>Get notified when you get a new match</Text>
              </View>
              <CustomToggle isOn={newMatchesNotif} onToggle={() => setNewMatchesNotif(!newMatchesNotif)} />
            </View>

            <View style={styles.controlSettingRow}>
              <View style={styles.labelTextColumn}>
                <Text style={styles.settingLabelTitle}>Message</Text>
                <Text style={styles.settingDescription}>Get notified about new messages</Text>
              </View>
              <CustomToggle isOn={messageNotif} onToggle={() => setMessageNotif(!messageNotif)} />
            </View>

            <View style={styles.controlSettingRow}>
              <View style={styles.labelTextColumn}>
                <Text style={styles.settingLabelTitle}>Likes</Text>
                <Text style={styles.settingDescription}>Get notified when someone likes you</Text>
              </View>
              <CustomToggle isOn={likesNotif} onToggle={() => setLikesNotif(!likesNotif)} />
            </View>
          </View>

          {/* --- PRIVACY CONFIGURATIONS SECTION CARD --- */}
          <View style={styles.settingsCard}>
            <View style={styles.cardSectionHeader}>
              <FontAwesomeFreeSolid name="shield-alt" size={16} color="#265c32" style={styles.headerIconSpace} />
              <Text style={styles.cardMainHeading}>Privacy</Text>
            </View>

            <View style={styles.controlSettingRow}>
              <View style={styles.labelTextColumn}>
                <Text style={styles.settingLabelTitle}>Show Online Status</Text>
                <Text style={styles.settingDescription}>Let others see when you're online</Text>
              </View>
              <CustomToggle isOn={showOnlineStatus} onToggle={() => setShowOnlineStatus(!showOnlineStatus)} />
            </View>

            <View style={styles.controlSettingRow}>
              <View style={styles.labelTextColumn}>
                <Text style={styles.settingLabelTitle}>Show Distance</Text>
                <Text style={styles.settingDescription}>Display your distance from others</Text>
              </View>
              <CustomToggle isOn={showDistance} onToggle={() => setShowDistance(!showDistance)} />
            </View>

            <View style={styles.controlSettingRow}>
              <View style={styles.labelTextColumn}>
                <Text style={styles.settingLabelTitle}>Incognito Mode</Text>
                <Text style={styles.settingDescription}>Browse anonymously</Text>
              </View>
              <CustomToggle isOn={incognitoMode} onToggle={() => setIncognitoMode(!incognitoMode)} />
            </View>
          </View>

          {/* --- DISCOVERY PARAMETERS CARD SECTION --- */}
          <View style={styles.settingsCard}>
            <View style={styles.cardSectionHeader}>
              <FontAwesomeFreeSolid name="eye" size={15} color="#265c32" style={styles.headerIconSpace} />
              <Text style={styles.cardMainHeading}>Discovery Settings</Text>
            </View>

            {/* Slider Segment 1: Age Scope */}
            <View style={styles.sliderMetricBlock}>
              <Text style={styles.sliderBlockTitle}>Age Range: <Text style={styles.metricBoldValue}>41 - 30</Text></Text>
              <CustomRangeSlider percentage={65} />
            </View>

            {/* Slider Segment 2: Distance Boundary */}
            <View style={styles.sliderMetricBlock}>
              <Text style={styles.sliderBlockTitle}>Maximum Distance: <Text style={styles.metricBoldValue}>50 km</Text></Text>
              <CustomRangeSlider percentage={80} />
            </View>

            {/* Dropdown Choice Action Field Row */}
            <View style={styles.pickerMenuWrapper}>
              <Text style={styles.sliderBlockTitle}>Show Me</Text>
              <TouchableOpacity style={styles.dropdownSelectorTrigger} activeOpacity={0.8}>
                <Text style={styles.dropdownSelectedText}>Everyone</Text>
                <FontAwesomeFreeSolid name="chevron-down" size={12} color="#424242" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutActionButton} activeOpacity={0.8} onPress={handleLogoutPress}>
            <View style={styles.logoutIconBadgeCircle}>
              <FontAwesomeFreeSolid name="sign-out-alt" size={12} color="#ffffff" style={styles.rotatedLogoutIcon} />
            </View>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>

        </ScrollView>
      </CardContainer>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    //backgroundColor: '#9c6644', 
    paddingBottom:50
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#265c32',
    marginBottom: 16,
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
  controlSettingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
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
    fontSize: 11,
    color: '#9e9e9e',
    fontWeight: '500',
  },
  sliderMetricBlock: {
    marginBottom: 14,
  },
  sliderBlockTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#265c32',
    marginBottom: 4,
  },
  metricBoldValue: {
    color: '#616161',
    fontWeight: '500',
  },
  pickerMenuWrapper: {
    marginTop: 4,
  },
  dropdownSelectorTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#a5d6a7',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
    marginTop: 6,
    backgroundColor: '#ffffff',
  },
  dropdownSelectedText: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  logoutActionButton: {
    backgroundColor: '#b9f6ca', // Bright soft light green backdrop from the screenshot button segment
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
    transform: [{ rotate: '180deg' }], // Matches the flipped directional design in image_a2c202.png
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#265c32',
  },
});