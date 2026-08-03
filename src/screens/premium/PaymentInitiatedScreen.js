import React, { useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProcessStepItem from '../../components/premium/processStepItem';

const PaymentInitiatedScreen = ({ navigation }) => {
  // Animated value tracking the live fill-up progress bar line between step 1 and step 2
  const lineProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Delays the initial growth slightly for a seamless entrance effect, then grows over 1.5 seconds
    Animated.sequence([
      Animated.delay(600),
      Animated.timing(lineProgress, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: false, // Height layout metrics modification requires false flag
      })
    ]).start();
  }, []);

  const orderDetails = {
    planName: 'Basic Plan',
    duration: '1 Months',
    price: '$19.99',
    icon: <Text style={{ fontSize: 26 }}>💎</Text>
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header Controls Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Shield Graphic Section */}
        <View style={styles.shieldVisualContainer}>
          <View style={styles.shieldOuterRing}>
            <Text style={styles.shieldIcon}>🛡️</Text>
            <View style={styles.miniCheckBadge}>
              <Text style={styles.miniCheckText}>✓</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Typography Branding Blocks */}
        <View style={styles.headingContainer}>
          <Text style={styles.mainTitle}>Payment is being processed</Text>
          <Text style={styles.subTitle}>
            Please do not close this screen or{'\n'}press the back button
          </Text>
        </View>

        {/* Selected Plan Summary Banner Display Box */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryLeft}>
            <View style={styles.avatarIconWrapper}>
              {orderDetails.icon}
            </View>
            <View>
              <Text style={styles.summaryPlanTitle}>{orderDetails.planName}</Text>
              <Text style={styles.summaryPlanDuration}>{orderDetails.duration}</Text>
            </View>
          </View>
          <Text style={styles.summaryPriceText}>{orderDetails.price}</Text>
        </View>

        {/* Animated Processing Flow Segment */}
        <View style={styles.timelineWrapper}>
          {/* Step 1: Fully Finished on Load */}
          <ProcessStepItem
            title="Payment Initiated"
            subtitle="11:24 AM"
            status="completed"
            isLast={false}
            isActiveStep={lineProgress} // Passing down the engine reference to track connection
          />

          {/* Step 2: Actively Processing on entry */}
          <ProcessStepItem
            title="Processing Payment"
            subtitle="Please wait while we confirm your payment"
            status="active"
            isLast={false}
          />

          {/* Step 3: Locked Pending Validation State */}
          <ProcessStepItem
            title="Payment Confirmation"
            subtitle="Almost there"
            status="pending"
            isLast={true}
          />
        </View>

        {/* End Branding Certification Panel */}
        <View style={styles.encryptionTrustBanner}>
          <View style={styles.trustLeftRow}>
            <Text style={styles.trustShieldIcon}>🛡️</Text>
            <View style={styles.trustTextWrapper}>
              <Text style={styles.trustTitle}>Secure Payment</Text>
              <Text style={styles.trustSub}>Your transaction is secured using 256-bit encryption</Text>
            </View>
          </View>
          <Text style={styles.trustLockIcon}>🔒</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentInitiatedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCE6', 
  },
  headerBar: {
    height: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
    width: 32,
  },
  backIcon: {
    fontSize: 24,
    color: '#1B4D22',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  shieldVisualContainer: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldOuterRing: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldIcon: {
    fontSize: 74,
  },
  miniCheckBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#22C55E',
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#FDFCE6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniCheckText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4D22',
    textAlign: 'center',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 14,
    color: '#4E6E52',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarIconWrapper: {
    marginRight: 14,
  },
  summaryPlanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4D22',
    marginBottom: 2,
  },
  summaryPlanDuration: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  summaryPriceText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B4D22',
  },
  timelineWrapper: {
    width: '100%',
    paddingHorizontal: 8,
    marginBottom: 20,
  },
  encryptionTrustBanner: {
    flexDirection: 'row',
    backgroundColor: '#F0FDF4', 
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
    padding: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  trustLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  trustShieldIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  trustTextWrapper: {
    flex: 1,
    paddingRight: 8,
  },
  trustTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 2,
  },
  trustSub: {
    fontSize: 10,
    color: '#15803D',
    lineHeight: 14,
  },
  trustLockIcon: {
    fontSize: 14,
    color: '#166534',
  },
});