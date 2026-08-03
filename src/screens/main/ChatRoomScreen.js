import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Image, FlatList,
  KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import CardContainer from '../../components/chat/CardContainer';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatActionButtons from '../../components/chat/ChatActionButtons';
import ActionDialogModal from '../../components/chat/ActionDialogModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../../redux/hooks';

import { chatApi } from '../../services/chatApi';
import { socketService } from '../../services/socketService';
import { COLORS } from '../../constants/theme';
import { FONTS } from '../../constants/fonts';

const ChatRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();
  
  const targetUser = route?.params?.user || {};
  const userId = targetUser.userId ; 
  const displayUserName = targetUser.fullName || "User";

  const currentUserId = useAppSelector((state) => state.auth.user?.id || state.auth.user?._id || state.auth.userProfile?.id || "");
  //const currentUserId = useAppSelector((state) => state.auth.userId );
  console.log("current User ID ==========> " ,currentUserId)

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [status, setStatus] = useState("Disconnected"); 

  const [dialogVisible, setDialogVisible] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [activeAction, setActiveAction] = useState('delete'); 

  const [selectedMuteOption, setSelectedMuteOption] = useState('Until I turn it off');
  const muteTimeOptions = ['15 Minutes', '1 Hour', '8 Hours', '24 Hours', 'Until I turn it off'];
  const [selectedReportOption, setSelectedReportOption] = useState('They will not be notified.');
  const reportOptionsList = ['They will not be notified.', 'Spam', 'Harassment', 'Inappropriate Content', 'Other'];

  const flatListRef = useRef(null);

  const fetchChatMessages = async () => {
    try {
      setLoading(true);
      if (!userId) return;
      
      const responseData = await chatApi.getChatMessages(userId);
      if (responseData) {
        const formattedHistory = responseData.map(msg => ({
          id: msg.id?.toString() || Math.random().toString(),
          text: msg.message, 
          time: msg.sentAt 
            ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : (msg.time || "10:00 AM"), 
          isMe: msg.senderId?.toString() === currentUserId.toString()
        }));
        setMessages(formattedHistory);
      }
    } catch (error) {
      console.error("Failed fetching conversation data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChatMessages();

    socketService.connect(
      (newStatus) => setStatus(newStatus),
      (incomingData) => {
        const isFromPartner = incomingData.senderId?.toString() === userId.toString();
        const isFromMe = incomingData.senderId?.toString() === currentUserId.toString();

        if (isFromPartner || isFromMe) {
          const newLiveBubble = {
            id: incomingData.id?.toString() || Date.now().toString(),
            text: incomingData.message, 
            time: incomingData.sentAt 
              ? new Date(incomingData.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
              : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: isFromMe
          };

          setMessages((prevMessages) => [...prevMessages, newLiveBubble]);
        }
      }
    );

    return () => {
      socketService.disconnect();
    };
  }, [userId, currentUserId]);

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;

    const successfullySent = socketService.sendMessage(userId, inputText);
    if (successfullySent) {
      setInputText(''); 
    }
  };

  const handleMenuOptionPress = (id, label) => {
    setMenuVisible(false);
    if (['delete', 'clear', 'block', 'mute', 'report'].includes(id)) {
      setActiveAction(id);
      setIsSuccessState(false);
      setDialogVisible(true);
    } else if (id === 'profile') {
     navigation.navigate('ViewProfileScreen', { user: { name: displayUserName, age: targetUser.age || 24, location: "Mumbai, India" } });
     //navigation.navigate('ViewProfileScreen',{userId})
    } else if (id === 'media' || id === 'mediaPhotos') {
      navigation.navigate('MediaPhotosScreen', { user: { name: displayUserName } });
    } else if (id === 'search' || id === 'searchChat') {
      navigation.navigate('SearchChatScreen', { user: { name: displayUserName } });
    } else {
      alert(`${label} selected`);
    }
  };

  const handleConfirmAction = () => {
    setDialogLoading(true);
    setTimeout(() => {
      setDialogLoading(false);
      setIsSuccessState(true); 
      if (activeAction === 'clear' || activeAction === 'delete') {
        setMessages([]);
      }
    }, 850);
  };

  const modalConfigs = {
    delete: { headerTitle: isSuccessState ? "Chat Deleted" : "Delete Chat", confirmIcon: "trash-alt", confirmIconColor: "#b71c1c", confirmIconBg: "#ffebee", confirmHeadline: "Delete this conversation?", confirmDescription: "This will remove the chat from your message list.", confirmBtnTitle: "Delete Chat", confirmBtnVariant: "danger", showCancelBtn: true, successDescription: "This conversation has been deleted.", successBtnTitle: "OK" },
    clear: { headerTitle: isSuccessState ? "Chat Cleared" : "Clear Chat", confirmIcon: "broom", confirmIconColor: "#265c32", confirmIconBg: "#e8f5e9", confirmHeadline: "Clear this conversation?", confirmDescription: "This will remove all messages from this chat.", confirmBtnTitle: "Clear Chat", confirmBtnVariant: "danger", showCancelBtn: true, successDescription: "All messages have been wiped from this workspace.", successBtnTitle: "OK" },
    block: { headerTitle: isSuccessState ? "User Blocked" : "Block User", confirmIcon: "ban", confirmIconColor: "#b71c1c", confirmIconBg: "#ffebee", confirmHeadline: `Block ${displayUserName}?`, confirmDescription: "Blocked profiles cannot send you messages or interact with you.", confirmBtnTitle: "Block User", confirmBtnVariant: "danger", showCancelBtn: true, successIcon: "shield-alt", successIconColor: "#b71c1c", successIconBg: "#ffebee", successBtnTitle: "Done", successDescription: ["You will not receive any messages or calls.", "You can unblock anytime from settings."] },
    mute: { headerTitle: isSuccessState ? "Muted" : "Mute Notifications", confirmIcon: "bell-slash", confirmIconColor: "#265c32", confirmIconBg: "#e8f5e9", confirmHeadline: "Mute this chat?", confirmDescription: `You will not receive any notifications for messages from ${displayUserName}.`, confirmBtnTitle: "Mute", confirmBtnVariant: "primary", showCancelBtn: false, successDescription: `You will not receive any notifications for messages from ${displayUserName}.`, successBtnTitle: "Got it" },
    report: { headerTitle: isSuccessState ? "Report Submitted" : "Report User", confirmIcon: "user-slash", confirmIconColor: "#b71c1c", confirmIconBg: "#ffebee", confirmHeadline: `Report ${displayUserName}`, confirmDescription: "Why are you reporting messages or calls from this user?", confirmBtnTitle: "Report", confirmBtnVariant: "danger", showCancelBtn: true, successDescription: "Thank you! Your report has been submitted. We will review it.", successBtnTitle: "OK" }
  };

  const currentConfig = modalConfigs[activeAction];

  const imageSource = targetUser.profileImage
    ? { uri: targetUser.profileImage }
    : require('../../assets/images/sarah.png');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <CardContainer title="Hexa Dating">
          
          <View style={styles.navbarContainer}>
            <View style={styles.navLeftSection}>
              <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
                <FontAwesomeFreeSolid name="arrow-left" size={18} color="#757575" style={styles.backArrow} />
              </TouchableOpacity>
              <View style={styles.avatarWrapper}>
                <Image source={imageSource} style={styles.avatarImage} />
                {status === "Connected" && <View style={styles.onlineBadge} />}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{displayUserName}</Text>
                <Text style={styles.userStatus}>{status}</Text>
              </View>
            </View>
            <ChatActionButtons onCall={() => {}} onVideo={() => {}} onMenu={() => setMenuVisible(true)} />
          </View>

          <Modal visible={menuVisible} transparent animationType="fade" onRequestClose={() => setMenuVisible(false)}>
            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
              <View style={styles.modalOverlayContainer}>
                <View style={styles.dropdownCardMenu}>
                  {[
                    { id: 'profile', label: 'View Profile', icon: 'user', color: '#333333' },
                    { id: 'media', label: 'Media & Photos', icon: 'image', color: '#333333' },
                    { id: 'search', label: 'Search Chat', icon: 'search', color: '#333333' },
                    { id: 'mute', label: 'Mute Notifications', icon: 'bell-slash', color: '#333333' },
                    { id: 'block', label: 'Block User', icon: 'ban', color: '#333333' },
                    { id: 'report', label: 'Report User', icon: 'exclamation-triangle', color: '#333333' },
                    { id: 'clear', label: 'Clear Chat', icon: 'trash-alt', color: '#333333' },
                    { id: 'delete', label: 'Delete Chat', icon: 'trash', color: '#d32f2f', isDestructive: true },
                  ].map((option) => (
                    <TouchableOpacity key={option.id} style={styles.menuItemRow} activeOpacity={0.7} onPress={() => handleMenuOptionPress(option.id, option.label)}>
                      <View style={styles.menuIconWidthBox}><FontAwesomeFreeSolid name={option.icon} size={15} color={option.color} /></View>
                      <Text style={[styles.menuItemLabelText, option.isDestructive && styles.destructiveLabelHighlight]}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>

          {currentConfig && (
            <ActionDialogModal
              visible={dialogVisible}
              onClose={() => setDialogVisible(false)}
              headerTitle={currentConfig.headerTitle}
              isSuccessView={isSuccessState}
              isLoading={dialogLoading}
              confirmIcon={currentConfig.confirmIcon}
              confirmIconColor={currentConfig.confirmIconColor}
              confirmIconBg={currentConfig.confirmIconBg}
              confirmHeadline={currentConfig.confirmHeadline}
              confirmDescription={currentConfig.confirmDescription}
              confirmBtnTitle={currentConfig.confirmBtnTitle}
              confirmBtnVariant={currentConfig.confirmBtnVariant}
              showCancelBtn={currentConfig.showCancelBtn}
              onConfirm={handleConfirmAction}
              successDescription={currentConfig.successDescription}
              successBtnTitle={currentConfig.successBtnTitle}
              onSuccessOk={() => setDialogVisible(false)}
            >
              {activeAction === 'mute' && (
                <View style={styles.radioContainer}>
                  {muteTimeOptions.map((option) => (
                    <TouchableOpacity key={option} style={styles.radioRow} activeOpacity={0.8} onPress={() => setSelectedMuteOption(option)}>
                      <View style={[styles.radioOuterCircle, selectedMuteOption === option && styles.radioOuterCircleSelected]}>
                        {selectedMuteOption === option && <View style={styles.radioInnerCircle} />}
                      </View>
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {activeAction === 'report' && (
                <View style={styles.radioContainer}>
                  {reportOptionsList.map((option) => (
                    <TouchableOpacity key={option} style={styles.radioRow} activeOpacity={0.8} onPress={() => setSelectedReportOption(option)}>
                      <View style={[styles.radioOuterCircle, selectedReportOption === option && styles.radioOuterCircleSelected]}>
                        {selectedReportOption === option && <View style={styles.radioInnerCircle} />}
                      </View>
                      <Text style={styles.radioText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </ActionDialogModal>
          )}

          {loading ? (
            <View style={styles.loadingWrapper}>
              <ActivityIndicator size="large" color="#265c32" />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chatTimelineList}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
              renderItem={({ item }) => <MessageBubble text={item.text} time={item.time} isMe={item.isMe} />}
            />
          )}

          <View style={styles.footerInputRow}>
            <View style={styles.inputFieldContainer}>
              <TextInput style={styles.textInput} placeholder="Type a message" placeholderTextColor="#558b2f" value={inputText} onChangeText={setInputText} />
            </View>
            <TouchableOpacity style={styles.sendActionButton} onPress={handleSendMessage} activeOpacity={0.8}>
              <FontAwesomeFreeSolid name="paper-plane" size={22} color="#265c32" />
            </TouchableOpacity>
          </View>

        </CardContainer>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: COLORS.background, 
  },
  keyboardView: {
    flex: 1 
  },
  navbarContainer: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1d9b7',
    zIndex: 10 
  },
  navLeftSection: { 
    flexDirection: 'row',
    alignItems: 'center' 
  },
  backArrow: { 
    marginRight: 12
  },
  avatarWrapper: { 
    position: 'relative',
    marginRight: 10 
  },
  avatarImage: { 
    width: 44, 
    height: 44, 
    borderRadius: 22,
    backgroundColor: '#e1d9b7'
  },
  onlineBadge: { 
    width: 10, 
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00e676',
    position: 'absolute', 
    bottom: 1, 
    right: 1, 
    borderWidth: 1.5,
    borderColor: '#fbf5db'
  },
  userInfo: {
    justifyContent: 'center'
  },
  userName: { 
    fontSize: 16, 
    color: '#265c32',
    fontFamily: FONTS.REGULAR
  },
  userStatus: {
    fontSize: 12, 
    color: '#7f9c7f',
    marginTop: 1,
    fontFamily: FONTS.REGULAR 
  },
  modalOverlayContainer: {
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  dropdownCardMenu: { 
    position: 'absolute', 
    top: 115, right: 16, 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    paddingVertical: 10, 
    width: 210, 
    shadowColor: '#000',
    shadowOffset: { 
      width: 0, 
      height: 4 
    }, 
    shadowOpacity: 0.08, 
    shadowRadius: 12, 
    elevation: 6, 
    borderWidth: 1, 
    borderColor: '#f0f0f0'
  },
  menuItemRow: { 
    flexDirection: 'row',
    alignItems: 'center', 
    paddingHorizontal: 16, 
    paddingVertical: 11 
  },
  menuIconWidthBox: { 
    width: 26, 
    alignItems: 'flex-start',
    justifyContent: 'center' 
  },
  menuItemLabelText: { 
    fontSize: 14, 
    color: '#212121', 
    fontWeight: '500' 
  },
  destructiveLabelHighlight: {
    color: '#d32f2f', 
    fontWeight: '600' 
  },
  chatTimelineList: { 
    paddingHorizontal: 16, 
    paddingVertical: 20, 
    flexGrow: 1 
  },
  footerInputRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1, 
    borderTopColor: '#e1d9b7',
    backgroundColor: COLORS.background,
  },
  inputFieldContainer: { 
    flex: 1, 
    height: 46, 
    backgroundColor: '#a3e971',
    borderRadius: 23, 
    paddingHorizontal: 18, 
    justifyContent: 'center', 
    marginRight: 14, 
    borderWidth: 1, 
    borderColor: '#7cb342'
  },
  textInput: { 
    fontSize: 15, 
    color: '#1b5e20',
    fontWeight: '600',
    padding: 0 
  },
  sendActionButton: { 
    width: 44,
    height: 44, 
    justifyContent: 'center',
    alignItems: 'center' 
  },
  radioContainer: { 
    width: '100%', 
    marginTop: 8 
  },
  radioRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10,
    paddingHorizontal: 4 
  },
  radioOuterCircle: { 
    width: 20, 
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#757575',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 12 
  },
  radioOuterCircleSelected: { 
    borderColor: '#0B5324' 
  },
  radioInnerCircle: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: '#0B5324'
  },
  radioText: { 
    fontSize: 14, 
    color: '#212121', 
    fontWeight: '500' 
  },
  loadingWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});