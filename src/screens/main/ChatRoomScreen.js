import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, Image, FlatList,
  KeyboardAvoidingView, Platform, Modal, TouchableWithoutFeedback, ActivityIndicator, Alert, StatusBar
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import CardContainer from '../../components/chat/CardContainer';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatActionButtons from '../../components/chat/ChatActionButtons';
import ActionDialogModal from '../../components/chat/ActionDialogModal';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../../redux/hooks';
import { openMediaPicker } from '../../utils/mediaPicker';
import userApi from '../../services/userApi';
import { useFocusEffect } from '@react-navigation/native';


import { chatApi } from '../../services/chatApi';
import { socketService } from '../../services/socketService';
import { COLORS } from '../../constants/theme';
import { FONTS } from '../../constants/fonts';

const ChatRoom = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const insets = useSafeAreaInsets();
  // const dynamicBottomInset = insets.bottom > 0 ? insets.bottom : 12;
  const dynamicBottomInset = (insets.bottom > 0 ? insets.bottom : 10) + 12;
  
  const targetUser = route?.params?.user || {};
  const userId = targetUser.userId ; 
  const displayUserName = targetUser.fullName || "User";
  console.log("Receiver user id chatRoom =====>",userId)

 // const currentUserId = useAppSelector((state) => state.auth.user?.id || state.auth.user?._id || state.auth.userProfile?.id || "");
  //const currentUserId = useAppSelector((state) => state.auth.userId );

  const authState = useAppSelector((state) => state.auth);
  const currentUserId = String(authState?.profileId || '').trim();

  console.log("current User ID ==========> " ,currentUserId)

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [menuVisible, setMenuVisible] = useState(false);
  const [status, setStatus] = useState("Disconnected"); 
  const [isBlocked, setIsBlocked] = useState(Boolean(targetUser.isBlocked));

  const [dialogVisible, setDialogVisible] = useState(false);
  const [isSuccessState, setIsSuccessState] = useState(false);
  const [dialogLoading, setDialogLoading] = useState(false);
  const [activeAction, setActiveAction] = useState('delete'); 

  const [selectedMuteOption, setSelectedMuteOption] = useState('Until I turn it off');
  const muteTimeOptions = ['15 Minutes', '1 Hour', '8 Hours', '24 Hours', 'Until I turn it off'];
  const [selectedReportOption, setSelectedReportOption] = useState('They will not be notified.');
  const reportOptionsList = ['They will not be notified.', 'Spam', 'Harassment', 'Inappropriate Content', 'Other'];

  const flatListRef = useRef(null);

  useEffect(() => {
  if (targetUser?.isBlocked !== undefined) {
    setIsBlocked(Boolean(targetUser.isBlocked));
  }
}, [targetUser?.isBlocked]);

// 🟢 YAHAN ADD KAREIN: Screen focus hote hi background check
  // useFocusEffect(
  //   useCallback(() => {
  //     let isMounted = true;

  //     const checkBlockStatusOnFocus = async () => {
  //       if (!userId) return;
  //       try {
  //         // Backend par silent block call try karein
  //         const res = await userApi.blockUser(userId);
  //         const resMsg = res?.data?.msg || res?.msg || '';

  //         if (isMounted) {
  //           if (resMsg.toLowerCase().includes('already blocked') || res?.data?.status === 400) {
  //             setIsBlocked(true);
  //           } else if (res?.data?.status === 200 || res?.status === 200) {
  //             // Agar galti se block ho gaya (kyuki wo blocked nahi tha), to turant silent unblock kar den
  //             await userApi.unblockUser(userId);
  //             setIsBlocked(false);
  //           }
  //         }
  //       } catch (err) {
  //         const errorMsg = err?.response?.data?.msg || '';
  //         if (isMounted && errorMsg.toLowerCase().includes('already blocked')) {
  //           setIsBlocked(true);
  //         }
  //       }
  //     };

  //     checkBlockStatusOnFocus();

  //     return () => {
  //       isMounted = false;
  //     };
  //   }, [userId])
  // );


  

