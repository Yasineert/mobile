import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import Input from '../components/Input';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation values
  const logoAnimation = new Animated.Value(0);
  const formAnimation = new Animated.Value(0);
  
  React.useEffect(() => {
    // Animate logo and form sequentially
    Animated.sequence([
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(formAnimation, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      // Show validation error
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to home screen on successful login
      navigation.replace('Main');
    }, 1500);
  };
  
  const logoTranslateY = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [-50, 0],
  });
  
  const formOpacity = formAnimation;
  const formTranslateY = formAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and App Name */}
          <Animated.View 
            style={[
              styles.logoContainer,
              { opacity: logoAnimation, transform: [{ translateY: logoTranslateY }] }
            ]}
          >
            <Image 
              source={{ uri: 'https://img.icons8.com/color/240/null/briefcase.png' }} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appName}>JobBridge</Text>
            <Text style={styles.tagline}>Votre passerelle vers l'emploi public</Text>
          </Animated.View>
          
          {/* Login Form */}
          <Animated.View 
            style={[
              styles.formContainer,
              { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }
            ]}
          >
            <Text style={styles.formTitle}>Connexion</Text>
            
            <Input
              label="Email"
              placeholder="Entrez votre email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              icon={<Text>✉️</Text>}
            />
            
            <Input
              label="Mot de passe"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Text>🔒</Text>}
            />
            
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Vous n'avez pas de compte ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerButtonText}>S'inscrire</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.l,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: spacing.m,
  },
  appName: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    ...shadows.medium,
  },
  formTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: spacing.l,
  },
  forgotPasswordText: {
    fontSize: typography.fontSizes.s,
    color: colors.primary,
  },
  loginButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    marginBottom: spacing.l,
    ...shadows.small,
  },
  loginButtonDisabled: {
    backgroundColor: colors.muted,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  registerText: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  registerButtonText: {
    fontSize: typography.fontSizes.s,
    color: colors.primary,
    fontWeight: typography.fontWeights.semiBold,
  },
});

export default LoginScreen; 