import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from '../../utils/locationPermission';
import { authApi } from '../../services/authApi';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setProfileCompleted } from '../../redux/slices/authSlice';

export default function ProfileCompletedScreen({navigation}) {
  const [loading, setLoading] = useState(false);
  

  //const userId = useAppSelector((state) => state.auth.user?.id || state.auth.user?._id || state.auth.userProfile?.id);
  const registrationId = useAppSelector((state) => state.auth.userId || state.auth?.user?.registrationId )
  console.log("registrationId ====>", registrationId) 

  const dispatch = useAppDispatch()

  const handleGoToDashboard = async () => {
    setLoading(true);
    try {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        Alert.alert(
          'Permission Required', 
          'Please enable location permission to access the dashboard and find matches nearby.',
          [
            { text: 'Cancel', onPress: () => setLoading(false), style: 'cancel' },
            { text: 'Try Again', onPress: () => handleGoToDashboard() }
          ]
        );
        return;
      }

      Geolocation.getCurrentPosition(
        async (position) => {
          const latitude = parseFloat(position.coords.latitude);
          const longitude = parseFloat(position.coords.longitude);
          const locationPayload = { latitude, longitude };
          console.log("Payload ====>", locationPayload)

          try {
            console.log("Sending GPS Coordinates to Backend:", locationPayload);
            
            // Aapke current code ke hisab se sahi method call userId ke sath
            if (authApi && typeof authApi.updateUserLocation === 'function') {
              await authApi.updateUserLocation(registrationId, locationPayload);
            } else {
              console.error("Method 'updateUserLocation' not found on authApi");
            }
          } catch (apiError) {
            console.error("Failed to save coordinates to backend:", apiError);
          } finally {
            setLoading(false);
            //navigation.navigate('TabNavigator');
            dispatch(setProfileCompleted(true));
          }
        },
        (error) => {
          console.log("Dashboard Geolocation Error:", error.code, error.message);
          setLoading(false);
          Alert.alert(
            'Location Error', 
            'Unable to fetch GPS coordinates. Please ensure your location/GPS is turned ON.',
            [{ text: 'OK', onPress: () => navigation.navigate('TabNavigator') }]
          );
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );

    } catch (error) {
      console.error("Dashboard Navigation Flow Error:", error);
      setLoading(false);
      navigation.navigate('TabNavigator');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.cardContainer}>
        
        <View style={styles.successGraphicContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle}>
              <FontAwesomeFreeSolid name="check" size={38} color="#ffffff" />
            </View>
          </View>
        </View>
       
        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>Profile Completed!</Text>
          <Text style={styles.subTitle}>Your profile is now ready to go.</Text>
        </View>

        <View style={styles.infoBox}>
          <View style={styles.infoIconContainer}>
            <FontAwesomeFreeSolid name="id-card" size={24} color="#1b4d22" />
            <View style={styles.heartBadge}>
              <FontAwesomeFreeSolid name="heart" size={8} color="#ffffff" />
            </View>
          </View>
          <Text style={styles.infoText}>
            You're all set to discover amazing people, send likes and start meaningful conversations.
          </Text>
        </View>

        <View style={styles.illustrationPlaceholder}>
          <FontAwesomeFreeSolid name="comment-dots" size={40} color="#cce3cc" style={styles.bubbleRight} />
          <View style={styles.chatBubbleLeft}>
            <FontAwesomeFreeSolid name="heart" size={20} color="#ffffff" />
          </View>
        </View>

        <View style={styles.footerSection}>
          <TouchableOpacity 
            style={[styles.dashboardButton, loading && { opacity: 0.8 }]}
            onPress={handleGoToDashboard}
            disabled={loading}
          >
            <View style={styles.buttonContent}>
              {!loading && (
                <FontAwesomeFreeSolid name="th-large" size={18} color="#ffffff" style={styles.buttonIconLeft} />
              )}
              
              {loading ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.dashboardButtonText}>Go to Dashboard</Text>
              )}
              
              {!loading && (
                <FontAwesomeFreeSolid name="arrow-right" size={18} color="#ffffff" style={styles.buttonIconRight} />
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.securityRow}>
            <FontAwesomeFreeSolid name="shield-alt" size={14} color="#1b4d22" style={styles.shieldIcon} />
            <Text style={styles.securityText}>Your information is secure with us.</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    justifyContent: 'center',
  },
  cardContainer: {
    backgroundColor: '#ffffff', 
    padding: 24,
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  successGraphicContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    position: 'relative',
    width: '100%',
  },
  outerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e2f0d9', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#1b4d22', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  textSection: {
    alignItems: 'center',
    marginVertical: 10,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#053311',
    marginBottom: 6,
  },
  subTitle: {
    fontSize: 15,
    color: '#555555',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#f4f9f4', 
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
  },
  infoIconContainer: {
    position: 'relative',
    marginRight: 14,
    padding: 4,
  },
  heartBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#1b4d22',
    borderRadius: 6,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f4f9f4',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#1b4d22',
    lineHeight: 18,
    fontWeight: '500',
  },
  illustrationPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: '100%',
    height: 60,
    marginVertical: 10,
  },
  chatBubbleLeft: {
    backgroundColor: '#1b4d22',
    padding: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
    marginRight: -10,
    zIndex: 2,
  },
  bubbleRight: {
    opacity: 0.6,
    marginBottom: 5,
  },
  footerSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  dashboardButton: {
    backgroundColor: '#1b4d22',
    borderRadius: 10,
    width: '100%',
    paddingVertical: 14,
    shadowColor: '#1b4d22',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    height: 24,
  },
  buttonIconLeft: {
    marginRight: 'auto', 
  },
  buttonIconRight: {
    marginLeft: 'auto',
  },
  dashboardButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  shieldIcon: {
    marginRight: 6,
    opacity: 0.7,
  },
  securityText: {
    fontSize: 11,
    color: '#1b4d22',
    opacity: 0.7,
    fontWeight: '500',
  },
});