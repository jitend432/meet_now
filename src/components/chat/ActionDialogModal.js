import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity 
} from 'react-native';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import Button from '../common/Button'; 

const ActionDialogModal = ({ 
  visible, 
  onClose,
  headerTitle,
  isSuccessView = false, 
  
  // Confirmation props
  confirmIcon = "trash-alt",
  confirmIconColor = "#b71c1c",
  confirmIconBg = "#ffebee",
  confirmHeadline,
  confirmDescription,
  confirmBtnTitle = "Confirm",
  confirmBtnVariant = "danger",
  onConfirm,
  isLoading = false,
  showCancelBtn = true,
  
  // Success props
  successDescription, // Can be string or array of strings for bullets
  successIcon = "check",
  successIconColor = "#0b5324",
  successIconBg = "#e8f5e9",
  successBtnTitle = "OK",
  onSuccessOk,

  // Extensions
  children 
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.dialogModalContainer}>
        <View style={styles.dialogCardFrame}>
          
          {/* Header Row */}
          <View style={styles.cardHeaderRow}>
            <TouchableOpacity activeOpacity={0.7} onPress={onClose}>
              <FontAwesomeFreeSolid name="arrow-left" size={16} color="#0B5324" />
            </TouchableOpacity>
            <Text style={styles.headerTitleText}>
              {headerTitle}
            </Text>
            <View style={styles.headerPlaceholderBox} />
          </View>

          {/* View 1: Confirmation Layout */}
          {!isSuccessView ? (
            <View style={styles.innerCardWrapper}>
              <View style={styles.cardInnerBody}>
                <View style={[styles.iconCircleBadge, { backgroundColor: confirmIconBg }]}>
                  <FontAwesomeFreeSolid name={confirmIcon} size={32} color={confirmIconColor} />
                </View>
                {confirmHeadline && <Text style={styles.warningHeadlineText}>{confirmHeadline}</Text>}
                {confirmDescription && <Text style={styles.warningDescriptionText}>{confirmDescription}</Text>}
              </View>

              {children && <View style={styles.customContentBox}>{children}</View>}

              <View style={styles.actionButtonsRow}>
                {showCancelBtn && (
                  <Button 
                    title="Cancel" 
                    variant="cancel" 
                    onPress={onClose} 
                    style={styles.flexButtonSpacing}
                  />
                )}
                <Button 
                  title={confirmBtnTitle} 
                  variant={confirmBtnVariant} 
                  loading={isLoading}
                  onPress={onConfirm} 
                  style={styles.flexButton}
                />
              </View>
            </View>
          ) : (
            /* View 2: Success Layout (Matches image_710fed.png structure) */
            <View style={styles.innerCardWrapper}>
              <View style={styles.cardInnerBody}>
                <View style={[styles.iconCircleBadge, { backgroundColor: successIconBg, borderWidth: successIcon === 'shield-alt' ? 1 : 0, borderColor: '#e57373' }]}>
                  <FontAwesomeFreeSolid name={successIcon} size={36} color={successIconColor} />
                </View>
                <Text style={styles.successHeadlineText}>{headerTitle}</Text>
                
                {/* Check if description is bullet list or simple text */}
                {Array.isArray(successDescription) ? (
                  <View style={styles.bulletPointsContainer}>
                    {successDescription.map((point, index) => (
                      <View key={index} style={styles.bulletRow}>
                        <View style={styles.diamondMarker}>
                          <FontAwesomeFreeSolid name="diamond" size={6} color="#424242" />
                        </View>
                        <Text style={styles.bulletText}>{point}</Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text style={styles.successDescriptionText}>{successDescription}</Text>
                )}
              </View>

              <View style={styles.actionButtonsRow}>
                <Button 
                  title={successBtnTitle} 
                  variant="primary" 
                  onPress={onSuccessOk} 
                  style={styles.flexButton}
                />
              </View>
            </View>
          )}

        </View>
      </View>
    </Modal>
  );
};

export default ActionDialogModal;

const styles = StyleSheet.create({
  dialogModalContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', paddingHorizontal: 24 },
  dialogCardFrame: { backgroundColor: '#ffffff', borderRadius: 24, paddingVertical: 18, paddingHorizontal: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 16, elevation: 10 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0', paddingBottom: 12, marginBottom: 24 },
  headerTitleText: { fontSize: 18, fontWeight: '700', color: '#0B5324', textAlign: 'center' },
  headerPlaceholderBox: { width: 24 },
  innerCardWrapper: { width: '100%' },
  cardInnerBody: { alignItems: 'center', paddingHorizontal: 10, marginBottom: 16 },
  iconCircleBadge: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  warningHeadlineText: { fontSize: 18, fontWeight: '700', color: '#000000', marginBottom: 12, textAlign: 'center' },
  warningDescriptionText: { fontSize: 14, color: '#616161', textAlign: 'center', lineHeight: 20, fontWeight: '500' },
  successHeadlineText: { fontSize: 18, fontWeight: '700', color: '#0B5324', marginBottom: 16, textAlign: 'center' },
  successDescriptionText: { fontSize: 14, color: '#616161', textAlign: 'center', lineHeight: 20, fontWeight: '500' },
  
  // Bullet/Diamond Specs for image_710fed.png
  bulletPointsContainer: { width: '100%', paddingHorizontal: 12, marginTop: 4, marginBottom: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  diamondMarker: { marginRight: 10, marginTop: 6, width: 10, alignItems: 'center' },
  bulletText: { flex: 1, fontSize: 14, color: '#424242', fontWeight: '500', lineHeight: 18 },

  customContentBox: { width: '100%', paddingHorizontal: 8, marginBottom: 24 },
  actionButtonsRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  flexButton: { flex: 1, height: 46, paddingVertical: 0, borderRadius: 12 },
  flexButtonSpacing: { flex: 1, height: 46, paddingVertical: 0, marginRight: 12, borderRadius: 12 },
});