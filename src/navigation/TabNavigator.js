import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import DiscoverScreen from '../screens/main/DiscoverScreen'
import MatchesScreen from '../screens/main/MatchesScreen'
import ProfileScreen from '../screens/main/ProfileScreen'
import SettingsScreen from '../screens/main/SettingsScreen'
import ChatListScreen from '../screens/main/ChatListScreen';
import ViewProfileScreen from '../screens/main/ViewProfileScreen';
import MediaPhotosScreen from '../screens/main/MediaPhotos';
import SearchChatScreen from '../screens/main/SearchChatScreen';
import { COLORS } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EditProfileScreen from '../screens/main/EditProfileScreen';

const Stack = createNativeStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen} 
        options={{ headerShown: false }}
      />      
     
      <Stack.Screen 
        name="ViewProfileScreen" 
        component={ViewProfileScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="MediaPhotosScreen" 
        component={MediaPhotosScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="SearchChatScreen" 
        component={SearchChatScreen} 
        options={{ headerShown: false }}
      />

       {/* <Stack.Screen 
        name="EditProfileScreen" 
        component={EditProfileScreen} 
        options={{ headerShown: false }}
      /> */}

       {/* <Stack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ headerShown: false }}
      /> */}
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator()

const TabNavigator = () => {

  const insets = useSafeAreaInsets();
  const bottomInset = insets.bottom > 0 ? insets.bottom : 10;

  return (
    <Tab.Navigator screenOptions={({ route }) => ({

        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Discover') {
            iconName = 'fire';
          } else if (route.name === 'Matches') {
            iconName = 'heart';
          } else if (route.name === 'Message') {
            iconName = 'comment-dots';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          } else if (route.name === 'Setting') {
            iconName = 'gear';
          }

          return <FontAwesomeFreeSolid name={iconName} size={size} color={color} solid />;
        },
        tabBarActiveTintColor: '#005a1c',
        tabBarInactiveTintColor: '#557c55',
        tabBarHideOnKeyboard: true,

        tabBarLabelStyle: {
          fontSize: 12,         
          fontWeight: '900',    
          fontFamily: 'CustomFont', 
          paddingTop: 2 
        },
        
        tabBarItemStyle: {
          //height: 60,
          backgroundColor: COLORS.background,
          paddingVertical: 4,
        
        },
        tabBarStyle: {
            position: 'absolute',                 
               height: 60 + bottomInset,           
               borderRadius: 8,        
               backgroundColor: '#ffffff',  
               borderTopWidth: 0,
              elevation: 5,                           
        }
      })}>
        <Tab.Screen name='Discover' component={DiscoverScreen} options={{ headerShown: false }}/>
        <Tab.Screen name='Matches' component={MatchesScreen} options={{ headerShown: false }}/>
        <Tab.Screen name='Message' component={ChatStack} options={{ headerShown: false }}/>
        <Tab.Screen name='Profile' component={ProfileScreen} options={{ headerShown: false }}/>
        <Tab.Screen name='Setting' component={SettingsScreen} options={{ headerShown: false }}/>
    </Tab.Navigator>
    
  )
}

export default TabNavigator