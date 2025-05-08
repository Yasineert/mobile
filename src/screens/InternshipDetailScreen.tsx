import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Share,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import Header from '../components/Header';
import Button from '../components/Button';
import { Internship } from '../components/InternshipCard';

interface InternshipDetailScreenProps {
  route: {
    params: {
      internship: Internship;
    };
  };
  navigation: any;
}

const InternshipDetailScreen = ({ route, navigation }: InternshipDetailScreenProps) => {
  const { internship } = route.params;
  const [isSaved, setIsSaved] = useState(false);

  // Additional mock data for the internship detail
  const internshipDetails = {
    description: `Nous recherchons un(e) ${internship.title} motivé(e) pour rejoindre notre équipe dynamique. Vous serez responsable de développer et maintenir des applications web et mobiles pour le ministère, en travaillant en étroite collaboration avec les équipes pédagogiques et administratives.`,
    responsibilities: [
      'Développer des fonctionnalités front-end interactives',
      'Optimiser les applications pour une performance maximale',
      'Collaborer avec les designers et les développeurs back-end',
      'Participer aux réunions de planification et aux revues de code',
      'Rester à jour sur les nouvelles technologies et les meilleures pratiques',
    ],
    requirements: [
      'Étudiant en informatique, développement web ou domaine connexe',
      'Connaissance des langages et frameworks modernes',
      'Passion pour le développement de logiciels de qualité',
      'Esprit d\'équipe et bonnes compétences en communication',
      'Niveau d\'études : Bac+3 minimum',
    ],
    benefits: [
      'Indemnité de stage attractive',
      'Possibilité d\'embauche à l\'issue du stage',
      'Environnement de travail stimulant',
      'Formation continue et mentorat',
      'Horaires flexibles',
    ],
    applicationDeadline: '30 Juin 2023',
    contactPerson: 'Hamza Aglagal',
    contactEmail: 'recrutement@education.gov.ma',
    contactPhone: '+212 5XX-XXXXXX',
    companyAddress: '3 Avenue Mohammed V, Rabat 10000, Maroc',
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case 'internship':
        return 'Stage';
      case 'apprenticeship':
        return 'Alternance';
      case 'partTime':
        return 'Temps partiel';
      case 'fullTime':
        return 'Temps plein';
      default:
        return type;
    }
  };

  const handleSharePress = async () => {
    try {
      await Share.share({
        message: `Découvrez cette offre: ${internship.title} chez ${internship.company} à ${internship.location}. Postulez maintenant sur JobBridge!`,
        title: 'Partager cette offre',
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager l\'offre');
    }
  };

  const handleSavePress = () => {
    setIsSaved(!isSaved);
    Alert.alert(
      isSaved ? 'Offre retirée' : 'Offre sauvegardée',
      isSaved
        ? 'L\'offre a été retirée de vos favoris'
        : 'L\'offre a été ajoutée à vos favoris'
    );
  };

  const handleApplyPress = () => {
    navigation.navigate('ApplyForm', { internship });
  };

  const logoComponent = internship.logo ? (
    <Image source={{ uri: internship.logo }} style={styles.logo} />
  ) : (
    <View style={styles.logoPlaceholder}>
      <Text style={styles.logoPlaceholderText}>{internship.company.charAt(0)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Détails du stage"
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
        rightIcon={<Text style={styles.headerIcon}>⋯</Text>}
        onRightPress={() => Alert.alert('Options', 'Options supplémentaires')}
      />

      <ScrollView style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          {logoComponent}
          <Text style={styles.title}>{internship.title}</Text>
          <Text style={styles.company}>{internship.company}</Text>
          <View style={styles.detailsRow}>
            <Text style={styles.detailText}>📍 {internship.location}</Text>
            <Text style={styles.detailText}>⏱️ {internship.duration}</Text>
            <Text style={styles.detailText}>
              📄 {getContractTypeLabel(internship.contractType)}
            </Text>
          </View>
          <Text style={styles.postedDate}>Publié {internship.postedDate}</Text>

          <View style={styles.actionsRow}>
            <Button
              title="Postuler"
              onPress={handleApplyPress}
              style={styles.applyButton}
            />
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSavePress}
            >
              <Text style={styles.iconButtonText}>{isSaved ? '★' : '☆'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleSharePress}
            >
              <Text style={styles.iconButtonText}>↗</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description du poste</Text>
          <Text style={styles.descriptionText}>{internshipDetails.description}</Text>
        </View>

        {/* Responsibilities Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Responsabilités</Text>
          {internshipDetails.responsibilities.map((responsibility, index) => (
            <View key={`resp-${index}`} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>{responsibility}</Text>
            </View>
          ))}
        </View>

        {/* Requirements Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prérequis</Text>
          {internshipDetails.requirements.map((requirement, index) => (
            <View key={`req-${index}`} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>{requirement}</Text>
            </View>
          ))}
        </View>

        {/* Benefits Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avantages</Text>
          {internshipDetails.benefits.map((benefit, index) => (
            <View key={`ben-${index}`} style={styles.bulletItem}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.bulletText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Application Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations complémentaires</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Date limite de candidature:</Text>
            <Text style={styles.infoValue}>{internshipDetails.applicationDeadline}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Personne à contacter:</Text>
            <Text style={styles.infoValue}>{internshipDetails.contactPerson}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{internshipDetails.contactEmail}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Téléphone:</Text>
            <Text style={styles.infoValue}>{internshipDetails.contactPhone}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Adresse:</Text>
            <Text style={styles.infoValue}>{internshipDetails.companyAddress}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Button
          title="Postuler maintenant"
          onPress={handleApplyPress}
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  headerSection: {
    backgroundColor: colors.white,
    padding: spacing.l,
    alignItems: 'center',
    ...shadows.small,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.m,
    marginBottom: spacing.m,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.m,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  logoPlaceholderText: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.white,
  },
  title: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  company: {
    fontSize: typography.fontSizes.l,
    color: colors.textSecondary,
    marginBottom: spacing.m,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.s,
  },
  detailText: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginHorizontal: spacing.s,
    marginBottom: spacing.s,
  },
  postedDate: {
    fontSize: typography.fontSizes.s,
    color: colors.muted,
    marginBottom: spacing.m,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  applyButton: {
    flex: 1,
    marginRight: spacing.s,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.m,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.s,
    ...shadows.small,
  },
  iconButtonText: {
    fontSize: typography.fontSizes.l,
  },
  section: {
    backgroundColor: colors.white,
    padding: spacing.l,
    marginTop: spacing.m,
    ...shadows.small,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    marginBottom: spacing.m,
  },
  descriptionText: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
    lineHeight: typography.lineHeights.m,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  bulletPoint: {
    fontSize: typography.fontSizes.m,
    color: colors.primary,
    marginRight: spacing.s,
    width: 15,
  },
  bulletText: {
    flex: 1,
    fontSize: typography.fontSizes.m,
    color: colors.text,
    lineHeight: typography.lineHeights.m,
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: spacing.s,
  },
  infoLabel: {
    width: '40%',
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.medium,
    color: colors.text,
  },
  infoValue: {
    flex: 1,
    fontSize: typography.fontSizes.m,
    color: colors.text,
  },
  bottomBar: {
    backgroundColor: colors.white,
    padding: spacing.m,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  headerIcon: {
    fontSize: typography.fontSizes.xl,
    color: colors.white,
  },
});

export default InternshipDetailScreen; 