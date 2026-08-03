import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RazorpayCheckout from 'react-native-razorpay';
import PlanCard from '../../components/premium/PlanCard';
import planApi from '../../services/planApi';
import { useAppSelector } from '../../redux/hooks';

const { width } = Dimensions.get('window');

const PremiumPlansScreen = ({ navigation }) => {

  const [selectedDuration, setSelectedDuration] = useState('monthly');
  const [activeIndex, setActiveIndex] = useState(0);
  const [dbPlans, setDbPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // ⚠️ NOTE: Is userId ko apne auth state/context se dynamic nikaal lena
  const currentUserId = useAppSelector((state) => state.auth.userId); 

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await planApi.getActivePlans(0, 10, 'id', 'asc');
      const plansList = response?.data?.data || [];
      const activePlans = plansList.filter(p => p.active);
      setDbPlans(activePlans);

      if (activePlans.length > 0) {
        setActiveIndex(0);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ HANDLER WITH YOUR NEW APIS
  // const handlePlanSelect = async (plan) => {
  //   if (plan.price === 0) {
  //     Alert.alert('Free Plan', 'You are already on the free plan');
  //     return;
  //   }

  //   try {
  //     setIsProcessingPayment(true);

  //     // STEP 1: Calling your planApi.createOrder
  //     // Backend expects: userId and planType
  //     const orderData = await planApi.createOrder(currentUserId, plan.planType);

  //     // Backend response se Razorpay Order ID check karein (Aapke backend response ke key ke according name verify kar lena, e.g., orderData.id ya orderData.orderId)
  //     const razorpayOrderId = orderData?.id || orderData?.orderId;

  //     if (!razorpayOrderId) {
  //       throw new Error("Order ID missing from backend response");
  //     }

  //     // STEP 2: Razorpay Options Configuration
  //     const options = {
  //       description: `Subscription for ${plan.planType}`,
  //       currency: 'INR',
  //       key: 'rzp_test_YOUR_KEY_HERE', // ⚠️ Apni Razorpay Test/Live Key dalein
  //       amount: plan.price * 100, // Amount in paise
  //       name: 'Your App Name',
  //       order_id: razorpayOrderId, 
  //       prefill: {
  //         email: 'user@example.com', // Optional: dynamic user email
  //         contact: '9999999999',
  //         name: 'Customer Name'
  //       },
  //       theme: { color: '#1B4D22' }
  //     };

  //     setIsProcessingPayment(false); // Gateway khulne se pehle main loader off

  //     // STEP 3: Open Razorpay Checkout Gateway
  //     RazorpayCheckout.open(options)
  //       .then(async (data) => {
  //         setIsProcessingPayment(true); // Verification ke time loader phir se ON

  //         // STEP 4: Calling your planApi.verifyPayment
  //         // Backend expects: razorpayOrderId, razorpayPaymentId, razorpaySignature
  //         const verificationResult = await planApi.verifyPayment(
  //           data.razorpay_order_id,
  //           data.razorpay_payment_id,
  //           data.razorpay_signature
  //         );

  //         setIsProcessingPayment(false);

  //         // Assuming your backend returns a success flag or message
  //         Alert.alert('Success 🎉', 'Your premium subscription is now active!', [
  //           { text: 'Awesome', onPress: () => navigation.goBack() }
  //         ]);
  //       })
  //       .catch((error) => {
  //         setIsProcessingPayment(false);
  //         console.log('Razorpay Gateway Error:', error);
  //         Alert.alert('Payment Cancelled', error.description || 'Process was interrupted.');
  //       });

  //   } catch (err) {
  //     setIsProcessingPayment(false);
  //     console.error("Payment Flow Error:", err);
  //     Alert.alert('Error', 'Could not initiate payment. Please try again.');
  //   }
  // };

//   const handlePlanSelect = async (plan) => {
//   if (plan.price === 0) {
//     Alert.alert('Free Plan', 'You are already on the free plan');
//     return;
//   }

//   if (!currentUserId) {
//     Alert.alert('Error', 'User ID not found. Please log in again.');
//     return;
//   }

//   try {
//     setIsProcessingPayment(true);

//     // const orderResponse = await planApi.createOrder(currentUserId, plan.planType);
    
//     // console.log("Backend Raw Response:", JSON.stringify(orderResponse));

//     // const responseData = orderResponse?.data; 
//     // const razorpayOrderId = responseData?.razorpayOrderId;
//     // const razorpayKeyId = responseData?.razorpayKeyId;
    
   
    
//     // const finalAmount = responseData?.amountInr ? responseData.amountInr : plan.price;

//     // if (!razorpayOrderId) {
//     //   throw new Error("Not getting razorpayOrderId ");
//     // }
//     const userIdToSend = Number(currentUserId) || currentUserId; 

//     console.log("🚀 Sending to Backend:", { userId: userIdToSend, planType: plan.planType });

//     const orderResponse = await planApi.createOrder(userIdToSend, plan.planType);
    
//     console.log("=== FINAL RESPONSE DEBUG ===");
//     console.log("Raw Response Object:", JSON.stringify(orderResponse));

    
//     const baseData = orderResponse?.data || orderResponse;
    
//     const razorpayOrderId = baseData?.razorpayOrderId || baseData?.data?.razorpayOrderId;
//     const razorpayKeyId = baseData?.razorpayKeyId || baseData?.data?.razorpayKeyId;
//     const amountInr = baseData?.amountInr || baseData?.data?.amountInr;

//     console.log("🎯 Extracted Razorpay Order ID:", razorpayOrderId);
//     console.log("🎯 Extracted Razorpay Key ID:", razorpayKeyId);
//     console.log("🎯 Extracted Amount INR:", amountInr);

//     if (!razorpayOrderId) {
//       throw new Error(`Failed to parse backend response. Keys received: ${Object.keys(orderResponse || {}).join(', ')}`);
//     }

//     // 2. Razorpay Options Configuration
//     const options = {
//       description: `Subscription for ${plan.planType}`,
//       currency: 'INR',
//       key: razorpayKeyId, 
//       amount: finalAmount, 
//       name: 'Your App Name',
//       order_id: razorpayOrderId, 
//       prefill: {
//         email: 'user@example.com',
//         contact: '9999999999',
//         name: 'Customer Name'
//       },
//       theme: { color: '#1B4D22' }
//     };

//     setIsProcessingPayment(false); 

//     // 3. Open Razorpay Checkout Gateway
//     RazorpayCheckout.open(options)
//       .then(async (data) => {
//         setIsProcessingPayment(true); // Verification ke liye screen freeze loader ON

//         console.log("Razorpay Gateway Success Response:", data);

//         // 4. API Call: Verify Payment
//         // Image me dikhaye camelCase fields ke according data bhej rahe hain
//         const verificationResult = await planApi.verifyPayment(
//           data.razorpay_order_id,    // standard response from razorpay native SDK
//           data.razorpay_payment_id,  // standard response from razorpay native SDK
//           data.razorpay_signature    // standard response from razorpay native SDK
//         );

//         console.log("Verification Success Result:", verificationResult);
//         setIsProcessingPayment(false);

//         // Agar backend verification response success hai (status: true)
//         if (verificationResult?.status === true) {
//           Alert.alert('Success 🎉', 'Your premium subscription is now active!', [
//             { text: 'Awesome', onPress: () => navigation.goBack() }
//           ]);
//         } else {
//           Alert.alert('Pending/Failed', verificationResult?.msg || 'Verification response negative.');
//         }
//       })
//       .catch((error) => {
//         setIsProcessingPayment(false);
//         console.log('Razorpay Gateway Cancel/Error:', error);
//         Alert.alert('Payment Cancelled', error.description || 'Process was interrupted.');
//       });

//   } catch (err) {
//     setIsProcessingPayment(false);
//     console.error("CRITICAL ERROR IN PAYMENT FLOW:", err);
//     Alert.alert('Payment Error', err.message || 'Something went wrong while initiating payment.');
//   }
// };

const handlePlanSelect = async (plan) => {
  if (plan.price === 0) {
    Alert.alert('Free Plan', 'You are already on the free plan');
    return;
  }

  if (!currentUserId) {
    Alert.alert('Error', 'User ID not found. Please log in again.');
    return;
  }

  try {
    setIsProcessingPayment(true);

    // 1. Safely convert currentUserId to Number as expected by your backend
    const userIdToSend = Number(currentUserId) || currentUserId; 

    console.log("🚀 Sending to Backend:", { userId: userIdToSend, planType: plan.planType });

    const orderResponse = await planApi.createOrder(userIdToSend, plan.planType);
    
    console.log("=== FINAL RESPONSE DEBUG ===");
    console.log("Raw Response Object:", JSON.stringify(orderResponse));

    // 2. Extract base data safely
    const baseData = orderResponse?.data || orderResponse;
    
    // 3. Extracting fields according to your Swagger
    const razorpayOrderId = baseData?.razorpayOrderId || baseData?.data?.razorpayOrderId;
    const razorpayKeyId = baseData?.razorpayKeyId || baseData?.data?.razorpayKeyId;
    const amountInr = baseData?.amountInr || baseData?.data?.amountInr;

    console.log("🎯 Extracted Razorpay Order ID:", razorpayOrderId);
    console.log("🎯 Extracted Razorpay Key ID:", razorpayKeyId);
    console.log("🎯 Extracted Amount INR:", amountInr);

    // 🚨 IF BACKEND FAILED: Agar backend se order ID nahi mili, toh real message user ko dikhao
    if (!razorpayOrderId) {
      const serverErrorMessage = orderResponse?.msg || orderResponse?.data?.msg || "Unknown Server Error";
      throw new Error(`Server Error: "${serverErrorMessage}"`);
    }

    // ✅ FIXED: Defining finalAmount safely (Backend returns direct rupees, so multiply by 100 for paise)
    const finalAmount = amountInr ? (amountInr * 100) : (plan.price * 100);

    // 4. Razorpay Options Configuration
    const options = {
      description: `Subscription for ${plan.planType}`,
      currency: 'INR',
      key: razorpayKeyId, 
      amount: finalAmount, // Now securely defined!
      name: 'Your App Name',
      order_id: razorpayOrderId, 
      prefill: {
        email: 'user@example.com',
        contact: '9999999999',
        name: 'Customer Name'
      },
      theme: { color: '#1B4D22' }
    };

    setIsProcessingPayment(false); // Close main loader before opening gateway

    // 5. Open Razorpay Checkout Gateway
    RazorpayCheckout.open(options)
      .then(async (data) => {
        setIsProcessingPayment(true); // Turn loader ON during verification

        console.log("Razorpay Gateway Success Response:", data);

        // 6. API Call: Verify Payment
        const verificationResult = await planApi.verifyPayment(
          data.razorpay_order_id,    
          data.razorpay_payment_id,  
          data.razorpay_signature    
        );

        console.log("Verification Success Result:", verificationResult);
        setIsProcessingPayment(false);

        if (verificationResult?.status === true) {
          Alert.alert('Success 🎉', 'Your premium subscription is now active!', [
            { text: 'Awesome', onPress: () => navigation.goBack() }
          ]);
        } else {
          Alert.alert('Pending/Failed', verificationResult?.msg || 'Verification response negative.');
        }
      })
      .catch((error) => {
        setIsProcessingPayment(false);
        console.log('Razorpay Gateway Cancel/Error:', error);
        Alert.alert('Payment Cancelled', error.description || 'Process was interrupted.');
      });

  } catch (err) {
    setIsProcessingPayment(false);
    console.error("CRITICAL ERROR IN PAYMENT FLOW:", err);
    // User friendly alert displaying exact server message
    Alert.alert('Payment Error', err.message || 'Something went wrong while initiating payment.');
  }
};

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width * 0.75;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor((offset + slideSize / 2) / slideSize);

    if (index >= 0 && index < dbPlans.length) {
      setActiveIndex(index);
    }
  };

  const getPlanIcon = (planName) => {
    const name = planName?.toLowerCase() || '';
    if (name.includes('premium')) return <Text style={{ fontSize: 28 }}>👑</Text>;
    return <Text style={{ fontSize: 28 }}>💎</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
      </View>

      {isProcessingPayment && (
        <View style={styles.absoluteLoader}>
          <ActivityIndicator size="large" color="#1B4D22" />
          <Text style={styles.loaderText}>Processing Payment...</Text>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.logoContainer}>
          <Text style={styles.crownLogo}>👑</Text>
          <Text style={styles.mainHeading}>Unlock Premium Features</Text>
          <Text style={styles.subHeading}>Choose a plan that suits you</Text>
        </View>

        {isLoading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#1B4D22" />
            <Text>Loading plans...</Text>
          </View>
        ) : hasError ? (
          <View style={styles.center}>
            <Text>Failed to load plans</Text>
            <TouchableOpacity onPress={fetchSubscriptionPlans}>
              <Text style={{ color: 'blue', marginTop: 10 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : dbPlans.length === 0 ? (
          <View style={styles.center}>
            <Text>No Plans Available</Text>
          </View>
        ) : (
          <>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              snapToInterval={width * 0.72 + 20}
              decelerationRate="fast"
            >
              {dbPlans.map((item) => {
                const isFree = item.price === 0;
                const price = isFree ? 'Free' : `₹${item.price}`;
                const period = item.durationDays === -1 ? 'Lifetime' : `/ ${item.durationDays} days`;

                const features = [
                  `${item.dailyLikes} Likes/day`,
                  `${item.superLike} Super Likes`,
                  `${item.dailyMessageLimit} Messages/day`,
                  item.viewWhoLikedYou && 'See who liked you',
                  item.advancedSearchFilters && 'Advanced filters',
                  item.seeProfileVisitors && 'Profile visitors',
                  item.behavioralCompatibilityMatching && 'Smart matching',
                  item.internationalMatching && 'International matches',
                  item.matchAnalyticsDashboard && 'Analytics dashboard',
                  item.premiumBadge && 'Premium badge',
                ].filter(Boolean);

                return (
                  <PlanCard
                    key={item.id}
                    title={item.planType}
                    credits={item.durationDays === -1 ? 'Lifetime Access' : `${item.durationDays} Days Access`}
                    price={price}
                    period={period}
                    features={features}
                    isRecommended={item.planType === 'PREMIUM'}
                    icon={getPlanIcon(item.planType)}
                    onPress={() => handlePlanSelect(item)}
                  />
                );
              })}
            </ScrollView>

            <View style={styles.dots}>
              {dbPlans.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeIndex === index ? styles.activeDot : {}
                  ]}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PremiumPlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC', 
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 48,
  },
  backButton: {
    padding: 4,
  },
  backIcon: {
    fontSize: 24,
    color: '#1B4D22',
  },
  scrollContent: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  crownLogo: {
    fontSize: 54,
    marginBottom: 10,
  },
  mainHeading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1B4D22',
    textAlign: 'center',
    marginBottom: 8,
  },
  subHeading: {
    fontSize: 14,
    color: '#4E6E52',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  filterSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginTop: 25,
    marginBottom: 12,
  },
  sectionLabel: {
    fontWeight: '700',
    color: '#1B4D22',
    letterSpacing: 0.5,
    fontSize: 13,
  },
  currencySelector: {
    backgroundColor: '#1B4D22',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  currencyText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1E4A27',
    borderRadius: 12,
    padding: 3,
    width: '90%',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#FDF3C7',
  },
  tabText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#1B4D22',
    fontWeight: 'bold',
  },
  carouselContainer: {
    paddingHorizontal: width * 0.1, 
    paddingVertical: 20,
  },
  centerStatusContainer: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  statusInfoText: {
    fontSize: 15,
    color: '#4E6E52',
    fontWeight: '600',
    marginTop: 10,
    textAlign: 'center',
  },
  errorRetryButton: {
    marginTop: 14,
    backgroundColor: '#1B4D22',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
  },
  errorRetryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  paginationDotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 8,
    backgroundColor: '#1B4D22',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#D1D5DB',
  },
  footerGuarantees: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    width: '92%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  guaranteeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  borderSides: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E2E8F0',
  },
  guaranteeIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  guaranteeTextContainer: {
    flex: 1,
  },
  guaranteeTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1B4D22',
  },
  guaranteeSub: {
    fontSize: 8,
    color: '#666666',
    lineHeight: 10,
  },
});