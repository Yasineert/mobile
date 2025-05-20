import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS } from '../theme/theme';
import MapScreen from '../screens/MapScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import IconProfile from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get('window');

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBarStyle,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <Icon 
              name="map-outline" 
              size={30} 
              color={focused ? COLORS.primaryLightGreenHex : COLORS.primaryWhiteHex} 
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: width * 0.035,
                fontWeight: focused ? '500' : '400',
                marginBottom: height * 0.005,
                marginTop: height * -0.010,
                color: focused ? COLORS.primaryLightGreenHex : COLORS.primaryWhiteHex,
              }}
            >
              Map
            </Text>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <IconProfile
              name="account-outline"
              size={30}
              color={focused ? COLORS.primaryLightGreenHex : COLORS.primaryWhiteHex}
            />
          ),
          tabBarLabel: ({ focused }) => (
            <Text
              style={{
                fontSize: width * 0.035,
                fontWeight: focused ? '500' : '400',
                marginBottom: height * 0.005,
                marginTop: height * -0.010,
                color: focused ? COLORS.primaryLightGreenHex : COLORS.primaryWhiteHex,
              }}
            >
              Profile
            </Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    height: height * 0.08,
    position: 'absolute',
    backgroundColor: COLORS.primaryGreenHex,
    borderTopWidth: 1, 
    borderTopColor: '#ccc', 
    elevation: 0, 
    shadowColor: 'transparent',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },

  BlurViewStyles: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default TabNavigator;