// Attachment Button Handler
const handlePickMedia = async () => {
  const mediaFile = await openMediaPicker('mixed', 'library');

  if (!mediaFile) return;

  try {
    setLoading(true);

    // 1. FormData tayar karein Backend API ke liye
    const formData = new FormData();
    formData.append('file', {
      uri: mediaFile.uri,
      type: mediaFile.type,
      name: mediaFile.name,
    });
    formData.append('receiverId', userId);

    // 2. Upload API Call (Aapki media upload API)
    const response = await chatApi.uploadMedia(formData);
    const uploadedUrl = response?.mediaUrl || response?.url;

    if (!uploadedUrl) return;

    // 3. Message Payload Create Karein
    const newMediaMsg = {
      id: Date.now().toString(),
      senderProfileId: currentUserId,
      receiverProfileId: userId,
      message: '',
      mediaUrl: uploadedUrl,
      type: mediaFile.type?.includes('gif') ? 'gif' : 'image',
      sentAt: new Date().toISOString(),
      isMe: true,
    };

    // 4. Socket event emit karein
    socketService.sendMessage(newMediaMsg);

    // 5. Local State Update Karein (Instant Screen Par Dekhne Ke Liye)
    setMessages((prev) => [...prev, newMediaMsg]);

  } catch (error) {
    console.error('Media upload failed:', error);
  } finally {
    setLoading(false);
  }
};

  // const fetchChatMessages = async () => {
  //   try {
  //     setLoading(true);
  //     if (!userId) return;
      
  //     const responseData = await chatApi.getChatMessages(userId);
  //     if (responseData) {
  //       const formattedHistory = responseData.map(msg => ({
  //         id: msg.id?.toString() || Math.random().toString(),
  //         text: msg.message, 
  //         time: msg.sentAt 
  //           ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
  //           : (msg.time || "10:00 AM"), 
  //         isMe: msg.senderId?.toString() === currentUserId.toString()
  //       }));
  //       setMessages(formattedHistory);
  //     }
  //   } catch (error) {
  //     console.error("Failed fetching conversation data:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchChatMessages();

  //   socketService.connect(
  //     (newStatus) => setStatus(newStatus),
  //     (incomingData) => {
  //       const isFromPartner = incomingData.senderId?.toString() === userId.toString();
  //       const isFromMe = incomingData.senderId?.toString() === currentUserId.toString();

  //       if (isFromPartner || isFromMe) {
  //         const newLiveBubble = {
  //           id: incomingData.id?.toString() || Date.now().toString(),
  //           text: incomingData.message, 
  //           time: incomingData.sentAt 
  //             ? new Date(incomingData.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
  //             : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  //           isMe: isFromMe
  //         };

  //         setMessages((prevMessages) => [...prevMessages, newLiveBubble]);
  //       }
  //     }
  //   );

  //   return () => {
  //     socketService.disconnect();
  //   };
  // }, [userId, currentUserId]);

//   const fetchChatMessages = async () => {
//   try {
//     setLoading(true);
//     if (!userId) return;

//     const responseData = await chatApi.getChatMessages(userId);

//     if (responseData && Array.isArray(responseData)) {
//       const formattedHistory = responseData.map(msg => {
//         // Safe string coercion and trim to avoid Number vs String mismatch
//         const msgSenderId = String(msg.senderId || msg.sender_id || "").trim();
//         const myId = String(currentUserId || "").trim();

//         // Strict comparison: Only mark true if myId is not empty and matches senderId
//         const isMyMessage = myId !== "" && msgSenderId === myId;

//         return {
//           id: msg.id?.toString() || Math.random().toString(),
//           senderId: msgSenderId, // Store raw sender ID for fallback checks
//           text: msg.message || "", 
//           time: msg.sentAt 
//             ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
//             : (msg.time || "10:00 AM"), 
//           isMe: isMyMessage
//         };
//       });

