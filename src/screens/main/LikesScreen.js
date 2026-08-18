import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants/theme';
import { likeService } from '../../services/apiService';
import { matchApi } from '../../services/matchApi';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

// Fallback blurred placeholders for incoming Likes (Free Users)
const BLURRED_PLACEHOLDERS = [
  {
    id: 'placeholder-1',
    age: 28,
    profileUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
  },
  {
    id: 'placeholder-2',
    age: 25,
    profileUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500',
  },
];

const LikesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('2 Likes');
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  
  // Lists
  const [whoLikedMeList, setWhoLikedMeList] = useState([]);
  const [sentLikesList, setSentLikesList] = useState([]);
  const [upgradeMsg, setUpgradeMsg] = useState('Upgrade to Gold to see people who already liked you.');

  const tabs = ['2 Likes', 'Likes Sent', '10 Top Picks'];

  // 1. Fetch Incoming Likes ("2 Likes" Tab)
  const fetchWhoLikedMe = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await matchApi.getWhoLikedMe(0, 10);

      if (resData?.status === 400 || (resData?.msg && resData?.msg.toLowerCase().includes('upgrade'))) {
        setIsPremium(false);
        setUpgradeMsg(resData?.msg || 'Upgrade your plan to see who liked you.');
        setWhoLikedMeList(BLURRED_PLACEHOLDERS);
      } else {
        setIsPremium(true);
        const profiles = Array.isArray(resData)
          ? resData
          : (resData?.content || resData?.data || []);
        setWhoLikedMeList(profiles.length > 0 ? profiles : BLURRED_PLACEHOLDERS);
      }
    } catch (error) {
      console.error('Fetch Who Liked Me Error:', error);
      setIsPremium(false);
      setWhoLikedMeList(BLURRED_PLACEHOLDERS);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Sent Likes ("Likes Sent" Tab)
  const fetchSentLikes = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await matchApi.getMySendingLikes();
      const list = resData?.data || [];
      setSentLikesList(list);
    } catch (error) {
      console.error('Fetch Sent Likes Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchWhoLikedMe();
  }, [fetchWhoLikedMe]);

  // Tab Switch Handler
  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === 'Likes Sent') {
      fetchSentLikes();
    } else if (tab === '2 Likes') {
      fetchWhoLikedMe();
    }
  };

  const handleCardPress = (item) => {
    if (activeTab === 'Likes Sent') {
      navigation?.navigate('UserProfileDetail', { userId: item.receiverId, user: item });
      return;
    }

    if (!isPremium) {
      navigation?.navigate('SubscriptionScreen');
    } else {
      navigation?.navigate('UserProfileDetail', { user: item });
    }
  };

  const renderLikeCard = ({ item }) => {
    const isSentTab = activeTab === 'Likes Sent';
    
    // Blur sirf tab lagega jab incoming likes tab ho aur user premium na ho
    const shouldBlur = !isSentTab && !isPremium;
    const imageUrl = item.profileUrl || item.image || item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
    const displayName = item.userName || item.fullName || item.name || 'User';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleCardPress(item)}
        style={styles.cardContainer}
      >
        <Image
          source={{ uri: imageUrl }}
          style={styles.cardImage}
          blurRadius={shouldBlur ? (Platform.OS === 'ios' ? 25 : 18) : 0}
          resizeMode="cover"
        />

        <View style={styles.cardOverlay}>
          <View style={styles.nameRow}>
            {shouldBlur ? (
              <View style={styles.blurredNamePlaceholder} />
            ) : (
              <Text style={styles.userName} numberOfLines={1}>
                {displayName},
              </Text>
            )}
            <Text style={styles.userAge}> {item.age || 25}</Text>
          </View>

          <View style={styles.statusRow}>
            <View style={styles.activeDot} />
            <Text style={styles.statusText}>
              {isSentTab ? 'Liked by you' : 'Recently Active'}
            </Text>
          </View>
        </View>

        {isSentTab && (
          <View style={styles.heartBadgeContainer}>
            <Text style={styles.heartIcon}>❤️</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const currentData = activeTab === 'Likes Sent' ? sentLikesList : whoLikedMeList;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Likes</Text>
      </View>

      <View style={styles.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => handleTabPress(tab)}
            style={[styles.tabItem, activeTab === tab && styles.activeTabItem]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'Likes Sent' ? `Likes Sent (${sentLikesList.length})` : tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dynamic Subtitle Banner */}
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>
          {activeTab === 'Likes Sent'
            ? 'People you have shown interest in.'
            : !isPremium
            ? upgradeMsg
            : 'prioritize your likes.'}
        </Text>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS?.primary || '#0B5324'} />
        </View>
      ) : (
        <FlatList
          data={currentData}
          keyExtractor={(item, index) => item.receiverId?.toString() || item.id?.toString() || index.toString()}
          renderItem={renderLikeCard}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No profiles found</Text>
            </View>
          }
        />
      )}

      {/* Bottom CTA */}
      {activeTab !== 'Likes Sent' && (
        <View style={styles.bottomCtaContainer}>
          {!isPremium ? (
            <TouchableOpacity
              style={styles.goldCtaButton}
              activeOpacity={0.85}
              onPress={() => navigation?.navigate('SubscriptionScreen')}
            >
              <Text style={styles.goldCtaText}>See who Likes you</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.darkCtaButton}
              activeOpacity={0.85}
              onPress={() => navigation?.navigate('BoostScreen')}
            >
              <Text style={styles.darkCtaText}>Upgrade Likes</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

export default LikesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  tabsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingVertical: 12,
  },
  tabItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  activeTabItem: {
    borderBottomWidth: 2,
    borderBottomColor: '#1A1A1A',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777777',
  },
  activeTabText: {
    color: '#1A1A1A',
    fontWeight: '700',
  },
  bannerContainer: {
    paddingHorizontal: 30,
    paddingVertical: 14,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 14,
    color: '#444444',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.35,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#EAEAEA',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  blurredNamePlaceholder: {
    width: 45,
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.45)',
    borderRadius: 6,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    maxWidth: '75%',
  },
  userAge: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#27AE60',
    marginRight: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  heartBadgeContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heartIcon: {
    fontSize: 14,
  },
  bottomCtaContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  goldCtaButton: {
    backgroundColor: '#E5A000',
    width: '90%',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 4,
  },
  goldCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  darkCtaButton: {
    backgroundColor: '#1E1E1E',
    width: '60%',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 4,
  },
  darkCtaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#888888',
  },
});