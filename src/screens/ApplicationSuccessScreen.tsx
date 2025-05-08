import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colors, spacing, typography, shadows } from '../theme/theme';
import Button from '../components/Button';
import { Internship } from '../components/InternshipCard';

interface ApplicationSuccessScreenProps {
  route: {
    params: {
      internship: Internship;
    };
  };
  navigation: any;
}

const ApplicationSuccessScreen = ({
  route,
  navigation,
}: ApplicationSuccessScreenProps) => {
  const { internship } = route.params;

  const handleViewApplications = () => {
    navigation.navigate('MyApplications');
  };

  const handleSearchMore = () => {
    navigation.navigate('Home');
  };

  const getRandomTips = () => {
    const tips = [
      "Préparez-vous aux entretiens en recherchant des informations sur l'entreprise.",
      "Mettez à jour votre profil et vos compétences régulièrement pour attirer l'attention des recruteurs.",
      "Suivez l'état de vos candidatures dans la section 'Mes candidatures'.",
      "Activez les notifications pour être informé rapidement des réponses des recruteurs.",
      "Personnalisez votre lettre de motivation pour chaque poste auquel vous postulez.",
    ];
    
    // Return 3 random tips
    return tips
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  const tips = getRandomTips();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.successIconContainer}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        
        <Text style={styles.title}>Candidature envoyée !</Text>
        
        <Text style={styles.subtitle}>
          Votre candidature pour le poste de {internship.title} chez{' '}
          {internship.company} a été envoyée avec succès.
        </Text>
        
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Poste</Text>
            <Text style={styles.infoValue}>{internship.title}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Entreprise</Text>
            <Text style={styles.infoValue}>{internship.company}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Lieu</Text>
            <Text style={styles.infoValue}>{internship.location}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date de candidature</Text>
            <Text style={styles.infoValue}>{new Date().toLocaleDateString()}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Statut</Text>
            <View style={styles.statusContainer}>
              <Text style={styles.statusText}>En attente</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>Conseils pour la suite</Text>
          
          {tips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Voir mes candidatures"
            onPress={handleViewApplications}
            style={styles.viewApplicationsButton}
          />
          
          <Button
            title="Chercher d'autres offres"
            variant="outline"
            onPress={handleSearchMore}
            style={styles.searchMoreButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.l,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.success,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xl,
    ...shadows.medium,
  },
  successIcon: {
    fontSize: 50,
    color: colors.white,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.l,
    width: '100%',
    marginBottom: spacing.l,
    ...shadows.small,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: spacing.m,
  },
  infoLabel: {
    width: '40%',
    fontSize: typography.fontSizes.m,
    color: colors.textSecondary,
  },
  infoValue: {
    flex: 1,
    fontSize: typography.fontSizes.m,
    color: colors.text,
    fontWeight: typography.fontWeights.medium,
  },
  statusContainer: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.xs,
    borderRadius: 20,
  },
  statusText: {
    fontSize: typography.fontSizes.s,
    color: colors.white,
    fontWeight: typography.fontWeights.medium,
  },
  tipsContainer: {
    backgroundColor: colors.white,
    borderRadius: 8,
    padding: spacing.l,
    width: '100%',
    marginBottom: spacing.xl,
    ...shadows.small,
  },
  tipsTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.m,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: spacing.m,
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: typography.fontSizes.l,
    marginRight: spacing.s,
    width: 30,
  },
  tipText: {
    flex: 1,
    fontSize: typography.fontSizes.m,
    color: colors.text,
    lineHeight: typography.lineHeights.m,
  },
  actionsContainer: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  viewApplicationsButton: {
    marginBottom: spacing.m,
  },
  searchMoreButton: {},
});

export default ApplicationSuccessScreen; 