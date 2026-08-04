import React, {useEffect} from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from '../redux/hooks';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import VerifyEmailScreen from '../screens/auth/VerifyEmailScreen';
import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import SettingsScreen from '../screens/main/SettingsScreen';
import VideoCallScreen from '../screens/main/VideoCallScreen';
import VerifyOtpScreen from '../screens/auth/VerifyOtpScreen';
import EmailSuccessScreen from '../screens/auth/EmailSuccessScreen'
import TabNavigator from './TabNavigator';
import LifestyleScreen from '../screens/auth/LifeStyleScreen';
import InterestedInScreen from '../screens/auth/InterestedInScreen';
import LookingForScreen from '../screens/auth/LookingForScreen';
import ProfileCompletedScreen from '../screens/auth/ProfileCompletedScreen';
import BasicInfoScreen from '../screens/auth/BasicInfoScreen';
import AddPhotosScreen from '../screens/auth/AddPhotosScreen';
import ProfessionalDetailsScreen from '../screens/auth/ProfessionalDetailsScreen';
import YourInterestScreen from '../screens/auth/YourInterestScreen';
import GetStartedScreen from '../screens/auth/GetStartedScreen';


import { getFCMToken, initNotificationListeners } from '../utils/notificationService';
import ResetPasswordScreen from '../screens/auth/ResetPasswordScreen';
import ChatRoomScreen from '../screens/main/ChatRoomScreen';
import ViewProfileScreen from '../screens/main/ViewProfileScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {

  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn)
  const userId = useAppSelector((state) => state.auth.userId);

  useEffect(() => {

    if (isLoggedIn && userId) {
      getFCMToken(userId);

      let cleanUpListeners;
      initNotificationListeners(userId).then((unsub) => {
        cleanUpListeners = unsub;
      });

      return () => {
        if (cleanUpListeners) cleanUpListeners();
      };
    }
  }, [isLoggedIn, userId]);

//   useEffect(() => {
//   if (!isLoggedIn || !userId) return;

//   getFCMToken(userId);

//   let unsubscribe;

//   const setup = async () => {
//     unsubscribe = await initNotificationListeners(userId);
//   };

//   setup();

//   return () => {
//     if (unsubscribe) {
//       unsubscribe();
//     }
//   };
// }, [isLoggedIn, userId]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='SplashScreen' component={SplashScreen} options={{ headerShown: false }}/> 

        {!isLoggedIn ? (
          <>
        <Stack.Screen name='GetStartedScreen' component={GetStartedScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='OnboardingScreen' component={OnboardingScreen} options={{ headerShown: false }}/>              
        <Stack.Screen name='SignupScreen' component={SignupScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='VerifyEmailScreen' component={VerifyEmailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='VerifyOtpScreen' component={VerifyOtpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='EmailSuccessScreen' component={EmailSuccessScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='LoginScreen' component={LoginScreen} options={{ headerShown: false }}/> 
        <Stack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen} options={{ headerShown: false }}/>       
        
        </>
        ):(
          <>
        {/* <Stack.Screen name='CompleteprofileScreen' component={CompleteProfileScreen} options={{ headerShown: false }}/> */}
        <Stack.Screen name='SettingsScreen' component={SettingsScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='VideoCallScreen' component={VideoCallScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='LifeStyleScreen' component={LifestyleScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='InterestedInScreen' component={InterestedInScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='LookingForScreen' component={LookingForScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='ProfileCompletedScreen' component={ProfileCompletedScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='BasicInfoScreen' component={BasicInfoScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='AddPhotosScreen' component={AddPhotosScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='ProfessionalDetailsScreen' component={ProfessionalDetailsScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='YourInterestScreen' component={YourInterestScreen} options={{ headerShown: false}}/>
        <Stack.Screen name='TabNavigator' component={TabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name='ChatRoomScreen' component={ChatRoomScreen} options={{ headerShown: false }}/>
        <Stack.Screen name='ViewProfileScreen' component={ViewProfileScreen} options={{ headerShown: false }}/>
        
        </>
        )}
      </Stack.Navigator>
        
    </NavigationContainer>
  );
}

export default AppNavigator