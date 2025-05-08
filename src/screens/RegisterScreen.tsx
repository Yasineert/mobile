import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import Header from '../components/Header';
import Input from '../components/Input';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen = ({ navigation }: RegisterScreenProps) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [education, setEducation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Animation
  const [formAnimation] = useState(new Animated.Value(0));
  
  React.useEffect(() => {
    Animated.timing(formAnimation, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);
  
  const handleRegister = () => {
    // Validate inputs
    if (
      fullName.trim() === '' || 
      email.trim() === '' || 
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      // Show validation error
      return;
    }
    
    if (password !== confirmPassword) {
      // Show password mismatch error
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to welcome/onboarding screen on successful registration
      navigation.navigate('Onboarding');
    }, 1500);
  };
  
  const formOpacity = formAnimation;
  const formTranslateY = formAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Créer un compte"
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.formContainer,
              { opacity: formOpacity, transform: [{ translateY: formTranslateY }] }
            ]}
          >
            <Text style={styles.subtitle}>
              Rejoignez JobBridge et commencez votre carrière dans le secteur public
            </Text>
            
            <Input
              label="Nom complet"
              placeholder="Entrez votre nom et prénom"
              value={fullName}
              onChangeText={setFullName}
              icon={<Text>👤</Text>}
            />
            
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
              placeholder="Créez un mot de passe"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<Text>🔒</Text>}
            />
            
            <Input
              label="Confirmer le mot de passe"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon={<Text>🔒</Text>}
            />
            
            <Input
              label="Formation (Optionnel)"
              placeholder="Votre niveau d'études ou formation"
              value={education}
              onChangeText={setEducation}
              icon={<Text>🎓</Text>}
            />
            
            <TouchableOpacity 
              style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Création du compte...' : 'Créer un compte'}
              </Text>
            </TouchableOpacity>
            
            <View style={styles.termsContainer}>
              <Text style={styles.termsText}>
                En créant un compte, vous acceptez nos{' '}
                <Text style={styles.termsLink} onPress={() => {}}>
                  Conditions d'utilisation
                </Text>{' '}
                et notre{' '}
                <Text style={styles.termsLink} onPress={() => {}}>
                  Politique de confidentialité
                </Text>
              </Text>
            </View>
            
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginButtonText}>Se connecter</Text>
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
  headerIcon: {
    fontSize: typography.fontSizes.xl,
    color: colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.m,
  },
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.l,
    padding: spacing.l,
    ...shadows.medium,
    marginBottom: spacing.xl,
  },
  subtitle: {
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
    marginBottom: spacing.l,
    textAlign: 'center',
  },
  registerButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    marginTop: spacing.m,
    marginBottom: spacing.m,
    ...shadows.small,
  },
  registerButtonDisabled: {
    backgroundColor: colors.muted,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
  },
  termsContainer: {
    marginBottom: spacing.l,
  },
  termsText: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  termsLink: {
    color: colors.primary,
    fontWeight: typography.fontWeights.medium,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xs,
  },
  loginText: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  loginButtonText: {
    fontSize: typography.fontSizes.s,
    color: colors.primary,
    fontWeight: typography.fontWeights.semiBold,
  },
});

export default RegisterScreen; 