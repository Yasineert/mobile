import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text, View, Platform, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import TransportScreen from '../screens/TransportScreen';
import MapScreen from '../screens/MapScreen';
import BusStopScreen from '../screens/BusStopScreen';
import PaymentScreen from '../screens/PaymentScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import theme from '../theme/theme';

const Tab = createBottomTabNavigator();

// Calculate bottom space for devices with notch
const getBottomSpace = () => {
  const { height } = Dimensions.get('window');
  return Platform.OS === 'ios' && height >= 812 ? 34 : 0;
};

const AppTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.COLORS.primary,
        tabBarInactiveTintColor: theme.COLORS.textLight,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={TransportScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Icon name={focused ? "home" : "home-outline"} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Icon name={focused ? "map" : "map-outline"} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="BusStop"
        component={BusStopScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Icon name={focused ? "bus" : "bus-outline"} size={24} color={color} />
            </View>
          ),
          tabBarLabel: "Bus Stop",
        }}
      />
      <Tab.Screen
        name="Payment"
        component={PaymentScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Icon name={focused ? "card" : "card-outline"} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Favourites"
        component={FavouritesScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Icon name={focused ? "star" : "star-outline"} size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: theme.COLORS.card,
    borderTopWidth: 1,
    borderTopColor: theme.COLORS.border,
    height: 60 + theme.getBottomSpace(),
    ...theme.SHADOWS.medium,
    paddingBottom: Platform.OS === 'ios' ? 20 : 5,
    paddingTop: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  activeIconContainer: {
    backgroundColor: theme.COLORS.surface,
    borderRadius: 12,
    padding: 6,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppTabNavigator; 