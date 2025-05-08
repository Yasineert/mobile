import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { colors, borderRadius, spacing, shadows, typography } from '../theme/theme';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchResultsScreen from '../screens/SearchResultsScreen';
import InternshipDetailScreen from '../screens/InternshipDetailScreen';
import ApplyFormScreen from '../screens/ApplyFormScreen';
import ApplicationSuccessScreen from '../screens/ApplicationSuccessScreen';
import MyApplicationsScreen from '../screens/MyApplicationsScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ResumePreviewScreen from '../screens/ResumePreviewScreen';
import SavedInternshipsScreen from '../screens/SavedInternshipsScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LineDetail from '../screens/LineDetail';
import BusStatusScreen from '../screens/BusStatusScreen';
import BusStopDetailScreen from '../screens/BusStopDetailScreen';

// Get screen dimensions
const { width } = Dimensions.get('window');

// Create stack navigators
const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

// Auth Stack Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: colors.background },
    }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
};

// Profile Stack Navigator
const ProfileNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{
      headerShown: false,
      animation: 'slide_from_right',
      contentStyle: { backgroundColor: colors.background },
    }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
      <ProfileStack.Screen name="ResumePreview" component={ResumePreviewScreen} />
      <ProfileStack.Screen name="Settings" component={ProfileScreen} />
      <ProfileStack.Screen name="ResumeUpload" component={ProfileScreen} />
      <ProfileStack.Screen name="EditResume" component={ProfileScreen} />
      <ProfileStack.Screen name="NotificationSettings" component={ProfileScreen} />
      <ProfileStack.Screen name="PrivacySettings" component={ProfileScreen} />
      <ProfileStack.Screen name="AppearanceSettings" component={ProfileScreen} />
    </ProfileStack.Navigator>
  );
};

// Tab Icon component for better organization and reusability
const TabIcon = ({ name, isFocused, size = 24 }: { name: string; isFocused: boolean; size?: number }) => {
  // Modern iconography using consistent styling
  let icon;
  switch (name) {
    case 'Home':
      icon = isFocused ? '🏠' : '🏠';
      break;
    case 'Search':
      icon = isFocused ? '🔍' : '🔍';
      break;
    case 'SavedInternships':
      icon = isFocused ? '❤️' : '🤍';
      break;
    case 'MyApplications':
      icon = isFocused ? '📋' : '📝';
      break;
    case 'Profile':
      icon = isFocused ? '👤' : '👤';
      break;
    default:
      icon = '•';
  }

  return (
    <Text 
      style={[
        styles.tabIcon, 
        { 
          fontSize: size,
          opacity: isFocused ? 1 : 0.7
        }
      ]}
    >
      {icon}
    </Text>
  );
};

// Custom Tab Bar Component
const CustomTabBar = ({ state, descriptors, navigation }: { state: any; descriptors: any; navigation: any }) => {
  // Reference for animation value
  const animatedValues = useRef(state.routes.map(() => new Animated.Value(0))).current;
  
  // Update animation when tab changes
  useEffect(() => {
    // Animate all tabs to their intended state
    state.routes.forEach((_: any, index: number) => {
      Animated.spring(animatedValues[index], {
        toValue: state.index === index ? 1 : 0,
        useNativeDriver: true,
        friction: 9,
        tension: 50
      }).start();
    });
  }, [state.index]);

  return (
    <View style={styles.tabBarWrapper}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || options.title || route.name;
          const isFocused = state.index === index;

          // Animation values
          const scale = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.2]
          });
          
          const translateY = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, -8]
          });
          
          const opacity = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
          });

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <Animated.View 
                style={{
                  transform: [{ scale }, { translateY }],
                  alignItems: 'center'
                }}
              >
                <TabIcon name={route.name} isFocused={isFocused} />
                
                {isFocused && (
                  <Animated.View 
                    style={[
                      styles.labelContainer,
                      { opacity }
                    ]}
                  >
                    <Text style={styles.tabLabelFocused}>{label}</Text>
                  </Animated.View>
                )}
              </Animated.View>
              
              {isFocused && (
                <Animated.View 
                  style={[
                    styles.activeIndicator,
                    { opacity }
                  ]} 
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

// Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'none' }, // Hide default tab bar
      }}
      tabBar={props => <CustomTabBar {...props} />}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Accueil',
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchResultsScreen}
        options={{
          tabBarLabel: 'Recherche',
        }}
        initialParams={{ searchQuery: '', filters: { sector: [], location: '', duration: '', contractType: [] } }}
      />
      <Tab.Screen
        name="SavedInternships"
        component={SavedInternshipsScreen}
        options={{
          tabBarLabel: 'Favoris',
        }}
      />
      <Tab.Screen
        name="MyApplications"
        component={MyApplicationsScreen}
        options={{
          tabBarLabel: 'Candidatures',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'Profil',
        }}
      />
    </Tab.Navigator>
  );
};

// Screen transition animations
const forFade = ({ current }: { current: any }) => ({
  cardStyle: {
    opacity: current.progress,
  },
});

// Main Stack Navigator with custom animation options
const AppNavigator = () => {
  const isLoggedIn = true; // This would be determined by your auth state
  const hasCompletedOnboarding = false; // This would be determined by local storage or state
  
  return (
    <NavigationContainer>
      <MainStack.Navigator
        initialRouteName={isLoggedIn ? (hasCompletedOnboarding ? "Main" : "Onboarding") : "Auth"}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
          contentStyle: { backgroundColor: colors.background },
          gestureEnabled: true,
          animationDuration: 250,
        }}>
        <MainStack.Screen name="Auth" component={AuthNavigator} />
        <MainStack.Screen name="Onboarding" component={OnboardingScreen} />
        <MainStack.Screen name="BusStatus" component={BusStatusScreen} />
        <MainStack.Screen name="Main" component={TabNavigator} />
        <MainStack.Screen 
          name="InternshipDetail" 
          component={(props: any) => <InternshipDetailScreen {...props} />} 
          options={{
            animation: 'slide_from_right'
          }}
        />
        <MainStack.Screen 
          name="ApplyForm" 
          component={(props: any) => <ApplyFormScreen {...props} />} 
          options={{
            animation: 'slide_from_bottom',
            presentation: 'transparentModal'
          }}
        />
        <MainStack.Screen 
          name="ApplicationSuccess" 
          component={(props: any) => <ApplicationSuccessScreen {...props} />} 
          options={{
            presentation: 'transparentModal'
          }}
        />
        <MainStack.Screen name="LineDetail" component={LineDetail} />
        <MainStack.Screen name="BusStopDetail" component={BusStopDetailScreen} />
      </MainStack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    paddingVertical: 8,
    alignItems: 'center',
  },
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 30,
    height: 70,
    width: width * 0.92,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: spacing.m,
    ...shadows.large,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    position: 'relative',
  },
  tabIcon: {
    marginBottom: 2,
  },
  labelContainer: {
    position: 'absolute',
    top: 28,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  tabLabelFocused: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '600',
  },
  tabLabel: {
    fontSize: typography.fontSizes.xs,
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 10,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
  },
});

export default AppNavigator; 