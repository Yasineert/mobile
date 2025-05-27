import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AppTabNavigator from './src/navigators/AppTabNavigator';
import RouteDetailScreen from './src/screens/RouteDetailScreen';
import AuthNavigator from './src/navigators/AuthNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { COLORS } from './src/theme/theme';

const Stack = createNativeStackNavigator();

// Main navigator that checks authentication state
const RootNavigator = () => {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading indicator while checking authentication state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        // User is signed in - show main app screens
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
      ) : (
        // User is not signed in - show authentication screens
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};

// Main App component wrapped with AuthProvider
const App = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;