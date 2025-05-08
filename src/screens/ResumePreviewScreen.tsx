import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { colors, spacing, typography, borderRadius, shadows } from '../theme/theme';
import Header from '../components/Header';
import StyledCard from '../components/StyledCard';

interface ResumePreviewScreenProps {
  navigation: any;
}

// Mock resume data
const RESUME_DATA = {
  personalInfo: {
    name: 'Aglagal Hamza',
    title: 'Développeur Frontend',
    email: 'Hamza.Aglagal@gmail.com',
    phone: '+212 612 345 678',
    location: 'Rabat, Maroc',
  },
  education: [
    {
      id: '1',
      degree: 'Licence en Informatique',
      school: 'Université Mohammed V',
      location: 'Rabat',
      startDate: '2019',
      endDate: '2022',
    },
  ],
  experience: [
    {
      id: '1',
      position: 'Développeur Frontend Stagiaire',
      company: 'Tech Solutions Maroc',
      location: 'Casablanca',
      startDate: 'Jan 2022',
      endDate: 'Juin 2022',
      description: 'Développement d\'interfaces utilisateur réactives avec React.js et React Native.',
    },
  ],
  skills: [
    'JavaScript',
    'React.js',
    'React Native',
    'HTML/CSS',
    'Node.js',
    'Git',
  ],
  languages: [
    { language: 'Arabe', level: 'Natif' },
    { language: 'Français', level: 'Courant' },
    { language: 'Anglais', level: 'Intermédiaire' },
  ],
  lastUpdated: '15/06/2023',
};

const ResumePreviewScreen = ({ navigation }: ResumePreviewScreenProps) => {
  const [resumeData, setResumeData] = useState(RESUME_DATA);
  
  const handleEditResume = () => {
    navigation.navigate('EditResume', { resumeData });
  };
  
  const handleDownload = () => {
    Alert.alert(
      'Téléchargement',
      'Votre CV a été enregistré dans vos documents.',
    );
  };
  
  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Voici mon CV professionnel',
        title: `CV - ${resumeData.personalInfo.name}`,
      });
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le CV.');
    }
  };

  const renderSection = (title: string, content: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {content}
    </View>
  );
  
  const renderExperience = (experience: any) => (
    <View key={experience.id} style={styles.entryContainer}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{experience.position}</Text>
        <Text style={styles.entryDate}>{experience.startDate} - {experience.endDate}</Text>
      </View>
      <Text style={styles.entrySubtitle}>{experience.company}, {experience.location}</Text>
      <Text style={styles.entryDescription}>{experience.description}</Text>
    </View>
  );
  
  const renderEducation = (education: any) => (
    <View key={education.id} style={styles.entryContainer}>
      <View style={styles.entryHeader}>
        <Text style={styles.entryTitle}>{education.degree}</Text>
        <Text style={styles.entryDate}>{education.startDate} - {education.endDate}</Text>
      </View>
      <Text style={styles.entrySubtitle}>{education.school}, {education.location}</Text>
    </View>
  );
  
  const renderSkills = (skills: string[]) => (
    <View style={styles.skillsContainer}>
      {skills.map((skill, index) => (
        <View key={index} style={styles.skillBadge}>
          <Text style={styles.skillText}>{skill}</Text>
        </View>
      ))}
    </View>
  );
  
  const renderLanguages = (languages: any[]) => (
    <View style={styles.languagesContainer}>
      {languages.map((lang, index) => (
        <View key={index} style={styles.languageItem}>
          <Text style={styles.languageName}>{lang.language}</Text>
          <Text style={styles.languageLevel}>{lang.level}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Aperçu du CV"
        leftIcon={<Text style={styles.headerIcon}>←</Text>}
        onLeftPress={() => navigation.goBack()}
      />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <StyledCard variant="gradient" style={styles.resumeHeader}>
          <Text style={styles.name}>{resumeData.personalInfo.name}</Text>
          <Text style={styles.title}>{resumeData.personalInfo.title}</Text>
          <View style={styles.contactInfo}>
            <Text style={styles.contactItem}>📧 {resumeData.personalInfo.email}</Text>
            <Text style={styles.contactItem}>📱 {resumeData.personalInfo.phone}</Text>
            <Text style={styles.contactItem}>📍 {resumeData.personalInfo.location}</Text>
          </View>
          <Text style={styles.lastUpdated}>Dernière mise à jour: {resumeData.lastUpdated}</Text>
        </StyledCard>
        
        <StyledCard variant="elevated" style={styles.resumeContent}>
          {renderSection(
            'Expérience professionnelle',
            resumeData.experience.map(renderExperience)
          )}
          
          {renderSection(
            'Formation',
            resumeData.education.map(renderEducation)
          )}
          
          {renderSection(
            'Compétences',
            renderSkills(resumeData.skills)
          )}
          
          {renderSection(
            'Langues',
            renderLanguages(resumeData.languages)
          )}
        </StyledCard>
        
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={handleEditResume}
          >
            <Text style={styles.actionButtonText}>Modifier</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.downloadButton]}
            onPress={handleDownload}
          >
            <Text style={styles.actionButtonText}>Télécharger</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.shareButton]}
            onPress={handleShare}
          >
            <Text style={styles.actionButtonText}>Partager</Text>
          </TouchableOpacity>
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
  headerIcon: {
    fontSize: typography.fontSizes.xl,
    color: colors.white,
  },
  scrollView: {
    flex: 1,
    padding: spacing.m,
  },
  resumeHeader: {
    padding: spacing.m,
    marginBottom: spacing.m,
    alignItems: 'center',
  },
  name: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  title: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.medium,
    color: colors.textSecondary,
    marginBottom: spacing.m,
    textAlign: 'center',
  },
  contactInfo: {
    width: '100%',
    marginBottom: spacing.m,
  },
  contactItem: {
    fontSize: typography.fontSizes.m,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  lastUpdated: {
    fontSize: typography.fontSizes.xs,
    color: colors.textSecondary,
    textAlign: 'right',
    width: '100%',
  },
  resumeContent: {
    padding: spacing.m,
    marginBottom: spacing.m,
  },
  section: {
    marginBottom: spacing.l,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.l,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.primary,
    marginBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
  },
  entryContainer: {
    marginBottom: spacing.m,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  entryTitle: {
    fontSize: typography.fontSizes.m,
    fontWeight: typography.fontWeights.semiBold,
    color: colors.text,
    flex: 1,
  },
  entryDate: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  entrySubtitle: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  entryDescription: {
    fontSize: typography.fontSizes.s,
    color: colors.text,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillBadge: {
    backgroundColor: `${colors.primary}15`,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.s,
    borderRadius: borderRadius.m,
    margin: spacing.xs,
  },
  skillText: {
    color: colors.primary,
    fontSize: typography.fontSizes.s,
    fontWeight: typography.fontWeights.medium,
  },
  languagesContainer: {
    marginTop: spacing.s,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.s,
  },
  languageName: {
    fontSize: typography.fontSizes.s,
    color: colors.text,
    fontWeight: typography.fontWeights.medium,
  },
  languageLevel: {
    fontSize: typography.fontSizes.s,
    color: colors.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.l,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.m,
    borderRadius: borderRadius.m,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
    ...shadows.small,
  },
  editButton: {
    backgroundColor: colors.primary,
  },
  downloadButton: {
    backgroundColor: colors.info,
  },
  shareButton: {
    backgroundColor: colors.success,
  },
  actionButtonText: {
    color: colors.white,
    fontSize: typography.fontSizes.s,
    fontWeight: typography.fontWeights.semiBold,
  },
});

export default ResumePreviewScreen; 