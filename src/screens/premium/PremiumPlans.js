import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  acknowledgePurchaseAndroid,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  ErrorCode,
 // requestSubscription
} from 'react-native-iap';
import PlanCard from '../../components/premium/PlanCard';
import { useAppSelector } from '../../redux/hooks';

const { width } = Dimensions.get('window');

// 🔴 Play Console me configured exact Product ID
const productId = 'premium_dating_membership';

const PremiumPlans = ({ navigation }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [subscriptions, setSubscriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const currentUserId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {
    let purchaseUpdateSubscription = null;
    let purchaseErrorSubscription = null;

    const setupIap = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        // 1. Initialize Connection (v15)
        await initConnection();

        // 2. Fetch Subscriptions / Products (v15.x uses fetchProducts)
        const products = await fetchProducts({
          skus: [productId],
          type: 'subs', // For Subscriptions
        });

        console.log('Fetched Products (v15):', products);

        if (products && products.length > 0) {
          setSubscriptions(products);
        } else {
          setSubscriptions([]);
        }
      } catch (error) {
        console.error('Failed to fetch Play Store Subscriptions:', error);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }

      // 3. Setup Purchase Success Listener (v15)
      purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase) => {
        setIsProcessingPayment(false);

        if (purchase && purchase.transactionReceipt) {
          try {
            // Acknowledge Purchase (Crucial for Android)
            if (Platform.OS === 'android' && purchase.purchaseToken) {
              await acknowledgePurchaseAndroid({ token: purchase.purchaseToken });
            }

            // Finish Transaction
            await finishTransaction({ purchase, isConsumable: false });

            // TODO: Call your backend API here to assign Premium status to currentUserId

            Alert.alert('Success 🎉', 'Your premium subscription is now active!', [
              { text: 'Awesome', onPress: () => navigation.goBack() },
            ]);
          } catch (ackError) {
            console.error('Error acknowledging purchase:', ackError);
            Alert.alert('Purchase Warning', 'Payment received, but acknowledgment failed. Please contact support.');
          }
        }
      });

      // 4. Setup Purchase Error Listener (v15)
      purchaseErrorSubscription = purchaseErrorListener((error) => {
        setIsProcessingPayment(false);
        if (error.code !== ErrorCode.E_USER_CANCELLED) {
          console.error('Purchase Error Listener:', error);
          Alert.alert('Purchase Error', error.message || 'Transaction failed.');
        } else {
          console.log('User cancelled purchase.');
        }
      });
    };

    setupIap();

    // Cleanup IAP Connection & Listeners on unmount
    return () => {
      if (purchaseUpdateSubscription) purchaseUpdateSubscription.remove();
      if (purchaseErrorSubscription) purchaseErrorSubscription.remove();
      endConnection();
    };
  }, [currentUserId]);

 
    const handlePlanSelect = async (sub) => {
  if (!currentUserId) {
    Alert.alert('Error', 'User ID not found. Please log in again.');
    return;
  }

  try {
    setIsProcessingPayment(true);

    const productIdToUse = sub.id || sub.productId;

    // Get offerToken for Android Base Plan
    const offers =
      sub.subscriptionOfferDetailsAndroid ||
      sub.subscriptionOffers ||
      sub.subscriptionOfferDetails;
      
    const offerToken = offers?.[0]?.offerToken;

    console.log('Initiating purchase for:', productIdToUse, 'OfferToken:', offerToken);

    if (Platform.OS === 'android') {
      // 🔴 v15.x Android Subscription Payload Fix
      await requestPurchase({
        request: {
          google: {
            skus: [productIdToUse],
            subscriptionOffers: offerToken
              ? [
                  {
                    sku: productIdToUse,
                    offerToken: offerToken,
                  },
                ]
              : [],
          },
        },
      });
    } else {
      await requestPurchase({
        request: {
          ios: {
            sku: productIdToUse,
          },
        },
      });
    }
  } catch (error) {
    setIsProcessingPayment(false);
    console.error('Request Purchase Error:', error);
    Alert.alert('Error', error.message || 'Could not initiate purchase.');
  }
};

  const handleScroll = (event) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width * 0.75;
    const offset = event.nativeEvent.contentOffset.x;
    const index = Math.floor((offset + slideSize / 2) / slideSize);

    if (index >= 0 && index < subscriptions.length) {
      setActiveIndex(index);
    }
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
          <Text style={styles.loaderText}>Processing Purchase...</Text>
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
            <Text style={{ marginTop: 10 }}>Fetching plans from Play Store...</Text>
          </View>
        ) : hasError ? (
          <View style={styles.center}>
            <Text>Failed to load plans from Play Store</Text>
            <TouchableOpacity onPress={() => navigation.replace('PremiumPlans')}>
              <Text style={{ color: '#1B4D22', fontWeight: 'bold', marginTop: 10 }}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : subscriptions.length === 0 ? (
          <View style={styles.center}>
            <Text style={{ color: '#4E6E52' }}>No Plans Available</Text>
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
              {subscriptions.map((sub) => {
                const offerDetail = sub.subscriptionOfferDetails?.[0];
                const pricingPhase = offerDetail?.pricingPhases?.pricingPhaseList?.[0];
                const price = pricingPhase?.formattedPrice || sub.displayPrice || 'N/A';

                const cleanTitle = sub.title ? sub.title.split('(')[0].trim() : 'Premium Plan';

                const features = [
                  'Unlimited Likes',
                  'See who liked you',
                  'Advanced filters',
                  'Smart matching',
                  'Premium badge',
                ];

                return (
                  <PlanCard
                    key={sub.id}
                    title={cleanTitle}
                    credits={sub.description || 'Full Premium Access'}
                    price={price}
                    period="/ monthly"
                    features={features}
                    isRecommended={true}
                    icon={<Text style={{ fontSize: 28 }}>💎</Text>}
                    onPress={() => handlePlanSelect(sub)}
                  />
                );
              })}
            </ScrollView>

            <View style={styles.dots}>
              {subscriptions.map((sub, index) => (
                <View
                  key={`dot-${sub.id || index}`}
                  style={[
                    styles.dot,
                    activeIndex === index ? styles.activeDot : styles.inactiveDot,
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

export default PremiumPlans;

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
  backIcon: {
    fontSize: 24,
    color: '#1B4D22',
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
    marginBottom: 20,
  },
  center: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absoluteLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderText: {
    marginTop: 10,
    color: '#1B4D22',
    fontWeight: 'bold',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: '#1B4D22',
  },
  inactiveDot: {
    width: 8,
    backgroundColor: '#D1D5DB',
  },
});