// screens/chat/SearchChatScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

// Optional assets wrapper fallback path
import SarahAvatar from '../../assets/images/sarah.png';

const SearchChatScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock datasets extracted from the template mockups
  const recentSearches = ["coffee", "movie", "hello"];
  const suggestedSearches = ["trip", "weekend", "photo"];

  const sampleResults = [
    { id: '1', name: 'Sarah', time: '12 Apr, 10:30 AM', message: "Let's grab some coffee tomorrow?", highlight: 'coffee' },
    { id: '2', name: 'Sarah', time: '10 Apr, 09:15 AM', message: "I love coffee ☕", highlight: 'coffee' },
    { id: '3', name: 'Sarah', time: '05 Apr, 08:45 PM', message: "Coffee is always a good idea!", highlight: 'co' },
    { id: '4', name: 'Sarah', time: '02 Apr, 04:20 PM', message: "How about a coffee date?", highlight: 'coffee' },
    { id: '5', name: 'Sarah', time: '01 Apr, 11:00 AM', message: "Weekend coffee plans?", highlight: 'co' },
  ];

  // Text highlighting handler logic helper helper function
  const renderHighlightedText = (text, highlight) => {
    if (!highlight) return <Text>{text}</Text>;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <Text style={styles.messageTextPlain}>
        {parts.map((part, index) => 
          part.toLowerCase() === highlight.toLowerCase()
            ? <Text key={index} style={styles.highlightTextMatch}>{part}</Text>
            : part
        )}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContentLayout}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Integrated Card Deck Surface */}
        <View style={styles.integratedMainCard}>
          
          {/* Header Row */}
          <View style={styles.profileNavbarRow}>
            <TouchableOpacity 
              activeOpacity={0.7} 
              onPress={() => navigation?.goBack()} 
              style={styles.backButtonTouchable}
            >
              <FontAwesomeFreeSolid name="arrow-left" size={16} color="#0B5324" />
            </TouchableOpacity>
            <Text style={styles.navbarTitleText}>
              {searchQuery.length > 0 ? "Search Results" : "Search Chat"}
            </Text>
            <View style={styles.placeholderBox} />
          </View>

          {/* Search Text Input Control Input Box element */}
          <View style={styles.searchBarWrapperContainer}>
            <View style={styles.searchBarInnerFrame}>
              <FontAwesomeFreeSolid name="search" size={16} color="#757575" style={styles.searchIconLens} />
              <TextInput
                style={styles.textInputBoxControl}
                placeholder="Search messages..."
                placeholderTextColor="#9e9e9e"
                value={searchQuery}
                onChangeText={(text) => setSearchQuery(text)}
                autoFocus={true}
              />
            </View>
          </View>

          {/* Conditional Layout View Render Switch State */}
          {searchQuery.length === 0 ? (
            
            /* 🌟 STATE A: Recent & Suggested Searches UI Block (image_7f209f.png) */
            <View style={styles.suggestionsBaseBodyWrapper}>
              
              {/* Recent Searches Card section */}
              <Text style={styles.listSectionTitleHeader}>Recent Searches</Text>
              <View style={styles.capsuleCardItemContainer}>
                {recentSearches.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.pillRowClickActionNode}
                    onPress={() => setSearchQuery(item)}
                  >
                    <View style={styles.hollowCircleIconBullet} />
                    <Text style={styles.pillOptionLabelText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Suggested Queries Card Section */}
              <Text style={[styles.listSectionTitleHeader, styles.spacingTopSectionModifier]}>Suggested</Text>
              <View style={styles.capsuleCardItemContainer}>
                {suggestedSearches.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.pillRowClickActionNode}
                    onPress={() => setSearchQuery(item)}
                  >
                    <View style={styles.hollowCircleIconBullet} />
                    <Text style={styles.pillOptionLabelText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>

            </View>

          ) : (
            
            /* 🌟 STATE B: Filtered List Search Results View Block (image_7f20a6.png) */
            <View style={styles.resultsBaseBodyWrapper}>
              <Text style={styles.resultsCounterTitleLabel}>
                {sampleResults.length} Results Found
              </Text>

              {/* Search Result Map Iteration Loop List */}
              {sampleResults.map((item) => (
                <View key={item.id} style={styles.chatMessageListItemBlock}>
                  
                  {/* User Profile Thumbnail Avatar image column element */}
                  <Image source={SarahAvatar} style={styles.chatItemRowProfileAvatar} />

                  {/* Right side content core context detail column */}
                  <View style={styles.messageMetaTextDetailsColumnBox}>
                    <View style={styles.topNameTimeRowHeaderMeta}>
                      <Text style={styles.chatTargetProfileNameText}>{item.name}</Text>
                      <Text style={styles.messageTimestampTextLabel}>{item.time}</Text>
                    </View>
                    
                    {/* Render message with bold highlighted parts matches query string segment text */}
                    <Text style={styles.messageTextPlain} numberOfLines={2}>
                      {renderHighlightedText(item.message, searchQuery)}
                    </Text>
                  </View>

                </View>
              ))}
            </View>

          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchChatScreen;

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#f5f5f5', 
  },
  scrollContentLayout: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexGrow: 1,
  },
  integratedMainCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    paddingBottom: 24,
    minHeight: 500,
  },
  profileNavbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
  },
  backButtonTouchable: {
    padding: 4,
  },
  navbarTitleText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B5324',
    textAlign: 'center',
  },
  placeholderBox: { 
    width: 24 
  },
  searchBarWrapperContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#fcfcfc',
  },
  searchBarInnerFrame: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2', // Soft gray search text box background capsule shape matching layout mockup
    borderRadius: 20,
    paddingHorizontal: 14,
    height: 42,
  },
  searchIconLens: {
    marginRight: 8,
  },
  textInputBoxControl: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
    fontWeight: '400',
    paddingVertical: 0,
  },
  suggestionsBaseBodyWrapper: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listSectionTitleHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 10,
  },
  spacingTopSectionModifier: {
    marginTop: 24,
  },
  capsuleCardItemContainer: {
    backgroundColor: '#f9f9f9', // Group bounds container inner background box
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  pillRowClickActionNode: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  hollowCircleIconBullet: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#757575', // Bullet circle wireframe item selector dot styling reference context
    marginRight: 12,
  },
  pillOptionLabelText: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '500',
  },
  resultsBaseBodyWrapper: {
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  resultsCounterTitleLabel: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 14,
  },
  chatMessageListItemBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5', // Soft grid alignment baseline layout divider line elements
  },
  chatItemRowProfileAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
  },
  messageMetaTextDetailsColumnBox: {
    flex: 1,
  },
  topNameTimeRowHeaderMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatTargetProfileNameText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#212121',
  },
  messageTimestampTextLabel: {
    fontSize: 11,
    color: '#9e9e9e',
    fontWeight: '400',
  },
  messageTextPlain: {
    fontSize: 13,
    color: '#616161',
    lineHeight: 18,
  },
  highlightTextMatch: {
    color: '#b86214', // Exact bronze/orange highlight font text color weight match from mock image pattern reference
    fontWeight: '700',
  }
});