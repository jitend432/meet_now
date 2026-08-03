import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// App Themes & Components
import { COLORS } from '../../constants/theme';
import { FONTS } from '../../constants/fonts';
import Button from '../../components/common/Button';

// Exact Vector Icons wrapper matching your imports
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";

const TransactionDetailsScreen = ({ navigation }) => {
  
  const handleDownloadInvoice = () => {
    // Custom invoice download handling logic here
    console.log('Downloading invoice...');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* StatusBar according to design theme background */}
      <StatusBar backgroundColor="#FBF7DE" barStyle="dark-content" />
      
      {/* Header Container */}
      <View style={styles.headerContainer}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation?.goBack()}
          activeOpacity={0.7}
        >
          <FontAwesomeFreeSolid name="arrow-left" size={20} color="#1C431C" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
      >
        {/* Top Product Meta Info Card */}
        <View style={[styles.card, styles.shadowEffects]}>
          <View style={styles.productIconWrapper}>
            <FontAwesomeFreeSolid name="file-alt" size={20} color="#FFFFFF" />
          </View>
          
          <View style={styles.productInfoTextSection}>
            <Text style={styles.productMainTitle}>Basic Plan - Monthly</Text>
            <Text style={styles.productDescription}>Subscription Payment</Text>
            
            {/* Status Badge */}
            <View style={styles.badgeSuccess}>
              <Text style={styles.badgeSuccessText}>
                <FontAwesomeFreeSolid name="check-circle" size={12} color="#1E5E1E" /> Paid
              </Text>
            </View>
          </View>

          <View style={styles.priceLayoutWrapper}>
            <Text style={styles.priceText}>$19.99</Text>
            <Text style={styles.currencyText}>USD</Text>
          </View>
        </View>

        {/* Breakdown Detailed Metadata Box */}
        <View style={[styles.card, styles.detailsCardBox, styles.shadowEffects]}>
          
          {/* Row item: Transaction ID */}
          <View style={styles.listRowItem}>
            <View style={styles.metaRowLabelGroup}>
              <FontAwesomeFreeSolid name="hashtag" size={14} color="#1C431C" style={styles.metaRowIcon} />
              <Text style={styles.metaLabelText}>Transaction ID</Text>
            </View>
            <Text style={styles.metaValueText}>TRG4356678888</Text>
          </View>

          {/* Row item: Date & Time */}
          <View style={styles.listRowItem}>
            <View style={styles.metaRowLabelGroup}>
              <FontAwesomeFreeSolid name="calendar-alt" size={14} color="#1C431C" style={styles.metaRowIcon} />
              <Text style={styles.metaLabelText}>Date & Time</Text>
            </View>
            <Text style={styles.metaValueText}>09 June, 11:20 AM</Text>
          </View>

          {/* Row item: Amount Paid */}
          <View style={styles.listRowItem}>
            <View style={styles.metaRowLabelGroup}>
              <FontAwesomeFreeSolid name="dollar-sign" size={14} color="#1C431C" style={styles.metaRowIcon} />
              <Text style={styles.metaLabelText}>Amount Paid</Text>
            </View>
            <Text style={styles.metaValueText}>$19.99</Text>
          </View>

          {/* Row item: Payment Method */}
          <View style={[styles.listRowItem, { borderBottomWidth: 0, paddingBottom: 4 }]}>
            <View style={styles.metaRowLabelGroup}>
              <FontAwesomeFreeSolid name="wallet" size={14} color="#1C431C" style={styles.metaRowIcon} />
              <Text style={styles.metaLabelText}>Payment method</Text>
            </View>
            <Text style={styles.metaValueText}>UPI</Text>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Download Button */}
      <View style={styles.stickyFooterActionButton}>
        <Button 
          title="Download Invoice" 
          onPress={handleDownloadInvoice} 
          loading={false}
          style={styles.invoicePrimaryButton}
        />
      </View>
    </SafeAreaView>
  );
};

export default TransactionDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBF7DE', // Soft cream canvas
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 24,
    color: '#1C431C',
    fontFamily: FONTS.SEMIBOLD,
    textAlign: 'center',
    flex: 1,
  },
  headerPlaceholder: {
    width: 32, // Symmetrical center balance spacer
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  card: {
    backgroundColor: COLORS.white || '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  shadowEffects: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  productIconWrapper: {
    backgroundColor: '#1C431C',
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productInfoTextSection: {
    flex: 1,
    marginLeft: 14,
  },
  productMainTitle: {
    fontSize: 16,
    color: '#1C431C',
    fontFamily: FONTS.SEMIBOLD,
  },
  productDescription: {
    fontSize: 13,
    color: COLORS.textLight || '#556B2F',
    fontFamily: FONTS.REGULAR,
    marginTop: 2,
  },
  badgeSuccess: {
    alignSelf: 'flex-start',
    backgroundColor: '#D1F2D1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  badgeSuccessText: {
    fontSize: 12,
    color: '#1E5E1E',
    fontFamily: FONTS.SEMIBOLD,
  },
  priceLayoutWrapper: {
    alignItems: 'flex-end',
  },
  priceText: {
    fontSize: 20,
    color: '#1C431C',
    fontFamily: FONTS.SEMIBOLD,
  },
  currencyText: {
    fontSize: 12,
    color: '#556B2F',
    fontFamily: FONTS.REGULAR,
    marginTop: 1,
  },
  detailsCardBox: {
    flexDirection: 'column',
    paddingVertical: 8,
  },
  listRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0EFE0',
  },
  metaRowLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaRowIcon: {
    marginRight: 12,
    opacity: 0.8,
  },
  metaLabelText: {
    fontSize: 14,
    color: '#556B2F',
    fontFamily: FONTS.REGULAR,
  },
  metaValueText: {
    fontSize: 14,
    color: '#1C431C',
    fontFamily: FONTS.SEMIBOLD,
  },
  stickyFooterActionButton: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    paddingTop: 12,
    backgroundColor: '#FBF7DE',
  },
  invoicePrimaryButton: {
    backgroundColor: '#235D2A', // Dark green matching the button in screenshot
    borderRadius: 10,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
    shadowOpacity: 0,
  },
});