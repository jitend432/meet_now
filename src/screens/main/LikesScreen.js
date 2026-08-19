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

const TAB_KEYS = {
  LIKES: 'likes',
  SENT: 'sent',
  TOP_PICKS: 'top_picks',
};

const LikesScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState(TAB_KEYS.LIKES);
  const [loading, setLoading] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Lists & Count States
  const [whoLikedMeList, setWhoLikedMeList] = useState([]);
  const [totalLikesCount, setTotalLikesCount] = useState(0);
  const [sentLikesList, setSentLikesList] = useState([]);
  const [topPicksList, setTopPicksList] = useState([]);
  const [upgradeMsg, setUpgradeMsg] = useState('Upgrade to Gold to see people who already liked you.');

  // 1. Fetch Incoming Likes ("Likes" Tab)
  const fetchWhoLikedMe = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await matchApi.getWhoLikedMe(0, 10);

      if (resData?.status === 400 || (resData?.msg && resData?.msg.toLowerCase().includes('upgrade'))) {
        setIsPremium(false);
        setUpgradeMsg(resData?.msg || 'Upgrade your plan to see who liked you.');
        setWhoLikedMeList(BLURRED_PLACEHOLDERS);
        setTotalLikesCount(BLURRED_PLACEHOLDERS.length);
      } else {
        setIsPremium(true);
        const profiles = resData?.data || (Array.isArray(resData) ? resData : (resData?.content || []));
        setWhoLikedMeList(profiles);
        setTotalLikesCount(resData?.totalElements ?? profiles.length);
      }
    } catch (error) {
      console.error('Fetch Who Liked Me Error:', error);
      setIsPremium(false);
      setWhoLikedMeList(BLURRED_PLACEHOLDERS);
      setTotalLikesCount(BLURRED_PLACEHOLDERS.length);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Fetch Sent Likes ("Likes Sent" Tab)
  const fetchSentLikes = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await matchApi.getMySendingLikes();
      const list = resData?.data || (Array.isArray(resData) ? resData : []);
      setSentLikesList(list);
    } catch (error) {
      console.error('Fetch Sent Likes Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Fetch Top Picks ("Top Picks" Tab)
  const fetchTopPicks = useCallback(async () => {
    try {
      setLoading(true);
      const resData = await matchApi.getTopPicks();
      const list = Array.isArray(resData)
        ? resData
        : (resData?.data || resData?.content || []);
      setTopPicksList(list);
    } catch (error) {
      console.error('Fetch Top Picks Error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchWhoLikedMe();
  }, [fetchWhoLikedMe]);

  // Tab Switch Handler
  const handleTabPress = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey === TAB_KEYS.SENT) {
      fetchSentLikes();
    } else if (tabKey === TAB_KEYS.LIKES) {
      fetchWhoLikedMe();
    } else if (tabKey === TAB_KEYS.TOP_PICKS) {
      fetchTopPicks();
    }
  };

  const handleCardPress = (item) => {
    if (activeTab === TAB_KEYS.SENT) {
      // Sent likes mein receiver profile open hogi
      navigation?.navigate('UserProfileDetail', { 
        userId: item.receiverId, 
        user: item 
      });
      return;
    }

    if (activeTab === TAB_KEYS.TOP_PICKS) {
      const topPickId = item.id || item.registration_id || item.userId;
      navigation?.navigate('UserProfileDetail', { 
        userId: topPickId, 
        user: item 
      });
      return;
    }

    // Incoming Likes tab
    if (!isPremium) {
      navigation?.navigate('SubscriptionScreen');
    } else {
      // Incoming likes mein sender ki profile open hogi
      navigation?.navigate('UserProfileDetail', { 
        userId: item.senderId || item.id, 
        user: item 
      });
    }
  };

  const renderLikeCard = ({ item }) => {
    const isLikesTab = activeTab === TAB_KEYS.LIKES;
    const isSentTab = activeTab === TAB_KEYS.SENT;
    const isTopPicksTab = activeTab === TAB_KEYS.TOP_PICKS;

    // Incoming likes tab par free user ke liye blur hoga
    const shouldBlur = isLikesTab && !isPremium;

    // Fallback safe extraction
    const imageUrl =
      item.profileUrl ||
      item.profilePhoto ||
      item.image ||
      item.avatarUrl ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';

    const displayName = item.userName || item.fullName || item.name || 'User';
    const displayAge = item.age || 25;

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
            <Text style={styles.userAge}> {displayAge}</Text>
          </View>

          <View style={styles.statusRow}>
            <View style={[styles.activeDot, isTopPicksTab && styles.topPickDot]} />
            <Text style={styles.statusText}>
              {isSentTab
                ? 'Liked by you'
                : isTopPicksTab
                ? (item.locations?.city || 'Top Pick')
                : 'Recently Active'}
            </Text>
          </View>
        </View>

        {isSentTab && (
          <View style={styles.heartBadgeContainer}>
            <Text style={styles.heartIcon}>❤️</Text>
          </View>
        )}

        {isTopPicksTab && (
          <View style={styles.starBadgeContainer}>
            <Text style={styles.starIcon}>⭐</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getCurrentData = () => {
    if (activeTab === TAB_KEYS.SENT) return sentLikesList;
    if (activeTab === TAB_KEYS.TOP_PICKS) return topPicksList;
    return whoLikedMeList;
  };

  const tabsConfig = [
    {
      key: TAB_KEYS.LIKES,
      label: totalLikesCount > 0 ? `${totalLikesCount} Likes` : 'Likes',
    },
    {
      key: TAB_KEYS.SENT,
      label: `Likes Sent (${sentLikesList.length})`,
    },
    {
      key: TAB_KEYS.TOP_PICKS,
      label: topPicksList.length > 0 ? `${topPicksList.length} Top Picks` : 'Top Picks',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Likes</Text>
      </View>

      {/* Tabs Row */}
      <View style={styles.tabsRow}>
        {tabsConfig.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => handleTabPress(tab.key)}
            style={[styles.tabItem, activeTab === tab.key && styles.activeTabItem]}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Dynamic Subtitle Banner */}
      <View style={styles.bannerContainer}>
        <Text style={styles.bannerText}>
          {activeTab === TAB_KEYS.SENT
            ? 'People you have shown interest in.'
            : activeTab === TAB_KEYS.TOP_PICKS
            ? 'Curated daily recommendations personalized for you.'
            : !isPremium
            ? upgradeMsg
            : 'Prioritize your incoming likes.'}
        </Text>
      </View>

      {/* Profiles Grid */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS?.primary || '#0B5324'} />
        </View>
      ) : (
        <FlatList
          data={getCurrentData()}
          keyExtractor={(item, index) => {
            const rawId =
              activeTab === TAB_KEYS.LIKES
                ? item?.senderId
                : activeTab === TAB_KEYS.SENT
                ? item?.receiverId
                : item?.id || item?.registration_id;

            return `${activeTab}-${rawId || index}-${index}`;
          }}
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

      {/* Bottom Floating CTA for Free Incoming Likes */}
      {activeTab === TAB_KEYS.LIKES && (
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
  topPickDot: {
    backgroundColor: '#F5A623',
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
  starBadgeContainer: {
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
  starIcon: {
    fontSize: 13,
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