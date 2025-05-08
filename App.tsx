import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { colors } from './src/theme/theme';

const App = () => {
  return (
    <SafeAreaProvider>
      <StatusBar 
        backgroundColor={colors.primary}
        barStyle="light-content"
      />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

export default App;