import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PaymentMethodItem from '../../components/premium/PaymentMethodItem';

const PaymentMethodScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState('upi');

  // Hardcoded mockup data reflecting active purchase details
  const orderDetails = {
    planName: 'Basic Plan',
    duration: '1 Months',
    price: '$19.99',
    icon: <Text style={{ fontSize: 26 }}>💎</Text>
  };

  const paymentMethods = [
    {
      id: 'upi',
      title: 'UPI',
      subtitle: 'Pay using any UPI app',
      icon: <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#666' }}>UPI</Text>,
    },
    {
      id: 'card',
      title: 'Debit / Credit Card',
      subtitle: 'Visa, Mastercard, Rupay & more',
      icon: <Text style={{ fontSize: 20 }}>💳</Text>,
    },
    {
      id: 'net_banking',
      title: 'Net Banking',
      subtitle: 'All major banks supported',
      icon: <Text style={{ fontSize: 20 }}>🏛️</Text>,
    },
    {
      id: 'wallets',
      title: 'Wallets',
      subtitle: 'PhonePe, Paytm, Amazon Pay & more',
      icon: <Text style={{ fontSize: 20 }}>👛</Text>,
    },
  ];

  const handlePaymentProcessing = () => {
    // Alert.alert(
    //   'Processing Payment', 
    //   `Initiating payment request via target channel: ${selectedMethod.toUpperCase()}`
    // );
    navigation.navigate('PaymentInitiatedScreen')
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Upper Navigation Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation?.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title Text Heading Blocks */}
        <View style={styles.titleSection}>
          <Text style={styles.mainHeading}>Complete Your Purchase</Text>
          <View style={styles.securityBadgeRow}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.securityText}>Secure & Encrypted Payment</Text>
          </View>
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

        {/* Selection Subtitle Flag */}
        <Text style={styles.selectionSectionTitle}>Select Payment Method</Text>

        {/* Dynamic Mapping over available selections */}
        <View style={styles.methodsListWrapper}>
          {paymentMethods.map((method) => (
            <PaymentMethodItem
              key={method.id}
              title={method.title}
              subtitle={method.subtitle}
              icon={method.icon}
              isSelected={selectedMethod === method.id}
              onPress={() => setSelectedMethod(method.id)}
            />
          ))}
        </View>

        {/* Structural Call To Action Submission Button */}
        <TouchableOpacity 
          style={styles.submitPayButton}
          onPress={handlePaymentProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>Continue to Pay</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentMethodScreen;

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
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  titleSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B4D22',
    marginBottom: 6,
  },
  securityBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 13,
    marginRight: 6,
    color: '#4E6E52',
  },
  securityText: {
    fontSize: 13,
    color: '#4E6E52',
    fontWeight: '500',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
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
  selectionSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B4D22',
    marginBottom: 16,
  },
  methodsListWrapper: {
    marginBottom: 20,
  },
  submitPayButton: {
    backgroundColor: '#1B4D22',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});