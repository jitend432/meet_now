import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  RefreshControl // <--- 1. Import RefreshControl
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native'; // <--- 2. Import useFocusEffect
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import CardContainer from '../../components/chat/CardContainer';
import { matchApi } from '../../services/matchApi';
import { FONTS } from '../../constants/fonts';
import { COLORS, FONTSIZE } from '../../constants/theme';

const BASE_URL = ""; 

const MatchesScreen = ({ navigation }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // <--- State for Pull-to-Refresh
  const [hasError, setHasError] = useState(false);

  // Screen par vapas aane par automatically data update karne ke liye
  useFocusEffect(
    useCallback(() => {
      fetchMatchesData();
    }, [])
  );

  const fetchMatchesData = async (isPullToRefresh = false) => {
    try {
      if (isPullToRefresh) {
        setIsRefreshing(true);
      } else if (matches.length === 0) {
        setIsLoading(true);
      }

      setHasError(false);
      
      const response = await matchApi.getMyMatches();
      console.log(`Fetched My Matches ====>`, response);

      const matchesArray = Array.isArray(response) ? response : (response?.data || []);
      
      setMatches(matchesArray);
    } catch (error) {
      console.error("Failed to load matches list:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    fetchMatchesData(true);
  };

  const renderMatchCard = ({ item }) => {
    const matchName = item.fullName || 'User';
    const matchAge = item.age ? `, ${item.age}` : '';
    const lastMsg = item.lastMessage || 'Click message to open chat room!';
    
    const imageSource = item.profileImage
      ? { uri: item.profileImage.startsWith('http') ? item.profileImage : `${BASE_URL}${item.profileImage}` }
      : require('../../assets/images/sarah2.jpg');

    const matchTime = item.matchedAt 
      ? new Date(item.matchedAt).toLocaleDateString() 
      : 'Matched recently';

    return (
      <View style={styles.matchCard}>
        <View style={styles.avatarContainer}>
          <Image source={imageSource} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineStatusBadge} />}
        </View>

        <View style={styles.matchDetails}>
          <View style={styles.nameRow}>
            <Text style={styles.matchName}>{matchName}{matchAge}</Text>
            {item.isOnline && (
              <View style={styles.onlineIndicatorTag}>
                <Text style={styles.onlineTagText}>Online</Text>
              </View>
            )}
          </View>
          <Text style={styles.timeMetadata}>{matchTime}</Text>
          <Text style={styles.lastMessagePreview} numberOfLines={1}>{lastMsg}</Text>
        </View>

        <TouchableOpacity 
          style={styles.messageButton} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('ChatRoomScreen', { user: item })}
        >
          <Text style={styles.messageButtonText}>Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={COLORS.background} barStyle="dark-content" />
      <View style={styles.mainLayoutContainer}>
        
        <Text style={styles.screenHeading}>Your Matches</Text>
        <Text style={styles.matchesCountText}>
          You have {matches.length} {matches.length === 1 ? 'match' : 'matches'}
        </Text>

        <View style={styles.promoBanner}>
          <View style={styles.promoIconCircle}>
            <FontAwesomeFreeSolid name="heart" size={14} color="#265c32" />
          </View>
          <View style={styles.promoTextSection}>
            <Text style={styles.promoTitle}>New Matches</Text>
            <Text style={styles.promoSubtitle}>Start a conversation with your matches!</Text>
          </View>
        </View>

        {isLoading && matches.length === 0 ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#265c32" />
            <Text style={styles.infoText}>Loading matches...</Text>
          </View>
        ) : hasError ? (
          <View style={styles.centerContainer}>
            <Text style={styles.infoText}>Couldn't load matches.</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => fetchMatchesData()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : matches.length === 0 ? (
          <View style={styles.centerContainer}>
            <FontAwesomeFreeSolid name="user-friends" size={40} color="#ccc" />
            <Text style={styles.infoText}>No active matches found yet!</Text>
          </View>
        ) : (
          <FlatList
            data={matches}
            keyExtractor={(item) => (item.userId || item.id || Math.random()).toString()}
            renderItem={renderMatchCard}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            // Pull-To-Refresh Features Add Kiye Hain
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={['#265c32']} // Android loader color
                tintColor="#265c32"  // iOS loader color
              />
            }
          />
        )}

      </View>
    </SafeAreaView>
  );
};

export default MatchesScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, 
  },
  mainLayoutContainer: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 16,
    backgroundColor:'#ffffff'
  },
  screenHeading: {
    fontSize: 26,
    color: '#265c32',
    fontFamily: FONTS.SEMIBOLD
  },
  matchesCountText: {
    fontSize: 14,
    color: '#7f9c7f',
    marginTop: 4,
    marginBottom: 16,
    fontFamily: FONTS.REGULAR
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#43a047', 
    borderRadius: 20,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin:2
  },
  promoIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    justify: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  promoTextSection: {
    flex: 1,
  },
  promoTitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
    fontFamily: FONTS.MEDIUM
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#e8f5e9',
    fontFamily: FONTS.REGULAR
  },
  listContainer: {
    paddingBottom: 16,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    margin:2
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#e1d9b7',
  },
  onlineStatusBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#00e676',
    position: 'absolute',
    bottom: 0,
    right: 2,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  matchDetails: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  matchName: {
    fontSize: 15,
    color: '#265c32',
    marginRight: 6,
    fontFamily: FONTS.REGULAR
  },
  onlineIndicatorTag: {
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: '#a5d6a7',
  },
  onlineTagText: {
    fontSize: 9,
    color: '#2e7d32',
    fontWeight: '700',
  },
  timeMetadata: {
    fontSize: 11,
    color: '#9e9e9e',
    marginBottom: 2,
  },
  lastMessagePreview: {
    fontSize: 12,
    color: '#616161',
    fontWeight: '500',
  },
  messageButton: {
    backgroundColor: '#265c32',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  messageButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  retryButton: { 
    marginTop: 15, 
    backgroundColor: COLORS.white, 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    borderRadius: 8
  },
  retryText: { 
    color: '#6f0a0a', 
    fontFamily: FONTS.REGULAR 
  },
  infoText: {
    fontFamily: FONTS.REGULAR,
    fontSize: 18,   
  },
  centerContainer: {
    flex: 0.7,
    alignItems: 'center',
    justifyContent: 'center'
  }
});