import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabNavigator from './src/navigators/AppTabNavigator';
import RouteDetailScreen from './src/screens/RouteDetailScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="MainTabs"
          component={AppTabNavigator}
        />
        <Stack.Screen
          name="RouteDetail"
          component={RouteDetailScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;