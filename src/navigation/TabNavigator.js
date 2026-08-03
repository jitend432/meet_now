import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { FontAwesomeFreeSolid } from "@react-native-vector-icons/fontawesome-free-solid/static";
import DiscoverScreen from '../screens/main/DiscoverScreen'
import MatchesScreen from '../screens/main/MatchesScreen'
import ProfileScreen from '../screens/main/ProfileScreen'
import SettingsScreen from '../screens/main/SettingsScreen'
import ChatListScreen from '../screens/main/ChatListScreen';
import ChatRoom from '../screens/main/ChatRoomScreen';
import ViewProfileScreen from '../screens/main/ViewProfileScreen';
import MediaPhotosScreen from '../screens/main/MediaPhotos';
import SearchChatScreen from '../screens/main/SearchChatScreen';
import { COLORS } from '../constants/theme';

const Stack = createNativeStackNavigator();

const ChatStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="ChatList" 
        component={ChatListScreen} 
        options={{ headerShown: false }}
      />      
      {/* <Stack.Screen 
        name="ChatRoom" 
        component={ChatRoom} 
        options={{ headerShown: false }}
      /> */}
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
    </Stack.Navigator>
  );
};

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
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

        // tabBarIconStyle: {
        //     marginTop: 6,
        //     marginBottom: -2,

        // },

        tabBarLabelStyle: {
          fontSize: 12,         
          fontWeight: '900',    
          fontFamily: 'CustomFont', 
          paddingTop: 5 
        },
        
        tabBarItemStyle: {
          height: 60,
          backgroundColor: COLORS.background,
        
        },
        tabBarStyle: {
            position: 'absolute',     
               //bottom: 20,              
               //left: '5%',             
               //right: '5%',
               //width: '90%',            
               height: 60,             
               borderRadius: 8,        
               backgroundColor: '#ffffff',              
               //shadowColor: '#000',
               //shadowOffset: { width: 0, height: 10 },
               //shadowOpacity: 0.1,
               //shadowRadius: 10,
               //elevation: 5,
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