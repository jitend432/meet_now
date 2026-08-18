import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { userApi } from '../../services/userApi';
import { CustomModal } from '../../components/common/CustomModal';
import { useAppSelector } from '../../redux/hooks';
import { FONTS } from '../../constants/fonts';

const OPTIONS = [
  { id: '1', label: 'Friend Recommended', enumValue: 'FRIEND_RECOMMENDED' },
  { id: '2', label: 'Digital Ad', enumValue: 'DIGITAL_AD' },
  { id: '3', label: 'Influencer', enumValue: 'INFLUENCER' },
  { id: '4', label: 'TV / Streaming', enumValue: 'TV_STREAMING' },
  { id: '5', label: 'Podcast / Spotify', enumValue: 'PODCAST_SPOTIFY' },
  { id: '6', label: 'Billboard', enumValue: 'BILLBOARD' },
  { id: '7', label: 'News Article', enumValue: 'NEWS_ARTICLE' },
  { id: '8', label: 'Other', enumValue: 'OTHER' },
];

const ReferralSourceScreen = ({ navigation }) => {
  const userId = useAppSelector((state) => state.auth.userId);
  console.log("Referral userId ==> ", userId);

  const [selectedOption, setSelectedOption] = useState(null);
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    type: 'info',
    buttons: [],
  });

  const showAlertModal = (title, message, type = 'info', buttons = []) => {
    setModalConfig({ title, message, type, buttons });
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    if (!selectedOption) return;

    const selectedItem = OPTIONS.find((opt) => opt.id === selectedOption);
    if (!selectedItem) return;

    try {
      setLoading(true);
      console.log('Sending Referral Payload:', {
        discoverySourceEnum: selectedItem.enumValue,
        remark: remark.trim() || selectedItem.label,
      });

      
      const result = await userApi.addDiscoverySource(
        selectedItem.enumValue,
        remark.trim() || selectedItem.label
      );

      console.log('Referral API Response:', result);

      const isSuccess =
        result?.status === true ||
        result?.status === 200 ||
        result?.success === true;

      if (isSuccess) {
        showAlertModal(
          'Success',
          result?.msg || 'Thank you for sharing!',
          'success',
          [
            {
              text: 'OK',
              onPress: () => {
                setModalVisible(false);
                navigation.goBack();
              },
            },
          ]
        );
      } else {
        showAlertModal(
          'Failed',
          result?.msg || result?.message || 'Failed to submit response.',
          'error'
        );
      }
    } catch (error) {
      console.log('Referral Catch Error ====>', error?.response?.data || error.message);
      showAlertModal(
        'Submission Error',
        error?.response?.data?.msg ||
          error?.response?.data?.message ||
          'Something went wrong. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Top Header Close Button */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={handleDismiss}
            style={styles.closeButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <FontAwesomeFreeSolid name="xmark" size={20} color="#222222" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Screen Title & Subtitle */}
          <View style={styles.titleContainer}>
            <Text style={styles.title}>What brought you into Vynk?</Text>
            <Text style={styles.subtitle}>Select Option</Text>
          </View>

          {/* Options List */}
          <View style={styles.optionsList}>
            {OPTIONS.map((item) => {
              const isSelected = selectedOption === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => setSelectedOption(item.id)}
                >
                  <Text style={styles.optionLabel}>{item.label}</Text>

                  {/* Radio Button */}
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Remark Input Field */}
          <View style={styles.remarkContainer}>
            <Text style={styles.remarkLabel}>Remark</Text>
            <TextInput
              style={styles.remarkInput}
              placeholder="Tell us more (e.g. friend's name, platform)..."
              placeholderTextColor="#9E9E9E"
              value={remark}
              onChangeText={setRemark}
              multiline
              maxLength={150}
            />
          </View>
        </ScrollView>

        {/* Bottom Action Footer */}
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedOption && !loading
                ? styles.submitButtonActive
                : styles.submitButtonDisabled,
            ]}
            disabled={!selectedOption || loading}
            activeOpacity={0.85}
            onPress={handleSubmit}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text
                style={[
                  styles.submitButtonText,
                  selectedOption
                    ? styles.submitButtonTextActive
                    : styles.submitButtonTextDisabled,
                ]}
              >
                Submit
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.dismissButton}
            activeOpacity={0.7}
            onPress={handleDismiss}
          >
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type={modalConfig.type}
        title={modalConfig.title}
        message={modalConfig.message}
        buttons={modalConfig.buttons}
      />
    </SafeAreaView>
  );
};

export default ReferralSourceScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  closeButton: {
    padding: 6,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 24,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    //fontWeight: '700',
    color: '#1C1C1E',
    textAlign: 'center',
    letterSpacing: -0.3,
    fontFamily: FONTS.SEMIBOLD
  },
  subtitle: {
    fontSize: 14,
    color: '#5C5C60',
    marginTop: 6,
    //fontWeight: '400',
    fontFamily: FONTS.REGULAR
  },
  optionsList: {
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EBEBEB',
  },
  optionLabel: {
    fontSize: 16,
    color: '#333333',
    //fontWeight: '500',
    fontFamily: FONTS.REGULAR
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C0C0C0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#285f26',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#285f26',
  },
  remarkContainer: {
    marginTop: 20,
  },
  remarkLabel: {
    fontSize: 14,
    //fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    fontFamily: FONTS.MEDIUM
  },
  remarkInput: {
    backgroundColor: '#F7F7F8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1C1C1E',
    minHeight: 65,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    fontFamily: FONTS.REGULAR
  },
  footerContainer: {
    paddingHorizontal: 24,
    paddingBottom: 14,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  submitButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonDisabled: {
    backgroundColor: '#ECEAE8',
  },
  submitButtonActive: {
    backgroundColor: '#285f26',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  submitButtonTextDisabled: {
    color: '#A09890',
  },
  submitButtonTextActive: {
    color: '#FFFFFF',
  },
  dismissButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    
  },
  dismissButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1C1C1E',
  },
});