//       setMessages(formattedHistory);
//     }
//   } catch (error) {
//     console.error("Failed fetching conversation data:", error);
//   } finally {
//     setLoading(false);
//   }
// };

   const fetchChatMessages = async () => {
  try {
    setLoading(true);
    if (!userId) return;

    const responseData = await chatApi.getChatMessages(userId);

    // 🔴 Step 1: Terminal console par iska output dekhein
    console.log("👉 REDUX MY ID:", currentUserId, "TYPE:", typeof currentUserId);
    console.log("👉 BACKEND MSG OBJECT:", responseData?.[0]);

    if (responseData && Array.isArray(responseData)) {
      const formattedHistory = responseData.map(msg => {
        // Robust Extraction
        const rawSender = msg.senderId || msg.sender_id || msg.userId || msg.sender?._id || msg.sender?.id || msg.from;
        
        const senderString = String(rawSender ?? "").trim();
        const myIdString = String(currentUserId ?? "").trim();

        // Direct Equality
        const isMyMsg = myIdString !== "" && senderString === myIdString;

        return {
          id: msg.id?.toString() || msg._id?.toString() || Math.random().toString(),
          text: msg.message || msg.text || "", 
          time: msg.sentAt 
            ? new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
            : (msg.time || "10:00 AM"), 
          isMe: isMyMsg
        };
      });

      setMessages(formattedHistory);
    }
  } catch (error) {
    console.error("Failed fetching conversation data:", error);
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
  // 1. Guard check: currentUserId milne par hi API call karein
  if (currentUserId && currentUserId !== "") {
    fetchChatMessages();
  }

  socketService.connect(
    (newStatus) => setStatus(newStatus),
    (incomingData) => {
      // 2. Safe string conversion & normalization
      const incomingSender = String(incomingData?.senderId || incomingData?.sender_id || "").trim();
      const partnerIdStr = String(userId || "").trim();
      const myIdStr = String(currentUserId || "").trim();

      const isFromPartner = incomingSender !== "" && incomingSender === partnerIdStr;
      const isFromMe = myIdStr !== "" && incomingSender === myIdStr;

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

  // const handleSendMessage = () => {
  //   if (inputText.trim() === '') return;

  //   const successfullySent = socketService.sendMessage(userId, inputText);
  //   if (successfullySent) {
  //     setInputText(''); 
  //   }
  // };

//   const handleSendMessage = () => {
//   // 🔴 Blocked state check: Block hone par message send hone se rokein
//   if (isBlocked) {
//     Alert.alert("Blocked", "You cannot send messages to a blocked user.");
//     return;
//   }

//   if (inputText.trim() === '') return;

//   const successfullySent = socketService.sendMessage(userId, inputText);
//   if (successfullySent) {
//     setInputText(''); 
//   }
// };

  const handleSendMessage = () => {
  if (isBlocked) {
    Alert.alert("Blocked", "You cannot send messages to a blocked user.");
    return;
  }

  const trimmedText = inputText.trim();
  if (!trimmedText) return;

  const receiverIdStr = String(userId || '').trim();

  // 🟢 1. Input clear karein
  setInputText('');

  // 🟢 2. Sirf Socket ko bhejien (Socket listener khud screen par message add karega)
  socketService.sendMessage(receiverIdStr, trimmedText);
};

  const handleMenuOptionPress = (id, label) => {
    setMenuVisible(false);
    if (['delete', 'clear', 'block','unblock', 'mute', 'report', 'unmatch'].includes(id)) {
      setActiveAction(id);
      setIsSuccessState(false);
      setDialogVisible(true);
    } else if (id === 'profile') {
      // 🔍 Target user ka complete data check karne ke liye logs:
    console.log("👉 TARGET USER RAW DATA:", JSON.stringify(targetUser, null, 2));
    console.log("👉 TARGET USER KEYS:", targetUser ? Object.keys(targetUser) : 'null');

    // Navigation trigger
    navigation.navigate('ViewProfileScreen', { 
      user: targetUser, // 👈 direct pura object pass karke dekhein
      userId: targetUser?.id || targetUser?.userId || targetUser?._id 
    });
     //navigation.navigate('ViewProfileScreen', { user: { name: displayUserName, age: targetUser.age || 24, location: "Mumbai, India" } });
     //navigation.navigate('ViewProfileScreen',{userId})
    // } else if (id === 'media' || id === 'mediaPhotos') {
    //   navigation.navigate('MediaPhotosScreen', { user: { name: displayUserName } });
    // } else if (id === 'search' || id === 'searchChat') {
    //   navigation.navigate('SearchChatScreen', { user: { name: displayUserName } });
    } else {
      alert(`${label} selected`);
    }
  };

  // const handleConfirmAction = () => {
  //   setDialogLoading(true);
  //   setTimeout(() => {
  //     setDialogLoading(false);
  //     setIsSuccessState(true); 
  //     if (activeAction === 'clear' || activeAction === 'delete') {
  //       setMessages([]);
  //     }
  //   }, 850);
  // };

  // const handleConfirmAction = async () => {
  //   setDialogLoading(true);
  //   try {
  //     if (activeAction === 'unmatch') {
  //       await userApi.unmatchUser(userId);
  //     } else if (activeAction === 'block') {
  //       await userApi.blockUser(userId);
  //     } else if (activeAction === 'report') {
  //       await userApi.reportUser(userId, selectedReportOption);
  //     } else if (activeAction === 'clear' || activeAction === 'delete') {
  //       setMessages([]);
  //     }

  //     setIsSuccessState(true);
  //   } catch (error) {
  //     console.error(`Failed executing ${activeAction}:`, error);
  //     Alert.alert("Action Failed", error?.response?.data?.message || "Something went wrong.");
  //     setDialogVisible(false);
  //   } finally {
  //     setDialogLoading(false);
  //   }
  // };

//  const handleConfirmAction = async () => {
//   setDialogLoading(true);
//  // setModalErrorMessage(''); // Reset previous error
//   try {
//     let response;

//     if (activeAction === 'unmatch') {
//       response = await userApi.unmatchUser(userId);
//       console.log('👉 UNMATCH RESPONSE:', response);
//     } else if (activeAction === 'block') {
//       response = await userApi.blockUser(userId);
//       console.log('👉 BLOCK RESPONSE:', response);
//     } else if (activeAction === 'report') {
//       response = await userApi.reportUser(userId, selectedReportOption);
//       console.log('👉 REPORT RESPONSE:', response);
//     } else if (activeAction === 'clear' || activeAction === 'delete') {
//       setMessages([]);
//     }

//     setIsSuccessState(true);
//   } catch (error) {
//     console.error(`❌ Failed executing ${activeAction}:`, error?.response?.data || error);

//     // 1. Backend se aaya 'msg' nikalen
//     const apiErrorMsg = error?.response?.data?.msg || error?.response?.data?.message || "Something went wrong.";

//     if (currentConfig) {
//       currentConfig.successDescription = apiErrorMsg;
//     }

//     if (activeAction === 'block') {
//       setIsBlocked(true);
//     }
//     setIsSuccessState(true);
//   } finally {
//     setDialogLoading(false);
//   }
// };

  //  const handleConfirmAction = async () => {
  // setDialogLoading(true);
  // try {
  //   let response;

  //   if (activeAction === 'unmatch') {
  //     response = await userApi.unmatchUser(userId);
  //     console.log('👉 UNMATCH RESPONSE:', response);
  //   } else if (activeAction === 'block') {
  //     response = await userApi.blockUser(userId);
  //     console.log('👉 BLOCK RESPONSE:', response);
  //     setIsBlocked(true); 
  //   } else if (activeAction === 'report') {
  //     response = await userApi.reportUser(userId, selectedReportOption);
  //     console.log('👉 REPORT RESPONSE:', response);
  //    } else if (activeAction === 'unblock') { // 👈 🟢 YAHAN UNBLOCK KA ELSE IF ADD KAREIN
  //     response = await userApi.unblockUser(userId);
  //     console.log('👉 UNBLOCK RESPONSE:', response);
  //     setIsBlocked(false);  
  //   } else if (activeAction === 'clear' || activeAction === 'delete') {
  //     setMessages([]);
  //   }

  //   setIsSuccessState(true);
  // } catch (error) {
  //   console.error(`❌ Failed executing ${activeAction}:`, error?.response?.data || error);

  //   // Backend se aaya 'msg' nikalen
  //   const apiErrorMsg = error?.response?.data?.msg || error?.response?.data?.message || "Something went wrong.";

  //   if (currentConfig) {
  //     currentConfig.successDescription = apiErrorMsg;
  //   }

  //   // Agar pehle se block hai ya error me bhi block state set karni ho
  //   if (activeAction === 'block') {
  //     setIsBlocked(true);
  //   }

  //   setIsSuccessState(true);
  // } finally {
  //   setDialogLoading(false);
  // }
  // };
  
  // const handleConfirmAction = async () => {
  // setDialogLoading(true);
  // try {
  //   let response;

  //   if (activeAction === 'unmatch') {
  //     response = await userApi.unmatchUser(userId);
  //     console.log('👉 UNMATCH RESPONSE:', response);
  //   } else if (activeAction === 'block') {
  //     response = await userApi.blockUser(userId);
  //     console.log('👉 BLOCK RESPONSE:', response);
  //     setIsBlocked(true); 
  //   } else if (activeAction === 'report') {
  //     response = await userApi.reportUser(userId, selectedReportOption);
  //     console.log('👉 REPORT RESPONSE:', response);
  //   } else if (activeAction === 'unblock') {
  //     response = await userApi.unblockUser(userId);
  //     console.log('👉 UNBLOCK RESPONSE:', response);
  //     setIsBlocked(false);  
  //   } else if (activeAction === 'clear' || activeAction === 'delete') {
  //     setMessages([]);
  //   }

  //   setIsSuccessState(true);

  // } catch (error) {
  //   console.error(`❌ Failed executing ${activeAction}:`, error?.response?.data || error);

  //   const apiErrorMsg = error?.response?.data?.msg || error?.response?.data?.message || "Something went wrong.";

  //   // 🔴 Success State set mat karein agar API fail ho gayi ho
  //   setDialogVisible(false); // Modal close karein
  //   Alert.alert("Action Failed", apiErrorMsg); // Error message dikhayen

  // } finally {
  //   setDialogLoading(false);
  // }
  // };

  const handleConfirmAction = async () => {
  setDialogLoading(true);
  try {
    let response;

    if (activeAction === 'unmatch') {
      response = await userApi.unmatchUser(userId);
      console.log('👉 UNMATCH RESPONSE:', response);
    } else if (activeAction === 'block') {
      response = await userApi.blockUser(userId);
      console.log('👉 BLOCK RESPONSE:', response);
      
      // 🟢 YAHAN ADD KAREIN: Backend Swagger Response Check
      const resMsg = response?.data?.msg || response?.msg || '';
      const resStatus = response?.data?.status || response?.status;

      if (resMsg.toLowerCase().includes('already blocked') || resStatus === 400) {
        setIsBlocked(true); 
        setDialogVisible(false); 
        Alert.alert("Notice", "User is already blocked.");
        return; // 👈 Modal me success screen na dikhane ke liye yahan se return kar den
      }

      setIsBlocked(true); 
    } else if (activeAction === 'report') {
      response = await userApi.reportUser(userId, selectedReportOption);
      console.log('👉 REPORT RESPONSE:', response);
    } else if (activeAction === 'unblock') {
      response = await userApi.unblockUser(userId);
      console.log('👉 UNBLOCK RESPONSE:', response);
      setIsBlocked(false);  
    } else if (activeAction === 'clear' || activeAction === 'delete') {
      setMessages([]);
    }

    setIsSuccessState(true);

  } catch (error) {
    console.error(`❌ Failed executing ${activeAction}:`, error?.response?.data || error);

    const apiErrorMsg = error?.response?.data?.msg || error?.response?.data?.message || "Something went wrong.";

    setDialogVisible(false); // Modal close karein
    Alert.alert("Action Failed", apiErrorMsg); // Error message dikhayen

  } finally {
    setDialogLoading(false);
  }
};


  const modalConfigs = {
    delete: { headerTitle: isSuccessState ? "Chat Deleted" : "Delete Chat", confirmIcon: "trash-alt", confirmIconColor: "#b71c1c", confirmIconBg: "#ffebee", confirmHeadline: "Delete this conversation?", confirmDescription: "This will remove the chat from your message list.", confirmBtnTitle: "Delete Chat", confirmBtnVariant: "danger", showCancelBtn: true, successDescription: "This conversation has been deleted.", successBtnTitle: "OK" },
    clear: { headerTitle: isSuccessState ? "Chat Cleared" : "Clear Chat", confirmIcon: "broom", confirmIconColor: "#265c32", confirmIconBg: "#e8f5e9", confirmHeadline: "Clear this conversation?", confirmDescription: "This will remove all messages from this chat.", confirmBtnTitle: "Clear Chat", confirmBtnVariant: "danger", showCancelBtn: true, successDescription: "All messages have been wiped from this workspace.", successBtnTitle: "OK" },
    unmatch: { 
    headerTitle: isSuccessState ? "Unmatched" : "Unmatch User", 
    confirmIcon: "heart-broken", 
    confirmIconColor: "#b71c1c", 
    confirmIconBg: "#ffebee", 
    confirmHeadline: `Unmatch ${displayUserName}?`, 
    confirmDescription: "This will remove them from your matches and you won't be able to message each other.", 
    confirmBtnTitle: "Unmatch", 
    confirmBtnVariant: "danger", 
    showCancelBtn: true, 
    successDescription: "You have unmatched this user.", 
    successBtnTitle: "OK" 
  },
    block: { headerTitle: isSuccessState ? "User Blocked" : "Block User", confirmIcon: "ban", confirmIconColor: "#b71c1c", confirmIconBg: "#ffebee", confirmHeadline: `Block ${displayUserName}?`, confirmDescription: "Blocked profiles cannot send you messages or interact with you.", confirmBtnTitle: "Block User", confirmBtnVariant: "danger", showCancelBtn: true, successIcon: "shield-alt", successIconColor: "#b71c1c", successIconBg: "#ffebee", successBtnTitle: "Done", successDescription: ["You will not receive any messages or calls.", "You can unblock anytime from settings."] },
    // 🟢 Yahan 'unblock' add karein
  unblock: { 
    headerTitle: isSuccessState ? "User Unblocked" : "Unblock User", 
    confirmIcon: "unlock", 
    confirmIconColor: "#2e7d32", 
    confirmIconBg: "#e8f5e9", 
    confirmHeadline: `Unblock ${displayUserName}?`, 
    confirmDescription: "They will be able to send you messages and interact with your profile again.", 
    confirmBtnTitle: "Unblock User", 
    confirmBtnVariant: "primary", 
    showCancelBtn: true, 
    successDescription: "User has been unblocked successfully.", 
    successBtnTitle: "OK" 
  },
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* <CardContainer title="Hexa Dating"> */}
          
          <View style={styles.navbarContainer}>
            <View style={styles.navLeftSection}>

              <TouchableOpacity onPress={() => navigation?.goBack()} activeOpacity={0.7}>
                <FontAwesomeFreeSolid name="arrow-left" size={18} color="#757575" style={styles.backArrow} />
              </TouchableOpacity>

              {/* 2. 👇 Clickable Profile Header (Avatar + Name) */}
    <TouchableOpacity 
      style={styles.profileClickableArea}
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate('ViewProfileScreen', {
          userId: targetUser?.userId || targetUser?.id || receiverId,
          user: targetUser,
        });
      }}
    >
              <View style={styles.avatarWrapper}>
                <Image source={imageSource} style={styles.avatarImage} />
                {status === "Connected" && <View style={styles.onlineBadge} />}
              </View>

              <View style={styles.userInfo}>
                <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                  {displayUserName}
                  </Text>
                <Text style={styles.userStatus}>{status}</Text>
              </View>
              </TouchableOpacity>


            </View>
            <ChatActionButtons 
            // onCall={() => {}}
            // onVideo={() => {}} 
            onMenu={() => setMenuVisible(true)} />
          </View>

          <Modal 
          visible={menuVisible} 
          transparent 
          animationType="fade"
          statusBarTranslucent={true} 
          onRequestClose={() => setMenuVisible(false)}>
            <StatusBar backgroundColor={COLORS.background || "#ffffff"} barStyle="dark-content" />

            <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
              <View style={styles.modalOverlayContainer}>
                <View style={styles.dropdownCardMenu}>
                  {[
                    { id: 'profile', label: 'View Profile', icon: 'user', color: '#333333' },
                    // { id: 'media', label: 'Media & Photos', icon: 'image', color: '#333333' },
                    { id: 'unmatch', label: 'Unmatch', icon: 'search', color: '#333333' },
                    // { id: 'mute', label: 'Mute Notifications', icon: 'bell-slash', color: '#333333' },
                   // { id: 'block', label: 'Block User', icon: 'ban', color: '#333333' },
                  //  isBlocked 
                  //   ? { id: 'unblock', label: 'Unblock User', icon: 'check-circle', color: '#2e7d32' }
                  //   : { id: 'block', label: 'Block User', icon: 'ban', color: '#333333' },
                    { id: 'report', label: 'Report User', icon: 'exclamation-triangle', color: '#333333' },
                    // { id: 'clear', label: 'Clear Chat', icon: 'trash-alt', color: '#333333' },
                    // { id: 'delete', label: 'Delete Chat', icon: 'trash', color: '#d32f2f', isDestructive: true },
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
              //onSuccessOk={() => setDialogVisible(false)}
              // 👈 Ye props add/update karein
              successIcon={currentConfig.successIcon}
              successIconColor={currentConfig.successIconColor}
              successIconBg={currentConfig.successIconBg}
              onSuccessOk={() => {
                setDialogVisible(false);
                if (activeAction === 'unmatch' || activeAction === 'block') {
                  navigation.goBack();
                }
              }}
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

         {loading || !currentUserId ? (
  <View style={styles.loadingWrapper}>
    <ActivityIndicator size="large" color="#265c32" />
  </View>
) : (
  <FlatList
    ref={flatListRef}
    data={messages}
    extraData={messages}
    keyExtractor={(item, index) => (item?.id ? String(item.id) : String(index))}
    contentContainerStyle={styles.chatTimelineList}
    showsVerticalScrollIndicator={false}
    removeClippedSubviews={false} // 👈 Ye false rakhna zaruri hai
    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
    renderItem={({ item }) => (
      <MessageBubble 
        text={item.text} 
        time={item.time} 
        // Strict boolean conversion
        isMe={Boolean(item.isMe)} 
      />
    )}
  />
)}

           
          

          {/* <View style={styles.footerInputRow}> */}

          {/* <View style={[styles.footerInputRow, { paddingBottom: dynamicBottomInset }]}>
            <View style={styles.inputFieldContainer}>
              <TextInput style={styles.textInput} placeholder="Type a message" placeholderTextColor="#558b2f" value={inputText} onChangeText={setInputText} />
            </View>
            <TouchableOpacity style={styles.sendActionButton} onPress={handleSendMessage} activeOpacity={0.8}>
              <FontAwesomeFreeSolid name="paper-plane" size={22} color="#265c32" />
            </TouchableOpacity>
          </View> */}

         <View style={[styles.footerInputRow, { paddingBottom: dynamicBottomInset }]}>
  {isBlocked ? (
    // 🔴 Blocked State: Notice Text + Unblock Button
    <View style={styles.blockedNoticeBox}>
      <Text style={styles.blockedNoticeText}>
        You have blocked this user.
      </Text>
      
      {/* 🟢 Unblock Button (Action trigger karne ke liye) */}
      <TouchableOpacity 
        onPress={() => {
          setActiveAction('unblock');
          setDialogVisible(true);
        }}
        activeOpacity={0.7}
        style={styles.unblockInlineBtn}
      >
        <Text style={styles.unblockInlineText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  ) : (
    // 🟢 Normal Input Row
    <>
      <View style={styles.inputFieldContainer}>
        <TextInput 
          style={styles.textInput} 
          placeholder="Type a message" 
          placeholderTextColor="#558b2f" 
          value={inputText} 
          onChangeText={setInputText} 
        />
      </View>
      <TouchableOpacity style={styles.sendActionButton} onPress={handleSendMessage} activeOpacity={0.8}>
        <FontAwesomeFreeSolid name="paper-plane" size={22} color="#265c32" />
      </TouchableOpacity>
    </>
  )}
</View>

        {/* </CardContainer> */}
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
    paddingHorizontal: 12, 
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e1d9b7',
    zIndex: 10 
  },
  navLeftSection: { 
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  marginLeft: 8, 
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
    justifyContent: 'center',
    flex:1
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
    backgroundColor: '#ffffff',
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
  },

  blockedNoticeBox: {
  flex: 1,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#ffebee',
  paddingHorizontal: 16,
  paddingVertical: 10,
  borderRadius: 8,
},
blockedNoticeText: {
  color: '#c62828',
  fontSize: 13,
  fontWeight: '500',
  flex: 1,
},
unblockInlineBtn: {
  backgroundColor: '#c62828',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 6,
  marginLeft: 8,
},
unblockInlineText: {
  color: '#ffffff',
  fontSize: 12,
  fontWeight: '600',
},
profileClickableArea: {
  flexDirection: 'row',
  alignItems: 'center',
  flex: 1, 
},
});