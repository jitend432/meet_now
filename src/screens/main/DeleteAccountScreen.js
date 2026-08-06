import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { authApi } from '../../services/authApi';
import { logout } from '../../redux/slices/authSlice';

const REASONS = [
  "Met someone special on Vynk",
  "Taking a break, will be back later",
  "Looking for something more casual",
  "Members in here are not my type",
  "Found my match elsewhere",
  "My connections didn't work out",
  "Other",
];

const DeleteAccountScreen = ({ navigation }) => {
    
  const dispatch = useAppDispatch();
  const profileId = useAppSelector((state) => state.auth.userId);

  const [selectedReason, setSelectedReason] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    isConfirmation: false,
  });

  const showAlertModal = (title, message, isConfirmation = false) => {
    setModalConfig({ title, message, isConfirmation });
    setModalVisible(true);
  };

  const handleDeletePress = () => {
    if (!selectedReason) {
      showAlertModal("Reason Required", "Please select a reason for leaving.");
      return;
    }

    if (!profileId) {
      showAlertModal("Error", "User ID not found.");
      return;
    }

    // Modal Confirmation before actual deletion
    showAlertModal(
      "Delete Permanently",
      "Are you sure you want to delete your account? This action cannot be undone.",
      true
    );
  };

  const confirmDeleteAccount = async () => {
    const remark = selectedReason === 'Other' && feedback
      ? `Other: ${feedback}`
      : selectedReason + (feedback ? ` - ${feedback}` : '');

    try {
      setIsDeleting(true);
      const response = await authApi.deleteUser(profileId, remark);

      if (response && response.status) {
        setModalVisible(false);
        dispatch(logout());
      } else {
        showAlertModal("Error", response?.msg || "Failed to delete account. Please try again.");
      }
    } catch (error) {
      showAlertModal("Error", error?.msg || "An error occurred while deleting your account.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Navigation / Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesomeFreeSolid name="chevron-left" size={18} color="#000000" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Icon & Title */}
        <View style={styles.headerBlock}>
          <FontAwesomeFreeSolid name="trash-alt" size={28} color="#0B5324" />
          <Text style={styles.title}>Delete</Text>
        </View>

        {/* Options / Checkbox List */}
        <View style={styles.reasonsList}>
          {REASONS.map((item) => {
            const isSelected = selectedReason === item;
            return (
              <TouchableOpacity
                key={item}
                style={styles.checkboxRow}
                activeOpacity={0.7}
                onPress={() => setSelectedReason(item)}
              >
                <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                  {isSelected && <FontAwesomeFreeSolid name="check" size={12} color="#ffffff" />}
                </View>
                <Text style={styles.reasonText}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Optional Feedback Input */}
        <Text style={styles.feedbackLabel}>Optional Feedback</Text>
        <TextInput
          style={styles.feedbackInput}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          value={feedback}
          onChangeText={setFeedback}
          placeholder="Write here..."
          placeholderTextColor="#bdbdbd"
        />

        {/* Action Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.8}
          disabled={isDeleting}
          onPress={handleDeletePress}
        >
          <Text style={styles.deleteButtonText}>Delete Permanently</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Alert/Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => !isDeleting && setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={[styles.modalIconBg, { backgroundColor: modalConfig.isConfirmation ? '#d32f2f' : '#0B5324' }]}>
              <FontAwesomeFreeSolid
                name={modalConfig.isConfirmation ? "exclamation-triangle" : "info-circle"}
                size={20}
                color="#ffffff"
              />
            </View>

            <Text style={styles.modalTitle}>{modalConfig.title}</Text>
            <Text style={styles.modalMessage}>{modalConfig.message}</Text>

            <View style={styles.modalActionRow}>
              {modalConfig.isConfirmation ? (
                <>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    activeOpacity={0.8}
                    disabled={isDeleting}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
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
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.modalButton, styles.singleOkButton]}
                  activeOpacity={0.8}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.confirmButtonText}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerBlock: {
    marginTop: 10,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2a1a4a',
    marginTop: 12,
  },
  reasonsList: {
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#2a1a4a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxSelected: {
    backgroundColor: '#0B5324',
    borderColor: '#0B5324',
  },
  reasonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111111',
  },
  feedbackLabel: {
    fontSize: 13,
    color: '#9e9e9e',
    marginBottom: 8,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 14,
    height: 120,
    fontSize: 14,
    color: '#212121',
    marginBottom: 30,
  },
  deleteButton: {
    backgroundColor: '#0B5324',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
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
  },
  modalIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2a1a4a',
    marginBottom: 6,
  },
  modalMessage: {
    fontSize: 14,
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
  confirmButton: {
    backgroundColor: '#d32f2f',
    marginLeft: 8,
  },
  singleOkButton: {
    backgroundColor: '#0B5324',
  },
  cancelButtonText: {
    color: '#424242',
    fontSize: 14,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});