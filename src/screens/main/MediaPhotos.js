// screens/chat/MediaPhotosScreen.js
import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

const { width } = Dimensions.get('window');
const GRID_ITEM_SIZE = (width - 32 - 24 - 12) / 2; 

const MediaPhotosScreen = ({ navigation }) => {
  // 🌟 Active Tab State ('photos' ya 'videos')
  const [activeTab, setActiveTab] = useState('videos'); // Reference image ke mutabik default videos h

  // 🌟 1. Photos ke liye alag data section
  const photoItems = [
    { id: 'p1', source: require('../../assets/images/sarah2.jpg') },
    { id: 'p2', source: require('../../assets/images/sarah3.jpg') },
    { id: 'p3', source: require('../../assets/images/sarah2.jpg') },
    { id: 'p4', source: require('../../assets/images/sarah3.jpg') },
  ];

  // 🌟 2. Videos ke liye alag data section (Aap thumbnail images use kar sakte hain)
  const videoItems = [
    { id: 'v1', source: require('../../assets/images/sarah3.jpg'), isVideo: true },
    { id: 'v2', source: require('../../assets/images/sarah2.jpg'), isVideo: true },
    { id: 'v3', source: require('../../assets/images/sarah3.jpg'), isVideo: true },
    { id: 'v4', source: require('../../assets/images/sarah3.jpg'), isVideo: true },
    { id: 'v5', source: require('../../assets/images/sarah2.jpg'), isVideo: true },
    { id: 'v6', source: require('../../assets/images/sarah2.jpg'), isVideo: true },
  ];

  // 🌟 Active tab ke mutabik sahi array select karna
  const currentItems = activeTab === 'photos' ? photoItems : videoItems;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContentLayout}
        showsVerticalScrollIndicator={false}
      >
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
            <Text style={styles.navbarTitleText}>Media & Photos</Text>
            <View style={styles.placeholderBox} />
          </View>

          {/* Segmented Switch Tab Container */}
          <View style={styles.tabToggleWrapper}>
            <View style={styles.tabToggleBackgroundContainer}>
              
              {/* Photos Tab Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.tabToggleButton,
                  activeTab === 'photos' && styles.tabToggleButtonActive
                ]}
                onPress={() => setActiveTab('photos')} // Click par photos active block ho jayega
              >
                <Text style={[
                  styles.tabButtonLabelText,
                  activeTab === 'photos' && styles.tabButtonLabelTextActive
                ]}>
                  Photos
                </Text>
              </TouchableOpacity>

              {/* Videos Tab Button */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={[
                  styles.tabToggleButton,
                  activeTab === 'videos' && styles.tabToggleButtonActive
                ]}
                onPress={() => setActiveTab('videos')} // Click par videos active block ho jayega
              >
                <Text style={[
                  styles.tabButtonLabelText,
                  activeTab === 'videos' && styles.tabButtonLabelTextActive
                ]}>
                  Videos
                </Text>
              </TouchableOpacity>

            </View>
          </View>

          {/* Grid View Section - Content changes dynamically based on activeTab */}
          <View style={styles.gridMediaLayoutContainer}>
            {currentItems.map((item) => (
              <View key={item.id} style={styles.gridCardItemFrame}>
                <Image 
                  source={item.source}
                  style={styles.gridDisplayMediaAsset}
                  resizeMode="cover"
                />
                
                {/* 🌟 Optional: Agar tab 'videos' hai toh video play icon overlay dikha sakte hain */}
                {item.isVideo && (
                  <View style={styles.videoIconOverlay}>
                    <FontAwesomeFreeSolid name="play" size={14} color="#ffffff" />
                  </View>
                )}
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MediaPhotosScreen;

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
  },
  profileNavbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#fcfcfc',
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
  tabToggleWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  tabToggleBackgroundContainer: {
    flexDirection: 'row',
    backgroundColor: '#eeeeee', 
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
  },
  tabToggleButton: {
    flex: 1,
    height: 38,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabToggleButtonActive: {
    backgroundColor: '#0B5324', 
  },
  tabButtonLabelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
  },
  tabButtonLabelTextActive: {
    color: '#ffffff', 
  },
  gridMediaLayoutContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    marginTop: 4,
  },
  gridCardItemFrame: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE,
    borderRadius: 16, 
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#f5f5f5',
    borderWidth: 0.5,
    borderColor: '#e0e0e0',
    position: 'relative', // Overlay icons alignment handle karne ke liye
  },
  gridDisplayMediaAsset: {
    width: '100%',
    height: '100%',
  },
  videoIconOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)', // Light overlay shadow for contrast
    justifyContent: 'center',
    alignItems: 'center',
  }
});