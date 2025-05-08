import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import Header from '../components/Header';
import Input from '../components/Input';
import StyledCard from '../components/StyledCard';

interface EditProfileScreenProps {
  navigation: any;
  route: any;
}

const EditProfileScreen = ({ navigation, route }: EditProfileScreenProps) => {
  const user = route.params?.user || null;
  
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [education, setEducation] = useState(user?.education || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSaveProfile = () => {
    if (fullName.trim() === '' || email.trim() === '') {
      Alert.alert('Erreur', 'Le nom et l\'email sont obligatoires.');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Show success message
      Alert.alert(
        'Profil mis à jour',
        'Vos informations ont été mises à jour avec succès.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 1500);
  };
  
  const handleChooseAvatar = () => {
    // This would open an image picker in a real app
    Alert.alert(
      'Changer la photo',
      'Cette fonctionnalité sera disponible prochainement.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Modifier le profil"
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
          <StyledCard variant="elevated" style={styles.avatarCard}>
            <View style={styles.avatarContainer}>
              <Image 
                source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }} 
                style={styles.avatar}
              />
              <TouchableOpacity 
                style={styles.changeAvatarButton}
                onPress={handleChooseAvatar}
              >
                <Text style={styles.changeAvatarText}>Changer la photo</Text>
              </TouchableOpacity>
            </View>
          </StyledCard>
          
          <StyledCard variant="elevated" style={styles.formCard}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Informations personnelles</Text>
              
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
                label="Téléphone"
                placeholder="Entrez votre numéro de téléphone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                icon={<Text>📱</Text>}
              />
              
              <Input
                label="Localisation"
                placeholder="Ville, Pays"
                value={location}
                onChangeText={setLocation}
                icon={<Text>📍</Text>}
              />
            </View>
            
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Formation et compétences</Text>
              
              <Input
                label="Formation"
                placeholder="Votre niveau d'études ou formation"
                value={education}
                onChangeText={setEducation}
                icon={<Text>🎓</Text>}
              />
              
              <Input
                label="Bio"
                placeholder="Parlez un peu de vous et de vos objectifs professionnels"
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={4}
                style={styles.bioInput}
                icon={<Text>📝</Text>}
              />
            </View>
          </StyledCard>
          
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSaveProfile}
            disabled={isLoading}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Text>
          </TouchableOpacity>
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
    paddingBottom: 50,
  },
  avatarCard: {
    marginBottom: spacing.m,
    padding: spacing.m,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
    marginBottom: spacing.m,
  },
  changeAvatarButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    borderRadius: borderRadius.m,
  },
  changeAvatarText: {
    color: colors.white,
    fontSize: typography.fontSizes.s,
    fontWeight: typography.fontWeights.medium,
  },
  formCard: {
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  formSection: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.m,
  },
  bioInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    marginBottom: spacing.l,
    ...shadows.medium,
  },
  saveButtonDisabled: {
    backgroundColor: colors.muted,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
  },
});

export default EditProfileScreen; 