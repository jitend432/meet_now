import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, FONTSIZE, RADIUS, SIZES } from '../../constants/theme';
import LogoImage from '../../assets/images/vynk_t.png';
import { FONTS } from '../../constants/fonts';
import { chatApi } from '../../services/chatApi';

const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150';

const ChatListScreen = ({ navigation }) => {
  const [chatList, setChatList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchChatList = async () => {
    try {
      const response = await chatApi.getChatList();
      if (response) {
        setChatList(response);
      }
    } catch (error) {
      console.error('Error fetching chat list:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchChatList();
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    const now = new Date();

    const isToday = date.toDateString() === now.toDateString();
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      activeOpacity={0.7}
      onPress={() => navigation.navigate('ChatRoomScreen', { user: item })}
    >
      <View style={styles.avatarContainer}>
        <Image 
          source={{ uri: item.profileImage || DEFAULT_AVATAR }} 
          style={styles.avatar} 
        />
      </View>

      <View style={styles.chatDetails}>
        <View style={styles.chatHeaderRow}>
          <Text style={styles.nameText}>{item.fullName || 'User'}</Text>
          <Text style={styles.timeText}>{formatTime(item.lastMessageTime)}</Text>
        </View>
        
        <View style={styles.chatBodyRow}>
          <Text 
            style={[styles.messageText, item.unreadCount > 0 && styles.unreadMessageText]} 
            numberOfLines={1}
          >
            {item.lastMessage || 'No messages yet'}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.brandHeader}>
        <Image source={LogoImage} style={styles.logoStyle} resizeMode="contain" />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.screenTitle}>Message</Text>
      </View>
      <View style={styles.separator} />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary || '#1E5A34'} />
        </View>
      ) : (
        <FlatList
          data={chatList}
          keyExtractor={(item) => item.userId.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={[COLORS.primary || '#1E5A34']} 
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No conversations found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  brandHeader: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderColor: '#E8E8E8',
  },
  logoStyle: {
    width: SIZES.avatarmini,
    height: SIZES.avatarmini,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  screenTitle: {
    fontSize: FONTSIZE.xl,
    fontFamily: FONTS.SEMIBOLD,
    color: COLORS.primary || '#1E5A34',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.xl,
  },
  chatDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    color: '#1C2E3A',
    fontFamily: FONTS.REGULAR,
  },
  timeText: {
    fontSize: 14,
    color: '#9E9E9E',
    fontFamily: FONTS.THIN,
  },
  chatBodyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageText: {
    fontSize: 16,
    color: '#757575',
    flex: 1,
    paddingRight: 10,
    fontFamily: FONTS.THIN,
  },
  unreadMessageText: {
    fontWeight: '600',
    color: '#1C2E3A',
  },
  badge: {
    backgroundColor: COLORS.primary || '#1E5A34',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#757575',
    fontFamily: FONTS.REGULAR,
  },
});